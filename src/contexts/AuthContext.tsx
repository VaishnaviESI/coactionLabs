import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { useLocation } from 'react-router-dom';
import { useOktaAuth } from '@okta/okta-react';
import type { UserClaims } from '@okta/okta-auth-js';
import { logOktaEvent } from '@/lib/oktaDebug';
import { identify, resetUser } from '@/lib/analytics';

interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  isAuthenticated: boolean;
  loading: boolean;
  loginWithOkta: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const parseDisplayName = (email: string, name?: string) => {
  if (name) return name;
  return email.includes('@') ? email.split('@')[0] : 'User';
};

// Read an optional `admin` group or `role` claim from the Okta ID token.
const resolveIsAdmin = (claims: UserClaims | undefined): boolean => {
  if (!claims) return false;
  const groups = (claims as UserClaims & { groups?: string[] }).groups;
  if (Array.isArray(groups) && groups.some((g) => g.toLowerCase() === 'admin')) {
    return true;
  }
  const role = (claims as UserClaims & { role?: string }).role;
  return typeof role === 'string' && role.toUpperCase() === 'ADMIN';
};

// Paths that are allowed to render WITHOUT a signed-in Okta session. Visiting
// any other path while unauthenticated triggers an automatic redirect to Okta.
const PUBLIC_PATHS = new Set<string>(['/login', '/logout', '/login/callback']);

const isPublicPath = (pathname: string) => {
  if (PUBLIC_PATHS.has(pathname)) return true;
  // Allow any deeper /login/callback variants Okta may produce.
  return pathname.startsWith('/login/callback');
};

// Full-screen placeholder rendered INSTEAD of the labs application while the
// browser is being redirected to Okta. This guarantees no protected UI is
// ever painted for an unauthenticated user.
const AuthRedirectScreen = () => (
  <div className="flex min-h-screen items-center justify-center bg-background">
    <div className="flex flex-col items-center gap-3 text-muted-foreground">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-current border-t-transparent" />
      <p className="text-sm">Redirecting to sign in…</p>
    </div>
  </div>
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { oktaAuth, authState } = useOktaAuth();
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  // Prevent firing signInWithRedirect more than once per page lifecycle —
  // authState may briefly flip while tokens are being read from storage.
  const redirectingRef = useRef(false);

  const loginWithOkta = async () => {
    logOktaEvent('okta:login-requested');
    try {
      await oktaAuth.signInWithRedirect();
    } catch (error) {
      logOktaEvent('okta:signin-error', {
        message: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  };

  const logout = async () => {
    logOktaEvent('okta:logout-requested');
    try {
      // RP-initiated logout: clears local tokens AND sends the user to Okta's
      // /logout endpoint, then back to postLogoutRedirectUri.
      await oktaAuth.signOut();
      resetUser();
      logOktaEvent('okta:logout-complete');
    } catch (error) {
      logOktaEvent('okta:logout-error', {
        message: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  };

  useEffect(() => {
    // authState is null until the SDK has fully initialised.
    if (!authState) {
      setLoading(true);
      return;
    }

    if (!authState.isAuthenticated) {
      setUser(null);
      setLoading(false);
      logOktaEvent('okta:user-cleared');

      // Auto-kick the OIDC flow on any non-public route so the user never has
      // to click a "Sign in" button. Public paths (/login, /logout, the OAuth
      // callback) must render normally to avoid redirect loops.
      if (!isPublicPath(location.pathname) && !redirectingRef.current) {
        redirectingRef.current = true;
        const originalUri = `${location.pathname}${location.search}${location.hash}`;
        logOktaEvent('okta:auto-redirect', { originalUri });
        // Fire-and-forget — the browser is about to navigate to Okta.
        void oktaAuth.signInWithRedirect({ originalUri }).catch((error) => {
          redirectingRef.current = false;
          logOktaEvent('okta:auto-redirect-error', {
            message: error instanceof Error ? error.message : 'Unknown error',
          });
        });
      }
      return;
    }

    // Reset the guard once the user is authenticated again.
    redirectingRef.current = false;

    let cancelled = false;
    setLoading(true);

    (async () => {
      try {
        // Pull profile claims from the ID token / userinfo endpoint.
        const claims = await oktaAuth.getUser();
        if (cancelled) return;

        const email = claims.email ?? claims.preferred_username ?? '';
        const displayName = parseDisplayName(email, claims.name);
        const isAdmin = resolveIsAdmin(claims);
        const id = claims.sub || email || 'unknown';

        setUser({ id, name: displayName, email, isAdmin });

        identify(id, { role: isAdmin ? 'ADMIN' : 'VIEWER', isAdmin });

        logOktaEvent('okta:user-loaded', { email, isAdmin });
      } catch (error) {
        if (cancelled) return;
        logOktaEvent('okta:userinfo-error', {
          message: error instanceof Error ? error.message : 'Unknown error',
        });
        setUser(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [authState, oktaAuth, location.pathname, location.search, location.hash]);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      isAdmin: user?.isAdmin ?? false,
      isAuthenticated: Boolean(user) && Boolean(authState?.isAuthenticated),
      loading,
      loginWithOkta,
      logout,
    }),
    // loginWithOkta / logout close over oktaAuth, which is stable for the
    // lifetime of the Security provider.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, loading, authState?.isAuthenticated],
  );

  // Gate the entire labs application behind authentication. Public auth routes
  // (/login, /logout, /login/callback) must always render so the OIDC redirect
  // flow can complete; every other route renders ONLY once Okta reports the
  // user is authenticated. Until then we show the redirect placeholder while
  // the effect above sends the browser to Okta — so the labs UI never flashes
  // for unauthenticated users.
  const onPublicPath = isPublicPath(location.pathname);
  const canRenderApp = onPublicPath || Boolean(authState?.isAuthenticated);

  return (
    <AuthContext.Provider value={value}>
      {canRenderApp ? children : <AuthRedirectScreen />}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
