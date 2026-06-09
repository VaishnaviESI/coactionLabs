import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
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

const TOKEN_KEY = 'auth_token';
const ID_TOKEN_KEY = 'okta_id_token';

type OktaConfigResponse = {
  clientId?: string;
  issuer?: string;
  domain?: string;
  redirectUri?: string;
  disabled?: boolean;
  useLocalAuth?: boolean;
  postLogoutRedirectUri?: string;
};

const parseDisplayName = (email: string, name?: string) => {
  if (name) {
    return name;
  }

  return email.includes('@') ? email.split('@')[0] : 'User';
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const loginWithOkta = async () => {
    logOktaEvent('okta:login-requested');

    const response = await fetch('/api/auth/config');
    if (!response.ok) {
      logOktaEvent('okta:config-fetch-error', { status: response.status });
      throw new Error('Unable to fetch Okta configuration.');
    }

    const config = (await response.json()) as OktaConfigResponse;
    logOktaEvent('okta:config-fetched', {
      disabled: Boolean(config.disabled),
      hasClientId: Boolean(config.clientId),
      hasIssuer: Boolean(config.issuer),
    });

    if (config.disabled || config.useLocalAuth) {
      logOktaEvent('okta:disabled-in-config');
      return;
    }

    if (!config.clientId || !config.issuer || !config.redirectUri) {
      logOktaEvent('okta:config-invalid', {
        hasClientId: Boolean(config.clientId),
        hasIssuer: Boolean(config.issuer),
        hasRedirectUri: Boolean(config.redirectUri),
      });
      throw new Error('Okta config is missing required fields.');
    }

    const state = window.crypto?.randomUUID?.() ?? `${Date.now()}`;
    window.sessionStorage.setItem('okta_oauth_state', state);

    const authorizeUrl = new URL(
      config.issuer.includes('/oauth2/')
        ? `${config.issuer}/v1/authorize`
        : `${config.issuer}/oauth2/v1/authorize`,
    );
    authorizeUrl.searchParams.set('client_id', config.clientId);
    authorizeUrl.searchParams.set('response_type', 'code');
    authorizeUrl.searchParams.set('scope', 'openid profile email');
    authorizeUrl.searchParams.set('redirect_uri', config.redirectUri);
    authorizeUrl.searchParams.set('state', state);

    logOktaEvent('okta:authorize-redirect', { url: authorizeUrl.toString() });
    window.location.assign(authorizeUrl.toString());
  };

  const logout = async () => {
    logOktaEvent('okta:logout-requested');
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.removeItem(ID_TOKEN_KEY);
    setUser(null);
    resetUser();
    logOktaEvent('okta:logout-local-cleared');
  };

  useEffect(() => {
    const initUser = async () => {
      setLoading(true);

      const url = new URL(window.location.href);
      const tokenFromQuery = url.searchParams.get('token');
      const idTokenFromQuery = url.searchParams.get('id_token');
      const authError = url.searchParams.get('error');

      if (authError) {
        logOktaEvent('okta:callback-error', { error: authError });
      }

      if (tokenFromQuery) {
        window.localStorage.setItem(TOKEN_KEY, tokenFromQuery);
        logOktaEvent('okta:token-stored-from-query');
      }

      if (idTokenFromQuery) {
        window.localStorage.setItem(ID_TOKEN_KEY, idTokenFromQuery);
        logOktaEvent('okta:id-token-stored-from-query');
      }

      if (tokenFromQuery || idTokenFromQuery || authError) {
        url.searchParams.delete('token');
        url.searchParams.delete('id_token');
        url.searchParams.delete('error');
        window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
      }

      const token = window.localStorage.getItem(TOKEN_KEY);
      if (!token) {
        setUser(null);
        logOktaEvent('okta:user-cleared');
        setLoading(false);
        return;
      }

      try {
        const meResponse = await fetch('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!meResponse.ok) {
          logOktaEvent('okta:me-fetch-failed', { status: meResponse.status });
          window.localStorage.removeItem(TOKEN_KEY);
          window.localStorage.removeItem(ID_TOKEN_KEY);
          setUser(null);
          setLoading(false);
          return;
        }

        const mePayload = (await meResponse.json()) as {
          user?: {
            user_id?: string;
            email?: string;
            username?: string;
            name?: string;
            role?: string;
            sub?: string;
          };
        };

        const meUser = mePayload.user;
        const email = meUser?.email || meUser?.username || '';
        const displayName = parseDisplayName(email, meUser?.name);
        const role = (meUser?.role || 'VIEWER').toUpperCase();

        setUser({
          id: meUser?.user_id || meUser?.sub || email || 'unknown',
          name: displayName,
          email,
          isAdmin: role === 'ADMIN',
        });

        identify(meUser?.user_id || meUser?.sub || email || 'unknown', {
          role,
          isAdmin: role === 'ADMIN',
        });

        logOktaEvent('okta:user-loaded', {
          email,
          role,
          isAdmin: role === 'ADMIN',
        });
      } catch (error) {
        logOktaEvent('okta:me-fetch-error', {
          message: error instanceof Error ? error.message : 'Unknown error',
        });
        window.localStorage.removeItem(TOKEN_KEY);
        window.localStorage.removeItem(ID_TOKEN_KEY);
        setUser(null);
      }

      setLoading(false);
    };

    initUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin: user?.isAdmin || false,
        isAuthenticated: Boolean(user),
        loading,
        loginWithOkta,
        logout,
      }}
    >
      {children}
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
