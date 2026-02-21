import React, { useState, useEffect, useRef } from 'react';
import { Trophy, Zap, AlertTriangle } from 'lucide-react';
import { LeaderboardEntry } from '../types';

const MiniGame: React.FC = () => {
  return (
    <section id="minigame" className="py-20 bg-mrs-black text-white relative select-none border-y border-white/5 overflow-hidden">
       {/* Decoración de fondo */}
       <div className="absolute top-0 left-0 w-full h-full bg-carbon opacity-5 pointer-events-none"></div>
       
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mb-12 text-center">
             <div className="inline-flex items-center gap-2 bg-mrs-red text-white px-5 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-4 shadow-lg shadow-mrs-red/20">
                 <Zap size={14} fill="currentColor" /> Driver Training Center
              </div>
              <h2 className="text-4xl md:text-6xl font-display italic text-white mb-4 uppercase tracking-tighter">PADDOCK <span className="text-mrs-yellow">ZONE</span></h2>
              <p className="text-gray-400 max-w-2xl mx-auto">Pon a prueba tus reflejos con el test de reacción. ¿Tienes lo necesario para ser el más rápido en la parrilla?</p>
       </div>

       <div className="max-w-7xl mx-auto px-4">
          <ReactionTestGame />
       </div>
    </section>
  );
};

/* --- REACTION TEST --- */
const ReactionTestGame: React.FC = () => {
  type ReactionState = 'IDLE' | 'PREPARING' | 'WAITING' | 'GO' | 'RESULT' | 'FALSE_START';
  const [state, setState] = useState<ReactionState>('IDLE');
  const [lightsCount, setLightsCount] = useState(0);
  const [reactionTime, setReactionTime] = useState(0);
  const [playerName, setPlayerName] = useState<string>('');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const startTimeRef = useRef(0);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const storedLeaderboard = localStorage.getItem('reactionLeaderboard');
    if (storedLeaderboard) {
      setLeaderboard(JSON.parse(storedLeaderboard));
    }
  }, []);

  useEffect(() => {
    if (leaderboard.length > 0) {
      localStorage.setItem('reactionLeaderboard', JSON.stringify(leaderboard));
    }
  }, [leaderboard]);

  const addEntryToLeaderboard = (name: string, time: number) => {
    const newEntry: LeaderboardEntry = {
      name: name || 'Anónimo',
      time: time.toFixed(0) + ' ms',
      rawTime: time,
      date: new Date().toLocaleString(),
    };
    setLeaderboard((prev) => {
      const updatedLeaderboard = [...prev, newEntry].sort((a, b) => a.rawTime - b.rawTime).slice(0, 10); // Keep top 10
      return updatedLeaderboard;
    });
  };

  const startSequence = () => {
    setState('PREPARING');
    setLightsCount(0);
    setReactionTime(0);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    for (let i = 1; i <= 5; i++) {
      setTimeout(() => {
        setLightsCount(i);
        if (i === 5) {
          setState('WAITING');
          const randomWait = Math.floor(Math.random() * 3500) + 1000;
          timeoutRef.current = window.setTimeout(lightsOut, randomWait);
        }
      }, i * 800);
    }
  };

  const lightsOut = () => {
    setLightsCount(0);
    setState('GO');
    startTimeRef.current = performance.now();
  };

  const handleAction = () => {
    if (state === 'PREPARING' || state === 'WAITING') {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setState('FALSE_START');
    } else if (state === 'GO') {
      const diff = performance.now() - startTimeRef.current;
      setReactionTime(diff);
      setState('RESULT');
      addEntryToLeaderboard(playerName, diff);
    } else {
      startSequence();
    }
  };

  const getRating = (time: number) => {
    if (time < 30) return { label: 'SAYAYIN LEVEL', color: 'text-mrs-yellow' };
    if (time < 50) return { label: 'GOD LEVEL', color: 'text-mrs-yellow' };
    if (time < 100) return { label: 'SENNA LEVEL', color: 'text-mrs-yellow' };
    if (time < 150) return { label: 'SCHUMACHER LEVEL', color: 'text-mrs-yellow' };
    if (time < 200) return { label: 'HAMILTON LEVEL', color: 'text-mrs-yellow' };
    if (time < 250) return { label: 'VERSTAPPEN LEVEL', color: 'text-green-500' };
    if (time < 300) return { label: 'LECLERC LEVEL', color: 'text-blue-400' };
    if (time < 350) return { label: 'HAKKINEN LEVEL', color: 'text-blue-400' };
    if (time < 400) return { label: 'BOTTAS LEVEL', color: 'text-blue-400' };
    if (time < 500) return { label: 'COLAPINTO LEVEL', color: 'text-blue-400' };
    if (time < 600) return { label: 'STROLL LEVEL', color: 'text-blue-400' };
    return { label: 'LATIFI LEVEL', color: 'text-red-500' };
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start justify-center">
      <div className="max-w-2xl mx-auto bg-gray-900/60 p-8 md:p-16 rounded-[3rem] border border-white/5 shadow-3xl text-center backdrop-blur-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-mrs-red/10 blur-[80px] rounded-full"></div>
        
        <div className="mb-12 flex justify-center gap-4 md:gap-6 relative z-10">
          {[1, 2, 3, 4, 5].map((num) => (
            <div key={num} className="flex flex-col gap-4">
               <div className={`w-12 h-12 md:w-20 md:h-20 rounded-full border-4 border-black shadow-inner relative flex items-center justify-center transition-all duration-150 ${lightsCount >= num ? 'bg-red-950 shadow-[0_0_30px_rgba(225,6,0,0.5)]' : 'bg-zinc-800'}`}>
                  {lightsCount >= num && (
                     <div className="w-3/4 h-3/4 bg-mrs-red rounded-full animate-pulse shadow-[0_0_20px_rgba(225,6,0,0.8)]"></div>
                  )}
               </div>
               <div className={`h-1.5 w-full rounded-full transition-colors ${lightsCount >= num ? 'bg-mrs-red' : 'bg-zinc-800'}`}></div>
            </div>
          ))}
        </div>

        <div className="min-h-[180px] flex flex-col items-center justify-center mb-10 relative z-10">
          {state === 'IDLE' && (
            <div className="flex flex-col items-center">
              <p className="text-gray-500 uppercase font-black tracking-[0.3em] text-xs mb-4">Ready for the jump? <br/> Wait for lights out</p>
              <input
                type="text"
                placeholder="Tu nombre (opcional)"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="bg-gray-800 text-white text-center px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-mrs-red"
              />
            </div>
          )}
          {state === 'PREPARING' && <p className="text-mrs-red font-black animate-pulse text-3xl uppercase italic tracking-tighter">Lights On...</p>}
          {state === 'WAITING' && <p className="text-mrs-yellow font-black text-4xl uppercase italic animate-bounce tracking-tighter">Hold it...</p>}
          {state === 'GO' && <p className="text-green-500 font-black text-8xl italic uppercase tracking-tighter animate-ping">GO!</p>}
          {state === 'FALSE_START' && (
            <div className="text-mrs-red animate-shake">
              <AlertTriangle size={64} className="mx-auto mb-4" />
              <p className="font-black text-5xl italic uppercase tracking-tighter leading-none">JUMP START</p>
              <p className="text-[10px] opacity-60 uppercase font-bold tracking-widest mt-2">Invalid reaction. Try again.</p>
            </div>
          )}
          {state === 'RESULT' && (
            <div className="animate-in fade-in zoom-in duration-300">
              <div className="text-8xl md:text-9xl font-mono font-black text-white leading-none mb-4">{reactionTime.toFixed(0)}<span className="text-2xl ml-2 text-mrs-red">ms</span></div>
              <div className={`text-3xl font-display italic uppercase tracking-tight ${getRating(reactionTime).color}`}>{getRating(reactionTime).label}</div>
            </div>
          )}
        </div>

        <button 
          onClick={handleAction}
          className={`w-full max-w-sm py-8 md:py-12 rounded-3xl font-display italic text-3xl md:text-5xl uppercase tracking-tighter transition-all shadow-2xl border-b-[10px] active:border-b-0 active:translate-y-2 select-none relative z-20 ${
            state === 'GO' ? 'bg-green-600 border-green-900 text-white' : 
            state === 'PREPARING' || state === 'WAITING' ? 'bg-mrs-red border-red-950 text-white active:scale-95' : 
            'bg-white border-zinc-300 text-black hover:bg-mrs-yellow'
          }`}
        >
          {state === 'IDLE' ? 'START' : state === 'GO' ? 'REACT!' : state === 'RESULT' || state === 'FALSE_START' ? 'RESET' : 'WAIT...'}
        </button>
      </div>

      {/* Leaderboard */}
      <div className="w-full lg:w-80 bg-gray-900/60 p-6 rounded-[2rem] border border-white/5 shadow-3xl backdrop-blur-xl">
        <h3 className="text-2xl font-display italic text-white mb-6 text-center uppercase tracking-tighter flex items-center justify-center gap-2">
          <Trophy size={24} className="text-mrs-yellow" /> Leaderboard
        </h3>
        {leaderboard.length === 0 ? (
          <p className="text-gray-500 text-center text-sm">Sé el primero en la tabla de tiempos!</p>
        ) : (
          <ol className="space-y-3">
            {leaderboard.map((entry, index) => (
              <li key={index} className="flex items-center justify-between bg-gray-800/50 p-3 rounded-xl border border-white/5">
                <span className="font-mono text-mrs-yellow text-lg w-8 text-center">{index + 1}.</span>
                <span className="flex-1 text-white font-semibold truncate">{entry.name}</span>
                <span className="font-mono text-mrs-red text-lg">{entry.time}</span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
};

export default MiniGame;
