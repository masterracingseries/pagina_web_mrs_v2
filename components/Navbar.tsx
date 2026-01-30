
import React, { useState, useEffect } from 'react';
import { Menu, X, Gamepad2, Instagram, Twitch } from 'lucide-react';
import { LOGO_URL, SOCIAL_LINKS } from '../constants';
import SafeImage from './SafeImage';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    setIsOpen(false);
    const id = targetId.replace('#', '');
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
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
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-mrs-black py-2 shadow-2xl border-b border-white/5' : 'bg-[#0a0a0a]/90 backdrop-blur-sm py-4 md:py-6'}`}>
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          
          {/* LOGO MÁS PROTAGONISTA - Sin resplandor y más grande */}
          <div 
            className="flex-shrink-0 flex items-center gap-4 group cursor-pointer relative" 
            onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
          >
            <div className={`relative transition-all duration-500 ${scrolled ? 'w-16 h-16 sm:w-20 sm:h-20' : 'w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40'}`}>
               <SafeImage 
                 src={LOGO_URL} 
                 alt="Master Racing Series" 
                 className="w-full h-full object-contain relative z-10 transition-transform duration-500 group-hover:scale-105"
                 fallbackIcon={
                   <div className="w-full h-full bg-mrs-red rounded flex items-center justify-center font-display text-white text-3xl skew-box">
                      <span className="unskew-text">M</span>
                   </div>
                 }
               />
            </div>

            <div className="flex flex-col">
                <h1 className={`font-display tracking-tighter text-white italic leading-none uppercase transition-all duration-500 ${scrolled ? 'text-lg md:text-xl' : 'text-xl md:text-2xl lg:text-3xl'}`}>
                  MASTER <span className="text-mrs-yellow">RACING</span> SERIES
                </h1>
                <span className="text-[7px] md:text-[9px] font-black uppercase tracking-[0.3em] text-mrs-red mt-1">Official SimRacing League</span>
            </div>
          </div>
          
          {/* Navegación Desktop */}
          <div className="hidden lg:block">
            <div className="flex items-center space-x-2 xl:space-x-5">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="relative group px-1 py-2 text-[10px] xl:text-[11px] font-black uppercase tracking-widest text-white/70 hover:text-white transition-colors"
                >
                  {link.name}
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-mrs-red transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 shadow-[0_0_5px_rgba(225,6,0,1)]"></span>
                </a>
              ))}
               <a
                  href="#game"
                  onClick={(e) => handleNavClick(e, '#game')}
                  className="ml-4 flex items-center gap-2 bg-mrs-red px-5 py-2 text-[11px] font-black uppercase tracking-widest text-white hover:bg-white hover:text-mrs-red transition-all rounded skew-box shadow-lg active:scale-95 border-r-2 border-white/20"
                >
                   <Gamepad2 size={14} className="unskew-text" />
                   <span className="unskew-text">Paddock</span>
                </a>
            </div>
          </div>

          {/* Botón Menú Móvil */}
          <div className="flex lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 text-white hover:text-mrs-yellow transition-colors relative z-50"
            >
              {isOpen ? <X size={36} /> : <Menu size={36} />}
            </button>
          </div>
        </div>
      </div>

      {/* Menú Móvil - Compacto y Legible */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 bg-[#0a0a0a] z-40 flex flex-col pt-24 overflow-y-auto">
          <div className="px-10 space-y-1 pb-10">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="block py-3 text-xl font-display italic text-white hover:text-mrs-yellow border-b border-white/5 transition-all flex justify-between items-center group"
              >
                {link.name.toUpperCase()}
                <span className="text-mrs-red opacity-50 group-hover:opacity-100 transition-opacity">→</span>
              </a>
            ))}
            
            <div className="pt-6 flex flex-col gap-3">
               <a
                    href="#game"
                    onClick={(e) => handleNavClick(e, '#game')}
                    className="flex items-center justify-center gap-3 bg-mrs-red w-full py-4 rounded-lg text-lg font-display italic text-white uppercase shadow-xl"
                >
                    <Gamepad2 size={20} /> Entrar al Paddock
                </a>
                
                <div className="flex justify-center gap-8 mt-4 py-4 border-t border-white/5">
                   <a href={SOCIAL_LINKS.instagram} target="_blank" className="text-white hover:text-mrs-red transition-colors"><Instagram size={28}/></a>
                   <a href={SOCIAL_LINKS.twitch} target="_blank" className="text-white hover:text-purple-500 transition-colors"><Twitch size={28}/></a>
                </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
