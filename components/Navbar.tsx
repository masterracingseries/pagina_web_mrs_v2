import React, { useState } from 'react';
import { Menu, X, FilePen } from 'lucide-react';
import { LOGO_URL, CURRENT_SEASON_LABEL } from '../constants';
import { useConfigContext } from '../hooks/ConfigContext';
import SafeImage from './SafeImage';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen]   = useState(false);
  const { config }            = useConfigContext();
  const logoUrl               = config.liga.logo_url || LOGO_URL;
  const seasonLabel           = `S${config.liga.temporada_actual}` || CURRENT_SEASON_LABEL;
  const isSeasonActive        = config.liga.is_season_active;
  const showRegistration      = config.liga.show_registration;
  const registrationUrl       = config.liga.registration_url;

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    setIsOpen(false);
    const id      = targetId.replace('#', '');
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top      : element.getBoundingClientRect().top + window.scrollY - 90,
        behavior : 'smooth',
      });
    }
  };

  // Calendario y Resultados siempre visibles — muestran panel offseason si temporada inactiva
  const navLinks = [
    { name: 'Calendario', href: '#calendar' },
    { name: 'Resultados',   href: '#standings'  },
    { name: 'Paddock Zone', href: '#minigame'   },
    { name: 'Media',        href: '#media'      },
    { name: 'Reglamento',   href: '#rules'      },
    { name: 'Denuncias',    href: '#stewards'   },
    { name: 'Campeones',    href: '#champions'  },
    { name: 'Nosotros',     href: '#about'      },
  ];

  return (
    <nav className="fixed w-full z-[100] bg-mrs-black border-t-4 border-mrs-red shadow-2xl">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8">
        <div className="flex justify-between items-center h-20 md:h-24">

          {/* Logo + título */}
          <div
            className="flex items-center gap-4 md:gap-8 group cursor-pointer h-full"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="w-16 h-16 md:w-24 md:h-24 flex items-center justify-center py-2 transition-transform duration-300 group-hover:scale-105">
              <SafeImage src={logoUrl} alt="MRS" className="max-w-full max-h-full object-contain" />
            </div>
            <div className="flex flex-col border-l border-white/10 pl-4 md:pl-8">
              <h1 className="font-display text-lg sm:text-2xl md:text-3xl tracking-tighter text-white italic leading-none uppercase">
                MASTER <span className="text-mrs-yellow">RACING</span> SERIES
              </h1>
              <span className="text-[7px] md:text-[9px] font-black uppercase tracking-[0.4em] text-mrs-red mt-1">
                Season {seasonLabel}
              </span>
            </div>
          </div>

          {/* Links desktop */}
          <div className="hidden xl:block h-full">
            <div className="flex items-center h-full space-x-6">
              {navLinks.map(link => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={e => handleNavClick(e, link.href)}
                  className="px-2 py-4 text-[10px] xl:text-[11px] font-black uppercase tracking-widest text-white/70 hover:text-white transition-all"
                >
                  {link.name}
                </a>
              ))}

            </div>
              {showRegistration && (
              <a
                href={registrationUrl}
                target="_blank"
                rel="noreferrer"
                className="ml-6 flex items-center gap-2 bg-mrs-red px-6 py-2.5 text-[11px] font-black uppercase tracking-widest text-white hover:bg-white hover:text-mrs-red transition-all rounded shadow-xl border-b-4 border-black/20"
              >
                <FilePen size={16} />
                <span>Inscribirse {seasonLabel}</span>
              </a>
              )}
          </div>

          {/* Botón hamburguesa móvil */}
          <div className="flex xl:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="p-3 text-white transition-colors relative z-[110]">
              {isOpen ? <X size={40} className="text-mrs-yellow" /> : <Menu size={40} />}
            </button>
          </div>
        </div>
      </div>

      {/* Menú móvil */}
      {isOpen && (
        <div className="xl:hidden fixed inset-0 bg-mrs-black z-[105] flex flex-col p-6 pt-24 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex flex-col space-y-1">
            {navLinks.map(link => (
              <a
                key={link.name}
                href={link.href}
                onClick={e => handleNavClick(e, link.href)}
                className="py-4 text-xl font-display italic text-white border-b border-white/5 flex justify-between items-center uppercase"
              >
                {link.name} <span className="text-mrs-red">→</span>
              </a>
            ))}

            {showRegistration && (
              <a
                href={registrationUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-8 flex items-center justify-center gap-3 bg-mrs-red w-full py-5 rounded text-lg font-display italic text-white uppercase"
              >
                <FilePen size={24} /> Inscribirse Season {seasonLabel}
              </a>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
