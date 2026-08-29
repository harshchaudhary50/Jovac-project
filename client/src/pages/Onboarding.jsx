import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import axios from 'axios';
import { serverUrl } from '../App';
import { setUserData } from '../redux/userSlice';
import { 
  FiCheck, 
  FiArrowRight, 
  FiArrowLeft, 
  FiBookOpen, 
  FiUsers, 
  FiAward, 
  FiZap, 
  FiTarget,
  FiCheckCircle,
  FiFileText,
  FiShare2
} from 'react-icons/fi';

function Onboarding() {
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [role, setRole] = useState('');
  
  // Student State
  const [course, setCourse] = useState('');
  const [customCourse, setCustomCourse] = useState('');
  const [semester, setSemester] = useState('');
  const [preferredNoteType, setPreferredNoteType] = useState('');

  // Teacher State
  const [teacherDept, setTeacherDept] = useState('');
  const [teacherAudience, setTeacherAudience] = useState('');
  const [teacherMaterialType, setTeacherMaterialType] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompletedScreen, setIsCompletedScreen] = useState(false);

  const isCurrentStepValid = () => {
    if (step === 1) return role !== '';
    if (step === 2) {
      if (role === 'Student') {
        if (course === 'Custom Course / Subject') return customCourse.trim().length > 0;
        return course !== '';
      }
      return teacherDept !== '';
    }
    if (step === 3) {
      if (role === 'Student') return semester !== '';
      return teacherAudience !== '';
    }
    if (step === 4) {
      if (role === 'Student') return preferredNoteType !== '';
      return teacherMaterialType !== '';
    }
    return false;
  };

  const studentCoursePresets = [
    'B.Tech Computer Science & IT',
    'B.Tech Electronics & Mechanical',
    'Class 12 CBSE Science (PCM / PCB)',
    'Class 10 CBSE Board Prep',
    'Medical / MBBS / NEET Aspirant',
    'Commerce & BBA / CA Prep',
    'Custom Course / Subject'
  ];

  const studentSemesterPresets = [
    'Semester 1 - 2 (1st Year)',
    'Semester 3 - 4 (2nd Year)',
    'Semester 5 - 6 (3rd Year)',
    'Semester 7 - 8 (Final Year)',
    'Class 10 Board',
    'Class 12 Board',
    'GATE / JEE Competitive Exam'
  ];

  const studentNoteTypeOptions = [
    {
      title: 'Deep Concept Notes',
      icon: <FiBookOpen className="w-4 h-4 text-[#C85A32] dark:text-amber-400" />,
      desc: 'Full chapter explanations with key definitions, formulas, priority tags, and exam takeaways.'
    },
    {
      title: '5-Minute Rapid Revision Sheets',
      icon: <FiZap className="w-4 h-4 text-[#DA9B42] dark:text-amber-400" />,
      desc: 'Bulleted summary cheat sheets designed specifically for rapid review right before exams.'
    },
    {
      title: 'Predicted Exam Question Banks',
      icon: <FiTarget className="w-4 h-4 text-[#6B7B52] dark:text-emerald-400" />,
      desc: 'Short, long, and diagram-based questions with estimated marks allocation.'
    },
    {
      title: 'Visual Flowcharts & Diagrams',
      icon: <FiShare2 className="w-4 h-4 text-[#2B5866] dark:text-teal-400" />,
      desc: 'Mermaid code architecture diagrams & data charts to ace diagram-heavy questions.'
    }
  ];

  const teacherDeptPresets = [
    'Computer Science & Engineering',
    'Electrical & Electronics',
    'Mechanical & Civil Engineering',
    'Physics & Chemistry Sciences',
    'Mathematics & Statistics',
    'Management & Humanities',
    'High School Science & Maths'
  ];

  const teacherAudiencePresets = [
    'Undergraduate College Students',
    'Postgraduate / Masters Students',
    'High School Students (Class 9-12)',
    'Competitive Exam Aspirants',
    'Corporate / Professional Learners'
  ];

  const teacherMaterialOptions = [
    {
      title: 'Lecture Handouts & Concept Guides',
      icon: <FiFileText className="w-4 h-4 text-[#2B5866] dark:text-teal-400" />,
      desc: 'Clean, printable summary materials ready to distribute to students before classes.'
    },
    {
      title: 'Assignment & Exam Question Sets',
      icon: <FiTarget className="w-4 h-4 text-[#C85A32] dark:text-amber-400" />,
      desc: 'Predictive question sets categorized by marking weightage (2-15 marks).'
    },
    {
      title: 'Classroom Flowcharts & Slide Diagrams',
      icon: <FiShare2 className="w-4 h-4 text-[#6B7B52] dark:text-emerald-400" />,
      desc: 'Interactive Mermaid diagrams ready for presentation slides and blackboards.'
    },
    {
      title: 'Rapid Revision Cheat Sheets',
      icon: <FiZap className="w-4 h-4 text-[#DA9B42] dark:text-amber-400" />,
      desc: 'High-yield 1-pager formulas and summaries for quick pre-exam recap.'
    }
  ];

  const handleNextStep = async () => {
    if (!isCurrentStepValid()) return;

    if (step < 4) {
      setStep(step + 1);
    } else {
      // Final Step Submission
      setIsSubmitting(true);
      try {
        const finalCourse = role === 'Student' ? (course === 'Custom Course / Subject' ? customCourse : course) : teacherDept;
        const finalSemester = role === 'Student' ? semester : teacherAudience;
        const finalNoteType = role === 'Student' ? preferredNoteType : teacherMaterialType;

        const payload = {
          role,
          course: finalCourse,
          semester: finalSemester,
          preferredNoteType: finalNoteType,
          teacherDept,
          teacherAudience,
          teacherMaterialType
        };

        const res = await axios.post(`${serverUrl}/api/user/onboarding`, payload, {
          withCredentials: true
        });

        if (res.data) {
          dispatch(setUserData({ ...res.data, onboardingCompleted: true }));
        } else {
          dispatch(setUserData({
            ...userData,
            role,
            course: finalCourse,
            semester: finalSemester,
            preferredNoteType: finalNoteType,
            onboardingCompleted: true
          }));
        }
        setIsCompletedScreen(true);
      } catch (err) {
        console.error('Onboarding Save Error:', err);
        const fallbackCourse = role === 'Student' ? (course === 'Custom Course / Subject' ? customCourse : course) : teacherDept;
        const fallbackSemester = role === 'Student' ? semester : teacherAudience;
        const fallbackNoteType = role === 'Student' ? preferredNoteType : teacherMaterialType;
        dispatch(setUserData({
          ...userData,
          role: role || "Student",
          course: fallbackCourse || "General Studies",
          semester: fallbackSemester || "Current Term",
          preferredNoteType: fallbackNoteType || "Deep Concept Notes",
          onboardingCompleted: true
        }));
        setIsCompletedScreen(true);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handlePrevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#0d0d0d] text-[#1E2224] dark:text-white flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden font-sans selection:bg-[#EBD7BE] transition-colors duration-300">
      
      {/* Background Soft Washes */}
      <div className="trekt-bg-blob-top" />
      <div className="trekt-bg-blob-bottom" />

      {/* Brand Header */}
      <header className="absolute top-6 left-6 sm:left-12 flex items-center gap-2.5 z-20">
        <img 
          src="/logo.png" 
          alt="NoteX Logo" 
          className="w-8 h-8 rounded-xl object-contain shadow-xs border border-[#EBD7BE] dark:border-[#303030]" 
        />
        <span className="text-lg font-bold tracking-tight text-[#1E2224] dark:text-white font-sans">
          Note<span className="text-[#C85A32] dark:text-white font-extrabold">X</span>
        </span>
      </header>

      {/* THANK YOU COMPLETION SCREEN */}
      {isCompletedScreen ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-white dark:bg-[#161616] rounded-3xl border border-[#E8DFD5] dark:border-[#262626] trekt-card-shadow p-8 text-center space-y-6 relative z-10 shadow-2xl"
        >
          {/* Green Badge */}
          <div className="w-12 h-12 rounded-2xl bg-[#EDF2E8] dark:bg-emerald-950/40 border border-[#6B7B52]/30 dark:border-emerald-800/40 text-[#6B7B52] dark:text-emerald-400 flex items-center justify-center mx-auto shadow-xs">
            <FiCheckCircle className="w-6 h-6 stroke-[2.5]" />
          </div>

          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1E2224] dark:text-white">
              Thank you for your time! 🎉
            </h2>
            <p className="text-xs text-[#5C6468] dark:text-gray-400 leading-relaxed max-w-xs mx-auto">
              Your profile has been saved. AI generation is now customized for your <span className="font-bold text-[#C85A32] dark:text-amber-400">{role || "Student"}</span> profile.
            </p>
          </div>

          {/* Profile Summary Box */}
          <div className="p-3.5 rounded-2xl bg-[#FAF7F2] dark:bg-[#222222] border border-[#E8DFD5] dark:border-[#303030] space-y-1.5 text-xs text-[#1E2224] dark:text-white">
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-[#5C6468] dark:text-gray-400 font-medium">Role:</span>
              <span className="font-bold">{role || "Student"}</span>
            </div>
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-[#5C6468] dark:text-gray-400 font-medium">{role === 'Teacher' ? 'Department:' : 'Course:'}</span>
              <span className="font-bold truncate max-w-[200px]">{role === 'Teacher' ? teacherDept : (course === 'Custom Course / Subject' ? customCourse : course) || "General Studies"}</span>
            </div>
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-[#5C6468] dark:text-gray-400 font-medium">{role === 'Teacher' ? 'Audience:' : 'Semester/Class:'}</span>
              <span className="font-bold truncate max-w-[200px]">{role === 'Teacher' ? teacherAudience : semester || "Current Term"}</span>
            </div>
            <div className="flex justify-between items-center text-[11px] pt-1 border-t border-[#E8DFD5] dark:border-[#303030]">
              <span className="text-[#5C6468] dark:text-gray-400 font-medium">Credits Active:</span>
              <span className="font-bold text-[#6B7B52] dark:text-emerald-400">⚡ 50 Free Signup Credits</span>
            </div>
          </div>

          <button
            onClick={() => {
              const finalCourse = role === 'Student' ? (course === 'Custom Course / Subject' ? customCourse : course) : teacherDept;
              const finalSemester = role === 'Student' ? semester : teacherAudience;
              const finalNoteType = role === 'Student' ? preferredNoteType : teacherMaterialType;
              dispatch(setUserData({
                ...userData,
                role: role || "Student",
                course: finalCourse || "General Studies",
                semester: finalSemester || "Current Term",
                preferredNoteType: finalNoteType || "Deep Concept Notes",
                onboardingCompleted: true
              }));
              navigate('/dashboard');
            }}
            className="w-full py-3 rounded-full bg-[#C85A32] dark:bg-white hover:bg-[#B24B27] dark:hover:bg-gray-100 text-white dark:text-[#0d0d0d] text-xs font-bold uppercase tracking-wider transition shadow-md shadow-[#C85A32]/20 dark:shadow-none flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>LAUNCH MY DASHBOARD</span>
            <FiArrowRight />
          </button>
        </motion.div>
      ) : (
        /* 4-STEP WIZARD */
        <div className="w-full max-w-xl bg-white dark:bg-[#161616] rounded-3xl border border-[#E8DFD5] dark:border-[#262626] trekt-card-shadow p-6 sm:p-9 relative z-10 space-y-6 shadow-2xl">
          
          {/* Header & Step Indicator Bar */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[#5C6468] dark:text-gray-400">
              <span className="flex items-center gap-1.5 text-[#1E2224] dark:text-white">
                <span className="w-2 h-2 rounded-full bg-[#C85A32] dark:bg-white" />
                {role || 'Study'} Personalization Setup
              </span>
              <span>Step {step} of 4</span>
            </div>

            {/* Progress Indicator Line */}
            <div className="w-full h-1.5 bg-[#FAF7F2] dark:bg-[#222222] rounded-full overflow-hidden border border-[#E8DFD5] dark:border-[#303030]">
              <motion.div 
                className="h-full bg-[#C85A32] dark:bg-white"
                animate={{ width: `${(step / 4) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Wizard Step Content Switcher */}
          <AnimatePresence mode="wait">
            
            {/* STEP 1: Role Selection */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                className="space-y-5"
              >
                <div className="space-y-1">
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1E2224] dark:text-white">
                    What best describes your primary role?
                  </h2>
                  <p className="text-xs text-[#5C6468] dark:text-gray-400">
                    Please select an option below to continue.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <button
                    type="button"
                    onClick={() => setRole('Student')}
                    className={`p-5 rounded-2xl border text-left transition-all space-y-2 cursor-pointer ${
                      role === 'Student' 
                        ? 'bg-[#FAF0DC] dark:bg-[#222222] border-[#DA9B42] dark:border-white shadow-xs' 
                        : 'bg-[#FAF7F2] dark:bg-[#1a1a1a] border-[#E8DFD5] dark:border-[#303030] hover:border-[#C85A32] dark:hover:border-white'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-xl bg-[#C85A32] dark:bg-white text-white dark:text-[#0d0d0d] flex items-center justify-center text-base font-bold">
                      🎓
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#1E2224] dark:text-white">Student</h3>
                      <p className="text-[11px] text-[#5C6468] dark:text-gray-400 mt-0.5 leading-snug">Preparing for college semester, school boards, or competitive exams.</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('Teacher')}
                    className={`p-5 rounded-2xl border text-left transition-all space-y-2 cursor-pointer ${
                      role === 'Teacher' 
                        ? 'bg-[#E4ECEF] dark:bg-[#222222] border-[#2B5866] dark:border-white shadow-xs' 
                        : 'bg-[#FAF7F2] dark:bg-[#1a1a1a] border-[#E8DFD5] dark:border-[#303030] hover:border-[#2B5866] dark:hover:border-white'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-xl bg-[#2B5866] dark:bg-white text-white dark:text-[#0d0d0d] flex items-center justify-center text-base font-bold">
                      👨‍🏫
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#1E2224] dark:text-white">Educator / Teacher</h3>
                      <p className="text-[11px] text-[#5C6468] dark:text-gray-400 mt-0.5 leading-snug">Creating lecture handouts, assignment questions, and classroom slide flowcharts.</p>
                    </div>
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Course (Student) VS Department (Teacher) */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                className="space-y-4"
              >
                {role === 'Student' ? (
                  <div className="space-y-3.5">
                    <div className="space-y-1">
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1E2224] dark:text-white">
                        Which Degree or Course Stream are you in?
                      </h2>
                      <p className="text-xs text-[#5C6468] dark:text-gray-400">
                        Select your course stream below to continue.
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {studentCoursePresets.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setCourse(preset);
                            if (preset !== 'Custom Course / Subject') setCustomCourse('');
                          }}
                          className={`px-4 py-2.5 rounded-full border text-xs font-bold transition cursor-pointer ${
                            course === preset 
                              ? 'bg-[#C85A32] dark:bg-white text-white dark:text-[#0d0d0d] border-[#C85A32] dark:border-white shadow-xs' 
                              : 'bg-[#FAF7F2] dark:bg-[#222222] border-[#E8DFD5] dark:border-[#303030] text-[#1E2224] dark:text-white hover:border-[#C85A32] dark:hover:border-white'
                          }`}
                        >
                          {preset}
                        </button>
                      ))}
                    </div>

                    {course === 'Custom Course / Subject' && (
                      <input
                        type="text"
                        placeholder="Type your course name (e.g., M.Sc Data Analytics)..."
                        value={customCourse}
                        onChange={(e) => setCustomCourse(e.target.value)}
                        className="w-full px-4 py-3 rounded-2xl bg-[#FAF7F2] dark:bg-[#222222] border border-[#E8DFD5] dark:border-[#303030] text-xs font-bold text-[#1E2224] dark:text-white placeholder-[#877F76] dark:placeholder-gray-500 focus:outline-none focus:border-[#C85A32] dark:focus:border-white"
                      />
                    )}
                  </div>
                ) : (
                  <div className="space-y-3.5">
                    <div className="space-y-1">
                      <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1E2224] dark:text-white">
                        Which Department or Subject do you teach?
                      </h2>
                      <p className="text-xs text-[#5C6468] dark:text-gray-400">
                        Select your teaching subject or stream below.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-2.5">
                      {teacherDeptPresets.map((dept, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setTeacherDept(dept)}
                          className={`p-3 rounded-xl border text-left text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                            teacherDept === dept 
                              ? 'bg-[#E4ECEF] dark:bg-[#222222] border-[#2B5866] dark:border-white text-[#1E2224] dark:text-white' 
                              : 'bg-[#FAF7F2] dark:bg-[#1a1a1a] border-[#E8DFD5] dark:border-[#303030] text-[#5C6468] dark:text-gray-400 hover:border-[#2B5866] dark:hover:border-white'
                          }`}
                        >
                          <span>{dept}</span>
                          {teacherDept === dept && <FiCheck className="w-3.5 h-3.5 text-[#2B5866] dark:text-white" />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* STEP 3: Semester (Student) VS Target Audience (Teacher) */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                className="space-y-4"
              >
                {role === 'Student' ? (
                  <div className="space-y-3.5">
                    <div className="space-y-1">
                      <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1E2224] dark:text-white">
                        Which Semester / Year are you in?
                      </h2>
                      <p className="text-xs text-[#5C6468] dark:text-gray-400">
                        Select your current academic semester to continue.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {studentSemesterPresets.map((sem, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSemester(sem)}
                          className={`p-3 rounded-xl border text-left text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                            semester === sem 
                              ? 'bg-[#F5EBE1] dark:bg-[#222222] border-[#C85A32] dark:border-white text-[#1E2224] dark:text-white' 
                              : 'bg-[#FAF7F2] dark:bg-[#1a1a1a] border-[#E8DFD5] dark:border-[#303030] text-[#5C6468] dark:text-gray-400 hover:border-[#C85A32] dark:hover:border-white'
                          }`}
                        >
                          <span>{sem}</span>
                          {semester === sem && <FiCheck className="w-3.5 h-3.5 text-[#C85A32] dark:text-white" />}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3.5">
                    <div className="space-y-1">
                      <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1E2224] dark:text-white">
                        What Target Audience do you teach?
                      </h2>
                      <p className="text-xs text-[#5C6468] dark:text-gray-400">
                        Select your target audience below to continue.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-2.5">
                      {teacherAudiencePresets.map((aud, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setTeacherAudience(aud)}
                          className={`p-3 rounded-xl border text-left text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                            teacherAudience === aud 
                              ? 'bg-[#E4ECEF] dark:bg-[#222222] border-[#2B5866] dark:border-white text-[#1E2224] dark:text-white' 
                              : 'bg-[#FAF7F2] dark:bg-[#1a1a1a] border-[#E8DFD5] dark:border-[#303030] text-[#5C6468] dark:text-gray-400 hover:border-[#2B5866] dark:hover:border-white'
                          }`}
                        >
                          <span>{aud}</span>
                          {teacherAudience === aud && <FiCheck className="w-3.5 h-3.5 text-[#2B5866] dark:text-white" />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* STEP 4: Note Format (Student) VS Teaching Material (Teacher) */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                className="space-y-4"
              >
                {role === 'Student' ? (
                  <div className="space-y-3.5">
                    <div className="space-y-1">
                      <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1E2224] dark:text-white">
                        Which note format do you prefer most?
                      </h2>
                      <p className="text-xs text-[#5C6468] dark:text-gray-400">
                        Select your preferred note format below to complete setup.
                      </p>
                    </div>

                    <div className="space-y-2.5">
                      {studentNoteTypeOptions.map((option, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setPreferredNoteType(option.title)}
                          className={`w-full p-4 rounded-2xl border text-left transition flex items-start gap-3 cursor-pointer ${
                            preferredNoteType === option.title 
                              ? 'bg-[#F5EBE1] dark:bg-[#222222] border-[#C85A32] dark:border-white' 
                              : 'bg-[#FAF7F2] dark:bg-[#1a1a1a] border-[#E8DFD5] dark:border-[#303030] hover:border-[#C85A32] dark:hover:border-white'
                          }`}
                        >
                          <div className="p-2 rounded-xl bg-white dark:bg-[#161616] border border-[#E8DFD5] dark:border-[#303030] shrink-0">
                            {option.icon}
                          </div>
                          <div className="space-y-0.5">
                            <h3 className="text-xs font-bold text-[#1E2224] dark:text-white">{option.title}</h3>
                            <p className="text-[11px] text-[#5C6468] dark:text-gray-400 leading-relaxed">{option.desc}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3.5">
                    <div className="space-y-1">
                      <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1E2224] dark:text-white">
                        Which teaching materials do you generate most?
                      </h2>
                      <p className="text-xs text-[#5C6468] dark:text-gray-400">
                        Select your preferred teaching format below to complete setup.
                      </p>
                    </div>

                    <div className="space-y-2.5">
                      {teacherMaterialOptions.map((option, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setTeacherMaterialType(option.title)}
                          className={`w-full p-4 rounded-2xl border text-left transition flex items-start gap-3 cursor-pointer ${
                            teacherMaterialType === option.title 
                              ? 'bg-[#E4ECEF] dark:bg-[#222222] border-[#2B5866] dark:border-white' 
                              : 'bg-[#FAF7F2] dark:bg-[#1a1a1a] border-[#E8DFD5] dark:border-[#303030] hover:border-[#2B5866] dark:hover:border-white'
                          }`}
                        >
                          <div className="p-2 rounded-xl bg-white dark:bg-[#161616] border border-[#E8DFD5] dark:border-[#303030] shrink-0">
                            {option.icon}
                          </div>
                          <div className="space-y-0.5">
                            <h3 className="text-xs font-bold text-[#1E2224] dark:text-white">{option.title}</h3>
                            <p className="text-[11px] text-[#5C6468] dark:text-gray-400 leading-relaxed">{option.desc}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

          </AnimatePresence>

          {/* Wizard Bottom Controls */}
          <div className="pt-4 border-t border-[#E8DFD5] dark:border-[#262626] flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={handlePrevStep}
                className="px-4 py-2 rounded-full bg-[#FAF7F2] dark:bg-[#222222] hover:bg-[#F5EBE1] dark:hover:bg-[#2a2a2a] border border-[#E8DFD5] dark:border-[#303030] text-xs font-bold text-[#1E2224] dark:text-white transition flex items-center gap-1.5 cursor-pointer"
              >
                <FiArrowLeft />
                <span>Back</span>
              </button>
            ) : <div />}

            <button
              type="button"
              onClick={handleNextStep}
              disabled={!isCurrentStepValid() || isSubmitting}
              className={`px-7 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition shadow-md flex items-center gap-2 cursor-pointer ${
                isCurrentStepValid() && !isSubmitting
                  ? 'bg-[#C85A32] dark:bg-white hover:bg-[#B24B27] dark:hover:bg-gray-100 text-white dark:text-[#0d0d0d] shadow-[#C85A32]/20 dark:shadow-none'
                  : 'bg-[#E8DFD5] dark:bg-[#222222] text-[#877F76] dark:text-gray-600 opacity-60 cursor-not-allowed pointer-events-none'
              }`}
            >
              <span>{step === 4 ? (isSubmitting ? 'Saving...' : 'Complete Setup') : 'Continue'}</span>
              <FiArrowRight />
            </button>
          </div>

        </div>
      )}

    </div>
  );
}

export default Onboarding;
