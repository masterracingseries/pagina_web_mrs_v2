
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, FileCheck, Instagram, Calendar as CalendarIcon, Play, ExternalLink } from 'lucide-react';
import { SOCIAL_LINKS, REGISTRATION_URL, CALENDAR } from '../constants';

interface NewsItem {
  id: string;
  type: 'banner' | 'video' | 'article';
  title: string;
  subtitle?: string;
  image?: string;
  videoUrl?: string;
  link?: string;
  linkText?: string;
  badge?: string;
  description?: string;
}

const BACKGROUND_GIFS = [
  "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExcXdkcWpwdXBiaWY2eGJramhzbHJ0NTZqZjUweWRqcWJvejgybDJtdiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l0vTAW139fUJeBEjzF/giphy.gif",
  "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExaXN5bzRzcDQ2dzB1anN5NGszZ3lkYjJiMmMxN3lmbGpoa282cTJxdiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/iyYL3OiBT6DrRlQE1A/giphy.gif",
  "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExaGNtcDA5Zno2Z2ZjYTB0aXB5ZXhpemxra2FxaXBtNnlkampzb2FidCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/g0avlDuZqVR4LfGDhf/giphy.gif",
  "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExd291c3hlNDMwNXNyeDhrN3ltMHZmcXNiNXFlYXBubjdodnRydTE1dCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/QA17RwiPQMJQkeGw7B/giphy.gif"
];

const Hero: React.FC = () => {
  const today = new Date();
  const nextRace = CALENDAR.find(race => new Date(race.isoDate) >= today);
  
  const [activeItemId, setActiveItemId] = useState<string>('video-1');
  const [bgIndex, setBgIndex] = useState(0);

  // Background GIF Rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % BACKGROUND_GIFS.length);
    }, 8000); // Change every 8 seconds
    return () => clearInterval(interval);
  }, []);

  const newsItems: NewsItem[] = [
    {
      id: 'video-1',
      type: 'video',
      title: 'Anuncio: Cambios en Puntajes',
      subtitle: 'Novedades importantes sobre el sistema de puntos',
      videoUrl: 'https://www.youtube.com/embed/mj0oPyVbKxU',
      badge: 'IMPORTANTE',
      description: 'Hemos actualizado el sistema de puntuación para la Temporada 5. Mira el video para conocer todos los detalles y cómo afectará a la tabla de posiciones.'
    },
    {
      id: 'banner-1',
      type: 'banner',
      title: 'SEASON FIVE',
      subtitle: 'Inscripciones abiertas',
      badge: 'UNLOCKED',
      link: REGISTRATION_URL,
      linkText: 'Inscribirse Ahora',
      description: 'Únete a la parrilla más competitiva del simracing. La Temporada 5 ya está aquí y los cupos son limitados. ¡No te quedes fuera!'
    },
    {
      id: 'article-1',
      type: 'article',
      title: 'Hazaña en el Paddock Zone',
      subtitle: 'NEM_AGATHOR logra el récord absoluto',
      image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=1000',
      badge: 'CONCURSO',
      link: '#minigame',
      description: 'Increíble desempeño de NEM_AGATHOR logrando un tiempo récord de 1ms en nuestro test de reacción. ¡Inscripción gratis asegurada para el campeón de reflejos!'
    },
    {
      id: 'article-2',
      type: 'article',
      title: 'IA-Cetas: ¿Genio o Amenaza?',
      subtitle: 'La IA que desata risas y polémicas',
      image: 'images/logos/iacetas.gif',
      badge: 'SÁTIRA',
      link: '#ai-engineer',
      description: 'Conocida por su personalidad "particular" y sus comentarios ácidos, IA-Cetas se ha convertido en el centro de atención. ¿Es un genio de la telemetría o solo quiere tu plata?'
    }
  ];

  const activeItem = newsItems.find(item => item.id === activeItemId) || newsItems[0];

  return (
    <section className="relative min-h-[650px] lg:h-[80vh] flex flex-col overflow-hidden bg-mrs-black">
      {/* Background GIF - Rotating */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.img 
            key={bgIndex}
            src={BACKGROUND_GIFS[bgIndex]} 
            alt="F1 Background" 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="w-full h-full object-cover scale-110 grayscale-[0.5] contrast-125"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-b from-mrs-black/90 via-transparent to-mrs-black"></div>
      </div>

      {/* Persistent Next Race Bar */}
      {nextRace && (
        <div className="relative z-30 w-full bg-mrs-red/90 backdrop-blur-md py-2 px-6 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-4">
            <span className="bg-white text-mrs-red px-2 py-0.5 text-[10px] font-black uppercase rounded">PRÓXIMA CARRERA</span>
            <div className="flex items-center gap-2">
              <img src={nextRace.flagUrl} alt={nextRace.country} className="w-6 h-4 object-cover rounded-sm" />
              <span className="text-white font-display italic text-sm uppercase tracking-wider">{nextRace.country}</span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-white/80 text-xs font-bold">
            <span className="hidden sm:inline">ROUND {nextRace.round}</span>
            <div className="flex items-center gap-1">
              <CalendarIcon size={12} className="text-mrs-yellow" />
              <span>{nextRace.date}</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Dashboard Layout */}
      <div className="relative z-10 flex-1 flex items-center justify-center p-4 md:p-6 lg:p-10">
        <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 h-full max-h-[750px]">
          
          {/* Featured Area (Main News) */}
          <div className="lg:col-span-8 relative group rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-black/40 backdrop-blur-sm flex flex-col min-h-[350px] lg:min-h-0">
            <AnimatePresence mode="wait">
              <motion.div 
                key={activeItem.id}
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.4 }}
                className="flex-1 relative overflow-hidden"
              >
                {activeItem.type === 'video' ? (
                  <div className="absolute inset-0 bg-black">
                    <iframe 
                      src={`${activeItem.videoUrl}?autoplay=1&mute=1&loop=1&playlist=${activeItem.videoUrl?.split('/').pop()}`}
                      className="w-full h-full border-0"
                      allow="autoplay; encrypted-media"
                      title={activeItem.title}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none"></div>
                  </div>
                ) : activeItem.type === 'banner' ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 md:p-8">
                    <motion.h2 
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className="text-5xl md:text-7xl lg:text-8xl font-display italic text-white leading-none mb-4 uppercase tracking-tighter"
                    >
                      {activeItem.title.split(' ')[0]} <br />
                      <span className="text-mrs-yellow">{activeItem.title.split(' ')[1]}</span>
                    </motion.h2>
                    <p className="text-lg md:text-xl text-gray-300 font-bold mb-6 md:mb-8 max-w-lg">{activeItem.description}</p>
                    <div className="flex gap-4">
                      <a href={activeItem.link} className="bg-mrs-red text-white px-6 md:px-8 py-3 md:py-4 font-black uppercase rounded hover:bg-white hover:text-mrs-red transition-all flex items-center gap-2 text-sm md:text-base">
                        <FileCheck size={20} /> {activeItem.linkText}
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="absolute inset-0">
                    <img src={activeItem.image} alt={activeItem.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                  </div>
                )}

                {/* Info Overlay for Video/Article */}
                {activeItem.type !== 'banner' && (
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 pointer-events-none">
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <span className="inline-block bg-mrs-red text-white text-[10px] font-black px-2 py-1 rounded mb-3 uppercase tracking-widest">
                        {activeItem.badge}
                      </span>
                      <h2 className="text-3xl md:text-5xl lg:text-6xl font-display italic text-white uppercase mb-3 leading-tight drop-shadow-lg">
                        {activeItem.title}
                      </h2>
                      <p className="text-base md:text-lg text-gray-300 font-medium max-w-2xl drop-shadow-md line-clamp-2 md:line-clamp-none">
                        {activeItem.description}
                      </p>
                      {activeItem.link && (
                        <a href={activeItem.link} className="mt-4 inline-flex items-center gap-2 text-mrs-yellow font-black uppercase text-xs md:text-sm tracking-widest hover:text-white transition-colors pointer-events-auto">
                          Leer más <ExternalLink size={16} />
                        </a>
                      )}
                    </motion.div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Sidebar (Other News) */}
          <div className="lg:col-span-4 flex flex-col gap-3 overflow-y-auto pr-1 custom-scrollbar max-h-[300px] lg:max-h-none">
            <h3 className="text-white/40 font-black text-[10px] uppercase tracking-[0.3em] mb-1 px-2">Más Novedades</h3>
            <div className="flex flex-col gap-3">
              {newsItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveItemId(item.id)}
                  className={`group relative flex gap-3 p-2 md:p-3 rounded-xl transition-all border text-left ${
                    activeItemId === item.id 
                      ? 'bg-white/10 border-mrs-yellow/50 shadow-lg' 
                      : 'bg-black/40 border-white/5 hover:bg-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="relative w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-800">
                    {item.type === 'video' ? (
                      <div className="w-full h-full flex items-center justify-center bg-mrs-red/20">
                        <Play size={20} className="text-mrs-red" />
                      </div>
                    ) : item.type === 'banner' ? (
                      <div className="w-full h-full flex items-center justify-center bg-mrs-yellow/20">
                        <span className="text-mrs-yellow font-display italic text-lg md:text-xl">S5</span>
                      </div>
                    ) : (
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    )}
                    {activeItemId === item.id && (
                      <div className="absolute inset-0 border-2 border-mrs-yellow rounded-lg animate-pulse"></div>
                    )}
                  </div>
                  <div className="flex flex-col justify-center py-1">
                    <span className={`text-[8px] md:text-[9px] font-black uppercase tracking-widest mb-0.5 ${
                      activeItemId === item.id ? 'text-mrs-yellow' : 'text-gray-500'
                    }`}>
                      {item.badge}
                    </span>
                    <h4 className={`font-display italic text-xs md:text-sm uppercase leading-tight mb-0.5 transition-colors ${
                      activeItemId === item.id ? 'text-white' : 'text-gray-400 group-hover:text-white'
                    }`}>
                      {item.title}
                    </h4>
                    <p className="text-[9px] md:text-[10px] text-gray-500 font-bold line-clamp-1 md:line-clamp-2">
                      {item.subtitle}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            {/* Social Links Mini-Banner */}
            <div className="mt-auto pt-3 border-t border-white/10 flex items-center justify-between px-2">
              <span className="text-gray-500 text-[9px] font-bold uppercase tracking-widest">Seguinos</span>
              <div className="flex gap-3">
                <a href={SOCIAL_LINKS.instagram} target="_blank" className="text-gray-400 hover:text-white transition-colors">
                  <Instagram size={16} />
                </a>
                <a href={SOCIAL_LINKS.youtube} target="_blank" className="text-gray-400 hover:text-white transition-colors">
                  <Play size={16} />
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        animate={{ y: [0, 8, 0] }} 
        transition={{ repeat: Infinity, duration: 2 }} 
        className="absolute bottom-3 left-1/2 transform -translate-x-1/2 text-white/10"
      >
        <ChevronDown className="w-5 h-5" />
      </motion.div>
    </section>
  );
};

export default Hero;
