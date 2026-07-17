import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Sparkles, Target, Mic, BarChart3, Bot, Globe, 
  CheckCircle2, Users, Medal, Briefcase, FileText, Code, ChevronRight,
  Star
} from 'lucide-react';

export default function LandingPage() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const stagger = {
    visible: { transition: { staggerChildren: 0.1 } }
  };

  return (
    <div className="overflow-hidden bg-background">
      {/* Top Banner */}
      <div className="bg-[#0B1331] text-white text-center py-2.5 px-4 text-sm font-medium relative z-50 flex items-center justify-center gap-4">
        <span>Monsoon Sale! Let Confidence Rain with <span className="font-bold text-primary">6% Off</span>. Code: MONSOON6</span>
        <Link to="/register">
          <button className="bg-white/10 hover:bg-white/20 transition-colors px-3 py-1 rounded-md text-xs font-semibold">
            Claim Offer
          </button>
        </Link>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col items-center pt-20 pb-32">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -z-10 mix-blend-multiply dark:mix-blend-screen"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] -z-10 mix-blend-multiply dark:mix-blend-screen"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative w-full">
          <div className="text-center max-w-4xl mx-auto flex flex-col items-center">
            
            <motion.div 
              initial="hidden" animate="visible" variants={fadeInUp}
              className="mb-6 flex w-fit gap-2 rounded-md border border-primary/30 bg-primary/5 px-4 py-2 text-sm font-bold shadow-md items-center text-primary"
            >
              <Medal size={18} />
              <span>#1 Patented AI Interview Preparation Platform</span>
            </motion.div>
            
            <motion.h1 
              initial="hidden" animate="visible" variants={fadeInUp}
              className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1]"
            >
              Turn Your Next Interview Into a <br className="hidden md:block"/>
              <span className="text-primary">Job Offer</span>
            </motion.h1>
            
            <motion.p 
              initial="hidden" animate="visible" variants={fadeInUp}
              className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed"
            >
              Get hired faster with AI mock interviews powered by Gemini 2.5 Flash, 1:1 live coaching simulations, and personalized feedback in 23+ Indian languages.
            </motion.p>

            <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="w-full max-w-2xl mx-auto bg-card border border-border shadow-2xl rounded-2xl p-2 mb-16 flex items-center">
              <div className="flex-1 px-4 py-2 text-left text-muted-foreground border-r border-border hidden sm:block">
                I'm prepping for a role in...
              </div>
              <div className="flex-1 px-4">
                <input 
                  type="text" 
                  placeholder="e.g. Product Management, Frontend..." 
                  className="w-full bg-transparent outline-none py-2 text-foreground"
                />
              </div>
              <Link to="/register" className="shrink-0">
                <button className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity">
                  Start Prep <ArrowRight size={18}/>
                </button>
              </Link>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div 
              initial="hidden" animate="visible" variants={fadeInUp}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8 border-y border-border w-full max-w-4xl mx-auto"
            >
              <div className="flex flex-col items-center justify-center gap-2 border-r border-border last:border-0 md:last:border-r">
                <div className="flex -space-x-3 mb-1">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-muted flex items-center justify-center overflow-hidden">
                      <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="user" className="w-full h-full object-cover"/>
                    </div>
                  ))}
                </div>
                <p className="text-sm font-medium"><span className="font-bold">200K+</span> Success Stories</p>
              </div>
              <div className="flex flex-col items-center justify-center border-border md:border-r">
                <p className="text-2xl font-bold">23+</p>
                <p className="text-sm font-medium text-muted-foreground">Languages Supported</p>
              </div>
              <div className="flex flex-col items-center justify-center border-r border-border">
                <p className="text-2xl font-bold">4500+</p>
                <p className="text-sm font-medium text-muted-foreground">Topics Covered</p>
              </div>
              <div className="flex flex-col items-center justify-center">
                <div className="flex text-yellow-500 mb-1">
                  {[1,2,3,4,5].map(i => <Star key={i} size={20} fill="currentColor" />)}
                </div>
                <p className="text-sm font-medium"><span className="font-bold">4.8</span> Average Rating</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Grid Section */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Choose your preparation path</h2>
            <p className="text-lg text-muted-foreground">Tailored interview modules to ensure you succeed in your specific domain.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Highlighted Main Card */}
            <Link to="/register" className="lg:col-span-1 group relative h-full">
              <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative h-full flex flex-col justify-between bg-primary text-primary-foreground p-8 rounded-2xl shadow-xl overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                <div>
                  <div className="flex justify-between items-start mb-6 relative z-10">
                    <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                      <Users size={28} className="text-white" />
                    </div>
                    <div className="bg-white/20 px-3 py-1.5 rounded-full flex items-center gap-2 backdrop-blur-sm">
                      <Sparkles size={14} />
                      <span className="text-xs font-bold uppercase tracking-wider">Most Popular</span>
                    </div>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-4 relative z-10">AI Mock Interviews</h3>
                  <p className="text-primary-foreground/80 text-lg mb-6 relative z-10">
                    Experience a hyper-realistic interview environment powered by Gemini 2.5 Flash. Get evaluated instantly with the STAR method.
                  </p>
                  <ul className="space-y-3 mb-8 relative z-10">
                    {['Adaptive questioning', 'Real-time feedback', '23+ Indian Languages'].map((item, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <CheckCircle2 size={18} className="text-white" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <button className="bg-white text-primary w-full py-3.5 rounded-xl font-bold hover:bg-gray-100 transition-colors relative z-10">
                  Book AI Session
                </button>
              </div>
            </Link>

            {/* Smaller Cards Grid */}
            <div className="lg:col-span-2 grid sm:grid-cols-2 gap-6">
              {[
                { 
                  icon: <Briefcase size={24} className="text-blue-500" />, 
                  title: "LinkedIn Review", 
                  desc: "Polish your profile to impress recruiters.",
                  bg: "bg-blue-50 hover:bg-blue-500 hover:text-white",
                  border: "border-blue-200 hover:border-blue-500",
                  iconBg: "bg-blue-100",
                  textColor: "text-blue-900 group-hover:text-white",
                  descColor: "text-blue-700/70 group-hover:text-blue-100"
                },
                { 
                  icon: <Target size={24} className="text-green-500" />, 
                  title: "Executive C-roles", 
                  desc: "Expert-Led Sessions & Soundboarding for VPs, Directors.",
                  bg: "bg-green-50 hover:bg-green-500 hover:text-white",
                  border: "border-green-200 hover:border-green-500",
                  iconBg: "bg-green-100",
                  textColor: "text-green-900 group-hover:text-white",
                  descColor: "text-green-700/70 group-hover:text-green-100"
                },
                { 
                  icon: <FileText size={24} className="text-red-500" />, 
                  title: "Resume Writing", 
                  desc: "Build a job-winning resume with AI expert help.",
                  bg: "bg-red-50 hover:bg-red-500 hover:text-white",
                  border: "border-red-200 hover:border-red-500",
                  iconBg: "bg-red-100",
                  textColor: "text-red-900 group-hover:text-white",
                  descColor: "text-red-700/70 group-hover:text-red-100"
                },
                { 
                  icon: <Code size={24} className="text-orange-500" />, 
                  title: "1:1 Coding Rounds", 
                  desc: "Practice live coding rounds and get system design feedback.",
                  bg: "bg-orange-50 hover:bg-orange-500 hover:text-white",
                  border: "border-orange-200 hover:border-orange-500",
                  iconBg: "bg-orange-100",
                  textColor: "text-orange-900 group-hover:text-white",
                  descColor: "text-orange-700/70 group-hover:text-orange-100"
                }
              ].map((card, i) => (
                <Link to="/register" key={i} className={`group block p-6 rounded-2xl border transition-all duration-300 ${card.bg} ${card.border}`}>
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-colors ${card.iconBg} group-hover:bg-white/20`}>
                    {card.icon}
                  </div>
                  <h3 className={`text-xl font-bold mb-2 transition-colors ${card.textColor}`}>{card.title}</h3>
                  <p className={`transition-colors ${card.descColor}`}>{card.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Everything you need to <span className="text-primary">succeed</span></h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Stop practicing with static lists of questions. Experience true adaptive AI interviewing.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <Bot />, title: "Adaptive AI Engine", desc: "Our Gemini 2.5 powered AI doesn't just ask questions; it listens and generates dynamic follow-ups based on your answers." },
              { icon: <Globe />, title: "23+ Indian Languages", desc: "Interview comfortably in Hindi, Bengali, Tamil, Telugu, Marathi, and many more native Indian languages." },
              { icon: <Mic />, title: "Voice Mode", desc: "Speak naturally. Our speech-to-text and text-to-speech capabilities simulate a real face-to-face or phone interview." },
              { icon: <BarChart3 />, title: "STAR Method Scoring", desc: "Get evaluated on Situation, Task, Action, and Result formatting alongside Technical Accuracy and Confidence." },
              { icon: <Target />, title: "Resume Tailored", desc: "Upload your resume and get grilled on exactly what you claimed to know, just like a real recruiter would." },
              { icon: <CheckCircle2 />, title: "Actionable Feedback", desc: "Receive an exhaustive PDF report highlighting strengths, missing concepts, and a personalized learning roadmap." }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-8 rounded-2xl hover:border-primary/50 transition-colors group border border-border"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">How Interview Sarthi Works</h2>
            <p className="text-lg text-muted-foreground">Four simple steps to interview mastery.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Setup Profile", desc: "Upload your resume and select your target role & company." },
              { step: "02", title: "Select Language", desc: "Choose English or any of the 22+ supported Indian languages." },
              { step: "03", title: "Take Interview", desc: "Converse with our AI via text or voice in a realistic scenario." },
              { step: "04", title: "Get Feedback", desc: "Receive a detailed PDF report with Radar charts and a roadmap." }
            ].map((item, i) => (
              <div key={i} className="relative">
                {i < 3 && <div className="hidden md:block absolute top-12 left-1/2 w-full h-[2px] bg-border -z-10"></div>}
                <div className="bg-background w-24 h-24 rounded-full border-4 border-muted flex items-center justify-center text-3xl font-black text-primary/30 mx-auto mb-6 shadow-sm">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold mb-2 text-center">{item.title}</h3>
                <p className="text-muted-foreground text-center text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-background relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5"></div>
        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to crack your dream company?</h2>
          <p className="text-xl text-muted-foreground mb-10">Join thousands of developers landing their dream roles using our AI-powered practice platform.</p>
          <Link to="/register">
            <button className="bg-primary text-primary-foreground px-10 py-5 rounded-full font-bold text-lg flex items-center gap-2 mx-auto shadow-xl shadow-primary/25 hover:shadow-primary/40 transition-all hover:-translate-y-1">
              Start Your Free Interview <ArrowRight size={20} />
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
