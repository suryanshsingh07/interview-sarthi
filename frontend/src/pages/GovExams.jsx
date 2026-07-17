import { motion } from 'framer-motion';
import { BookOpen, Shield, Award, Users, ExternalLink, ArrowRight, Star, Zap, Target, Bell, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import useAuthStore from '../store/authStore';

// ─── EXAM DATA ────────────────────────────────────────────────────────────────
const EXAMS = [
  {
    id: 'upsc',
    title: 'UPSC Civil Services',
    icon: Shield,
    students: '45k+',
    color: 'from-amber-500 to-orange-600',
    desc: 'Mock interviews for IAS, IPS, and IFS with retired bureaucrats as AI personas.',
    tags: ['IAS', 'IPS', 'IFS'],
    officialUrl: 'https://upsc.gov.in',
    sarkariUrl: 'https://sarkariresult.com/upsc/',
    vacancies: '1206 Posts',
    deadline: 'Feb 2026',
  },
  {
    id: 'ssc',
    title: 'SSC CGL',
    icon: Users,
    students: '80k+',
    color: 'from-blue-500 to-indigo-600',
    desc: 'Comprehensive aptitude and interview prep for Staff Selection Commission.',
    tags: ['Group B', 'Group C'],
    officialUrl: 'https://ssc.nic.in',
    sarkariUrl: 'https://sarkariresult.com/ssc-cgl/',
    vacancies: '17727 Posts',
    deadline: 'Jul 2025',
  },
  {
    id: 'bank',
    title: 'IBPS PO / SBI PO',
    icon: Award,
    students: '65k+',
    color: 'from-emerald-500 to-teal-600',
    desc: 'Banking sector interview preparation covering economy and situational awareness.',
    tags: ['PO', 'SO', 'Clerk'],
    officialUrl: 'https://ibps.in',
    sarkariUrl: 'https://sarkariresult.com/ibps/',
    vacancies: '4736 Posts',
    deadline: 'Aug 2025',
  },
  {
    id: 'railway',
    title: 'RRB NTPC',
    icon: BookOpen,
    students: '50k+',
    color: 'from-purple-500 to-violet-600',
    desc: 'General knowledge and technical interview modules for Indian Railways.',
    tags: ['NTPC', 'Group D', 'JE'],
    officialUrl: 'https://indianrailways.gov.in',
    sarkariUrl: 'https://sarkariresult.com/rrb-ntpc/',
    vacancies: '11558 Posts',
    deadline: 'Sep 2025',
  },
  {
    id: 'nda',
    title: 'NDA / CDS',
    icon: Target,
    students: '30k+',
    color: 'from-red-500 to-rose-600',
    desc: 'Defence services exam prep with SSB interview coaching for Army, Navy and Air Force.',
    tags: ['Army', 'Navy', 'Air Force'],
    officialUrl: 'https://upsc.gov.in',
    sarkariUrl: 'https://sarkariresult.com/upsc/',
    vacancies: '400 Posts',
    deadline: 'Apr 2025',
  },
  {
    id: 'state_psc',
    title: 'State PSC',
    icon: Globe,
    students: '25k+',
    color: 'from-cyan-500 to-sky-600',
    desc: 'State-level Civil Services exam prep in regional languages for state government jobs.',
    tags: ['UPPSC', 'BPSC', 'MPSC'],
    officialUrl: 'https://sarkariresult.com',
    sarkariUrl: 'https://sarkariresult.com/state-psc/',
    vacancies: '5000+ Posts',
    deadline: 'Ongoing',
  },
];

// ─── TICKER DATA ──────────────────────────────────────────────────────────────
const TICKER_ITEMS = [
  '🔴 UPSC CSE 2025: Notification Released — 1206 Vacancies | Last Date: Feb 18, 2025',
  '🟢 SSC CGL 2024-25: Result Declared — Check Now on ssc.nic.in',
  '🔵 IBPS PO 2025: Online Application Started — 4736 Posts Available',
  '🟡 RRB NTPC 2025: CBT-1 Result Out — 11558 Vacancies',
  '🟣 SBI PO 2025: Interview Call Letters Issued — Download Now',
  '🔴 NDA 2025: Application Form Open — 400 Posts for Army/Navy/Air Force',
  '🟢 UPSC CAPF 2025: Admit Card Released — Download at upsc.gov.in',
  '🔵 SSC MTS 2025: Application Started — 9583 Vacancies',
];

// ─── ROLE → EXAM MAPPING ──────────────────────────────────────────────────────
const getRoleRecommendations = (targetRole = '') => {
  const role = (targetRole || '').toLowerCase();
  if (role.includes('bank') || role.includes('finance')) return ['bank', 'ssc'];
  if (role.includes('ias') || role.includes('civil') || role.includes('upsc')) return ['upsc', 'state_psc'];
  if (role.includes('rail') || role.includes('rrb')) return ['railway', 'ssc'];
  if (role.includes('defence') || role.includes('army') || role.includes('nda')) return ['nda', 'upsc'];
  if (role.includes('state') || role.includes('psc')) return ['state_psc', 'upsc'];
  return ['upsc', 'ssc', 'bank'];
};

// ─── LIVE TICKER ──────────────────────────────────────────────────────────────
function LiveTicker() {
  const [isPaused, setIsPaused] = useState(false);
  return (
    <div
      className="w-full bg-card border border-border rounded-2xl overflow-hidden flex items-stretch shadow-card"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="flex items-center gap-2 px-4 py-3 bg-primary text-primary-foreground font-bold text-xs whitespace-nowrap shrink-0">
        <Bell size={13} className="animate-pulse" /> LIVE UPDATES
      </div>
      <div className="flex-1 overflow-hidden relative">
        <motion.div
          className="flex gap-10 whitespace-nowrap py-3 px-4"
          animate={isPaused ? {} : { x: ['0%', '-50%'] }}
          transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
          style={{ width: 'max-content' }}
        >
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i} className="text-sm text-muted-foreground inline-flex items-center">
              {item}
              <span className="mx-4 text-border">|</span>
            </span>
          ))}
        </motion.div>
      </div>
      <a
        href="https://sarkariresult.com"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 px-4 py-3 bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 transition-colors shrink-0 border-l border-border"
      >
        SarkariResult <ExternalLink size={11} />
      </a>
    </div>
  );
}

// ─── EXAM CARD ────────────────────────────────────────────────────────────────
function ExamCard({ exam, index, isRecommended }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="relative group bg-card border border-border rounded-2xl overflow-hidden hover:shadow-purple transition-all duration-300 hover:-translate-y-1 flex flex-col"
    >
      {isRecommended && (
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1 bg-primary text-primary-foreground text-[10px] font-bold px-2.5 py-1 rounded-full shadow-glow">
          <Star size={10} fill="currentColor" /> Recommended
        </div>
      )}
      <div className={`bg-gradient-to-br ${exam.color} p-6 relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
        <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white mb-4">
          <exam.icon className="w-7 h-7" />
        </div>
        <h3 className="text-white font-display font-bold text-xl mb-2">{exam.title}</h3>
        <div className="flex flex-wrap gap-1.5">
          {exam.tags.map(tag => (
            <span key={tag} className="text-white/80 bg-white/15 text-xs font-medium px-2.5 py-0.5 rounded-full">{tag}</span>
          ))}
        </div>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <p className="text-muted-foreground text-sm leading-relaxed mb-4">{exam.desc}</p>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-muted/40 rounded-xl px-3 py-2 text-center">
            <p className="text-xs text-muted-foreground">Vacancies</p>
            <p className="font-bold text-sm">{exam.vacancies}</p>
          </div>
          <div className="bg-muted/40 rounded-xl px-3 py-2 text-center">
            <p className="text-xs text-muted-foreground">Last Date</p>
            <p className="font-bold text-sm">{exam.deadline}</p>
          </div>
        </div>
        <div className="text-xs text-muted-foreground mb-4 flex items-center gap-1.5">
          <Users size={12} /> {exam.students} Students Enrolled
        </div>
        <div className="mt-auto space-y-2">
          <Link to="/dashboard/setup">
            <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity">
              <Zap size={14} /> Practice AI Interview
            </button>
          </Link>
          <div className="grid grid-cols-2 gap-2">
            <a
              href={exam.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 py-2 rounded-xl border border-border hover:bg-muted text-xs font-medium transition-colors"
            >
              Official Site <ExternalLink size={11} />
            </a>
            <a
              href={exam.sarkariUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 py-2 rounded-xl border border-primary/30 bg-primary/5 text-primary hover:bg-primary/10 text-xs font-medium transition-colors"
            >
              SarkariResult <ExternalLink size={11} />
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function GovExams() {
  const { user } = useAuthStore();
  const recommendedIds = getRoleRecommendations(user?.targetRole);
  const recommended = EXAMS.filter(e => recommendedIds.includes(e.id));
  const others = EXAMS.filter(e => !recommendedIds.includes(e.id));

  return (
    <div className="min-h-screen bg-background pt-24 pb-20 px-4">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4 border border-primary/20">
            <Shield size={14} /> Sarkari Naukri Prep
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold mb-4 leading-tight">
            Government <span className="text-gradient">Exams</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Specialized mock interviews in Hindi and Regional languages designed for Indian Government Jobs.
            Practice with AI interviewers modeled after real exam panel members.
          </p>
        </motion.div>

        {/* Live Ticker */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <LiveTicker />
        </motion.div>

        {/* Recommended for You */}
        {user && recommended.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-5">
              <Star size={18} className="text-primary fill-primary" />
              <h2 className="text-xl font-display font-bold">Recommended for You</h2>
              {user.targetRole && (
                <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-medium border border-primary/20">
                  Based on: {user.targetRole}
                </span>
              )}
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {recommended.map((exam, i) => (
                <ExamCard key={exam.id} exam={exam} index={i} isRecommended />
              ))}
            </div>
          </div>
        )}

        {/* All Exams */}
        <div>
          <div className="flex items-center gap-2 mb-5">
            <BookOpen size={18} className="text-primary" />
            <h2 className="text-xl font-display font-bold">
              {user && recommended.length > 0 ? 'All Exams' : 'Choose Your Path'}
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {(user && recommended.length > 0 ? others : EXAMS).map((exam, i) => (
              <ExamCard key={exam.id} exam={exam} index={i} isRecommended={false} />
            ))}
          </div>
        </div>

        {/* CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-hero rounded-3xl p-10 sm:p-16 text-center text-white relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.15),transparent_60%)]" />
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4">Ready to serve the nation?</h2>
            <p className="text-white/80 mb-8 text-lg">
              Start practicing with our AI interviewers modeled after real exam panel members.
              Available in Hindi, English and 20+ regional languages.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={user ? '/dashboard/setup' : '/register'}>
                <button className="flex items-center gap-2 px-8 py-4 bg-white text-primary rounded-xl font-bold hover:bg-gray-100 transition-colors shadow-lg">
                  Start Free Mock Interview <ArrowRight size={18} />
                </button>
              </Link>
              <a
                href="https://sarkariresult.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-8 py-4 border border-white/30 text-white rounded-xl font-bold hover:bg-white/10 transition-colors"
              >
                Browse Sarkari Jobs <ExternalLink size={16} />
              </a>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}


