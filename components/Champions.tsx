
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CHAMPIONS } from '../constants';
import { Champion } from '../types';
import { Trophy, History, Star } from 'lucide-react';
import SafeImage from './SafeImage';

const ChampionCard: React.FC<{ champ: Champion }> = ({ champ }) => (
  <div className="w-[300px] flex-shrink-0 relative group overflow-hidden rounded-xl border border-gray-800 bg-gray-900 mx-4">
      <div className="aspect-[4/5] overflow-hidden">
          <SafeImage 
              src={champ.imageUrl} 
              alt={champ.name} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
              fallbackIcon={<Trophy size={40} className="opacity-20" />}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90"></div>
      </div>
      
      <div className="absolute bottom-0 left-0 w-full p-6">
          <div className="flex items-center justify-between mb-1">
               <div className="text-mrs-yellow font-display text-lg">{champ.season}</div>
               <Star size={14} className="text-mrs-yellow" fill="currentColor"/>
          </div>
          <h3 className="text-2xl font-bold uppercase italic leading-none mb-2 text-white">{champ.name}</h3>
          <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-mrs-red text-xs font-bold uppercase rounded">{champ.division}</span>
          </div>
      </div>
  </div>
);

const Champions: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ALL' | 'S4' | 'S3' | 'S2' | 'S1'>('ALL');

  const filteredChampions = activeTab === 'ALL' 
    ? CHAMPIONS 
    : CHAMPIONS.filter(c => c.season === activeTab);

  return (
    <section id="champions" className="py-24 bg-gradient-to-b from-mrs-black to-gray-900 text-white overflow-hidden">
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center p-3 bg-mrs-yellow rounded-full text-mrs-black mb-4 shadow-[0_0_20px_rgba(255,215,0,0.5)]">
                <Trophy size={32} />
            </div>
            <h2 className="text-4xl md:text-6xl font-display uppercase italic mb-2 text-white">
                Wall of <span className="text-transparent bg-clip-text bg-gradient-to-r from-mrs-yellow to-yellow-600">Champions</span>
            </h2>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-16">
            <button 
                onClick={() => setActiveTab('ALL')}
                className={`px-6 py-2 rounded-full font-bold uppercase tracking-wider text-sm transition-all duration-300 border border-gray-700 ${activeTab === 'ALL' ? 'bg-mrs-yellow text-mrs-black' : 'bg-gray-800 text-gray-400'}`}
            >
                <span className="flex items-center gap-2"><History size={16}/> Hall of Fame</span>
            </button>
            {['S3','S4'].map(season => (
                 <button 
                    key={season}
                    onClick={() => setActiveTab(season as any)}
                    className={`px-6 py-2 rounded-full font-bold uppercase tracking-wider text-sm transition-all duration-300 border border-gray-700 ${activeTab === season ? 'bg-mrs-red text-white' : 'bg-gray-800 text-gray-400'}`}
                >
                    Season {season.replace('S', '')}
                </button>
            ))}
        </div>
        
        <div className="min-h-[500px]">
            {activeTab === 'ALL' ? (
                 <div className="relative w-full overflow-hidden">
                    <motion.div 
                        className="flex"
                        animate={{ x: ["0%", "-100%"] }}
                        transition={{ repeat: Infinity, ease: "linear", duration: 40 }}
                    >
                        {[...CHAMPIONS, ...CHAMPIONS].map((champ, index) => (
                             <ChampionCard key={`${champ.id}-${index}`} champ={champ} />
                        ))}
                    </motion.div>
                 </div>
            ) : (
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                    >
                        {filteredChampions.map((champ) => (
                             <ChampionCard key={champ.id} champ={champ} />
                        ))}
                    </motion.div>
                </AnimatePresence>
            )}
        </div>
       </div>
    </section>
  );
};

export default Champions;
