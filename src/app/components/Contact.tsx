import React, { ChangeEvent, FormEvent, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import emailjs from '@emailjs/browser';
import { Terminal as TerminalIcon, Send, Download, ExternalLink } from 'lucide-react';
import { trackEvent } from '../lib/analytics';

const CONTACT_EMAIL = 'paneendra100@gmail.com';
const EMAILJS_CONFIG = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID,
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
};
const SUBMISSION_COOLDOWN_MS = 60_000;

type TerminalState = 'IDLE' | 'AWAITING_NAME' | 'AWAITING_EMAIL' | 'AWAITING_MESSAGE' | 'SENDING' | 'SUCCESS' | 'ERROR';

export function Contact() {
  const [terminalState, setTerminalState] = useState<TerminalState>('IDLE');
  const [history, setHistory] = useState<string[]>([
    "INITIALIZING SYSTEM...",
    "ESTABLISHING SECURE CONNECTION...",
    "CONNECTION ESTABLISHED.",
    "Type 'help' to see available commands."
  ]);
  const [input, setInput] = useState('');
  
  // Form data state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const endOfTerminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom of terminal
  useEffect(() => {
    endOfTerminalRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  // Focus input when clicking anywhere on terminal
  const handleTerminalClick = () => {
    inputRef.current?.focus();
  };

  const handleCommand = async (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;
    
    // Add command to history
    setHistory(prev => [...prev, `guest@paneendra:~$ ${trimmed}`]);

    // Handle states
    if (terminalState === 'AWAITING_NAME') {
      setName(trimmed);
      setTerminalState('AWAITING_EMAIL');
      setHistory(prev => [...prev, "Please enter your email address:"]);
      return;
    }

    if (terminalState === 'AWAITING_EMAIL') {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
        setHistory(prev => [...prev, "ERROR: Invalid email format. Please try again:"]);
        return;
      }
      setEmail(trimmed);
      setTerminalState('AWAITING_MESSAGE');
      setHistory(prev => [...prev, "Please type your message (press Enter when done):"]);
      return;
    }

    if (terminalState === 'AWAITING_MESSAGE') {
      if (trimmed.length < 10) {
        setHistory(prev => [...prev, "ERROR: Message too short. Please provide more detail:"]);
        return;
      }
      setMessage(trimmed);
      setHistory(prev => [...prev, "Transmitting data to secure server..."]);
      await sendEmail(name, email, trimmed);
      return;
    }

    // Handle normal commands (IDLE state)
    switch (trimmed.toLowerCase()) {
      case 'help':
        setHistory(prev => [...prev, 
          "AVAILABLE COMMANDS:",
          "  connect    - Initialize secure contact protocol (Send me an email)",
          "  resume     - Download latest Resume PDF",
          "  socials    - Display secure social links",
          "  clear      - Clear terminal screen",
          "  whoami     - Display guest identity",
        ]);
        break;
      case 'connect':
        setTerminalState('AWAITING_NAME');
        setHistory(prev => [...prev, "SECURE PROTOCOL INITIALIZED.", "Please enter your full name:"]);
        break;
      case 'resume':
        setHistory(prev => [...prev, "Downloading resume..."]);
        trackEvent('resume_open', { source: 'terminal' });
        window.open('https://drive.google.com/uc?export=download&id=1iMn2E8R_9om1I3BpwNx54CyxbMksonM5', '_blank');
        break;
      case 'socials':
        setHistory(prev => [...prev, 
          "LinkedIn: https://linkedin.com/in/paneendra-kumar-53b0a3274",
          "GitHub:   https://github.com/paneendrakumar0",
          "Twitter:  https://x.com/paneendrakumar0"
        ]);
        break;
      case 'clear':
        setHistory([]);
        break;
      case 'whoami':
        setHistory(prev => [...prev, "guest"]);
        break;
      default:
        setHistory(prev => [...prev, `bash: ${trimmed}: command not found. Type 'help' for available commands.`]);
    }
  };

  const sendEmail = async (senderName: string, senderEmail: string, msg: string) => {
    setTerminalState('SENDING');
    trackEvent('contact_attempt', { source: 'terminal' });

    const lastSubmission = Number(localStorage.getItem('portfolio-contact-submitted-at') ?? 0);
    if (Date.now() - lastSubmission < SUBMISSION_COOLDOWN_MS) {
      setHistory(prev => [...prev, "ERROR: Rate limit exceeded. Please wait 60 seconds before sending another message."]);
      setTerminalState('IDLE');
      return;
    }

    if (!EMAILJS_CONFIG.serviceId || !EMAILJS_CONFIG.templateId || !EMAILJS_CONFIG.publicKey) {
      setHistory(prev => [...prev, `CRITICAL ERROR: Email service offline. Please email directly at ${CONTACT_EMAIL}`]);
      setTerminalState('IDLE');
      return;
    }

    try {
      await emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templateId,
        {
          from_name: senderName,
          from_email: senderEmail,
          message: msg,
          to_name: 'Paneendra',
        },
        EMAILJS_CONFIG.publicKey,
      );
      
      localStorage.setItem('portfolio-contact-submitted-at', String(Date.now()));
      setHistory(prev => [...prev, "SUCCESS: Transmission complete. I will get back to you shortly.", "Returning to IDLE state."]);
      setTerminalState('IDLE');
      trackEvent('contact_success', { source: 'terminal' });

    } catch (error) {
      console.error('EMAILJS ERROR:', error); 
      setHistory(prev => [...prev, `ERROR: Transmission failed. Please email me directly at ${CONTACT_EMAIL}`, "Returning to IDLE state."]);
      setTerminalState('IDLE');
      trackEvent('contact_failure', { source: 'terminal' });
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(input);
      setInput('');
    }
  };

  return (
    <div id="contact-hub" className="min-h-screen pt-24 pb-12 px-4 flex flex-col items-center justify-center bg-[#050505] overflow-hidden relative">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-green-500/5 rounded-full blur-[120px] opacity-20"></div>
        <div className="absolute inset-0 portfolio-noise opacity-30"></div>
      </div>

      <div className="w-full max-w-4xl relative z-10 flex flex-col items-center">
        
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 mb-4 text-xs text-green-400 font-mono tracking-widest uppercase">
             <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
             Terminal Node Active
          </div>
          <h1 className="text-3xl md:text-5xl font-mono font-bold mb-2 text-white">
            Access <span className="text-green-400">Granted</span>
          </h1>
        </motion.div>

        {/* --- THE TERMINAL WINDOW --- */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
          className="w-full bg-[#0a0f0a] border border-green-500/20 rounded-xl overflow-hidden shadow-[0_0_50px_rgba(34,197,94,0.1)] flex flex-col h-[500px]"
          onClick={handleTerminalClick}
        >
          {/* Terminal Header */}
          <div className="bg-[#111811] border-b border-green-500/20 p-3 flex items-center justify-between">
             <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
             </div>
             <div className="flex items-center gap-2 text-green-500/50 font-mono text-xs">
                <TerminalIcon className="w-4 h-4" /> root@paneendra:~
             </div>
             <div className="w-12"></div> {/* Spacer for balance */}
          </div>

          {/* Terminal Body */}
          <div className="flex-1 p-4 md:p-6 overflow-y-auto font-mono text-sm md:text-base text-green-400 font-medium">
             <div className="space-y-1 mb-4 opacity-70">
                <p>Welcome to Paneendra OS (v2.0.26)</p>
                <p>System is operating within normal parameters.</p>
                <p>All connections are end-to-end encrypted.</p>
             </div>
             
             <div className="space-y-2">
                {history.map((line, i) => (
                  <div key={i} className={line.startsWith('ERROR') ? 'text-red-400' : line.startsWith('SUCCESS') ? 'text-cyan-400' : 'text-green-400'}>
                    {line.startsWith('guest@') ? (
                      <span className="text-white">{line}</span>
                    ) : (
                      line
                    )}
                  </div>
                ))}
             </div>
             
             {/* Active Input Line */}
             {terminalState !== 'SENDING' && (
               <div className="flex items-center mt-2 group">
                  <span className="text-white mr-2">guest@paneendra:~$</span>
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={onKeyDown}
                    className="flex-1 bg-transparent border-none outline-none text-green-400 w-full"
                    autoFocus
                    spellCheck="false"
                  />
                  {/* Blinking Cursor (CSS simulated) */}
                  {!input && <span className="w-2 h-5 bg-green-400 animate-pulse ml-1"></span>}
               </div>
             )}

             {terminalState === 'SENDING' && (
                <div className="flex items-center gap-2 mt-2 text-cyan-400">
                   Processing transmission<span className="animate-pulse">...</span>
                </div>
             )}

             <div ref={endOfTerminalRef} />
          </div>
        </motion.div>

        {/* Quick action hints for mobile/lazy users */}
        <div className="mt-8 flex flex-wrap justify-center gap-3 w-full">
           <button onClick={() => handleCommand('connect')} className="px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-lg font-mono text-xs text-green-400 hover:bg-green-500/20 transition-colors">
             &gt; connect
           </button>
           <button onClick={() => handleCommand('resume')} className="px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-lg font-mono text-xs text-green-400 hover:bg-green-500/20 transition-colors">
             &gt; resume
           </button>
           <button onClick={() => handleCommand('socials')} className="px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-lg font-mono text-xs text-green-400 hover:bg-green-500/20 transition-colors">
             &gt; socials
           </button>
        </div>

      </div>
    </div>
  );
}
