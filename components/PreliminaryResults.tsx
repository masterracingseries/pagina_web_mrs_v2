import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, ChevronDown, Loader2, Trophy, Flag, Zap } from 'lucide-react';

const GCS_BASE_URL = 'https://storage.googleapis.com/mrs-standings-season3';
const RESULTS_URL  = `${GCS_BASE_URL}/resultados_preliminares.json`;

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

const PreliminaryResults: React.FC = () => {
  const [data, setData]                 = useState<PreliminaryData | null>(null);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(false);
  const [divActiva, setDivActiva]       = useState<string>('TODAS');
  const [gpActivo, setGpActivo]         = useState<string>('');
  const [gpDropdown, setGpDropdown]     = useState(false);

  useEffect(() => {
    fetch(`${RESULTS_URL}?t=${Date.now()}`)
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then((d: PreliminaryData) => {
        setData(d);
        if (d.carreras.length > 0) {
          const divisiones = [...new Set(d.carreras.map(c => c.division))];
          const primerDiv = divisiones.length > 0 ? divisiones[0] : 'TODAS';
          setDivActiva(primerDiv);
          const carrerasDiv = d.carreras.filter(c => c.division === primerDiv);
          if (carrerasDiv.length > 0) setGpActivo(carrerasDiv[carrerasDiv.length - 1].gran_premio + '|' + carrerasDiv[carrerasDiv.length - 1].tipo);
        }
        setLoading(false);
      })
      .catch(() => { setError(true); setLoading(false); });
  }, []);

  if (loading) return (
    <section id="preliminary" className="py-20 bg-mrs-black">
      <div className="max-w-7xl mx-auto px-4 flex justify-center items-center h-48">
        <Loader2 size={28} className="text-mrs-red animate-spin" />
      </div>
    </section>
  );

  if (error || !data || data.carreras.length === 0) return null;

  const divisiones = ['TODAS', ...([...new Set(data.carreras.map(c => c.division))].sort())];

  const carrerasFiltradas = divActiva === 'TODAS'
    ? data.carreras
    : data.carreras.filter(c => c.division === divActiva);

  const gpsUnicos = [...new Map(carrerasFiltradas.map(c => [c.gran_premio + '|' + c.tipo, c])).values()];

  const carreraSeleccionada = carrerasFiltradas.find(c => c.gran_premio + '|' + c.tipo === gpActivo)
    || carrerasFiltradas[carrerasFiltradas.length - 1];

  const gpKey = carreraSeleccionada ? carreraSeleccionada.gran_premio + '|' + carreraSeleccionada.tipo : '';

  return (
    <section id="preliminary" className="py-16 sm:py-20 bg-gray-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-amber-950/10 via-transparent to-transparent" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <div className="mb-8 sm:mb-10">
          <span className="text-mrs-yellow font-bold tracking-widest text-xs sm:text-sm uppercase">Transparencia</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display text-white italic uppercase mt-1">
            Resultados <span className="text-mrs-yellow">Preliminares</span>
          </h2>
          <p className="text-gray-500 mt-2 sm:mt-3 max-w-2xl text-xs sm:text-sm leading-relaxed">
            Datos crudos extraídos directamente de las capturas de carrera. Estos resultados son preliminares
            y pueden ser ajustados tras la revisión de comisarios.
          </p>
        </div>

        {/* Filtro divisiones */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 sm:flex-wrap sm:pb-0 scrollbar-hide">
          {divisiones.map(div => (
            <button
              key={div}
              onClick={() => {
                setDivActiva(div);
                const nuevas = div === 'TODAS' ? data.carreras : data.carreras.filter(c => c.division === div);
                if (nuevas.length > 0) setGpActivo(nuevas[nuevas.length - 1].gran_premio + '|' + nuevas[nuevas.length - 1].tipo);
              }}
              className={`px-3 sm:px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider transition-all border whitespace-nowrap ${
                divActiva === div
                  ? 'bg-mrs-yellow text-black border-mrs-yellow'
                  : 'bg-gray-900 text-gray-500 border-gray-700 hover:border-gray-500 hover:text-white'
              }`}
            >
              {div === 'TODAS' ? 'Todas' : div}
            </button>
          ))}
        </div>

        {/* Selector de GP */}
        {gpsUnicos.length > 1 && (
          <div className="relative mb-6">
            <button
              onClick={() => setGpDropdown(!gpDropdown)}
              className="w-full flex items-center justify-between gap-3 px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white text-sm font-bold hover:border-gray-500 transition-colors"
            >
              <div className="flex items-center gap-2">
                {carreraSeleccionada?.tipo === 'Sprint'
                  ? <Zap size={14} className="text-purple-400" />
                  : <Flag size={14} className="text-mrs-yellow" />
                }
                <span>{carreraSeleccionada?.gran_premio}</span>
                {carreraSeleccionada?.tipo === 'Sprint' && (
                  <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 text-[10px] font-black rounded-full border border-purple-500/30">SPRINT</span>
                )}
              </div>
              <ChevronDown size={16} className={`text-gray-500 transition-transform ${gpDropdown ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {gpDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="absolute top-full left-0 right-0 mt-1 bg-gray-900 border border-gray-700 rounded-xl overflow-hidden z-20 shadow-2xl"
                >
                  {gpsUnicos.map(c => {
                    const key = c.gran_premio + '|' + c.tipo;
                    return (
                      <button
                        key={key}
                        onClick={() => { setGpActivo(key); setGpDropdown(false); }}
                        className={`w-full flex items-center gap-2 px-4 py-3 text-left text-sm transition-colors ${
                          key === gpKey ? 'bg-mrs-yellow/10 text-mrs-yellow' : 'text-gray-300 hover:bg-gray-800'
                        }`}
                      >
                        {c.tipo === 'Sprint'
                          ? <Zap size={12} className="text-purple-400" />
                          : <Flag size={12} className="text-gray-500" />
                        }
                        {c.gran_premio}
                        {c.tipo === 'Sprint' && (
                          <span className="px-1.5 py-0.5 bg-purple-500/20 text-purple-400 text-[9px] font-black rounded-full">SPRINT</span>
                        )}
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Tabla de resultados */}
        {carreraSeleccionada && (
          <div key={gpKey}>
            {/* Info de la carrera */}
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <span className="text-gray-600 text-xs">{carreraSeleccionada.division}</span>
              <span className="text-gray-700">·</span>
              <span className="text-gray-600 text-xs">{carreraSeleccionada.fecha}</span>
              <span className="text-gray-700">·</span>
              <span className="text-gray-600 text-xs">
                Cargado: {new Date(carreraSeleccionada.timestamp_registro).toLocaleString('es-CL')}
              </span>
            </div>

            {/* Header de tabla */}
            <div className="hidden sm:grid grid-cols-[40px_1fr_1fr_60px_90px_90px_50px] gap-2 px-4 py-2 text-[10px] font-black text-gray-600 uppercase tracking-wider border-b border-gray-800">
              <span>Pos</span>
              <span>Piloto</span>
              <span>Equipo</span>
              <span className="text-center">Salida</span>
              <span className="text-center">Mejor Vuelta</span>
              <span className="text-center">Tiempo</span>
              <span className="text-center">Pts</span>
            </div>

            {/* Filas */}
            <div className="space-y-0">
              {carreraSeleccionada.resultados.map((r, i) => {
                const teamColor = getTeamColor(r.equipo);
                const isPodium = r.pos <= 3;
                return (
                  <motion.div
                    key={`${r.piloto}-${r.pos}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className={`group border-b border-gray-800/50 transition-colors hover:bg-gray-900/80 ${isPodium ? 'bg-gray-900/40' : ''}`}
                  >
                    {/* Desktop */}
                    <div className="hidden sm:grid grid-cols-[40px_1fr_1fr_60px_90px_90px_50px] gap-2 px-4 py-3 items-center">
                      <span className={`text-sm font-black ${
                        r.pos === 1 ? 'text-mrs-yellow' : r.pos === 2 ? 'text-gray-300' : r.pos === 3 ? 'text-amber-600' : 'text-gray-500'
                      }`}>
                        {r.pos === 1 ? '🥇' : r.pos === 2 ? '🥈' : r.pos === 3 ? '🥉' : r.pos}
                      </span>
                      <span className="text-white font-bold text-sm truncate">{r.piloto}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-1 h-4 rounded-full" style={{ backgroundColor: teamColor }} />
                        <span className="text-gray-400 text-xs truncate">{r.equipo}</span>
                      </div>
                      <span className="text-gray-500 text-xs text-center">{r.salida ?? '-'}</span>
                      <span className="text-gray-400 text-xs text-center font-mono">{r.mejor_tiempo || '-'}</span>
                      <span className="text-gray-400 text-xs text-center font-mono">{r.tiempo_final || '-'}</span>
                      <span className={`text-center text-xs font-black ${r.puntos > 0 ? 'text-mrs-yellow' : 'text-gray-600'}`}>
                        {r.puntos}
                      </span>
                    </div>

                    {/* Mobile */}
                    <div className="sm:hidden px-4 py-3 flex items-center gap-3">
                      <span className={`text-sm font-black w-8 shrink-0 ${
                        r.pos === 1 ? 'text-mrs-yellow' : r.pos === 2 ? 'text-gray-300' : r.pos === 3 ? 'text-amber-600' : 'text-gray-500'
                      }`}>
                        {r.pos === 1 ? '🥇' : r.pos === 2 ? '🥈' : r.pos === 3 ? '🥉' : r.pos}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-bold text-sm truncate">{r.piloto}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <div className="w-1 h-3 rounded-full" style={{ backgroundColor: teamColor }} />
                          <span className="text-gray-500 text-[11px] truncate">{r.equipo}</span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className={`text-xs font-black ${r.puntos > 0 ? 'text-mrs-yellow' : 'text-gray-600'}`}>
                          {r.puntos} pts
                        </span>
                        {r.mejor_tiempo && (
                          <p className="text-gray-600 text-[10px] font-mono mt-0.5">{r.mejor_tiempo}</p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Footer disclamer */}
            <div className="mt-4 px-4 py-3 bg-gray-900/50 border border-gray-800 rounded-lg flex items-start gap-2">
              <Timer size={14} className="text-amber-500 mt-0.5 shrink-0" />
              <p className="text-gray-500 text-[11px] leading-relaxed">
                Resultados preliminares sujetos a revisión de comisarios. Las sanciones aplicadas tras la comisaría
                pueden alterar posiciones y puntos finales.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default PreliminaryResults;
