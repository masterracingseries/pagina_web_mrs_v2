
import React, { useState, useEffect } from 'react';
import { Bot, MessageSquare, ArrowUpRight } from 'lucide-react';

const FloatingAIButton: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Umbral más bajo para móviles para que aparezca antes
      const isScrolledEnough = window.scrollY > 150;
      
      // Ocultar si estamos muy cerca de la sección del ingeniero
      const aiSection = document.getElementById('ai-engineer');
      let isNearSection = false;
      if (aiSection) {
        const rect = aiSection.getBoundingClientRect();
        // Detección más flexible de cercanía
        isNearSection = rect.top < window.innerHeight - 100 && rect.bottom > 100;
      }

      setIsVisible(isScrolledEnough && !isNearSection);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check inicial

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToAI = () => {
    document.getElementById('ai-engineer')?.scrollIntoView({ behavior: 'smooth' });
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-3 transition-all duration-500 animate-in fade-in slide-in-from-bottom-4">
      {/* Badge Superior */}
      <div className="bg-mrs-black/90 backdrop-blur-md border border-mrs-red px-3 py-1.5 rounded-lg text-[9px] font-black text-white uppercase tracking-[0.2em] shadow-2xl shadow-mrs-red/40 flex items-center gap-2 animate-pulse">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-mrs-red opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-mrs-red"></span>
          </span>
          IA-CETAS ONLINE
      </div>

      <button 
        onClick={scrollToAI}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="relative p-5 rounded-full shadow-[0_0_30px_rgba(225,6,0,0.5)] transition-all duration-300 group overflow-hidden bg-mrs-red hover:scale-110 border-2 border-white/30 active:scale-95"
      >
        {/* Efecto de brillo interior */}
        <div className="absolute inset-0 bg-white/20 animate-pulse opacity-10"></div>
        <Bot className="text-white group-hover:rotate-12 transition-transform relative z-10" size={32} />

        {/* Tooltip Lateral (Solo en Desktop) */}
        <div className={`hidden md:block absolute right-full mr-5 bottom-0 bg-gray-900 border border-gray-700 p-4 rounded-2xl shadow-2xl w-56 transition-all duration-300 pointer-events-none ${showTooltip ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            <p className="text-[10px] text-mrs-yellow font-black uppercase tracking-widest mb-1">Asesoría Técnica</p>
            <p className="text-xs text-white font-medium mb-3 leading-relaxed">Consulta telemetría, setups y resultados en tiempo real.</p>
            <div className="flex items-center gap-1 text-[9px] text-mrs-red font-black uppercase">
                <MessageSquare size={10} /> Abrir Panel <ArrowUpRight size={10} />
            </div>
        </div>
      </button>
    </div>
  );
};

export default FloatingAIButton;
