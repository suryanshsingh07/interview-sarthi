import { Outlet, Navigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { motion } from 'framer-motion';

export default function AuthLayout() {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* Form Side */}
      <div className="flex flex-col justify-center px-8 sm:px-16 md:px-24 xl:px-32 relative z-10 bg-background/80 backdrop-blur-3xl">
        <div className="absolute top-8 left-8">
          <span className="font-bold text-2xl tracking-tight">Interview<span className="text-primary">IQ</span></span>
        </div>
        <Outlet />
      </div>

      {/* Visual Side */}
      <div className="hidden lg:flex flex-col justify-center p-12 relative overflow-hidden bg-muted/20">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-blue-500/10 to-transparent mix-blend-multiply dark:mix-blend-screen"></div>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/30 rounded-full blur-[100px]"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/30 rounded-full blur-[100px]"></div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-lg mx-auto"
        >
          <div className="glass-card p-8 rounded-2xl shadow-2xl border border-white/20">
            <h2 className="text-3xl font-bold mb-4">Master Your Next Interview</h2>
            <p className="text-muted-foreground mb-8 text-lg">
              Join thousands of developers landing their dream roles at top tech companies using our AI-powered practice platform.
            </p>
            <div className="space-y-4">
              {[
                { label: 'Realistic AI Recruiter', value: 'Gemini 2.5 Flash' },
                { label: 'Languages Supported', value: '23+ Indian Languages' },
                { label: 'Evaluation Metrics', value: 'STAR Method & More' }
              ].map((stat, i) => (
                <div key={i} className="flex justify-between items-center p-4 rounded-xl bg-background/50 border border-border">
                  <span className="text-muted-foreground font-medium">{stat.label}</span>
                  <span className="font-bold text-primary">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
