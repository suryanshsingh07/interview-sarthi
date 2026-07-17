import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import useAuthStore from '../store/authStore';
import { Bot, User as UserIcon } from 'lucide-react';

export default function Navbar() {
  const { isAuthenticated, user } = useAuthStore();

  return (
    <nav className="fixed top-0 w-full z-50 glass border-b border-white/10 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-primary/10 p-2 rounded-xl group-hover:bg-primary/20 transition-colors">
              <Bot className="w-8 h-8 text-primary" />
            </div>
            <span className="font-bold text-2xl tracking-tight">Interview<span className="text-primary">IQ</span></span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8 font-medium">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">How it Works</a>
            <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <Link to="/dashboard" className="flex items-center gap-3 bg-secondary/50 hover:bg-secondary px-4 py-2 rounded-full transition-all border border-border/50">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                  {user?.name?.charAt(0) || <UserIcon size={16} />}
                </div>
                <span className="font-medium hidden sm:block">Dashboard</span>
              </Link>
            ) : (
              <>
                <Link to="/login" className="hidden sm:block text-muted-foreground hover:text-foreground font-medium transition-colors">
                  Log in
                </Link>
                <Link to="/register">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-primary text-primary-foreground px-6 py-2.5 rounded-full font-medium shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all"
                  >
                    Start Free
                  </motion.button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
