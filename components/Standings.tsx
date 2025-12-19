
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DIVISIONS, TEAMS, CALENDAR } from '../constants';
import { Trophy, Shield, Loader2, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { GCSDivisionData, RaceEvent } from '../types';

const GCS_BASE_URL = 'https://storage.googleapis.com/mrs-standings-season3';

const Standings: React.FC = () => {
  const [activeDivisionId, setActiveDivisionId] = useState(DIVISIONS[0].id);
  const [view, setView] = useState<'DRIVERS' | 'CONSTRUCTORS'>('DRIVERS');
  const [data, setData] = useState<GCSDivisionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const resolveTeamStyle = (teamNameRaw: string) => {
    if (!teamNameRaw) return { color: '#333', logoUrl: '', name: 'Unknown' };
    const lowerName = teamNameRaw.toLowerCase();
    const foundTeam = TEAMS.find(t => lowerName.includes(t.name.toLowerCase()) || lowerName.includes(t.id));
    if (foundTeam) return foundTeam;
    return { color: '#38383f', logoUrl: 'logos_f1/logo_f1_rojo.avif', name: teamNameRaw };
  };

  useEffect(() => {
    const fetchStandings = async () => {
        setLoading(true);
        setError(null);
        setIsExpanded(false); 
        const divisionNum = activeDivisionId.replace('div', '');
        const url = `${GCS_BASE_URL}/division_${divisionNum}.json?cachebust=${Date.now()}`;

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Status: ${response.status}`);
            const jsonData: GCSDivisionData = await response.json();
            setData(jsonData);
        } catch (err: any) {
            setError("No se pudieron cargar los datos.");
            setData(null);
        } finally {
            setLoading(false);
        }
    };
    fetchStandings();
  }, [activeDivisionId]);

  const displayPilotos = isExpanded ? data?.pilotos : data?.pilotos?.slice(0, 10);
  const hasMore = (data?.pilotos?.length || 0) > 10;

  return (
    <section id="standings" className="py-12 md:py-20 bg-gray-100 text-mrs-black relative overflow-hidden">
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
         <div className="text-center mb-12">
            <span className="text-mrs-red font-bold tracking-widest text-sm uppercase">Campeonato S4</span>
            <h2 className="text-4xl md:text-6xl font-display italic text-mrs-black mb-3 uppercase">Standings</h2>
            <div className="w-24 h-1 bg-mrs-yellow mx-auto skew-box"></div>
         </div>

         <div className="flex flex-col gap-6 mb-8">
             <div className="flex overflow-x-auto no-scrollbar gap-2 justify-center">
                {DIVISIONS.map((div) => (
                    <button key={div.id} onClick={() => setActiveDivisionId(div.id)} className={`px-6 py-2 text-xs md:text-sm font-bold uppercase rounded-full transition-all shadow-sm ${activeDivisionId === div.id ? 'bg-mrs-black text-white' : 'bg-white text-gray-500 hover:bg-gray-200'}`}>
                        {div.name}
                    </button>
                ))}
             </div>

             <div className="bg-white p-1 rounded-xl shadow-md flex w-fit mx-auto">
                 <button onClick={() => setView('DRIVERS')} className={`flex items-center gap-2 px-8 py-3 rounded-lg font-bold uppercase text-xs transition-all ${view === 'DRIVERS' ? 'bg-mrs-red text-white shadow-lg shadow-mrs-red/20' : 'text-gray-400'}`}>
                    <Trophy size={14} /> Pilotos
                 </button>
                 <button onClick={() => setView('CONSTRUCTORS')} className={`flex items-center gap-2 px-8 py-3 rounded-lg font-bold uppercase text-xs transition-all ${view === 'CONSTRUCTORS' ? 'bg-mrs-red text-white shadow-lg shadow-mrs-red/20' : 'text-gray-400'}`}>
                    <Shield size={14} /> Equipos
                 </button>
             </div>
         </div>
         
         <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200 min-h-[450px]">
            {loading ? (
                <div className="flex flex-col items-center justify-center h-[450px]">
                    <Loader2 size={40} className="animate-spin text-mrs-red mb-4" />
                    <p className="text-[10px] uppercase font-black tracking-tighter text-gray-400">Sincronizando Telemetría...</p>
                </div>
            ) : error ? (
                <div className="flex flex-col items-center justify-center h-[450px] p-6 text-center">
                    <AlertCircle size={40} className="text-mrs-red mb-4" />
                    <p className="font-bold text-gray-400 uppercase text-xs">{error}</p>
                </div>
            ) : (
                <div className="w-full">
                    <table className="w-full text-left">
                        <thead className="bg-mrs-black text-white uppercase text-[10px] md:text-xs font-bold tracking-wider">
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
                                        <tr key={driver.id} className="hover:bg-gray-50 transition-colors group">
                                            <td className="px-6 py-4 text-center font-display text-xl italic text-gray-400 group-hover:text-mrs-red">
                                                {driver.posicion || index + 1}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-1.5 h-6 rounded-full" style={{ backgroundColor: style.color }}></div>
                                                    <div className="font-bold text-mrs-black text-sm md:text-base uppercase">{driver.id}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 hidden sm:table-cell text-gray-500 font-bold uppercase text-xs">
                                                {driver.equipo}
                                            </td>
                                            <td className="px-6 py-4 text-center font-display text-xl font-bold text-mrs-black">
                                                {driver.puntos}
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                data?.constructores?.map((con, index) => {
                                    const style = resolveTeamStyle(con.equipo);
                                    return (
                                        <tr key={con.equipo} className="hover:bg-gray-50 transition-colors group">
                                            <td className="px-6 py-4 text-center font-display text-xl italic text-gray-400 group-hover:text-mrs-red">
                                                {con.posicion || index + 1}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    {style.logoUrl && <img src={style.logoUrl} className="h-6 w-auto object-contain" alt="" />}
                                                    <span className="font-bold text-sm md:text-base uppercase text-mrs-black">{con.equipo}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center font-display text-xl font-bold text-mrs-black">
                                                {con.puntos}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>

                    {view === 'DRIVERS' && hasMore && (
                        <div className="p-4 bg-gray-50 flex justify-center border-t border-gray-100">
                            <button onClick={() => setIsExpanded(!isExpanded)} className="flex items-center gap-2 bg-mrs-black text-white px-8 py-2 rounded-full font-bold uppercase text-[10px] tracking-widest hover:bg-mrs-red transition-all shadow-lg active:scale-95">
                                {isExpanded ? <>Ocultar <ChevronUp size={14} /></> : <>Ver Parrilla Completa <ChevronDown size={14} /></>}
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
