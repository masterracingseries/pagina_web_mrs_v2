import React from 'react';
import { motion } from 'framer-motion';
import { CALENDAR } from '../constants';
import { MapPin, Flag, Zap, ArrowLeftRight } from 'lucide-react';
import { RaceFormat } from '../types';

const Calendar: React.FC = () => {
  
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
        <div className="mb-16 border-b border-gray-700 pb-4 flex justify-between items-end">
          <div>
            <span className="text-mrs-red font-bold tracking-widest text-sm uppercase">Season 4</span>
            <h2 className="text-4xl md:text-5xl font-display text-white italic">OFFICIAL CALENDAR</h2>
          </div>
          <div className="hidden md:block text-mrs-yellow text-4xl font-display">F1 25</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {CALENDAR.map((race, index) => (
            <motion.div
              key={race.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`group relative bg-gray-900 border-l-4 ${race.completed ? 'border-mrs-gray opacity-70' : 'border-mrs-yellow'} overflow-hidden hover:bg-gray-800 transition-all duration-300`}
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                <img src={race.mapUrl} alt="Track Map" className="w-32 h-20 object-contain filter invert" />
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-white/10 px-3 py-1 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                    <span className="text-mrs-yellow">R{race.round}</span>
                    <span className="text-gray-400">|</span>
                    <span>{race.date}</span>
                  </div>
                  {race.completed ? (
                    <span className="text-xs text-green-500 font-bold uppercase border border-green-500 px-2 py-0.5 rounded">Finalizado</span>
                  ) : getFormatBadge(race.format)}
                </div>

                <div className="flex items-center gap-3 mb-2">
                   <img src={race.flagUrl} alt={race.country} className="w-6 h-4 object-cover rounded shadow-sm" />
                   <h3 className="text-2xl font-bold italic">{race.country.toUpperCase()}</h3>
                </div>
                
                <p className="text-gray-400 text-sm flex items-center gap-2">
                  <MapPin size={14} className="text-mrs-red" />
                  {race.trackName}
                </p>

                <div className="mt-6 pt-4 border-t border-gray-800 flex justify-between items-center">
                    <button className="text-sm text-white hover:text-mrs-yellow uppercase font-bold tracking-wider transition-colors">
                        Detalles
                    </button>
                    <div className="w-8 h-1 bg-mrs-red skew-box group-hover:w-16 transition-all duration-300"></div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Calendar;