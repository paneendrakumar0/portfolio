import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, X, Bot, Terminal } from 'lucide-react';

// KNOWLEDGE BASE
const KNOWLEDGE_BASE = {
  default: "I don't have access to that specific file, but I can tell you about Paneendra's projects, skills, or contact info.",
  greetings: ["Hello.", "System Online.", "Neural Link Established.", "Greetings, Operator."],
  
  keywords: {
    "skills": "Paneendra is equipped with:\n• **Languages:** C++, Python, JavaScript (React, Node.js)\n• **Core:** IoT Systems, Embedded Electronics, Robotics\n• **Tools:** SolidWorks, Framer Motion, Git",
    "projects": "Current active directives:\n1. **Waste Segregation Bot** (1st Place @ Techmela 2026)\n2. **Smart Home Dashboard** (IoT Voice Integration)\n3. **Robocon 2026** (Autonomous Navigation)",
    "contact": "Secure channels available:\n• Email: paneendra100@gmail.com\n• Base: NIT Durgapur, West Bengal",
    "education": "Currently pursuing **B.Tech in Mechanical Engineering** at NIT Durgapur. He bridges the gap between Mechanical systems and Software intelligence.",
    "about": "He is a **Technologist** writing code that moves. Specializing in building scalable web apps and innovative hardware solutions."
  }
};

const SUGGESTED_QUERIES = [
  "What are his main skills?",
  "Tell me about his projects.",
  "How do I contact him?",
  "Is he an Engineer or Coder?"
];

interface Message {
  type: 'bot' | 'user';
  text: string;
}

export function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { type: 'bot', text: "Identity Verified. I am the virtual construct of Paneendra's resume. Query me." }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async (text = input) => {
    if (!text.trim()) return;

    const userMsg: Message = { type: 'user', text: text };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const lowerText = text.toLowerCase();
      let response = KNOWLEDGE_BASE.default;

      if (lowerText.includes("hello") || lowerText.includes("hi")) {
        response = KNOWLEDGE_BASE.greetings[Math.floor(Math.random() * KNOWLEDGE_BASE.greetings.length)];
      } else if (lowerText.includes("skill") || lowerText.includes("stack") || lowerText.includes("tech")) {
        response = KNOWLEDGE_BASE.keywords.skills;
      } else if (lowerText.includes("project") || lowerText.includes("work")) {
        response = KNOWLEDGE_BASE.keywords.projects;
      } else if (lowerText.includes("contact") || lowerText.includes("mail")) {
        response = KNOWLEDGE_BASE.keywords.contact;
      } else if (lowerText.includes("education") || lowerText.includes("college")) {
        response = KNOWLEDGE_BASE.keywords.education;
      } else if (lowerText.includes("about")) {
        response = KNOWLEDGE_BASE.keywords.about;
      }

      setMessages(prev => [...prev, { type: 'bot', text: response }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, rotate: 180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: -180 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-8 right-8 z-50 w-14 h-14 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(147,51,234,0.5)] border border-white/20 group"
          >
            <Sparkles className="w-6 h-6 text-white animate-pulse" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed bottom-8 right-4 md:right-8 z-50 w-[90vw] md:w-[400px] h-[500px] md:h-[600px] bg-[#0a0a0a]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            <div className="p-4 bg-gradient-to-r from-gray-900 to-black border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bot className="w-6 h-6 text-purple-400" />
                <h3 className="font-bold text-white text-sm">Neural Assistant</h3>
              </div>
              <button onClick={() => setIsOpen(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {messages.map((msg, idx) => (
                <motion.div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${msg.type === 'user' ? 'bg-cyan-600 text-white' : 'bg-white/10 text-gray-200'}`}>
                    {msg.text.split('\n').map((line, i) => <p key={i}>{line}</p>)}
                  </div>
                </motion.div>
              ))}
              {isTyping && <div className="text-gray-500 text-xs">Thinking...</div>}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-white/10 bg-black/50">
              <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
                <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Query..." className="flex-1 bg-transparent text-white outline-none" />
                <button type="submit"><Send className="w-4 h-4 text-cyan-400" /></button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}