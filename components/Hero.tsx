
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
          alt="F1 Racing Animation" 
          className="w-full h-full object-cover scale-110 brightness-[0.6]"
          onError={(e) => {
            e.currentTarget.src = "https://images.unsplash.com/photo-1516216628859-9bccecab13ca?q=80&w=2938&auto=format&fit=crop";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-mrs-black/40 via-mrs-black/60 to-mrs-black/90"></div>
        <div className="absolute inset-0 bg-carbon opacity-20 mix-blend-overlay"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-3xl">
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-block px-4 py-1 mb-4 border-l-4 border-mrs-yellow bg-mrs-black/70 backdrop-blur-md skew-box">
              <span className="text-mrs-yellow font-bold tracking-widest uppercase text-sm unskew-text">Official SimRacing League</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-display italic text-white leading-tight mb-6 drop-shadow-2xl">
              MASTER <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-mrs-yellow to-mrs-red">RACING</span> SERIES
            </h1>
          </motion.div>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }} className="text-xl md:text-2xl text-gray-100 mb-10 font-light border-l border-mrs-red pl-6 drop-shadow-lg">
            Siente la velocidad pura. Únete a la Season 4 de la liga de F1 más vibrante del simracing hispano.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.8 }} className="flex flex-wrap gap-4">
            <a href="#lineups" onClick={(e) => handleScrollTo(e, 'lineups')} className="skew-box bg-mrs-red px-10 py-4 text-white font-bold uppercase hover:bg-red-700 transition-all hover:scale-105 border-r-4 border-white shadow-xl shadow-mrs-red/20">
              <span className="unskew-text inline-block">Parrilla S4</span>
            </a>
            <a href="#calendar" onClick={(e) => handleScrollTo(e, 'calendar')} className="skew-box border-2 border-white px-10 py-4 text-white font-bold uppercase hover:bg-white hover:text-mrs-black transition-all hover:scale-105 backdrop-blur-sm">
              <span className="unskew-text inline-block">Calendario</span>
            </a>
          </motion.div>
        </div>
      </div>

      <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white/50">
        <ChevronDown size={32} />
      </motion.div>
    </section>
  );
};

export default Hero;
