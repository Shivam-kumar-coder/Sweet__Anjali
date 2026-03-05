import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Gift, Calendar, Sparkles, ChevronRight, Music, Volume2, VolumeX, Camera, MessageCircleHeart } from 'lucide-react';
import confetti from 'canvas-confetti';

// Types
interface Memory {
  id: number;
  url: string;
  caption: string;
}

const MEMORIES: Memory[] = [
  { id: 1, url: 'https://picsum.photos/seed/love1/600/800', caption: 'The moment it all began' },
  { id: 2, url: 'https://picsum.photos/seed/love2/600/800', caption: 'Our favorite little getaway' },
  { id: 3, url: 'https://picsum.photos/seed/love3/600/800', caption: 'That perfect summer evening' },
  { id: 4, url: 'https://picsum.photos/seed/love4/600/800', caption: 'Shared laughs and endless talks' },
  { id: 5, url: 'https://picsum.photos/seed/love5/600/800', caption: 'Exploring the world together' },
  { id: 6, url: 'https://picsum.photos/seed/love6/600/800', caption: 'Just us, being us' },
];

export default function App() {
  const [phase, setPhase] = useState<'loading' | 'countdown' | 'celebration'>('loading');
  const [isMuted, setIsMuted] = useState(false); // Default to unmuted for autoplay attempt
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Countdown state
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalSeconds: 1 // Initial non-zero to prevent immediate button show
  });

  const targetDate = new Date('2026-03-07T00:00:00');

  useEffect(() => {
    if (phase === 'loading') {
      const timer = setTimeout(() => setPhase('countdown'), 3000);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  // Handle autoplay on first interaction
  useEffect(() => {
    const handleFirstInteraction = () => {
      if (audioRef.current && !isMuted) {
        audioRef.current.play().catch(e => console.log("Autoplay blocked", e));
      }
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };
    window.addEventListener('click', handleFirstInteraction);
    window.addEventListener('touchstart', handleFirstInteraction);
    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, [isMuted]);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();
      
      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, totalSeconds: 0 });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds, totalSeconds: Math.floor(difference / 1000) });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleStartCelebration = () => {
    setPhase('celebration');
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.log("Play failed", e));
    }
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FF69B4', '#FFB6C1', '#FFC0CB', '#FF1493']
    });
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.play().catch(e => console.log("Audio play blocked", e));
      } else {
        audioRef.current.pause();
      }
    }
  };

  return (
    <div className="min-h-screen font-sans overflow-x-hidden">
      <AnimatePresence mode="wait">
        {phase === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex flex-col items-center justify-center bg-pink-50 z-50"
          >
            <div className="relative">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="text-pink-400 mb-8"
              >
                <Heart size={64} fill="currentColor" />
              </motion.div>
              <div className="absolute -top-4 -right-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                  className="text-pink-300"
                >
                  <Sparkles size={24} />
                </motion.div>
              </div>
            </div>
            <div className="glass px-8 py-6 rounded-3xl text-center shadow-xl max-w-xs w-full mx-4">
              <h2 className="font-serif italic text-2xl text-pink-600 mb-2">Loading something special...</h2>
              <div className="flex justify-center gap-2 text-pink-400">
                <motion.span animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, delay: 0 }}>🎂</motion.span>
                <motion.span animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, delay: 0.2 }}>✨</motion.span>
                <motion.span animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, delay: 0.4 }}>🎁</motion.span>
                <motion.span animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, delay: 0.6 }}>💖</motion.span>
                <motion.span animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, delay: 0.8 }}>🎈</motion.span>
              </div>
            </div>
          </motion.div>
        )}

        {phase === 'countdown' && (
          <motion.div
            key="countdown"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-pink-100 to-purple-100 p-6 z-40"
          >
            <div className="max-w-md w-full glass rounded-[2.5rem] p-10 shadow-2xl text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-pink-200">
                <motion.div 
                  className="h-full bg-pink-500 relative"
                  initial={{ width: "0%" }}
                  animate={{ width: `${Math.min(100, (1 - (timeLeft.totalSeconds / (2 * 24 * 60 * 60))) * 100)}%` }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-4 h-4 bg-pink-500 rounded-full flex items-center justify-center shadow-sm">
                    <Gift size={10} className="text-white" />
                  </div>
                </motion.div>
              </div>

              <h1 className="font-display text-3xl md:text-4xl text-pink-800 mb-8 leading-tight">
                My sweet Anjali's <br />
                <span className="italic">Special Day is Almost Here</span> 🥳🥳
              </h1>

              <div className="grid grid-cols-4 gap-2 md:gap-4 mb-10">
                {[
                  { label: 'Days', value: timeLeft.days, icon: <Heart size={16} /> },
                  { label: 'Hours', value: timeLeft.hours, icon: <Sparkles size={16} /> },
                  { label: 'Minutes', value: timeLeft.minutes, icon: <Calendar size={16} /> },
                  { label: 'Seconds', value: timeLeft.seconds, icon: <Gift size={16} /> },
                ].map((item, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <div className="w-14 h-14 rounded-2xl bg-white/60 flex items-center justify-center text-xl font-bold text-pink-600 shadow-sm mb-2">
                      {item.value}
                    </div>
                    <span className="text-[10px] uppercase tracking-widest font-semibold text-pink-400 flex items-center gap-1">
                      {item.icon} {item.label}
                    </span>
                  </div>
                ))}
              </div>

              <p className="text-pink-700/70 text-sm mb-8 leading-relaxed">
                A small gift for my dear anjali 🍫🍫❤️🍫🍫
              </p>

              <div className="flex justify-center gap-2 mb-8">
                <div className="w-2 h-2 rounded-full bg-pink-400 animate-pulse" />
                <div className="w-2 h-2 rounded-full bg-pink-300 animate-pulse delay-75" />
                <div className="w-2 h-2 rounded-full bg-pink-200 animate-pulse delay-150" />
              </div>

              <AnimatePresence>
                {timeLeft.totalSeconds === 0 ? (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ 
                      opacity: 1, 
                      scale: [1, 1.05, 1],
                      boxShadow: ["0px 0px 0px rgba(236, 72, 153, 0)", "0px 0px 20px rgba(236, 72, 153, 0.5)", "0px 0px 0px rgba(236, 72, 153, 0)"]
                    }}
                    transition={{
                      scale: { repeat: Infinity, duration: 2 },
                      boxShadow: { repeat: Infinity, duration: 2 }
                    }}
                    onClick={handleStartCelebration}
                    className="w-full py-5 bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 bg-[length:200%_auto] animate-gradient text-white rounded-2xl font-bold text-xl shadow-lg hover:shadow-pink-200/50 transition-all flex items-center justify-center gap-3 group"
                  >
                    <Sparkles size={24} className="group-hover:rotate-12 transition-transform" />
                    Open Your Gift
                    <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center gap-2"
                  >
                    <span className="text-pink-400 text-xs italic">
                      Waiting for the clock to strike midnight...
                    </span>
                    <span className="text-pink-300 text-[10px] animate-pulse">
                      Tap anywhere to prepare the music 🎵
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Background floating elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[...Array(15)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ 
                    x: Math.random() * window.innerWidth, 
                    y: window.innerHeight + 100,
                    opacity: 0.3,
                    scale: Math.random() * 0.5 + 0.5
                  }}
                  animate={{ 
                    y: -100,
                    x: (Math.random() - 0.5) * 200 + (Math.random() * window.innerWidth),
                    rotate: 360
                  }}
                  transition={{ 
                    duration: Math.random() * 10 + 10, 
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="absolute text-pink-200"
                >
                  <Heart fill="currentColor" size={Math.random() * 20 + 10} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {phase === 'celebration' && (
          <motion.div
            key="celebration"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative pb-20"
          >
            {/* Audio Control */}
            <button 
              onClick={toggleMute}
              className="fixed top-6 right-6 z-50 w-12 h-12 rounded-full glass flex items-center justify-center text-pink-600 shadow-lg hover:scale-110 transition-transform"
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} className="animate-pulse" />}
            </button>
            <audio 
              ref={audioRef}
              src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" 
              loop 
            />

            {/* Hero Section */}
            <section className="h-screen flex flex-col items-center justify-center text-center px-6 relative overflow-hidden bg-gradient-to-b from-pink-100 to-white">
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="z-10"
              >
                <div className="inline-block px-4 py-1 rounded-full bg-pink-200 text-pink-600 text-xs font-bold uppercase tracking-widest mb-6">
                  Today is the day
                </div>
                <h1 className="font-display text-4xl md:text-7xl text-pink-800 mb-6 leading-tight">
                  Happy Birthday, <br />
                  <span className="italic text-pink-600">My sweet Anjali! 🥳🥳</span>
                </h1>
                <p className="font-serif text-xl text-pink-700/70 max-w-lg mx-auto mb-10 leading-relaxed">
                  Today we celebrate the most incredible person I know. You make every day brighter just by being you.
                </p>
                <div className="flex justify-center gap-4 mb-10">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ y: [0, -10, 0] }}
                      transition={{ repeat: Infinity, duration: 2, delay: i * 0.2 }}
                      className="text-pink-400"
                    >
                      <Heart fill="currentColor" size={24} />
                    </motion.div>
                  ))}
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => document.getElementById('memories')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-8 py-3 bg-pink-500 text-white rounded-full font-bold shadow-lg shadow-pink-200 flex items-center gap-2 mx-auto"
                >
                  Start the Celebration
                  <ChevronRight size={18} />
                </motion.button>
              </motion.div>

              {/* Decorative elements */}
              <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent" />
            </section>

            {/* Memories Section */}
            <section id="memories" className="max-w-6xl mx-auto px-6 py-24">
              <div className="flex items-center gap-4 mb-12">
                <div className="w-12 h-12 rounded-2xl bg-pink-500 flex items-center justify-center text-white shadow-lg">
                  <Camera size={24} />
                </div>
                <div>
                  <h2 className="font-display text-3xl text-pink-900">Our Beautiful Memories</h2>
                  <p className="text-pink-400 text-sm font-medium">Every moment with you is a treasure</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {MEMORIES.map((memory, idx) => (
                  <motion.div
                    key={memory.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="group"
                  >
                    <div className="relative aspect-[3/4] rounded-[2rem] overflow-hidden shadow-xl group-hover:shadow-2xl transition-all duration-500">
                      <img 
                        src={memory.url} 
                        alt={memory.caption}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-pink-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                        <p className="text-white font-serif italic text-lg">{memory.caption}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Message Section */}
            <section className="max-w-4xl mx-auto px-4 md:px-6 py-24">
              <div className="glass rounded-[2rem] md:rounded-[3rem] p-6 md:p-16 shadow-2xl relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-pink-200/30 rounded-full blur-3xl" />
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-200/30 rounded-full blur-3xl" />
                
                <div className="flex justify-center mb-8">
                  <div className="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center text-pink-500">
                    <MessageCircleHeart size={32} />
                  </div>
                </div>

                <h2 className="font-display text-3xl md:text-4xl text-center text-pink-900 mb-10">A Special Message For My sweet Anjali 🎂</h2>
                
                <div className="font-serif text-lg md:text-xl text-pink-800/80 leading-relaxed space-y-6 text-center">
                  <p>
                    My dearest Anjali, on this special day, I want you to know how truly grateful I am to have you in my life. 
                    Your laughter is the sweetest melody, and your smile is the brightest light in my world.
                  </p>
                  <p>
                    You are the most beautiful soul I've ever known, and every moment spent with you is a gift I cherish. 
                    Watching you shine and being by your side is my greatest happiness.
                  </p>
                  <p>
                    Today, we celebrate you — your kindness, your grace, and the incredible woman you are. 
                    I hope this year brings you as much joy as you bring to everyone around you.
                  </p>
                  <p className="pt-6 font-bold text-pink-600 text-2xl italic">
                    Happy Birthday, Anjali! I love you more than words can say.
                  </p>
                </div>
              </div>
            </section>

            {/* Footer */}
            <footer className="text-center py-12 text-pink-400 text-sm font-medium tracking-widest uppercase">
              Made with <Heart size={14} className="inline mx-1 fill-pink-400" /> just for you
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
