
import React from 'react';
import { motion } from 'framer-motion';
import { CALENDAR } from '../constants';
import { MapPin, CheckCircle2 } from 'lucide-react';

const Calendar: React.FC = () => {
  const today = new Date();
  const nextRaceIndex = CALENDAR.findIndex(race => new Date(race.isoDate) >= today);

  return (
    <section id="calendar" className="py-20 bg-mrs-black relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-16 border-b border-gray-700 pb-4 flex justify-between items-end">
          <div>
            <span className="text-mrs-red font-bold tracking-widest text-sm uppercase">Temporada Actual</span>
            <h2 className="text-4xl md:text-5xl font-display text-white italic">CALENDARIO OFICIAL</h2>
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
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className={`group relative bg-gray-900 border-l-4 p-6 transition-all duration-500 overflow-hidden
                  ${isCompleted ? 'border-gray-700 opacity-60' : isNext ? 'border-mrs-yellow scale-[1.02] shadow-[0_0_30px_rgba(255,215,0,0.1)]' : 'border-mrs-red'}`}
              >
                <div className="flex justify-between mb-4">
                  <span className="text-xs font-bold text-gray-400">ROUND {race.round}</span>
                  {isCompleted && <span className="text-green-500 text-[10px] font-bold uppercase flex items-center gap-1"><CheckCircle2 size={12}/> Finalizado</span>}
                  {isNext && <span className="bg-mrs-yellow text-mrs-black px-2 py-0.5 text-[10px] font-black uppercase rounded animate-pulse">Próxima Carrera</span>}
                </div>

                <div className="flex items-center gap-3 mb-2">
                   <img src={race.flagUrl} alt="" className="w-6 h-4 object-cover rounded" />
                   <h3 className={`text-2xl font-bold italic ${isNext ? 'text-mrs-yellow' : 'text-white'}`}>{race.country.toUpperCase()}</h3>
                </div>
                <p className="text-gray-400 text-sm mb-4 flex items-center gap-2"><MapPin size={14}/> {race.trackName}</p>
                <div className="text-white font-bold text-lg mb-4">{race.date}</div>
                
                <div className="mt-4 pt-4 border-t border-gray-800">
                  <div className="relative h-24 w-full mb-3 flex items-center justify-center bg-gray-800/50 rounded-lg p-2">
                    <img src={race.mapUrl} alt={`Mapa de ${race.trackName}`} className="max-h-full max-w-full object-contain opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  {race.info && (
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 group-hover:line-clamp-none transition-all duration-300">
                      {race.info}
                    </p>
                  )}
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
