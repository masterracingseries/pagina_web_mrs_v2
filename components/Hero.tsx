
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, FileCheck, Instagram, Calendar as CalendarIcon, Play, Minus, Plus } from 'lucide-react';
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
  
  const [activeItemId, setActiveItemId] = useState<string>('video-twitch-1');
  const [bgIndex, setBgIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isInfoVisible, setIsInfoVisible] = useState(true);

  // Reset states when changing items
  useEffect(() => {
    setIsExpanded(false);
    setIsInfoVisible(true);
  }, [activeItemId]);

  // Background GIF Rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % BACKGROUND_GIFS.length);
    }, 8000); // Change every 8 seconds
    return () => clearInterval(interval);
  }, []);

  const newsItems: NewsItem[] = [
    {
      id: 'video-twitch-1',
      type: 'video',
      title: '¿Y qué pasó con RLS_JANO? Final épico de MRS División 2',
      subtitle: 'Caos absoluto en las calles de Jeddah',
      videoUrl: 'https://clips.twitch.tv/embed?clip=ArtisticThirstyCucumberVoteNay-0P5V0GylzujLmYDG',
      badge: 'DESTACADO',
      description: '¡Para no creerlo! La tensión se podía cortar con un cuchillo en la División 2. Luego de 7 DNF en el peligroso circuito de Jeddah, Jano se encontraba en una posición única. Revive este final épico que dejó a toda la comunidad de MRS en shock. ¿Fue estrategia o simplemente el destino de las calles de Arabia?'
    },
    {
      id: 'video-1',
      type: 'video',
      title: '¡Ojo! Cambios en el sistema de puntos',
      subtitle: 'Novedades importantes sobre el sistema de puntos',
      videoUrl: 'https://www.youtube.com/embed/mj0oPyVbKxU',
      badge: 'IMPORTANTE',
      description: '¡Atención pilotos! Cambiamos el sistema de puntos para la Season 5. Ahora premiamos más la constancia y no solo al que vuela en una vuelta. Revisen el video para que no les pasen goles después con la tabla general. Este cambio busca que las carreras sean más peleadas de principio a fin, dando puntaje a más pilotos y acortando las diferencias entre los primeros lugares.'
    },
    {
      id: 'banner-1',
      type: 'banner',
      title: 'SEASON FIVE',
      subtitle: 'Inscripciones abiertas',
      badge: 'UNLOCKED',
      link: REGISTRATION_URL,
      linkText: 'Inscribirse Ahora',
      description: '¡Ya partimos! Las inscripciones para la Season 5 están abiertas y los cupos vuelan. No se queden abajo de la micro que este año los premios están de miedo. ¡Asegura tu butaca ahora ya! Contamos con nuevos auspiciadores y premios para los tres mejores de cada división. El proceso es simple pero asegúrate de tener tu licencia MRS al día para no quedar fuera de la grilla.'
    },
    {
      id: 'article-1',
      type: 'article',
      title: '¡Récord en el Paddock!',
      subtitle: 'NEM_AGATHOR logra el récord absoluto',
      image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=1000',
      badge: 'CONCURSO',
      description: '¡Se pasó! NEM_AGATHOR metió un tiempo de 1ms en el Paddock Zone. El wn tiene reflejos de lince y se ganó la inscripción gratis. ¿Quién se le anima a bajarle el tiempo? Los comisarios revisaron la telemetría tres veces porque no lo podían creer. Superar la barrera de lo humano es la especialidad de este piloto que ya se perfila como el favorito para las largadas de esta temporada.'
    }
  ];

  const activeItem = newsItems.find(item => item.id === activeItemId) || newsItems[0];

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden bg-mrs-black pt-24 md:pt-28">
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
        <div className="relative z-30 w-full bg-mrs-red/95 backdrop-blur-md py-2.5 md:py-3 px-4 md:px-6 flex items-center justify-between border-b border-white/10 shadow-lg">
          <div className="flex items-center gap-2 md:gap-4">
            <span className="bg-white text-mrs-red px-1.5 md:px-2.5 py-0.5 md:py-1 text-[8px] md:text-[10px] font-black uppercase rounded shadow-sm whitespace-nowrap">PRÓXIMA CARRERA</span>
            <div className="flex items-center gap-2 md:gap-3">
              <img src={nextRace.flagUrl} alt={nextRace.country} className="w-5 h-3.5 md:w-7 md:h-5 object-cover rounded-sm shadow-sm" />
              <span className="text-white font-display italic text-sm md:text-base uppercase tracking-wider drop-shadow-md truncate max-w-[80px] md:max-w-none">{nextRace.country}</span>
            </div>
          </div>
          <div className="flex items-center gap-3 md:gap-6 text-white/90 text-[10px] md:text-xs font-bold">
            <div className="flex items-center gap-1.5 md:gap-2">
              <span className="hidden sm:inline opacity-60 uppercase tracking-widest text-[9px] md:text-[10px]">Round</span>
              <span className="text-mrs-yellow font-black text-xs md:text-sm">{nextRace.round}</span>
            </div>
            <div className="flex items-center gap-1.5 md:gap-2 bg-black/20 px-2 md:px-3 py-0.5 md:py-1 rounded-full border border-white/5">
              <CalendarIcon size={12} className="text-mrs-yellow md:w-[14px] md:h-[14px]" />
              <span className="tracking-tight whitespace-nowrap">{nextRace.date}</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Dashboard Layout */}
      <div className="relative z-10 flex-1 flex items-center justify-center p-4 md:p-8 lg:p-10">
        <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-6">
          
          {/* Featured Area (Main News) */}
          <div className="lg:col-span-8 relative group rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-black/40 backdrop-blur-sm flex flex-col min-h-[400px] md:min-h-[500px] lg:min-h-0">
            <AnimatePresence mode="wait">
              <motion.div 
                key={activeItem.id}
                initial={{ opacity: 0, scale: 1.01 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.99 }}
                transition={{ duration: 0.4 }}
                className="flex-1 flex flex-col relative overflow-hidden"
              >
                {activeItem.type === 'video' ? (
                  /* VIDEO LAYOUT: Full Overlay with Toggle */
                  <div className="flex-1 relative w-full h-full bg-black overflow-hidden min-h-[400px]">
                    <div className="absolute inset-0 z-0">
                      <iframe 
                        src={activeItem.videoUrl?.includes('twitch.tv') 
                          ? `${activeItem.videoUrl}&parent=${typeof window !== 'undefined' ? window.location.hostname : 'localhost'}&autoplay=true`
                          : `${activeItem.videoUrl}?autoplay=1&mute=1&loop=1&playlist=${activeItem.videoUrl?.split('/').pop()}`
                        }
                        className="w-full h-full border-0"
                        allow="autoplay; encrypted-media"
                        title={activeItem.title}
                      />
                    </div>
                    
                    {/* Info Overlay */}
                    <AnimatePresence>
                      {isInfoVisible && (
                        <motion.div 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 20 }}
                          className="absolute bottom-0 left-0 right-0 p-3 md:p-8 z-10"
                        >
                          <div className="bg-black/70 backdrop-blur-md p-4 md:p-6 rounded-2xl border border-white/10 relative">
                            {/* Minimize Button */}
                            <button 
                              onClick={() => setIsInfoVisible(false)}
                              className="absolute top-3 right-3 w-7 h-7 md:w-8 md:h-8 flex items-center justify-center bg-white/10 hover:bg-mrs-red text-white rounded-full transition-colors z-20"
                              title="Minimizar información"
                            >
                              <Minus size={16} className="md:w-[18px] md:h-[18px]" />
                            </button>

                            <div className="mb-1.5 pr-8 md:pr-10">
                              <span className="inline-block bg-mrs-red text-white text-[8px] md:text-[9px] font-black px-1.5 md:px-2 py-0.5 rounded mb-1.5 md:mb-2 uppercase tracking-widest">
                                {activeItem.badge}
                              </span>
                              <h2 className="text-lg md:text-3xl lg:text-4xl font-display italic text-white uppercase mb-1.5 md:mb-2 leading-tight drop-shadow-lg">
                                {activeItem.title}
                              </h2>
                            </div>
                            
                            <div className={`overflow-y-auto custom-scrollbar pr-2 transition-all duration-300 ${isExpanded ? 'max-h-[150px] md:max-h-[200px]' : 'max-h-[60px] md:max-h-[80px]'}`}>
                              <p className={`text-xs md:text-base text-gray-300 font-medium ${isExpanded ? '' : 'line-clamp-2'}`}>
                                {activeItem.description}
                              </p>
                            </div>

                            <div className="mt-2.5 md:mt-3">
                              <button 
                                onClick={() => setIsExpanded(!isExpanded)} 
                                className="inline-flex items-center gap-1.5 md:gap-2 text-mrs-yellow font-black uppercase text-[9px] md:text-xs tracking-widest hover:text-white transition-colors"
                              >
                                {isExpanded ? 'Ver menos' : 'Leer más'} <ChevronDown size={12} className={`md:w-[14px] md:h-[14px] transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Maximize Button (Visible when info is hidden) */}
                    {!isInfoVisible && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        onClick={() => setIsInfoVisible(true)}
                        className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-mrs-red text-white rounded-full shadow-2xl z-20 hover:scale-110 transition-transform"
                        title="Mostrar información"
                      >
                        <Plus size={24} />
                      </motion.button>
                    )}
                  </div>
                ) : activeItem.type === 'banner' ? (
                  /* BANNER LAYOUT: Centered Overlay */
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-6 md:p-8 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-mrs-red/10 via-transparent to-mrs-yellow/5 z-0"></div>
                    <div className="relative z-10">
                      <motion.h2 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-5xl md:text-7xl lg:text-8xl font-display italic text-white leading-none mb-4 uppercase tracking-tighter"
                      >
                        {activeItem.title.split(' ')[0]} <br />
                        <span className="text-mrs-yellow">{activeItem.title.split(' ')[1]}</span>
                      </motion.h2>
                      <p className="text-lg md:text-xl text-gray-300 font-bold mb-6 md:mb-8 max-w-lg mx-auto">{activeItem.description}</p>
                      <div className="flex justify-center gap-4">
                        <a href={activeItem.link} className="bg-mrs-red text-white px-6 md:px-8 py-3 md:py-4 font-black uppercase rounded hover:bg-white hover:text-mrs-red transition-all flex items-center gap-2 text-sm md:text-base shadow-xl">
                          <FileCheck size={20} /> {activeItem.linkText}
                        </a>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* ARTICLE LAYOUT: Revert to Full Overlay */
                  <div className="flex-1 relative h-full">
                    <img src={activeItem.image} alt={activeItem.title} className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                    
                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="max-w-2xl bg-black/40 backdrop-blur-md p-6 rounded-2xl border border-white/5"
                      >
                        <span className="inline-block bg-mrs-red text-white text-[10px] font-black px-2 py-1 rounded mb-3 uppercase tracking-widest">
                          {activeItem.badge}
                        </span>
                        <h2 className="text-3xl md:text-5xl lg:text-6xl font-display italic text-white uppercase mb-3 leading-tight drop-shadow-lg">
                          {activeItem.title}
                        </h2>
                        <div className={`text-base md:text-lg text-gray-300 font-medium drop-shadow-md transition-all duration-300 overflow-y-auto custom-scrollbar ${isExpanded ? 'max-h-[150px] mb-4' : 'line-clamp-2'}`}>
                          {activeItem.description}
                        </div>
                        <button 
                          onClick={() => setIsExpanded(!isExpanded)} 
                          className="inline-flex items-center gap-2 text-mrs-yellow font-black uppercase text-xs md:text-sm tracking-widest hover:text-white transition-colors"
                        >
                          {isExpanded ? 'Ver menos' : 'Leer más'} <ChevronDown size={16} className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                        </button>
                      </motion.div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Sidebar (Other News) */}
          <div className="lg:col-span-4 flex flex-col gap-3 lg:overflow-y-auto pr-1 custom-scrollbar lg:max-h-none pb-10 lg:pb-0">
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
              <span className="text-gray-500 text-[9px] font-bold uppercase tracking-widest">Siguenos</span>
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
