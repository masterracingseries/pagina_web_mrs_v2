
import React from 'react';
import { ADMINS, SOCIAL_LINKS } from '../constants';
import { Instagram, Twitch, Youtube, User } from 'lucide-react';
import SafeImage from './SafeImage';

const About: React.FC = () => {
  return (
    <section id="about" className="py-20 bg-mrs-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-12 items-center mb-20">
            <div className="md:w-1/2">
                <span className="text-mrs-yellow font-bold tracking-widest text-sm uppercase">Staff</span>
                <h2 className="text-4xl md:text-5xl font-display italic mb-6 uppercase tracking-tighter">Quiénes Somos</h2>
                <p className="text-gray-300 text-lg leading-relaxed mb-6">
                    Master Racing Series nació de la pasión por el automovilismo y la competición virtual en Punta Arenas. 
                    Somos un grupo de entusiastas dedicados a organizar la mejor experiencia de SimRacing en <span className="text-white font-bold">F1 25</span>, 
                    priorizando el respeto, la competitividad y el espectáculo.
                </p>
                <div className="flex gap-4">
                    <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noreferrer" className="p-3 bg-gray-800 rounded-full hover:bg-mrs-red transition-all hover:scale-110 shadow-lg"><Instagram size={22}/></a>
                    <a href={SOCIAL_LINKS.twitch} target="_blank" rel="noreferrer" className="p-3 bg-gray-800 rounded-full hover:bg-purple-600 transition-all hover:scale-110 shadow-lg"><Twitch size={22}/></a>
                    <a href={SOCIAL_LINKS.youtube} target="_blank" rel="noreferrer" className="p-3 bg-gray-800 rounded-full hover:bg-red-600 transition-all hover:scale-110 shadow-lg"><Youtube size={22}/></a>
                </div>
            </div>
            <div className="md:w-1/2 grid grid-cols-2 gap-4">
                <div className="aspect-square bg-gray-800 rounded-2xl overflow-hidden translate-y-8 border-2 border-white/5 shadow-2xl">
                     <img src="https://images.unsplash.com/photo-1547754980-3df97fed72a8?q=80&w=2940&auto=format&fit=crop" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" alt="Sim racing wheel" />
                </div>
                <div className="aspect-square bg-gray-800 rounded-2xl overflow-hidden border-2 border-white/5 shadow-2xl">
                     <img src="https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=2940&auto=format&fit=crop" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" alt="Racing car" />
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {ADMINS.map((admin) => (
                <div key={admin.id} className="bg-gray-900 rounded-2xl p-8 border-t-4 border-mrs-yellow hover:-translate-y-2 transition-all duration-500 shadow-xl group">
                    <div className="flex items-center gap-5 mb-6">
                        <div className="w-20 h-20 rounded-full border-2 border-white/10 overflow-hidden shadow-lg flex-shrink-0">
                            <SafeImage 
                                src={admin.imageUrl} 
                                alt={admin.name} 
                                className="w-full h-full object-cover" 
                                fallbackIcon={<User size={30} className="text-gray-600" />}
                            />
                        </div>
                        <div>
                            <h4 className="text-2xl font-display italic tracking-tighter text-white group-hover:text-mrs-yellow transition-colors">{admin.name}</h4>
                            <span className="text-[10px] uppercase tracking-[0.2em] text-mrs-red font-black">{admin.role}</span>
                        </div>
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed italic">
                        "{admin.description}"
                    </p>
                </div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default About;
