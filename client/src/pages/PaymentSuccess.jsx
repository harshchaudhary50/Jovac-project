import React, { useEffect } from 'react';
import { motion } from "motion/react";
import { FiCheckCircle } from "react-icons/fi";
import { getCurrentUser } from '../services/api';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';

function PaymentSuccess() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        getCurrentUser(dispatch);

        // Celebratory Party Popper Burst
        try {
            confetti({
                particleCount: 80,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#C85A32', '#DA9B42', '#2B5866', '#6B7B52', '#FFD700']
            });
            setTimeout(() => {
                confetti({
                    particleCount: 50,
                    angle: 60,
                    spread: 60,
                    origin: { x: 0.15, y: 0.75 },
                    colors: ['#C85A32', '#DA9B42', '#FFD700', '#FFFFFF']
                });
                confetti({
                    particleCount: 50,
                    angle: 120,
                    spread: 60,
                    origin: { x: 0.85, y: 0.75 },
                    colors: ['#C85A32', '#DA9B42', '#FFD700', '#FFFFFF']
                });
            }, 250);
        } catch (e) {}

        const t = setTimeout(() => {
            navigate("/");
        }, 5000);

        return () => clearTimeout(t);
    }, [dispatch, navigate]);
    return (
        <div className='min-h-screen flex flex-col items-center justify-center p-4 gap-4'>
            <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 360 }}
                transition={{
                    duration: 0.8,
                    ease: "easeOut"
                }}
                className="text-green-500 text-6xl">
                <FiCheckCircle />

            </motion.div>

            <motion.h1
            initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-2xl font-bold text-green-600">
            Payment Successful! Credits Added

            </motion.h1>

            <motion.p 
            initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-gray-500 text-sm">

               Redirecting to home...

            </motion.p>

        </div>
    )
}

export default PaymentSuccess
