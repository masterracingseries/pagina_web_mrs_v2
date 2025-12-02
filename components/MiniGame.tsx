
import React, { useState, useEffect, useRef } from 'react';
import { Trophy, Play, RotateCcw, Timer, Flag } from 'lucide-react';
import { LeaderboardEntry } from '../types';

const MiniGame: React.FC = () => {
  // Game Tuning
  const TOTAL_DISTANCE = 45000; 
  const BASE_SPEED = 0.8;   // Speed in % of screen height per frame
  const MAX_SPEED = 4.0;    
  const PENALTY_MS = 2000; 
  
  // State
  const [gameState, setGameState] = useState<'MENU' | 'RACING' | 'FINISHED'>('MENU');
  const [playerName, setPlayerName] = useState('');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [playerRank, setPlayerRank] = useState<number | null>(null);

  // Racing UI State
  const [playerLane, setPlayerLane] = useState(1);
  const [displayTime, setDisplayTime] = useState("00:00.000");
  const [progress, setProgress] = useState(0);
  const [penalties, setPenalties] = useState(0);
  const [shake, setShake] = useState(false);
  
  // Game Loop Refs
  const requestRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const distanceRef = useRef<number>(0);
  const speedRef = useRef<number>(BASE_SPEED);
  
  // Coordinate System: Y is 0-100% of container
  const obstaclesRef = useRef<{ id: number; lane: number; y: number; type: 'CAR' | 'OIL'; collided: boolean }[]>([]);
  const lastSpawnRef = useRef<number>(0);
  const finishTimeRef = useRef<number>(0);
  const penaltiesRef = useRef<number>(0);
  const playerLaneRef = useRef<number>(1); // Sync ref for loop
  
  // Load Leaderboard
  useEffect(() => {
    const saved = localStorage.getItem('mrs_f1_time_attack_v3');
    if (saved) {
      setLeaderboard(JSON.parse(saved));
    }
  }, []);

  // Update ref when state changes to prevent stale closures in loop
  useEffect(() => {
    playerLaneRef.current = playerLane;
  }, [playerLane]);

  // Keyboard Controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'RACING') return;
      if (e.key === 'ArrowLeft') {
        setPlayerLane((prev) => Math.max(0, prev - 1));
      } else if (e.key === 'ArrowRight') {
        setPlayerLane((prev) => Math.min(2, prev + 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState]);

  const startRace = () => {
    if (!playerName.trim()) {
        alert("Ingresa tu Nickname (Piloto)");
        return;
    }
    setGameState('RACING');
    startTimeRef.current = Date.now();
    distanceRef.current = 0;
    speedRef.current = BASE_SPEED;
    obstaclesRef.current = [];
    
    // Reset Penalties
    penaltiesRef.current = 0;
    setPenalties(0);
    
    setProgress(0);
    setPlayerRank(null);
    setPlayerLane(1);
    playerLaneRef.current = 1;
    lastSpawnRef.current = Date.now();

    requestRef.current = requestAnimationFrame(loop);
  };

  const loop = () => {
    const now = Date.now();
    const rawTime = now - startTimeRef.current;
    
    setDisplayTime(formatTime(rawTime));

    // --- PROGRESSION LOGIC ---
    const completionRatio = Math.min(1, distanceRef.current / TOTAL_DISTANCE);
    
    // Speed increases from BASE to MAX based on completion
    speedRef.current = BASE_SPEED + ((MAX_SPEED - BASE_SPEED) * completionRatio);
    
    // Move "Distance" tracker
    distanceRef.current += (speedRef.current * 10); 
    
    const pct = Math.min(100, (distanceRef.current / TOTAL_DISTANCE) * 100);
    setProgress(pct);

    // --- FINISH LOGIC ---
    if (distanceRef.current >= TOTAL_DISTANCE) {
        finishRace(rawTime);
        return;
    }

    // --- SPAWN LOGIC ---
    const spawnRate = Math.max(400, 1200 - (completionRatio * 800)); // Faster spawns later
    
    if (now - lastSpawnRef.current > spawnRate) {
        const lane = Math.floor(Math.random() * 3);
        const type = Math.random() > 0.7 ? 'OIL' : 'CAR'; 
        
        // Prevent overlap
        const lastObs = obstaclesRef.current[obstaclesRef.current.length - 1];
        // obs.y is in % (starts at -20)
        const safeToSpawn = !lastObs || lastObs.y > 25 || lastObs.lane !== lane;

        if (safeToSpawn) {
            obstaclesRef.current.push({ id: now, lane, y: -20, type, collided: false });
            lastSpawnRef.current = now;
        }
    }

    // --- OBSTACLE MOVEMENT ---
    obstaclesRef.current.forEach(obs => {
        obs.y += speedRef.current;
    });

    // --- COLLISION DETECTION ---
    // Visual Logic:
    // Player is at bottom: ~80% to ~98% (Height ~18%)
    // Obstacle Height: ~15%
    
    const PLAYER_Y_TOP = 80;
    const PLAYER_Y_BOTTOM = 98;
    const OBS_HEIGHT = 15;

    obstaclesRef.current.forEach(obs => {
        if (!obs.collided) {
            const obsTop = obs.y;
            const obsBottom = obs.y + OBS_HEIGHT;

            // 1. Check Lane
            const isLaneMatch = obs.lane === playerLaneRef.current;

            // 2. Check Vertical Overlap
            const isVertOverlap = (obsBottom > PLAYER_Y_TOP) && (obsTop < PLAYER_Y_BOTTOM);

            if (isLaneMatch && isVertOverlap) {
                obs.collided = true;
                handleCollision();
            }
        }
    });

    // Cleanup off-screen obstacles (> 120%)
    obstaclesRef.current = obstaclesRef.current.filter(obs => obs.y < 120);

    requestRef.current = requestAnimationFrame(loop);
  };

  const handleCollision = () => {
      penaltiesRef.current += 1;
      setPenalties(penaltiesRef.current);
      
      setShake(true);
      setTimeout(() => setShake(false), 300);
      
      // Slowdown penalty
      speedRef.current = Math.max(BASE_SPEED, speedRef.current * 0.5);
  };

  const finishRace = (rawTime: number) => {
      cancelAnimationFrame(requestRef.current);
      finishTimeRef.current = rawTime;
      setGameState('FINISHED');

      // Calculate Total Time
      const finalPenalties = penaltiesRef.current;
      const penaltyTime = finalPenalties * PENALTY_MS;
      const finalTotalTime = rawTime + penaltyTime;
      const finalTimeString = formatTime(finalTotalTime);

      const newEntry: LeaderboardEntry = {
          name: playerName,
          time: finalTimeString,
          rawTime: finalTotalTime,
          date: new Date().toISOString().split('T')[0]
      };

      const newLeaderboard = [...leaderboard, newEntry].sort((a, b) => a.rawTime - b.rawTime);
      setLeaderboard(newLeaderboard);
      localStorage.setItem('mrs_f1_time_attack_v3', JSON.stringify(newLeaderboard));

      const rank = newLeaderboard.findIndex(e => e.rawTime === finalTotalTime && e.name === playerName) + 1;
      setPlayerRank(rank);
  };

  const formatTime = (ms: number) => {
      const minutes = Math.floor(ms / 60000);
      const seconds = Math.floor((ms % 60000) / 1000);
      const millis = Math.floor((ms % 1000) / 1);
      return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${millis.toString().padStart(3, '0')}`;
  };

  // --- SVG ASSETS ---
  const TopDownCar = ({ color }: { color: string }) => (
    <svg viewBox="0 0 100 200" className="w-full h-full drop-shadow-xl" style={{ filter: 'drop-shadow(0px 10px 5px rgba(0,0,0,0.5))' }}>
        {/* Wheels */}
        <rect x="0" y="20" width="18" height="35" rx="4" fill="#111" />
        <rect x="82" y="20" width="18" height="35" rx="4" fill="#111" />
        <rect x="0" y="140" width="18" height="35" rx="4" fill="#111" />
        <rect x="82" y="140" width="18" height="35" rx="4" fill="#111" />
        {/* Body */}
        <path d="M50 10 L70 40 L80 60 L80 130 L70 180 L30 180 L20 130 L20 60 L30 40 Z" fill={color} stroke="white" strokeWidth="2" />
        {/* Front Wing */}
        <rect x="20" y="5" width="60" height="10" rx="2" fill={color} stroke="white" strokeWidth="1" />
        {/* Rear Wing */}
        <rect x="15" y="185" width="70" height="10" rx="2" fill={color} stroke="white" strokeWidth="1" />
        {/* Driver Helmet */}
        <circle cx="50" cy="90" r="10" fill="#333" />
        <circle cx="50" cy="90" r="7" fill="#FFD700" />
    </svg>
  );

  const BackmarkerCar = ({ collided }: { collided: boolean }) => (
      <svg viewBox="0 0 100 200" className={`w-full h-full drop-shadow-md transition-all duration-200 ${collided ? 'opacity-40 scale-90 grayscale' : 'opacity-100'}`}>
          <rect x="5" y="25" width="15" height="25" rx="2" fill="#222" />
          <rect x="80" y="25" width="15" height="25" rx="2" fill="#222" />
          <rect x="5" y="135" width="15" height="25" rx="2" fill="#222" />
          <rect x="80" y="135" width="15" height="25" rx="2" fill="#222" />
          <path d="M50 15 L70 45 L75 65 L75 115 L70 175 L30 175 L25 115 L25 65 L30 45 Z" fill={collided ? "#ef4444" : "#0ea5e9"} stroke="white" strokeWidth="2" />
          <circle cx="50" cy="90" r="8" fill="#fff" />
      </svg>
  );

  const OilSpill = ({ collided }: { collided: boolean }) => (
      <svg viewBox="0 0 100 100" className={`w-full h-full transition-opacity duration-200 ${collided ? 'opacity-20' : 'opacity-90'}`}>
          <path d="M50 20 Q70 10 80 30 T90 60 T60 90 T20 80 T10 40 T30 20 Z" fill="#111" stroke="#333" strokeWidth="2" />
          <path d="M30 30 Q40 25 45 35" stroke="#444" strokeWidth="2" fill="none" />
      </svg>
  );

  return (
    <section id="game" className="py-20 bg-gray-900 text-white relative select-none">
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mb-8 text-center">
            <div className="inline-flex items-center gap-2 bg-mrs-red text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-2">
                <Timer size={14} /> Time Attack Mode
             </div>
             <h2 className="text-4xl md:text-5xl font-display italic text-white mb-2">MRS PADDOCK ZONE</h2>
             <p className="text-gray-400">Vuelta Rápida: Evita el tráfico y el aceite. <span className="text-mrs-red font-bold">¡Cada golpe suma +2.0s!</span></p>
       </div>

       <div className="max-w-7xl mx-auto px-4 flex flex-col lg:flex-row gap-8 items-start justify-center">
            
            {/* --- GAME CONTAINER --- */}
            <div className="w-full max-w-md mx-auto aspect-[3/4] bg-gray-800 rounded-xl border-4 border-gray-700 shadow-2xl overflow-hidden relative">
                
                {/* --- MENU SCREEN --- */}
                {gameState === 'MENU' && (
                    <div className="absolute inset-0 z-30 bg-gray-900/95 flex flex-col items-center justify-center p-8">
                         <div className="w-20 h-20 bg-mrs-red rounded-full flex items-center justify-center mb-6 animate-bounce">
                             <Flag size={40} className="text-white" />
                         </div>
                         <h3 className="text-3xl font-display italic text-white mb-2">READY TO RACE?</h3>
                         <input 
                            type="text" 
                            placeholder="TU NOMBRE (NICKNAME)" 
                            className="w-full bg-gray-800 border-2 border-gray-600 text-white px-4 py-4 rounded text-center uppercase font-bold focus:outline-none focus:border-mrs-red mb-4"
                            value={playerName}
                            onChange={(e) => setPlayerName(e.target.value)}
                            maxLength={12}
                        />
                        <button onClick={startRace} className="w-full bg-mrs-yellow hover:bg-yellow-400 text-mrs-black font-black py-4 rounded uppercase tracking-widest flex items-center justify-center gap-2">
                            <Play size={24} fill="currentColor" /> Start Engine
                        </button>
                    </div>
                )}

                {/* --- FINISHED SCREEN --- */}
                {gameState === 'FINISHED' && (
                    <div className="absolute inset-0 z-30 bg-black/95 flex flex-col items-center justify-center p-8">
                        <h3 className="text-4xl font-display italic text-white mb-4">FINISH!</h3>
                        <div className="bg-gray-800 w-full rounded-xl border border-gray-600 p-6 text-center mb-6">
                            <div className="text-xs text-gray-400 uppercase font-bold mb-1">Posición Global</div>
                            <div className="text-6xl font-display text-mrs-yellow mb-6">P{playerRank}</div>
                            <div className="space-y-2 border-t border-gray-700 pt-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Tiempo Pista:</span>
                                    <span className="font-mono">{formatTime(finishTimeRef.current)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Penalizaciones:</span>
                                    <span className="font-mono text-mrs-red">+{penalties * 2}.000s</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold border-t border-gray-700 pt-2 mt-2">
                                    <span className="text-white">TOTAL:</span>
                                    <span className="font-mono text-mrs-yellow">{formatTime(finishTimeRef.current + (penalties * PENALTY_MS))}</span>
                                </div>
                            </div>
                        </div>
                        <button onClick={() => setGameState('MENU')} className="bg-white text-black font-bold py-3 px-8 rounded-full uppercase flex items-center gap-2">
                            <RotateCcw size={18} /> Intentar de nuevo
                        </button>
                    </div>
                )}

                {/* --- GAMEPLAY LAYER --- */}
                <div className={`relative w-full h-full overflow-hidden bg-gray-800 ${shake ? 'animate-shake' : ''}`}>
                    <div className={`absolute inset-0 bg-red-600 z-20 pointer-events-none transition-opacity duration-100 ${shake ? 'opacity-30' : 'opacity-0'}`}></div>

                    {/* Track */}
                    <div className="absolute inset-0 flex">
                        <div className="w-4 bg-green-900 h-full"></div>
                        {/* Kerbs */}
                        <div className="w-4 h-full" style={{ backgroundImage: `repeating-linear-gradient(0deg, #E10600 0px, #E10600 40px, #ffffff 40px, #ffffff 80px)`, backgroundPosition: `0 ${distanceRef.current}px` }}></div>
                        
                        {/* Asphalt */}
                        <div className="flex-1 bg-[#333] relative overflow-hidden">
                            {/* Moving Texture */}
                            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/asfalt-dark.png')", backgroundPositionY: `${distanceRef.current}px` }}></div>
                            {/* Lane Markers */}
                            <div className="absolute inset-0 flex justify-between px-[33.33%]">
                                <div className="w-[2px] h-full bg-dashed-line opacity-30" style={{ backgroundPositionY: `${distanceRef.current}px` }}></div>
                                <div className="w-[2px] h-full bg-dashed-line opacity-30" style={{ backgroundPositionY: `${distanceRef.current}px` }}></div>
                            </div>

                            {/* OBSTACLES */}
                            {obstaclesRef.current.map(obs => (
                                <div 
                                    key={obs.id}
                                    className="absolute transition-transform duration-75 flex justify-center items-center"
                                    style={{ 
                                        top: `${obs.y}%`, 
                                        left: `${obs.lane * 33.33}%`,
                                        width: '33.33%',
                                        height: '15%',
                                    }}
                                >
                                    <div className="w-[70%] h-full">
                                        {obs.type === 'CAR' ? <BackmarkerCar collided={obs.collided} /> : <OilSpill collided={obs.collided} />}
                                    </div>
                                </div>
                            ))}

                            {/* PLAYER */}
                            <div 
                                className="absolute bottom-[2%] transition-all duration-100 ease-linear flex justify-center items-center"
                                style={{ 
                                    left: `${playerLane * 33.33}%`,
                                    width: '33.33%',
                                    height: '18%',
                                }}
                            >
                                <div className="w-[70%] h-full">
                                     <TopDownCar color="#E10600" />
                                </div>
                            </div>
                        </div>

                        {/* Kerbs */}
                        <div className="w-4 h-full" style={{ backgroundImage: `repeating-linear-gradient(0deg, #E10600 0px, #E10600 40px, #ffffff 40px, #ffffff 80px)`, backgroundPosition: `0 ${distanceRef.current}px` }}></div>
                        <div className="w-4 bg-green-900 h-full"></div>
                    </div>

                    {/* HUD */}
                    <div className="absolute top-0 left-0 w-full p-4 z-10 flex justify-between items-start font-mono">
                        <div className="bg-black/60 px-3 py-1 rounded border border-white/20 text-xl font-bold text-white">{displayTime}</div>
                        {penalties > 0 && (
                            <div className="bg-red-600/90 px-3 py-1 rounded border border-white/20 animate-pulse text-xl font-bold text-white">+{penalties * 2}s</div>
                        )}
                    </div>
                    
                    {/* Controls Overlay */}
                    <div className="absolute inset-0 flex z-20 opacity-0 cursor-pointer">
                        <div className="flex-1" onClick={() => { if(gameState === 'RACING') { setPlayerLane(l => Math.max(0, l - 1)); } }}></div>
                        <div className="flex-1" onClick={() => { if(gameState === 'RACING') { setPlayerLane(l => Math.min(2, l + 1)); } }}></div>
                    </div>
                </div>
            </div>

            {/* --- LEADERBOARD --- */}
            <div className="w-full lg:w-80 bg-gray-800 rounded-xl border border-gray-700 p-6">
                 <div className="flex items-center gap-2 mb-4 border-b border-gray-700 pb-4">
                     <Trophy className="text-mrs-yellow" size={20} />
                     <h3 className="font-display italic text-white text-lg">TOP TIEMPOS</h3>
                 </div>
                 <div className="space-y-2 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
                     {leaderboard.length === 0 ? <div className="text-center py-8 text-gray-500 italic">Sin registros.</div> : 
                         leaderboard.slice(0, 10).map((entry, idx) => (
                             <div key={idx} className="bg-gray-900 p-3 rounded border border-gray-700 flex justify-between items-center">
                                 <div className="flex items-center gap-3">
                                     <div className={`font-display text-lg w-6 text-center ${idx < 3 ? 'text-mrs-yellow' : 'text-gray-600'}`}>{idx + 1}</div>
                                     <div className="font-bold text-white uppercase text-sm truncate max-w-[100px]">{entry.name}</div>
                                 </div>
                                 <div className="font-mono font-bold text-mrs-red text-sm">{entry.time}</div>
                             </div>
                         ))
                     }
                 </div>
            </div>
       </div>

       <style>{`
          .bg-dashed-line { background-image: linear-gradient(to bottom, #ffffff 50%, transparent 50%); background-size: 2px 40px; }
          @keyframes shake { 0% { transform: translate(1px, 1px) rotate(0deg); } 10% { transform: translate(-1px, -2px) rotate(-1deg); } 20% { transform: translate(-3px, 0px) rotate(1deg); } 30% { transform: translate(3px, 2px) rotate(0deg); } 40% { transform: translate(1px, -1px) rotate(1deg); } 50% { transform: translate(-1px, 2px) rotate(-1deg); } 60% { transform: translate(-3px, 1px) rotate(0deg); } 70% { transform: translate(3px, 1px) rotate(-1deg); } 80% { transform: translate(-1px, -1px) rotate(1deg); } 90% { transform: translate(1px, 2px) rotate(0deg); } 100% { transform: translate(1px, -2px) rotate(-1deg); } }
          .animate-shake { animation: shake 0.3s cubic-bezier(.36,.07,.19,.97) both; }
       `}</style>
    </section>
  );
};

export default MiniGame;
