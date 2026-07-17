import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import api from '../../lib/api';
import { Loader2, Settings2, Sparkles, Upload } from 'lucide-react';

export default function SetupInterview() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [languages, setLanguages] = useState([]);
  const [resumeData, setResumeData] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const { register, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      type: 'Technical',
      difficulty: 'Medium',
      experience: 'Fresher',
      jobRole: 'Frontend Developer',
      company: 'General',
      language: 'English',
      duration: 20
    }
  });

  const selectedType = watch('type');

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const { data } = await api.get('/ai/languages');
        setLanguages(data.data.languages || []);
      } catch (e) {
        console.error('Failed to load languages');
      }
    };
    fetchLanguages();
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('resume', file);

    try {
      setIsUploading(true);
      const { data } = await api.post('/upload/resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResumeData(data.data);
      // Try to auto-detect role from resume later, for now just show success
    } catch (error) {
      console.error('Upload failed', error);
      alert('Failed to upload resume. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const payload = { ...data, resumeData: resumeData ? { text: resumeData.text } : null };
      const response = await api.post('/interviews', payload);
      navigate(`/interview/${response.data.data.interview._id}`);
    } catch (error) {
      console.error('Failed to create interview', error);
      alert('Failed to start interview. Please check your connection.');
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <Settings2 className="text-primary" /> Customize Your Interview
        </h1>
        <p className="text-muted-foreground text-lg">Tailor the AI to simulate your exact target interview scenario.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <form id="setup-form" onSubmit={handleSubmit(onSubmit)} className="glass-card p-8 rounded-3xl space-y-6 border border-border">
            
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="font-semibold text-sm ml-1">Job Role</label>
                <input 
                  {...register('jobRole')}
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  placeholder="e.g. React Developer"
                />
              </div>

              <div className="space-y-2">
                <label className="font-semibold text-sm ml-1">Company (Optional)</label>
                <input 
                  {...register('company')}
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  placeholder="e.g. Google, TCS"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="font-semibold text-sm ml-1">Interview Type</label>
                <select {...register('type')} className="w-full bg-background border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none cursor-pointer">
                  <option value="Technical">Technical</option>
                  <option value="HR">HR / Behavioral</option>
                  <option value="Mixed">Mixed</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="font-semibold text-sm ml-1">Difficulty</label>
                <select {...register('difficulty')} className="w-full bg-background border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none cursor-pointer">
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="font-semibold text-sm ml-1">Your Experience Level</label>
                <select {...register('experience')} className="w-full bg-background border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none cursor-pointer">
                  <option value="Fresher">Fresher</option>
                  <option value="1 Year">1 Year</option>
                  <option value="2 Years">2 Years</option>
                  <option value="5 Years">5 Years</option>
                  <option value="10+ Years">10+ Years</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="font-semibold text-sm ml-1">Interview Language</label>
                <select {...register('language')} className="w-full bg-background border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none cursor-pointer">
                  <option value="English">English</option>
                  {languages.filter(l => l.name !== 'English').map(lang => (
                    <option key={lang.code} value={lang.name}>{lang.name} ({lang.nativeName})</option>
                  ))}
                </select>
              </div>
            </div>

          </form>
        </div>

        <div className="space-y-6">
          <div className="glass-card p-6 rounded-3xl border border-border">
            <h3 className="font-bold mb-4 flex items-center gap-2"><Upload size={18} className="text-primary"/> Resume Tailoring</h3>
            <p className="text-sm text-muted-foreground mb-4">Upload your resume to get personalized questions based on your specific projects and skills.</p>
            
            <div className="relative">
              <input 
                type="file" 
                onChange={handleFileUpload} 
                accept=".pdf,.doc,.docx,.txt"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={isUploading}
              />
              <div className={`border-2 border-dashed ${resumeData ? 'border-green-500 bg-green-500/10' : 'border-border hover:border-primary bg-background'} rounded-2xl p-6 text-center transition-colors`}>
                {isUploading ? (
                  <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                ) : resumeData ? (
                  <div className="text-green-500 font-medium">✓ Resume Uploaded</div>
                ) : (
                  <div>
                    <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                    <span className="text-sm font-medium">Click or drag file here</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="glass-card p-6 rounded-3xl border border-primary/30 bg-primary/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-[40px] -z-10"></div>
            <h3 className="font-bold mb-2 flex items-center gap-2"><Sparkles size={18} className="text-primary"/> Ready to begin?</h3>
            <p className="text-sm text-muted-foreground mb-6">Make sure you are in a quiet room and your microphone is working.</p>
            
            <button 
              form="setup-form"
              disabled={isLoading}
              type="submit"
              className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? <Loader2 className="animate-spin w-6 h-6" /> : 'Start Interview Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
