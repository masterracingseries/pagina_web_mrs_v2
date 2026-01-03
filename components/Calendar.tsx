
import React from 'react';
import { motion } from 'framer-motion';
import { CALENDAR } from '../constants';
import { MapPin, Flag, Zap, ArrowLeftRight, CheckCircle2, Star } from 'lucide-react';
import { RaceFormat, RaceEvent } from '../types';

const Calendar: React.FC = () => {
  
  // Lógica de tiempo: Hoy
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Encontrar la próxima carrera (la primera que no ha pasado)
  const nextRaceIndex = CALENDAR.findIndex(race => {
    const raceDate = new Date(race.isoDate);
    return raceDate >= today;
  });

  const getFormatBadge = (format: RaceFormat) => {
    switch (format) {
        case 'SPRINT':
            return (
                <div className="flex items-center gap-1 bg-mrs-yellow text-mrs-black px-2 py-1 text-xs font-bold uppercase rounded skew-box">
                    <Zap size={12} className="unskew-text" />
                    <span className="unskew-text">Sprint</span>
                </div>
            );
        case 'INVERTED':
             return (
                <div className="flex items-center gap-1 bg-purple-600 text-white px-2 py-1 text-xs font-bold uppercase rounded skew-box">
                    <ArrowLeftRight size={12} className="unskew-text" />
                    <span className="unskew-text">Inverted</span>
                </div>
            );
        default:
            return (
                 <div className="flex items-center gap-1 bg-gray-700 text-gray-300 px-2 py-1 text-xs font-bold uppercase rounded skew-box">
                    <Flag size={12} className="unskew-text" />
                    <span className="unskew-text">Feature</span>
                </div>
            );
    }
  };

  return (
    <section id="calendar" className="py-20 bg-mrs-black relative">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-mrs-gray/20 -skew-x-12 transform translate-x-20"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-16 border-b border-gray-700 pb-4 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <span className="text-mrs-red font-bold tracking-widest text-sm uppercase">Temporada Actual</span>
            <h2 className="text-4xl md:text-5xl font-display text-white italic">CALENDARIO OFICIAL</h2>
          </div>
          <div className="bg-mrs-yellow text-mrs-black px-4 py-2 font-display text-2xl skew-box">
            <span className="unskew-text">F1 25</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {CALENDAR.map((race, index) => {
            const raceDate = new Date(race.isoDate);
            const isCompleted = raceDate < today;
            const isNext = index === nextRaceIndex;

            return (
              <motion.div
                key={race.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`group relative bg-gray-900 border-l-4 transition-all duration-500 overflow-hidden 
                  ${isCompleted ? 'border-gray-700 opacity-60 grayscale' : isNext ? 'border-mrs-yellow scale-[1.02] shadow-[0_0_30px_rgba(255,215,0,0.2)]' : 'border-mrs-red'} 
                  hover:bg-gray-800 hover:scale-[1.03]`}
              >
                {/* Efecto de resplandor para la próxima carrera */}
                {isNext && (
                   <div className="absolute inset-0 bg-gradient-to-tr from-mrs-yellow/5 to-transparent animate-pulse pointer-events-none"></div>
                )}

                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                  <img src={race.mapUrl} alt="Track Map" className="w-32 h-20 object-contain filter invert" />
                </div>

                <div className="p-6 relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-white/10 px-3 py-1 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                      <span className={isNext ? "text-mrs-yellow" : "text-mrs-red"}>R{race.round}</span>
                      <span className="text-gray-400">|</span>
                      <span className="text-white">{race.date}</span>
                    </div>
                    
                    {isCompleted ? (
                      <div className="flex items-center gap-1 text-green-500 font-bold uppercase text-[10px] border border-green-500/30 px-2 py-0.5 rounded bg-green-500/10">
                         <CheckCircle2 size={12} /> Finalizado
                      </div>
                    ) : isNext ? (
                      <div className="flex items-center gap-1 bg-mrs-yellow text-mrs-black px-2 py-0.5 text-[10px] font-black uppercase rounded animate-bounce">
                         <Star size={12} fill="currentColor" /> Próxima
                      </div>
                    ) : getFormatBadge(race.format)}
                  </div>

                  <div className="flex items-center gap-3 mb-2">
                     <img src={race.flagUrl} alt={race.country} className="w-6 h-4 object-cover rounded shadow-sm" />
                     <h3 className={`text-2xl font-bold italic ${isNext ? 'text-mrs-yellow' : 'text-white'}`}>
                        {race.country.toUpperCase()}
                     </h3>
                  </div>
                  
                  <p className="text-gray-400 text-sm flex items-center gap-2">
                    <MapPin size={14} className={isNext ? "text-mrs-yellow" : "text-mrs-red"} />
                    {race.trackName}
                  </p>

                  <div className={`mt-6 pt-4 border-t border-gray-800 flex justify-between items-center`}>
                      <button className={`text-sm uppercase font-bold tracking-wider transition-colors ${isNext ? 'text-mrs-yellow underline decoration-2' : 'text-gray-400 hover:text-white'}`}>
                          {isNext ? "Preparar Estrategia" : "Detalles"}
                      </button>
                      <div className={`w-8 h-1 skew-box group-hover:w-16 transition-all duration-300 ${isNext ? 'bg-mrs-yellow shadow-[0_0_10px_#FFD700]' : 'bg-mrs-red'}`}></div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Calendar;
