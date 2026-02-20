
import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Calendar from './components/Calendar';
import Standings from './components/Standings';
import Multimedia from './components/Multimedia';
import Champions from './components/Champions';
import Rules from './components/Rules';
import About from './components/About';
import Paddock from './components/Paddock';
import Footer from './components/Footer';
import MiniGame from './components/MiniGame';
import AIEngineer from './components/AIEngineer';
import SandboxTools from './components/SandboxTools';

const App: React.FC = () => {
  return (
    <div className="font-sans antialiased bg-mrs-black min-h-screen selection:bg-mrs-red selection:text-white">
      <Navbar />
      <main>
        <Hero />
        <Calendar />
        <Standings />
        <Multimedia />
        <Paddock />
        <Rules />
        <Champions />
        <MiniGame />
        <AIEngineer />
        <About />
      </main>
      <Footer />
      <SandboxTools />
    </div>
  );
};

export default App;
