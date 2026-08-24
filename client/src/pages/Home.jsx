import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from 'react-router-dom';
import heroImg from '../assets/hero_illustration.jpg';
import DemoPreview from '../components/DemoPreview';
import { 
  FiArrowRight, 
  FiCheckCircle, 
  FiBookOpen, 
  FiZap, 
  FiShare2, 
  FiDownload, 
  FiAward, 
  FiFileText,
  FiTrendingUp,
  FiPieChart,
  FiChevronDown,
  FiChevronUp,
  FiUsers,
  FiCheck,
  FiCpu,
  FiTarget
} from 'react-icons/fi';

function Home() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <div className="min-h-screen bg-[#EDEBE0] text-[#1e2025] relative overflow-hidden font-sans selection:bg-[#EDEBE0] selection:text-[#1e2025]">
      
      {/* Soft Organic Background Blobs (Soft Sand & Iris Ice Palette) */}
      <div className="trekt-bg-blob-top" />
      <div className="trekt-bg-blob-bottom" />

      {/* Clean Navbar */}
      <Navbar />

      {/* ================= HERO SECTION ================= */}
      <section className="relative pt-24 sm:pt-28 pb-12 px-6 sm:px-12 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Column Text & Action Button */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-6 space-y-5 relative z-10"
        >
          <h1 className="text-4xl sm:text-6xl font-serif text-[#1e2025] leading-[1.15] tracking-tight">
            Your complete <br />
            roadmap to exam <br />
            <span className="italic font-normal text-[#52565c]">excellence</span>
          </h1>

          <p className="text-sm sm:text-base text-[#52565c] max-w-lg leading-relaxed font-normal">
            Transform dense textbooks, complex syllabi, and lecture slides into high-yield exam notes, 5-minute revision cheat sheets, auto-generated flowcharts, and printable PDFs in under 5 seconds.
          </p>

          {/* Action Button - Soft Palette Charcoal Pill */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
            <button 
              onClick={() => navigate('/notes')}
              className="w-full sm:w-auto bg-[#1e2025] hover:bg-[#2d3037] text-white font-bold text-xs uppercase tracking-wider px-8 py-3.5 rounded-full shadow-md shadow-[#1e2025]/10 transition-all flex items-center justify-center gap-2 shrink-0"
            >
              <span>START CREATING NOTES</span>
              <FiArrowRight />
            </button>

            <button 
              onClick={() => navigate('/pricing')}
              className="w-full sm:w-auto bg-[#EDEBE0] hover:bg-[#E0E3ED] text-[#1e2025] border border-[#B2B4B7]/40 font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-full transition-all text-center"
            >
              VIEW CREDIT PLANS
            </button>
          </div>

          {/* Micro Guarantees */}
          <div className="flex flex-wrap items-center gap-5 pt-1 text-xs font-semibold text-[#52565c]">
            <span className="flex items-center gap-1.5">
              <FiCheckCircle className="text-[#1e2025] w-4 h-4" /> 50 Free Signup Credits
            </span>
            <span className="flex items-center gap-1.5">
              <FiCheckCircle className="text-[#1e2025] w-4 h-4" /> Aligned to Your Syllabus
            </span>
            <span className="flex items-center gap-1.5">
              <FiCheckCircle className="text-[#1e2025] w-4 h-4" /> Instant PDF Exports
            </span>
          </div>
        </motion.div>

        {/* Right Column Illustration Visual */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="lg:col-span-6 relative z-10"
        >
          <div className="relative rounded-3xl p-3 bg-gradient-to-br from-[#EDEBE0]/80 via-[#E0E3ED]/50 to-transparent border border-[#E0E3ED] shadow-xl">
            <img 
              src={heroImg} 
              alt="Students Studying with AI Notes" 
              className="w-full h-auto rounded-2xl object-cover"
            />
          </div>
        </motion.div>

      </section>

      {/* ================= REALISTIC SOCIAL PROOF & STATS STRIP ================= */}
      <section className="py-10 bg-[#EDEBE0]/50 border-y border-[#E0E3ED] relative z-10">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 space-y-8">
          
          {/* Top Social Proof Bar: Student Avatars & Star Ratings */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-[#B2B4B7]/30">
            
            {/* Student Avatar Stack */}
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2.5 overflow-hidden">
                <img className="inline-block h-9 w-9 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80" alt="Student" />
                <img className="inline-block h-9 w-9 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80" alt="Student" />
                <img className="inline-block h-9 w-9 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80" alt="Student" />
                <img className="inline-block h-9 w-9 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80" alt="Student" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-1 text-amber-500 text-xs">
                  ★ ★ ★ ★ ★ <span className="font-bold text-[#1e2025] ml-1">4.9/5.0</span>
                </div>
                <p className="text-xs text-[#52565c] font-semibold">
                  Trusted by 25,000+ active students this semester
                </p>
              </div>
            </div>

            {/* Verification Badge */}
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E0E3ED] shadow-xs text-xs font-bold text-[#1e2025]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Verified Syllabus Alignment Guarantee</span>
            </div>

          </div>

          {/* 4 Realistic Metric Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-left">
            <StatBox 
              icon={<FiBookOpen className="w-4 h-4 text-[#1e2025]" />}
              number="25,000+" 
              label="Exam Notes Generated" 
              subtitle="Over 2.5 million chapter pages summarized"
            />
            <StatBox 
              icon={<FiTarget className="w-4 h-4 text-[#1e2025]" />}
              number="99.4%" 
              label="Syllabus Precision" 
              subtitle="Tuned for semester & board pattern"
            />
            <StatBox 
              icon={<FiAward className="w-4 h-4 text-[#1e2025]" />}
              number="50+ Boards" 
              label="Universities & Boards" 
              subtitle="CBSE, GATE, JEE, VTU, AKTU, DU, NEET"
            />
            <StatBox 
              icon={<FiTrendingUp className="w-4 h-4 text-[#1e2025]" />}
              number="5 Seconds" 
              label="Average Generation Time" 
              subtitle="Instant PDF export & Mermaid diagrams"
            />
          </div>

          {/* Board Ticker Pills */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-[11px] font-bold text-[#52565c]">
            <span className="uppercase tracking-wider mr-2 text-[#1e2025]">Supported Syllabi:</span>
            <span className="px-3 py-1 rounded-full bg-white border border-[#E0E3ED]">B.Tech Semester Exams</span>
            <span className="px-3 py-1 rounded-full bg-white border border-[#E0E3ED]">CBSE Class 10 & 12</span>
            <span className="px-3 py-1 rounded-full bg-white border border-[#E0E3ED]">GATE & JEE Aspirants</span>
            <span className="px-3 py-1 rounded-full bg-white border border-[#E0E3ED]">VTU & AKTU Syllabus</span>
            <span className="px-3 py-1 rounded-full bg-white border border-[#E0E3ED]">Delhi & Mumbai University</span>
          </div>

        </div>
      </section>

      {/* ================= WHAT WE OFFER -> OUR OFFER SECTION ================= */}
      <section className="py-16 px-6 sm:px-12 max-w-7xl mx-auto text-center space-y-10 relative z-10">
        
        {/* Section Header */}
        <div className="space-y-2 max-w-xl mx-auto">
          <h2 className="text-3xl sm:text-5xl font-serif text-[#1e2025]">
            Our Learning Pillars
          </h2>
          <p className="text-xs sm:text-sm text-[#52565c] leading-relaxed">
            Engineered specifically to transform raw textbooks into exam-oriented mastery tools.
          </p>
        </div>

        {/* 3 Step Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          
          <OfferCard 
            icon={<FiBookOpen className="w-5 h-5 text-[#1e2025]" />}
            title="1. Deep Conceptual Notes"
            description="Structured notes with priority tags (⭐ to ⭐⭐⭐), core definitions, formulas, and key exam takeaways."
          />

          <OfferCard 
            icon={<FiZap className="w-5 h-5 text-[#1e2025]" />}
            title="2. 5-Min Rapid Revision"
            description="One-click cheat sheets optimized for active recall and last-night exam cramming."
          />

          <OfferCard 
            icon={<FiShare2 className="w-5 h-5 text-[#1e2025]" />}
            title="3. Auto Diagrams & PDFs"
            description="Automatic Mermaid flowcharts, Recharts visual analytics, and printable PDF downloads."
          />

        </div>

      </section>

      {/* ================= INTERACTIVE DEMO PREVIEW SECTION ================= */}
      <section className="py-12 px-6 sm:px-12 max-w-7xl mx-auto space-y-6 relative z-10">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-serif text-[#1e2025]">
            Test the AI Engine Yourself
          </h2>
          <p className="text-xs sm:text-sm text-[#52565c]">
            Switch tabs below to see how PrepAI formats real university exam notes.
          </p>
        </div>

        <DemoPreview />
      </section>

      {/* ================= LEARN MORE -> FEATURES BENTO SECTION ================= */}
      <section id="features" className="py-16 px-6 sm:px-12 max-w-7xl mx-auto space-y-10 relative z-10">
        
        {/* Header */}
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <h2 className="text-3xl sm:text-5xl font-serif text-[#1e2025]">
            Engineered for High Marks
          </h2>
          <p className="text-xs sm:text-sm text-[#52565c] leading-relaxed">
            Save hundreds of hours summarizing textbooks with our suite of specialized AI exam tools.
          </p>
        </div>

        {/* Features Cards Grid (No Emojis, SVG Icons Only) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <FeatureTrektCard 
            icon={<FiCpu className="w-5 h-5 text-[#1e2025]" />}
            title="Syllabus Precision Alignment"
            description="Automatically tunes generated content to your class level (Class 10, B.Tech, Medical) and target exam board (GATE, JEE, NEET, CBSE, University)."
          />

          <FeatureTrektCard 
            icon={<FiZap className="w-5 h-5 text-[#1e2025]" />}
            title="5-Minute Exam Cram Mode"
            description="Converts 20-page textbook chapters into a bulleted 1-page summary cheat sheet for fast review right before entering the exam hall."
          />

          <FeatureTrektCard 
            icon={<FiShare2 className="w-5 h-5 text-[#1e2025]" />}
            title="Auto Mermaid Flowcharts"
            description="Converts complex processes, software architecture, and biological loops into beautiful visual flowcharts that impress exam evaluators."
          />

          <FeatureTrektCard 
            icon={<FiDownload className="w-5 h-5 text-[#1e2025]" />}
            title="Printable PDF Export"
            description="One-click download of clean, formatted PDFs complete with short/long predicted question banks ready for printing or offline tablet revision."
          />

          <FeatureTrektCard 
            icon={<FiPieChart className="w-5 h-5 text-[#1e2025]" />}
            title="Visual Recharts Data"
            description="Generates dynamic bar, line, and pie charts for visual topic weightage, comparative analysis, and progress tracking."
          />

          <FeatureTrektCard 
            icon={<FiTarget className="w-5 h-5 text-[#1e2025]" />}
            title="Predicted Question Bank"
            description="Generates estimated short, long, and diagram-based questions with marks weightage allocation to test your comprehension."
          />

        </div>

      </section>

      {/* ================= DUAL PERSONA: STUDENTS & TEACHERS ================= */}
      <section className="py-14 px-6 sm:px-12 max-w-7xl mx-auto space-y-8 relative z-10">
        
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-serif text-[#1e2025]">
            Built for Both Students & Teachers
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* For Students Card */}
          <div className="p-8 rounded-3xl bg-[#EDEBE0]/60 border border-[#B2B4B7]/40 trekt-card-shadow space-y-4">
            <div className="w-10 h-10 rounded-2xl bg-[#1e2025] text-white flex items-center justify-center font-bold text-lg shadow-xs">
              <FiUsers />
            </div>
            <h3 className="text-2xl font-serif font-bold text-[#1e2025]">For University & School Students</h3>
            <p className="text-xs sm:text-sm text-[#52565c] leading-relaxed">
              Stop spending hours making handwritten notes. Generate structured chapter summaries, study predicted exam questions, and download printable PDFs in seconds.
            </p>
            <ul className="space-y-2 text-xs font-semibold text-[#1e2025] pt-1">
              <li className="flex items-center gap-2">
                <FiCheck className="text-[#1e2025] stroke-[3]" /> Ace semester exams & competitive tests
              </li>
              <li className="flex items-center gap-2">
                <FiCheck className="text-[#1e2025] stroke-[3]" /> Last-night 5-minute revision cheat sheets
              </li>
              <li className="flex items-center gap-2">
                <FiCheck className="text-[#1e2025] stroke-[3]" /> Auto visual diagrams for hard subjects
              </li>
            </ul>
          </div>

          {/* For Educators Card */}
          <div className="p-8 rounded-3xl bg-white border border-[#E0E3ED] trekt-card-shadow space-y-4">
            <div className="w-10 h-10 rounded-2xl bg-[#E0E3ED] text-[#1e2025] flex items-center justify-center font-bold text-lg border border-[#B2B4B7]/40">
              <FiAward />
            </div>
            <h3 className="text-2xl font-serif font-bold text-[#1e2025]">For Professors & Educators</h3>
            <p className="text-xs sm:text-sm text-[#52565c] leading-relaxed">
              Create lecture handouts, visual classroom flowcharts, and homework assignment question banks without manual typing.
            </p>
            <ul className="space-y-2 text-xs font-semibold text-[#1e2025] pt-1">
              <li className="flex items-center gap-2">
                <FiCheck className="text-[#1e2025] stroke-[3]" /> Generate lecture outlines & syllabus notes
              </li>
              <li className="flex items-center gap-2">
                <FiCheck className="text-[#1e2025] stroke-[3]" /> Auto Mermaid process flowcharts for slides
              </li>
              <li className="flex items-center gap-2">
                <FiCheck className="text-[#1e2025] stroke-[3]" /> Create homework & quiz question sets
              </li>
            </ul>
          </div>

        </div>

      </section>

      {/* ================= FAQ ACCORDION SECTION ================= */}
      <section className="py-14 px-6 sm:px-12 max-w-4xl mx-auto space-y-8 relative z-10">
        
        <div className="text-center space-y-2">
          <h2 className="text-3xl sm:text-4xl font-serif text-[#1e2025]">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          <FaqItem 
            index={0}
            openFaq={openFaq}
            toggleFaq={toggleFaq}
            question="How does PrepAI generate exam-specific notes?"
            answer="Our AI engine leverages Google Gemini 3.6 tuned with specialized prompts that structure content specifically for exams—including priority subtopic tagging, 5-minute revision bullet points, Mermaid flowcharts, and predicted short/long exam questions."
          />

          <FaqItem 
            index={1}
            openFaq={openFaq}
            toggleFaq={toggleFaq}
            question="Are the generated notes aligned with my syllabus?"
            answer="Yes! When entering your topic, you can specify your Class Level (e.g. B.Tech 2nd Year, Class 12) and Exam Board (e.g. CBSE, GATE, University Exams) to tune the depth and academic rigor."
          />

          <FaqItem 
            index={2}
            openFaq={openFaq}
            toggleFaq={toggleFaq}
            question="How do credits work?"
            answer="Every new signup receives 50 FREE credits immediately. Each note generation costs 10 credits (which includes full markdown notes, revision mode, Mermaid diagrams, Recharts charts, and PDF export). You can purchase additional credits anytime."
          />
        </div>

      </section>

      {/* ================= FINAL CTA BANNER ================= */}
      <section className="py-12 px-6 sm:px-12 max-w-7xl mx-auto relative z-10">
        <div className="rounded-3xl p-10 sm:p-12 bg-[#1e2025] text-white text-center space-y-5 shadow-xl">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold">
            Ready to Ace Your Exams?
          </h2>
          <p className="text-xs sm:text-sm text-[#B2B4B7] max-w-xl mx-auto font-normal">
            Join thousands of university and high school students who are saving hundreds of study hours and scoring higher marks with PrepAI.
          </p>
          <div className="pt-2">
            <button
              onClick={() => navigate('/notes')}
              className="bg-[#EDEBE0] hover:bg-white text-[#1e2025] font-extrabold text-xs uppercase tracking-wider px-8 py-3.5 rounded-full shadow-md transition-all"
            >
              CLAIM YOUR 50 FREE CREDITS NOW
            </button>
          </div>
        </div>
      </section>

      {/* Clean Light Footer */}
      <Footer />

    </div>
  );
}

function StatBox({ icon, number, label, subtitle }) {
  return (
    <div className="p-5 rounded-2xl bg-white border border-[#E0E3ED] trekt-card-shadow space-y-2 hover:-translate-y-0.5 transition-all">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-[#EDEBE0] flex items-center justify-center border border-[#B2B4B7]/40 shrink-0">
          {icon}
        </div>
        <h4 className="text-xl sm:text-2xl font-serif font-bold text-[#1e2025]">{number}</h4>
      </div>
      <div>
        <p className="text-xs font-bold text-[#1e2025]">{label}</p>
        <p className="text-[11px] font-medium text-[#52565c] leading-tight pt-0.5">{subtitle}</p>
      </div>
    </div>
  );
}

function OfferCard({ icon, title, description }) {
  return (
    <div className="p-7 rounded-3xl bg-white border border-[#E0E3ED] trekt-card-shadow text-center space-y-3 hover:-translate-y-1 transition-all">
      <div className="w-12 h-12 rounded-2xl bg-[#E0E3ED]/60 border border-[#B2B4B7]/30 flex items-center justify-center mx-auto text-[#1e2025]">
        {icon}
      </div>
      <h3 className="text-lg font-serif font-bold text-[#1e2025]">{title}</h3>
      <p className="text-xs text-[#52565c] leading-relaxed">{description}</p>
    </div>
  );
}

function FeatureTrektCard({ icon, title, description }) {
  return (
    <div className="p-6 rounded-3xl bg-white border border-[#E0E3ED] trekt-card-shadow space-y-3 hover:-translate-y-1 transition-all">
      <div className="w-10 h-10 rounded-xl bg-[#E0E3ED]/60 border border-[#B2B4B7]/30 flex items-center justify-center text-[#1e2025]">
        {icon}
      </div>
      <h3 className="text-base font-serif font-bold text-[#1e2025]">{title}</h3>
      <p className="text-xs text-[#52565c] leading-relaxed">{description}</p>
    </div>
  );
}

function FaqItem({ index, openFaq, toggleFaq, question, answer }) {
  const isOpen = openFaq === index;
  return (
    <div className="rounded-2xl bg-white border border-[#E0E3ED] shadow-xs overflow-hidden transition-all">
      <button 
        onClick={() => toggleFaq(index)}
        className="w-full p-4 sm:p-5 text-left font-serif font-bold text-[#1e2025] text-sm sm:text-base flex items-center justify-between gap-4"
      >
        <span>{question}</span>
        <div className="w-6 h-6 rounded-full bg-[#EDEBE0] text-[#1e2025] flex items-center justify-center shrink-0">
          {isOpen ? <FiChevronUp /> : <FiChevronDown />}
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="px-5 pb-4 text-xs sm:text-sm text-[#52565c] leading-relaxed border-t border-[#E0E3ED] pt-3"
          >
            {answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Home;
