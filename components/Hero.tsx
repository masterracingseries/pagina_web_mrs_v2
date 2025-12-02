
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
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        {/* 
           IMAGEN PRINCIPAL (BANNER)
           Ubicación: public/images/logos/hero-bg.jpg
        */}
        <img 
          src="images/logos/hero-bg.jpg" 
          onError={(e) => {
            // Fallback por si la imagen local no existe aún
            e.currentTarget.src = "https://images.unsplash.com/photo-1516216628859-9bccecab13ca?q=80&w=2938&auto=format&fit=crop";
          }}
          alt="SimRacing Setup" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-mrs-black via-mrs-black/80 to-transparent"></div>
        <div className="absolute inset-0 bg-carbon opacity-30 mix-blend-overlay"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-block px-4 py-1 mb-4 border-l-4 border-mrs-yellow bg-white/10 backdrop-blur-sm skew-box">
              <span className="text-mrs-yellow font-bold tracking-widest uppercase text-sm unskew-text">Official SimRacing League</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-display italic text-white leading-tight mb-6">
              MASTER <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-mrs-yellow to-mrs-red">
                RACING
              </span> SERIES
            </h1>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-xl md:text-2xl text-gray-300 mb-8 font-light border-l border-gray-600 pl-6"
          >
            Donde la precisión se encuentra con la pasión. Únete a la liga de F1 24 más competitiva de Latinoamérica.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-wrap gap-4"
          >
            <a 
                href="#lineups" 
                onClick={(e) => handleScrollTo(e, 'lineups')}
                className="skew-box bg-mrs-red px-8 py-3 text-white font-bold uppercase hover:bg-red-700 transition-colors border-r-4 border-white cursor-pointer"
            >
              <span className="unskew-text inline-block">Ver Pilotos</span>
            </a>
            <a 
                href="#calendar" 
                onClick={(e) => handleScrollTo(e, 'calendar')}
                className="skew-box border-2 border-white px-8 py-3 text-white font-bold uppercase hover:bg-white hover:text-mrs-black transition-colors cursor-pointer"
            >
              <span className="unskew-text inline-block">Calendario S4</span>
            </a>
          </motion.div>
        </div>
      </div>

      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white/50"
      >
        <ChevronDown size={32} />
      </motion.div>
    </section>
  );
};

export default Hero;
