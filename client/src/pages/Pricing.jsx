import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion, AnimatePresence } from "motion/react";
import { useSelector, useDispatch } from 'react-redux';
import { updateCredits } from '../redux/userSlice';
import { loadRazorpayScript, createRazorpayOrder, verifyPayment } from '../services/api';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { serverUrl } from '../App';
import { FiCheck, FiZap, FiShield, FiArrowRight, FiCreditCard, FiCheckCircle, FiX } from 'react-icons/fi';
import confetti from 'canvas-confetti';

const triggerPartyPoppers = () => {
  try {
    // 1. Center explosion
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#C85A32', '#DA9B42', '#2B5866', '#6B7B52', '#FFD700']
    });

    // 2. Left cannon popper
    confetti({
      particleCount: 55,
      angle: 60,
      spread: 60,
      origin: { x: 0.15, y: 0.75 },
      colors: ['#C85A32', '#DA9B42', '#FFD700', '#FFFFFF']
    });

    // 3. Right cannon popper
    confetti({
      particleCount: 55,
      angle: 120,
      spread: 60,
      origin: { x: 0.85, y: 0.75 },
      colors: ['#C85A32', '#DA9B42', '#FFD700', '#FFFFFF']
    });

    // 4. Secondary delayed golden star shower
    setTimeout(() => {
      confetti({
        particleCount: 50,
        spread: 110,
        origin: { y: 0.45 },
        shapes: ['star', 'circle'],
        colors: ['#DA9B42', '#FFB800', '#C85A32', '#2B5866']
      });
    }, 280);
  } catch (e) {
    console.warn("Confetti error:", e);
  }
};

function Pricing() {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);
  const [selectedPrice, setSelectedPrice] = useState(199);
  const [paying, setPaying] = useState(false);
  const [payingAmount, setPayingAmount] = useState(null);
  const [successModal, setSuccessModal] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  // Fire celebratory party poppers when success modal opens
  useEffect(() => {
    if (successModal) {
      triggerPartyPoppers();
    }
  }, [successModal]);

  const [adminSettings, setAdminSettings] = useState(() => {
    const savedLocal = localStorage.getItem('adminSettings');
    if (savedLocal) {
      try { return JSON.parse(savedLocal); } catch (e) {}
    }
    return {
      creditCostPerGeneration: 10,
      starterPlanPrice: 49,
      proPlanPrice: 199
    };
  });

  useEffect(() => {
    axios.get(`${serverUrl}/api/admin/settings`)
      .then(res => {
        if (res.data?.success && res.data.settings) {
          setAdminSettings(res.data.settings);
          localStorage.setItem('adminSettings', JSON.stringify(res.data.settings));
        }
      })
      .catch(() => null);
  }, []);

  const starterPrice = adminSettings?.starterPlanPrice || 49;
  const proPrice = adminSettings?.proPlanPrice || 199;
  const creditCost = adminSettings?.creditCostPerGeneration || 10;

  const handlePaying = async (amount) => {
    if (!userData) {
      navigate('/auth');
      return;
    }

    try {
      setPaying(true);
      setPayingAmount(amount);
      setErrorMessage("");

      const res = await loadRazorpayScript();
      if (!res) {
        setErrorMessage('Razorpay SDK failed to load. Check your internet connection.');
        setPaying(false);
        setPayingAmount(null);
        return;
      }

      const orderData = await createRazorpayOrder(amount);

      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "NoteX",
        description: `Exam AI Credit Pack (₹${amount})`,
        order_id: orderData.id,
        handler: async function (response) {
          try {
            const verification = await verifyPayment(response);
            if (verification.success) {
              if (verification.totalCredits !== undefined) {
                dispatch(updateCredits(verification.totalCredits));
              } else {
                dispatch(updateCredits((userData?.credits || 0) + (verification.creditsAdded || 0)));
              }
              setSuccessModal({
                creditsAdded: verification.creditsAdded,
                totalCredits: verification.totalCredits || ((userData?.credits || 0) + verification.creditsAdded),
                amount
              });
            } else {
              setErrorMessage('Payment verification failed. Please contact support.');
            }
          } catch (err) {
            setErrorMessage('Error verifying payment.');
          } finally {
            setPaying(false);
            setPayingAmount(null);
          }
        },
        prefill: {
          name: userData?.name || "",
          email: userData?.email || ""
        },
        theme: {
          color: "#C85A32"
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Could not initialize payment. Please try again.');
    } finally {
      setPaying(false);
      setPayingAmount(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#0d0d0d] text-[#1E2224] dark:text-white relative overflow-hidden font-sans selection:bg-[#EBD7BE] selection:text-[#1E2224] transition-colors duration-300">
      
      {/* Soft Organic Background Blobs */}
      <div className="trekt-bg-blob-top" />
      <div className="trekt-bg-blob-bottom" />

      {/* Clean Navbar */}
      <Navbar />

      {/* Payment Success Modal */}
      <AnimatePresence>
        {successModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.25 }}
              className="bg-white dark:bg-[#141414] border border-[#E8DFD5] dark:border-[#2a2a2a] rounded-3xl p-7 max-w-md w-full shadow-2xl space-y-6 text-center"
            >
              <motion.div 
                animate={{ scale: [0.8, 1.15, 1], rotate: [0, -8, 8, 0] }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-16 h-16 rounded-3xl bg-[#FAF0DC] dark:bg-[#222222] border border-[#DA9B42]/40 dark:border-[#333333] flex items-center justify-center text-[#B86337] dark:text-[#E6E2D3] mx-auto shadow-md"
              >
                <FiZap className="w-8 h-8 text-[#DA9B42] dark:text-amber-400" />
              </motion.div>

              <div className="space-y-2">
                <h3 className="text-2xl font-serif font-bold text-[#1E2224] dark:text-white">
                  +{successModal.creditsAdded} Credits Added!
                </h3>
                <p className="text-xs text-[#5C6468] dark:text-gray-400 leading-relaxed font-normal">
                  Your payment of ₹{successModal.amount} was successfully verified. Your new balance is <strong className="text-[#1E2224] dark:text-white font-bold">{successModal.totalCredits} Credits</strong>.
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setSuccessModal(null)}
                  className="flex-1 py-3 rounded-full text-xs font-semibold text-[#5C6468] dark:text-gray-300 hover:bg-[#FAF7F2] dark:hover:bg-[#222222] border border-[#E8DFD5] dark:border-[#333333] transition cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={() => navigate('/notes')}
                  className="flex-1 py-3 rounded-full text-xs font-semibold bg-[#1E2224] dark:bg-white text-white dark:text-black hover:bg-[#333333] dark:hover:bg-neutral-200 transition shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Generate Notes</span>
                  <FiArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Error Message Toast */}
      {errorMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1E2224] dark:bg-white text-white dark:text-[#000000] px-4 py-3 rounded-2xl shadow-xl border border-[#E8DFD5] dark:border-[#333333] flex items-center gap-3 text-xs font-semibold animate-fade-in">
          <span>{errorMessage}</span>
          <button onClick={() => setErrorMessage("")} className="cursor-pointer hover:opacity-70">
            <FiX className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-16 space-y-12 sm:space-y-16">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#1E2224] dark:text-white tracking-tight leading-tight">
            Invest in High-Yield <br />
            <span className="italic font-normal">Exam Excellence</span>
          </h1>
          
          <p className="text-xs sm:text-sm text-[#5C6468] dark:text-gray-400 font-medium leading-relaxed max-w-xl mx-auto">
            Pay only for the notes you synthesize. No monthly lock-ins, no subscriptions. Credits never expire and carry over across semesters.
          </p>
        </div>

        {/* 3 Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          
          {/* Starter Pack */}
          <PricingCard
            title="Starter Pack"
            price={`₹${starterPrice}`}
            amount={starterPrice}
            credits="50 AI Credits"
            description="Perfect for last-minute cramming & single chapter revision."
            badge="QUICK REVISION"
            features={[
              `5 AI Exam Note generations (${creditCost} credits / note)`,
              "Full Markdown + 5-Min Revision Sheets",
              "Predicted Short & Long Exam Questions",
              "Standard PDF Export"
            ]}
            selectedPrice={selectedPrice}
            setSelectedPrice={setSelectedPrice}
            onBuy={handlePaying}
            paying={paying}
            payingAmount={payingAmount}
          />

          {/* Pro Exam Pack */}
          <PricingCard
            title="Pro Exam Pack"
            price={`₹${proPrice}`}
            amount={proPrice}
            credits="250 AI Credits"
            description="Best for full semester preparation across all subjects."
            popular={true}
            badge="MOST POPULAR — PRO SAVINGS"
            features={[
              `25 AI Exam Note generations (${creditCost} credits / note)`,
              "Deep Concept Notes + Takeaways",
              "Mermaid Process & Architecture Diagrams",
              "Instant High-Res PDF Export",
              "Priority Processing Speed"
            ]}
            selectedPrice={selectedPrice}
            setSelectedPrice={setSelectedPrice}
            onBuy={handlePaying}
            paying={paying}
            payingAmount={payingAmount}
          />

          {/* Semester Pass */}
          <PricingCard
            title="Semester Pass"
            price="₹399"
            amount={399}
            credits="600 AI Credits"
            description="Complete unlimited coverage for the entire academic year."
            badge="MAXIMUM VALUE"
            features={[
              "60 AI Exam Note generations",
              "Unlimited PDF exports & saves",
              "Full syllabus question bank generator",
              "All diagram & flowchart presets",
              "Priority support & cloud backup"
            ]}
            selectedPrice={selectedPrice}
            setSelectedPrice={setSelectedPrice}
            onBuy={handlePaying}
            paying={paying}
            payingAmount={payingAmount}
          />

        </div>

        {/* Payment FAQ / Guarantee Note */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#161616] border border-[#E8DFD5] dark:border-[#262626] trekt-card-shadow text-center space-y-2 max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-2 text-xs font-extrabold text-[#6B7B52] dark:text-emerald-400">
            <FiCreditCard className="w-4 h-4" />
            <span>Instant Credit Delivery</span>
          </div>
          <p className="text-xs text-[#5C6468] dark:text-gray-400 font-medium leading-relaxed">
            Credits are credited to your account balance immediately upon successful payment verification.
          </p>
        </div>

      </main>

      {/* Global Footer */}
      <Footer />

    </div>
  );
}

function PricingCard({
  title,
  price,
  amount,
  credits,
  description,
  features,
  popular,
  badge,
  selectedPrice,
  setSelectedPrice,
  onBuy,
  paying,
  payingAmount
}) {
  const isSelected = selectedPrice === amount;
  const isPayingThisCard = paying && payingAmount === amount;

  return (
    <motion.div
      onClick={() => setSelectedPrice(amount)}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.2 }}
      className={`
        relative cursor-pointer rounded-3xl p-7 sm:p-8 flex flex-col justify-between transition-all border
        ${isSelected 
          ? "bg-[#2B5866] dark:bg-[#1e1e1e] text-white border-[#2B5866] dark:border-white shadow-xl" 
          : popular
          ? "bg-white dark:bg-[#161616] border-[#C85A32] dark:border-[#333333] trekt-card-shadow"
          : "bg-white dark:bg-[#161616] border-[#E8DFD5] dark:border-[#262626] trekt-card-shadow hover:border-[#C85A32] dark:hover:border-white"
        }
      `}
    >
      <div className="space-y-5">
        
        {/* Header Label (Clean Text, No Pill Badge) */}
        {badge && (
          <div>
            <span className={`text-[10px] font-extrabold uppercase tracking-wider ${
              isSelected ? "text-[#EBD7BE] dark:text-gray-300" : "text-[#B86337] dark:text-amber-400"
            }`}>
              {badge}
            </span>
          </div>
        )}

        <div className="space-y-1">
          <h2 className={`text-2xl font-extrabold tracking-tight ${isSelected ? "text-white" : "text-[#1E2224] dark:text-white"}`}>
            {title}
          </h2>
          <p className={`text-xs font-medium leading-relaxed ${isSelected ? "text-[#EBD7BE] dark:text-gray-300" : "text-[#5C6468] dark:text-gray-400"}`}>
            {description}
          </p>
        </div>

        {/* Pricing & Credits Info */}
        <div className={`p-4 rounded-2xl border space-y-2 ${
          isSelected 
            ? "bg-white/10 dark:bg-[#262626] border-white/20 dark:border-[#333333]" 
            : "bg-[#FAF7F2] dark:bg-[#1e1e1e] border-[#E8DFD5] dark:border-[#262626]"
        }`}>
          <div className="flex items-baseline justify-between gap-2">
            <div className="flex items-baseline gap-1">
              <span className={`text-3xl font-extrabold tracking-tight ${isSelected ? "text-white" : "text-[#1E2224] dark:text-white"}`}>
                {price}
              </span>
              <span className={`text-xs font-semibold ${isSelected ? "text-white/80" : "text-[#5C6468] dark:text-gray-400"}`}>
                / one-time
              </span>
            </div>

            {/* Credit Info */}
            <div className={`text-xs font-extrabold flex items-center gap-1.5 shrink-0 ${
              isSelected ? "text-white" : "text-[#1E2224] dark:text-white"
            }`}>
              <FiZap className={`w-3.5 h-3.5 ${isSelected ? "text-white" : "text-[#DA9B42] dark:text-amber-400"}`} />
              <span>{credits}</span>
            </div>
          </div>
        </div>

        {/* Features Bullet List */}
        <ul className="space-y-2.5 pt-2">
          {features.map((feature, i) => (
            <li key={i} className="flex items-start gap-2.5 text-xs font-semibold">
              <FiCheck className={`w-4 h-4 shrink-0 mt-0.5 ${isSelected ? "text-[#EBD7BE] dark:text-gray-300" : "text-[#6B7B52] dark:text-emerald-400"}`} />
              <span className={isSelected ? "text-white/90" : "text-[#5C6468] dark:text-gray-400"}>
                {feature}
              </span>
            </li>
          ))}
        </ul>

      </div>

      {/* Buy Action Button */}
      <button
        disabled={isPayingThisCard}
        onClick={(e) => {
          e.stopPropagation();
          onBuy(amount);
        }}
        className={`
          w-full mt-8 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer
          ${isPayingThisCard
            ? "bg-gray-400 text-white cursor-not-allowed"
            : isSelected
            ? "bg-[#DA9B42] dark:bg-white text-white dark:text-[#0d0d0d] hover:bg-[#C0842E] dark:hover:bg-gray-100"
            : "bg-[#C85A32] dark:bg-white text-white dark:text-[#0d0d0d] hover:bg-[#B24B27] dark:hover:bg-gray-100"
          }
        `}
      >
        {isPayingThisCard ? (
          <>
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            <span>Redirecting to Checkout...</span>
          </>
        ) : (
          <>
            <span>Buy {credits} Now</span>
            <FiArrowRight className="w-4 h-4" />
          </>
        )}
      </button>

    </motion.div>
  );
}

export default Pricing;
