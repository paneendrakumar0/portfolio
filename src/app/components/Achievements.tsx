import React, { useRef, useMemo, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { Trophy, Code2, Award, Users, Laptop, ExternalLink, Rocket, Megaphone, School, School2, GraduationCap } from 'lucide-react';

// --- TILT CARD COMPONENT ---
const TiltCard = ({ 
  children, 
  gradient = "from-gray-800 to-gray-900", 
  className = "", 
  isFocused,    
  isBlurred     
}: any) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseY = useSpring(y, { stiffness: 150, damping: 15 });
  
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  function onMouseMove({ currentTarget, clientX, clientY }: any) {
    if (isMobile) return;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    x.set(clientX - left - width / 2);
    y.set(clientY - top - height / 2);
  }

  const rotateX = useTransform(mouseY, [-200, 200], [isMobile ? "2deg" : "10deg", isMobile ? "-2deg" : "-10deg"]);
  const rotateY = useTransform(mouseX, [-200, 200], [isMobile ? "-2deg" : "-10deg", isMobile ? "2deg" : "10deg"]);

  return (
    <motion.div
      style={{ perspective: 1000 }}
      className={`relative h-full ${className}`}
      onMouseMove={onMouseMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      animate={{
        opacity: isBlurred ? 0.2 : 1,          
        scale: isFocused ? 1.05 : (isBlurred ? 0.95 : 1), 
        filter: isBlurred ? 'blur(2px) grayscale(80%)' : 'blur(0px) grayscale(0%)', 
        zIndex: isFocused ? 50 : 1             
      }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative h-full group"
      >
        <div 
           style={{ transform: isMobile ? "none" : "translateZ(-10px)" }}
           className={`absolute inset-1 bg-gradient-to-br ${gradient} blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500 rounded-2xl`}
        />
        <div className="relative h-full bg-gray-900/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 md:p-6 shadow-xl overflow-hidden" style={{ transform: isMobile ? "none" : "translateZ(0px)" }}>
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
};

// --- TEMPORAL SCRUBBER ---
const TemporalScrubber = ({ years, activeYear, isGlobalBlur }: any) => {
  const scrollToYear = (year: string) => {
    const element = document.getElementById(`year-marker-${year}`);
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <motion.div 
      className="fixed right-4 top-1/2 -translate-y-1/2 z-50 hidden xl:flex flex-col items-center gap-6"
      animate={{ opacity: isGlobalBlur ? 0.1 : 1 }} 
    >
      <div className="h-24 w-px bg-gradient-to-b from-transparent to-gray-600"></div>
      {years.map((year: string) => (
        <button
          key={year}
          onClick={() => scrollToYear(year)}
          className="group relative flex items-center justify-center"
        >
          <span className={`absolute right-8 font-mono text-sm transition-all duration-300 ${
            activeYear === year ? 'opacity-100 text-purple-400 translate-x-0' : 'opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 text-gray-500'
          }`}>
            {year}
          </span>
          <div className={`w-3 h-3 rounded-full border-2 transition-all duration-500 ${
            activeYear === year 
              ? 'bg-purple-500 border-purple-500 scale-125 shadow-[0_0_15px_rgba(168,85,247,0.8)]' 
              : 'bg-black border-gray-600 group-hover:border-white'
          }`} />
        </button>
      ))}
      <div className="h-24 w-px bg-gradient-to-b from-gray-600 to-transparent"></div>
    </motion.div>
  );
};

export function Achievements() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ 
    target: ref, 
    offset: ["start 10%", "end 80%"] 
  });
  
  const beamHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const [activeYear, setActiveYear] = useState<string | null>(null);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null); 

  // --- UPDATED PROFILES USING README WIDGETS ---
  const codingProfiles = [
     { 
       id: 'c1', 
       platform: 'LeetCode', 
       // Used the exact username from your screenshot: WaRRDUFY7j
       imageUrl: 'https://leetcard.jacoblin.cool/WaRRDUFY7j?theme=dark&font=syne_mono&ext=heatmap',
       color: 'from-orange-500 to-yellow-500', 
       link: 'https://leetcode.com/u/WaRRDUFY7j/' 
     },
     { 
       id: 'c2', 
       platform: 'Codeforces', // Changed from CodeChef to Codeforces
       // Used the username from your screenshot: paneendra
       imageUrl: 'https://codeforces-readme-stats.vercel.app/api/card?username=paneendra&theme=dark&disable_animations=true',
       color: 'from-blue-600 to-cyan-500', 
       link: 'https://codeforces.com/profile/paneendra'
     },
     { 
       id: 'c3', 
       platform: 'Kaggle', 
       // Kaggle doesn't have a reliable widget, so we keep a clean fallback card
       imageUrl: null,
       rank: 'Novice Contributor',
       color: 'from-cyan-500 to-blue-500', 
       icon: Award,
       link: 'https://www.kaggle.com/paneendrakumar' 
     },
  ];

  const rawTimelineData = [
    { id: 't1', category: 'position', title: 'Junior Member - CCA', org: 'NIT Durgapur', date: 'May 2025 - Present', sortDate: '2025-05', desc: 'Member in Mechatronics and Robot Operating System Domain', icon: Users, gradient: 'from-purple-600 to-indigo-600' },
    { id: 't2', category: 'position', title: 'Class I-X', org: 'Mangal Vidyalayam', date: 'May 2012 - May 2022', sortDate: '2012-05', desc: 'X grade:- 96.7 %', icon: School, gradient: 'from-purple-600 to-indigo-600' },
    { id: 't2-2', category: 'position', title: 'Class XI-XII', org: 'Mangal Vidyalayam', date: 'June 2022 - May 2024', sortDate: '2022-05', desc: 'XII grade:- 91.8%', icon: School2, gradient: 'from-purple-600 to-indigo-600' },
    { id: 't3', category: 'position', title: 'Mechanical Engineer', org: 'NIT Durgapur', date: 'Aug 2024 - Present', sortDate: '2024-09', desc: 'Student of 4 Year Undergraduate Mechanical Engineering', icon: GraduationCap, gradient: 'from-purple-600 to-indigo-600' },
    { id: 't5', category: 'position', title: 'Robocon 2026 Engineer', org: 'NIT Durgapur', date: 'Dec 2025 - Present', sortDate: '2025-12', desc: 'Developing autonomous navigation algorithms and control systems.', icon: Laptop, gradient: 'from-cyan-600 to-blue-600' },
    { id: 't6', category: 'event', title: 'Techmela Organizer', org: 'Core Committee', date: 'Nov 2025', sortDate: '2025-11', desc: 'Orchestrated logistics for Conjecture, Techmela, and Escape Room.', icon: Megaphone, gradient: 'from-pink-600 to-rose-600' },
  ];

  const { sortedData, years } = useMemo(() => {
    const sorted = [...rawTimelineData].sort((a, b) => new Date(b.sortDate).getTime() - new Date(a.sortDate).getTime());
    const distinctYears = [...new Set(sorted.map(item => item.sortDate.split('-')[0]))];
    return { sortedData: sorted, years: distinctYears };
  }, [rawTimelineData]);

  useEffect(() => {
    const handleScroll = () => {
      for (const year of years) {
        const element = document.getElementById(`year-marker-${year}`);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top >= 0 && rect.top < window.innerHeight / 2) {
            setActiveYear(year);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [years]);

  const hackathons = [
    { id: 'h1', name: 'Techmela', position: '1st Place', date: 'Nov 2025', description: 'Built an AI-driven Waste Segregation system using IoT sensors and Computer Vision.', tags: ['IoT', 'Python', 'CV'],},
  ];

  return (
    <div id="achievements-timeline" className="min-h-screen bg-[#0a0a0a] text-white pt-24 pb-20 overflow-x-hidden selection:bg-purple-500/30">
      
      <TemporalScrubber years={years} activeYear={activeYear} isGlobalBlur={hoveredItem !== null} />

      <div className="max-w-7xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: hoveredItem ? 0.2 : 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-24 text-center"
        >
          <h1 className="text-4xl md:text-7xl font-bold mb-6 tracking-tight">
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent filter drop-shadow-lg">
              Achievements
            </span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
            A visual timeline of my roles, events, and victories.
          </p>
        </motion.div>

        {/* --- STATS CARDS --- */}
        <div className="grid md:grid-cols-3 gap-8 mb-40">
          {codingProfiles.map((profile, idx) => (
            <motion.a 
              key={idx}
              href={profile.link}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              onMouseEnter={() => setHoveredItem(profile.id)}
              onMouseLeave={() => setHoveredItem(null)}
              className="h-full"
            >
              <TiltCard 
                gradient={profile.color}
                isFocused={hoveredItem === profile.id}
                isBlurred={hoveredItem !== null && hoveredItem !== profile.id}
                className="h-full"
              >
                 {profile.imageUrl ? (
                   // DYNAMIC WIDGETS (LeetCode & Codeforces)
                   <div className="flex flex-col h-full justify-between">
                     <div className="flex-1 flex items-center justify-center mb-4">
                       <img 
                         src={profile.imageUrl} 
                         alt={`${profile.platform} Stats`} 
                         className="w-full h-auto rounded-lg shadow-lg"
                       />
                     </div>
                     {/* ADDED: Platform Name */}
                     <div>
                       <h3 className="text-2xl font-bold text-white">{profile.platform}</h3>
                     </div>
                   </div>
                 ) : (
                   // STATIC CARD (Kaggle)
                   <div className="flex flex-col h-full justify-between">
                     <div className="flex justify-between items-start mb-6">
                        <div className={`p-3 rounded-xl bg-gradient-to-br ${profile.color} bg-opacity-20`}>
                            {profile.icon && <profile.icon className="w-8 h-8 text-white" />}
                        </div>
                        <ExternalLink className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" />
                     </div>
                     <div>
                        <h3 className="text-2xl font-bold">{profile.platform}</h3>
                        <p className="font-mono text-sm mt-1 text-cyan-400">
                            {profile.rank}
                        </p>
                     </div>
                   </div>
                 )}
              </TiltCard>
            </motion.a>
          ))}
        </div>

        {/* --- MAJOR VICTORIES --- */}
        <section className="mb-40">
             <h2 className="text-3xl font-bold text-center mb-12 flex items-center justify-center gap-3">
               <Trophy className="text-yellow-500" /> 
               Major Victories
             </h2>
             {hackathons.map((hack, i) => (
               <motion.div 
                 key={i}
                 initial={{ opacity: 0, y: 30 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 className="max-w-4xl mx-auto"
                 onMouseEnter={() => setHoveredItem(hack.id)}
                 onMouseLeave={() => setHoveredItem(null)}
               >
                 <TiltCard 
                   gradient="from-yellow-600 to-orange-600"
                   isFocused={hoveredItem === hack.id}
                   isBlurred={hoveredItem !== null && hoveredItem !== hack.id}
                 >
                    <div className="flex flex-col md:flex-row gap-6 items-start md:items-center relative z-10">
                        <div className="flex-1">
                             <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-xl md:text-2xl font-bold text-white">{hack.name}</h3>
                                <span className="px-3 py-1 bg-yellow-500/20 text-yellow-300 font-mono text-xs md:sm rounded-full border border-yellow-500/30 whitespace-nowrap">{hack.position} 🏆</span>
                             </div>
                             <p className="text-gray-300 mb-4 text-sm md:text-base">{hack.description}</p>
                             <div className="flex flex-wrap gap-2">
                                {hack.tags.map((tag, t) => (
                                    <span key={t} className="px-2 py-1 bg-black/50 border border-white/10 rounded text-[10px] font-mono text-gray-400">#{tag}</span>
                                ))}
                             </div>
                          </div>
                          <div className="text-right md:border-l md:border-white/10 md:pl-6 font-mono w-full md:w-auto">
                             <p className="text-gray-500 text-sm">{hack.date}</p>
                          </div>
                    </div>
                 </TiltCard>
               </motion.div>
             ))}
        </section>

        <div ref={ref} className="relative mb-32">
            <motion.div 
                animate={{ opacity: hoveredItem ? 0.2 : 0.8 }}
                className="flex justify-between items-end mb-20 px-4 md:px-0"
            >
                <h2 className="hidden md:block text-2xl font-bold text-gray-500 text-right w-5/12">Positions of<br/><span className="text-white text-3xl">Responsibility</span></h2>
                <div className="w-8"></div> 
                <h2 className="hidden md:block text-2xl font-bold text-gray-500 text-left w-5/12">Events<br/><span className="text-white text-3xl">Conducted</span></h2>
            </motion.div>

          <div className="relative mx-auto max-w-6xl pb-32">
            {/* Timeline center line and beam code remains same */}
            <div className="absolute left-4 md:left-1/2 -top-8 transform -translate-x-1/2 flex flex-col items-center z-20">
                <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-black border-2 border-green-500 shadow-[0_0_15px_#22c55e]">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                </div>
                <span className="mt-2 text-[10px] font-mono text-green-500 tracking-widest font-bold">PRESENT</span>
            </div>

            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 md:w-1 bg-gray-800 rounded-full md:-translate-x-1/2" />
            
            <motion.div 
              style={{ height: beamHeight }}
              animate={{ opacity: hoveredItem ? 0.3 : 1 }}
              className="absolute left-4 md:left-1/2 top-0 w-0.5 md:w-1 bg-gradient-to-b from-green-400 via-blue-500 to-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.8)] rounded-full md:-translate-x-1/2 z-10"
            />

            <div className="space-y-16 pt-12">
              {sortedData.map((item, idx) => {
                const isLeft = item.category === 'position';
                const currentYear = item.sortDate.split('-')[0];
                const prevItem = sortedData[idx - 1];
                const prevYear = prevItem ? prevItem.sortDate.split('-')[0] : null;
                const isNewYear = currentYear !== prevYear;

                return (
                  <React.Fragment key={idx}>
                    {isNewYear && (
                       <motion.div 
                         id={`year-marker-${currentYear}`} 
                         animate={{ opacity: hoveredItem ? 0.2 : 1 }}
                         className="relative flex justify-start pl-10 md:pl-0 md:justify-center py-8 z-20"
                       >
                           <div className="bg-black border border-gray-700 px-4 md:px-6 py-1 md:py-2 rounded-full text-lg md:text-xl font-bold font-mono text-gray-200 shadow-xl backdrop-blur-md">
                               {currentYear}
                           </div>
                       </motion.div>
                    )}

                    <div className={`relative flex items-center md:justify-between`}>
                      <div className={`pl-12 md:pl-0 md:w-5/12 ${isLeft ? 'block' : 'hidden md:block md:opacity-0'}`}>
                          {isLeft && (
                             <motion.div
                              initial={{ opacity: 0, x: -50 }} 
                              whileInView={{ opacity: 1, x: 0 }}
                              viewport={{ once: true, margin: "-50px" }}
                              transition={{ type: "spring", stiffness: 50, damping: 20 }}
                              onMouseEnter={() => setHoveredItem(item.id)}
                              onMouseLeave={() => setHoveredItem(null)}
                             >
                               <TiltCard 
                                 gradient={item.gradient} 
                                 className="md:text-right"
                                 isFocused={hoveredItem === item.id}
                                 isBlurred={hoveredItem !== null && hoveredItem !== item.id}
                               >
                                  <div className="flex flex-row md:flex-row-reverse items-center gap-4 mb-3">
                                      <item.icon className="w-6 h-6 text-white shrink-0" />
                                      <h3 className="text-lg md:text-xl font-bold group-hover:text-purple-400 transition-colors">{item.title}</h3>
                                  </div>
                                  <p className="text-purple-400 font-mono text-xs md:text-sm mb-3">{item.date}</p>
                                  <p className="text-gray-400 text-xs md:text-sm leading-relaxed">{item.desc}</p>
                               </TiltCard>
                             </motion.div>
                          )}
                      </div>

                      <motion.div 
                        animate={{ opacity: hoveredItem ? 0.2 : 1 }}
                        className="absolute left-4 md:left-1/2 w-3 h-3 md:w-4 md:h-4 bg-black border-2 border-white rounded-full md:-translate-x-1/2 z-20 shadow-[0_0_10px_white]"
                      >
                           <div className={`hidden md:block absolute top-1/2 -translate-y-1/2 w-12 h-[2px] bg-gray-700 -z-10 ${isLeft ? 'right-full' : 'left-full'}`} />
                      </motion.div>

                      <div className={`pl-12 md:pl-0 md:w-5/12 ${!isLeft ? 'block' : 'hidden md:block md:opacity-0'}`}>
                           {!isLeft && (
                             <motion.div
                              initial={{ opacity: 0, x: 50 }} 
                              whileInView={{ opacity: 1, x: 0 }}
                              viewport={{ once: true, margin: "-50px" }}
                              transition={{ type: "spring", stiffness: 50, damping: 20 }}
                              onMouseEnter={() => setHoveredItem(item.id)}
                              onMouseLeave={() => setHoveredItem(null)}
                             >
                               <TiltCard 
                                 gradient={item.gradient} 
                                 className="text-left"
                                 isFocused={hoveredItem === item.id}
                                 isBlurred={hoveredItem !== null && hoveredItem !== item.id}
                               >
                                  <div className="flex items-center gap-4 mb-3">
                                      <item.icon className="w-6 h-6 text-white shrink-0" />
                                      <h3 className="text-lg md:text-xl font-bold group-hover:text-pink-400 transition-colors">{item.title}</h3>
                                  </div>
                                  <p className="text-pink-400 font-mono text-xs md:text-sm mb-3">{item.date}</p>
                                  <p className="text-gray-400 text-xs md:text-sm leading-relaxed">{item.desc}</p>
                               </TiltCard>
                             </motion.div>
                           )}
                      </div>
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
          
            <div className="absolute left-4 md:left-1/2 -bottom-16 transform -translate-x-1/2 flex flex-col items-center pt-8 opacity-50">
              <Rocket className="w-8 h-8 text-purple-500 mb-2" />
              <span className="text-[10px] font-mono text-purple-500 tracking-widest">THE BEGINNING</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
