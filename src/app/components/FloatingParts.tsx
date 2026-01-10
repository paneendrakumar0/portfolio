import { motion } from 'framer-motion';
import { Settings, Hexagon, Cpu, Zap, Box } from 'lucide-react';

export function FloatingParts() {
  const parts = [
    { Icon: Settings, size: 24, color: 'text-cyan-500/20' },
    { Icon: Hexagon, size: 40, color: 'text-purple-500/10' },
    { Icon: Cpu, size: 32, color: 'text-cyan-500/15' },
    { Icon: Zap, size: 20, color: 'text-yellow-500/10' },
    { Icon: Box, size: 45, color: 'text-gray-500/10' },
  ];

  // Generate 15 random parts
  const items = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    ...parts[i % parts.length],
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: 15 + Math.random() * 20,
    delay: Math.random() * -20,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {items.map((item) => (
        <motion.div
          key={item.id}
          className={`absolute ${item.color}`}
          initial={{ x: `${item.x}%`, y: `${item.y}%`, rotate: 0 }}
          animate={{
            y: [`${item.y}%`, `${item.y - 15}%`, `${item.y}%`],
            rotate: [0, 180, 360],
            x: [`${item.x}%`, `${item.x + 5}%`, `${item.x}%`]
          }}
          transition={{
            duration: item.duration,
            repeat: Infinity,
            delay: item.delay,
            ease: "linear"
          }}
        >
          <item.Icon size={item.size} strokeWidth={1} />
        </motion.div>
      ))}
    </div>
  );
}