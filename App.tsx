import React from 'react';
import { ConfigProvider } from './hooks/ConfigContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Calendar from './components/Calendar';
import Standings from './components/Standings';
import Multimedia from './components/Multimedia';
import Champions from './components/Champions';
import Rules from './components/Rules';
import About from './components/About';
import Footer from './components/Footer';
import MiniGame from './components/MiniGame';

const App: React.FC = () => {
  return (
    // ConfigProvider fetchea config.json al montar y lo hace disponible
    // en todos los componentes hijos via useConfigContext().
    // Si el fetch falla, usa los valores de constants.ts como fallback.
    <ConfigProvider>
      <div className="font-sans antialiased bg-mrs-black min-h-screen selection:bg-mrs-red selection:text-white">
        <Navbar />
        <main>
          <Hero />
          <Calendar />
          <Standings />
          <Multimedia />
          <Rules />
          <Champions />
          <MiniGame />
          <About />
        </main>
        <Footer />
      </div>
    </ConfigProvider>
  );
};

export default App;
