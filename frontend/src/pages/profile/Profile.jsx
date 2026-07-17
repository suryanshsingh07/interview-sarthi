import { useState } from 'react';
import { useForm } from 'react-hook-form';
import useAuthStore from '../../store/authStore';
import api from '../../lib/api';
import { User, Mail, Briefcase, Code, Link as LinkIcon, Loader2 } from 'lucide-react';

export default function Profile() {
  const { user, checkAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const { register, handleSubmit } = useForm({
    defaultValues: {
      name: user?.name || '',
      targetRole: user?.targetRole || '',
      experience: user?.experience || 'Fresher',
      preferredLanguage: user?.preferredLanguage || 'English',
      githubUrl: user?.githubUrl || '',
      linkedinUrl: user?.linkedinUrl || ''
    }
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setSuccess('');
    try {
      await api.put('/auth/profile', data);
      await checkAuth(); // refresh user data
      setSuccess('Profile updated successfully!');
    } catch (error) {
      alert('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>

      <div className="glass-card rounded-3xl p-8 border border-border">
        <div className="flex items-center gap-6 mb-10">
          <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center text-primary text-3xl font-bold border-4 border-background shadow-xl">
            {user?.name?.charAt(0)}
          </div>
          <div>
            <h2 className="text-2xl font-bold">{user?.name}</h2>
            <p className="text-muted-foreground flex items-center gap-2 mt-1">
              <Mail size={16} /> {user?.email}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {success && (
            <div className="p-4 bg-green-500/10 text-green-500 border border-green-500/20 rounded-xl text-sm font-medium">
              {success}
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="font-medium text-sm ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <input 
                  {...register('name')}
                  className="w-full bg-background border border-border rounded-xl px-11 py-3 outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-medium text-sm ml-1">Target Role</label>
              <div className="relative">
                <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <input 
                  {...register('targetRole')}
                  className="w-full bg-background border border-border rounded-xl px-11 py-3 outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  placeholder="e.g. Frontend Developer"
                />
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="font-medium text-sm ml-1">Experience Level</label>
              <select 
                {...register('experience')}
                className="w-full bg-background border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              >
                <option value="Fresher">Fresher</option>
                <option value="1 Year">1 Year</option>
                <option value="2 Years">2 Years</option>
                <option value="5 Years">5 Years</option>
                <option value="10+ Years">10+ Years</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="font-medium text-sm ml-1">Preferred UI Language</label>
              <select 
                {...register('preferredLanguage')}
                className="w-full bg-background border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              >
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
                <option value="Bengali">Bengali</option>
              </select>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="font-medium text-sm ml-1">GitHub Profile</label>
              <div className="relative">
                <Code className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <input 
                  {...register('githubUrl')}
                  className="w-full bg-background border border-border rounded-xl px-11 py-3 outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  placeholder="https://github.com/username"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-medium text-sm ml-1">LinkedIn Profile</label>
              <div className="relative">
                <LinkIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <input 
                  {...register('linkedinUrl')}
                  className="w-full bg-background border border-border rounded-xl px-11 py-3 outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  placeholder="https://linkedin.com/in/username"
                />
              </div>
            </div>
          </div>

          <button 
            disabled={isLoading}
            type="submit"
            className="w-full sm:w-auto mt-6 bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
