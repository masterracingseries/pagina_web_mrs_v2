import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DIVISIONS, TEAMS } from '../constants';
import { Users, Car } from 'lucide-react';

const Lineups: React.FC = () => {
  const [activeTab, setActiveTab] = useState(DIVISIONS[0].id);

  const activeDivision = DIVISIONS.find((d) => d.id === activeTab);

  return (
    <section id="lineups" className="py-20 bg-white relative text-mrs-black overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-checkered opacity-5"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <span className="text-mrs-red font-bold tracking-widest text-sm uppercase">The Grid</span>
          <h2 className="text-4xl md:text-6xl font-display italic text-mrs-black mb-4">DRIVER LINEUPS</h2>
          <div className="w-24 h-1 bg-mrs-yellow mx-auto skew-box"></div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {DIVISIONS.map((div) => (
            <button
              key={div.id}
              onClick={() => setActiveTab(div.id)}
              className={`skew-box px-6 py-3 font-bold uppercase tracking-wider transition-all duration-300 border-2 ${
                activeTab === div.id
                  ? 'bg-mrs-black border-mrs-black text-white scale-105 shadow-lg'
                  : 'bg-transparent border-mrs-black text-mrs-black hover:bg-mrs-black hover:text-white'
              }`}
            >
              <span className="unskew-text block">{div.name}</span>
            </button>
          ))}
        </div>

        {/* Grid Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6"
          >
            {TEAMS.map((team) => {
              const teamDrivers = activeDivision?.drivers.filter(d => d.teamId === team.id) || [];
              
              if (teamDrivers.length === 0) return null;

              return (
                <div key={team.id} className="bg-gray-100 rounded-lg overflow-hidden border border-gray-200 shadow-md flex flex-col sm:flex-row h-auto sm:h-48 group hover:shadow-xl transition-shadow">
                   {/* Team Branding Stripe */}
                   <div 
                      className="w-full sm:w-2 h-2 sm:h-full flex-shrink-0"
                      style={{ backgroundColor: team.color }}
                   ></div>
                   
                   <div className="flex-1 p-6 flex flex-col justify-between relative overflow-hidden">
                      {/* F1 Car Watermark */}
                       <div className="absolute -right-10 -bottom-10 opacity-10 transform -rotate-12 pointer-events-none">
                            <Car size={150} color={team.color} />
                       </div>

                      <div className="flex justify-between items-center mb-4 z-10">
                        <h3 className="font-display text-2xl italic uppercase">{team.name}</h3>
                        <img src={team.logoUrl} alt={team.name} className="h-8 object-contain" />
                      </div>

                      <div className="grid grid-cols-2 gap-4 z-10">
                        {teamDrivers.map((driver) => (
                          <div key={driver.id} className="flex items-center gap-3 bg-white p-3 rounded shadow-sm border-l-2 border-gray-300">
                             <div className="font-display text-xl text-gray-400 italic">#{driver.number}</div>
                             <div>
                               <div className="text-xs text-gray-500 uppercase font-bold">Driver</div>
                               <div className="font-bold text-mrs-black leading-tight">{driver.name}</div>
                             </div>
                             <img src={`https://flagcdn.com/${driver.country.toLowerCase()}.svg`} className="w-5 h-auto ml-auto rounded-sm" alt={driver.country} />
                          </div>
                        ))}
                      </div>
                   </div>
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Lineups;