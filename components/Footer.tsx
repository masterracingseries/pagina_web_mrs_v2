import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0 text-center md:text-left">
                <span className="font-display text-2xl tracking-wider text-white italic block">
                MASTER <span className="text-mrs-yellow">RACING SERIES</span> 
                </span>
                <p className="text-gray-500 text-sm mt-2">© 2026 Master Racing Series. All rights reserved.</p>
            </div>
            
            <div className="flex flex-col items-center md:items-end">
                <p className="text-gray-600 text-xs max-w-md text-center md:text-right mb-4">
                    Este sitio web no está asociado oficialmente con el grupo de empresas de Fórmula 1. 
                    F1, FORMULA ONE, FORMULA 1, FIA FORMULA ONE WORLD CHAMPIONSHIP, GRAND PRIX y marcas relacionadas son marcas comerciales de Formula One Licensing B.V.
                </p>
                <div className="text-gray-500 text-xs">
                    Designed for RLS_IRONHUNTER @gastonalexis9 on instagram.
                </div>
            </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
