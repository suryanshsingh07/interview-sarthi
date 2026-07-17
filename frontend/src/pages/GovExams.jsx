import { motion } from 'framer-motion';
import { BookOpen, Shield, Award, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function GovExams() {
  const EXAMS = [
    { id: 'upsc', title: 'UPSC Civil Services', icon: Shield, students: '45k+', desc: 'Mock interviews for IAS, IPS, and IFS with retired bureaucrats as AI personas.' },
    { id: 'ssc', title: 'SSC CGL', icon: Users, students: '80k+', desc: 'Comprehensive aptitude and interview prep for Staff Selection Commission.' },
    { id: 'bank', title: 'IBPS PO / SBI PO', icon: Award, students: '65k+', desc: 'Banking sector interview preparation covering economy and situational awareness.' },
    { id: 'railway', title: 'RRB NTPC', icon: BookOpen, students: '50k+', desc: 'General knowledge and technical interview modules for Indian Railways.' }
  ];

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">Sarkari Naukri Prep</span>
          <h1 className="text-4xl sm:text-5xl font-display font-bold mb-4">Government <span className="text-gradient">Exams</span></h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Specialized mock interviews in Hindi and Regional languages designed for Indian Government Jobs.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {EXAMS.map((exam, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              key={exam.id} 
              className="glass-card p-8 rounded-2xl hover:shadow-purple transition-all duration-300 group cursor-pointer border border-border text-center"
            >
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-hero flex items-center justify-center text-white mb-6 shadow-glow">
                <exam.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-display font-bold mb-3">{exam.title}</h3>
              <p className="text-muted-foreground text-sm mb-6 leading-relaxed">{exam.desc}</p>
              <div className="text-xs font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full inline-block">
                {exam.students} Enrolled
              </div>
            </motion.div>
          ))}
        </div>

        <div className="bg-gradient-hero rounded-3xl p-10 sm:p-16 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.15),transparent_60%)]" />
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl font-display font-bold mb-4">Ready to serve the nation?</h2>
            <p className="text-white/80 mb-8">Start practicing with our AI interviewers modeled after real exam panel members.</p>
            <Link to="/register">
              <button className="px-8 py-4 bg-white text-primary rounded-xl font-bold text-base hover:bg-gray-100 transition-colors shadow-lg">
                Start Free Mock Interview
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
