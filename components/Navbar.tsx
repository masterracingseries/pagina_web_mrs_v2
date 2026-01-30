
import React, { useState, useEffect } from 'react';
import { Menu, X, Gamepad2, Instagram, Twitch } from 'lucide-react';
import { LOGO_URL, SOCIAL_LINKS } from '../constants';
import SafeImage from './SafeImage';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    setIsOpen(false);
    const id = targetId.replace('#', '');
    const element = document.getElementById(id);
    if (element) {
      const offset = 90; // Altura del navbar fijo
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const navLinks = [
    { name: 'Calendario', href: '#calendar' },
    { name: 'Resultados', href: '#standings' },
    { name: 'Pilotos', href: '#lineups' },
    { name: 'Media', href: '#media' },
    { name: 'Reglamento', href: '#rules' },
    { name: 'Campeones', href: '#champions' },
    { name: 'Nosotros', href: '#about' },
  ];

  return (
    <nav className="fixed w-full z-[100] bg-mrs-black border-t-4 border-mrs-red shadow-2xl">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8">
        <div className="flex justify-between items-center h-20 md:h-24">
          
          {/* LOGO GIGANTE Y TÍTULO - Bloque izquierdo */}
          <div 
            className="flex items-center gap-4 md:gap-8 group cursor-pointer h-full" 
            onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
          >
            <div className="w-20 h-20 md:w-28 md:h-28 flex items-center justify-center py-2 transition-transform duration-300 group-hover:scale-105">
               <SafeImage 
                 src={LOGO_URL} 
                 alt="Master Racing Series" 
                 className="max-w-full max-h-full object-contain"
                 fallbackIcon={
                   <div className="w-12 h-12 bg-mrs-red rounded flex items-center justify-center font-display text-white text-xl skew-box">
                      <span className="unskew-text">M</span>
                   </div>
                 }
               />
            </div>

            <div className="flex flex-col border-l border-white/10 pl-4 md:pl-8">
                <h1 className="font-display text-lg sm:text-2xl md:text-3xl tracking-tighter text-white italic leading-none uppercase">
                  MASTER <span className="text-mrs-yellow">RACING</span> SERIES
                </h1>
                <span className="text-[7px] md:text-[9px] font-black uppercase tracking-[0.4em] text-mrs-red mt-1">Official SimRacing League</span>
            </div>
          </div>
          
          {/* Navegación Desktop - Con más espacio entre elementos */}
          <div className="hidden xl:block h-full">
            <div className="flex items-center h-full space-x-6">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="relative px-2 py-4 text-[10px] xl:text-[11px] font-black uppercase tracking-widest text-white/70 hover:text-white transition-all hover:translate-y-[-2px]"
                >
                  {link.name}
                </a>
              ))}
               <a
                  href="#game"
                  onClick={(e) => handleNavClick(e, '#game')}
                  className="ml-6 flex items-center gap-2 bg-mrs-red px-6 py-2.5 text-[11px] font-black uppercase tracking-widest text-white hover:bg-white hover:text-mrs-red transition-all rounded shadow-xl active:scale-95 border-b-4 border-black/20"
                >
                   <Gamepad2 size={16} />
                   <span>Paddock</span>
                </a>
            </div>
          </div>

          {/* Botón Menú Móvil */}
          <div className="flex xl:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-3 text-white transition-colors relative z-[110]"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X size={40} className="text-mrs-yellow" /> : <Menu size={40} />}
            </button>
          </div>
        </div>
      </div>

      {/* Menú Móvil - ULTRA COMPACTO Y SÓLIDO */}
      {isOpen && (
        <div className="xl:hidden fixed inset-0 bg-mrs-black z-[105] flex flex-col p-6 pt-24 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="py-4 text-xl font-display italic text-white hover:text-mrs-yellow border-b border-white/5 flex justify-between items-center"
              >
                {link.name.toUpperCase()}
                <span className="text-mrs-red text-sm">→</span>
              </a>
            ))}
            
            <div className="pt-6">
               <a
                    href="#game"
                    onClick={(e) => handleNavClick(e, '#game')}
                    className="flex items-center justify-center gap-3 bg-mrs-red w-full py-5 rounded text-lg font-display italic text-white uppercase shadow-2xl mb-8"
                >
                    <Gamepad2 size={24} /> Entrar al Paddock
                </a>
                
                <div className="flex justify-center gap-12 py-6 border-t border-white/10">
                   <a href={SOCIAL_LINKS.instagram} target="_blank" className="text-white/60 hover:text-white transition-colors"><Instagram size={32}/></a>
                   <a href={SOCIAL_LINKS.twitch} target="_blank" className="text-white/60 hover:text-white transition-colors"><Twitch size={32}/></a>
                </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
