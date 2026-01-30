
import React, { useState, useEffect, useRef } from 'react';
import { Trophy, Play, RotateCcw, Timer, Flag, Zap, AlertTriangle, ChevronRight, ChevronLeft } from 'lucide-react';
import { LeaderboardEntry } from '../types';

type GameMode = 'TIME_ATTACK' | 'REACTION';

const MiniGame: React.FC = () => {
  const [activeMode, setActiveMode] = useState<GameMode>('TIME_ATTACK');

  return (
    <section id="game" className="py-20 bg-gray-950 text-white relative select-none border-y border-white/5">
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mb-12 text-center">
            <div className="inline-flex items-center gap-2 bg-mrs-red text-white px-5 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-4 shadow-lg shadow-mrs-red/20">
                <Zap size={14} fill="currentColor" /> Centro de Entrenamiento
             </div>
             <h2 className="text-4xl md:text-6xl font-display italic text-white mb-4 uppercase tracking-tighter">PADDOCK <span className="text-mrs-yellow">ZONE</span></h2>
             
             <div className="flex justify-center gap-4 mt-8">
                <button 
                  onClick={() => setActiveMode('TIME_ATTACK')}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold uppercase text-xs transition-all border-2 ${activeMode === 'TIME_ATTACK' ? 'bg-mrs-red border-mrs-red text-white shadow-xl shadow-mrs-red/20' : 'bg-transparent border-white/10 text-gray-500 hover:text-white'}`}
                >
                  <Timer size={18} /> Time Attack
                </button>
                <button 
                  onClick={() => setActiveMode('REACTION')}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold uppercase text-xs transition-all border-2 ${activeMode === 'REACTION' ? 'bg-mrs-red border-mrs-red text-white shadow-xl shadow-mrs-red/20' : 'bg-transparent border-white/10 text-gray-500 hover:text-white'}`}
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

/* --- COMPONENTE 1: TIME ATTACK (FIXED SPEED & VISUALS) --- */
const TimeAttackGame: React.FC = () => {
  const TOTAL_DISTANCE = 50000; 
  const BASE_SPEED = 1200; 
  const MAX_SPEED = 2400;    
  const PENALTY_MS = 2500; 
  
  const [gameState, setGameState] = useState<'MENU' | 'RACING' | 'FINISHED'>('MENU');
  const [playerName, setPlayerName] = useState('');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [playerRank, setPlayerRank] = useState<number | null>(null);
  const [playerLane, setPlayerLane] = useState(1);
  const [displayTime, setDisplayTime] = useState("00:00.000");
  const [progress, setProgress] = useState(0);
  const [penalties, setPenalties] = useState(0);
  const [shake, setShake] = useState(false);
  
  const requestRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const distanceRef = useRef<number>(0);
  const lastFrameTimeRef = useRef<number>(0);
  const obstaclesRef = useRef<{ id: number; lane: number; y: number; type: 'CAR' | 'OIL'; collided: boolean }[]>([]);
  const lastSpawnRef = useRef<number>(0);
  const penaltiesRef = useRef<number>(0);
  const playerLaneRef = useRef<number>(1);

  useEffect(() => {
    const saved = localStorage.getItem('mrs_f1_time_attack_v4');
    if (saved) setLeaderboard(JSON.parse(saved));
  }, []);

  useEffect(() => { playerLaneRef.current = playerLane; }, [playerLane]);

  const startRace = () => {
    if (!playerName.trim()) return alert("Ingresa tu Nickname");
    setGameState('RACING');
    startTimeRef.current = Date.now();
    lastFrameTimeRef.current = performance.now();
    distanceRef.current = 0;
    obstaclesRef.current = [];
    penaltiesRef.current = 0;
    setPenalties(0);
    setProgress(0);
    setPlayerLane(1);
    lastSpawnRef.current = Date.now();
    requestRef.current = requestAnimationFrame(loop);
  };

  const loop = (time: number) => {
    // Calculamos Delta Time correctamente
    const dt = Math.min(0.1, (time - lastFrameTimeRef.current) / 1000); 
    lastFrameTimeRef.current = time;

    const now = Date.now();
    const rawTime = now - startTimeRef.current;
    setDisplayTime(formatTime(rawTime));

    const completionRatio = Math.min(1, distanceRef.current / TOTAL_DISTANCE);
    const currentSpeed = BASE_SPEED + ((MAX_SPEED - BASE_SPEED) * completionRatio);
    
    // Movimiento ajustado: Unidades por segundo reales
    distanceRef.current += currentSpeed * dt; 
    setProgress(Math.min(100, (distanceRef.current / TOTAL_DISTANCE) * 100));

    if (distanceRef.current >= TOTAL_DISTANCE) {
        finishRace(rawTime);
        return;
    }

    const spawnRate = Math.max(300, 1000 - (completionRatio * 700));
    if (now - lastSpawnRef.current > spawnRate) {
        const lane = Math.floor(Math.random() * 3);
        const type = Math.random() > 0.8 ? 'OIL' : 'CAR'; 
        obstaclesRef.current.push({ id: now, lane, y: -20, type, collided: false });
        lastSpawnRef.current = now;
    }

    // Los obstáculos bajan proporcionalmente a la velocidad
    const visualSpeed = 65; 
    obstaclesRef.current.forEach(obs => {
        obs.y += visualSpeed * dt;
    });

    const PLAYER_Y_TOP = 80;
    const PLAYER_Y_BOTTOM = 95;
    obstaclesRef.current.forEach(obs => {
        if (!obs.collided && (obs.lane === playerLaneRef.current) && (obs.y + 10 > PLAYER_Y_TOP) && (obs.y < PLAYER_Y_BOTTOM)) {
            obs.collided = true;
            penaltiesRef.current += 1;
            setPenalties(penaltiesRef.current);
            setShake(true);
            setTimeout(() => setShake(false), 300);
        }
    });

    obstaclesRef.current = obstaclesRef.current.filter(obs => obs.y < 120);
    requestRef.current = requestAnimationFrame(loop);
  };

  const finishRace = (rawTime: number) => {
      cancelAnimationFrame(requestRef.current);
      const finalTotalTime = rawTime + (penaltiesRef.current * PENALTY_MS);
      const newEntry: LeaderboardEntry = { name: playerName, time: formatTime(finalTotalTime), rawTime: finalTotalTime, date: new Date().toISOString().split('T')[0] };
      const newLeaderboard = [...leaderboard, newEntry].sort((a, b) => a.rawTime - b.rawTime);
      setLeaderboard(newLeaderboard);
      localStorage.setItem('mrs_f1_time_attack_v4', JSON.stringify(newLeaderboard));
      setPlayerRank(newLeaderboard.findIndex(e => e.rawTime === finalTotalTime && e.name === playerName) + 1);
      setGameState('FINISHED');
  };

  const formatTime = (ms: number) => {
      const minutes = Math.floor(ms / 60000);
      const seconds = Math.floor((ms % 60000) / 1000);
      const millis = Math.floor((ms % 1000));
      return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${millis.toString().padStart(3, '0')}`;
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
        <div className="w-full max-w-md mx-auto aspect-[3/4] bg-gray-800 rounded-xl border-4 border-gray-700 shadow-2xl overflow-hidden relative">
            {gameState === 'MENU' && (
                <div className="absolute inset-0 z-30 bg-gray-900/95 flex flex-col items-center justify-center p-8">
                    <Flag size={40} className="text-mrs-red mb-6 animate-bounce" />
                    <h3 className="text-3xl font-display italic text-white mb-2 uppercase">Time Attack</h3>
                    <p className="text-xs text-gray-500 mb-8 text-center uppercase tracking-widest leading-relaxed">Evita obstáculos y charcos. <br/> +2.5s por cada choque.</p>
                    <input type="text" placeholder="TU NOMBRE" className="w-full bg-gray-800 border-2 border-gray-600 text-white px-4 py-4 rounded text-center uppercase font-bold focus:border-mrs-red mb-4 outline-none" value={playerName} onChange={(e) => setPlayerName(e.target.value)} maxLength={12} />
                    <button onClick={startRace} className="w-full bg-mrs-yellow hover:bg-yellow-400 text-mrs-black font-black py-4 rounded uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-yellow-500/20">
                        <Play size={20} fill="currentColor" /> Iniciar Carrera
                    </button>
                </div>
            )}

            {gameState === 'FINISHED' && (
                <div className="absolute inset-0 z-30 bg-black/95 flex flex-col items-center justify-center p-8">
                    <h3 className="text-4xl font-display italic text-white mb-4">¡META!</h3>
                    <div className="bg-gray-800 w-full rounded-xl border border-gray-600 p-6 text-center mb-6 shadow-2xl">
                        <div className="text-xs text-gray-500 uppercase font-bold mb-1 tracking-widest">Posición Global</div>
                        <div className="text-6xl font-display text-mrs-yellow mb-6">P{playerRank}</div>
                        <div className="text-2xl font-mono text-white font-bold">{displayTime}</div>
                        <div className="text-[10px] text-mrs-red uppercase mt-2 font-black">Penalizaciones: +{(penalties * 2.5).toFixed(1)}s</div>
                    </div>
                    <button onClick={() => setGameState('MENU')} className="bg-white text-black font-bold py-3 px-8 rounded-full uppercase flex items-center gap-2 hover:bg-mrs-yellow transition-colors shadow-xl">
                        <RotateCcw size={18} /> Reintentar
                    </button>
                </div>
            )}

            <div className={`relative w-full h-full overflow-hidden bg-[#222] ${shake ? 'animate-shake' : ''}`}>
                {/* Carretera */}
                <div className="absolute inset-0 flex">
                    <div className="w-4 bg-green-900 h-full border-r border-white/10"></div>
                    <div className="w-4 h-full" style={{ backgroundImage: `repeating-linear-gradient(0deg, #E10600 0px, #E10600 40px, #ffffff 40px, #ffffff 80px)`, backgroundPosition: `0 ${distanceRef.current}px` }}></div>
                    <div className="flex-1 bg-[#252525] relative">
                        <div className="absolute inset-0 flex justify-between px-[33.33%]">
                            <div className="w-[2px] h-full bg-dashed-line opacity-20" style={{ backgroundPositionY: `${distanceRef.current}px` }}></div>
                            <div className="w-[2px] h-full bg-dashed-line opacity-20" style={{ backgroundPositionY: `${distanceRef.current}px` }}></div>
                        </div>
                        
                        {/* Obstáculos */}
                        {obstaclesRef.current.map(obs => (
                            <div key={obs.id} className="absolute flex justify-center items-center" style={{ top: `${obs.y}%`, left: `${obs.lane * 33.33}%`, width: '33.33%', height: '12%' }}>
                                <div className={`w-[60%] h-full relative ${obs.collided ? 'opacity-20 grayscale scale-90' : ''}`}>
                                    {obs.type === 'CAR' ? (
                                        <div className="w-full h-full bg-blue-700 rounded-sm shadow-xl border-t-8 border-blue-400 relative">
                                            <div className="absolute -top-4 left-0 w-full h-2 bg-blue-900 rounded-full"></div> {/* Alerón front */}
                                            <div className="absolute -bottom-2 left-0 w-full h-4 bg-blue-950"></div> {/* Alerón back */}
                                        </div>
                                    ) : (
                                        <div className="w-10 h-10 bg-black/80 blur-[2px] rounded-full mx-auto mt-4 border border-white/10"></div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {/* Player Car - F1 Look */}
                        <div className="absolute bottom-[2%] transition-all duration-150 ease-out flex justify-center items-center" style={{ left: `${playerLane * 33.33}%`, width: '33.33%', height: '14%' }}>
                            <div className="w-[65%] h-full flex flex-col items-center">
                                <div className="w-full h-1 bg-mrs-red rounded-full mb-1"></div> {/* Alerón Delantero */}
                                <div className="w-4/5 flex-1 bg-gradient-to-b from-mrs-red to-red-900 rounded-t-2xl rounded-b-sm border-x-2 border-white/20 shadow-2xl relative">
                                     <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-3 h-5 bg-black/80 rounded-t-full border border-white/10"></div> {/* Cockpit */}
                                     <div className="absolute -bottom-1 left-[-10%] w-[120%] h-3 bg-red-950 rounded-sm"></div> {/* Alerón Trasero */}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-4 h-full" style={{ backgroundImage: `repeating-linear-gradient(0deg, #E10600 0px, #E10600 40px, #ffffff 40px, #ffffff 80px)`, backgroundPosition: `0 ${distanceRef.current}px` }}></div>
                    <div className="w-4 bg-green-900 h-full border-l border-white/10"></div>
                </div>

                <div className="absolute top-0 left-0 w-full p-4 z-10 flex justify-between items-start font-mono pointer-events-none">
                    <div className="bg-black/80 px-4 py-2 rounded-lg border border-white/10 text-xl font-bold text-white shadow-2xl">{displayTime}</div>
                    <div className="flex flex-col items-end gap-1">
                        <div className="bg-mrs-red text-white text-[10px] px-2 py-1 rounded font-black uppercase">CHOQUES: {penalties}</div>
                        <div className="w-32 h-1 bg-gray-900 rounded-full overflow-hidden">
                             <div className="h-full bg-mrs-yellow transition-all duration-200" style={{ width: `${progress}%` }}></div>
                        </div>
                    </div>
                </div>

                {/* Controles Táctiles Invisibles */}
                <div className="absolute inset-0 flex z-20 cursor-pointer">
                    <div className="flex-1 flex items-center justify-start pl-4 group opacity-0 hover:opacity-100 transition-opacity" onClick={() => gameState === 'RACING' && setPlayerLane(l => Math.max(0, l - 1))}>
                        <div className="bg-white/10 p-4 rounded-full backdrop-blur-sm"><ChevronLeft size={32}/></div>
                    </div>
                    <div className="flex-1 flex items-center justify-end pr-4 group opacity-0 hover:opacity-100 transition-opacity" onClick={() => gameState === 'RACING' && setPlayerLane(l => Math.min(2, l + 1))}>
                        <div className="bg-white/10 p-4 rounded-full backdrop-blur-sm"><ChevronRight size={32}/></div>
                    </div>
                </div>
            </div>
        </div>

        {/* Leaderboard Lateral */}
        <div className="w-full lg:w-80 bg-gray-900 rounded-xl border border-white/5 p-6 shadow-2xl">
             <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-4">
                 <Trophy className="text-mrs-yellow" size={20} />
                 <h3 className="font-display italic text-white text-lg">TOP TIMES</h3>
             </div>
             <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                 {leaderboard.length === 0 ? <div className="text-center py-8 text-gray-600 italic text-xs">Sin registros aún.</div> : 
                     leaderboard.slice(0, 8).map((entry, idx) => (
                         <div key={idx} className="bg-white/5 p-3 rounded flex justify-between items-center border border-white/5 hover:border-mrs-red/30 transition-all">
                             <div className="flex items-center gap-3">
                                 <div className={`font-display text-lg w-5 text-center ${idx < 3 ? 'text-mrs-yellow' : 'text-gray-400'}`}>{idx + 1}</div>
                                 <div className="font-bold text-white uppercase text-[11px] truncate max-w-[90px]">{entry.name}</div>
                             </div>
                             <div className="font-mono font-bold text-mrs-red text-[11px]">{entry.time}</div>
                         </div>
                     ))
                 }
             </div>
        </div>
        <style>{`.bg-dashed-line { background-image: linear-gradient(to bottom, #ffffff 50%, transparent 50%); background-size: 2px 50px; }`}</style>
    </div>
  );
};

/* --- COMPONENTE 2: REACTION TEST (UNCHANGED BUT REFINED) --- */
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
          const randomWait = Math.floor(Math.random() * 3000) + 1200;
          timeoutRef.current = window.setTimeout(lightsOut, randomWait);
        }
      }, i * 750);
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
      const now = performance.now();
      const diff = now - startTimeRef.current;
      setReactionTime(diff);
      setState('RESULT');
    } else if (state === 'IDLE' || state === 'RESULT' || state === 'FALSE_START') {
      startSequence();
    }
  };

  const getRating = (time: number) => {
    if (time < 190) return { label: 'Nivel Verstappen', color: 'text-mrs-yellow' };
    if (time < 240) return { label: 'Piloto Elite', color: 'text-green-500' };
    if (time < 300) return { label: 'Promedio Pro', color: 'text-blue-400' };
    return { label: 'Manco con Lag', color: 'text-red-500' };
  };

  return (
    <div className="max-w-2xl mx-auto bg-gray-900/40 p-8 md:p-12 rounded-[2.5rem] border border-white/5 shadow-3xl text-center backdrop-blur-sm">
      <div className="mb-10 flex justify-center gap-4">
        {[1, 2, 3, 4, 5].map((num) => (
          <div key={num} className="flex flex-col gap-3">
             <div className={`w-12 h-12 md:w-16 md:h-16 rounded-full border-4 border-black shadow-inner relative flex items-center justify-center transition-all duration-200 ${lightsCount >= num ? 'bg-red-950' : 'bg-gray-800'}`}>
                {lightsCount >= num && (
                   <div className="w-4/5 h-4/5 bg-mrs-red rounded-full animate-pulse shadow-[0_0_25px_rgba(225,6,0,0.9)]"></div>
                )}
             </div>
             <div className="w-full h-1.5 bg-gray-800 rounded-full"></div>
          </div>
        ))}
      </div>

      <div className="min-h-[160px] flex flex-col items-center justify-center mb-10">
        {state === 'IDLE' && <p className="text-gray-500 uppercase font-black tracking-widest text-sm">Presiona para calentar motores</p>}
        {state === 'PREPARING' && <p className="text-mrs-red font-black animate-pulse text-2xl uppercase italic">Semáforos Enciendo...</p>}
        {state === 'WAITING' && <p className="text-mrs-yellow font-black text-3xl uppercase italic animate-bounce tracking-tighter">¡LISTO PARA EL SALTO!</p>}
        {state === 'GO' && <p className="text-green-500 font-black text-7xl italic uppercase animate-ping tracking-tighter">¡BOX BOX!</p>}
        {state === 'FALSE_START' && (
          <div className="text-mrs-red flex flex-col items-center gap-3 animate-shake">
            <AlertTriangle size={56} />
            <p className="font-black text-4xl italic uppercase">JUMP START</p>
            <p className="text-[10px] opacity-60 uppercase font-bold tracking-widest">Penalización: Sin puntos en esta sesión.</p>
          </div>
        )}
        {state === 'RESULT' && (
          <div className="animate-in fade-in zoom-in duration-300 flex flex-col items-center">
            <div className="text-7xl md:text-8xl font-mono font-black text-white mb-2 leading-none">{reactionTime.toFixed(0)}<span className="text-xl ml-1 text-gray-500">ms</span></div>
            <div className={`text-2xl font-display italic uppercase tracking-tight ${getRating(reactionTime).color}`}>{getRating(reactionTime).label}</div>
          </div>
        )}
      </div>

      <button 
        onClick={handleAction}
        className={`w-full max-w-sm py-8 md:py-12 rounded-2xl font-display italic text-3xl md:text-5xl uppercase tracking-tighter transition-all shadow-2xl border-b-8 active:border-b-0 active:translate-y-2 select-none ${
          state === 'GO' ? 'bg-green-600 border-green-800 text-white' : 
          state === 'PREPARING' || state === 'WAITING' ? 'bg-mrs-red border-red-900 text-white cursor-pointer active:scale-95' : 
          'bg-white border-gray-300 text-black hover:bg-mrs-yellow'
        }`}
      >
        {state === 'IDLE' ? 'START' : state === 'GO' ? '¡CLIC!' : state === 'RESULT' || state === 'FALSE_START' ? 'REINTENTAR' : 'ESPERA...'}
      </button>

      <div className="mt-12 text-[10px] text-gray-600 uppercase font-black tracking-[0.25em] max-w-sm mx-auto leading-loose opacity-50">
        Instrucciones: Haz clic cuando se apaguen las luces. <br/> El récord mundial real es de Bottas: 40ms.
      </div>
    </div>
  );
};

export default MiniGame;
