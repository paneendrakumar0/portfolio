import React, { useState, useMemo } from 'react'; // Added useMemo for efficiency
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { Award, Bot, Brain, Layers, Settings, ExternalLink, CodeSquare, FunctionSquare, Package, ChartBarDecreasing, Terminal, Cpu } from 'lucide-react';

// --- 1. DATA: CERTIFICATES ---
const certificates = [
  {
    id: 'python',
    title: 'Python Programming Pro: From Novice to Ninja',
    issuer: 'Udemy',
    category: 'Software & Web Technologies',
    date: 'Dec 2024',
    image: 'public/certifications/python.webp', 
    link: 'https://udemy-certificate.s3.amazonaws.com/image/UC-1b9a9969-a0be-4e09-84c8-a2ae38425fdc.jpg',
    color: 'from-orange-400 to-yellow-600',
    icon: CodeSquare
  },
  {
    id: 'AI_Myths',
    title: '12 Myths About Data Science and AI',
    issuer: 'Udemy',
    category: 'Artificial Intelligence',
    date: 'Sep 2025',
    image: 'public/certifications/AIMYTHS.webp',
    link: 'https://www.udemy.com/certificate/UC-21804c5c-8ab6-46de-96f0-2ee49edb3205/',
    color: 'from-blue-400 to-cyan-500',
    icon: FunctionSquare
  },
  {
    id: 'HTML',
    title: 'The Complete Guide to HTML for Beginners',
    issuer: 'Udemy',
    category: 'Software & Web Technologies',
    date: 'Oct 2025',
    image: 'public/certifications/HTML.webp',
    link: 'https://www.udemy.com/certificate/UC-1b400912-0a4a-4b17-8a47-6a98ced8e484/',
    color: 'from-blue-600 to-indigo-600',
    icon: Package
  },
  {
    id: 'AI_Art',
    title: '10 in 1 Course : Text to Image AI Art Generators',
    issuer: 'Udemy',
    category: 'Artificial Intelligence',
    date: 'Dec 2024',
    image: 'public/certifications/AIART.webp',
    link: 'https://www.udemy.com/certificate/UC-21804c5c-8ab6-46de-96f0-2ee49edb3205/',
    color: 'from-orange-500 to-red-600',
    icon: Terminal
  },
  {
    id: 'MATLAB',
    title: 'MATLAB Onramp',
    issuer: 'Mathworks',
    category: 'Robotics & Simulation',
    date: 'Dec 2025',
    image: 'public/certifications/matlab.webp',
    link: 'https://matlabacademy.mathworks.com/progress/share/certificate.html?id=9fe098f4-d0d0-464f-bded-a3e9e4bbfac8&',
    color: 'from-green-400 to-emerald-600',
    icon: ChartBarDecreasing
  },
];

const connectionMap: Record<string, string[]> = {
    'Python': ['TensorFlow', 'PyTorch', 'OpenCV', 'ROS', 'ROS2', 'Raspberry Pi', 'NumPy', 'Pandas'],
    'C++': ['ROS', 'ROS2', 'Embedded C', 'Arduino', 'OpenCV', 'SLAM', 'Robot Kinematics'],
    'C': ['Embedded C', 'Arduino', 'STM32', 'RTOS'],
    'Arduino': ['C', 'C++', 'IoT', 'Sensors'],
    'Raspberry Pi': ['Python', 'Linux', 'IoT', 'ROS'],
    'ESP32': ['IoT', 'MQTT', 'C++'],
    'TensorFlow': ['Python', 'Computer Vision', 'Deep Learning'],
    'OpenCV': ['Python', 'C++', 'Robotics'],
    'React': ['Next.js', 'Node.js', 'JavaScript', 'HTML5', 'CSS3'],
    'Node.js': ['JavaScript', 'MySQL', 'React', 'Git'],
    'ROS': ['C++', 'Python', 'Linux', 'Gazebo', 'Nav2'],
    'ROS2': ['C++', 'Python', 'Linux', 'Gazebo', 'Nav2'],
};

const filterCategories = ['All', 'Robotics & Simulation', 'Artificial Intelligence', 'Software & Web Technologies', 'Hardware & Embedded'];

const HoloCard = ({ cert }: { cert: any }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-100, 100], [15, -15]), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-100, 100], [-15, 15]), { stiffness: 150, damping: 20 });
  const mouseX = useSpring(0, { stiffness: 500, damping: 100 });
  const mouseY = useSpring(0, { stiffness: 500, damping: 100 });

  function onMouseMove({ currentTarget, clientX, clientY }: any) {
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    x.set(clientX - left - width / 2);
    y.set(clientY - top - height / 2);
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const maskImage = useMotionTemplate`radial-gradient(250px at ${mouseX}px ${mouseY}px, white, transparent)`;

  return (
    <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative h-[300px] w-full">
      <a href={cert.link} target="_blank" rel="noopener noreferrer" className="block h-full w-full">
        <motion.div
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          onMouseMove={onMouseMove}
          onMouseLeave={() => { x.set(0); y.set(0); }}
          className="group relative h-full w-full rounded-3xl bg-gray-900 border border-white/10 shadow-2xl overflow-hidden hover:border-white/30 transition-colors"
        >
          <motion.div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" style={{ maskImage, WebkitMaskImage: maskImage }} />
          <div className="absolute inset-0 flex flex-col">
            <div className="relative h-48 overflow-hidden">
              <div className={`absolute inset-0 bg-gradient-to-tr ${cert.color} opacity-20 z-10`} />
              <img src={cert.image} alt={cert.title} className="w-full h-full object-cover" />
              <div className="absolute top-4 right-4 bg-black/40 p-2 rounded-xl backdrop-blur-md border border-white/10 z-20">
                <cert.icon className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="flex-1 p-6 bg-[#0a0a0a] flex flex-col justify-center border-t border-white/5">
              <h3 className="text-lg font-bold text-white leading-tight group-hover:text-cyan-400 transition-colors">{cert.title}</h3>
              <div className="flex justify-between mt-2 text-xs font-mono text-gray-500">
                <span>{cert.issuer}</span>
                <span>{cert.date}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </a>
    </motion.div>
  );
};

const InteractiveSkillCard = ({ category, hoveredSkill, setHoveredSkill }: any) => {
  const isLit = (skill: string) => hoveredSkill === skill || (hoveredSkill && connectionMap[hoveredSkill]?.includes(skill));
  const isDimmed = (skill: string) => hoveredSkill && !isLit(skill);

  return (
    <div className={`p-8 rounded-3xl bg-black/40 border ${category.border} backdrop-blur-md relative overflow-hidden group`}>
      <div className="flex items-center gap-4 mb-6 relative z-10">
        <div className={`p-3 rounded-2xl bg-black/50 border border-white/10 ${category.color}`}><category.icon className="w-6 h-6" /></div>
        <h3 className="text-2xl font-bold text-white">{category.title}</h3>
      </div>
      <div className="flex flex-wrap gap-2 relative z-10">
        {category.skills.map((skill: string) => (
          <span
            key={skill}
            onMouseEnter={() => setHoveredSkill(skill)}
            onMouseLeave={() => setHoveredSkill(null)}
            className={`px-3 py-1.5 rounded-lg text-sm border transition-all duration-300 cursor-default ${
              isLit(skill) ? `${category.activeClass} bg-white/5` : isDimmed(skill) ? 'opacity-20 grayscale border-transparent' : 'bg-white/5 text-gray-400 border-white/5'
            }`}
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
};

export function Certifications() {
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState('All');

  // --- NEW SORTING AND FILTERING LOGIC ---
  const sortedFilteredCerts = useMemo(() => {
    return [...certificates]
      // Sort: Newest to Oldest
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      // Filter based on active tab
      .filter(c => activeFilter === 'All' || c.category === activeFilter);
  }, [activeFilter]);

  const engineeringTrack = [
    { title: "Robotics & Simulation", icon: Bot, skills: ['ROS', 'ROS2', 'Gazebo', 'MoveIt', 'Nav2', 'OpenCV', 'SLAM', 'MATLAB', 'Simulink', 'ADAMS', 'SolidWorks', 'Ansys'], color: 'text-purple-400', border: 'border-purple-500/30', activeClass: 'border-purple-500 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.3)]' },
    { title: "Hardware & Embedded", icon: Cpu, skills: ['Arduino', 'Raspberry Pi', 'ESP32', 'MQTT', 'LIDAR', 'IMU'], color: 'text-orange-400', border: 'border-orange-500/30', activeClass: 'border-orange-500 text-orange-300 shadow-[0_0_15px_rgba(249,115,22,0.3)]' }
  ];

  const computationalTrack = [
    { title: "Artificial Intelligence", icon: Brain, skills: ['TensorFlow', 'PyTorch', 'Scikit-learn', 'Deep Learning', 'Neural Networks', 'Pandas', 'NumPy'], color: 'text-emerald-400', border: 'border-emerald-500/30', activeClass: 'border-emerald-500 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)]' },
    { title: "Software & Web Technologies", icon: Layers, skills: ['C', 'C++', 'Python', 'Java', 'MySQL', 'React', 'Next.js', 'Node.js', 'Git', 'Linux'], color: 'text-cyan-400', border: 'border-cyan-500/30', activeClass: 'border-cyan-500 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)]' }
  ];

  return (
    <div className="min-h-screen pt-24 pb-20 px-6 bg-[#050505] text-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">Verified <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">Expertise</span></h1>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {filterCategories.map(cat => (
            <button key={cat} onClick={() => setActiveFilter(cat)} className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${activeFilter === cat ? 'bg-white text-black border-white' : 'bg-white/5 text-gray-400 border-white/10 hover:text-white'}`}>{cat}</button>
          ))}
        </div>

        {/* Certs Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32">
          <AnimatePresence mode="popLayout">
            {sortedFilteredCerts.map(cert => <HoloCard key={cert.id} cert={cert} />)}
          </AnimatePresence>
        </div>

        {/* Skills Track */}
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            {engineeringTrack.map((cat, i) => <InteractiveSkillCard key={i} category={cat} hoveredSkill={hoveredSkill} setHoveredSkill={setHoveredSkill} />)}
          </div>
          <div className="space-y-8">
            {computationalTrack.map((cat, i) => <InteractiveSkillCard key={i} category={cat} hoveredSkill={hoveredSkill} setHoveredSkill={setHoveredSkill} />)}
          </div>
        </div>
      </div>
    </div>
  );
}