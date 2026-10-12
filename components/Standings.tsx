
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DIVISIONS, TEAMS } from '../constants';
import { useConfigContext } from '../hooks/ConfigContext';
import { Trophy, Shield, Loader2, AlertCircle, ChevronDown, ChevronUp, Flag, Zap, Timer, ClipboardList } from 'lucide-react';
import { GCSDivisionData } from '../types';

const GCS_BASE_URL = 'https://storage.googleapis.com/mrs-standings-season3';
const RESULTS_URL  = `${GCS_BASE_URL}/resultados_preliminares.json`;

// ── Tipos para resultados preliminares ──

interface ResultadoPiloto {
  pos: number;
  piloto: string;
  equipo: string;
  salida: number | null;
  mejor_tiempo: string;
  tiempo_final: string;
  puntos: number;
  paradas: number | null;
}

interface Carrera {
  gran_premio: string;
  division: string;
  tipo: string;
  fecha: string;
  timestamp_registro: string;
  resultados: ResultadoPiloto[];
}

interface PreliminaryData {
  _generado_en: string;
  carreras: Carrera[];
}

// ── Colores de equipo ──

const TEAM_COLORS: Record<string, string> = {
  'Red Bull':      '#3671C6', 'Ferrari':      '#E8002D', 'Mercedes':     '#27F4D2',
  'Mercedes-AMG':  '#27F4D2', 'McLaren':      '#FF8000', 'Aston Martin': '#229971',
  'Alpine':        '#FF87BC', 'Williams':     '#64C4FF', 'RB':           '#6692FF',
  'RB F1 Team':    '#6692FF', 'Haas':         '#B6BABD', 'Audi':         '#E00600',
  'Audi F1 Team':  '#E00600', 'Cadillac':     '#1F1F27', 'Cadillac F1 Team': '#1F1F27',
};

function getTeamColor(equipo: string): string {
  for (const [key, color] of Object.entries(TEAM_COLORS)) {
    if (equipo.toLowerCase().includes(key.toLowerCase())) return color;
  }
  return '#6B7280';
}

// ── Componente principal ──

const Standings: React.FC = () => {
  const { config } = useConfigContext();
  const isSeasonActive = config.liga.is_season_active;
  const seasonLabel = `S${config.liga.temporada_actual}`;

  // Standings state
  const [activeDivisionId, setActiveDivisionId] = useState(DIVISIONS[0].id);
  const [view, setView] = useState<'DRIVERS' | 'CONSTRUCTORS'>('DRIVERS');
  const [data, setData] = useState<GCSDivisionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  // Tab principal: campeonato vs resultados por carrera
  const [mainTab, setMainTab] = useState<'CAMPEONATO' | 'RESULTADOS'>('CAMPEONATO');

  // Resultados preliminares state
  const [prelData, setPrelData] = useState<PreliminaryData | null>(null);
  const [prelLoading, setPrelLoading] = useState(true);
  const [gpActivo, setGpActivo] = useState<string>('');
  const [gpDropdown, setGpDropdown] = useState(false);

  useEffect(() => {
    setIsExpanded(false);
  }, [activeDivisionId, view]);

  // Fetch standings
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

  // Fetch resultados preliminares
  useEffect(() => {
    fetch(`${RESULTS_URL}?t=${Date.now()}`)
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then((d: PreliminaryData) => { setPrelData(d); setPrelLoading(false); })
      .catch(() => { setPrelLoading(false); });
  }, []);

  // Filtrar carreras por división activa
  const divisionName = DIVISIONS.find(d => d.id === activeDivisionId)?.name || '';
  const carrerasDiv = prelData?.carreras.filter(c =>
    c.division.toLowerCase().includes(divisionName.toLowerCase().replace('división ', 'divisi'))
    || c.division.toLowerCase().includes(activeDivisionId.replace('div', 'división '))
    || c.division.includes(activeDivisionId.replace('div', ''))
  ) || [];

  // Reset GP activo cuando cambia la división
  useEffect(() => {
    if (carrerasDiv.length > 0) {
      setGpActivo(carrerasDiv[carrerasDiv.length - 1].gran_premio + '|' + carrerasDiv[carrerasDiv.length - 1].tipo);
    } else {
      setGpActivo('');
    }
    setGpDropdown(false);
  }, [activeDivisionId, prelData]);

  const carreraSeleccionada = carrerasDiv.find(c => c.gran_premio + '|' + c.tipo === gpActivo) || carrerasDiv[carrerasDiv.length - 1];
  const gpKey = carreraSeleccionada ? carreraSeleccionada.gran_premio + '|' + carreraSeleccionada.tipo : '';
  const hasPrelData = prelData && prelData.carreras.length > 0;

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
            {mainTab === 'CAMPEONATO' && data?.ultimo_gp && (
               <p className="text-gray-500 text-[10px] md:text-xs font-black uppercase tracking-[0.2em] mt-2">
                  Resultados actualizados hasta: <span className="text-mrs-red">{data.ultimo_gp}</span>
               </p>
            )}
            {mainTab === 'RESULTADOS' && (
               <p className="text-gray-500 text-[10px] md:text-xs font-black uppercase tracking-[0.2em] mt-2">
                  Datos crudos · <span className="text-amber-600">Sujetos a revisión de comisarios</span>
               </p>
            )}
         </div>

         {/* Tabs principales: Campeonato | Resultados por Carrera */}
         {hasPrelData && (
           <div className="flex justify-center mb-6">
             <div className="bg-white p-1 rounded-xl shadow-md flex">
               <button
                 onClick={() => setMainTab('CAMPEONATO')}
                 className={`flex items-center gap-2 px-6 sm:px-8 py-3 rounded-lg font-bold uppercase text-xs transition-all ${
                   mainTab === 'CAMPEONATO' ? 'bg-mrs-black text-white' : 'text-gray-400 hover:text-gray-600'
                 }`}
               >
                 <Trophy size={14} /> Campeonato
               </button>
               <button
                 onClick={() => setMainTab('RESULTADOS')}
                 className={`flex items-center gap-2 px-6 sm:px-8 py-3 rounded-lg font-bold uppercase text-xs transition-all ${
                   mainTab === 'RESULTADOS' ? 'bg-mrs-black text-white' : 'text-gray-400 hover:text-gray-600'
                 }`}
               >
                 <ClipboardList size={14} /> Por Carrera
               </button>
             </div>
           </div>
         )}

         {/* Filtro divisiones (compartido) */}
         <div className="flex flex-col gap-6 mb-8">
             <div className="flex overflow-x-auto no-scrollbar gap-2 justify-center">
                {DIVISIONS.map((div) => (
                    <button key={div.id} onClick={() => setActiveDivisionId(div.id)} className={`px-6 py-2 text-xs font-bold uppercase rounded-full transition-all ${activeDivisionId === div.id ? 'bg-mrs-black text-white' : 'bg-white text-gray-500 hover:bg-gray-200'}`}>
                        {div.name}
                    </button>
                ))}
             </div>

             {/* Sub-tabs: Pilotos / Equipos (solo en Campeonato) */}
             {mainTab === 'CAMPEONATO' && (
               <div className="bg-white p-1 rounded-xl shadow-md flex w-fit mx-auto">
                 <button onClick={() => setView('DRIVERS')} className={`flex items-center gap-2 px-8 py-3 rounded-lg font-bold uppercase text-xs transition-all ${view === 'DRIVERS' ? 'bg-mrs-red text-white' : 'text-gray-400'}`}>
                    <Trophy size={14} /> Pilotos
                 </button>
                 <button onClick={() => setView('CONSTRUCTORS')} className={`flex items-center gap-2 px-8 py-3 rounded-lg font-bold uppercase text-xs transition-all ${view === 'CONSTRUCTORS' ? 'bg-mrs-red text-white' : 'text-gray-400'}`}>
                    <Shield size={14} /> Equipos
                 </button>
               </div>
             )}

             {/* Selector de GP (solo en Resultados) */}
             {mainTab === 'RESULTADOS' && carrerasDiv.length > 0 && (
               <div className="relative max-w-md mx-auto w-full">
                 <button
                   onClick={() => setGpDropdown(!gpDropdown)}
                   className="w-full flex items-center justify-between gap-3 px-4 py-3 bg-white border border-gray-200 rounded-xl text-mrs-black text-sm font-bold hover:border-gray-400 transition-colors shadow-md"
                 >
                   <div className="flex items-center gap-2">
                     {carreraSeleccionada?.tipo === 'Sprint'
                       ? <Zap size={14} className="text-purple-500" />
                       : <Flag size={14} className="text-mrs-red" />
                     }
                     <span>{carreraSeleccionada?.gran_premio}</span>
                     {carreraSeleccionada?.tipo === 'Sprint' && (
                       <span className="px-2 py-0.5 bg-purple-100 text-purple-600 text-[10px] font-black rounded-full">SPRINT</span>
                     )}
                   </div>
                   <ChevronDown size={16} className={`text-gray-400 transition-transform ${gpDropdown ? 'rotate-180' : ''}`} />
                 </button>

                 <AnimatePresence>
                   {gpDropdown && (
                     <motion.div
                       initial={{ opacity: 0, y: -4 }}
                       animate={{ opacity: 1, y: 0 }}
                       exit={{ opacity: 0, y: -4 }}
                       className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl overflow-hidden z-20 shadow-2xl"
                     >
                       {carrerasDiv.map(c => {
                         const key = c.gran_premio + '|' + c.tipo;
                         return (
                           <button
                             key={key}
                             onClick={() => { setGpActivo(key); setGpDropdown(false); }}
                             className={`w-full flex items-center gap-2 px-4 py-3 text-left text-sm transition-colors ${
                               key === gpKey ? 'bg-gray-100 text-mrs-red font-bold' : 'text-gray-600 hover:bg-gray-50'
                             }`}
                           >
                             {c.tipo === 'Sprint'
                               ? <Zap size={12} className="text-purple-500" />
                               : <Flag size={12} className="text-gray-400" />
                             }
                             {c.gran_premio}
                             {c.tipo === 'Sprint' && (
                               <span className="px-1.5 py-0.5 bg-purple-100 text-purple-600 text-[9px] font-black rounded-full">SPRINT</span>
                             )}
                           </button>
                         );
                       })}
                     </motion.div>
                   )}
                 </AnimatePresence>
               </div>
             )}
         </div>

         {/* ═══ Vista Campeonato ═══ */}
         {mainTab === 'CAMPEONATO' && (
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
         )}

         {/* ═══ Vista Resultados por Carrera ═══ */}
         {mainTab === 'RESULTADOS' && (
           <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
             {prelLoading ? (
               <div className="flex flex-col items-center justify-center h-[450px]">
                 <Loader2 size={40} className="animate-spin text-mrs-red" />
               </div>
             ) : !carreraSeleccionada ? (
               <div className="flex flex-col items-center justify-center h-[300px] p-6 text-center text-gray-400">
                 <ClipboardList size={40} className="mb-4 text-gray-300" />
                 <p className="font-bold">Sin resultados para esta división</p>
                 <p className="text-sm mt-1">Los resultados aparecerán después de cada carrera.</p>
               </div>
             ) : (
               <div>
                 {/* Info de la carrera */}
                 <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center gap-3 flex-wrap text-xs text-gray-500">
                   <span className="font-bold text-mrs-black">{carreraSeleccionada.gran_premio}</span>
                   {carreraSeleccionada.tipo === 'Sprint' && (
                     <span className="px-2 py-0.5 bg-purple-100 text-purple-600 text-[10px] font-black rounded-full">SPRINT</span>
                   )}
                   <span className="text-gray-300">·</span>
                   <span>{carreraSeleccionada.division}</span>
                   <span className="text-gray-300">·</span>
                   <span>{carreraSeleccionada.fecha}</span>
                   <span className="text-gray-300 hidden sm:inline">·</span>
                   <span className="hidden sm:inline text-gray-400">
                     Cargado: {new Date(carreraSeleccionada.timestamp_registro).toLocaleString('es-CL')}
                   </span>
                 </div>

                 {/* Tabla */}
                 <table className="w-full text-left">
                   <thead className="bg-mrs-black text-white uppercase text-[10px] font-bold">
                     <tr>
                       <th className="px-4 sm:px-6 py-4 w-12 text-center">Pos</th>
                       <th className="px-4 sm:px-6 py-4">Piloto</th>
                       <th className="px-4 sm:px-6 py-4 hidden sm:table-cell">Equipo</th>
                       <th className="px-4 sm:px-6 py-4 w-14 text-center hidden md:table-cell">Salida</th>
                       <th className="px-4 sm:px-6 py-4 text-center hidden lg:table-cell">Mejor Vuelta</th>
                       <th className="px-4 sm:px-6 py-4 text-center hidden lg:table-cell">Tiempo</th>
                       <th className="px-4 sm:px-6 py-4 w-14 text-center">Pts</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-100">
                     {carreraSeleccionada.resultados.map((r, i) => {
                       const teamColor = getTeamColor(r.equipo);
                       return (
                         <tr key={`${r.piloto}-${r.pos}`} className="hover:bg-gray-50 transition-colors">
                           <td className={`px-4 sm:px-6 py-3 text-center font-display text-lg italic ${
                             r.pos === 1 ? 'text-mrs-yellow' : r.pos === 2 ? 'text-gray-400' : r.pos === 3 ? 'text-amber-600' : 'text-gray-300'
                           }`}>
                             {r.pos <= 3 ? ['🥇','🥈','🥉'][r.pos - 1] : r.pos}
                           </td>
                           <td className="px-4 sm:px-6 py-3">
                             <div className="flex items-center gap-3">
                               <div className="w-1.5 h-5 rounded-full" style={{ backgroundColor: teamColor }} />
                               <div>
                                 <div className="font-bold text-mrs-black text-sm uppercase">{r.piloto}</div>
                                 <div className="text-gray-400 text-[11px] sm:hidden">{r.equipo}</div>
                               </div>
                             </div>
                           </td>
                           <td className="px-4 sm:px-6 py-3 hidden sm:table-cell text-gray-500 text-xs font-bold uppercase">{r.equipo}</td>
                           <td className="px-4 sm:px-6 py-3 text-center text-gray-500 text-xs hidden md:table-cell">{r.salida ?? '-'}</td>
                           <td className="px-4 sm:px-6 py-3 text-center text-gray-500 text-xs font-mono hidden lg:table-cell">{r.mejor_tiempo || '-'}</td>
                           <td className="px-4 sm:px-6 py-3 text-center text-gray-500 text-xs font-mono hidden lg:table-cell">{r.tiempo_final || '-'}</td>
                           <td className={`px-4 sm:px-6 py-3 text-center font-display text-lg font-bold ${r.puntos > 0 ? 'text-mrs-black' : 'text-gray-300'}`}>
                             {r.puntos}
                           </td>
                         </tr>
                       );
                     })}
                   </tbody>
                 </table>

                 {/* Disclaimer */}
                 <div className="px-6 py-3 bg-amber-50 border-t border-amber-200 flex items-start gap-2">
                   <Timer size={14} className="text-amber-600 mt-0.5 shrink-0" />
                   <p className="text-amber-700 text-[11px] leading-relaxed">
                     Resultados preliminares sujetos a revisión de comisarios. Las sanciones pueden alterar posiciones y puntos.
                   </p>
                 </div>
               </div>
             )}
           </div>
         )}
       </div>
    </section>
  );
};

export default Standings;
