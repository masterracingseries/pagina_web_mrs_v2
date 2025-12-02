
import React from 'react';
import { FileText, Download, ExternalLink } from 'lucide-react';
import { LEAGUE_RULES_URL } from '../constants';

const Rules: React.FC = () => {
  return (
    <section id="rules" className="py-20 bg-mrs-light text-mrs-black relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
            <div className="md:w-1/3 bg-mrs-black text-white p-10 flex flex-col justify-center relative overflow-hidden">
                <div className="absolute -right-10 -top-10 text-gray-800 opacity-20">
                    <FileText size={200} />
                </div>
                <h3 className="text-3xl font-display italic mb-4 relative z-10">REGLAMENTO OFICIAL</h3>
                <p className="text-gray-400 mb-8 relative z-10 text-sm">
                    La normativa es fundamental para garantizar carreras limpias y justas. Todo piloto debe leer y comprender el reglamento antes de salir a pista.
                </p>
                <div className="w-16 h-1 bg-mrs-yellow mb-2"></div>
                <div className="w-8 h-1 bg-mrs-red"></div>
            </div>

            <div className="md:w-2/3 p-10 flex flex-col justify-center items-center text-center bg-carbon bg-cover relative">
                 <div className="absolute inset-0 bg-white/95"></div>
                 <div className="relative z-10">
                     <h4 className="text-xl font-bold mb-6">Temporada 4</h4>
                     
                     {/* PDF Preview Container */}
                     <div className="border border-gray-300 rounded bg-gray-50 mb-6 max-w-lg mx-auto w-full aspect-video shadow-inner overflow-hidden relative">
                         <iframe 
                            src={LEAGUE_RULES_URL} 
                            className="w-full h-full border-none"
                            title="Reglamento Preview"
                            loading="lazy"
                         ></iframe>
                     </div>

                     <div className="flex gap-4 justify-center">
                        <a 
                            href={LEAGUE_RULES_URL.replace('/preview', '/view')} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 bg-mrs-red text-white px-6 py-3 rounded font-bold uppercase hover:bg-red-700 transition-colors shadow-lg shadow-red-500/30"
                        >
                            <Download size={18} />
                            Ver / Descargar PDF
                        </a>
                     </div>
                 </div>
            </div>
        </div>
      </div>
    </section>
  );
};

export default Rules;
