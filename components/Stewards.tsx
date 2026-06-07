import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, AlertTriangle, CheckCircle2, Clock, ChevronDown, ChevronUp, Loader2, ExternalLink, Flag } from 'lucide-react';

// ─── Configuración ────────────────────────────────────────────
const GCS_BASE_URL   = 'https://storage.googleapis.com/mrs-standings-season3';
const STEWARDS_URL   = `${GCS_BASE_URL}/stewards.json`;

// URL del Form de defensa — el número de caso se pre-rellena automáticamente
const FORM_DEFENSA_BASE = 'https://docs.google.com/forms/d/e/1FAIpQLSeVhwXpr_WagYiIV8u9afTP3qfmxHwqESIia8IbmQNf4HFnUw/viewform';
const FORM_DEFENSA_ENTRY = 'entry.1745894831'; // ID del campo Número de caso

// ─── Tipos ────────────────────────────────────────────────────
interface Caso {
  caso_id          : string;
  division         : string;
  carrera_id       : string;
  alias_denunciado : string;
  sancion_seg      : number;
  sancion_pl       : number;
  veredicto_texto  : string;
  estado           : string;
}

interface StewardsData {
  _generado_en : string;
  casos        : Caso[];
  tabla_pl     : any[];
}
// ──────────────────────────────────────────────────────────────

// ─── Badge de estado ──────────────────────────────────────────
const BadgeEstado: React.FC<{ estado: string }> = ({ estado }) => {
  const cfg: Record<string, { label: string; className: string }> = {
    'PENDIENTE'   : { label: '⏳ Pendiente',   className: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
    'EN_REVISION' : { label: '🔍 En revisión', className: 'bg-blue-500/20 text-blue-400 border-blue-500/30'   },
    'RESUELTO'    : { label: '✅ Resuelto',     className: 'bg-green-500/20 text-green-400 border-green-500/30'},
    'ANULADA'     : { label: '❌ Anulada',      className: 'bg-gray-500/20 text-gray-400 border-gray-500/30'  },
  };
  const { label, className } = cfg[estado] || cfg['PENDIENTE'];
  return (
    <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-full border ${className}`}>
      {label}
    </span>
  );
};

// ─── Card de caso abierto ─────────────────────────────────────
const CasoAbierto: React.FC<{ caso: Caso }> = ({ caso }) => {
  const linkDefensa = `${FORM_DEFENSA_BASE}?${FORM_DEFENSA_ENTRY}=${encodeURIComponent(caso.caso_id)}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900 border border-amber-500/20 rounded-xl p-5 hover:border-amber-500/40 transition-colors"
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <span className="text-[10px] font-black text-gray-600 tracking-wider">{caso.caso_id}</span>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className="text-xs text-gray-500">{caso.division}</span>
            <span className="text-gray-700">·</span>
            <span className="text-xs text-gray-500">{caso.carrera_id}</span>
          </div>
        </div>
        <BadgeEstado estado={caso.estado} />
      </div>

      <div className="mb-4">
        <p className="text-[10px] text-gray-600 uppercase tracking-wider mb-1">Piloto citado</p>
        <p className="text-white font-bold text-lg">{caso.alias_denunciado}</p>
      </div>

      <div className="pt-3 border-t border-gray-800 flex items-center justify-between">
        <p className="text-gray-600 text-xs">
          ¿Eres tú? Tienes derecho a enviar tu defensa.
        </p>
        <a
          href={linkDefensa}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 bg-mrs-red text-white px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider hover:bg-white hover:text-mrs-red transition-all"
        >
          Enviar defensa <ExternalLink size={12} />
        </a>
      </div>
    </motion.div>
  );
};

// ─── Card de veredicto ────────────────────────────────────────
const CardVeredicto: React.FC<{ caso: Caso }> = ({ caso }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition-colors"
    >
      <button
        className="w-full flex items-center gap-4 px-5 py-4 text-left"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-[10px] font-black text-gray-600">{caso.caso_id}</span>
            <span className="text-gray-700">·</span>
            <span className="text-xs text-gray-500">{caso.division}</span>
            <span className="text-gray-700">·</span>
            <span className="text-xs text-gray-500">{caso.carrera_id}</span>
          </div>
          <p className="text-white font-bold">{caso.alias_denunciado}</p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {caso.sancion_seg > 0 && (
            <span className="text-amber-400 text-xs font-bold">+{caso.sancion_seg}s</span>
          )}
          {caso.sancion_pl > 0 && (
            <span className="text-red-400 text-xs font-bold">-{caso.sancion_pl}PL</span>
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
            <div className="px-5 pb-4 border-t border-gray-800 pt-3">
              <p className="text-gray-500 text-[10px] uppercase tracking-wider mb-1">Veredicto</p>
              <p className="text-gray-300 text-sm leading-relaxed">
                {caso.veredicto_texto || 'Sin descripción adicional.'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ─── Componente principal ─────────────────────────────────────
const Stewards: React.FC = () => {
  const [data, setData]       = useState<StewardsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(false);
  const [divActiva, setDivActiva] = useState<string>('TODAS');

  useEffect(() => {
    fetch(`${STEWARDS_URL}?t=${Date.now()}`)
      .then(r => r.json())
      .then((d: StewardsData) => { setData(d); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  }, []);

  if (loading) return (
    <section id="stewards" className="py-20 bg-mrs-black">
      <div className="max-w-7xl mx-auto px-4 flex justify-center items-center h-64">
        <Loader2 size={32} className="text-mrs-red animate-spin" />
      </div>
    </section>
  );

  if (error || !data) return (
    <section id="stewards" className="py-20 bg-mrs-black">
      <div className="max-w-7xl mx-auto px-4 text-center text-gray-600 py-20">
        <Shield size={48} className="mx-auto mb-4 opacity-20" />
        <p className="text-lg font-bold text-gray-500">Panel de comisaría no disponible</p>
        <p className="text-sm mt-1">Intenta de nuevo más tarde.</p>
      </div>
    </section>
  );

  const divisiones = ['TODAS', 'División 1', 'División 2', 'División 3', 'División 4'];

  const casosAbiertos  = data.casos.filter(c =>
    ['PENDIENTE','EN_REVISION'].includes(c.estado.toUpperCase()) &&
    (divActiva === 'TODAS' || c.division === divActiva)
  );

  const casosResueltos = data.casos.filter(c =>
    c.estado.toUpperCase() === 'RESUELTO' &&
    (divActiva === 'TODAS' || c.division === divActiva)
  );

  return (
    <section id="stewards" className="py-20 bg-gray-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-950/20 via-transparent to-transparent" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <div className="mb-10">
          <span className="text-mrs-red font-bold tracking-widest text-sm uppercase">Transparencia</span>
          <h2 className="text-4xl md:text-5xl font-display text-white italic uppercase mt-1">
            Vitrina de <span className="text-mrs-red">Denuncias</span>
          </h2>
          <p className="text-gray-500 mt-3 max-w-2xl text-sm leading-relaxed">
            Registro público de casos activos y veredictos. Si ves tu alias en un caso abierto,
            tienes derecho a enviar tu defensa antes de que los comisarios emitan su veredicto.
          </p>
        </div>

        {/* Tabs de división */}
        <div className="flex flex-wrap gap-2 mb-10">
          {divisiones.map(div => (
            <button
              key={div}
              onClick={() => setDivActiva(div)}
              className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider transition-all border ${
                divActiva === div
                  ? 'bg-mrs-red text-white border-mrs-red'
                  : 'bg-gray-900 text-gray-500 border-gray-700 hover:border-gray-500 hover:text-white'
              }`}
            >
              {div}
            </button>
          ))}
        </div>

        {/* ── CASOS ABIERTOS ── */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-5">
            <AlertTriangle size={18} className="text-amber-400" />
            <h3 className="text-white font-bold uppercase tracking-wider text-sm">
              Casos abiertos
            </h3>
            {casosAbiertos.length > 0 && (
              <span className="bg-amber-500/20 text-amber-400 text-[10px] font-black px-2 py-0.5 rounded-full border border-amber-500/30">
                {casosAbiertos.length}
              </span>
            )}
          </div>

          {casosAbiertos.length === 0 ? (
            <div className="text-center py-10 bg-gray-900/50 rounded-xl border border-gray-800">
              <CheckCircle2 size={32} className="mx-auto mb-3 text-green-500/40" />
              <p className="text-gray-600 text-sm">Sin casos abiertos en este momento</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {casosAbiertos.map(caso => (
                <CasoAbierto key={caso.caso_id} caso={caso} />
              ))}
            </div>
          )}
        </div>

        {/* ── VEREDICTOS ── */}
        <div>
          <div className="flex items-center gap-3 mb-5">
            <Flag size={18} className="text-gray-400" />
            <h3 className="text-white font-bold uppercase tracking-wider text-sm">
              Historial de veredictos
            </h3>
            {casosResueltos.length > 0 && (
              <span className="bg-gray-700/50 text-gray-400 text-[10px] font-black px-2 py-0.5 rounded-full border border-gray-700">
                {casosResueltos.length}
              </span>
            )}
          </div>

          {casosResueltos.length === 0 ? (
            <div className="text-center py-10 bg-gray-900/50 rounded-xl border border-gray-800">
              <Clock size={32} className="mx-auto mb-3 text-gray-700" />
              <p className="text-gray-600 text-sm">Sin veredictos aún esta temporada</p>
            </div>
          ) : (
            <div className="space-y-3">
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
