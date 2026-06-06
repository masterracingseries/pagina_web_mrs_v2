
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DIVISIONS, TEAMS } from '../constants';
import { useConfigContext } from '../hooks/ConfigContext';
import { Trophy, Shield, Loader2, AlertCircle, Lock, ChevronDown, ChevronUp } from 'lucide-react';
import { GCSDivisionData } from '../types';

// ⚠️ El bucket mantiene su nombre histórico pero sirve a todas las temporadas.
// Si cambia el bucket, solo hay que editar esta línea.
const GCS_BASE_URL = 'https://storage.googleapis.com/mrs-standings-season3';

const Standings: React.FC = () => {
  const { config } = useConfigContext();
  const isSeasonActive = config.liga.is_season_active;
  const seasonLabel = `S${config.liga.temporada_actual}`;
  const [activeDivisionId, setActiveDivisionId] = useState(DIVISIONS[0].id);
  const [view, setView] = useState<'DRIVERS' | 'CONSTRUCTORS'>('DRIVERS');
  const [data, setData] = useState<GCSDivisionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    setIsExpanded(false);
  }, [activeDivisionId, view]);

  useEffect(() => {
    if (!isSeasonActive) return;
    const fetchStandings = async () => {
        setLoading(true);
        setError(null);
        const url = `${GCS_BASE_URL}/division_${activeDivisionId.replace('div', '')}.json?cachebust=${Date.now()}`;
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Status: ${response.status}`);
            const jsonData = await response.json();
            setData(jsonData);
        } catch (err: any) {
            setError("No se pudieron cargar los datos.");
        } finally {
            setLoading(false);
        }
    };
    fetchStandings();
  }, [activeDivisionId]);

  if (!isSeasonActive) {
    return (
      <section id="standings" className="py-20 bg-mrs-black relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-mrs-yellow/10 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-mrs-yellow/30 to-transparent" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 rounded-full bg-mrs-yellow/10 border border-mrs-yellow/30 flex items-center justify-center">
                <Trophy size={36} className="text-mrs-yellow" />
              </div>
            </div>
            <h2 className="text-5xl md:text-7xl font-display italic uppercase text-white leading-none mb-4 tracking-tighter">
              LA HISTORIA <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-mrs-yellow to-mrs-red">
                POR ESCRIBIRSE
              </span>
            </h2>
            <div className="w-24 h-1 bg-mrs-yellow mx-auto my-8" />
            <p className="text-gray-400 text-xl md:text-2xl font-light leading-relaxed max-w-2xl mx-auto">
              La tabla de la{' '}
              <span className="text-white font-semibold">Temporada {config.liga.temporada_actual}</span>{' '}
              está en blanco. Solo los mejores pilotos grabarán su nombre en lo más alto del ranking.
            </p>
            <div className="mt-12 flex items-center justify-center gap-3 text-gray-600">
              <div className="h-px w-16 bg-gray-700" />
              <span className="text-xs font-black uppercase tracking-[0.4em]">Campeonato {seasonLabel}</span>
              <div className="h-px w-16 bg-gray-700" />
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  const resolveTeamStyle = (teamNameRaw: string) => {
    const lowerName = teamNameRaw?.toLowerCase() || "";
    const foundTeam = TEAMS.find(t => lowerName.includes(t.name.toLowerCase()) || lowerName.includes(t.id));
    return foundTeam || { color: '#38383f', logoUrl: '', name: teamNameRaw };
  };

  const displayPilotos = isExpanded ? data?.pilotos : data?.pilotos?.slice(0, 10);

  return (
    <section id="standings" className="py-12 md:py-20 bg-gray-100 text-mrs-black relative">
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
         <div className="text-center mb-12">
            <h2 className="text-4xl md:text-6xl font-display italic text-mrs-black mb-3 uppercase">Standings</h2>
            {data?.ultimo_gp && (
               <p className="text-gray-500 text-[10px] md:text-xs font-black uppercase tracking-[0.2em] mt-2">
                  Resultados actualizados hasta: <span className="text-mrs-red">{data.ultimo_gp}</span>
               </p>
            )}
         </div>

         <div className="flex flex-col gap-6 mb-8">
             <div className="flex overflow-x-auto no-scrollbar gap-2 justify-center">
                {DIVISIONS.map((div) => (
                    <button key={div.id} onClick={() => setActiveDivisionId(div.id)} className={`px-6 py-2 text-xs font-bold uppercase rounded-full transition-all ${activeDivisionId === div.id ? 'bg-mrs-black text-white' : 'bg-white text-gray-500 hover:bg-gray-200'}`}>
                        {div.name}
                    </button>
                ))}
             </div>
             <div className="bg-white p-1 rounded-xl shadow-md flex w-fit mx-auto">
                 <button onClick={() => setView('DRIVERS')} className={`flex items-center gap-2 px-8 py-3 rounded-lg font-bold uppercase text-xs transition-all ${view === 'DRIVERS' ? 'bg-mrs-red text-white' : 'text-gray-400'}`}>
                    <Trophy size={14} /> Pilotos
                 </button>
                 <button onClick={() => setView('CONSTRUCTORS')} className={`flex items-center gap-2 px-8 py-3 rounded-lg font-bold uppercase text-xs transition-all ${view === 'CONSTRUCTORS' ? 'bg-mrs-red text-white' : 'text-gray-400'}`}>
                    <Shield size={14} /> Equipos
                 </button>
             </div>
         </div>
         
         <div className="bg-white rounded-2xl shadow-2xl overflow-hidden min-h-[450px]">
            {loading ? (
                <div className="flex flex-col items-center justify-center h-[450px]">
                    <Loader2 size={40} className="animate-spin text-mrs-red" />
                </div>
            ) : error ? (
                <div className="flex flex-col items-center justify-center h-[450px] p-6 text-center text-gray-400">
                    <AlertCircle size={40} className="mb-4" />
                    <p>{error}</p>
                </div>
            ) : (
                <div className="w-full">
                    <table className="w-full text-left">
                        <thead className="bg-mrs-black text-white uppercase text-[10px] font-bold">
                            <tr>
                                <th className="px-6 py-4 w-12 text-center">P</th>
                                <th className="px-6 py-4">Piloto / Equipo</th>
                                {view === 'DRIVERS' && <th className="px-6 py-4 hidden sm:table-cell">Escudería</th>}
                                <th className="px-6 py-4 w-16 text-center">Pts</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {view === 'DRIVERS' ? (
                                displayPilotos?.map((driver, index) => {
                                    const style = resolveTeamStyle(driver.equipo);
                                    return (
                                        <tr key={index} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 text-center font-display text-xl italic text-gray-400">
                                                {driver.posicion || index + 1}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-1.5 h-6" style={{ backgroundColor: style.color }}></div>
                                                    <div className="font-bold text-mrs-black text-sm uppercase">{driver.id}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 hidden sm:table-cell text-gray-500 text-xs font-bold uppercase">{driver.equipo}</td>
                                            <td className="px-6 py-4 text-center font-display text-xl font-bold text-mrs-black">{driver.puntos}</td>
                                        </tr>
                                    );
                                })
                            ) : (
                                data?.constructores?.map((con, index) => (
                                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-center font-display text-xl italic text-gray-400">{con.posicion || index + 1}</td>
                                        <td className="px-6 py-4 font-bold text-sm uppercase text-mrs-black">{con.equipo}</td>
                                        <td className="px-6 py-4 text-center font-display text-xl font-bold text-mrs-black">{con.puntos}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                    {view === 'DRIVERS' && data?.pilotos && data.pilotos.length > 10 && (
                        <div className="p-4 border-t border-gray-100 flex justify-center">
                            <button 
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="flex items-center gap-2 px-6 py-2 text-xs font-black uppercase tracking-widest text-mrs-red hover:text-mrs-black transition-colors"
                            >
                                {isExpanded ? (
                                    <>Ver menos <ChevronUp size={14} /></>
                                ) : (
                                    <>Ver más pilotos <ChevronDown size={14} /></>
                                )}
                            </button>
                        </div>
                    )}
                </div>
            )}
         </div>
       </div>
    </section>
  );
};

export default Standings;
