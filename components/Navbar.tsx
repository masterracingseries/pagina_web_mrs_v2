
import React, { useState, useEffect } from 'react';
import { Menu, X, Gamepad2 } from 'lucide-react';
import { LOGO_URL } from '../constants';
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
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-mrs-black/95 backdrop-blur-md border-b border-mrs-red/30 py-1 md:py-2 shadow-2xl' : 'bg-transparent py-4 md:py-6'}`}>
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex-shrink-0 flex items-center gap-2 md:gap-4 group cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            
            {/* Logo responsivo según la imagen */}
            <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 relative flex items-center justify-center transition-all duration-300">
               <SafeImage 
                 src={LOGO_URL} 
                 alt="Master Racing Series" 
                 className="max-w-full max-h-full object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]"
                 fallbackIcon={
                   <div className="w-full h-full bg-mrs-yellow rounded flex items-center justify-center font-display text-mrs-black text-xl md:text-3xl skew-box">
                      <span className="unskew-text">M</span>
                   </div>
                 }
               />
            </div>

            <div className="flex flex-col">
                <span className="font-display text-base sm:text-xl md:text-2xl lg:text-3xl tracking-tighter text-white italic leading-none uppercase">
                  MASTER <span className="text-mrs-yellow">RACING</span> SERIES
                </span>
                <span className="text-[6px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.4em] text-mrs-red mt-0.5">Official League</span>
            </div>
          </div>
          
          {/* Navegación Desktop */}
          <div className="hidden lg:block">
            <div className="ml-6 flex items-baseline space-x-4 xl:space-x-6">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="relative group px-1 py-2 text-[10px] xl:text-xs font-black uppercase tracking-widest text-white/80 hover:text-white transition-colors"
                >
                  {link.name}
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-mrs-red transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
                </a>
              ))}
               <a
                  href="#game"
                  onClick={(e) => handleNavClick(e, '#game')}
                  className="flex items-center gap-2 bg-mrs-red px-5 py-2 text-xs font-black uppercase tracking-widest text-white hover:bg-white hover:text-mrs-red transition-all rounded skew-box shadow-lg shadow-mrs-red/20 active:scale-95"
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
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-mrs-yellow transition-colors"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Menú Móvil */}
      {isOpen && (
        <div className="lg:hidden bg-mrs-black/98 backdrop-blur-xl border-t border-gray-800 h-screen fixed inset-x-0 top-[60px] md:top-[80px]">
          <div className="px-6 py-12 space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="block py-4 text-3xl font-display italic text-white hover:text-mrs-yellow border-b border-white/5 transition-all"
              >
                {link.name}
              </a>
            ))}
             <div className="pt-8">
                <a
                    href="#game"
                    onClick={(e) => handleNavClick(e, '#game')}
                    className="flex items-center justify-center gap-3 bg-mrs-red w-full py-5 rounded-xl text-xl font-display italic text-white uppercase"
                >
                    <Gamepad2 size={24} /> Entrar al Paddock
                </a>
             </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
