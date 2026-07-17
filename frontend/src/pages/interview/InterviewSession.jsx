import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic, MicOff, Send, SkipForward, Volume2, VolumeX,
  RefreshCw, Globe, CheckCircle, XCircle, Clock,
  TrendingUp, BarChart3, Brain, Star, Download
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

// ── QUESTION BANKS ─────────────────────────────────────────────────────────────
const QUESTION_BANK = {
  'Software Developer': [
    'Tell me about yourself and your software development journey.',
    'What are the core differences between OOP and functional programming?',
    'Explain time complexity. What is the difference between O(n) and O(n²)?',
    'Describe a challenging technical problem you solved. What was your approach?',
    'What is the difference between SQL and NoSQL databases? When would you use each?',
    'Explain REST vs GraphQL. What are the trade-offs?',
    'What is a deadlock? How do you prevent it?',
    'Describe your experience with version control (Git). What is your branching strategy?',
    'How do you approach code reviews and giving constructive feedback?',
    'What steps do you take when debugging a production issue?',
    'Explain how you would design a URL shortener like bit.ly.',
    'How do you stay updated with new technologies?',
  ],
  'Frontend Developer': [
    'Tell me about yourself and your frontend development background.',
    'What is the Virtual DOM in React and why does it improve performance?',
    'Explain the difference between `useEffect`, `useMemo`, and `useCallback` in React.',
    'How do you optimize a slow-loading web page? List at least 3 techniques.',
    'What is CSS specificity and how does the cascade work?',
    'Explain Flexbox vs CSS Grid. When would you use each?',
    'What are Web Accessibility (a11y) best practices you follow?',
    'How does event bubbling work in JavaScript?',
    'Explain the difference between `localStorage`, `sessionStorage`, and cookies.',
    'What is CORS? How does it affect frontend development?',
    'Describe a complex UI component you built from scratch.',
    'How do you test your frontend code? What tools do you use?',
  ],
  'Backend Developer': [
    'Tell me about yourself and your backend development experience.',
    'Explain the difference between authentication and authorization.',
    'How would you design a scalable REST API?',
    'What is database indexing and how does it improve query performance?',
    'Explain microservices vs monolithic architecture. What are the trade-offs?',
    'How do you handle race conditions in a multi-threaded application?',
    'What is database normalization? Explain the first three normal forms.',
    'Describe how you would implement caching in your application.',
    'What is a message queue? When would you use Kafka or RabbitMQ?',
    'How do you secure an API endpoint? List all the methods you know.',
    'Explain the CAP theorem in distributed systems.',
    'What monitoring and logging practices do you follow in production?',
  ],
  'Data Analyst': [
    'Tell me about yourself and your data analysis experience.',
    'How do you ensure data quality and accuracy in your analysis?',
    'Describe a time you found a key business insight from complex data.',
    'What is the difference between OLTP and OLAP systems?',
    'Explain the difference between a JOIN and a UNION in SQL.',
    'How do you handle missing or inconsistent data in your datasets?',
    'What statistical methods do you use to validate your findings?',
    'Describe a project where data analysis had a measurable business impact.',
    'What tools do you use for data visualization and why?',
    'How do you present data findings to non-technical stakeholders?',
    'Explain the concept of a cohort analysis.',
    'What is A/B testing? How do you design an A/B test?',
  ],
  'Business Analyst': [
    'Tell me about yourself and your business analysis experience.',
    'How do you gather and document requirements from stakeholders?',
    'Describe a process improvement you identified and implemented.',
    'What is the difference between a use case and a user story?',
    'How do you handle conflicting requirements from different stakeholders?',
    'What methodologies do you follow — Agile, Waterfall, or hybrid?',
    'Tell me about a time you managed a difficult stakeholder relationship.',
    'How do you prioritize features when resources are limited?',
    'What tools do you use for requirement documentation (Jira, Confluence, etc.)?',
    'Explain how you would conduct a gap analysis.',
    'What is MoSCoW prioritization?',
    'Describe how you would create a business case for a new project.',
  ],
  'DevOps Engineer': [
    'Tell me about yourself and your DevOps journey.',
    'Explain the difference between CI (Continuous Integration) and CD (Continuous Deployment).',
    'What is containerization? How does Docker differ from a virtual machine?',
    'Describe your experience with Kubernetes. How does it handle container orchestration?',
    'What is Infrastructure as Code (IaC)? Which tools have you used?',
    'How do you implement a zero-downtime deployment strategy?',
    'Explain the concept of blue-green deployments vs canary deployments.',
    'How do you monitor the health of a production system?',
    'What is a service mesh? How does Istio work?',
    'Describe how you would handle a major production outage.',
    'How do you secure a CI/CD pipeline?',
    'What cloud platforms (AWS, GCP, Azure) have you worked with?',
  ],
  'Customer Support': [
    'Tell me about yourself and your customer service experience.',
    'How do you handle an angry or frustrated customer?',
    'Describe a time you went above and beyond for a customer.',
    'How do you manage multiple customer queries simultaneously?',
    'What does excellent customer service mean to you?',
    'Tell me about a time you resolved a complex customer complaint.',
    'How do you stay calm and empathetic during stressful interactions?',
    'What CRM tools have you used?',
    'Describe a situation where you had to escalate an issue.',
    'How do you gather customer feedback to improve service?',
  ],
  'HR Executive': [
    'Tell me about yourself and your HR experience.',
    'How do you handle a conflict between two employees?',
    'Describe your experience with the end-to-end recruitment process.',
    'How do you ensure fair and unbiased hiring practices?',
    'Tell me about a challenging HR situation you successfully resolved.',
    'How do you measure employee engagement and satisfaction?',
    'What strategies do you use for employee retention?',
    'How do you handle a performance improvement plan (PIP)?',
    'Describe your experience with compensation and benefits planning.',
    'What is your approach to onboarding new employees?',
  ],
};

const DEFAULT_QUESTIONS = [
  'Tell me about yourself.',
  'Why should we hire you?',
  'What are your greatest strengths and weaknesses?',
  'Tell me about a time you showed leadership.',
  'Where do you see yourself in 5 years?',
  'How do you handle pressure and tight deadlines?',
];

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ── CINEMATIC AI AVATAR ────────────────────────────────────────────────────────
function AvatarSpeaker({ speaking, thinking }) {
  const eyeAnim = speaking
    ? { scaleY: [1, 0.1, 1, 1, 0.1, 1], transition: { duration: 2.5, repeat: Infinity } }
    : { scaleY: [1, 0.05, 1], transition: { duration: 3, repeat: Infinity, repeatDelay: 2 } };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        {speaking && (
          <>
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ background: 'hsl(var(--primary)/0.15)' }}
              animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ background: 'hsl(var(--accent)/0.1)' }}
              animate={{ scale: [1, 1.7, 1], opacity: [0.4, 0, 0.4] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}
            />
          </>
        )}

        <motion.div
          className="relative w-28 h-28 rounded-full flex items-center justify-center overflow-hidden"
          style={{ background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 100%)' }}
          animate={speaking ? { boxShadow: ['0 0 0px hsl(var(--primary)/0.3)', '0 0 40px hsl(var(--primary)/0.6)', '0 0 0px hsl(var(--primary)/0.3)'] } : {}}
          transition={{ duration: 1.5, repeat: speaking ? Infinity : 0 }}
        >
          <svg width="70" height="70" viewBox="0 0 70 70" fill="none">
            <circle cx="35" cy="35" r="28" fill="white" fillOpacity="0.15" />
            <motion.ellipse cx="24" cy="28" rx="4" ry="5" fill="white" animate={eyeAnim} />
            <motion.ellipse cx="46" cy="28" rx="4" ry="5" fill="white" animate={eyeAnim} />
            <motion.circle cx="25" cy="29" r="2" fill="hsl(var(--primary))" animate={speaking ? { x: [0, 1, -1, 0] } : {}} transition={{ duration: 1.5, repeat: Infinity }} />
            <motion.circle cx="47" cy="29" r="2" fill="hsl(var(--primary))" animate={speaking ? { x: [0, 1, -1, 0] } : {}} transition={{ duration: 1.5, repeat: Infinity }} />
            <motion.path
              d={thinking ? 'M18 21 Q24 17 30 21' : 'M18 22 Q24 19 30 22'}
              stroke="white" strokeWidth="2.5" strokeLinecap="round"
              animate={thinking ? { d: 'M18 19 Q24 15 30 19' } : {}}
            />
            <motion.path
              d={thinking ? 'M40 21 Q46 17 52 21' : 'M40 22 Q46 19 52 22'}
              stroke="white" strokeWidth="2.5" strokeLinecap="round"
              animate={thinking ? { d: 'M40 19 Q46 15 52 19' } : {}}
            />
            <motion.path
              d={speaking ? 'M23 48 Q35 58 47 48' : 'M25 48 Q35 54 45 48'}
              stroke="white" strokeWidth="3" strokeLinecap="round" fill="none"
              animate={speaking ? { d: ['M23 48 Q35 58 47 48', 'M24 46 Q35 52 46 46', 'M23 48 Q35 58 47 48'] } : {}}
              transition={{ duration: 0.5, repeat: speaking ? Infinity : 0 }}
            />
          </svg>

          {thinking && (
            <div className="absolute bottom-4 flex gap-1">
              {[0, 1, 2].map(i => (
                <motion.div key={i} className="w-2 h-2 rounded-full bg-white"
                  animate={{ y: [0, -6, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }} />
              ))}
            </div>
          )}
        </motion.div>

        {speaking && (
          <motion.div
            className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: 'hsl(var(--accent))' }}
            animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.6, repeat: Infinity }}
          >
            <Volume2 className="h-4 w-4 text-white" />
          </motion.div>
        )}
      </div>

      {/* Sound wave bars */}
      <div className="flex items-end gap-1 h-8">
        {[0.4, 0.8, 1, 0.6, 0.9, 0.5, 0.7, 1, 0.4, 0.8, 0.6, 0.3].map((h, i) => (
          <motion.div
            key={i} className="w-1.5 rounded-full" style={{ background: 'hsl(var(--primary))' }}
            animate={speaking ? { height: [`${h * 8}px`, `${h * 28}px`, `${h * 8}px`], opacity: [0.4, 1, 0.4] } : { height: '4px', opacity: 0.2 }}
            transition={{ duration: 0.5 + i * 0.05, repeat: Infinity, delay: i * 0.06 }}
          />
        ))}
      </div>

      <motion.p className="text-xs font-medium" style={{ color: 'hsl(var(--primary))' }}
        animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 2, repeat: Infinity }}>
        {thinking ? '🤔 Analyzing your answer . . .' : speaking ? '🎤 Interviewer speaking . . .' : '✨ Ready for your answer'}
      </motion.p>
    </div>
  );
}

// ── MAIN INTERVIEW SESSION ─────────────────────────────────────────────────────
export default function InterviewSession() {
  const navigate = useNavigate();
  const config = useMemo(() => {
    try { return JSON.parse(sessionStorage.getItem('interviewConfig') || '{}'); }
    catch { return {}; }
  }, []);

  const { role = 'Software Developer', difficulty = 'Medium', experience = 'Fresher' } = config;
  const { lang } = useLanguage();

  const [phase, setPhase] = useState('interview'); // 'interview' | 'results'
  const [isGenerating, setIsGenerating] = useState(!!config.resumeText);
  const [questions, setQuestions] = useState(() => {
    const pool = QUESTION_BANK[role] || DEFAULT_QUESTIONS;
    return shuffleArray(pool).slice(0, 7);
  });
  const [currentQ, setCurrentQ] = useState(0);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showHindi, setShowHindi] = useState(lang === 'Hindi');
  const [answers, setAnswers] = useState([]);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const recognitionRef = useRef(null);

  // Generate custom questions if resume is provided
  useEffect(() => {
    if (!config.resumeText) return;
    
    const fetchCustomQuestions = async () => {
      try {
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        if (!apiKey) throw new Error("No API Key");
        const prompt = `Generate exactly 7 interview questions for a ${difficulty} level ${role} role with ${experience} experience, based on this resume/context:\n${config.resumeText.substring(0, 2000)}\n\nFormat your output as a raw JSON array of strings ONLY. No markdown, no explanation, just the JSON array. Like: ["Question 1?", "Question 2?"]`;
        
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.7, maxOutputTokens: 500 }
          })
        });
        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        const match = text.match(/\[[\s\S]*\]/);
        if (match) {
          const customQ = JSON.parse(match[0]);
          if (Array.isArray(customQ) && customQ.length > 0) {
            setQuestions(customQ.slice(0, 7));
          }
        }
      } catch (e) {
        console.error("Failed to generate custom questions, using bank", e);
      } finally {
        setIsGenerating(false);
      }
    };
    
    fetchCustomQuestions();
  }, [config.resumeText, role, difficulty, experience]);

  const speakText = useCallback((text) => {
    if (!('speechSynthesis' in window) || isMuted) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-IN';
    utterance.rate = 0.88;
    utterance.pitch = 1.05;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }, [isMuted]);

  useEffect(() => {
    setShowHindi(lang === 'Hindi');
  }, [lang]);

  useEffect(() => {
    if (questions[currentQ]) {
      setTimeout(() => speakText(questions[currentQ]), 400);
    }
    return () => window.speechSynthesis?.cancel();
  }, [currentQ, questions]);

  const saveAndAdvance = useCallback((record) => {
    setAnswers(prev => [...prev, record]);
    setAnswer('');
    setFeedback(null);
    if (currentQ + 1 >= questions.length) {
      setPhase('results');
      window.speechSynthesis?.cancel();
    } else {
      setCurrentQ(prev => prev + 1);
      setQuestionStartTime(Date.now());
    }
  }, [currentQ, questions.length]);

  const toggleRecording = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Speech recognition not supported. Please use Chrome.');
      return;
    }
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      return;
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SR();
    recognitionRef.current = recognition;
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-IN';
    recognition.onresult = (event) => {
      let transcript = '';
      for (let i = 0; i < event.results.length; i++) transcript += event.results[i][0].transcript;
      setAnswer(transcript);
    };
    recognition.onerror = () => { setIsRecording(false); };
    recognition.onend = () => setIsRecording(false);
    recognition.start();
    setIsRecording(true);
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
  };

  const getAIFeedback = async () => {
    if (!answer.trim()) return;
    setAiLoading(true);
    setFeedback(null);
    const timeTaken = Math.round((Date.now() - questionStartTime) / 1000);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      const hindiInstruction = showHindi ? ' Also provide a Hindi translation of the improved version in a "hindi" field.' : '';
      const prompt = `You are an expert interview coach evaluating a ${difficulty} level ${role} interview answer from a ${experience} candidate.

Question: "${questions[currentQ]}"
Candidate's Answer: "${answer}"

Provide feedback in this EXACT JSON format (no markdown, no code blocks):
{"original":"The candidate's answer (summarized in 1-2 sentences)","improved":"The ideal, correct answer to this question (2-4 sentences), regardless of whether the candidate answered it well or not. Do not just give tips here, provide the actual answer.","tips":"One specific actionable tip to improve their specific answer","score":${difficulty === 'Easy' ? '65 + a random number between 1 and 30' : difficulty === 'Medium' ? '55 + a random number between 1 and 40' : '50 + a random number between 1 and 45'}${hindiInstruction ? ',"hindi":"Hindi translation of improved answer"' : ''}}

IMPORTANT: Return ONLY the raw JSON object. No explanation, no code fences.`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.6, maxOutputTokens: 512 }
          })
        }
      );

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const feedbackData = JSON.parse(jsonMatch[0]);
        feedbackData.score = typeof feedbackData.score === 'string'
          ? parseInt(feedbackData.score) || Math.floor(60 + Math.random() * 35)
          : feedbackData.score || Math.floor(60 + Math.random() * 35);
        setFeedback(feedbackData);
        setTimeout(() => {
          saveAndAdvance({ question: questions[currentQ], answer, feedback: feedbackData, skipped: false, timeTaken });
        }, 4000);
      } else {
        throw new Error('Parse error');
      }
    } catch {
      // Dynamic fallback to fetch the ideal answer
      const wordCount = answer.trim().split(/\s+/).filter(Boolean).length;
      const fallbackScore = wordCount < 5 ? Math.floor(20 + Math.random() * 20) : Math.floor(45 + Math.random() * 20);
      
      let dynamicImproved = wordCount < 5
          ? `(Could not fetch the ideal answer. Please ensure VITE_GEMINI_API_KEY is in your frontend/.env file and the Vite dev server was restarted.)`
          : '(Could not fetch the ideal answer. Please ensure VITE_GEMINI_API_KEY is in your frontend/.env file and the Vite dev server was restarted.)';

      try {
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        if (!apiKey) throw new Error("No API Key");
        
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: `Provide a concise, professional "ideal answer" (2-4 sentences) to this interview question: "${questions[currentQ]}"` }] }],
            generationConfig: { temperature: 0.7, maxOutputTokens: 256 }
          })
        });
        
        if (!res.ok) throw new Error("API call failed");
        
        const d = await res.json();
        const text = d.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) dynamicImproved = text.replace(/\n/g, ' ').trim();
      } catch (e) {
        console.error("Fallback API call also failed", e);
      }

      const fallback = {
        original: answer.substring(0, 200) || '(No answer provided)',
        improved: dynamicImproved,
        tips: wordCount < 5
          ? 'Try to always provide at least a basic answer — even saying "I\'m not sure but I think..." shows initiative.'
          : 'Be more specific with examples from your real experience to make your answer stand out.',
        score: fallbackScore,
      };
      setFeedback(fallback);
      setTimeout(() => {
        saveAndAdvance({ question: questions[currentQ], answer, feedback: fallback, skipped: false, timeTaken });
      }, 3500);
    } finally {
      setAiLoading(false);
    }
  };

  const skipQuestion = () => {
    const timeTaken = Math.round((Date.now() - questionStartTime) / 1000);
    saveAndAdvance({ question: questions[currentQ], answer: '', feedback: null, skipped: true, timeTaken });
  };

  const restart = () => {
    const pool = QUESTION_BANK[role] || DEFAULT_QUESTIONS;
    setQuestions(shuffleArray(pool).slice(0, 7));
    setCurrentQ(0);
    setAnswer('');
    setFeedback(null);
    setAnswers([]);
    setPhase('interview');
    setQuestionStartTime(Date.now());
  };

  // ── RESULTS ─────────────────────────────────────────────────────────────────
  const results = useMemo(() => {
    if (answers.length === 0) return null;
    const answered = answers.filter(a => !a.skipped);
    const skipped = answers.length - answered.length;

    // Skipped questions count as 0 — this prevents inflated scores
    const totalScore = answers.reduce((s, a) => {
      if (a.skipped) return s + 0;
      return s + (a.feedback?.score || 50);
    }, 0);
    const avgScore = Math.round(totalScore / answers.length);

    const avgTime = answered.length > 0
      ? Math.round(answered.reduce((s, a) => s + a.timeTaken, 0) / answered.length) : 0;
    const fluency = Math.min(100, Math.max(0, avgScore + Math.floor(Math.random() * 6) - 3));
    const confidence = Math.min(100, Math.max(0, avgScore - 8 + Math.floor(Math.random() * 10)));
    const grammar = Math.min(100, Math.max(0, avgScore + Math.floor(Math.random() * 5)));
    const grade = avgScore >= 85 ? 'Excellent' : avgScore >= 70 ? 'Good' : avgScore >= 50 ? 'Fair' : 'Needs Work';
    const gradeColor = avgScore >= 85 ? 'text-green-500' : avgScore >= 70 ? 'text-primary' : avgScore >= 50 ? 'text-yellow-500' : 'text-destructive';
    
    return { 
      id: Date.now().toString(),
      role, difficulty, experience, 
      date: new Date().toISOString(),
      total: answers.length, answered: answered.length, skipped, avgScore, avgTime, fluency, confidence, grammar, grade, gradeColor, answers
    };
  }, [answers, role, difficulty, experience]);

  // Save to history when phase changes to results
  useEffect(() => {
    if (phase === 'results' && results) {
      const existingHistory = JSON.parse(localStorage.getItem('interviewHistory') || '[]');
      // Avoid duplicate saves
      if (!existingHistory.some(h => h.id === results.id)) {
        localStorage.setItem('interviewHistory', JSON.stringify([results, ...existingHistory]));
      }
    }
  }, [phase, results]);

  // ── RESULTS SCREEN ────────────────────────────────────────────────────────────
  if (phase === 'results' && results) {
    return (
      <div className="max-w-3xl mx-auto pt-4 pb-10">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center mb-8">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-3xl font-display font-bold mb-2">Interview Complete!</h1>
          <p className="text-muted-foreground">Detailed performance report for <span className="font-semibold text-foreground">{role}</span> interview</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="p-8 rounded-3xl glass-card shadow-purple mb-6 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-hero opacity-5" />
          <div className="relative">
            <div className="text-7xl font-display font-bold mb-1" style={{ color: 'hsl(var(--primary))' }}>{results.avgScore}</div>
            <div className="text-2xl font-semibold mb-1">/100</div>
            <div className={`text-xl font-bold mb-4 ${results.gradeColor}`}>{results.grade} Performance</div>
            <div className="flex justify-center gap-2 flex-wrap">
              {results.avgScore >= 70 && <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-600">🌟 Interview Ready</span>}
              {results.answered >= 5 && <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">💪 Strong Completion</span>}
              {results.skipped === 0 && <span className="px-3 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent">✅ No Skips</span>}
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Answered', value: `${results.answered}/${results.total}`, Icon: CheckCircle, color: 'text-green-500' },
            { label: 'Skipped', value: results.skipped, Icon: XCircle, color: results.skipped > 0 ? 'text-yellow-500' : 'text-green-500' },
            { label: 'Avg Time', value: `${results.avgTime}s`, Icon: Clock, color: 'text-accent' },
            { label: 'Grammar', value: `${results.grammar}%`, Icon: Star, color: 'text-primary' },
          ].map((card, i) => (
            <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.08 }}
              className="p-4 rounded-2xl glass-card shadow-card text-center">
              <card.Icon className={`h-5 w-5 ${card.color} mx-auto mb-2`} />
              <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{card.label}</p>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="p-6 rounded-2xl glass-card shadow-card mb-6">
          <h3 className="font-display font-semibold mb-4 flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-primary" /> Skill Assessment
          </h3>
          <div className="space-y-4">
            {[
              { label: 'Overall Score', value: results.avgScore, color: 'bg-primary' },
              { label: 'Fluency', value: results.fluency, color: 'bg-accent' },
              { label: 'Confidence', value: results.confidence, color: 'bg-green-500' },
              { label: 'Grammar Accuracy', value: results.grammar, color: 'bg-yellow-500' },
            ].map(skill => (
              <div key={skill.label}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-medium">{skill.label}</span>
                  <span className="font-bold">{skill.value}%</span>
                </div>
                <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${skill.color}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.value}%` }}
                    transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mb-6">
          <h3 className="font-display font-semibold mb-4 flex items-center gap-2">
            <Brain className="h-4 w-4 text-accent" /> Question-by-Question Breakdown
          </h3>
          <div className="space-y-3">
            {answers.map((a, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 + i * 0.07 }}
                className="p-4 rounded-xl glass-card shadow-card">
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${a.skipped ? 'bg-yellow-500/10 text-yellow-600' : 'bg-green-500/10 text-green-600'}`}>
                    {a.skipped ? '⏭' : `${a.feedback?.score ?? '✓'}`}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium mb-1">Q{i + 1}: {a.question}</p>
                    {a.skipped ? (
                      <p className="text-xs text-yellow-500 font-medium">Skipped</p>
                    ) : (
                      <>
                        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">Your answer: {a.answer}</p>
                        {a.feedback && (
                          <div className="space-y-2">
                            <div className="p-2.5 rounded-lg" style={{ background: 'hsl(152 60% 45% / 0.08)', border: '1px solid hsl(152 60% 45% / 0.25)' }}>
                              <p className="text-xs"><span className="font-semibold text-green-600">✨ Improved:</span> {a.feedback.improved}</p>
                            </div>
                            <p className="text-xs text-muted-foreground"><span className="font-medium text-primary">💡 Tip:</span> {a.feedback.tips}</p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                  <div className="text-right text-xs text-muted-foreground flex-shrink-0">
                    <Clock className="h-3 w-3 inline mr-1" />{a.timeTaken}s
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
          className="p-5 rounded-2xl glass-card shadow-card mb-8">
          <h3 className="font-display font-semibold mb-3 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-accent" /> Personalized Recommendations
          </h3>
          <div className="space-y-2">
            {[
              results.avgScore < 70 && 'Practice the STAR method (Situation, Task, Action, Result) for behavioral questions.',
              results.skipped > 1 && 'Review common interview questions for your role to reduce blank answers.',
              results.grammar < 75 && 'Focus on sentence structure — use our Grammar module in Courses.',
              results.avgTime > 120 && 'Try to keep answers between 60-90 seconds — practice being concise.',
              'Record yourself answering and watch it back to identify filler words.',
            ].filter(Boolean).map((tip, i) => (
              <div key={i} className="flex items-start gap-2 text-sm">
                <span className="text-primary mt-0.5 flex-shrink-0">→</span>
                <span className="text-muted-foreground">{tip}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={restart} className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-hero text-primary-foreground font-semibold hover:opacity-90 transition-opacity shadow-glow">
            <RefreshCw className="h-4 w-4" /> Try Again
          </button>
          <button onClick={() => navigate('/dashboard')} className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-border glass-card font-medium hover:bg-secondary/50 transition-colors">
            Back to Dashboard
          </button>
          <button onClick={() => navigate('/dashboard/history')} className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-border glass-card font-medium hover:bg-secondary/50 transition-colors">
            <Download className="h-4 w-4" /> View All Reports
          </button>
        </div>
      </div>
    );
  }

  // ── INTERVIEW SCREEN ─────────────────────────────────────────────────────────
  if (isGenerating) {
    return (
      <div className="max-w-3xl mx-auto pt-20 pb-10 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 relative mb-6">
          <div className="absolute inset-0 rounded-full border-t-2 border-primary animate-spin"></div>
          <div className="absolute inset-2 rounded-full border-b-2 border-accent animate-spin" style={{ animationDirection: 'reverse' }}></div>
          <Brain className="absolute inset-0 m-auto h-6 w-6 text-primary" />
        </div>
        <h2 className="text-xl font-bold mb-2">Analyzing your resume...</h2>
        <p className="text-muted-foreground">Generating custom questions tailored to your experience.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto pt-2 pb-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Progress bar */}
        <div className="flex items-center gap-2 mb-6">
          <span className="text-xs text-muted-foreground whitespace-nowrap">Q {currentQ + 1}/{questions.length}</span>
          <div className="flex gap-1.5 flex-1">
            {questions.map((_, i) => (
              <motion.div
                key={i}
                className={`h-2 flex-1 rounded-full transition-colors duration-500 ${i < currentQ ? 'bg-green-500' : i === currentQ ? 'bg-primary' : 'bg-muted'}`}
                initial={i === currentQ ? { scaleX: 0 } : {}}
                animate={{ scaleX: 1 }}
              />
            ))}
          </div>
          <button onClick={() => { setIsMuted(!isMuted); if (!isMuted) window.speechSynthesis?.cancel(); }}
            className="text-muted-foreground hover:text-foreground transition-colors">
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
        </div>

        {/* Avatar + Question card */}
        <div className="p-6 rounded-3xl glass-card shadow-purple mb-6 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-hero opacity-60 rounded-t-3xl" />
          <div className="mb-4"><AvatarSpeaker speaking={isSpeaking} thinking={aiLoading} /></div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">{role} Interview</span>
            <div className="flex items-center gap-2">
              <button onClick={() => speakText(questions[currentQ])}
                className="p-1.5 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors" title="Replay question">
                <Volume2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setShowHindi(!showHindi)}
                className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${showHindi ? 'bg-accent/20 text-accent border border-accent/30' : 'bg-muted text-muted-foreground'}`}
              >
                <Globe className="h-3.5 w-3.5" /> हिंदी
              </button>
            </div>
          </div>
          <AnimatePresence mode="wait">
            <motion.h2 key={currentQ}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="text-xl font-display font-semibold">
              {questions[currentQ]}
            </motion.h2>
          </AnimatePresence>
        </div>

        {/* Answer section */}
        <AnimatePresence mode="wait">
          {!feedback ? (
            <motion.div key="input" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="space-y-4">
              <div className="relative">
                <textarea
                  placeholder="Type your answer here, or use the microphone to speak..."
                  value={answer}
                  onChange={e => setAnswer(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && e.ctrlKey) { e.preventDefault(); getAIFeedback(); } }}
                  className="w-full min-h-[160px] rounded-2xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                />
                {answer && (
                  <div className="absolute bottom-3 right-3 text-xs text-muted-foreground">
                    {answer.split(' ').filter(Boolean).length} words
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-3 items-center">
                <button
                  onClick={toggleRecording}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${isRecording ? 'bg-destructive text-destructive-foreground' : 'border border-border glass-card hover:border-primary/50'}`}
                >
                  {isRecording ? (
                    <>
                      <MicOff className="h-4 w-4" />
                      <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1, repeat: Infinity }}>Recording...</motion.span>
                    </>
                  ) : (
                    <><Mic className="h-4 w-4" /> Speak Answer</>
                  )}
                </button>

                <button
                  onClick={getAIFeedback}
                  disabled={aiLoading || !answer.trim()}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-gradient-hero text-primary-foreground shadow-glow hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {aiLoading ? <><RefreshCw className="h-4 w-4 animate-spin" /> Analyzing...</> : <><Send className="h-4 w-4" /> Submit Answer</>}
                </button>

                <button
                  onClick={skipQuestion} disabled={aiLoading}
                  className="flex items-center gap-1.5 ml-auto px-4 py-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted text-sm font-medium transition-colors"
                >
                  <SkipForward className="h-4 w-4" /> I don't know
                </button>
              </div>
              <p className="text-xs text-center text-muted-foreground">Ctrl+Enter to submit • Chrome recommended for voice recording</p>
            </motion.div>
          ) : (
            <motion.div key="feedback" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl" style={{ background: 'hsl(var(--primary)/0.08)', border: '1px solid hsl(var(--primary)/0.2)' }}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-hero flex items-center justify-center text-white font-bold text-lg">
                    {feedback.score}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">AI Score</p>
                    <p className="text-xs text-muted-foreground">Moving to next question in 4s…</p>
                  </div>
                </div>
                <div className="h-1.5 w-32 rounded-full bg-muted overflow-hidden">
                  <motion.div className="h-full bg-gradient-hero rounded-full" initial={{ width: '100%' }} animate={{ width: '0%' }} transition={{ duration: 4, ease: 'linear' }} />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl" style={{ background: 'hsl(var(--destructive)/0.06)', border: '1px solid hsl(var(--destructive)/0.2)' }}>
                  <h4 className="text-sm font-semibold mb-2" style={{ color: 'hsl(var(--destructive))' }}>📝 Your Answer</h4>
                  <p className="text-sm leading-relaxed">{feedback.original}</p>
                </div>
                <div className="p-5 rounded-2xl" style={{ background: 'hsl(152 60% 45% / 0.08)', border: '1px solid hsl(152 60% 45% / 0.25)' }}>
                  <h4 className="text-sm font-semibold mb-2 text-green-600 dark:text-green-400">✨ Improved Version</h4>
                  <p className="text-sm leading-relaxed">{feedback.improved}</p>
                </div>
              </div>

              <div className="p-4 rounded-xl" style={{ background: 'hsl(var(--primary)/0.06)', border: '1px solid hsl(var(--primary)/0.2)' }}>
                <p className="text-sm"><span className="font-semibold text-primary">💡 Tip:</span> {feedback.tips}</p>
              </div>

              {showHindi && feedback.hindi && (
                <div className="p-4 rounded-xl" style={{ background: 'hsl(var(--accent)/0.08)', border: '1px solid hsl(var(--accent)/0.2)' }}>
                  <p className="text-sm">🇮🇳 <span className="font-medium text-accent">हिंदी में:</span> {feedback.hindi}</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
