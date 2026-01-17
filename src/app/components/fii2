import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, Code2, Bot, Popcorn, RefreshCw, 
  Crosshair, Trophy, Code, Award, Sparkles 
} from 'lucide-react';
import { ExpressiveRobot } from './ExpressiveRobot';
import { DroneFollower } from './DroneFollower';

interface HomeProps {
  onNavigate: (page: string) => void;
}

type RobotEmotion = 'Idle' | 'Dance' | 'Wave' | 'Jump' | 'Cry' | 'Laugh' | 'Sitting';

// --- TYPEWRITER COMPONENT ---
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
    const handleMove = (e: MouseEvent) => setCoords({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-30 font-mono text-[10px] text-cyan-500/40 uppercase tracking-widest p-10 hidden lg:block">
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
    const timer = setTimeout(() => {
      setRobotState('Wave');
      setShowSpeechBubble(true);
    }, 1500);

    const hideTimer = setTimeout(() => {
      setRobotState('Idle');
      setShowSpeechBubble(false);
    }, 9500);

    return () => { 
      clearTimeout(timer); 
      clearTimeout(hideTimer); 
    };
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#0a0a0a] text-white relative overflow-x-hidden selection:bg-cyan-500/30"
    >
      <div className="fixed inset-0 pointer-events-none z-10">
        <DroneFollower />
      </div>

      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 bg-[#0a0a0a]" />

      <CyberHUD />

      <div className="relative z-20 max-w-7xl mx-auto px-6 pt-32 pb-24">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24 mb-32">
          
          <div className="lg:w-1/2 space-y-12 text-center lg:text-left">
            <div className="flex justify-center lg:justify-start">
              <div className="flex items-center gap-4 sm:gap-8 px-10 py-5 rounded-full border border-white/10 bg-white/5 backdrop-blur-2xl shadow-2xl transition-all duration-500 cursor-default select-none group">
                <StatusItem icon={<Popcorn className="w-5 h-5" />} label="EAT" hoverColor="hover:text-cyan-400" />
                <span className="text-gray-800">•</span>
                <StatusItem icon={<Code2 className="w-5 h-5" />} label="CODE" hoverColor="hover:text-purple-400" />
                <span className="text-gray-800">•</span>
                <StatusItem icon={<Bot className="w-5 h-5" />} label="BUILD" hoverColor="hover:text-yellow-400" />
                <span className="text-gray-800">•</span>
                <StatusItem icon={<RefreshCw className="w-5 h-5 animate-spin-slow" />} label="REPEAT" hoverColor="hover:text-green-400" />
              </div>
            </div>

            <div className="space-y-6">
              <h1 className="text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.9]">
                <span className="bg-gradient-to-br from-white via-white to-gray-500 bg-clip-text text-transparent">Paneendra</span>
                <br />
                <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">Kumar</span>
              </h1>
              <h2 className="text-3xl md:text-4xl text-gray-400 font-light tracking-tight italic">
                "Writing Code That <span className="text-white not-italic font-medium">Moves</span>"
              </h2>
            </div>
            
            <p className="text-xl md:text-2xl text-gray-500 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-light">
              Focusing <span className="text-white font-normal">Robotics</span>, 
              <span className="text-white font-normal">AI & ML</span>, and 
              <span className="text-white font-normal"> IoT</span>.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
              <button onClick={() => onNavigate('Projects')} className="group px-10 py-5 bg-white text-black rounded-2xl font-bold text-lg hover:bg-cyan-400 transition-all flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                Explore Projects <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button onClick={() => onNavigate('Contact')} className="px-10 py-5 border border-white/10 bg-white/5 rounded-2xl font-bold text-lg hover:bg-white/10 transition-all">
                Contact Me
              </button>
            </div>
          </div>
          
          <div className="lg:w-1/2 flex justify-center lg:justify-end relative">
            <div className="relative w-full max-w-xl aspect-square group">
              
              {/* SPEECH BUBBLE */}
              <AnimatePresence>
                {showSpeechBubble && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.5, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.5, y: 30 }}
                    className="absolute top-[-10%] left-1/2 -translate-x-1/2 z-50 pointer-events-none"
                  >
                    <div className="bg-white text-black px-6 py-3 rounded-2xl shadow-[0_10px_40px_rgba(34,211,238,0.4)] relative border-2 border-cyan-400">
                      <p className="text-sm font-bold whitespace-nowrap">
                        <TypewriterText text="Hello! Welcome to my system. 🤖" delay={50} />
                      </p>
                      <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[12px] border-l-transparent border-t-[12px] border-t-cyan-400 border-r-[12px] border-r-transparent"></div>
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-t-[10px] border-t-white border-r-[10px] border-r-transparent"></div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ROBOT CASING (The badge and its container have been removed from here) */}
              <div className="relative h-full w-full rounded-[2.5rem] overflow-hidden border border-white/10 bg-black/40 backdrop-blur-md shadow-3xl">
                <ExpressiveRobot action={robotState} />
              </div>

              <button 
                onClick={() => setRobotState('Dance')}
                className="absolute -bottom-6 -left-6 w-20 h-20 bg-[#111] border border-cyan-500/30 rounded-2xl p-4 shadow-2xl hover:scale-110 active:scale-95 transition-all flex items-center justify-center group/btn z-40"
              >
                <Bot className="w-10 h-10 text-cyan-500 group-hover/btn:animate-bounce" />
                <div className="absolute -top-2 -left-2">
                  <Sparkles className="w-6 h-6 text-yellow-500 animate-pulse" />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* --- ACTIVITY CARDS --- */}
        <div className="pt-24 border-t border-white/5">
          <div className="grid md:grid-cols-3 gap-10">
            <ActivityCard icon={<Trophy className="w-8 h-8 text-yellow-500" />} label="Achievement" title="1st Place Techmela" desc="Won top prize for designing a neural-link waste segregation hardware unit." btnText="View Timeline" onClick={() => onNavigate('Achievements')} />
            <ActivityCard icon={<Code className="w-8 h-8 text-purple-500" />} label="Project" title="Smart Waste Bin" desc="AI-driven segregation using TensorFlow Lite on ESP32 to classify and sort waste automatically." btnText="View Projects" onClick={() => onNavigate('Projects')} />
            <ActivityCard icon={<Award className="w-8 h-8 text-pink-500" />} label="Certification" title="MATLAB Onramp" desc="Course completion certificate for mastering MATLAB fundamentals and applications." btnText="More" onClick={() => onNavigate('Certifications')} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Sub-components StatusItem and ActivityCard remain the same...
function StatusItem({ icon, label, hoverColor }: { icon: React.ReactNode, label: string, hoverColor: string }) {
  return (
    <div className={`flex items-center gap-2.5 text-gray-500 transition-colors duration-300 ${hoverColor} cursor-default`}>
      {icon}
      <span className="text-[10px] sm:text-xs font-black tracking-[0.2em]">{label}</span>
    </div>
  );
}

function ActivityCard({ icon, label, title, desc, btnText, onClick }: any) {
  return (
    <div onClick={onClick} className="group bg-[#111] border border-white/5 rounded-[2rem] p-10 transition-all cursor-pointer hover:-translate-y-3 shadow-2xl hover:border-white/20">
      <div className="mb-8 p-4 w-fit rounded-2xl bg-white/5 border border-white/5 group-hover:scale-110 transition-transform duration-500">
        {icon}
      </div>
      <div className="space-y-3 mb-8">
        <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">{label}</span>
        <h3 className="text-2xl font-bold text-white tracking-tight">{title}</h3>
        <p className="text-gray-500 leading-relaxed text-sm">{desc}</p>
      </div>
      <div className="flex items-center gap-2 text-white text-xs font-bold group-hover:gap-4 transition-all uppercase tracking-widest">
        {btnText} <ArrowRight className="w-4 h-4" />
      </div>
    </div>
  );
}