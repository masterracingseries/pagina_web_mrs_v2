import React, { useState, useEffect } from 'react';
import { Bot, MessageSquare, ArrowUpRight } from 'lucide-react';

const FloatingAIButton: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(!entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    const aiSection = document.getElementById('ai-engineer');
    if (aiSection) observer.observe(aiSection);

    return () => { if (aiSection) observer.unobserve(aiSection); };
  }, []);

  const scrollToAI = () => {
    document.getElementById('ai-engineer')?.scrollIntoView({ behavior: 'smooth' });
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-3 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="bg-mrs-black border border-mrs-red px-3 py-1.5 rounded-lg text-[10px] font-bold text-white uppercase tracking-widest shadow-xl shadow-mrs-red/30 flex items-center gap-2 animate-bounce">
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
        className="relative p-5 rounded-full shadow-2xl transition-all duration-300 group overflow-hidden bg-mrs-red hover:scale-110 border-2 border-white/20"
      >
        <div className="absolute inset-0 bg-white/20 animate-pulse opacity-20"></div>
        <Bot className="text-white group-hover:rotate-12 transition-transform relative z-10" size={28} />

        <div className={`hidden md:block absolute right-full mr-4 bottom-0 bg-gray-900 border border-gray-700 p-3 rounded-xl shadow-2xl w-48 transition-all duration-300 pointer-events-none ${showTooltip ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}>
            <p className="text-[10px] text-mrs-yellow font-black uppercase mb-1">Asesoría Técnica</p>
            <p className="text-xs text-white font-medium mb-2">Consulta setups y resultados en tiempo real.</p>
            <div className="flex items-center gap-1 text-[9px] text-mrs-red font-bold uppercase">
                <MessageSquare size={10} /> Abrir Chat <ArrowUpRight size={10} />
            </div>
        </div>
      </button>
    </div>
  );
};

export default FloatingAIButton;
