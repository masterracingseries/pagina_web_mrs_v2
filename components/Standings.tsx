
import React, { useState, useEffect } from 'react';
import { DIVISIONS, TEAMS, IS_SEASON_ACTIVE } from '../constants';
import { Trophy, Shield, Loader2, AlertCircle, Lock } from 'lucide-react';
import { GCSDivisionData } from '../types';

const GCS_BASE_URL = 'https://storage.googleapis.com/mrs-standings-season3';

const Standings: React.FC = () => {
  const [activeDivisionId, setActiveDivisionId] = useState(DIVISIONS[0].id);
  const [view, setView] = useState<'DRIVERS' | 'CONSTRUCTORS'>('DRIVERS');
  const [data, setData] = useState<GCSDivisionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded] = useState(false);

  useEffect(() => {
    if (!IS_SEASON_ACTIVE) return;
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

  if (!IS_SEASON_ACTIVE) {
    return (
      <section id="standings" className="py-20 bg-gray-100 text-mrs-black relative overflow-hidden">
        <div className="absolute inset-0 bg-checkered opacity-[0.03]"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <span className="text-mrs-red font-bold tracking-widest text-sm uppercase">Campeonato S5</span>
            <h2 className="text-4xl md:text-6xl font-display italic text-mrs-black mb-3 uppercase tracking-tighter">STANDINGS</h2>
          </div>
          
          <div className="bg-white rounded-[2.5rem] shadow-2xl p-12 md:p-20 flex flex-col items-center text-center border-b-8 border-mrs-yellow">
              <div className="w-24 h-24 bg-gray-100 rounded-3xl flex items-center justify-center text-gray-300 mb-8 border-2 border-dashed border-gray-200">
                  <Lock size={48} />
              </div>
              <h3 className="text-3xl md:text-5xl font-display italic mb-6">HISTORIA POR ESCRIBIRSE</h3>
              <p className="text-gray-500 text-lg md:text-xl max-w-2xl font-medium leading-relaxed mb-8">
                La tabla de puntuación de la <span className="text-mrs-red font-black">TEMPORADA 5</span> está vacía. Solo los mejores pilotos lograrán grabar su nombre en lo más alto del ranking.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-3xl">
                 {[1,2,3,4].map(i => (
                    <div key={i} className="h-16 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center font-display italic text-gray-200 text-2xl">P{i}</div>
                 ))}
              </div>
          </div>
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
                </div>
            )}
         </div>
       </div>
    </section>
  );
};

export default Standings;
