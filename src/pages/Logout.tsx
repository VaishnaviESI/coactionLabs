import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { logOktaEvent } from '@/lib/oktaDebug';
import coactionLogo from '../assets/coaction-logo-darkmode-transparent.png';

// Dedicated sign-out page. Mounted from any "Logout" link; on mount it kicks
// off Okta's RP-initiated logout, which clears tokens locally and redirects
// to Okta's /logout endpoint, which then redirects to postLogoutRedirectUri.
const Logout = () => {
  const { logout, isAuthenticated } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      logOktaEvent('okta:logout-page-mounted', { wasAuthenticated: isAuthenticated });
      try {
        await logout();
        // signOut() triggers a browser navigation; if we somehow get here,
        // surface a "signed out" state.
        if (!cancelled) setDone(true);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Sign-out failed.');
      }
    };

    run();
    return () => {
      cancelled = true;
    };
    // logout is stable for the lifetime of AuthProvider.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#0A1628] via-[#0B1F3F] to-[#0A1628]">
      <header className="w-full px-6 py-5">
        <Link to="/" className="inline-flex items-center" aria-label="CO/ACTION home">
          <img src={coactionLogo} alt="CO/ACTION" className="h-12 w-auto" />
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl shadow-blue-950/40 p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
              <LogOut className="h-7 w-7 text-slate-700" />
            </div>
          </div>

          {error ? (
            <>
              <h1 className="text-2xl font-semibold text-slate-900">Sign-out failed</h1>
              <p className="mt-2 text-sm text-red-600">{error}</p>
              <Button asChild className="mt-6 bg-blue-700 hover:bg-blue-800 text-white">
                <Link to="/">Return home</Link>
              </Button>
            </>
          ) : done ? (
            <>
              <h1 className="text-2xl font-semibold text-slate-900">You&apos;ve been signed out</h1>
              <p className="mt-2 text-sm text-slate-500">
                Your Okta session for this app has ended.
              </p>
              <Button asChild className="mt-6 bg-blue-700 hover:bg-blue-800 text-white">
                <Link to="/login">Sign in again</Link>
              </Button>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-semibold text-slate-900">Signing you out…</h1>
              <p className="mt-2 text-sm text-slate-500">
                Redirecting to Okta to end your session.
              </p>
            </>
          )}
        </div>
      </main>

      <footer className="px-6 py-4 text-center text-xs text-blue-200/70">
        © {new Date().getFullYear()} CO/ACTION Specialty Insurance
      </footer>
    </div>
  );
};

export default Logout;
