
import React, { useState, useEffect } from 'react';
import { Menu, X, Gamepad2, Instagram, Twitch } from 'lucide-react';
import { LOGO_URL, SOCIAL_LINKS } from '../constants';
import SafeImage from './SafeImage';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
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
    <nav className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? 'bg-mrs-black/98 border-b border-mrs-red/50 py-2 shadow-2xl' : 'bg-transparent py-4 md:py-8'}`}>
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          
          {/* LOGO PROTAGONISTA - Estilo F1 Official */}
          <div 
            className="flex-shrink-0 flex items-center gap-3 md:gap-5 group cursor-pointer relative" 
            onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
          >
            <div className={`relative transition-all duration-500 ${scrolled ? 'w-14 h-14 sm:w-16 sm:h-16' : 'w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28'}`}>
               {/* Resplandor decorativo detrás del logo */}
               <div className="absolute inset-0 bg-mrs-red/20 rounded-full blur-2xl group-hover:bg-mrs-red/40 transition-all duration-700"></div>
               
               <SafeImage 
                 src={LOGO_URL} 
                 alt="Master Racing Series" 
                 className="w-full h-full object-contain relative z-10 drop-shadow-[0_5px_15px_rgba(225,6,0,0.4)] group-hover:scale-110 transition-transform duration-500"
                 fallbackIcon={
                   <div className="w-full h-full bg-mrs-red rounded flex items-center justify-center font-display text-white text-3xl skew-box">
                      <span className="unskew-text">M</span>
                   </div>
                 }
               />
            </div>

            <div className="flex flex-col">
                <h1 className={`font-display tracking-tighter text-white italic leading-none uppercase transition-all duration-500 ${scrolled ? 'text-lg md:text-xl' : 'text-xl md:text-3xl'}`}>
                  MASTER <span className="text-mrs-yellow">RACING</span> SERIES
                </h1>
                <span className="text-[7px] md:text-[10px] font-black uppercase tracking-[0.3em] text-mrs-red mt-1">Official SimRacing League</span>
            </div>
          </div>
          
          {/* Navegación Desktop */}
          <div className="hidden lg:block">
            <div className="ml-6 flex items-center space-x-4 xl:space-x-6">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="relative group px-1 py-2 text-[10px] xl:text-xs font-black uppercase tracking-widest text-white/70 hover:text-white transition-colors"
                >
                  {link.name}
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-mrs-red transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
                </a>
              ))}
               <a
                  href="#game"
                  onClick={(e) => handleNavClick(e, '#game')}
                  className="ml-4 flex items-center gap-2 bg-mrs-red px-6 py-2.5 text-xs font-black uppercase tracking-widest text-white hover:bg-white hover:text-mrs-red transition-all rounded skew-box shadow-lg shadow-mrs-red/20 active:scale-95 border-r-2 border-white/30"
                >
                   <Gamepad2 size={16} className="unskew-text" />
                   <span className="unskew-text">Paddock</span>
                </a>
            </div>
          </div>

          {/* Botón Menú Móvil */}
          <div className="flex lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-mrs-yellow transition-colors relative z-50"
            >
              {isOpen ? <X size={32} /> : <Menu size={32} />}
            </button>
          </div>
        </div>
      </div>

      {/* Menú Móvil - FONDO SÓLIDO PARA MÁXIMA LEGIBILIDAD */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 bg-[#0a0a0a] z-40 pt-24 overflow-y-auto">
          <div className="px-8 space-y-2 pb-20">
            {navLinks.map((link, idx) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="block py-5 text-4xl font-display italic text-white hover:text-mrs-yellow border-b border-white/5 transition-all flex justify-between items-center group"
              >
                {link.name.toUpperCase()}
                <span className="text-mrs-red opacity-0 group-hover:opacity-100 transition-opacity">→</span>
              </a>
            ))}
            
            <div className="pt-10 flex flex-col gap-4">
               <a
                    href="#game"
                    onClick={(e) => handleNavClick(e, '#game')}
                    className="flex items-center justify-center gap-3 bg-mrs-red w-full py-6 rounded-xl text-2xl font-display italic text-white uppercase shadow-2xl"
                >
                    <Gamepad2 size={24} /> Entrar al Paddock
                </a>
                
                <div className="flex justify-center gap-6 mt-6">
                   <a href={SOCIAL_LINKS.instagram} className="text-white hover:text-mrs-red"><Instagram size={30}/></a>
                   <a href={SOCIAL_LINKS.twitch} className="text-white hover:text-purple-500"><Twitch size={30}/></a>
                </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
