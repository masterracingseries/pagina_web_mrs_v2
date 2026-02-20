
import React from 'react';
import { motion } from 'framer-motion';
import { ADMINS, SOCIAL_LINKS } from '../constants';
import { Instagram, Twitch, Youtube, User } from 'lucide-react';
import SafeImage from './SafeImage';

const About: React.FC = () => {
  return (
    <section id="about" className="py-24 bg-mrs-black text-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-mrs-red/5 skew-x-12 transform translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-mrs-yellow/5 -skew-x-12 transform -translate-x-1/2"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-mrs-yellow font-bold tracking-[0.5em] text-sm uppercase mb-4 block">Staff & Liderazgo</span>
            <h2 className="text-5xl md:text-7xl font-display italic mb-8 uppercase tracking-tighter">
              QUIÉNES <span className="text-mrs-red">SOMOS</span>
            </h2>
            <div className="w-32 h-1.5 bg-mrs-red mx-auto mb-10 skew-box"></div>
            <p className="text-gray-400 text-xl max-w-3xl mx-auto leading-relaxed font-light">
              Master Racing Series nació de la pasión por el automovilismo y la competición virtual. 
              Somos un equipo dedicado a forjar la mejor experiencia de SimRacing, 
              donde el respeto y la velocidad máxima son nuestra única ley.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {ADMINS.map((admin, index) => (
            <motion.div 
              key={admin.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="group relative"
            >
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-[2rem] p-10 border border-white/5 hover:border-mrs-yellow/30 transition-all duration-500 shadow-2xl h-full flex flex-col items-center text-center">
                {/* Profile Image Container */}
                <div className="relative mb-8">
                  <div className="w-40 h-40 rounded-3xl overflow-hidden border-4 border-gray-800 shadow-[0_0_30px_rgba(0,0,0,0.5)] group-hover:border-mrs-yellow transition-colors duration-500">
                    <SafeImage 
                      src={admin.imageUrl} 
                      alt={admin.name} 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-110 group-hover:scale-100" 
                      fallbackIcon={<User size={60} className="text-gray-700" />}
                    />
                  </div>
                  {/* Alias Badge */}
                  <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-mrs-red text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl border-2 border-mrs-black">
                    {admin.alias}
                  </div>
                </div>

                <div className="mt-4 mb-6">
                  <h4 className="text-3xl font-display italic tracking-tighter text-white mb-2 group-hover:text-mrs-yellow transition-colors uppercase">
                    {admin.name.split(' ')[0]} <br />
                    <span className="text-mrs-yellow group-hover:text-white transition-colors">{admin.name.split(' ')[1]}</span>
                  </h4>
                  <div className="inline-block px-3 py-1 bg-mrs-red/10 border border-mrs-red/20 rounded text-[10px] uppercase tracking-[0.2em] text-mrs-red font-black">
                    {admin.role}
                  </div>
                </div>

                <p className="text-gray-400 text-lg leading-relaxed italic font-light">
                  "{admin.description}"
                </p>

                {/* Social Links for Admins (Optional placeholder) */}
                <div className="mt-auto pt-8 flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <a href={SOCIAL_LINKS.instagram} className="text-gray-500 hover:text-white transition-colors"><Instagram size={20} /></a>
                  <a href={SOCIAL_LINKS.twitch} className="text-gray-500 hover:text-white transition-colors"><Twitch size={20} /></a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-24 flex justify-center">
          <div className="flex gap-8 items-center bg-gray-900/80 px-10 py-6 rounded-full border border-white/5 backdrop-blur-md">
            <span className="text-gray-500 uppercase text-xs font-black tracking-widest">Síguenos en</span>
            <div className="flex gap-6">
              <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noreferrer" className="text-white hover:text-mrs-red transition-all hover:scale-125"><Instagram size={24}/></a>
              <a href={SOCIAL_LINKS.twitch} target="_blank" rel="noreferrer" className="text-white hover:text-purple-500 transition-all hover:scale-125"><Twitch size={24}/></a>
              <a href={SOCIAL_LINKS.youtube} target="_blank" rel="noreferrer" className="text-white hover:text-red-600 transition-all hover:scale-125"><Youtube size={24}/></a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
