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

  // Validation function: returns true ONLY if user has selected an option for current step
  const isCurrentStepValid = () => {
    if (step === 1) {
      return role !== '';
    }
    if (step === 2) {
      if (role === 'Student') {
        if (course === 'Custom Course / Subject') {
          return customCourse.trim().length > 0;
        }
        return course !== '';
      } else {
        return teacherDept !== '';
      }
    }
    if (step === 3) {
      if (role === 'Student') {
        return semester !== '';
      } else {
        return teacherAudience !== '';
      }
    }
    if (step === 4) {
      if (role === 'Student') {
        return preferredNoteType !== '';
      } else {
        return teacherMaterialType !== '';
      }
    }
    return false;
  };

  // Student Presets
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
      icon: <FiBookOpen className="w-4 h-4 text-[#1e2025]" />,
      desc: 'Structured chapter explanations, key formulas, priority topic tags (⭐ to ⭐⭐⭐), and exam takeaways.'
    },
    {
      title: '5-Min Rapid Revision',
      icon: <FiZap className="w-4 h-4 text-[#1e2025]" />,
      desc: 'Ultra-short bullet points and definition cheat sheets engineered for last-night cramming.'
    },
    {
      title: 'Predicted Question Bank',
      icon: <FiTarget className="w-4 h-4 text-[#1e2025]" />,
      desc: 'Short, long, and diagram-based questions with estimated marks weightage allocation.'
    }
  ];

  // Teacher Presets
  const teacherDeptPresets = [
    'Computer Science & Engineering',
    'Physics & Electrical Sciences',
    'Mathematics & Statistics',
    'Chemistry & Chemical Sciences',
    'Business & Finance Management',
    'High School Science & Math',
    'Humanities & Social Sciences'
  ];

  const teacherAudiencePresets = [
    'Undergraduate B.Tech / B.Sc Students',
    'Postgraduate M.Tech / M.Sc Students',
    'High School Students (Class 10-12)',
    'Competitive Exam Aspirants (GATE/JEE)',
    'Polytechnic & Diploma Students'
  ];

  const teacherMaterialOptions = [
    {
      title: 'Lecture Handouts & Summaries',
      icon: <FiFileText className="w-4 h-4 text-[#1e2025]" />,
      desc: 'Detailed lecture outlines, core definitions, and structured syllabus notes for distribution.'
    },
    {
      title: 'Visual Mermaid Flowcharts for Slides',
      icon: <FiShare2 className="w-4 h-4 text-[#1e2025]" />,
      desc: 'Process diagrams, architecture flowcharts, and visual topic weightage charts for presentation slides.'
    },
    {
      title: 'Homework & Quiz Question Banks',
      icon: <FiTarget className="w-4 h-4 text-[#1e2025]" />,
      desc: 'Auto-generated assignment question sets, model answers, and numerical practice sets.'
    }
  ];

  const handleNextStep = () => {
    if (!isCurrentStepValid()) return;
    if (step < 4) {
      setStep(step + 1);
    } else {
      handleSubmitOnboarding();
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmitOnboarding = async () => {
    try {
      setIsSubmitting(true);

      const finalCourse = role === 'Student' 
        ? (course === 'Custom Course / Subject' ? customCourse : course)
        : teacherDept;

      const finalSemester = role === 'Student' ? semester : teacherAudience;
      const finalNoteType = role === 'Student' ? preferredNoteType : teacherMaterialType;
      
      const payload = {
        role,
        course: finalCourse || 'General Studies',
        semester: finalSemester || 'Current Term',
        preferredNoteType: finalNoteType || 'Deep Concept Notes'
      };

      const res = await axios.post(serverUrl + '/api/user/onboarding', payload, { withCredentials: true });
      if (res.data) {
        dispatch(setUserData(res.data));
      }
      setIsCompletedScreen(true);
    } catch (err) {
      console.log('Error completing onboarding:', err);
      setIsCompletedScreen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#EDEBE0] text-[#1e2025] flex items-center justify-center p-4 relative overflow-hidden font-sans selection:bg-[#EDEBE0]">
      
      {/* Background Soft Blobs */}
      <div className="trekt-bg-blob-top" />
      <div className="trekt-bg-blob-bottom" />

      {/* SLEEK & COMPACT THANK YOU COMPLETION CARD */}
      {isCompletedScreen ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-white rounded-3xl border border-[#E0E3ED] trekt-card-shadow p-6 sm:p-7 text-center space-y-5 relative z-10 shadow-2xl"
        >
          {/* Sleek Green Badge */}
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
            <FiCheckCircle className="w-6 h-6 stroke-[2.5]" />
          </div>

          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1e2025]">
              Thank you for your time! 🎉
            </h2>
            <p className="text-xs text-[#52565c] leading-relaxed max-w-xs mx-auto">
              Your profile has been saved. AI generation is now customized for your <span className="font-bold text-[#1e2025]">{role}</span> profile.
            </p>
          </div>

          {/* Compact Profile Summary Box */}
          <div className="p-3.5 rounded-2xl bg-[#EDEBE0]/70 border border-[#B2B4B7]/40 space-y-1.5 text-xs text-[#1e2025]">
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-[#52565c] font-medium">Role:</span>
              <span className="font-bold">{role}</span>
            </div>
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-[#52565c] font-medium">{role === 'Student' ? 'Course:' : 'Department:'}</span>
              <span className="font-bold truncate max-w-[200px]">{role === 'Student' ? (course === 'Custom Course / Subject' ? customCourse : course) : teacherDept}</span>
            </div>
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-[#52565c] font-medium">{role === 'Student' ? 'Semester/Class:' : 'Audience:'}</span>
              <span className="font-bold truncate max-w-[200px]">{role === 'Student' ? semester : teacherAudience}</span>
            </div>
            <div className="flex justify-between items-center text-[11px] pt-1 border-t border-[#B2B4B7]/30">
              <span className="text-[#52565c] font-medium">Credits Active:</span>
              <span className="font-bold text-emerald-700">⚡ 50 Free Signup Credits</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/')}
            className="w-full py-3 rounded-full bg-[#1e2025] hover:bg-[#2d3037] text-white text-xs font-bold uppercase tracking-wider transition shadow-md shadow-[#1e2025]/10 flex items-center justify-center gap-2"
          >
            <span>LAUNCH MY DASHBOARD</span>
            <FiArrowRight />
          </button>
        </motion.div>
      ) : (
        /* COMPACT 4-STEP WIZARD */
        <div className="w-full max-w-xl bg-white rounded-3xl border border-[#E0E3ED] trekt-card-shadow p-6 sm:p-9 relative z-10 space-y-6 shadow-2xl">
          
          {/* Header & Step Indicator Bar */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[#52565c]">
              <span className="flex items-center gap-1.5 text-[#1e2025]">
                <span className="w-2 h-2 rounded-full bg-[#1e2025]" />
                {role || 'Study'} Personalization Setup
              </span>
              <span>Step {step} of 4</span>
            </div>

            {/* Progress Indicator Line */}
            <div className="w-full h-1.5 bg-[#F8F8F8] rounded-full overflow-hidden border border-[#E0E3ED]">
              <motion.div 
                className="h-full bg-[#1e2025]"
                animate={{ width: `${(step / 4) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Wizard Step Content Switcher */}
          <AnimatePresence mode="wait">
            
            {/* STEP 1: Role Selection (Student vs Teacher) */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                className="space-y-5"
              >
                <div className="space-y-1">
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1e2025]">
                    What best describes your primary role?
                  </h2>
                  <p className="text-xs text-[#52565c]">
                    Please select an option below to continue.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <button
                    type="button"
                    onClick={() => setRole('Student')}
                    className={`p-5 rounded-2xl border text-left transition-all space-y-2 ${
                      role === 'Student' 
                        ? 'bg-[#EDEBE0] border-[#1e2025] shadow-xs' 
                        : 'bg-[#F8F8F8] border-[#E0E3ED] hover:border-[#B2B4B7]'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-xl bg-[#1e2025] text-white flex items-center justify-center text-base font-bold">
                      🎓
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#1e2025]">Student</h3>
                      <p className="text-[11px] text-[#52565c] mt-0.5 leading-snug">Preparing for college semester, school boards, or competitive exams.</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('Teacher')}
                    className={`p-5 rounded-2xl border text-left transition-all space-y-2 ${
                      role === 'Teacher' 
                        ? 'bg-[#EDEBE0] border-[#1e2025] shadow-xs' 
                        : 'bg-[#F8F8F8] border-[#E0E3ED] hover:border-[#B2B4B7]'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-xl bg-[#E0E3ED] text-[#1e2025] flex items-center justify-center text-base font-bold border border-[#B2B4B7]/40">
                      👨‍🏫
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#1e2025]">Educator / Teacher</h3>
                      <p className="text-[11px] text-[#52565c] mt-0.5 leading-snug">Creating lecture handouts, assignment questions, and classroom slide flowcharts.</p>
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
                      <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1e2025]">
                        Which Degree or Course Stream are you in?
                      </h2>
                      <p className="text-xs text-[#52565c]">
                        Select your course stream below to continue.
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {studentCoursePresets.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setCourse(preset)}
                          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition ${
                            course === preset 
                              ? 'bg-[#1e2025] text-white border-[#1e2025]' 
                              : 'bg-[#F8F8F8] text-[#1e2025] border-[#E0E3ED] hover:border-[#B2B4B7]'
                          }`}
                        >
                          {preset}
                        </button>
                      ))}
                    </div>

                    {course === 'Custom Course / Subject' && (
                      <input
                        type="text"
                        required
                        value={customCourse}
                        onChange={(e) => setCustomCourse(e.target.value)}
                        placeholder="Enter your exact degree / subject (e.g. M.Tech VLSI)..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F8F8] border border-[#E0E3ED] text-xs font-semibold text-[#1e2025] focus:outline-none focus:border-[#1e2025]"
                      />
                    )}
                  </div>
                ) : (
                  <div className="space-y-3.5">
                    <div className="space-y-1">
                      <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1e2025]">
                        Which Subject Department do you teach?
                      </h2>
                      <p className="text-xs text-[#52565c]">
                        Select your teaching domain to continue.
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {teacherDeptPresets.map((dept, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setTeacherDept(dept)}
                          className={`px-3.5 py-2 rounded-full text-xs font-semibold border transition ${
                            teacherDept === dept 
                              ? 'bg-[#1e2025] text-white border-[#1e2025]' 
                              : 'bg-[#F8F8F8] text-[#1e2025] border-[#E0E3ED] hover:border-[#B2B4B7]'
                          }`}
                        >
                          {dept}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* STEP 3: Semester/Class (Student) VS Audience (Teacher) */}
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
                      <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1e2025]">
                        What is your current Semester or Class level?
                      </h2>
                      <p className="text-xs text-[#52565c]">
                        Select your class level below to continue.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {studentSemesterPresets.map((sem, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSemester(sem)}
                          className={`p-3 rounded-xl border text-left text-xs font-bold transition flex items-center justify-between ${
                            semester === sem 
                              ? 'bg-[#EDEBE0] border-[#1e2025] text-[#1e2025]' 
                              : 'bg-[#F8F8F8] border-[#E0E3ED] text-[#52565c] hover:border-[#B2B4B7]'
                          }`}
                        >
                          <span>{sem}</span>
                          {semester === sem && <FiCheck className="w-3.5 h-3.5 text-[#1e2025]" />}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3.5">
                    <div className="space-y-1">
                      <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1e2025]">
                        What Target Audience do you teach?
                      </h2>
                      <p className="text-xs text-[#52565c]">
                        Select your target audience below to continue.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-2.5">
                      {teacherAudiencePresets.map((aud, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setTeacherAudience(aud)}
                          className={`p-3 rounded-xl border text-left text-xs font-bold transition flex items-center justify-between ${
                            teacherAudience === aud 
                              ? 'bg-[#EDEBE0] border-[#1e2025] text-[#1e2025]' 
                              : 'bg-[#F8F8F8] border-[#E0E3ED] text-[#52565c] hover:border-[#B2B4B7]'
                          }`}
                        >
                          <span>{aud}</span>
                          {teacherAudience === aud && <FiCheck className="w-3.5 h-3.5 text-[#1e2025]" />}
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
                      <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1e2025]">
                        Which note format do you prefer most?
                      </h2>
                      <p className="text-xs text-[#52565c]">
                        Select your preferred note format below to complete setup.
                      </p>
                    </div>

                    <div className="space-y-2.5">
                      {studentNoteTypeOptions.map((option, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setPreferredNoteType(option.title)}
                          className={`w-full p-4 rounded-2xl border text-left transition flex items-start gap-3 ${
                            preferredNoteType === option.title 
                              ? 'bg-[#EDEBE0] border-[#1e2025]' 
                              : 'bg-[#F8F8F8] border-[#E0E3ED] hover:border-[#B2B4B7]'
                          }`}
                        >
                          <div className="p-2 rounded-xl bg-white border border-[#E0E3ED] shrink-0">
                            {option.icon}
                          </div>
                          <div className="space-y-0.5">
                            <h3 className="text-xs font-bold text-[#1e2025]">{option.title}</h3>
                            <p className="text-[11px] text-[#52565c] leading-relaxed">{option.desc}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3.5">
                    <div className="space-y-1">
                      <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1e2025]">
                        Which teaching materials do you generate most?
                      </h2>
                      <p className="text-xs text-[#52565c]">
                        Select your preferred teaching format below to complete setup.
                      </p>
                    </div>

                    <div className="space-y-2.5">
                      {teacherMaterialOptions.map((option, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setTeacherMaterialType(option.title)}
                          className={`w-full p-4 rounded-2xl border text-left transition flex items-start gap-3 ${
                            teacherMaterialType === option.title 
                              ? 'bg-[#EDEBE0] border-[#1e2025]' 
                              : 'bg-[#F8F8F8] border-[#E0E3ED] hover:border-[#B2B4B7]'
                          }`}
                        >
                          <div className="p-2 rounded-xl bg-white border border-[#E0E3ED] shrink-0">
                            {option.icon}
                          </div>
                          <div className="space-y-0.5">
                            <h3 className="text-xs font-bold text-[#1e2025]">{option.title}</h3>
                            <p className="text-[11px] text-[#52565c] leading-relaxed">{option.desc}</p>
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
          <div className="pt-4 border-t border-[#E0E3ED] flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={handlePrevStep}
                className="px-4 py-2 rounded-full bg-[#F8F8F8] hover:bg-[#EDEBE0] border border-[#E0E3ED] text-xs font-bold text-[#1e2025] transition flex items-center gap-1.5"
              >
                <FiArrowLeft />
                <span>Back</span>
              </button>
            ) : <div />}

            <button
              type="button"
              onClick={handleNextStep}
              disabled={!isCurrentStepValid() || isSubmitting}
              className={`px-7 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition shadow-md shadow-[#1e2025]/10 flex items-center gap-2 ${
                isCurrentStepValid() && !isSubmitting
                  ? 'bg-[#1e2025] hover:bg-[#2d3037] text-white cursor-pointer'
                  : 'bg-[#B2B4B7]/50 text-white opacity-50 cursor-not-allowed pointer-events-none'
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
