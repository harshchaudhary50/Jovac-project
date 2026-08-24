import React from 'react';

function StudentIllustration({ className = "w-44 h-44 md:w-56 md:h-52" }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 400 320" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background Subtle Accent Sparkles & Aura */}
      <circle cx="280" cy="90" r="14" fill="#E0E3ED" />
      <circle cx="120" cy="50" r="8" fill="#EDEBE0" />
      <circle cx="340" cy="140" r="6" stroke="#1e2025" strokeWidth="2" fill="none" />
      <circle cx="80" cy="180" r="12" stroke="#B2B4B7" strokeWidth="2" strokeDasharray="3 3" fill="none" />

      {/* Desk Base Surface */}
      <path 
        d="M50 260 L350 260 L320 285 L80 285 Z" 
        fill="#1e2025" 
      />
      <rect x="75" y="285" width="250" height="8" rx="4" fill="#52565c" />

      {/* Chair Back */}
      <path 
        d="M120 180 C120 140 140 130 170 130 C190 130 200 145 200 180 L210 260 L130 260 Z" 
        fill="#52565c" 
      />

      {/* Student Body - Yellow Jacket (Matching Reference) */}
      <path 
        d="M180 160 Q210 150 240 160 Q275 190 280 260 L180 260 Z" 
        fill="#F4C542" 
      />
      {/* Inner Top */}
      <path d="M215 160 L235 160 L230 210 L215 210 Z" fill="#FFFFFF" />

      {/* Student Head & Hair */}
      {/* Hair Shadow / Back */}
      <path 
        d="M200 115 C190 80 220 50 255 55 C280 60 295 90 285 130 C280 150 265 170 255 180 C240 170 220 150 210 135 Z" 
        fill="#1e2025" 
      />
      {/* Face */}
      <path 
        d="M225 90 Q240 85 250 95 Q255 110 245 125 Q230 130 220 115 Z" 
        fill="#FCD5CE" 
      />
      {/* Neck */}
      <path d="M228 120 L242 120 L240 145 L226 145 Z" fill="#F8AD9D" />

      {/* Hair Front Lock */}
      <path 
        d="M210 90 C200 65 240 45 265 60 C275 66 265 95 245 95 C230 95 215 105 210 90 Z" 
        fill="#1e2025" 
      />

      {/* Arms & Hands Typing on Laptop */}
      <path 
        d="M240 185 Q270 210 300 215 L290 230 Q260 225 235 200 Z" 
        fill="#F4C542" 
      />
      <path 
        d="M215 185 Q245 220 280 225 L270 238 Q235 230 205 195 Z" 
        fill="#E5B038" 
      />
      {/* Hands Skin */}
      <circle cx="300" cy="220" r="9" fill="#FCD5CE" />
      <circle cx="280" cy="230" r="8" fill="#FCD5CE" />

      {/* Modern Laptop Open */}
      {/* Screen */}
      <path 
        d="M290 150 L370 140 L360 225 L280 230 Z" 
        fill="#1e2025" 
      />
      {/* Screen Display Glow */}
      <path 
        d="M296 156 L364 147 L355 220 L287 224 Z" 
        fill="#E0E3ED" 
      />
      {/* Apple / Brand Logo on Screen */}
      <circle cx="325" cy="185" r="5" fill="#FFFFFF" opacity="0.9" />

      {/* Laptop Keyboard Base */}
      <path 
        d="M270 230 L375 222 L390 238 L260 246 Z" 
        fill="#B2B4B7" 
      />
      <path 
        d="M260 246 L390 238 L385 242 L255 250 Z" 
        fill="#52565c" 
      />

      {/* Coffee Mug on Desk */}
      <rect x="140" y="220" width="22" height="28" rx="4" fill="#FFFFFF" stroke="#1e2025" strokeWidth="2" />
      <path d="M162 228 C170 228 170 242 162 242" stroke="#1e2025" strokeWidth="2" fill="none" />
      {/* Steam Rising */}
      <path d="M146 214 Q148 208 145 202" stroke="#B2B4B7" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M154 214 Q157 207 153 200" stroke="#B2B4B7" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export default StudentIllustration;
