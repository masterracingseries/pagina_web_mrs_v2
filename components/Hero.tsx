
import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const Hero: React.FC = () => {
  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExdTQ5NWcyZjZ6d3k1NWFwdmgxZ3FyanE5ajB0cW9tcjdqNXVnZTR4dCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l2vnBoOj4kcYwfso3N/giphy.gif" 
          alt="F1 Racing Action" 
          className="w-full h-full object-cover scale-110 brightness-[0.4] contrast-125"
          onError={(e) => {
            e.currentTarget.src = "https://images.unsplash.com/photo-1516216628859-9bccecab13ca?q=80&w=2938&auto=format&fit=crop";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-mrs-black/40 via-mrs-black/70 to-mrs-black"></div>
        <div className="absolute inset-0 bg-carbon opacity-10 mix-blend-overlay"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full pt-20">
        <div className="max-w-4xl">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            {/* Tag oficial con barra amarilla lateral como la imagen */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1.5 h-6 md:h-8 bg-mrs-yellow"></div>
              <span className="text-mrs-yellow font-bold tracking-[0.2em] uppercase text-[10px] md:text-sm">Official SimRacing League</span>
            </div>

            {/* Título idéntico a la imagen */}
            <h1 className="text-5xl sm:text-7xl md:text-9xl font-display italic text-white leading-[0.9] mb-8 drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] uppercase tracking-tighter">
              MASTER <br />
              <span className="text-mrs-yellow">RACING</span> SERIES
            </h1>
          </motion.div>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }} className="text-sm md:text-xl text-gray-200 mb-10 font-light border-l border-mrs-red pl-6 drop-shadow-lg max-w-2xl leading-relaxed">
            Siente la velocidad pura. Únete a la Season 4 de la liga de F1 más vibrante del simracing hispano.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.8 }} className="flex flex-col sm:flex-row gap-5">
            <a href="#lineups" onClick={(e) => handleScrollTo(e, 'lineups')} className="skew-box bg-mrs-red px-10 py-5 text-white font-black uppercase hover:bg-red-700 transition-all text-center border-r-4 border-white shadow-[0_10px_20px_rgba(225,6,0,0.3)] group">
              <span className="unskew-text inline-block group-hover:scale-105 transition-transform">Parrilla S4</span>
            </a>
            <a href="#calendar" onClick={(e) => handleScrollTo(e, 'calendar')} className="skew-box border-2 border-white/30 px-10 py-5 text-white font-black uppercase hover:bg-white hover:text-mrs-black transition-all text-center backdrop-blur-md group">
              <span className="unskew-text inline-block group-hover:scale-105 transition-transform">Calendario</span>
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
