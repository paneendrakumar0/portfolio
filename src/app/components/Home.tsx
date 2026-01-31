import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, Code2, Bot, Popcorn, RefreshCw, 
  Crosshair, Trophy, Code, Award, Sparkles, Command
} from 'lucide-react';
import { FloatingSkills } from '../components/FloatingSkills'; 
import { ExpressiveRobot } from '../components/ExpressiveRobot';
import { DroneFollower } from '../components/DroneFollower';
import { AIChatWidget } from '../components/AIChatWidget'; 

interface HomeProps {
  onNavigate: (page: string) => void;
}

type RobotEmotion = 'Idle' | 'Dance' | 'Wave' | 'Jump' | 'Cry' | 'Laugh' | 'Sitting';

// --- WARP SPEED BACKGROUND (Subtle & Colored) ---
const WarpSpeedBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const COLORS = ["34, 211, 238", "168, 85, 247", "236, 72, 153"];
    const stars: { x: number; y: number; z: number; color: string }[] = [];
    const numStars = 400; 
    const speed = 2; 

    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * width - width / 2,
        y: Math.random() * height - height / 2,
        z: Math.random() * width,
        color: COLORS[Math.floor(Math.random() * COLORS.length)]
      });
    }

    const animate = () => {
      ctx.fillStyle = "#0a0a0a"; 
      ctx.fillRect(0, 0, width, height);

      stars.forEach((star) => {
        star.z -= speed;
        if (star.z <= 0) {
          star.x = Math.random() * width - width / 2;
          star.y = Math.random() * height - height / 2;
          star.z = width;
          star.color = COLORS[Math.floor(Math.random() * COLORS.length)];
        }

        const k = 128.0 / star.z;
        const px = star.x * k + width / 2;
        const py = star.y * k + height / 2;

        if (px >= 0 && px <= width && py >= 0 && py <= height) {
          const size = (1 - star.z / width) * 2.5;
          const opacity = (1 - star.z / width) * 0.5; // Kept subtle
          
          ctx.beginPath();
          ctx.fillStyle = `rgba(${star.color}, ${opacity})`; 
          ctx.arc(px, py, size, 0, Math.PI * 2);
          ctx.fill();
        }
      });
      requestAnimationFrame(animate);
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    animate();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none opacity-40" />;
};

function TypewriterText({ text, delay = 50 }: { text: string; delay?: number }) {
  const [displayedText, setDisplayedText] = useState("");
  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      setDisplayedText(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(timer);
    }, delay);
    return () => clearInterval(timer);
  }, [text, delay]);
  return <span>{displayedText}</span>;
}

function CyberHUD() {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  useEffect(() => {
    if (window.innerWidth < 1024) return;
    const handleMove = (e: MouseEvent) => setCoords({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-30 font-mono text-[10px] text-cyan-500/30 uppercase tracking-widest p-10 hidden lg:block">
      <div className="absolute top-10 left-10 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-cyan-500 animate-pulse" /> 
          DRONE_LINK: ACTIVE
        </div>
        <div className="text-[8px] opacity-50">UNIT_ID: drone1.glb</div>
      </div>
      <div className="absolute bottom-10 left-10 flex gap-8 items-end">
        <div className="flex flex-col">
          <span className="opacity-50">UNIT_X</span>
          <span className="text-lg text-cyan-400 font-bold">{coords.x}</span>
        </div>
        <div className="flex flex-col">
          <span className="opacity-50">UNIT_Y</span>
          <span className="text-lg text-cyan-400 font-bold">{coords.y}</span>
        </div>
      </div>
      <div className="absolute bottom-10 right-10 flex flex-col items-end gap-2">
        <Crosshair className="w-8 h-8 opacity-20 rotate-45" />
        <div className="bg-cyan-500/10 px-2 py-1 border border-cyan-500/20 text-cyan-400">ENCRYPTED</div>
      </div>
    </div>
  );
}

export function Home({ onNavigate }: HomeProps) {
  const [robotState, setRobotState] = useState<RobotEmotion>('Sitting');
  const [showSpeechBubble, setShowSpeechBubble] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => { setRobotState('Wave'); setShowSpeechBubble(true); }, 1500);
    const hideTimer = setTimeout(() => { setRobotState('Idle'); setShowSpeechBubble(false); }, 9500);
    return () => { clearTimeout(timer); clearTimeout(hideTimer); };
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#0a0a0a] text-white relative overflow-x-hidden selection:bg-cyan-500/30"
    >
      <WarpSpeedBackground />
      
      {/* --- RESTORED DRONE --- */}
      <div className="fixed inset-0 pointer-events-none z-10 hidden md:block">
        <DroneFollower />
      </div>

      <CyberHUD />

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 pt-24 md:pt-32 pb-12 md:pb-24">
        
        {/* --- HERO SECTION --- */}
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24 mb-10 lg:mb-20">
          <div className="w-full lg:w-1/2 space-y-8 md:space-y-10 text-center lg:text-left order-1 lg:order-1">
            
            <div className="space-y-4 md:space-y-6">
              <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.9]">
                <span className="bg-gradient-to-br from-white via-white to-gray-500 bg-clip-text text-transparent">Paneendra</span>
                <br />
                <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">Kumar</span>
              </h1>
              <h2 className="text-xl sm:text-3xl md:text-4xl text-gray-400 font-light tracking-tight italic px-2">
                "Writing Code That <span className="text-white not-italic font-medium">Moves</span>"
              </h2>
            </div>
            
            <div className="flex justify-center lg:justify-start">
              <div className="flex items-center gap-4 sm:gap-6 px-5 py-3 rounded-full border border-white/5 bg-white/5 backdrop-blur-sm shadow-xl">
                <StatusItem icon={<Popcorn className="w-4 h-4" />} label="EAT" hoverColor="hover:text-cyan-400" />
                <span className="text-gray-700 text-xs">•</span>
                <StatusItem icon={<Code2 className="w-4 h-4" />} label="CODE" hoverColor="hover:text-purple-400" />
                <span className="text-gray-700 text-xs">•</span>
                <StatusItem icon={<Bot className="w-4 h-4" />} label="BUILD" hoverColor="hover:text-yellow-400" />
              </div>
            </div>

            <p className="text-lg sm:text-xl text-gray-500 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-light px-4 lg:px-0">
              Focusing on <span className="text-gray-300 font-normal">Robotics</span>, <span className="text-gray-300 font-normal">AI & ML</span>, and <span className="text-gray-300 font-normal">IoT</span>.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center lg:justify-start w-full sm:w-auto px-6 sm:px-0 pt-4">
              <button onClick={() => onNavigate('Projects')} className="w-full sm:w-auto group px-8 py-4 bg-white text-black rounded-xl font-bold text-base hover:bg-cyan-400 transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-cyan-500/20">
                Explore Projects <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button onClick={() => onNavigate('Contact')} className="w-full sm:w-auto px-8 py-4 border border-white/10 bg-white/5 rounded-xl font-bold text-base hover:bg-white/10 transition-all">
                Contact Me
              </button>
            </div>
          </div>
          
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end relative order-2 lg:order-2 mt-8 lg:mt-0">
            <div className="relative w-[280px] sm:w-[400px] lg:w-full max-w-xl aspect-square group">
              <AnimatePresence>
                {showSpeechBubble && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: 10 }}
                    className="absolute top-[-10%] left-1/2 -translate-x-1/2 z-50 pointer-events-none w-max"
                  >
                    <div className="bg-white/90 backdrop-blur text-black px-4 py-2 rounded-xl shadow-xl border border-white/20">
                      <p className="text-xs font-bold whitespace-nowrap"><TypewriterText text="System Online. Hello! 👋" delay={50} /></p>
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white/90 rotate-45"></div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <div className="absolute inset-0 bg-cyan-500/10 rounded-full blur-3xl scale-75 animate-pulse"></div>
              
              <div className="relative h-full w-full rounded-[2rem] overflow-hidden border border-white/5 bg-black/20 backdrop-blur-sm shadow-2xl">
                <ExpressiveRobot action={robotState} />
              </div>

              <button onClick={() => setRobotState('Dance')} className="absolute -bottom-4 -left-4 w-14 h-14 bg-[#111] border border-cyan-500/20 rounded-xl flex items-center justify-center hover:scale-110 transition-all hover:border-cyan-500/50">
                <Bot className="w-6 h-6 text-cyan-500" />
              </button>
            </div>
          </div>
        </div>

        {/* --- FLOATING SKILLS SECTION (Fixed Overflow) --- */}
        <div className="py-16 border-t border-white/5 relative z-20">
            {/* Header stays ON TOP of icons */}
            <div className="relative z-10 text-center mb-8 bg-[#0a0a0a]/50 backdrop-blur-sm py-4 rounded-xl">
                <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-2 flex items-center justify-center gap-3">
                    <Command className="w-8 h-8 text-gray-500" />
                    <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">Tech</span> Stack
                </h2>
                <p className="text-gray-500 text-sm">Core technologies & tools</p>
            </div>
            
            {/* FIX: 
                1. overflow-hidden prevents icons from leaving this box 
                2. mask-image creates a fade-out effect at top/bottom so they don't cut off abruptly
                3. z-0 ensures they stay behind the text above if they float up
            */}
            <div className="relative z-0 h-[400px] w-full cursor-grab active:cursor-grabbing overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,white_10%,white_90%,transparent)]">
                <FloatingSkills />
            </div>
        </div>

        {/* --- ACTIVITY CARDS --- */}
        <div className="pt-16 border-t border-white/5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ActivityCard icon={<Trophy className="w-6 h-6 text-yellow-500" />} label="Achievement" title="1st Place Techmela" desc="Won top prize for designing a neural-link waste segregation unit." btnText="View Timeline" onClick={() => onNavigate('Achievements')} />
            <ActivityCard icon={<Code className="w-6 h-6 text-purple-500" />} label="Project" title="Smart Waste Bin" desc="AI-driven segregation using TensorFlow Lite on ESP32." btnText="View Projects" onClick={() => onNavigate('Projects')} />
            <ActivityCard icon={<Award className="w-6 h-6 text-pink-500" />} label="Certification" title="MATLAB Onramp" desc="Certificate for mastering MATLAB fundamentals and applications." btnText="More" onClick={() => onNavigate('Certifications')} />
          </div>
        </div>
      </div>
      
      <AIChatWidget />
    </motion.div>
  );
}

function StatusItem({ icon, label, hoverColor }: { icon: React.ReactNode, label: string, hoverColor: string }) {
  return (
    <div className={`flex items-center gap-2 text-gray-500 transition-colors duration-300 ${hoverColor} cursor-default whitespace-nowrap`}>
      {icon}
      <span className="text-[10px] font-bold tracking-widest">{label}</span>
    </div>
  );
}

function ActivityCard({ icon, label, title, desc, btnText, onClick }: any) {
  return (
    <div onClick={onClick} className="group bg-[#111] border border-white/5 rounded-2xl p-6 transition-all cursor-pointer hover:border-white/10 hover:bg-[#151515]">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 rounded-xl bg-white/5 group-hover:bg-white/10 transition-colors">{icon}</div>
        <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors -rotate-45 group-hover:rotate-0" />
      </div>
      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 block">{label}</span>
      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed mb-4">{desc}</p>
      <div className="text-xs font-bold text-white uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
        {btnText}
      </div>
    </div>
  );
}