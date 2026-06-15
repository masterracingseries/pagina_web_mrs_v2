import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, AlertTriangle, CheckCircle2, Clock, ChevronDown, ChevronUp, Loader2, ExternalLink, Flag, FilePen } from 'lucide-react';

const GCS_BASE_URL   = 'https://storage.googleapis.com/mrs-standings-season3';
const STEWARDS_URL   = `${GCS_BASE_URL}/stewards.json`;
const FORM_DEFENSA_BASE  = 'https://docs.google.com/forms/d/e/1FAIpQLSeVhwXpr_WagYiIV8u9afTP3qfmxHwqESIia8IbmQNf4HFnUw/viewform';
const FORM_DEFENSA_ENTRY = 'entry.1745894831';

interface Caso {
  caso_id          : string;
  division         : string;
  carrera_id       : string;
  alias_denunciado : string;
  vuelta           : string;
  descripcion      : string;
  sancion_seg      : number;
  sancion_pl       : number;
  veredicto_texto  : string;
  estado           : string;
  timestamp        : string;
}

interface StewardsData {
  _generado_en : string;
  casos        : Caso[];
  tabla_pl     : any[];
}

const BadgeEstado: React.FC<{ estado: string }> = ({ estado }) => {
  const cfg: Record<string, { label: string; className: string }> = {
    'PENDIENTE'   : { label: '⏳ Pendiente',   className: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
    'EN_REVISION' : { label: '🔍 En revisión', className: 'bg-blue-500/20 text-blue-400 border-blue-500/30'   },
    'RESUELTO'    : { label: '✅ Resuelto',     className: 'bg-green-500/20 text-green-400 border-green-500/30'},
    'ANULADA'     : { label: '❌ Anulada',      className: 'bg-gray-500/20 text-gray-400 border-gray-500/30'  },
  };
  const { label, className } = cfg[estado] || cfg['PENDIENTE'];
  return (
    <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-full border ${className} whitespace-nowrap`}>
      {label}
    </span>
  );
};

const CasoAbierto: React.FC<{ caso: Caso }> = ({ caso }) => {
  const [expanded, setExpanded] = useState(false);
  const linkDefensa = `${FORM_DEFENSA_BASE}?${FORM_DEFENSA_ENTRY}=${encodeURIComponent(caso.caso_id)}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900 border border-amber-500/20 rounded-xl overflow-hidden hover:border-amber-500/40 transition-colors"
    >
      {/* Header del caso — siempre visible */}
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0">
            <span className="text-[10px] font-black text-gray-600 tracking-wider block">{caso.caso_id}</span>
            <div className="flex items-center gap-1.5 mt-1 flex-wrap">
              <span className="text-xs text-gray-500">{caso.division}</span>
              <span className="text-gray-700">·</span>
              <span className="text-xs text-gray-500 truncate">{caso.carrera_id}</span>
            </div>
          </div>
          <BadgeEstado estado={caso.estado} />
        </div>

        <div className="mb-3">
          <p className="text-[10px] text-gray-600 uppercase tracking-wider mb-1">Piloto citado</p>
          <p className="text-white font-bold text-base sm:text-lg">{caso.alias_denunciado}</p>
        </div>

        {/* Vuelta — siempre visible */}
        {caso.vuelta && (
          <p className="text-xs text-gray-500 mb-3">
            <span className="text-gray-600">Vuelta:</span> <span className="text-gray-300 font-bold">{caso.vuelta}</span>
          </p>
        )}

        {/* Descripción — expandible en móvil */}
        {caso.descripcion && (
          <div className="mb-3">
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1.5 text-[10px] text-gray-500 uppercase tracking-wider hover:text-gray-300 transition-colors"
            >
              Ver descripción del incidente
              {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>
            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <p className="text-gray-400 text-xs leading-relaxed mt-2 p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
                    {caso.descripcion}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Footer con botón de defensa */}
      <div className="px-4 sm:px-5 py-3 border-t border-gray-800 bg-gray-900/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <p className="text-gray-600 text-xs leading-tight">
          ¿Eres tú el piloto citado? Tienes derecho a enviar tu defensa.
        </p>
        <a
          href={linkDefensa}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 bg-mrs-red text-white px-4 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider hover:bg-white hover:text-mrs-red transition-all w-full sm:w-auto justify-center shrink-0"
        >
          Enviar defensa <ExternalLink size={12} />
        </a>
      </div>
    </motion.div>
  );
};

const CardVeredicto: React.FC<{ caso: Caso }> = ({ caso }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition-colors"
    >
      <button
        className="w-full flex items-center gap-3 px-4 sm:px-5 py-4 text-left"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-[10px] font-black text-gray-600">{caso.caso_id}</span>
            <span className="text-gray-700 hidden sm:inline">·</span>
            <span className="text-xs text-gray-500 hidden sm:inline">{caso.division}</span>
            <span className="text-gray-700 hidden sm:inline">·</span>
            <span className="text-xs text-gray-500 hidden sm:inline truncate max-w-[140px]">{caso.carrera_id}</span>
          </div>
          <p className="text-white font-bold text-sm sm:text-base">{caso.alias_denunciado}</p>
          <p className="text-gray-600 text-xs mt-0.5 sm:hidden">{caso.division} · {caso.carrera_id}</p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {caso.sancion_seg > 0 && (
            <span className="text-amber-400 text-xs font-bold">+{caso.sancion_seg}s</span>
          )}
          {caso.sancion_pl > 0 && (
            <span className="text-red-400 text-xs font-bold">-{caso.sancion_pl}PL</span>
          )}
          {(!caso.sancion_seg && !caso.sancion_pl) && (
            <span className="text-green-500 text-xs font-bold hidden sm:inline">Sin sanción</span>
          )}
          {expanded
            ? <ChevronUp size={16} className="text-gray-500" />
            : <ChevronDown size={16} className="text-gray-500" />
          }
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 sm:px-5 pb-4 border-t border-gray-800 pt-3 space-y-3">
              {caso.vuelta && (
                <p className="text-xs text-gray-500">
                  Vuelta del incidente: <span className="text-gray-300 font-bold">{caso.vuelta}</span>
                </p>
              )}
              {caso.veredicto_texto && (
                <div>
                  <p className="text-gray-600 text-[10px] uppercase tracking-wider mb-1">Veredicto</p>
                  <p className="text-gray-300 text-sm leading-relaxed">{caso.veredicto_texto}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const Stewards: React.FC = () => {
  const [data, setData]           = useState<StewardsData | null>(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(false);
  const [divActiva, setDivActiva] = useState<string>('TODAS');

  useEffect(() => {
    fetch(`${STEWARDS_URL}?t=${Date.now()}`)
      .then(r => r.json())
      .then((d: StewardsData) => { setData(d); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  }, []);

  if (loading) return (
    <section id="stewards" className="py-20 bg-mrs-black">
      <div className="max-w-7xl mx-auto px-4 flex justify-center items-center h-48">
        <Loader2 size={28} className="text-mrs-red animate-spin" />
      </div>
    </section>
  );

  if (error || !data) return (
    <section id="stewards" className="py-16 bg-mrs-black">
      <div className="max-w-7xl mx-auto px-4 text-center py-16">
        <Shield size={40} className="mx-auto mb-3 text-gray-700" />
        <p className="font-bold text-gray-500">Panel de comisaría no disponible</p>
        <p className="text-sm text-gray-600 mt-1">Intenta de nuevo más tarde.</p>
      </div>
    </section>
  );

  const divisiones = ['TODAS', 'División 1', 'División 2', 'División 3', 'División 4'];

  const casosAbiertos = data.casos.filter(c =>
    ['PENDIENTE','EN_REVISION'].includes(c.estado.toUpperCase()) &&
    (divActiva === 'TODAS' || c.division === divActiva)
  );

  const casosResueltos = data.casos.filter(c =>
    c.estado.toUpperCase() === 'RESUELTO' &&
    (divActiva === 'TODAS' || c.division === divActiva)
  );

  return (
    <section id="stewards" className="py-16 sm:py-20 bg-gray-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-950/20 via-transparent to-transparent" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <div className="mb-8 sm:mb-10">
          <span className="text-mrs-red font-bold tracking-widest text-xs sm:text-sm uppercase">Transparencia</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display text-white italic uppercase mt-1">
            Vitrina de <span className="text-mrs-red">Denuncias</span>
          </h2>
          <p className="text-gray-500 mt-2 sm:mt-3 max-w-2xl text-xs sm:text-sm leading-relaxed">
            Registro público de casos activos y veredictos. Si ves tu alias en un caso abierto,
            tienes derecho a enviar tu defensa antes de que los comisarios emitan su veredicto.
          </p>

          {/* CTA — Haz tu denuncia */}
          <div className="mt-6 p-4 sm:p-5 bg-gray-900 border border-mrs-red/30 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 shrink-0 w-8 h-8 rounded-full bg-mrs-red/15 border border-mrs-red/30 flex items-center justify-center">
                <Flag size={15} className="text-mrs-red" />
              </div>
              <div>
                <p className="text-white font-bold text-sm">¿Presenciaste una infracción en pista?</p>
                <p className="text-gray-500 text-xs mt-0.5">Envía tu denuncia formal. Los comisarios la revisarán y emitirán un veredicto.</p>
              </div>
            </div>
            <a
              href="https://forms.gle/FJyHcbeFtr1SHmKo6"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 bg-mrs-red text-white px-5 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-white hover:text-mrs-red transition-all shrink-0 w-full sm:w-auto justify-center shadow-lg shadow-mrs-red/20"
            >
              <FilePen size={14} /> Haz tu denuncia aquí
            </a>
          </div>
        </div>

        {/* Tabs de división — scroll horizontal en móvil */}
        <div className="flex gap-2 mb-8 sm:mb-10 overflow-x-auto pb-2 sm:flex-wrap sm:pb-0 scrollbar-hide">
          {divisiones.map(div => (
            <button
              key={div}
              onClick={() => setDivActiva(div)}
              className={`px-3 sm:px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider transition-all border whitespace-nowrap ${
                divActiva === div
                  ? 'bg-mrs-red text-white border-mrs-red'
                  : 'bg-gray-900 text-gray-500 border-gray-700 hover:border-gray-500 hover:text-white'
              }`}
            >
              {div === 'TODAS' ? 'Todas' : div}
            </button>
          ))}
        </div>

        {/* Casos abiertos */}
        <div className="mb-10 sm:mb-12">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5">
            <AlertTriangle size={16} className="text-amber-400 shrink-0" />
            <h3 className="text-white font-bold uppercase tracking-wider text-xs sm:text-sm">
              Casos abiertos
            </h3>
            {casosAbiertos.length > 0 && (
              <span className="bg-amber-500/20 text-amber-400 text-[10px] font-black px-2 py-0.5 rounded-full border border-amber-500/30">
                {casosAbiertos.length}
              </span>
            )}
          </div>

          {casosAbiertos.length === 0 ? (
            <div className="text-center py-8 sm:py-10 bg-gray-900/50 rounded-xl border border-gray-800">
              <CheckCircle2 size={28} className="mx-auto mb-2 text-green-500/40" />
              <p className="text-gray-600 text-sm">Sin casos abiertos en este momento</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {casosAbiertos.map(caso => (
                <CasoAbierto key={caso.caso_id} caso={caso} />
              ))}
            </div>
          )}
        </div>

        {/* Historial de veredictos */}
        <div>
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5">
            <Flag size={16} className="text-gray-500 shrink-0" />
            <h3 className="text-white font-bold uppercase tracking-wider text-xs sm:text-sm">
              Historial de veredictos
            </h3>
            {casosResueltos.length > 0 && (
              <span className="bg-gray-700/50 text-gray-400 text-[10px] font-black px-2 py-0.5 rounded-full border border-gray-700">
                {casosResueltos.length}
              </span>
            )}
          </div>

          {casosResueltos.length === 0 ? (
            <div className="text-center py-8 sm:py-10 bg-gray-900/50 rounded-xl border border-gray-800">
              <Clock size={28} className="mx-auto mb-2 text-gray-700" />
              <p className="text-gray-600 text-sm">Sin veredictos aún esta temporada</p>
            </div>
          ) : (
            <div className="space-y-2 sm:space-y-3">
              {casosResueltos.map(caso => (
                <CardVeredicto key={caso.caso_id} caso={caso} />
              ))}
            </div>
          )}
        </div>

      </div>
    </section>
  );
};

export default Stewards;
