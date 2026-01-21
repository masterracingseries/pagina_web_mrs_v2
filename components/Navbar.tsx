
import React, { useState, useEffect } from 'react';
import { Menu, X, Gamepad2 } from 'lucide-react';
import { LOGO_URL } from '../constants';

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
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-mrs-black/95 backdrop-blur-md border-b border-mrs-red/30 py-2 shadow-2xl' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex-shrink-0 flex items-center gap-3 group cursor-pointer" onClick={(e) => window.scrollTo({top: 0, behavior: 'smooth'})}>
            {/* LOGO OFICIAL MRS */}
            <div className="w-12 h-12 relative">
               <img 
                 src={LOGO_URL} 
                 alt="Master Racing Series" 
                 className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110 drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]"
                 onError={(e) => {
                   // Fallback visual silencioso: si falla, solo muestra texto para no romper la estética
                   e.currentTarget.style.display = 'none';
                 }}
               />
            </div>
            <div className="flex flex-col">
                <span className="font-display text-2xl tracking-tighter text-white italic leading-none">
                MRS <span className="text-mrs-yellow">RACING</span>
                </span>
                <span className="text-[8px] font-black uppercase tracking-[0.4em] text-mrs-red">Official League</span>
            </div>
          </div>
          
          <div className="hidden lg:block">
            <div className="ml-10 flex items-baseline space-x-6">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="relative group px-2 py-2 text-xs font-black uppercase tracking-widest text-white/80 hover:text-white transition-colors cursor-pointer"
                >
                  {link.name}
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-mrs-red transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 shadow-[0_0_8px_#E10600]"></span>
                </a>
              ))}
               <a
                  href="#game"
                  onClick={(e) => handleNavClick(e, '#game')}
                  className="flex items-center gap-2 bg-mrs-red px-5 py-2 text-xs font-black uppercase tracking-widest text-white hover:bg-white hover:text-mrs-red transition-all rounded skew-box cursor-pointer shadow-lg shadow-mrs-red/20 active:scale-95"
                >
                   <Gamepad2 size={14} className="unskew-text" />
                   <span className="unskew-text">Paddock</span>
                </a>
            </div>
          </div>

          <div className="-mr-2 flex lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white focus:outline-none transition-colors"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-mrs-black/98 backdrop-blur-xl border-t border-gray-800 h-screen overflow-y-auto">
          <div className="px-4 pt-8 pb-32 space-y-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="block px-4 py-4 rounded-xl text-2xl font-display italic text-white hover:text-mrs-yellow hover:bg-white/5 transition-all"
              >
                {link.name}
              </a>
            ))}
             <div className="pt-6 mt-6 border-t border-gray-800">
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
