
import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Calendar from './components/Calendar';
import Lineups from './components/Lineups';
import Standings from './components/Standings';
import Multimedia from './components/Multimedia';
import Champions from './components/Champions';
import Rules from './components/Rules';
import About from './components/About';
import Footer from './components/Footer';
import MiniGame from './components/MiniGame';
import AIEngineer from './components/AIEngineer';

const App: React.FC = () => {
  return (
    <div className="font-sans antialiased bg-mrs-black min-h-screen selection:bg-mrs-red selection:text-white">
      <Navbar />
      <main>
        <Hero />
        <Calendar />
        <Standings />
        <Lineups />
        <Multimedia />
        <Rules />
        <Champions />
        <MiniGame />
        <AIEngineer />
        <About />
      </main>
      <Footer />
    </div>
  );
};

export default App;
