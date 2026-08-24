import React, { useEffect, useRef } from 'react';
import lottie from 'lottie-web';
import defaultAnimationData from '../assets/learningAnimation.json';

function LottiePlayer({ animationData = defaultAnimationData, className = "w-60 h-60 sm:w-72 sm:h-72 md:w-80 md:h-80" }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const anim = lottie.loadAnimation({
      container: containerRef.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: animationData,
    });

    return () => {
      anim.destroy();
    };
  }, [animationData]);

  return (
    <div 
      ref={containerRef} 
      className={`${className} flex items-center justify-center [&>svg]:w-full [&>svg]:h-full [&>svg]:object-contain`} 
    />
  );
}

export default LottiePlayer;
