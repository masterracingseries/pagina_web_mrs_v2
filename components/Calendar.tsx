
import React from 'react';
import { motion } from 'framer-motion';
import { CALENDAR, IS_SEASON_ACTIVE, REGISTRATION_URL } from '../constants';
import { MapPin, CheckCircle2, Calendar as CalendarIcon, Zap, Construction } from 'lucide-react';

const Calendar: React.FC = () => {
  if (!IS_SEASON_ACTIVE) {
    return (
      <section id="calendar" className="py-24 bg-mrs-black relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-carbon opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="bg-gray-900 border-2 border-dashed border-gray-700 rounded-[3rem] p-12 md:p-24 text-center">
             <div className="inline-flex items-center justify-center w-20 h-20 bg-mrs-yellow text-mrs-black rounded-full mb-8 shadow-2xl animate-pulse">
                <Construction size={40} />
             </div>
             <h2 className="text-4xl md:text-7xl font-display italic text-white uppercase mb-6 tracking-tighter">
                CALENDARIO <span className="text-mrs-red">PENDIENTE</span>
             </h2>
             <p className="text-gray-400 text-lg md:text-2xl max-w-3xl mx-auto font-light leading-relaxed mb-10">
               Nuestros ingenieros están homologando los circuitos de la <span className="text-white font-bold">Temporada 5</span>. El asfalto está casi listo. Muy pronto revelaremos las fechas oficiales.
             </p>
             <div className="flex flex-col md:flex-row gap-6 justify-center">
                <div className="bg-gray-800 p-6 rounded-2xl border border-white/5 flex flex-col items-center">
                   <CalendarIcon className="text-mrs-red mb-2" size={32} />
                   <span className="text-xs font-black uppercase tracking-widest text-gray-500">Próximamente</span>
                   <p className="text-white font-bold">10 Rounds Elite</p>
                </div>
                <div className="bg-gray-800 p-6 rounded-2xl border border-white/5 flex flex-col items-center">
                   <Zap className="text-mrs-yellow mb-2" size={32} />
                   <span className="text-xs font-black uppercase tracking-widest text-gray-500">Nuevos Formatos</span>
                   <p className="text-white font-bold">Sprint & Night Races</p>
                </div>
             </div>
          </div>
        </div>
      </section>
    );
  }

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
                className={`group relative bg-gray-900 border-l-4 p-6 transition-all duration-500 
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
                <div className="text-white font-bold text-lg">{race.date}</div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Calendar;
