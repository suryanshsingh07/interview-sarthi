import { useState } from 'react';
import { Search, BookOpen, Star, Clock, Filter, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const MOCK_COURSES = [
  { id: 1, title: 'Frontend Developer Masterclass', category: 'Software Dev', level: 'Intermediate', rating: 4.8, students: '12k+', icon: '💻' },
  { id: 2, title: 'Data Structures & Algorithms', category: 'Software Dev', level: 'Advanced', rating: 4.9, students: '25k+', icon: '🧠' },
  { id: 3, title: 'Product Management Essentials', category: 'Business', level: 'Beginner', rating: 4.7, students: '8k+', icon: '📊' },
  { id: 4, title: 'System Design for Interviews', category: 'Software Dev', level: 'Advanced', rating: 4.9, students: '15k+', icon: '🏗️' },
  { id: 5, title: 'HR Interview Preparation', category: 'HR', level: 'All Levels', rating: 4.8, students: '30k+', icon: '🤝' },
  { id: 6, title: 'Data Analytics with SQL & Python', category: 'Data Science', level: 'Intermediate', rating: 4.7, students: '18k+', icon: '📈' },
];

export default function Courses() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Software Dev', 'Data Science', 'Business', 'HR'];

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-display font-bold mb-4">Explore Our <span className="text-gradient">Courses</span></h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Comprehensive interview preparation modules designed by industry experts to help you crack top MNCs.</p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-10">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search courses..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-card border border-border rounded-xl pl-10 pr-4 py-3 outline-none focus:border-primary transition-colors"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar">
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${activeCategory === cat ? 'bg-primary text-primary-foreground' : 'bg-muted/50 text-muted-foreground hover:bg-muted'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Course Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_COURSES
            .filter(c => activeCategory === 'All' || c.category === activeCategory)
            .filter(c => c.title.toLowerCase().includes(searchTerm.toLowerCase()))
            .map((course, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              key={course.id} 
              className="glass-card p-6 flex flex-col h-full group hover:shadow-purple transition-all duration-300 hover:-translate-y-1 cursor-pointer border-border"
            >
              <div className="text-4xl mb-4">{course.icon}</div>
              <span className="text-xs font-semibold text-primary mb-2 uppercase tracking-wider">{course.category}</span>
              <h3 className="text-xl font-display font-bold mb-3 line-clamp-2">{course.title}</h3>
              
              <div className="mt-auto space-y-4">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><Star className="w-4 h-4 text-warning fill-warning" /> {course.rating}</span>
                  <span className="flex items-center gap-1"><BookOpen className="w-4 h-4" /> {course.level}</span>
                  <span className="flex items-center gap-1"><UserIcon className="w-4 h-4" /> {course.students}</span>
                </div>
                <div className="pt-4 border-t border-border flex justify-between items-center">
                  <span className="font-bold text-lg">Free</span>
                  <button className="text-primary font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                    Start Learning <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function UserIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
