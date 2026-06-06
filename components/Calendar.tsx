import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, CheckCircle2, Flag } from 'lucide-react';
import { useConfigContext } from '../hooks/ConfigContext';

const OffseasonBanner: React.FC<{ title: string }> = ({ title }) => (
  <section id="calendar" className="py-20 bg-mrs-black relative overflow-hidden">
    {/* Fondo decorativo */}
    <div className="absolute inset-0 z-0">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-mrs-red/10 via-transparent to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-mrs-red/30 to-transparent" />
    </div>

    <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        {/* Ícono */}
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 rounded-full bg-mrs-red/10 border border-mrs-red/30 flex items-center justify-center">
            <Flag size={36} className="text-mrs-red" />
          </div>
        </div>

        {/* Título principal */}
        <h2 className="text-5xl md:text-7xl font-display italic uppercase text-white leading-none mb-4 tracking-tighter">
          LA HISTORIA <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-mrs-red to-mrs-yellow">
            POR ESCRIBIRSE
          </span>
        </h2>

        <div className="w-24 h-1 bg-mrs-red mx-auto my-8" />

        <p className="text-gray-400 text-xl md:text-2xl font-light leading-relaxed max-w-2xl mx-auto">
          Estamos preparando todo para que la próxima temporada sea{' '}
          <span className="text-white font-semibold">increíble</span>.
          <br />
          El calendario se anunciará muy pronto.
        </p>

        {/* Decoración inferior */}
        <div className="mt-12 flex items-center justify-center gap-3 text-gray-600">
          <div className="h-px w-16 bg-gray-700" />
          <span className="text-xs font-black uppercase tracking-[0.4em]">{title}</span>
          <div className="h-px w-16 bg-gray-700" />
        </div>
      </motion.div>
    </div>
  </section>
);

const Calendar: React.FC = () => {
  const { config, loading } = useConfigContext();
  const calendar            = config.calendario;
  const isSeasonActive      = config.liga.is_season_active;
  const seasonLabel         = `Season ${config.liga.temporada_actual}`;

  const today         = new Date();
  const nextRaceIndex = calendar.findIndex(race => new Date(race.isoDate) >= today);

  if (loading) {
    return (
      <section id="calendar" className="py-20 bg-mrs-black">
        <div className="max-w-7xl mx-auto px-4 flex justify-center items-center h-64">
          <div className="w-8 h-8 border-4 border-mrs-red border-t-transparent rounded-full animate-spin" />
        </div>
      </section>
    );
  }

  // Temporada inactiva → panel de expectativa
  if (!isSeasonActive) return <OffseasonBanner title={seasonLabel} />;

  return (
    <section id="calendar" className="py-20 bg-mrs-black relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-16 border-b border-gray-700 pb-4 flex justify-between items-end">
          <div>
            <span className="text-mrs-red font-bold tracking-widest text-sm uppercase">
              Temporada {config.liga.temporada_actual}
            </span>
            <h2 className="text-4xl md:text-5xl font-display text-white italic">CALENDARIO OFICIAL</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {calendar.map((race, index) => {
            const raceDate    = new Date(race.isoDate);
            const isCompleted = raceDate < today;
            const isNext      = index === nextRaceIndex;

            return (
              <motion.div
                key={race.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className={`group relative bg-gray-900 border-l-4 p-6 transition-all duration-500 overflow-hidden
                  ${isCompleted
                    ? 'border-gray-700 opacity-60'
                    : isNext
                      ? 'border-mrs-yellow scale-[1.02] shadow-[0_0_30px_rgba(255,215,0,0.1)]'
                      : 'border-mrs-red'}`}
              >
                <div className="flex justify-between mb-4">
                  <span className="text-xs font-bold text-gray-400">ROUND {race.round}</span>
                  {isCompleted && (
                    <span className="text-green-500 text-[10px] font-bold uppercase flex items-center gap-1">
                      <CheckCircle2 size={12} /> Finalizado
                    </span>
                  )}
                  {isNext && (
                    <span className="bg-mrs-yellow text-mrs-black px-2 py-0.5 text-[10px] font-black uppercase rounded animate-pulse">
                      Próxima Carrera
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 mb-2">
                  <img src={race.flagUrl} alt="" className="w-6 h-4 object-cover rounded" />
                  <h3 className={`text-2xl font-bold italic ${isNext ? 'text-mrs-yellow' : 'text-white'}`}>
                    {race.country.toUpperCase()}
                  </h3>
                </div>
                <p className="text-gray-400 text-sm mb-4 flex items-center gap-2">
                  <MapPin size={14} /> {race.trackName}
                </p>
                <div className="text-white font-bold text-lg mb-4">{race.date}</div>

                <div className="mt-4 pt-4 border-t border-gray-800">
                  <div className="relative h-24 w-full mb-3 flex items-center justify-center bg-gray-800/50 rounded-lg p-2">
                    <img
                      src={race.mapUrl}
                      alt={`Mapa de ${race.trackName}`}
                      className="max-h-full max-w-full object-contain opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                    />
                  </div>
                  {race.info && (
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 group-hover:line-clamp-none transition-all duration-300">
                      {race.info}
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Calendar;
