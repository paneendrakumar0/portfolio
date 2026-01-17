import React, { useState, useMemo, useRef, Suspense, useEffect } from 'react';
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Image, Text, useScroll, ScrollControls, Environment, Stars, Sparkles, Float, Reflector } from '@react-three/drei';
import * as THREE from 'three';
import { Bot, Brain, Layers, CodeSquare, FunctionSquare, Package, BarChart, Terminal, Cpu, DoorOpen, X, MousePointer2, ChevronUp } from 'lucide-react';

// --- 1. DATA: CERTIFICATES & SKILLS ---
const certificates = [
  {
    id: 'python',
    title: 'Python Programming Pro: From Novice to Ninja',
    issuer: 'Udemy',
    category: 'Software & Web Technologies',
    date: 'Dec 2024',
    image: '/certifications/python.webp', 
    link: 'https://udemy-certificate.s3.amazonaws.com/image/UC-1b9a9969-a0be-4e09-84c8-a2ae38425fdc.jpg',
    color: '#f59e0b',
    icon: CodeSquare
  },
  {
    id: 'AI_Myths',
    title: '12 Myths About Data Science and AI',
    issuer: 'Udemy',
    category: 'Artificial Intelligence',
    date: 'Sep 2025',
    image: '/certifications/AIMYTHS.webp',
    link: 'https://www.udemy.com/certificate/UC-21804c5c-8ab6-46de-96f0-2ee49edb3205/',
    color: '#06b6d4',
    icon: FunctionSquare
  },
  {
    id: 'HTML',
    title: 'The Complete Guide to HTML for Beginners',
    issuer: 'Udemy',
    category: 'Software & Web Technologies',
    date: 'Oct 2025',
    image: '/certifications/HTML.webp',
    link: 'https://www.udemy.com/certificate/UC-1b400912-0a4a-4b17-8a47-6a98ced8e484/',
    color: '#3b82f6',
    icon: Package
  },
  {
    id: 'AI_Art',
    title: '10 in 1 Course : Text to Image AI Art Generators',
    issuer: 'Udemy',
    category: 'Artificial Intelligence',
    date: 'Dec 2024',
    image: '/certifications/AIART.webp',
    link: 'https://www.udemy.com/certificate/UC-21804c5c-8ab6-46de-96f0-2ee49edb3205/',
    color: '#ef4444',
    icon: Terminal
  },
  {
    id: 'MATLAB',
    title: 'MATLAB Onramp',
    issuer: 'Mathworks',
    category: 'Robotics & Simulation',
    date: 'Dec 2025 ',
    image: '/certifications/matlab.webp',
    link: 'https://matlabacademy.mathworks.com/progress/share/certificate.html?id=9fe098f4-d0d0-464f-bded-a3e9e4bbfac8&',
    color: '#10b981',
    icon: BarChart
  },
];

const connectionMap: Record<string, string[]> = {
    'Python': ['TensorFlow', 'PyTorch', 'OpenCV', 'ROS', 'ROS2', 'Raspberry Pi', 'NumPy', 'Pandas', 'Deep Learning', 'Neural Networks', 'Computer Vision', 'Robotics', 'Linux', 'Gazebo', 'Nav2', 'Rviz', 'MoveIt', 'SLAM', 'Robot Kinematics', 'Path Planning', 'Sensor Integration', 'Robot Localization', 'Robotic Manipulation', 'Autonomous Navigation', 'Multi-Robot Systems',],
    'C++': ['ROS', 'ROS2', 'Embedded C', 'Arduino', 'OpenCV', 'SLAM', 'Robot Kinematics', 'Path Planning', 'Sensor Integration', 'Robot Localization', 'Robotic Manipulation', 'Autonomous Navigation', 'Multi-Robot Systems'],
    'C': ['Embedded C', 'Arduino', 'STM32', 'RTOS', 'Microcontrollers', 'Wireless Communication', 'Real-Time Data Processing', 'Edge Computing', 'Home Automation', 'Wearable Technology', 'Industrial IoT', 'Sensor Networks',],
    'Arduino': ['C', 'C++', 'IoT', 'Sensors', 'Embedded Systems', 'Wireless Communication', 'Home Automation', 'Wearable Technology', 'Industrial IoT', 'Sensor Networks'],
    'Raspberry Pi': ['Python', 'Linux', 'IoT', 'ROS', 'ROS2', 'Computer Vision', 'Robotics', 'Sensor Integration', 'Edge Computing', 'Home Automation', 'Wearable Technology', 'Industrial IoT', 'Sensor Networks'],
    'ESP32': ['IoT', 'MQTT', 'C++', 'Embedded C', 'Sensors', 'Microcontrollers', 'Wireless Communication', 'Real-Time Data Processing', 'Edge Computing', 'Home Automation', 'Wearable Technology', 'Industrial IoT', 'Sensor Networks', 'Embedded Systems'],
    'TensorFlow': ['Python', 'Computer Vision', 'Deep Learning'],
    'OpenCV': ['Python', 'C++', 'Robotics', 'Computer Vision', 'ROS', 'ROS2', 'SLAM', 'Autonomous Navigation', 'Sensor Integration', 'Robot Localization'],
    'React': ['Next.js', 'Node.js', 'JavaScript', 'HTML5', 'CSS3'],
    'Node.js': ['JavaScript', 'MySQL', 'React', 'Git'],
    'ROS': ['C++', 'Python', 'Linux', 'Gazebo', 'Nav2'],
    'ROS2': ['C++', 'Python', 'Linux', 'Gazebo', 'Nav2','Rviz', 'MoveIt', 'SLAM', 'Robot Kinematics', 'Path Planning', 'Sensor Integration', 'Robot Localization', 'Robotic Manipulation', 'Autonomous Navigation', 'Multi-Robot Systems'],
};

const filterCategories = ['All', 'Robotics & Simulation', 'Artificial Intelligence', 'Software & Web Technologies', 'Hardware & Embedded'];

// --- 2. 2D COMPONENT: HOLO CARD ---
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
              <div className="absolute inset-0 bg-gradient-to-tr from-black/60 to-transparent z-10" />
              <img src={cert.image} alt={cert.title} className="w-full h-full object-cover" />
              <div className="absolute top-4 right-4 bg-black/40 p-2 rounded-xl backdrop-blur-md border border-white/10 z-20">
                <cert.icon className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="flex-1 p-6 bg-[#0a0a0a] flex flex-col justify-center border-t border-white/5">
              <h3 className="text-lg font-bold text-white leading-tight group-hover:text-cyan-400 transition-colors line-clamp-2">{cert.title}</h3>
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

// --- 3. 2D COMPONENT: SKILL CARD ---
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

// --- 4. 3D COMPONENT: HALL OF HEROES ---

function CertFrame({ cert, position, rotation, index, scale = 1 }: any) {
    const [hovered, setHover] = useState(false);
    const mesh = useRef<THREE.Group>(null);

    useFrame((state, delta) => {
        if(mesh.current) {
            mesh.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + index) * 0.1;
            const targetScale = hovered ? scale * 1.1 : scale;
            mesh.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 5);
        }
    });

    return (
        <group 
            ref={mesh} 
            position={position} 
            rotation={rotation}
            onPointerOver={() => { document.body.style.cursor = 'pointer'; setHover(true); }}
            onPointerOut={() => { document.body.style.cursor = 'auto'; setHover(false); }}
            onClick={() => window.open(cert.link, '_blank')}
        >
            <mesh position={[0, 0, -0.05]}>
                <boxGeometry args={[6.2, 4.2, 0.1]} />
                <meshStandardMaterial color="#111" metalness={0.9} roughness={0.1} />
            </mesh>
            
            <mesh position={[0, 0, 0]}>
                <boxGeometry args={[6.1, 4.1, 0.05]} />
                <meshBasicMaterial color={hovered ? cert.color : '#333'} />
            </mesh>

            <Image url={cert.image} scale={[6, 4]} position={[0, 0, 0.06]} transparent opacity={1} />

            <group position={[0, -3.0, 0.2]}>
                <mesh position={[0, 0, -0.05]}>
                    <planeGeometry args={[6, 1.5]} />
                    <meshBasicMaterial color="#000000" transparent opacity={0.8} />
                </mesh>

                <Text 
                    fontSize={0.35} 
                    maxWidth={5.8} 
                    textAlign="center" 
                    color="white"
                    anchorX="center" 
                    anchorY="middle" 
                    position={[0, 0.3, 0]}
                    outlineWidth={0.02}
                    outlineColor="black"
                >
                    {cert.title}
                </Text>

                <Text 
                    position={[0, -0.3, 0]} 
                    fontSize={0.25} 
                    color={cert.color}
                    anchorX="center" 
                    anchorY="middle"
                    outlineWidth={0.01}
                    outlineColor="black"
                >
                    {cert.issuer} • {cert.date}
                </Text>
            </group>
        </group>
    )
}

function HallEnvironment() {
    return (
        <group>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, 0]}>
                <planeGeometry args={[50, 400]} />
                <meshStandardMaterial color="#050505" roughness={0.1} metalness={0.8} />
                <gridHelper args={[100, 50, '#222', '#111']} rotation={[-Math.PI/2, 0, 0]} />
            </mesh>

            {Array.from({ length: 20 }).map((_, i) => (
                <group key={i} position={[0, 0, -i * 25]}>
                    <mesh position={[-8, 0, 0]}>
                        <boxGeometry args={[0.5, 25, 0.5]} />
                        <meshStandardMaterial color="#333" emissive="#00ffff" emissiveIntensity={0.5} />
                    </mesh>
                    <mesh position={[8, 0, 0]}>
                        <boxGeometry args={[0.5, 25, 0.5]} />
                        <meshStandardMaterial color="#333" emissive="#00ffff" emissiveIntensity={0.5} />
                    </mesh>
                </group>
            ))}
            
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
            <ambientLight intensity={1} />
            <pointLight position={[0, 5, 0]} intensity={2} distance={20} />
        </group>
    )
}

function HallExperience() {
    const scroll = useScroll();
    const { camera } = useThree();
    const isMobile = window.innerWidth < 768;

    useFrame((state, delta) => {
        const targetZ = -scroll.offset * (isMobile ? 100 : 150); 
        const targetY = isMobile ? 1.5 : 0; // Lift camera on mobile
        
        camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, delta * 2);
        camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, delta * 2);
        
        const mouseX = state.pointer.x * 0.5;
        const mouseY = state.pointer.y * 0.5;
        camera.rotation.y = THREE.MathUtils.lerp(camera.rotation.y, -mouseX * 0.2, delta * 2);
        
        // Disable aggressive tilt on mobile
        if(!isMobile) {
            camera.rotation.x = THREE.MathUtils.lerp(camera.rotation.x, mouseY * 0.1, delta * 2);
        }
    });

    return (
        <group>
            <HallEnvironment />
            {certificates.map((cert, i) => {
                const isLeft = i % 2 === 0;
                // Path width optimization: Narrower on mobile so frames are fully visible
                const x = isLeft ? (isMobile ? -3.5 : -5) : (isMobile ? 3.5 : 5); 
                const z = -i * 25 - 10; 
                const rotY = isLeft ? 0.3 : -0.3; // Less aggressive inward tilt for mobile

                return (
                    <CertFrame 
                        key={cert.id} 
                        cert={cert} 
                        index={i} 
                        position={[x, 0, z]} 
                        rotation={[0, rotY, 0]} 
                        scale={isMobile ? 0.6 : 1}
                    />
                );
            })}
        </group>
    );
}

// --- 5. MAIN COMPONENT ---
export function Certifications() {
  const [mode, setMode] = useState<'grid' | 'hall'>('grid');
  const [activeFilter, setActiveFilter] = useState('All');
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  const filteredCerts = useMemo(() => {
    return certificates.filter(c => activeFilter === 'All' || c.category === activeFilter);
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
    <div className="min-h-screen bg-[#000000] text-white relative">
        
        {/* --- GRID MODE UI --- */}
        <AnimatePresence>
            {mode === 'grid' && (
                <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }} 
                    className="pt-24 pb-20 px-6 max-w-7xl mx-auto relative z-10"
                >
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-7xl font-bold mb-6 tracking-tight">Verified <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">Expertise</span></h1>
                        <p className="text-gray-400 max-w-2xl mx-auto mb-8 text-sm md:text-base">
                            A curated collection of industry-recognized certifications validating technical proficiency.
                        </p>
                        
                        <button 
                            onClick={() => setMode('hall')}
                            className="group relative inline-flex items-center gap-3 px-6 py-3 md:px-8 md:py-4 bg-white/5 border border-white/10 rounded-full overflow-hidden hover:bg-white/10 transition-all hover:scale-105"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <DoorOpen className="w-4 h-4 md:w-5 md:h-5 text-cyan-400" />
                            <span className="font-mono text-[10px] md:text-sm tracking-widest uppercase text-cyan-400 font-bold">Hall of Knowledge [3D]</span>
                        </button>
                    </div>

                    <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-16">
                        {filterCategories.map(cat => (
                            <button key={cat} onClick={() => setActiveFilter(cat)} className={`px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium border transition-all ${activeFilter === cat ? 'bg-white text-black border-white' : 'bg-white/5 text-gray-400 border-white/10 hover:text-white'}`}>{cat}</button>
                        ))}
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32">
                        <AnimatePresence mode="popLayout">
                            {filteredCerts.map(cert => <HoloCard key={cert.id} cert={cert} />)}
                        </AnimatePresence>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-12">
                        <div className="space-y-8">
                            {engineeringTrack.map((cat, i) => <InteractiveSkillCard key={i} category={cat} hoveredSkill={hoveredSkill} setHoveredSkill={setHoveredSkill} />)}
                        </div>
                        <div className="space-y-8">
                            {computationalTrack.map((cat, i) => <InteractiveSkillCard key={i} category={cat} hoveredSkill={hoveredSkill} setHoveredSkill={setHoveredSkill} />)}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>

        {/* --- HALL MODE UI --- */}
        <AnimatePresence>
            {mode === 'hall' && (
                <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }} 
                    className="fixed inset-0 z-50 bg-black"
                >
                    <div className="absolute top-4 right-4 md:top-8 md:right-8 z-50">
                        <button 
                            onClick={() => setMode('grid')}
                            className="flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 bg-red-500/10 border border-red-500/50 rounded-full text-red-400 font-mono text-[10px] md:text-xs hover:bg-red-500/20 transition-all"
                        >
                            <X className="w-4 h-4" /> EXIT
                        </button>
                    </div>

                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 text-cyan-400/50 font-mono text-[10px] md:text-xs tracking-[0.2em] animate-pulse pointer-events-none">
                        <MousePointer2 className="w-4 h-4" />
                        <span>SCROLL TO EXPLORE</span>
                        <ChevronUp className="w-4 h-4" />
                    </div>

                    <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 5], fov: 50 }}>
                        <Suspense fallback={null}>
                            <color attach="background" args={['#000000']} />
                            <fog attach="fog" args={['#000000', 5, 40]} />
                            <ScrollControls pages={certificates.length * 1.2} damping={0.2}>
                                <HallExperience />
                            </ScrollControls>
                        </Suspense>
                    </Canvas>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
  );
}