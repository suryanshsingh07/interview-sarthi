import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Mail, Lock, User, ArrowRight } from 'lucide-react';
import useAuthStore from '../../store/authStore';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function Register() {
  const { register: registerUser, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema)
  });

  const onSubmit = async (data) => {
    setServerError('');
    const result = await registerUser(data.name, data.email, data.password);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setServerError(result.error || 'Failed to register');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-3 tracking-tight">Create an account</h1>
        <p className="text-muted-foreground text-lg">Start your AI-powered interview journey.</p>
      </div>

      <button className="w-full mb-6 glass flex items-center justify-center gap-3 py-3.5 rounded-xl border border-border hover:bg-muted/50 transition-colors font-medium">
        <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/><path d="M1 1h22v22H1z" fill="none"/></svg>
        Sign up with Google
      </button>

      <div className="relative mb-8 text-center">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border"></div></div>
        <span className="relative bg-background px-4 text-sm text-muted-foreground uppercase tracking-widest font-medium">Or register with email</span>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {serverError && <div className="p-4 bg-destructive/10 text-destructive border border-destructive/20 rounded-xl text-sm font-medium">{serverError}</div>}
        
        <div className="space-y-1.5">
          <label className="text-sm font-medium ml-1">Full Name</label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <input 
              {...register('name')}
              className={`w-full bg-background border ${errors.name ? 'border-destructive' : 'border-border'} rounded-xl px-11 py-3.5 outline-none focus:ring-2 focus:ring-primary/50 transition-all shadow-sm`}
              placeholder="John Doe"
            />
          </div>
          {errors.name && <p className="text-destructive text-sm mt-1 ml-1">{errors.name.message}</p>}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium ml-1">Email</label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <input 
              {...register('email')}
              className={`w-full bg-background border ${errors.email ? 'border-destructive' : 'border-border'} rounded-xl px-11 py-3.5 outline-none focus:ring-2 focus:ring-primary/50 transition-all shadow-sm`}
              placeholder="name@example.com"
            />
          </div>
          {errors.email && <p className="text-destructive text-sm mt-1 ml-1">{errors.email.message}</p>}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium ml-1">Password</label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <input 
              {...register('password')}
              type="password"
              className={`w-full bg-background border ${errors.password ? 'border-destructive' : 'border-border'} rounded-xl px-11 py-3.5 outline-none focus:ring-2 focus:ring-primary/50 transition-all shadow-sm`}
              placeholder="••••••••"
            />
          </div>
          {errors.password && <p className="text-destructive text-sm mt-1 ml-1">{errors.password.message}</p>}
        </div>

        <button 
          disabled={isLoading}
          type="submit"
          className="w-full bg-primary text-primary-foreground py-3.5 rounded-xl font-bold text-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-70 mt-4"
        >
          {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : <>Sign Up <ArrowRight className="w-5 h-5" /></>}
        </button>
      </form>

      <p className="mt-8 text-center text-muted-foreground">
        Already have an account? <Link to="/login" className="text-primary font-semibold hover:underline">Log in</Link>
      </p>
    </div>
  );
}
