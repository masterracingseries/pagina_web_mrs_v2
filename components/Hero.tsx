
import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, FileCheck, Instagram } from 'lucide-react';
import { SOCIAL_LINKS, REGISTRATION_URL } from '../constants';

const Hero: React.FC = () => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExNGR3NTZmOGo0NnVzNHlpbmk5bmhocWJnd3duZHc2NzZ5ZWpmamxwbSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/MabKYsLLZi62RBvsj4/giphy.gif" 
          alt="F1 Season 5" 
          className="w-full h-full object-cover scale-110 brightness-[0.2] contrast-125 grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-mrs-black/20 via-mrs-black/40 to-mrs-black"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full pt-40 md:pt-48 text-center md:text-left">
        <div className="max-w-4xl mx-auto md:mx-0">
          <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="flex items-center justify-center md:justify-start gap-3 mb-8">
              <div className="w-1.5 h-8 bg-mrs-yellow"></div>
              <span className="text-mrs-yellow font-bold tracking-[0.4em] uppercase text-[10px] md:text-sm">Pre-Temporada 2025</span>
            </div>

            <h1 className="text-5xl sm:text-7xl md:text-[10rem] font-display italic text-white leading-[0.85] mb-8 uppercase tracking-tighter drop-shadow-2xl">
              SEASON <br />
              <span className="text-mrs-yellow">FIVE</span>
            </h1>
          </motion.div>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.8 }} className="text-lg md:text-3xl text-gray-300 mb-12 font-light drop-shadow-lg max-w-2xl leading-tight border-l-4 border-mrs-red pl-6 mx-auto md:mx-0">
            Una nueva era comienza. El simulador está listo, ¿lo estás tú? Prepárate para la competencia definitiva.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.8 }} className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <a 
              href={REGISTRATION_URL} 
              target="_blank" 
              className="flex items-center justify-center gap-3 bg-mrs-red px-12 py-6 text-white font-black uppercase transition-all rounded shadow-2xl active:scale-95 group hover:bg-white hover:text-mrs-red border-b-4 border-black/30"
            >
              <FileCheck size={24} className="group-hover:scale-110 transition-transform" />
              <span className="text-lg">Inscribirse Ahora</span>
            </a>

            <a 
              href={SOCIAL_LINKS.instagram} 
              target="_blank" 
              className="flex items-center justify-center gap-3 border border-white/20 bg-white/5 hover:bg-white/10 px-10 py-6 text-white font-black uppercase transition-all rounded backdrop-blur-md"
            >
              <Instagram size={24} />
              <span>Ver Novedades</span>
            </a>
          </motion.div>
        </div>
      </div>

      <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-mrs-yellow/40">
        <ChevronDown className="w-8 h-8 md:w-10 md:h-10" />
      </motion.div>
    </section>
  );
};

export default Hero;
