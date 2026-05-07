import { Link } from 'react-router-dom';
import { Bell, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import coactionLogo from '@/assets/coaction-logo.png';

const Header = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-blue-900 bg-gradient-to-r from-white via-blue-100 to-blue-950">
      <div className="w-full px-6 py-4">
        <div className="flex w-full items-center justify-between">
          <Link to="/" className="flex items-start gap-2">
            <img 
              src={coactionLogo} 
              alt="CO/ACTION AI Hub" 
              className="h-14 object-contain" 
              style={{ imageRendering: 'crisp-edges' }}
            />
          </Link>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-blue-100 hover:bg-white/10 hover:text-white"
              onClick={toggleTheme}
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
            <Button variant="ghost" size="icon" className="relative text-blue-100 hover:bg-white/10 hover:text-white">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </Button>
            <div className="ml-2 flex h-9 w-9 items-center justify-center rounded-full bg-white text-blue-950 font-semibold text-sm">
              JS
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
