
import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Instagram, Twitch } from 'lucide-react';
import { SOCIAL_LINKS } from '../constants';

const Hero: React.FC = () => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExdTQ5NWcyZjZ6d3k1NWFwdmgxZ3FyanE5ajB0cW9tcjdqNXVnZTR4dCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l2vnBoOj4kcYwfso3N/giphy.gif" 
          alt="F1 Racing Action" 
          className="w-full h-full object-cover scale-110 brightness-[0.25] contrast-125"
          onError={(e) => {
            e.currentTarget.src = "https://images.unsplash.com/photo-1516216628859-9bccecab13ca?q=80&w=2938&auto=format&fit=crop";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-mrs-black/20 via-mrs-black/40 to-mrs-black"></div>
        <div className="absolute inset-0 bg-carbon opacity-10 mix-blend-overlay"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full pt-40 md:pt-48">
        <div className="max-w-4xl">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1.5 h-8 bg-mrs-yellow shadow-[0_0_15px_rgba(255,215,0,0.3)]"></div>
              <span className="text-mrs-yellow font-bold tracking-[0.3em] uppercase text-[10px] md:text-sm">Official SimRacing League</span>
            </div>

            <h1 className="text-5xl sm:text-7xl md:text-9xl font-display italic text-white leading-[0.9] mb-10 drop-shadow-[0_15px_30px_rgba(0,0,0,0.9)] uppercase tracking-tighter">
              MASTER <br />
              <span className="text-mrs-yellow">RACING</span> SERIES
            </h1>
          </motion.div>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }} className="text-base md:text-2xl text-gray-300 mb-12 font-light border-l-2 border-mrs-red pl-8 drop-shadow-lg max-w-2xl leading-relaxed">
            Siente la velocidad pura. Únete a la Season 4 de la liga de F1 más vibrante del simracing hispano.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.8 }} className="flex flex-col sm:flex-row gap-4">
            {/* BOTÓN INSTAGRAM PROFESIONAL GHOST */}
            <a 
              href={SOCIAL_LINKS.instagram} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 border border-white/20 bg-white/5 hover:bg-white hover:text-black px-10 py-5 text-white font-black uppercase transition-all text-center backdrop-blur-md rounded shadow-xl active:scale-95 group"
            >
              <Instagram size={22} className="group-hover:scale-110 transition-transform" />
              <span>Instagram</span>
            </a>

            {/* BOTÓN TWITCH PROFESIONAL GHOST */}
            <a 
              href={SOCIAL_LINKS.twitch} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 border border-white/20 bg-white/5 hover:bg-mrs-red px-10 py-5 text-white font-black uppercase transition-all text-center backdrop-blur-md rounded shadow-xl active:scale-95 group"
            >
              <Twitch size={22} className="group-hover:scale-110 transition-transform" />
              <span>Twitch Live</span>
            </a>
          </motion.div>
        </div>
      </div>

      <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white/40">
        <ChevronDown className="w-8 h-8 md:w-10 md:h-10" />
      </motion.div>
    </section>
  );
};

export default Hero;
