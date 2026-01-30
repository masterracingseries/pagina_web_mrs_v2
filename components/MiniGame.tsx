
import React, { useState, useEffect, useRef } from 'react';
import { Trophy, Play, RotateCcw, Timer, Flag, Zap, AlertTriangle, Info } from 'lucide-react';
import { LeaderboardEntry } from '../types';

type GameMode = 'TIME_ATTACK' | 'REACTION';

const MiniGame: React.FC = () => {
  const [activeMode, setActiveMode] = useState<GameMode>('TIME_ATTACK');

  return (
    <section id="game" className="py-20 bg-mrs-black text-white relative select-none border-y border-white/5 overflow-hidden">
       {/* Decoración de fondo */}
       <div className="absolute top-0 left-0 w-full h-full bg-carbon opacity-5 pointer-events-none"></div>
       
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mb-12 text-center">
            <div className="inline-flex items-center gap-2 bg-mrs-red text-white px-5 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-4 shadow-lg shadow-mrs-red/20">
                <Zap size={14} fill="currentColor" /> Driver Training Center
             </div>
             <h2 className="text-4xl md:text-6xl font-display italic text-white mb-4 uppercase tracking-tighter">PADDOCK <span className="text-mrs-yellow">ZONE</span></h2>
             
             <div className="flex justify-center gap-4 mt-8">
                <button 
                  onClick={() => setActiveMode('TIME_ATTACK')}
                  className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold uppercase text-xs transition-all border-2 ${activeMode === 'TIME_ATTACK' ? 'bg-mrs-red border-mrs-red text-white shadow-xl shadow-mrs-red/30' : 'bg-transparent border-white/10 text-gray-500 hover:text-white'}`}
                >
                  <Timer size={18} /> Time Attack
                </button>
                <button 
                  onClick={() => setActiveMode('REACTION')}
                  className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold uppercase text-xs transition-all border-2 ${activeMode === 'REACTION' ? 'bg-mrs-red border-mrs-red text-white shadow-xl shadow-mrs-red/30' : 'bg-transparent border-white/10 text-gray-500 hover:text-white'}`}
                >
                  <Zap size={18} /> Reaction Test
                </button>
             </div>
       </div>

       <div className="max-w-7xl mx-auto px-4">
          {activeMode === 'TIME_ATTACK' ? <TimeAttackGame /> : <ReactionTestGame />}
       </div>
    </section>
  );
};

/* --- MINI AUTO F1 (Componente visual reutilizable) --- */
const F1CarModel: React.FC<{ color: string, isPlayer?: boolean }> = ({ color, isPlayer }) => (
  <div className={`relative w-12 h-20 md:w-16 md:h-24 flex flex-col items-center transition-transform duration-200 ${isPlayer ? 'drop-shadow-[0_10px_15px_rgba(225,6,0,0.4)]' : ''}`}>
    {/* Alerón Delantero */}
    <div className="w-full h-2 bg-gray-900 rounded-sm mb-1"></div>
    {/* Cuerpo Principal */}
    <div className="w-3/4 flex-1 relative rounded-t-full rounded-b-lg overflow-hidden border-x border-white/10" style={{ backgroundColor: color, backgroundImage: 'linear-gradient(to bottom, rgba(255,255,255,0.2), transparent)' }}>
        {/* Cockpit / Halo */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-3 md:w-4 h-6 bg-black rounded-t-full border border-white/20"></div>
        {/* Sidepods */}
        <div className="absolute top-1/2 -left-1 w-2 h-8 bg-black/40 rounded-full"></div>
        <div className="absolute top-1/2 -right-1 w-2 h-8 bg-black/40 rounded-full"></div>
    </div>
    {/* Alerón Trasero */}
    <div className="w-[110%] h-3 bg-gray-900 rounded-sm -mt-1 flex items-center justify-center">
       {!isPlayer && <div className="flex gap-4"><div className="w-1 h-1 bg-red-600 animate-pulse"></div><div className="w-1 h-1 bg-red-600 animate-pulse"></div></div>}
    </div>
    {/* Ruedas */}
    <div className="absolute top-2 -left-2 w-2 h-5 bg-zinc-900 rounded-sm"></div>
    <div className="absolute top-2 -right-2 w-2 h-5 bg-zinc-900 rounded-sm"></div>
    <div className="absolute bottom-2 -left-2 w-3 h-6 bg-zinc-900 rounded-sm"></div>
    <div className="absolute bottom-2 -right-2 w-3 h-6 bg-zinc-900 rounded-sm"></div>
  </div>
);

/* --- TIME ATTACK ENGINE --- */
const TimeAttackGame: React.FC = () => {
  const [gameState, setGameState] = useState<'MENU' | 'RACING' | 'FINISHED'>('MENU');
  const [playerName, setPlayerName] = useState('');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [playerRank, setPlayerRank] = useState<number | null>(null);
  const [playerLane, setPlayerLane] = useState(1);
  const [displayTime, setDisplayTime] = useState("00:00.000");
  const [penalties, setPenalties] = useState(0);
  const [shake, setShake] = useState(false);
  const [trackProgress, setTrackProgress] = useState(0);

  const requestRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const distanceRef = useRef<number>(0);
  const lastFrameTimeRef = useRef<number>(0);
  const obstaclesRef = useRef<{ id: number; lane: number; y: number; type: 'CAR' | 'OIL'; collided: boolean }[]>([]);
  const lastSpawnRef = useRef<number>(0);
  const playerLaneRef = useRef<number>(1);
  const penaltyCountRef = useRef<number>(0);

  const GOAL_DISTANCE = 15000; 

  useEffect(() => {
    const saved = localStorage.getItem('mrs_f1_ta_v5');
    if (saved) setLeaderboard(JSON.parse(saved));
  }, []);

  useEffect(() => {
    playerLaneRef.current = playerLane;
  }, [playerLane]);

  // Controles de Teclado
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
        if (gameState !== 'RACING') return;
        if (e.key === 'ArrowLeft') setPlayerLane(l => Math.max(0, l - 1));
        if (e.key === 'ArrowRight') setPlayerLane(l => Math.min(2, l + 1));
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [gameState]);

  const startRace = () => {
    if (!playerName.trim()) return alert("Piloto, identifícate en el pit wall.");
    setGameState('RACING');
    distanceRef.current = 0;
    penaltyCountRef.current = 0;
    setPenalties(0);
    setPlayerLane(1);
    setTrackProgress(0);
    obstaclesRef.current = [];
    startTimeRef.current = Date.now();
    lastFrameTimeRef.current = performance.now();
    lastSpawnRef.current = Date.now();
    requestRef.current = requestAnimationFrame(gameLoop);
  };

  const gameLoop = (time: number) => {
    const dt = Math.min(0.1, (time - lastFrameTimeRef.current) / 1000); 
    lastFrameTimeRef.current = time;

    const elapsed = Date.now() - startTimeRef.current;
    setDisplayTime(formatTime(elapsed));

    // Velocidad constante de crucero (píxeles por segundo)
    const speed = 600; 
    distanceRef.current += speed * dt;
    const progress = Math.min(100, (distanceRef.current / GOAL_DISTANCE) * 100);
    setTrackProgress(progress);

    if (distanceRef.current >= GOAL_DISTANCE) {
        finishRace(elapsed);
        return;
    }

    // Spawning de obstáculos
    if (Date.now() - lastSpawnRef.current > 700) {
        const lane = Math.floor(Math.random() * 3);
        const type = Math.random() > 0.8 ? 'OIL' : 'CAR';
        obstaclesRef.current.push({ id: Date.now(), lane, y: -20, type, collided: false });
        lastSpawnRef.current = Date.now();
    }

    // Movimiento de obstáculos (bajan hacia el jugador)
    const obstacleFallSpeed = 45; 
    obstaclesRef.current.forEach(obs => {
        obs.y += obstacleFallSpeed * dt * 1.5;
    });

    // Colisiones
    const PLAYER_Y_ZONE = 80;
    obstaclesRef.current.forEach(obs => {
        if (!obs.collided && obs.lane === playerLaneRef.current && obs.y > PLAYER_Y_ZONE - 5 && obs.y < PLAYER_Y_ZONE + 10) {
            obs.collided = true;
            penaltyCountRef.current++;
            setPenalties(penaltyCountRef.current);
            setShake(true);
            setTimeout(() => setShake(false), 200);
        }
    });

    obstaclesRef.current = obstaclesRef.current.filter(o => o.y < 120);
    requestRef.current = requestAnimationFrame(gameLoop);
  };

  const finishRace = (rawTime: number) => {
    cancelAnimationFrame(requestRef.current);
    const finalTime = rawTime + (penaltyCountRef.current * 2000);
    const formatted = formatTime(finalTime);
    
    const newEntry: LeaderboardEntry = { name: playerName, time: formatted, rawTime: finalTime, date: new Date().toLocaleDateString() };
    const newBoard = [...leaderboard, newEntry].sort((a,b) => a.rawTime - b.rawTime).slice(0, 10);
    setLeaderboard(newBoard);
    localStorage.setItem('mrs_f1_ta_v5', JSON.stringify(newBoard));
    
    setPlayerRank(newBoard.findIndex(e => e.rawTime === finalTime && e.name === playerName) + 1);
    setGameState('FINISHED');
  };

  const formatTime = (ms: number) => {
    const mins = Math.floor(ms / 60000);
    const secs = Math.floor((ms % 60000) / 1000);
    const mils = Math.floor(ms % 1000);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${mils.toString().padStart(3, '0')}`;
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-stretch justify-center">
        <div className="w-full max-w-md mx-auto aspect-[9/16] md:aspect-[3/4] bg-gray-900 rounded-3xl border-8 border-gray-800 shadow-2xl relative overflow-hidden group">
            
            {/* Pantallas de Estado */}
            {gameState === 'MENU' && (
                <div className="absolute inset-0 z-40 bg-gray-900/95 flex flex-col items-center justify-center p-10 text-center">
                    <div className="w-24 h-24 bg-mrs-red rounded-full flex items-center justify-center mb-6 shadow-lg animate-pulse">
                         <Flag size={48} className="text-white" />
                    </div>
                    <h3 className="text-3xl font-display italic text-white mb-2 uppercase tracking-tighter">Time Attack Challenge</h3>
                    <p className="text-xs text-gray-500 uppercase tracking-widest mb-8">Usa las flechas o toca los lados de la pantalla para esquivar.</p>
                    <input 
                      type="text" 
                      placeholder="ESCRIBE TU NICK" 
                      className="w-full bg-black/50 border-2 border-white/10 text-mrs-yellow px-6 py-4 rounded-xl text-center font-black uppercase tracking-widest focus:border-mrs-red outline-none mb-6"
                      value={playerName}
                      onChange={(e) => setPlayerName(e.target.value)}
                      maxLength={12}
                    />
                    <button onClick={startRace} className="w-full bg-white text-black font-black py-5 rounded-xl uppercase tracking-tighter hover:bg-mrs-yellow transition-all flex items-center justify-center gap-3 active:scale-95">
                        <Play fill="black" /> Iniciar Sesión
                    </button>
                </div>
            )}

            {gameState === 'FINISHED' && (
                <div className="absolute inset-0 z-40 bg-black/95 flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500">
                    <Trophy size={64} className="text-mrs-yellow mb-4" />
                    <h3 className="text-4xl font-display italic text-white mb-1 uppercase tracking-tighter">Checkered Flag</h3>
                    <div className="w-full bg-gray-800 rounded-2xl p-6 my-6 border border-white/5">
                         <p className="text-gray-400 text-[10px] uppercase font-bold tracking-widest mb-2">Tu Tiempo Final (+Penalizaciones)</p>
                         <p className="text-4xl font-mono font-black text-mrs-yellow mb-4">{displayTime}</p>
                         <div className="flex justify-between border-t border-white/10 pt-4 px-4">
                             <div>
                                 <p className="text-[10px] text-gray-500 uppercase">Rank</p>
                                 <p className="text-2xl font-display italic">P{playerRank || '-'}</p>
                             </div>
                             <div>
                                 <p className="text-[10px] text-gray-500 uppercase">Choques</p>
                                 <p className="text-2xl font-display italic text-mrs-red">{penalties}</p>
                             </div>
                         </div>
                    </div>
                    <button onClick={() => setGameState('MENU')} className="bg-mrs-red text-white font-black py-4 px-12 rounded-full uppercase tracking-widest hover:bg-white hover:text-mrs-red transition-all active:scale-95 flex items-center gap-2">
                        <RotateCcw size={20} /> Reintentar
                    </button>
                </div>
            )}

            {/* GAME CANVAS SIMULADO */}
            <div className={`relative w-full h-full bg-[#1a1a1a] transition-transform duration-200 ${shake ? 'animate-shake' : ''}`}>
                
                {/* Carretera con Movimiento Parallax */}
                <div className="absolute inset-0 flex">
                    <div className="w-4 bg-[#0a2a0a] h-full border-r border-white/10"></div> {/* Cesped Izq */}
                    <div className="flex-1 bg-[#222] relative">
                         {/* Líneas de Carril */}
                         <div className="absolute inset-0 flex justify-between px-[33.33%]">
                            <div className="w-[2px] h-full opacity-20" style={{ backgroundImage: 'linear-gradient(to bottom, white 50%, transparent 50%)', backgroundSize: '1px 80px', backgroundPositionY: `${distanceRef.current % 80}px` }}></div>
                            <div className="w-[2px] h-full opacity-20" style={{ backgroundImage: 'linear-gradient(to bottom, white 50%, transparent 50%)', backgroundSize: '1px 80px', backgroundPositionY: `${distanceRef.current % 80}px` }}></div>
                         </div>

                         {/* Obstáculos */}
                         {obstaclesRef.current.map(obs => (
                             <div key={obs.id} className={`absolute transition-opacity duration-300 ${obs.collided ? 'opacity-30 scale-75' : ''}`} style={{ top: `${obs.y}%`, left: `${obs.lane * 33.33}%`, width: '33.33%', height: '15%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                 {obs.type === 'CAR' ? (
                                     <F1CarModel color="#005AFF" />
                                 ) : (
                                     <div className="w-12 h-10 bg-black/60 rounded-[50%] blur-[2px] border border-white/10 shadow-inner"></div>
                                 )}
                             </div>
                         ))}

                         {/* Jugador */}
                         <div className="absolute bottom-[10%] transition-all duration-150 ease-out" style={{ left: `${playerLane * 33.33}%`, width: '33.33%', display: 'flex', justifyContent: 'center' }}>
                            <F1CarModel color="#E10600" isPlayer={true} />
                         </div>
                    </div>
                    <div className="w-4 bg-[#0a2a0a] h-full border-l border-white/10"></div> {/* Cesped Der */}
                </div>

                {/* UI IN-GAME */}
                <div className="absolute top-0 left-0 w-full p-6 z-20 flex justify-between items-start pointer-events-none">
                    <div className="flex flex-col gap-1">
                        <div className="bg-black/80 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">LAP TIME</p>
                            <p className="text-xl font-mono font-bold text-white">{displayTime}</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                         <div className="bg-mrs-red text-white text-[10px] px-3 py-1 rounded-full font-black uppercase">PENALTIES: {penalties}</div>
                         <div className="w-32 h-1.5 bg-black/50 rounded-full overflow-hidden border border-white/5">
                            <div className="h-full bg-mrs-yellow transition-all duration-300" style={{ width: `${trackProgress}%` }}></div>
                         </div>
                    </div>
                </div>

                {/* CONTROLES TÁCTILES (Toda la pantalla dividida en 2) */}
                <div className="absolute inset-0 z-30 flex">
                    <div className="flex-1 cursor-pointer" onClick={() => gameState === 'RACING' && setPlayerLane(l => Math.max(0, l - 1))}></div>
                    <div className="flex-1 cursor-pointer" onClick={() => gameState === 'RACING' && setPlayerLane(l => Math.min(2, l + 1))}></div>
                </div>
            </div>
        </div>

        {/* LEADERBOARD PROFESIONAL */}
        <div className="w-full lg:w-96 bg-gray-900/50 backdrop-blur-md rounded-3xl border border-white/5 p-8 shadow-2xl flex flex-col">
             <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                    <Trophy className="text-mrs-yellow" size={24} />
                    <h3 className="font-display italic text-white text-xl uppercase tracking-tighter">Leaderboard</h3>
                </div>
                <div className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em]">Session 5.0</div>
             </div>

             <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar pr-2">
                 {leaderboard.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center opacity-20 grayscale py-12">
                        <Timer size={48} />
                        <p className="text-xs font-bold uppercase mt-4">No data available</p>
                    </div>
                 ) : (
                     leaderboard.map((entry, idx) => (
                         <div key={idx} className={`p-4 rounded-2xl flex justify-between items-center border transition-all ${idx === 0 ? 'bg-mrs-yellow/5 border-mrs-yellow/30' : 'bg-white/5 border-white/5 hover:border-white/20'}`}>
                             <div className="flex items-center gap-4">
                                 <span className={`font-display text-xl italic w-6 text-center ${idx === 0 ? 'text-mrs-yellow' : 'text-gray-500'}`}>P{idx + 1}</span>
                                 <div>
                                     <p className="font-black text-white uppercase text-xs tracking-wider">{entry.name}</p>
                                     <p className="text-[9px] text-gray-500 font-bold">{entry.date}</p>
                                 </div>
                             </div>
                             <p className="font-mono font-bold text-mrs-red text-sm">{entry.time}</p>
                         </div>
                     ))
                 )}
             </div>
             
             <div className="mt-8 pt-6 border-t border-white/10">
                <div className="flex items-start gap-3 bg-blue-900/20 p-4 rounded-2xl border border-blue-500/20">
                    <Info size={16} className="text-blue-400 mt-1 flex-shrink-0" />
                    <p className="text-[10px] text-blue-200/70 leading-relaxed font-medium">Cada impacto con un rival o charco añade <span className="text-white font-black">+2.000ms</span> a tu tiempo final. La consistencia es clave.</p>
                </div>
             </div>
        </div>
    </div>
  );
};

/* --- REACTION TEST --- */
const ReactionTestGame: React.FC = () => {
  type ReactionState = 'IDLE' | 'PREPARING' | 'WAITING' | 'GO' | 'RESULT' | 'FALSE_START';
  const [state, setState] = useState<ReactionState>('IDLE');
  const [lightsCount, setLightsCount] = useState(0);
  const [reactionTime, setReactionTime] = useState(0);
  const startTimeRef = useRef(0);
  const timeoutRef = useRef<number | null>(null);

  const startSequence = () => {
    setState('PREPARING');
    setLightsCount(0);
    setReactionTime(0);

    for (let i = 1; i <= 5; i++) {
      setTimeout(() => {
        setLightsCount(i);
        if (i === 5) {
          setState('WAITING');
          const randomWait = Math.floor(Math.random() * 2500) + 1000;
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
    } else {
      startSequence();
    }
  };

  const getRating = (time: number) => {
    if (time < 190) return { label: 'MAX VERSTAPPEN', color: 'text-mrs-yellow' };
    if (time < 230) return { label: 'PRO PILOT', color: 'text-green-500' };
    if (time < 300) return { label: 'CASUAL RACER', color: 'text-blue-400' };
    return { label: 'LATIFI LEVEL', color: 'text-red-500' };
  };

  return (
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
        {state === 'IDLE' && <p className="text-gray-500 uppercase font-black tracking-[0.3em] text-xs">Ready for the jump? <br/> Wait for lights out</p>}
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
  );
};

export default MiniGame;
