import { Link } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import { LogIn, UserPlus, LogOut, LayoutDashboard, Moon, Sun, MessageSquare } from 'lucide-react';
import LanguageSelector from '../LanguageSelector';
import { useTheme } from '../ThemeProvider';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const { theme, setTheme } = useTheme();

  return (
    <nav className="sticky top-0 z-50 w-full glass border-b border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2">
              <img src="/favicon.ico" className="w-8 h-8 object-contain" />
              <span className="font-bold text-xl hidden sm:block">Interview Sarthi</span>
            </Link>
            
            <div className="hidden md:flex items-center gap-4 text-sm font-medium text-muted-foreground ml-4">
              <Link to="/contact" className="hover:text-primary transition-colors">Contact</Link>
              <Link to="/pricing" className="hover:text-primary transition-colors">Pricing</Link>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <LanguageSelector />

            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors border border-border"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {user ? (
              <div className="flex items-center gap-2 sm:gap-4">
                <Link to="/dashboard">
                  <button className="flex items-center gap-2 bg-primary/10 text-primary hover:bg-primary/20 px-3 py-2 rounded-lg font-medium transition-colors text-sm">
                    <LayoutDashboard size={16} /> <span className="hidden sm:inline">Dashboard</span>
                  </button>
                </Link>
                <button onClick={logout} className="p-2 text-muted-foreground hover:text-destructive transition-colors">
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <button className="hidden sm:flex items-center gap-2 text-muted-foreground hover:text-foreground font-medium px-3 py-2 text-sm transition-colors">
                    <LogIn size={16} /> Login
                  </button>
                </Link>
                <Link to="/register">
                  <button className="flex items-center gap-2 bg-primary text-primary-foreground hover:opacity-90 px-4 py-2 rounded-lg font-medium transition-opacity text-sm">
                    <UserPlus size={16} /> <span className="hidden sm:inline">Sign Up</span>
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
