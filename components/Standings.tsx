import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DIVISIONS, TEAMS, CALENDAR } from '../constants';
import { Trophy, Shield, Loader2, AlertCircle, MapPin, Flag } from 'lucide-react';
import { GCSDivisionData, GCSDriverStanding, GCSConstructorStanding, RaceEvent } from '../types';

// BASE URL EXACTA DEL HTML PROPORCIONADO
const GCS_BASE_URL = 'https://storage.googleapis.com/mrs-standings-season3';

const Standings: React.FC = () => {
  // Map div IDs (div1, div2) to simple numbers (1, 2) for the JSON filename
  const [activeDivisionId, setActiveDivisionId] = useState(DIVISIONS[0].id);
  const [view, setView] = useState<'DRIVERS' | 'CONSTRUCTORS'>('DRIVERS');
  
  // State for Async Data
  const [data, setData] = useState<GCSDivisionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper to map Team Name String (from JSON) to Local Team Config (Colors/Logos)
  const resolveTeamStyle = (teamNameRaw: string) => {
    if (!teamNameRaw) return { color: '#333', logoUrl: '', name: 'Unknown' };
    
    const lowerName = teamNameRaw.toLowerCase();
    
    // Special case for Reserves mentioned in legacy HTML logic
    if (lowerName.includes('reserva')) {
        return { color: '#38383f', logoUrl: 'logos_f1/logo_f1_rojo.avif', name: teamNameRaw };
    }

    // Find matching team in constants based on string inclusion
    const foundTeam = TEAMS.find(t => lowerName.includes(t.name.toLowerCase()) || lowerName.includes(t.id));

    if (foundTeam) {
        return foundTeam;
    }
    
    // Manual fallbacks if TEAMS constant names don't match exactly
    if (lowerName.includes('mercedes')) return TEAMS.find(t => t.id === 'merc');
    if (lowerName.includes('red bull')) return TEAMS.find(t => t.id === 'rb');
    if (lowerName.includes('kick') || lowerName.includes('sauber')) return TEAMS.find(t => t.id === 'sauber');
    if (lowerName.includes('vcarb') || lowerName.includes('visa') || lowerName.includes('racing bull')) return TEAMS.find(t => t.id === 'rb_vcarb');
    if (lowerName.includes('haas')) return TEAMS.find(t => t.id === 'haas');

    return { color: '#333', logoUrl: '', name: teamNameRaw };
  };

  // Helper to find race details based on "ultimo_gp" string
  const findRaceDetails = (gpName: string | undefined): RaceEvent | undefined => {
      if (!gpName) return undefined;
      
      // Normalize function to remove accents and lowercase (e.g. "Japón" -> "japon")
      const normalize = (str: string) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
      const normalizedGpName = normalize(gpName);

      return CALENDAR.find(race => {
          const normCountry = normalize(race.country);
          const normTrack = normalize(race.trackName);
          // Check if the GP name contains the country or track name
          return normalizedGpName.includes(normCountry) || normalizedGpName.includes(normTrack);
      });
  };

  // --- LOGIC: FETCH DATA FROM GCS ---
  useEffect(() => {
    const fetchStandings = async () => {
        setLoading(true);
        setError(null);
        
        // Extract number from "div1" -> "1"
        const divisionNum = activeDivisionId.replace('div', '');
        const url = `${GCS_BASE_URL}/division_${divisionNum}.json?cachebust=${new Date().getTime()}`;

        try {
            console.log(`Fetching standings from: ${url}`);
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`No se pudieron cargar los datos de la División ${divisionNum}. (Status: ${response.status})`);
            }
            
            const jsonData: GCSDivisionData = await response.json();
            setData(jsonData);
        } catch (err: any) {
            console.error("Error fetching standings:", err);
            setError(err.message || "Error de conexión");
            setData(null);
        } finally {
            setLoading(false);
        }
    };

    fetchStandings();
  }, [activeDivisionId]);

  const lastRace = findRaceDetails(data?.ultimo_gp);

  return (
    <section id="standings" className="py-20 bg-gray-100 text-mrs-black relative overflow-hidden">
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
         
         <div className="text-center mb-10">
            <span className="text-mrs-red font-bold tracking-widest text-sm uppercase">Season 4 Championship</span>
            <h2 className="text-4xl md:text-6xl font-display italic text-mrs-black mb-4">STANDINGS</h2>
            <div className="w-24 h-1 bg-mrs-yellow mx-auto skew-box"></div>
         </div>

         {/* Controls */}
         <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10">
             {/* Division Selector */}
             <div className="flex flex-wrap justify-center gap-2">
                {DIVISIONS.map((div) => (
                    <button
                        key={div.id}
                        onClick={() => setActiveDivisionId(div.id)}
                        className={`px-4 py-2 text-sm font-bold uppercase rounded transition-all ${
                            activeDivisionId === div.id ? 'bg-mrs-black text-white' : 'bg-white text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        {div.name}
                    </button>
                ))}
             </div>

             {/* View Toggle */}
             <div className="bg-white p-1 rounded-lg shadow flex">
                 <button 
                    onClick={() => setView('DRIVERS')}
                    className={`flex items-center gap-2 px-6 py-2 rounded-md font-bold uppercase text-sm transition-colors ${
                        view === 'DRIVERS' ? 'bg-mrs-red text-white' : 'text-gray-500 hover:bg-gray-100'
                    }`}
                 >
                    <Trophy size={16} /> Drivers
                 </button>
                 <button 
                    onClick={() => setView('CONSTRUCTORS')}
                    className={`flex items-center gap-2 px-6 py-2 rounded-md font-bold uppercase text-sm transition-colors ${
                        view === 'CONSTRUCTORS' ? 'bg-mrs-red text-white' : 'text-gray-500 hover:bg-gray-100'
                    }`}
                 >
                    <Shield size={16} /> Constructors
                 </button>
             </div>
         </div>
         
         {/* INFO CARD: ÚLTIMO GP */}
         {data?.ultimo_gp && (
             <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border-l-4 border-mrs-red rounded-r-lg shadow-md p-4 mb-6 flex flex-col md:flex-row items-center justify-between max-w-4xl mx-auto gap-4"
             >
                <div className="text-center md:text-left">
                    <div className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1 flex items-center justify-center md:justify-start gap-1">
                        <Flag size={12} /> Actualizado al finalizar:
                    </div>
                    <h3 className="text-xl md:text-2xl font-display italic text-mrs-black uppercase">{data.ultimo_gp}</h3>
                </div>

                {lastRace && (
                    <div className="flex items-center gap-6 bg-gray-50 px-6 py-2 rounded-lg border border-gray-100">
                        <div className="flex flex-col items-center">
                            <span className="text-[10px] text-gray-400 font-bold uppercase mb-1">País</span>
                            <img src={lastRace.flagUrl} alt={lastRace.country} className="h-6 w-auto rounded shadow-sm" />
                        </div>
                        <div className="w-px h-8 bg-gray-200"></div>
                        <div className="flex flex-col items-center">
                            <span className="text-[10px] text-gray-400 font-bold uppercase mb-1">Pista</span>
                            <img src={lastRace.mapUrl} alt={lastRace.trackName} className="h-10 w-auto filter brightness-0 opacity-70" />
                        </div>
                    </div>
                )}
             </motion.div>
         )}

         {/* Content Area */}
         <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200 min-h-[400px]">
            {loading ? (
                <div className="flex flex-col items-center justify-center h-[400px] text-gray-400">
                    <Loader2 size={48} className="animate-spin mb-4 text-mrs-red" />
                    <p className="uppercase font-bold tracking-widest">Cargando Resultados...</p>
                </div>
            ) : error ? (
                <div className="flex flex-col items-center justify-center h-[400px] text-gray-400">
                    <AlertCircle size={48} className="mb-4 text-mrs-red" />
                    <p className="uppercase font-bold tracking-widest mb-2">Error al cargar datos</p>
                    <p className="text-sm">{error}</p>
                </div>
            ) : (
                <AnimatePresence mode="wait">
                    <motion.div
                        key={`${activeDivisionId}-${view}`}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-x-auto"
                    >
                        <table className="w-full text-left">
                            <thead className="bg-mrs-black text-white uppercase text-xs font-bold tracking-wider">
                                <tr>
                                    <th className="px-6 py-4 w-16 text-center">Pos</th>
                                    <th className="px-6 py-4">{view === 'DRIVERS' ? 'Piloto' : 'Equipo'}</th>
                                    {view === 'DRIVERS' && <th className="px-6 py-4 hidden sm:table-cell">Equipo</th>}
                                    <th className="px-6 py-4 text-center font-display text-lg">Puntos</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {view === 'DRIVERS' ? (
                                    data?.pilotos && data.pilotos.length > 0 ? (
                                        data.pilotos.map((driver, index) => {
                                            // JSON keys: posicion, equipo, id (name), puntos, status
                                            const style = resolveTeamStyle(driver.equipo);
                                            const displayPos = driver.posicion || index + 1;

                                            return (
                                                <tr key={`${driver.id}-${index}`} className="hover:bg-gray-50 transition-colors group">
                                                    <td className="px-6 py-4 text-center font-display text-xl italic text-gray-400 group-hover:text-mrs-red transition-colors">
                                                        {displayPos}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-1 h-8 rounded-full" style={{ backgroundColor: style.color }}></div>
                                                            <div>
                                                                <div className="font-bold text-mrs-black text-lg leading-none uppercase">{driver.id}</div>
                                                                <div className="text-xs text-gray-500 sm:hidden uppercase mt-1">{driver.equipo}</div>
                                                                {driver.status && (
                                                                    <span className="text-[10px] bg-gray-200 px-1.5 py-0.5 rounded uppercase tracking-wider mt-1 inline-block text-gray-600">
                                                                        {driver.status}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 hidden sm:table-cell text-gray-600 font-medium uppercase text-sm">
                                                        <span className="flex items-center gap-2">
                                                            {style.logoUrl && <img src={style.logoUrl} className="h-4 w-auto opacity-70" alt="" />}
                                                            {driver.equipo}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <span className="inline-block px-3 py-1 bg-gray-100 rounded font-display text-xl font-bold text-mrs-black border-l-4" style={{ borderLeftColor: style.color }}>
                                                            {driver.puntos} <span className="text-xs text-gray-400 ml-1 font-sans">PTS</span>
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr><td colSpan={4} className="text-center py-10 text-gray-500 italic">No hay datos de pilotos disponibles para esta división.</td></tr>
                                    )
                                ) : (
                                    data?.constructores && data.constructores.length > 0 ? (
                                        data.constructores.map((con, index) => {
                                            const style = resolveTeamStyle(con.equipo);
                                            const displayPos = con.posicion || index + 1;

                                            return (
                                                <tr key={`${con.equipo}-${index}`} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4 text-center font-display text-xl italic text-gray-400">
                                                        {displayPos}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-4">
                                                            {style.logoUrl ? (
                                                                <img src={style.logoUrl} alt={con.equipo} className="h-8 w-auto object-contain" />
                                                            ) : (
                                                                <div className="h-8 w-8 rounded bg-gray-200"></div>
                                                            )}
                                                            <span className="font-bold text-xl italic uppercase text-mrs-black">{con.equipo}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <div className="flex items-center justify-center gap-2">
                                                             <div className="h-2 w-2 rounded-full" style={{ backgroundColor: style.color }}></div>
                                                             <span className="font-display text-xl font-bold text-mrs-black">
                                                                {con.puntos} <span className="text-xs text-gray-400 ml-1 font-sans">PTS</span>
                                                             </span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr><td colSpan={3} className="text-center py-10 text-gray-500 italic">No hay datos de constructores disponibles para esta división.</td></tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </motion.div>
                </AnimatePresence>
            )}
         </div>
       </div>
    </section>
  );
};

export default Standings;