import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import emailjs from '@emailjs/browser';
import { Mail, MapPin, Send, CheckCircle, Copy, Linkedin, Github, Twitter, Instagram, MessageSquare, Download, Briefcase, Code2, Award, Trophy, ArrowRight, Zap } from 'lucide-react';

// --- ANIMATION VARIANTS (FUTURISTIC) ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Stagger effect for "loading" feel
      delayChildren: 0.2,
    }
  }
};

const itemVariants = {
  hidden: { 
    opacity: 0, 
    y: 20, 
    scale: 0.95, 
    filter: "blur(10px)" // Start blurred
  },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1, 
    filter: "blur(0px)", // Focus in
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

// --- REUSABLE TILT CARD ---
const TiltCard = ({ children, className = "" }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className={`relative group h-full ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl blur opacity-10 group-hover:opacity-30 transition duration-500" />
      <div className="relative h-full bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl p-6 shadow-xl overflow-hidden flex flex-col">
        {children}
      </div>
    </motion.div>
  );
};

export function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [copied, setCopied] = useState(false);

  // --- EMAILJS INTEGRATION ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const serviceId = 'service_neavl3n';
    const templateId = 'template_mxq9h6y';
    const publicKey = 'rD9JvrGqyzqY_tAAM';

    const templateParams = {
      from_name: formData.name,
      from_email: formData.email,
      message: formData.message,
      to_name: 'Paneendra', 
    };

    try {
      await emailjs.send(serviceId, templateId, templateParams, publicKey);
      
      // Success
      setIsSent(true);
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setIsSent(false), 5000); 

    } catch (error) {
      // --- DEBUGGING LOG ---
      console.error('EMAILJS ERROR:', error); 
      alert(`Failed to send: ${error.text || "Check console (F12) for details"}. \n\nTip: Disable AdBlocker if active.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const copyEmail = () => {
    navigator.clipboard.writeText('paneendra100@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const socialLinks = [
    { name: 'LinkedIn', icon: Linkedin, url: 'https://linkedin.com/in/paneendra-kumar-53b0a3274', gradient: 'from-blue-600 to-blue-400', shadow: 'hover:shadow-blue-500/50' },
    { name: 'GitHub', icon: Github, url: 'https://github.com/paneendrakumar0', gradient: 'from-gray-800 to-gray-700', shadow: 'hover:shadow-gray-500/50' },
    { name: 'Telegram', icon: Send, url: 'https://t.me/paneendrakumar', gradient: 'from-sky-500 to-blue-500', shadow: 'hover:shadow-sky-500/50' },
    { name: 'X (Twitter)', icon: Twitter, url: 'https://x.com/paneendrakumar0', gradient: 'from-gray-900 to-black', shadow: 'hover:shadow-white/20' },
    { name: 'Instagram', icon: Instagram, url: 'https://instagram.com/paneendrakumar0', gradient: 'from-pink-600 to-purple-600', shadow: 'hover:shadow-pink-500/50' },
  ];

  const stats = [
    { label: 'Years Experience', value: '2+', icon: Briefcase, color: 'text-cyan-400', border: 'border-cyan-500/20' },
    { label: 'Projects Completed', value: '10+', icon: Code2, color: 'text-purple-400', border: 'border-purple-500/20' },
    { label: 'Certifications', value: '8+', icon: Award, color: 'text-pink-400', border: 'border-pink-500/20' },
    { label: 'Hackathons Won', value: '3', icon: Trophy, color: 'text-yellow-400', border: 'border-yellow-500/20' },
  ];

  return (
    <div className="min-h-screen pt-24 pb-12 px-6 flex items-center justify-center bg-[#0a0a0a] overflow-hidden relative">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl opacity-20"></div>
        {/* New Grid Texture */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
      </div>

      <div className="max-w-7xl w-full relative z-10">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6 text-sm text-cyan-400 font-mono">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            SYSTEM ONLINE
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-500">
            Establish <br />
            <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">Connection</span>
          </h1>
        </motion.div>

        {/* --- MAIN GRID WITH STAGGERED ANIMATION --- */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid lg:grid-cols-12 gap-8 lg:gap-12"
        >
          
          {/* --- LEFT COLUMN (7/12) --- */}
          <motion.div variants={itemVariants} className="lg:col-span-7 space-y-8">
            {/* 1. Contact Info & Map */}
            <div className="flex flex-col gap-8">
                <TiltCard className="h-auto">
                    <div className="flex items-center gap-3 mb-6">
                        <MessageSquare className="text-purple-500 w-6 h-6" />
                        <h2 className="text-2xl font-bold text-white">Contact Info</h2>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                        {/* Email Card */}
                        <div className="group p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer flex flex-col justify-center" onClick={copyEmail}>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                                <Mail className="w-4 h-4 text-cyan-400" />
                                </div>
                                <span className="text-gray-400 text-sm">Email</span>
                            </div>
                            <div className="text-gray-200 font-mono text-sm flex items-center gap-2">
                                paneendra100@gmail.com
                                {copied ? <CheckCircle className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3 text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity" />}
                            </div>
                        </div>

                        {/* Location Text Card */}
                        <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col justify-center">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                                <MapPin className="w-4 h-4 text-purple-400" />
                                </div>
                                <span className="text-gray-400 text-sm">Location</span>
                            </div>
                            <div className="text-gray-200 font-mono text-sm">NIT Durgapur, India</div>
                        </div>
                    </div>

                    {/* --- THE CLICKABLE MAP --- */}
                    <a 
                      href="https://www.google.com/maps/place/National+Institute+of+Technology+Durgapur" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="relative block w-full h-40 rounded-xl overflow-hidden border border-white/10 group mt-2"
                    >
                        {/* Fake Map Background */}
                        <div className="absolute inset-0 bg-gray-800 transition-transform duration-700 group-hover:scale-110">
                             {/* Static Map Image or Iframe */}
                             <iframe 
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3658.1309320299696!2d87.29085867605432!3d23.527785478822393!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f772081cede5e9%3A0x33fb9ccb243dfa5!2sNational%20Institute%20of%20Technology%20Durgapur!5e0!3m2!1sen!2sin!4v1709234567890!5m2!1sen!2sin" 
                                className="w-full h-full opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none"
                                loading="lazy"
                                style={{ border: 0 }}
                             ></iframe>
                        </div>
                        
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-colors flex items-center justify-center">
                            <div className="bg-black/70 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 flex items-center gap-2 group-hover:scale-110 transition-transform">
                                <MapPin className="w-4 h-4 text-purple-400" />
                                <span className="text-xs font-bold text-white uppercase tracking-wider">Open in Maps</span>
                            </div>
                        </div>
                    </a>

                </TiltCard>

                {/* 2. The Form */}
                <div className="relative flex-1">
                    <div className="absolute -inset-0.5 bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl blur opacity-50"></div>
                    <div className="relative bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-2xl p-6 md:p-8 h-full">
                        <AnimatePresence mode="wait">
                        {!isSent ? (
                            <motion.form 
                            key="form"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onSubmit={handleSubmit} 
                            className="space-y-5"
                            >
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <Send className="w-5 h-5 text-cyan-400" /> Send a Message
                            </h3>
                            
                            <div className="grid md:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                <label className="text-sm text-gray-400 ml-1">Name</label>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} required
                                    className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white outline-none focus:border-cyan-500 transition-colors" />
                                </div>
                                <div className="space-y-2">
                                <label className="text-sm text-gray-400 ml-1">Email</label>
                                <input type="email" name="email" value={formData.email} onChange={handleChange} required
                                    className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white outline-none focus:border-cyan-500 transition-colors" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm text-gray-400 ml-1">Message</label>
                                <textarea name="message" value={formData.message} onChange={handleChange} required rows={4}
                                    className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white outline-none focus:border-cyan-500 transition-colors resize-none" />
                            </div>

                            <button type="submit" disabled={isSubmitting}
                                className="w-full py-4 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-lg font-bold text-white shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2">
                                {isSubmitting ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        Send <Send className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                            </motion.form>
                        ) : (
                            <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center text-center h-[300px]">
                            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-4">
                                <CheckCircle className="w-8 h-8 text-green-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
                            <button onClick={() => setIsSent(false)} className="mt-6 text-gray-400 hover:text-white text-sm underline">Send another</button>
                            </motion.div>
                        )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
          </motion.div>


          {/* --- RIGHT COLUMN (5/12): Socials + Big Resume --- */}
          <motion.div variants={itemVariants} className="lg:col-span-5 flex flex-col gap-8">
            
            {/* 1. Social Links */}
            <div className="bg-gray-900/30 border border-gray-800 p-6 rounded-2xl backdrop-blur-sm">
              <h3 className="text-gray-200 font-bold mb-6 flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                 Connect Socially
              </h3>
              <div className="space-y-3">
                {socialLinks.map((social, idx) => (
                  <motion.a
                    key={idx}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ x: 8 }}
                    className={`flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r ${social.gradient} shadow-md ${social.shadow} transition-all group`}
                  >
                    <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                      <social.icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-bold text-white flex-1">{social.name}</span>
                    <ArrowRight className="w-5 h-5 text-white/50 group-hover:text-white transition-colors group-hover:translate-x-1" />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* 2. SUPERCHARGED DOWNLOAD RESUME BUTTON */}
            <motion.a 
              href="https://drive.google.com/uc?export=download&id=16qKtDRFsaO7n1fgpROgjNVO012dh8OwT"
              target="_blank" 
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group relative flex-1 min-h-[180px] rounded-2xl p-[2px] overflow-hidden"
            >
               <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 animate-pulse group-hover:animate-spin-slow transition-all" />
               <div className="relative w-full h-full bg-[#0a0a0a] rounded-2xl p-8 flex flex-col justify-center items-center text-center overflow-hidden">
                  <div className="absolute top-0 w-full h-full bg-gradient-to-b from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative z-10 w-16 h-16 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-purple-500/20 group-hover:border-purple-500/50 transition-all duration-300">
                      <Download className="w-8 h-8 text-white group-hover:text-purple-200 group-hover:animate-bounce" />
                  </div>
                  
                  <h3 className="relative z-10 text-2xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-cyan-400 transition-all">
                    Download Resume
                  </h3>
                  <p className="relative z-10 text-gray-500 text-xs font-mono">
                    PDF FORMAT • UPDATED 2026
                  </p>
               </div>
            </motion.a>

          </motion.div>

        </motion.div>

        {/* --- BOTTOM SECTION: CLEANER STATS --- */}
        <motion.div 
            initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mt-20"
        >
            <h3 className="text-center text-gray-500 font-mono text-sm mb-8 tracking-[0.2em] uppercase">Overview</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <motion.div 
                        key={idx} 
                        whileHover={{ y: -5 }}
                        className={`flex flex-col items-center justify-center text-center p-6 rounded-2xl bg-white/5 border ${stat.border} hover:bg-white/10 transition-colors`}
                    >
                        <div className="mb-3 p-3 rounded-full bg-black/50 border border-white/10">
                            <stat.icon className={`w-6 h-6 ${stat.color}`} />
                        </div>
                        <div className={`text-3xl lg:text-4xl font-bold mb-1 text-white`}>{stat.value}</div>
                        <div className={`text-xs font-bold uppercase tracking-wider ${stat.color}`}>{stat.label}</div>
                    </motion.div>
                ))}
            </div>
        </motion.div>

      </div>
    </div>
  );
}