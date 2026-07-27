import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

interface CyberButtonProps {
  text: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  variant?: "primary" | "secondary";
}

const CYBER_CHARS = "!@#$%^&*()_+-=[]{}|;:,.<>?/";

export const CyberButton: React.FC<CyberButtonProps> = ({ 
  text, 
  onClick, 
  icon, 
  variant = "primary" 
}) => {
  const [displayText, setDisplayText] = useState(text);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // --- MAGNETIC EFFECT STATE ---
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // --- TEXT SCRAMBLE LOGIC ---
  const scramble = () => {
    let iteration = 0;
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setDisplayText((prev) =>
        text
          .split("")
          .map((letter, index) => {
            if (index < iteration) {
              return text[index];
            }
            return CYBER_CHARS[Math.floor(Math.random() * CYBER_CHARS.length)];
          })
          .join("")
      );

      if (iteration >= text.length) {
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
      iteration += 1 / 3; // Speed of decoding
    }, 30);
  };

  const stopScramble = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setDisplayText(text);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // --- MOUSE MOVEMENT LOGIC (MAGNETIC + GLOW) ---
  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    
    // Calculate mouse position relative to center of button
    const x = (clientX - (left + width / 2)) * 0.3; // 0.3 is the "magnetic strength"
    const y = (clientY - (top + height / 2)) * 0.3;
    
    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    stopScramble();
    setPosition({ x: 0, y: 0 }); // Reset position
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    scramble();
  };

  // Styles based on variant
  const isPrimary = variant === "primary";
  const baseStyles = "relative group px-8 py-4 rounded-xl font-bold text-base transition-all duration-300 overflow-hidden flex items-center justify-center gap-3";
  const colorStyles = isPrimary 
    ? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_40px_rgba(34,211,238,0.6)]" 
    : "bg-black/40 text-white border border-white/10 hover:border-cyan-400/50 hover:bg-cyan-900/10";

  return (
    <motion.button
      ref={buttonRef}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className={`${baseStyles} ${colorStyles}`}
    >
      {/* GLOW EFFECT (Only visible on hover) */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
      </div>

      {/* ICON (Animated) */}
      {icon && (
        <span className="relative z-10 group-hover:translate-x-1 transition-transform duration-300">
          {icon}
        </span>
      )}

      {/* TEXT (Scrambling) */}
      <span className="relative z-10 font-mono tracking-wider min-w-[100px] text-left">
        {displayText}
      </span>

      {/* CORNER ACCENTS (For that robotic look) */}
      <div className="absolute top-0 left-0 w-2 h-2 border-l-2 border-t-2 border-current opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-r-2 border-b-2 border-current opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.button>
  );
};
