import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from "motion/react";
import { useSelector } from 'react-redux';
import { loadRazorpayScript, createRazorpayOrder, verifyPayment } from '../services/api';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { serverUrl } from '../App';
import { FiCheck, FiZap, FiShield, FiArrowRight, FiCreditCard } from 'react-icons/fi';

function Pricing() {
  const { userData } = useSelector((state) => state.user);
  const [selectedPrice, setSelectedPrice] = useState(199);
  const [paying, setPaying] = useState(false);
  const [payingAmount, setPayingAmount] = useState(null);
  const navigate = useNavigate();

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

      const res = await loadRazorpayScript();
      if (!res) {
        alert('Razorpay SDK failed to load. Check your internet connection.');
        setPaying(false);
        setPayingAmount(null);
        return;
      }

      const orderData = await createRazorpayOrder(amount);

      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "PrepAI",
        description: `Exam AI Credit Pack (₹${amount})`,
        image: "/favicon.jpg",
        order_id: orderData.id,
        handler: async function (response) {
          try {
            const verification = await verifyPayment(response);
            if (verification.success) {
              alert(`Payment successful! ${verification.creditsAdded} credits added to your account.`);
              window.location.reload();
            } else {
              alert('Payment verification failed.');
            }
          } catch (err) {
            console.error(err);
            alert('Error verifying payment.');
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
          color: "#1e2025"
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (error) {
      console.error(error);
      alert('Could not initialize payment. Please try again.');
    } finally {
      setPaying(false);
      setPayingAmount(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#EDEBE0] dark:bg-[#0d0d0d] text-[#1e2025] dark:text-white relative overflow-hidden font-sans selection:bg-[#EDEBE0] selection:text-[#1e2025] transition-colors duration-300">
      
      {/* Soft Organic Background Blobs */}
      <div className="trekt-bg-blob-top" />
      <div className="trekt-bg-blob-bottom" />

      {/* Clean Navbar */}
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 sm:px-12 pt-28 sm:pt-32 pb-20 relative z-10 space-y-12">
        
        {/* Page Title & Subtitle */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <p className="text-xs font-extrabold uppercase tracking-wider text-[#52565c] dark:text-gray-400 flex items-center justify-center gap-1.5">
            <FiZap className="w-3.5 h-3.5 text-amber-500" />
            <span>AI Credit Refill Packs</span>
          </p>

          <h1 className="text-4xl sm:text-5xl font-serif text-[#1e2025] dark:text-white tracking-tight">
            Simple, Transparent <br />
            <span className="italic font-normal text-[#52565c] dark:text-gray-400">Pay-As-You-Study</span> Pricing
          </h1>

          <p className="text-xs sm:text-sm text-[#52565c] dark:text-gray-400 font-medium leading-relaxed">
            No monthly subscriptions. Buy credits when you need them for your exam prep and use them at your own pace.
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

          {/* Value Pack (Popular / Pro Plan) */}
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

          {/* Pro Pack */}
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
        <div className="p-6 rounded-3xl bg-[#EDEBE0] dark:bg-[#161616] border border-[#B2B4B7]/40 dark:border-[#262626] trekt-card-shadow text-center space-y-2 max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-2 text-xs font-extrabold text-[#1e2025] dark:text-white">
            <FiCreditCard className="w-4 h-4" />
            <span>Instant Credit Delivery</span>
          </div>
          <p className="text-xs text-[#52565c] dark:text-gray-400 font-medium leading-relaxed">
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
          ? "bg-[#1e2025] dark:bg-white text-white dark:text-[#0d0d0d] border-[#1e2025] dark:border-white shadow-xl ring-2 ring-[#1e2025]/20 dark:ring-white/20" 
          : popular
          ? "bg-[#EDEBE0] dark:bg-[#161616] border-[#1e2025] dark:border-white trekt-card-shadow"
          : "bg-[#EDEBE0] dark:bg-[#161616] border-[#B2B4B7]/40 dark:border-[#262626] trekt-card-shadow hover:border-[#1e2025] dark:hover:border-white"
        }
      `}
    >
      <div className="space-y-5">
        
        {/* Header Badge */}
        <div className="flex items-center justify-between gap-2">
          <span className={`text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full border ${
            isSelected 
              ? "bg-white/20 dark:bg-black/10 text-white dark:text-[#0d0d0d] border-white/20 dark:border-black/20" 
              : popular
              ? "bg-[#1e2025] dark:bg-white text-white dark:text-[#0d0d0d] border-[#1e2025] dark:border-white"
              : "text-[#52565c] dark:text-gray-400 font-bold border-[#B2B4B7]/40 dark:border-[#262626]"
          }`}>
            {badge}
          </span>
        </div>

        <div className="space-y-1">
          <h2 className={`text-2xl font-extrabold tracking-tight ${isSelected ? "text-white dark:text-[#0d0d0d]" : "text-[#1e2025] dark:text-white"}`}>
            {title}
          </h2>
          <p className={`text-xs font-medium leading-relaxed ${isSelected ? "text-gray-300 dark:text-gray-700" : "text-[#52565c] dark:text-gray-400"}`}>
            {description}
          </p>
        </div>

        {/* Clean Refined Pricing & Credits Info */}
        <div className={`p-4 rounded-2xl border space-y-2 ${
          isSelected 
            ? "bg-white/10 dark:bg-black/10 border-white/20 dark:border-black/20" 
            : "bg-white/90 dark:bg-[#222222] border-[#B2B4B7]/30 dark:border-[#303030]"
        }`}>
          <div className="flex items-baseline justify-between gap-2">
            <div className="flex items-baseline gap-1">
              <span className={`text-3xl font-extrabold tracking-tight ${isSelected ? "text-white dark:text-[#0d0d0d]" : "text-[#1e2025] dark:text-white"}`}>
                {price}
              </span>
              <span className={`text-xs font-semibold ${isSelected ? "text-gray-300 dark:text-gray-700" : "text-[#52565c] dark:text-gray-400"}`}>
                / one-time
              </span>
            </div>

            {/* Premium Refined Credit Pill Badge */}
            <div className={`px-3 py-1 rounded-full text-xs font-extrabold flex items-center gap-1.5 border shrink-0 ${
              isSelected
                ? "bg-white/20 dark:bg-black/10 text-white dark:text-[#0d0d0d] border-white/30 dark:border-black/20"
                : "bg-[#1e2025]/5 dark:bg-white/10 text-[#1e2025] dark:text-white border-[#1e2025]/10 dark:border-white/15"
            }`}>
              <FiZap className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
              <span>{credits}</span>
            </div>
          </div>
        </div>

        {/* Features Bullet List */}
        <ul className="space-y-2.5 pt-2">
          {features.map((feature, i) => (
            <li key={i} className="flex items-start gap-2.5 text-xs font-semibold">
              <FiCheck className={`w-4 h-4 shrink-0 mt-0.5 ${isSelected ? "text-white dark:text-[#0d0d0d]" : "text-[#1e2025] dark:text-white"}`} />
              <span className={isSelected ? "text-gray-200 dark:text-gray-800" : "text-[#52565c] dark:text-gray-400"}>
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
            ? "bg-white dark:bg-[#0d0d0d] text-[#1e2025] dark:text-white hover:bg-gray-100 dark:hover:bg-black"
            : "bg-[#1e2025] dark:bg-white text-white dark:text-[#0d0d0d] hover:bg-black dark:hover:bg-gray-200"
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
