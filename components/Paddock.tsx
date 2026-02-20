import React from 'react';
import { motion } from 'framer-motion';
import { Car, Wrench, Users } from 'lucide-react';

const Paddock: React.FC = () => {
  return (
    <section id="paddock" className="py-20 bg-mrs-black text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Car size={60} className="text-mrs-yellow mx-auto mb-4" />
            <span className="text-mrs-red font-bold tracking-widest text-sm uppercase">Zona Exclusiva</span>
            <h2 className="text-4xl md:text-6xl font-display italic text-white mb-4">PADDOCK ZONE</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">Aquí encontrarás información exclusiva para pilotos y equipos, herramientas de gestión y recursos adicionales.</p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="bg-gray-900 rounded-2xl p-8 text-center border border-gray-800 shadow-lg"
          >
            <Wrench size={40} className="text-mrs-yellow mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Herramientas de Equipo</h3>
            <p className="text-gray-400 text-sm">Accede a telemetría, estrategias de carrera y configuraciones de coche.</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="bg-gray-900 rounded-2xl p-8 text-center border border-gray-800 shadow-lg"
          >
            <Users size={40} className="text-mrs-yellow mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Comunidad de Pilotos</h3>
            <p className="text-gray-400 text-sm">Conéctate con otros pilotos, comparte consejos y organiza entrenamientos.</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="bg-gray-900 rounded-2xl p-8 text-center border border-gray-800 shadow-lg"
          >
            <Car size={40} className="text-mrs-yellow mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Noticias y Actualizaciones</h3>
            <p className="text-gray-400 text-sm">Mantente al día con las últimas novedades de la liga y las carreras.</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Paddock;
