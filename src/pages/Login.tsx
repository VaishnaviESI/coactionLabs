import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LogIn, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { logOktaEvent } from '@/lib/oktaDebug';
import coactionLogo from '../assets/coaction-logo-darkmode-transparent.png';

// Dedicated sign-in page. Renders a CO/ACTION-branded card with a single
// "Sign in with Okta" button that initiates the OIDC authorization code +
// PKCE flow. On successful return from /login/callback the AuthProvider will
// hydrate the user and any consumer (e.g. <ProtectedRoute>) can redirect.
const Login = () => {
  const { isAuthenticated, loading, loginWithOkta } = useAuth();
  const location = useLocation() as { state?: { from?: string } };
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If they hit /login while already signed in, send them home.
  useEffect(() => {
    if (!loading && isAuthenticated) {
      const target = location.state?.from || '/';
      window.location.replace(target);
    }
  }, [isAuthenticated, loading, location.state]);

  const handleSignIn = async () => {
    setError(null);
    setSubmitting(true);
    logOktaEvent('okta:signin-clicked', { source: 'LoginPage' });
    try {
      await loginWithOkta();
      // Browser is about to navigate away to Okta — no further UI updates.
    } catch (err) {
      setSubmitting(false);
      setError(err instanceof Error ? err.message : 'Sign-in failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#0A1628] via-[#0B1F3F] to-[#0A1628]">
      <header className="w-full px-6 py-5">
        <Link to="/" className="inline-flex items-center" aria-label="CO/ACTION home">
          <img src={coactionLogo} alt="CO/ACTION" className="h-12 w-auto" />
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl shadow-blue-950/40 p-8">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 mb-4">
              <ShieldCheck className="h-7 w-7 text-blue-700" />
            </div>
            <h1 className="text-2xl font-semibold text-slate-900">Sign in to CO/ACTION Labs</h1>
            <p className="mt-2 text-sm text-slate-500">
              Authenticate with your Okta account to access the AI Hub.
            </p>
          </div>

          <div className="mt-8 space-y-4">
            <Button
              type="button"
              size="lg"
              className="w-full bg-blue-700 hover:bg-blue-800 text-white"
              onClick={handleSignIn}
              disabled={submitting || loading}
            >
              <LogIn className="h-4 w-4 mr-2" />
              {submitting ? 'Redirecting to Okta…' : 'Sign in with Okta'}
            </Button>

            {error && (
              <p role="alert" className="text-sm text-red-600 text-center">
                {error}
              </p>
            )}

            <p className="text-xs text-slate-400 text-center">
              You will be redirected to your organization&apos;s identity provider.
            </p>
          </div>
        </div>
      </main>

      <footer className="px-6 py-4 text-center text-xs text-blue-200/70">
        © {new Date().getFullYear()} CO/ACTION Specialty Insurance
      </footer>
    </div>
  );
};

export default Login;
