import React from 'react';
import { ADMINS } from '../constants';
import { Instagram, Twitch, Youtube } from 'lucide-react';

const About: React.FC = () => {
  return (
    <section id="about" className="py-20 bg-mrs-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-12 items-center mb-20">
            <div className="md:w-1/2">
                <span className="text-mrs-yellow font-bold tracking-widest text-sm uppercase">Staff</span>
                <h2 className="text-4xl md:text-5xl font-display italic mb-6">QUIENES SOMOS</h2>
                <p className="text-gray-300 text-lg leading-relaxed mb-6">
                    Master Racing Series nació de la pasión por el automovilismo y la competición virtual. 
                    Somos un grupo de entusiastas dedicados a organizar la mejor experiencia de SimRacing en F1 24, 
                    priorizando el respeto, la competitividad y el espectáculo.
                </p>
                <div className="flex gap-4">
                    <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-mrs-red transition-colors"><Instagram size={24}/></a>
                    <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-purple-600 transition-colors"><Twitch size={24}/></a>
                    <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-red-600 transition-colors"><Youtube size={24}/></a>
                </div>
            </div>
            <div className="md:w-1/2 grid grid-cols-2 gap-2">
                <div className="aspect-square bg-gray-800 rounded-lg overflow-hidden translate-y-8">
                     <img src="https://images.unsplash.com/photo-1547754980-3df97fed72a8?q=80&w=2940&auto=format&fit=crop" className="w-full h-full object-cover" alt="Sim racing wheel" />
                </div>
                <div className="aspect-square bg-gray-800 rounded-lg overflow-hidden">
                     <img src="https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=2940&auto=format&fit=crop" className="w-full h-full object-cover" alt="Racing car" />
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {ADMINS.map((admin) => (
                <div key={admin.id} className="bg-gray-900 rounded-xl p-6 border-t-4 border-mrs-yellow hover:-translate-y-2 transition-transform duration-300">
                    <div className="flex items-center gap-4 mb-4">
                        <img src={admin.imageUrl} alt={admin.name} className="w-16 h-16 rounded-full border-2 border-white object-cover" />
                        <div>
                            <h4 className="text-xl font-bold font-display italic">{admin.name}</h4>
                            <span className="text-xs uppercase tracking-wider text-mrs-red font-bold">{admin.role}</span>
                        </div>
                    </div>
                    <p className="text-gray-400 text-sm">
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