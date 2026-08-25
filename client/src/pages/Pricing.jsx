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
          color: "#C85A32"
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
    <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#0d0d0d] text-[#1E2224] dark:text-white relative overflow-hidden font-sans selection:bg-[#EBD7BE] selection:text-[#1E2224] transition-colors duration-300">
      
      {/* Soft Organic Background Blobs */}
      <div className="trekt-bg-blob-top" />
      <div className="trekt-bg-blob-bottom" />

      {/* Clean Navbar */}
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 sm:px-12 pt-28 sm:pt-32 pb-20 relative z-10 space-y-12">
        
        {/* Page Title & Subtitle */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h1 className="text-4xl sm:text-5xl font-serif text-[#1E2224] dark:text-white tracking-tight">
            Simple, Transparent <br />
            <span className="italic font-normal text-[#C85A32] dark:text-white">Pay-As-You-Study</span> Pricing
          </h1>

          <p className="text-xs sm:text-sm text-[#5C6468] dark:text-gray-400 font-medium leading-relaxed">
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
