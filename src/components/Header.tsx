import { Link } from 'react-router-dom';
import { Bell, Moon, Sun, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import { useOktaAuth } from '@okta/okta-react';
import { useAuth } from '@/contexts/AuthContext';
import coactionLogo from '../assets/coaction-labs-ai-hub-logo.png';

const Header = () => {
  const { theme, setTheme } = useTheme();
  const { oktaAuth } = useOktaAuth();
  const { user, loading } = useAuth();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleLogout = async () => {
    await oktaAuth.signOut();
  };

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : 'U';

  return (
    <header className="sticky top-0 z-50 border-b border-blue-900 bg-gradient-to-r from-white via-blue-100 to-blue-950">
      <div className="w-full px-6 py-4">
        <div className="flex w-full items-center justify-between">
          <Link to="/" className="flex items-start gap-2">
            <div className="rounded-xl">
              <img
                src={coactionLogo}
                alt="CO/ACTION AI Hub"
                className="h-16 w-72 rounded-xl"
              />
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-blue-100 hover:bg-white/10 hover:text-white"
              onClick={toggleTheme}
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="relative text-blue-100 hover:bg-white/10 hover:text-white"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </Button>

            <div className="flex items-center gap-2 ml-2">
              {!loading && (
                <div className="text-right text-xs">
                  <div className="font-semibold text-blue-950">{user?.name || 'User'}</div>
                  <div className="text-blue-700 text-xs">{user?.email}</div>
                </div>
              )}
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-blue-950 font-semibold text-sm">
                {initials}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-blue-100 hover:bg-white/10 hover:text-white ml-1"
                onClick={handleLogout}
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
