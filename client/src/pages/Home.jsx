import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from "motion/react";
import heroImg from "../assets/hero_illustration.jpg";
import { 
  FiZap, 
  FiCheckCircle, 
  FiFileText, 
  FiCpu, 
  FiTrendingUp, 
  FiShield, 
  FiAward, 
  FiArrowRight, 
  FiCheck,
  FiBookOpen,
  FiShare2,
  FiDownload,
  FiChevronDown,
  FiLayers,
  FiTarget,
  FiTable,
  FiEdit3
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function Home() {
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);
  const [openFaq, setOpenFaq] = useState(null);

  // Ensure scroll is at top on mount/refresh
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#0d0d0d] text-[#1E2224] dark:text-white relative overflow-hidden font-sans selection:bg-[#EBD7BE] selection:text-[#1E2224] transition-colors duration-300">
      
      {/* Background Soft Organic Washes */}
      <div className="trekt-bg-blob-top" />
      <div className="trekt-bg-blob-center" />
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
          <h1 className="text-4xl sm:text-6xl font-serif text-[#1E2224] dark:text-white leading-[1.15] tracking-tight">
            Your complete <br />
            roadmap to exam <br />
            <span className="italic font-normal text-[#C85A32] dark:text-white">excellence</span>
          </h1>

          <p className="text-sm sm:text-base text-[#5C6468] dark:text-gray-400 max-w-lg leading-relaxed font-normal">
            Transform dense textbooks, complex syllabi, and lecture slides into high-yield exam notes, 5-minute revision cheat sheets, auto-generated flowcharts, and printable PDFs in under 5 seconds.
          </p>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
            <button 
              onClick={() => navigate(userData ? '/notes' : '/auth')}
              className="w-full sm:w-auto bg-[#C85A32] dark:bg-white hover:bg-[#B24B27] dark:hover:bg-gray-100 text-white dark:text-[#0d0d0d] font-bold text-xs uppercase tracking-wider px-8 py-3.5 rounded-full shadow-md shadow-[#C85A32]/20 dark:shadow-none transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
            >
              <span>START CREATING NOTES</span>
              <FiArrowRight />
            </button>

            <button 
              onClick={() => navigate('/pricing')}
              className="w-full sm:w-auto bg-white dark:bg-[#161616] hover:bg-[#F5EBE1] dark:hover:bg-[#222222] text-[#2B5866] dark:text-white border border-[#E8DFD5] dark:border-[#262626] font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-full transition-all text-center cursor-pointer shadow-xs"
            >
              VIEW CREDIT PLANS
            </button>
          </div>

          {/* Micro Guarantees */}
          <div className="flex flex-wrap items-center gap-5 pt-1 text-xs font-semibold text-[#5C6468] dark:text-gray-400">
            <span className="flex items-center gap-1.5">
              <FiCheckCircle className="text-[#6B7B52] dark:text-emerald-400 w-4 h-4" /> 50 Free Signup Credits
            </span>
            <span className="flex items-center gap-1.5">
              <FiCheckCircle className="text-[#6B7B52] dark:text-emerald-400 w-4 h-4" /> Aligned to Your Syllabus
            </span>
            <span className="flex items-center gap-1.5">
              <FiCheckCircle className="text-[#6B7B52] dark:text-emerald-400 w-4 h-4" /> Instant PDF Exports
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
          <div className="relative rounded-3xl p-3 bg-gradient-to-br from-white via-[#F5EBE1] to-[#EBD7BE]/40 dark:from-[#1a1a1a] dark:via-[#161616] dark:to-[#121212] border border-[#E8DFD5] dark:border-[#262626] shadow-xl">
            <img 
              src={heroImg} 
              alt="Students Studying with AI Notes" 
              className="w-full h-auto rounded-2xl object-cover"
            />
          </div>
        </motion.div>

      </section>

      {/* ================= SOCIAL PROOF & STATS STRIP ================= */}
      <section className="py-10 bg-white/60 dark:bg-[#141414]/80 border-y border-[#E8DFD5] dark:border-[#262626] relative z-10">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 space-y-8">
          
          {/* Top Social Proof Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-[#E8DFD5] dark:border-[#262626]">
            
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2.5 overflow-hidden">
                <img className="inline-block h-9 w-9 rounded-full ring-2 ring-white dark:ring-[#161616] object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80" alt="Student" />
                <img className="inline-block h-9 w-9 rounded-full ring-2 ring-white dark:ring-[#161616] object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80" alt="Student" />
                <img className="inline-block h-9 w-9 rounded-full ring-2 ring-white dark:ring-[#161616] object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80" alt="Student" />
                <img className="inline-block h-9 w-9 rounded-full ring-2 ring-white dark:ring-[#161616] object-cover" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80" alt="Student" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-1 text-[#DA9B42] dark:text-amber-400 text-xs">
                  ★ ★ ★ ★ ★ <span className="font-bold text-[#1E2224] dark:text-white ml-1">4.9/5.0</span>
                </div>
                <p className="text-xs text-[#5C6468] dark:text-gray-400 font-semibold">
                  Trusted by 25,000+ active students this semester
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-[#6B7B52] dark:text-emerald-400">
              <FiCheckCircle className="w-4 h-4" />
              <span>Verified Syllabus Alignment Guarantee</span>
            </div>

          </div>

          {/* 4 Metric Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-left">
            <StatBox 
              icon={<FiBookOpen className="w-4 h-4 text-[#C85A32] dark:text-white" />}
              number="25,000+" 
              label="Exam Notes Generated" 
              subtitle="Over 2.5 million chapter pages summarized"
            />
            <StatBox 
              icon={<FiTarget className="w-4 h-4 text-[#2B5866] dark:text-teal-400" />}
              number="99.4%" 
              label="Syllabus Precision" 
              subtitle="Tuned for semester & board pattern"
            />
            <StatBox 
              icon={<FiAward className="w-4 h-4 text-[#DA9B42] dark:text-amber-400" />}
              number="50+ Boards" 
              label="Universities & Boards" 
              subtitle="CBSE, GATE, JEE, VTU, AKTU, DU, NEET"
            />
            <StatBox 
              icon={<FiTrendingUp className="w-4 h-4 text-[#6B7B52] dark:text-emerald-400" />}
              number="5 Seconds" 
              label="Average Generation Time" 
              subtitle="Instant PDF export & Mermaid diagrams"
            />
          </div>

          {/* Supported Syllabi List */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-[#5C6468] dark:text-gray-400">
            <span className="uppercase tracking-wider font-extrabold text-[#1E2224] dark:text-white">Supported Syllabi:</span>
            <span>B.Tech Semester Exams</span>
            <span>•</span>
            <span>CBSE Class 10 & 12</span>
            <span>•</span>
            <span>GATE & JEE Aspirants</span>
            <span>•</span>
            <span>VTU & AKTU Syllabus</span>
            <span>•</span>
            <span>Delhi & Mumbai University</span>
          </div>

        </div>
      </section>

      {/* ================= WHAT WE OFFER ================= */}
      <section className="py-16 px-6 sm:px-12 max-w-7xl mx-auto text-center space-y-10 relative z-10">
        
        <div className="space-y-2 max-w-xl mx-auto">
          <h2 className="text-3xl sm:text-5xl font-serif text-[#1E2224] dark:text-white">
            Our Learning Pillars
          </h2>
          <p className="text-xs sm:text-sm text-[#5C6468] dark:text-gray-400">
            Engineered precisely for semester exams, competitive entrances, and board papers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <OfferCard 
            icon={<FiBookOpen className="w-6 h-6 text-[#C85A32] dark:text-white" />}
            title="Instant Concept Notes"
            description="Deep dive into complex theoretical concepts, formula derivations, code samples, and university syllabus requirements in seconds."
          />

          <OfferCard 
            icon={<FiZap className="w-6 h-6 text-[#DA9B42] dark:text-amber-400" />}
            title="5-Minute Rapid Revision"
            description="Bullet point summaries, crucial keywords, and formula sheets designed specifically for rapid review right before exam time."
          />

          <OfferCard 
            icon={<FiShare2 className="w-6 h-6 text-[#2B5866] dark:text-teal-400" />}
            title="Visual Flowcharts & Diagrams"
            description="Interactive Mermaid syntax flowcharts, system architecture diagrams, and visual concept maps generated automatically."
          />
        </div>

      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section id="how-it-works" className="py-16 px-6 sm:px-12 max-w-7xl mx-auto space-y-10 relative z-10">
        
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-serif text-[#1E2224] dark:text-white">
            How PrepAI Works
          </h2>
          <p className="text-xs sm:text-sm text-[#5C6468] dark:text-gray-400">
            From dense textbook syllabus to exam-ready mastery in seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          
          {/* Step 1 */}
          <div className="p-8 rounded-3xl bg-white dark:bg-[#161616] border border-[#E8DFD5] dark:border-[#262626] trekt-card-shadow trekt-card-hover space-y-5 relative">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-[#F5EBE1] dark:bg-[#222222] border border-[#E8DFD5] dark:border-[#303030] flex items-center justify-center text-[#C85A32] dark:text-white">
                <FiEdit3 className="w-6 h-6" />
              </div>
              <span className="text-3xl font-serif font-bold text-[#EBD7BE] dark:text-[#333333] select-none">
                01
              </span>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-serif font-bold text-[#1E2224] dark:text-white">
                Input Topic & Choose Format
              </h3>
              <p className="text-xs text-[#5C6468] dark:text-gray-400 leading-relaxed font-medium">
                Enter any chapter topic or module from your syllabus. Pick your desired output: Deep Concept Notes, 5-Minute Revision Sheet, or Flowcharts.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-8 rounded-3xl bg-white dark:bg-[#161616] border border-[#E8DFD5] dark:border-[#262626] trekt-card-shadow trekt-card-hover space-y-5 relative">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-[#FAF0DC] dark:bg-[#222222] border border-[#DA9B42]/30 dark:border-[#303030] flex items-center justify-center text-[#DA9B42] dark:text-amber-400">
                <FiCpu className="w-6 h-6" />
              </div>
              <span className="text-3xl font-serif font-bold text-[#EBD7BE] dark:text-[#333333] select-none">
                02
              </span>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-serif font-bold text-[#1E2224] dark:text-white">
                AI Synthesizes High-Yield Notes
              </h3>
              <p className="text-xs text-[#5C6468] dark:text-gray-400 leading-relaxed font-medium">
                Our fine-tuned academic models structure high-yield concepts, key formulas, priority star weightage, and interactive Mermaid diagrams in under 5 seconds.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-8 rounded-3xl bg-white dark:bg-[#161616] border border-[#E8DFD5] dark:border-[#262626] trekt-card-shadow trekt-card-hover space-y-5 relative">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-[#E4ECEF] dark:bg-[#222222] border border-[#2B5866]/20 dark:border-[#303030] flex items-center justify-center text-[#2B5866] dark:text-teal-400">
                <FiDownload className="w-6 h-6" />
              </div>
              <span className="text-3xl font-serif font-bold text-[#EBD7BE] dark:text-[#333333] select-none">
                03
              </span>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-serif font-bold text-[#1E2224] dark:text-white">
                Revise & Download Printable PDF
              </h3>
              <p className="text-xs text-[#5C6468] dark:text-gray-400 leading-relaxed font-medium">
                Review key formulas, test yourself with predicted 2, 5, and 10 mark exam questions, or download a clean, printable PDF to study offline anytime.
              </p>
            </div>
          </div>

        </div>

      </section>

      {/* ================= CLEAN INTERACTIVE SAMPLE PREVIEW ================= */}
      <DemoPreview />

      {/* ================= FEATURES GRID ================= */}
      <section id="features" className="py-16 px-6 sm:px-12 max-w-7xl mx-auto space-y-10 relative z-10">
        
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-serif text-[#1E2224] dark:text-white">
            Supercharged Exam Preparation Features
          </h2>
          <p className="text-xs sm:text-sm text-[#5C6468] dark:text-gray-400">
            Everything you need to study smarter, retain longer, and score top marks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureTrektCard 
            icon={<FiAward className="w-5 h-5 text-[#C85A32] dark:text-white" />}
            title="Exam Question Prediction"
            description="Anticipate 2-mark, 5-mark, and 10-mark questions with model answer structures based on frequent exam trends."
          />
          <FeatureTrektCard 
            icon={<FiDownload className="w-5 h-5 text-[#DA9B42] dark:text-amber-400" />}
            title="Clean Printable PDF Export"
            description="Download pristine, watermarked, print-ready PDFs formatted cleanly for offline study and quick revision sessions."
          />
          <FeatureTrektCard 
            icon={<FiCpu className="w-5 h-5 text-[#6B7B52] dark:text-emerald-400" />}
            title="Multi-Model AI Engine"
            description="Powered by specialized Gemini models fine-tuned to extract academic clarity without filler text or hallucinations."
          />
        </div>

      </section>

      {/* ================= STUDENT VS TEACHER PERSONAS ================= */}
      <section className="py-16 px-6 sm:px-12 max-w-7xl mx-auto space-y-8 relative z-10">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-serif text-[#1E2224] dark:text-white">
            Tailored For Both Students & Educators
          </h2>
          <p className="text-xs sm:text-sm text-[#5C6468] dark:text-gray-400">
            Empowering individual learners and academic institutions alike.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Student Persona Card */}
          <div className="p-8 rounded-3xl bg-white dark:bg-[#161616] border border-[#E8DFD5] dark:border-[#262626] trekt-card-shadow trekt-card-hover space-y-4">
            <div className="w-10 h-10 rounded-2xl bg-[#F5EBE1] dark:bg-[#222222] border border-[#E8DFD5] dark:border-[#303030] text-[#C85A32] dark:text-white flex items-center justify-center font-bold text-lg">
              🎓
            </div>
            <h3 className="text-xl font-serif font-bold text-[#1E2224] dark:text-white">For College & School Students</h3>
            <p className="text-xs text-[#5C6468] dark:text-gray-400 leading-relaxed">
              Ace your upcoming semester finals and board exams in less study time. Generate concise revision sheets right before entering the exam hall.
            </p>
            <ul className="space-y-2 pt-2 text-xs font-semibold text-[#1E2224] dark:text-gray-200">
              <li className="flex items-center gap-2">
                <FiCheck className="text-[#6B7B52] dark:text-emerald-400 shrink-0" /> Rapid last-minute revision summaries
              </li>
              <li className="flex items-center gap-2">
                <FiCheck className="text-[#6B7B52] dark:text-emerald-400 shrink-0" /> Visual Mermaid diagrams for complex concepts
              </li>
              <li className="flex items-center gap-2">
                <FiCheck className="text-[#6B7B52] dark:text-emerald-400 shrink-0" /> Predicted high-probability exam questions
              </li>
            </ul>
          </div>

          {/* Teacher Persona Card */}
          <div className="p-8 rounded-3xl bg-white dark:bg-[#161616] border border-[#E8DFD5] dark:border-[#262626] trekt-card-shadow trekt-card-hover space-y-4">
            <div className="w-10 h-10 rounded-2xl bg-[#E4ECEF] dark:bg-[#222222] border border-[#E8DFD5] dark:border-[#303030] text-[#2B5866] dark:text-teal-400 flex items-center justify-center font-bold text-lg">
              👨‍🏫
            </div>
            <h3 className="text-xl font-serif font-bold text-[#1E2224] dark:text-white">For Educators & Teachers</h3>
            <p className="text-xs text-[#5C6468] dark:text-gray-400 leading-relaxed">
              Generate classroom handouts, slide visual flowcharts, and structured question banks for your students with minimum prep time.
            </p>
            <ul className="space-y-2 pt-2 text-xs font-semibold text-[#1E2224] dark:text-gray-200">
              <li className="flex items-center gap-2">
                <FiCheck className="text-[#6B7B52] dark:text-emerald-400 shrink-0" /> Ready-to-print lecture handouts & cheat sheets
              </li>
              <li className="flex items-center gap-2">
                <FiCheck className="text-[#6B7B52] dark:text-emerald-400 shrink-0" /> Embeddable visual system architecture diagrams
              </li>
              <li className="flex items-center gap-2">
                <FiCheck className="text-[#6B7B52] dark:text-emerald-400 shrink-0" /> Formatted assignment & internal assessment tests
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ================= FAQ SECTION ================= */}
      <section className="py-16 px-6 sm:px-12 max-w-4xl mx-auto space-y-8 relative z-10">
        
        <div className="text-center space-y-2">
          <h2 className="text-3xl sm:text-4xl font-serif text-[#1E2224] dark:text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-[#5C6468] dark:text-gray-400">
            Got questions? We've got answers.
          </p>
        </div>

        <div className="space-y-3">
          <FaqItem 
            index={0}
            openFaq={openFaq}
            toggleFaq={toggleFaq}
            question="How accurate are the generated exam notes?"
            answer="PrepAI notes are powered by advanced academic LLM prompts that strictly stick to structured textbook definitions, formulas, and syllabus requirements without hallucinating facts."
          />
          <FaqItem 
            index={1}
            openFaq={openFaq}
            toggleFaq={toggleFaq}
            question="Can I download the generated notes as PDF?"
            answer="Yes! Every generated note has a one-click 'Download PDF' button that generates a clean, beautifully formatted, printable PDF document."
          />
          <FaqItem 
            index={2}
            openFaq={openFaq}
            toggleFaq={toggleFaq}
            question="Are Mermaid diagrams supported in all notes?"
            answer="Yes! Whenever a topic involves processes, cycles, algorithms, or architectures, PrepAI automatically generates an interactive visual flowchart using Mermaid.js."
          />
          <FaqItem 
            index={3}
            openFaq={openFaq}
            toggleFaq={toggleFaq}
            question="How do credits work?"
            answer="Every new signup receives 50 FREE credits immediately. Each note generation costs 10 credits (which includes full markdown notes, revision mode, Mermaid diagrams, Recharts charts, and PDF export). You can purchase additional credits anytime."
          />
        </div>

      </section>

      {/* ================= FINAL CTA BANNER ================= */}
      <section className="py-12 px-6 sm:px-12 max-w-7xl mx-auto relative z-10">
        <div className="rounded-3xl p-10 sm:p-12 bg-gradient-to-br from-[#2B5866] to-[#1E3B45] dark:from-[#1a1a1a] dark:to-[#121212] text-white text-center space-y-5 shadow-xl border border-[#2B5866]/30 dark:border-[#262626]">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold">
            Ready to Ace Your Exams?
          </h2>
          <p className="text-xs sm:text-sm text-[#EBD7BE] dark:text-gray-300 max-w-xl mx-auto font-normal">
            Join thousands of university and high school students who are saving hundreds of study hours and scoring higher marks with PrepAI.
          </p>
          <div className="pt-2">
            <button
              onClick={() => navigate(userData ? '/notes' : '/auth')}
              className="bg-[#DA9B42] dark:bg-white hover:bg-[#C0842E] dark:hover:bg-gray-100 text-white dark:text-[#0d0d0d] font-extrabold text-xs uppercase tracking-wider px-8 py-3.5 rounded-full shadow-lg transition-all cursor-pointer"
            >
              CLAIM YOUR 50 FREE CREDITS NOW
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

    </div>
  );
}

function StatBox({ icon, number, label, subtitle }) {
  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-[#161616] border border-[#E8DFD5] dark:border-[#262626] trekt-card-shadow trekt-card-hover space-y-3">
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-xl bg-[#FAF7F2] dark:bg-[#222222] border border-[#E8DFD5] dark:border-[#303030]">
          {icon}
        </div>
        <span className="text-xs font-bold text-[#5C6468] dark:text-gray-400">{label}</span>
      </div>
      <div className="text-2xl font-serif font-bold text-[#1E2224] dark:text-white">{number}</div>
      <p className="text-[11px] text-[#5C6468] dark:text-gray-400 leading-snug">{subtitle}</p>
    </div>
  );
}

function OfferCard({ icon, title, description }) {
  return (
    <div className="p-8 rounded-3xl bg-white dark:bg-[#161616] border border-[#E8DFD5] dark:border-[#262626] trekt-card-shadow trekt-card-hover space-y-4">
      <div className="w-12 h-12 rounded-2xl bg-[#FAF7F2] dark:bg-[#222222] border border-[#E8DFD5] dark:border-[#303030] flex items-center justify-center">
        {icon}
      </div>
      <h3 className="text-xl font-serif font-bold text-[#1E2224] dark:text-white">{title}</h3>
      <p className="text-xs text-[#5C6468] dark:text-gray-400 leading-relaxed">{description}</p>
    </div>
  );
}

function FeatureTrektCard({ icon, title, description }) {
  return (
    <div className="p-8 rounded-3xl bg-white dark:bg-[#161616] border border-[#E8DFD5] dark:border-[#262626] trekt-card-shadow trekt-card-hover space-y-4">
      <div className="w-12 h-12 rounded-2xl bg-[#FAF7F2] dark:bg-[#222222] border border-[#E8DFD5] dark:border-[#303030] flex items-center justify-center">
        {icon}
      </div>
      <h3 className="text-xl font-serif font-bold text-[#1E2224] dark:text-white">{title}</h3>
      <p className="text-xs text-[#5C6468] dark:text-gray-400 leading-relaxed">{description}</p>
    </div>
  );
}

function DemoPreview() {
  const [activeTab, setActiveTab] = useState('revision');

  return (
    <section className="py-12 px-6 sm:px-12 max-w-5xl mx-auto relative z-10">
      <div className="rounded-3xl bg-white dark:bg-[#161616] border border-[#E8DFD5] dark:border-[#262626] trekt-card-shadow trekt-card-hover overflow-hidden">
        
        {/* Simple Clean Header with Tabs */}
        <div className="p-4 sm:p-5 border-b border-[#E8DFD5] dark:border-[#262626] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FAF7F2] dark:bg-[#1a1a1a]">
          <div className="flex items-center gap-2">
            <span className="text-xs font-serif font-bold text-[#1E2224] dark:text-white">Sample Topic:</span>
            <span className="text-xs font-semibold text-[#5C6468] dark:text-gray-300">DBMS Normalization & BCNF</span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('notes')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                activeTab === 'notes'
                  ? 'bg-[#C85A32] dark:bg-white text-white dark:text-[#0d0d0d]'
                  : 'bg-white dark:bg-[#222222] text-[#5C6468] dark:text-gray-400 hover:text-[#1E2224] border border-[#E8DFD5] dark:border-[#303030]'
              }`}
            >
              Concept Notes
            </button>
            <button
              onClick={() => setActiveTab('revision')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                activeTab === 'revision'
                  ? 'bg-[#C85A32] dark:bg-white text-white dark:text-[#0d0d0d]'
                  : 'bg-white dark:bg-[#222222] text-[#5C6468] dark:text-gray-400 hover:text-[#1E2224] border border-[#E8DFD5] dark:border-[#303030]'
              }`}
            >
              5-Min Revision
            </button>
            <button
              onClick={() => setActiveTab('flowchart')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                activeTab === 'flowchart'
                  ? 'bg-[#C85A32] dark:bg-white text-white dark:text-[#0d0d0d]'
                  : 'bg-white dark:bg-[#222222] text-[#5C6468] dark:text-gray-400 hover:text-[#1E2224] border border-[#E8DFD5] dark:border-[#303030]'
              }`}
            >
              Visual Flowchart
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 text-left space-y-4">
          {activeTab === 'notes' && (
            <div className="space-y-3">
              <h4 className="text-xl font-serif font-bold text-[#1E2224] dark:text-white">
                1. Boyce-Codd Normal Form (BCNF)
              </h4>
              <p className="text-xs sm:text-sm text-[#5C6468] dark:text-gray-300 leading-relaxed">
                A relation R is in BCNF if and only if every determinant is a candidate key. That is, for every non-trivial functional dependency X → Y, X must be a superkey of R.
              </p>
              <div className="p-4 rounded-2xl bg-[#FAF0DC] dark:bg-[#222222] border border-[#DA9B42]/30 dark:border-[#303030] text-xs font-semibold text-[#B86337] dark:text-amber-400">
                ⚡ <strong>Exam Key Rule:</strong> BCNF is strictly stronger than 3NF. Every relation in BCNF is also in 3NF, but the converse is not always true.
              </div>
            </div>
          )}

          {activeTab === 'revision' && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-[#C85A32] dark:text-amber-400">
                <FiZap className="w-4 h-4" />
                <h4 className="text-xl font-serif font-bold text-[#1E2224] dark:text-white">
                  5-Minute Rapid Revision Takeaways
                </h4>
              </div>
              <ul className="list-disc ml-5 text-xs sm:text-sm text-[#5C6468] dark:text-gray-300 space-y-2 leading-relaxed">
                <li><strong>1NF:</strong> Eliminates duplicate columns and guarantees atomic column values.</li>
                <li><strong>2NF:</strong> Meets 1NF requirements and removes partial functional dependencies.</li>
                <li><strong>3NF:</strong> Meets 2NF requirements and removes transitive functional dependencies.</li>
                <li><strong>BCNF:</strong> For every functional dependency X → Y, X must be a valid super key.</li>
              </ul>
            </div>
          )}

          {activeTab === 'flowchart' && (
            <div className="p-6 rounded-2xl bg-[#FAF7F2] dark:bg-[#1a1a1a] border border-[#E8DFD5] dark:border-[#262626] flex items-center justify-center">
              <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-extrabold text-[#1E2224] dark:text-white">
                <span className="p-3 rounded-xl bg-white dark:bg-[#222222] border border-[#E8DFD5] dark:border-[#303030]">Unnormalized Table</span>
                <span>➔</span>
                <span className="p-3 rounded-xl bg-white dark:bg-[#222222] border border-[#E8DFD5] dark:border-[#303030]">1NF (Atomic Data)</span>
                <span>➔</span>
                <span className="p-3 rounded-xl bg-white dark:bg-[#222222] border border-[#E8DFD5] dark:border-[#303030]">2NF (No Partial Dep)</span>
                <span>➔</span>
                <span className="p-3 rounded-xl bg-[#2B5866] dark:bg-white text-white dark:text-[#0d0d0d]">BCNF Complete</span>
              </div>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}

function FaqItem({ index, openFaq, toggleFaq, question, answer }) {
  const isOpen = openFaq === index;

  return (
    <div className="rounded-3xl bg-white dark:bg-[#161616] border border-[#E8DFD5] dark:border-[#262626] overflow-hidden trekt-card-shadow trekt-card-hover transition-all">
      <button
        onClick={() => toggleFaq(index)}
        className="w-full p-5 sm:p-6 text-left font-serif font-bold text-base text-[#1E2224] dark:text-white flex items-center justify-between gap-4 cursor-pointer"
      >
        <span>{question}</span>
        <FiChevronDown className={`w-4 h-4 text-[#5C6468] transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#C85A32]' : ''}`} />
      </button>
      {isOpen && (
        <div className="px-5 sm:px-6 pb-6 text-xs text-[#5C6468] dark:text-gray-400 leading-relaxed border-t border-[#E8DFD5]/40 dark:border-[#262626] pt-3">
          {answer}
        </div>
      )}
    </div>
  );
}

export default Home;
