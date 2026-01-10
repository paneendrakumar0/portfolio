import React, { useRef, useMemo, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { Trophy, Code2, Award, Users, Calendar, Laptop, ExternalLink, Rocket, Megaphone, School, School2, University, GraduationCap } from 'lucide-react';

// --- 1. 3D PHYSICS CARD ---
const TiltCard = ({ 
  children, 
  gradient = "from-gray-800 to-gray-900", 
  className = "", 
  isFocused,    
  isBlurred     
}) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseY = useSpring(y, { stiffness: 150, damping: 15 });

  function onMouseMove({ currentTarget, clientX, clientY }) {
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    x.set(clientX - left - width / 2);
    y.set(clientY - top - height / 2);
  }

  const rotateX = useTransform(mouseY, [-200, 200], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseX, [-200, 200], ["-10deg", "10deg"]);

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
        {isFocused && (
           <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             className="absolute -top-32 left-1/2 -translate-x-1/2 w-32 h-64 bg-gradient-to-b from-white/20 via-white/5 to-transparent blur-3xl -z-10 pointer-events-none"
           />
        )}

        <div 
           style={{ transform: "translateZ(-10px)" }}
           className={`absolute inset-1 bg-gradient-to-br ${gradient} blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500 rounded-2xl`}
        />
        
        <div className="relative h-full bg-gray-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl overflow-hidden" style={{ transform: "translateZ(0px)" }}>
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
};

// --- 2. TEMPORAL SCRUBBER ---
const TemporalScrubber = ({ years, activeYear, isGlobalBlur }) => {
  const scrollToYear = (year) => {
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
      
      {years.map((year) => (
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
  
  // --- FIX 1: ADJUST SCROLL OFFSET ---
  // "end 50%" means the beam finishes when the bottom of the timeline hits the MIDDLE of the screen.
  // This ensures it finishes before you run out of page to scroll.
  const { scrollYProgress } = useScroll({ 
    target: ref, 
    offset: ["start 10%", "end 80%"] 
  });
  
  const beamHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  
  const [activeYear, setActiveYear] = useState(null);
  const [hoveredItem, setHoveredItem] = useState(null); 

  // --- DATA INPUT ---
  const rawTimelineData = [
    {
      id: 't1', 
      category: 'position', 
      title: 'Junior Member - CCA',
      org: 'NIT Durgapur',
      date: 'May 2025 - Present',
      sortDate: '2025-05',
      desc: 'Member in Mechatronics and Robot Operating System Domain',
      icon: Users,
      gradient: 'from-purple-600 to-indigo-600'
    },
    {
      id: 't2', 
      category: 'position', 
      title: 'Class I-X',
      org: 'Mangal Vidyalayam',
      date: 'May 2012 - May 2022',
      sortDate: '2012-05',
      desc: 'X grade:- 96.7 %',
      icon: School,
      gradient: 'from-purple-600 to-indigo-600'
    },
 {
      id: 't2', 
      category: 'position', 
      title: 'Class XI-XII',
      org: 'Mangal Vidyalayam',
      date: 'June 2022 - May 2024',
      sortDate: '2022-05',
      desc: 'XII grade:- 91.8%',
      icon: School2,
      gradient: 'from-purple-600 to-indigo-600'
    },
{
      id: 't3', 
      category: 'position', 
      title: 'Mechanical Engineer',
      org: 'National Institute of Technology Durgapur',
      date: 'Aug 2024 - Present',
      sortDate: '2024-09',
      desc: 'Student of 4Year Undergraduate Mechanical Engineering',
      icon: GraduationCap,
      gradient: 'from-purple-600 to-indigo-600'
    },

    {
      id: 't5',
      category: 'position', 
      title: 'Robocon 2026 Engineer',
      org: 'NIT Durgapur',
      date: 'Dec 2025 - Present',
      sortDate: '2025-12',
      desc: 'Developing autonomous navigation algorithms and control systems.',
      icon: Laptop,
      gradient: 'from-cyan-600 to-blue-600'
    },
    {
      id: 't6',
      category: 'event',
      title: 'Techmela Organizer',
      org: 'Core Committee',
      date: 'Nov 2025',
      sortDate: '2025-11', 
      desc: 'Orchestrated logistics for Conjecture, Techmela, and Escape Room.',
      icon: Megaphone,
      gradient: 'from-pink-600 to-rose-600'
    },
  ];

  const { sortedData, years } = useMemo(() => {
    const sorted = [...rawTimelineData].sort((a, b) => new Date(b.sortDate) - new Date(a.sortDate));
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


  const codingProfiles = [
     { id: 'c1', platform: 'LeetCode', rating: 'Solving', rank: '~50,00,000', color: 'from-orange-500 to-yellow-500', text_color: 'text-orange-400', icon: Code2, link: 'https://leetcode.com/u/WaRRDUFY7j/' },
     { id: 'c2', platform: 'CodeChef', rating: '1400', rank: 'Unrated', color: 'from-amber-700 to-orange-600', text_color: 'text-amber-500', icon: Laptop, link: 'https://www.codechef.com/users/paneendrakumar' },
     { id: 'c3', platform: 'Kaggle', rating: 'Novice', rank: 'Contributor', color: 'from-blue-500 to-cyan-500', text_color: 'text-blue-400', icon: Award, link: 'https://www.kaggle.com/paneendrakumar' },
  ];

  const hackathons = [
    { id: 'h1', name: 'Techmela', position: '1st Place', date: 'Nov 2025', description: 'Built an AI-driven Waste Segregation system using IoT sensors and Computer Vision.', tags: ['IoT', 'Python', 'CV'],},
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-24 pb-20 overflow-x-hidden selection:bg-purple-500/30">
      
      <TemporalScrubber years={years} activeYear={activeYear} isGlobalBlur={hoveredItem !== null} />

      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: hoveredItem ? 0.2 : 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-24 text-center"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent filter drop-shadow-lg">
              Achievements
            </span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
            A visual timeline of my roles, events, and victories.
          </p>
        </motion.div>

        {/* Coding Profiles */}
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
              className="block h-full"
              onMouseEnter={() => setHoveredItem(profile.id)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <TiltCard 
                gradient={profile.color}
                isFocused={hoveredItem === profile.id}
                isBlurred={hoveredItem !== null && hoveredItem !== profile.id}
              >
                 <div className="flex justify-between items-start mb-6">
                   <div className={`p-3 rounded-xl bg-gradient-to-br ${profile.color} bg-opacity-20`}>
                      <profile.icon className="w-8 h-8 text-white" />
                   </div>
                   <ExternalLink className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" />
                </div>
                <div className="mt-6">
                  <h3 className="text-2xl font-bold">{profile.platform}</h3>
                  <p className={`font-mono text-sm mt-1 ${profile.text_color}`}>{profile.rank}</p>
                </div>
              </TiltCard>
            </motion.a>
          ))}
        </div>

        {/* Major Victories (Hackathons) */}
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
                                <h3 className="text-2xl font-bold text-white">{hack.name}</h3>
                                <span className="px-3 py-1 bg-yellow-500/20 text-yellow-300 font-mono text-sm rounded-full border border-yellow-500/30">{hack.position} 🏆</span>
                             </div>
                             <p className="text-gray-300 mb-4">{hack.description}</p>
                             <div className="flex flex-wrap gap-2">
                                {hack.tags.map((tag, t) => (
                                    <span key={t} className="px-2 py-1 bg-black/50 border border-white/10 rounded text-xs font-mono text-gray-400">#{tag}</span>
                                ))}
                             </div>
                         </div>
                         <div className="text-right md:border-l md:border-white/10 md:pl-6 font-mono">
                             <p className="text-2xl font-bold text-yellow-400">{hack.prize}</p>
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
            
      
            <div className="absolute left-8 md:left-1/2 -top-8 transform -translate-x-1/2 flex flex-col items-center z-20">
                <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-black border-2 border-green-500 shadow-[0_0_15px_#22c55e]">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                </div>
                <span className="mt-2 text-xs font-mono text-green-500 tracking-widest font-bold">PRESENT</span>
            </div>

           
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-gray-800 rounded-full md:-translate-x-1/2" />
            
         
            <motion.div 
              style={{ height: beamHeight }}
              animate={{ opacity: hoveredItem ? 0.3 : 1 }}
              className="absolute left-8 md:left-1/2 top-0 w-1 bg-gradient-to-b from-green-400 via-blue-500 to-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.8)] rounded-full md:-translate-x-1/2 z-10"
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
                          className="relative flex justify-center py-8 z-20"
                       >
                           <div className="bg-black border border-gray-700 px-6 py-2 rounded-full text-xl font-bold font-mono text-gray-200 shadow-xl backdrop-blur-md">
                               {currentYear}
                           </div>
                       </motion.div>
                    )}

                    <div className={`relative flex items-center md:justify-between`}>
                      
                 
                      <div className={`pl-20 md:pl-0 md:w-5/12 ${isLeft ? 'block' : 'hidden md:block md:opacity-0'}`}>
                         {isLeft && (
                             <motion.div
                              initial={{ opacity: 0, x: -100 }} 
                              whileInView={{ opacity: 1, x: 0 }}
                              viewport={{ once: true, margin: "-50px" }}
                              transition={{ type: "spring", stiffness: 50, damping: 20 }}
                              onMouseEnter={() => setHoveredItem(item.id)}
                              onMouseLeave={() => setHoveredItem(null)}
                             >
                               <TiltCard 
                                 gradient={item.gradient} 
                                 className="text-right"
                                 isFocused={hoveredItem === item.id}
                                 isBlurred={hoveredItem !== null && hoveredItem !== item.id}
                               >
                                  <div className="flex flex-row-reverse items-center gap-4 mb-3">
                                      <item.icon className="w-6 h-6 text-white" />
                                      <h3 className="text-xl font-bold group-hover:text-purple-400 transition-colors">{item.title}</h3>
                                  </div>
                                  <p className="text-purple-400 font-mono text-sm mb-3">{item.date}</p>
                                  <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                               </TiltCard>
                             </motion.div>
                         )}
                      </div>

                    
                      <motion.div 
                        animate={{ opacity: hoveredItem ? 0.2 : 1 }}
                        className="absolute left-8 md:left-1/2 w-4 h-4 bg-black border-2 border-white rounded-full md:-translate-x-1/2 z-20 shadow-[0_0_10px_white]"
                      >
                           <div className={`hidden md:block absolute top-1/2 -translate-y-1/2 w-12 h-[2px] bg-gray-700 -z-10 ${isLeft ? 'right-full' : 'left-full'}`} />
                      </motion.div>

                    
                      <div className={`pl-20 md:pl-0 md:w-5/12 ${!isLeft ? 'block' : 'hidden md:block md:opacity-0'}`}>
                           {!isLeft && (
                             <motion.div
                              initial={{ opacity: 0, x: 100 }} 
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
                                      <item.icon className="w-6 h-6 text-white" />
                                      <h3 className="text-xl font-bold group-hover:text-pink-400 transition-colors">{item.title}</h3>
                                  </div>
                                  <p className="text-pink-400 font-mono text-sm mb-3">{item.date}</p>
                                  <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                               </TiltCard>
                             </motion.div>
                         )}
                      </div>
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
         
  <div className="absolute left-8 md:left-1/2 -bottom-16 transform -translate-x-1/2 flex flex-col items-center pt-8 opacity-50">
    <Rocket className="w-8 h-8 text-purple-500 mb-2" />
    <span className="text-xs font-mono text-purple-500 tracking-widest">THE BEGINNING</span>
  </div>
          </div>
        </div>

      </div>
    </div>
  );
}

