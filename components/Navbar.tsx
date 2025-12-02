
import React, { useState, useEffect } from 'react';
import { Menu, X, Gamepad2, Bot } from 'lucide-react';

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
    e.preventDefault(); // Evita que cambie la URL y falle en el preview
    setIsOpen(false);
    
    // Remove # if present
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
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-mrs-black/90 backdrop-blur-md border-b-2 border-mrs-red py-2' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex-shrink-0 flex items-center gap-2">
            {/* LOGO: public/images/logos/logo.png */}
            <div className="w-10 h-10 overflow-hidden flex items-center justify-center">
               <img 
                 src="images/logos/logo.png" 
                 alt="MRS Logo" 
                 className="w-full h-full object-contain"
                 onError={(e) => {
                   // Fallback visual si no existe la imagen
                   e.currentTarget.style.display = 'none';
                   e.currentTarget.nextElementSibling?.classList.remove('hidden');
                 }}
               />
               {/* Fallback por si no hay imagen */}
               <div className="hidden w-10 h-10 bg-mrs-yellow skew-box flex items-center justify-center border-2 border-white">
                 <span className="unskew-text font-display text-mrs-black text-xl">M</span>
               </div>
            </div>
            <span className="font-display text-2xl tracking-wider text-white italic">
              MRS <span className="text-mrs-yellow">RACING</span>
            </span>
          </div>
          
          <div className="hidden lg:block">
            <div className="ml-10 flex items-baseline space-x-6">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="relative group px-2 py-2 text-sm font-bold uppercase tracking-widest text-white hover:text-mrs-yellow transition-colors cursor-pointer"
                >
                  {link.name}
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-mrs-yellow transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
                </a>
              ))}
               <a
                  href="#game"
                  onClick={(e) => handleNavClick(e, '#game')}
                  className="flex items-center gap-2 bg-mrs-red px-4 py-2 text-sm font-bold uppercase tracking-widest text-white hover:bg-white hover:text-mrs-red transition-colors rounded skew-box cursor-pointer"
                >
                   <Gamepad2 size={16} className="unskew-text" />
                   <span className="unskew-text">Paddock</span>
                </a>
            </div>
          </div>

          <div className="-mr-2 flex lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-mrs-black border-t border-mrs-gray">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-mrs-yellow hover:bg-gray-900 cursor-pointer"
              >
                {link.name}
              </a>
            ))}
             <a
                href="#game"
                onClick={(e) => handleNavClick(e, '#game')}
                className="flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-mrs-red hover:text-white cursor-pointer"
              >
                <Gamepad2 size={18} /> MRS Paddock
              </a>
              <a
                href="#ai-engineer"
                onClick={(e) => handleNavClick(e, '#ai-engineer')}
                className="flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-mrs-yellow hover:text-white cursor-pointer"
              >
                <Bot size={18} /> Ingeniero IA
              </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
