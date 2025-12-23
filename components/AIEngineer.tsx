
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Send, Wallet, Loader2, AlertCircle, ExternalLink, Info, Terminal } from 'lucide-react';
import { GCSDivisionData } from '../types';

const GCS_BASE_URL = 'https://storage.googleapis.com/mrs-standings-season3';

interface GroundingSource {
  title: string;
  uri: string;
}

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  sources?: GroundingSource[];
}

const QUICK_ACTIONS = [
  "🔧 Setup para Australia",
  "🏎️ ¿Quién ganó el último GP?",
  "🏆 Ver tabla de la MRS",
  "💰 Cuenta para pagar",
  "🇦🇷 Noticias de Colapinto"
];

const LOADING_MESSAGES = [
  "Analizando tu pobreza con telemetría...",
  "Buscando si depositaste las 5 lucas, barsa...",
  "Calculando comisión por asesoría premium...",
  "Viendo si te alcanza el cupo de la cuenta RUT...",
  "Puteando al proveedor de internet (no he pagado)...",
  "Echándole carbón al servidor, espera un poco wn..."
];

const AIEngineer: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'model', text: 'Habla rápido que el tiempo es plata. ¿Vienes por un setup, a ver la tabla o vas a seguir de barsa quitándome el tiempo sin pagar la inscripción? Suelta la firme altiro.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState(LOADING_MESSAGES[0]);
  const [standingsContext, setStandingsContext] = useState<string>('');
  const [keyStatus, setKeyStatus] = useState<'checking' | 'ok' | 'missing'>('checking');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // DIAGNÓSTICO DE API KEY
    const apiKey = process.env.API_KEY;
    if (!apiKey || apiKey === "undefined" || apiKey === "" || apiKey.includes("VITE_API_KEY")) {
        console.error("🚨 [MRS DIAGNOSTIC] API_KEY no detectada. Revisa los Secrets de GitHub (VITE_API_KEY).");
        setKeyStatus('missing');
    } else {
        console.log("✅ [MRS DIAGNOSTIC] API_KEY detectada correctamente.");
        setKeyStatus('ok');
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  useEffect(() => {
    const fetchAllStandings = async () => {
        let contextString = "LIGA MRS - STATUS ACTUAL:\n";
        for (let i = 1; i <= 4; i++) {
            try {
                const response = await fetch(`${GCS_BASE_URL}/division_${i}.json?cachebust=${Date.now()}`);
                if (response.ok) {
                    const data: GCSDivisionData = await response.json();
                    contextString += `DIV ${i}: Top 3 es ${data.pilotos.slice(0,3).map(d => d.id).join(', ')}\n`;
                }
            } catch (e) {}
        }
        setStandingsContext(contextString);
    };
    fetchAllStandings();
  }, []);

  const handleSend = async (textOverride?: string) => {
    const textToSend = textOverride || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    setLoadingText(LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)]);

    try {
      // Inicializar según las reglas de la SDK
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const systemInstruction = `Eres "IA-CETAS" (Sebastian Munzenmayer), el fundador de MRS. 
      Habla como un chileno de nicho de simracing (wn, cachái, barsa, perkin, "soltar la firme"). 
      Eres tacaño, pesado y siempre pides que paguen la inscripción de la Season 4.
      CONTEXTO LIGA MRS (Úsalo si preguntan por resultados):\n${standingsContext}`;

      const history = messages
        .filter(m => m.id !== '1') // El historial para Gemini debe empezar con User
        .concat(userMsg)
        .map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
        }));

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: history,
        config: {
            systemInstruction: systemInstruction,
            tools: [{ googleSearch: {} }] 
        },
      });

      const responseText = response.text || "Se me cortó la luz en el server, wn. Repite la pregunta.";
      
      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      const sources: GroundingSource[] = [];
      if (groundingChunks) {
          groundingChunks.forEach((chunk: any) => {
              if (chunk.web) {
                  sources.push({ title: chunk.web.title, uri: chunk.web.uri });
              }
          });
      }

      setMessages(prev => [...prev, { 
        id: Date.now().toString(), 
        role: 'model', 
        text: responseText,
        sources: sources.length > 0 ? sources : undefined
      }]);

    } catch (error: any) {
      console.error("Error en IA-CETAS:", error);
      let errorMsg = '¡Paga la inscripción, barsa culiao! El servidor me está cobrando comisión y no tengo ni uno.';
      
      const apiKey = process.env.API_KEY;
      if (!apiKey || apiKey === "undefined" || apiKey.includes("VITE_API_KEY")) {
          errorMsg = 'Oye wn, la API Key no llegó al servidor. ¡Revisa los Secrets de GitHub (VITE_API_KEY), perkin!';
      } else if (error.message?.includes("quota")) {
          errorMsg = 'Me gastaste los tokens gratis de este mes. ¡Suelta las 5 lucas para el plan premium!';
      }

      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: errorMsg }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="ai-engineer" className="py-12 md:py-24 bg-mrs-black border-t border-gray-800">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* PANEL DE DIAGNÓSTICO (Solo visible si hay error de configuración) */}
        {keyStatus === 'missing' && (
            <div className="mb-8 bg-red-900/20 border-2 border-red-500 p-4 rounded-xl flex items-center gap-4 animate-pulse">
                <Terminal className="text-red-500 flex-shrink-0" size={24} />
                <div className="text-xs font-bold text-red-200">
                    <p className="uppercase tracking-widest mb-1">Error de Telemetría (API KEY)</p>
                    <p className="opacity-70">GitHub Secrets: <span className="text-white">VITE_API_KEY</span> no configurada o mal nombrada en el deploy.</p>
                </div>
            </div>
        )}

        <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-12">
             <div className="relative group">
                 <div className="absolute -inset-4 bg-mrs-red rounded-full blur-2xl opacity-10 group-hover:opacity-20 transition duration-1000"></div>
                 <div className="relative w-32 h-32 md:w-44 md:h-44 rounded-full border-4 border-white/10 overflow-hidden bg-gray-900 shadow-[0_0_50px_rgba(225,6,0,0.3)]">
                     <img 
                        src="images/gif_iacetas.gif" 
                        alt="IA-CETAS FACE" 
                        className="w-full h-full object-cover grayscale brightness-75 hover:grayscale-0 hover:brightness-100 transition-all duration-700"
                        onError={(e) => { e.currentTarget.src = "https://ui-avatars.com/api/?name=IA+cetas&background=E10600&color=fff"; }}
                     />
                 </div>
                 <div className="absolute top-0 right-0 bg-mrs-red text-white p-2 rounded-full border-4 border-mrs-black animate-pulse">
                     <AlertCircle size={20} />
                 </div>
             </div>
             <div className="text-center md:text-left">
                 <h2 className="text-5xl md:text-7xl font-display italic text-white tracking-tighter leading-none">
                    IA-<span className="text-mrs-red">CETAS</span>
                 </h2>
                 <p className="text-mrs-yellow text-[10px] md:text-xs font-black uppercase tracking-[0.3em] mt-3">
                    Master Engineer & Debt Collector
                 </p>
             </div>
        </div>

        <div className="bg-gray-900 border border-gray-700 rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.6)] flex flex-col h-[700px] md:h-[800px]">
            <div className="bg-gray-800/90 backdrop-blur-xl p-5 flex justify-between items-center border-b border-gray-700">
                <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-[11px] font-black uppercase tracking-widest text-white">Estado: Cobrando por pensar</span>
                </div>
                <div className="flex items-center gap-2 bg-mrs-black/50 px-3 py-1.5 rounded-full border border-gray-700">
                    <Wallet size={14} className="text-mrs-yellow" />
                    <span className="text-[10px] font-bold uppercase text-gray-300">Deuda Estimada: $40.000 CLP</span>
                </div>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-10 space-y-8 custom-scrollbar bg-carbon">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`relative max-w-[95%] md:max-w-[85%] p-5 rounded-3xl text-sm md:text-base leading-relaxed shadow-2xl transition-all ${
                            msg.role === 'user' 
                                ? 'bg-mrs-red text-white rounded-tr-none' 
                                : 'bg-gray-800 text-gray-100 border border-gray-700 rounded-tl-none border-l-4 border-l-mrs-yellow'
                        }`}>
                            <div className="whitespace-pre-wrap">{msg.text}</div>
                            {msg.sources && (
                                <div className="mt-4 pt-4 border-t border-white/10">
                                    <div className="flex items-center gap-2 text-[10px] font-black uppercase text-mrs-yellow mb-2">
                                        <Info size={12} /> Fuentes de la Telemetría:
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {msg.sources.slice(0, 3).map((source, idx) => (
                                            <a key={idx} href={source.uri} target="_blank" rel="noopener noreferrer" className="bg-gray-900/50 hover:bg-mrs-yellow hover:text-mrs-black border border-gray-600 px-2 py-1 rounded text-[9px] font-bold flex items-center gap-1 transition-all">
                                                <ExternalLink size={8} /> {source.title}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-gray-800/80 backdrop-blur-sm border border-mrs-red/30 p-5 rounded-3xl flex items-center gap-4">
                            <Loader2 size={20} className="animate-spin text-mrs-red" />
                            <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">{loadingText}</span>
                        </div>
                    </div>
                )}
            </div>

            <div className="px-4 py-4 overflow-x-auto flex gap-3 bg-gray-950/60 border-t border-gray-800 no-scrollbar">
                {QUICK_ACTIONS.map((action, idx) => (
                    <button key={idx} onClick={() => handleSend(action)} className="whitespace-nowrap bg-gray-800/60 text-gray-400 text-[10px] md:text-xs px-5 py-2.5 rounded-full border border-gray-700 hover:text-white hover:border-mrs-yellow transition-all font-bold">
                        {action}
                    </button>
                ))}
            </div>

            <div className="p-5 md:p-8 bg-gray-800 border-t border-gray-700">
                <div className="relative flex items-center">
                    <input 
                        type="text" 
                        value={input} 
                        onChange={(e) => setInput(e.target.value)} 
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()} 
                        placeholder="Pregunta algo, pero no me hagas perder el tiempo wn..." 
                        className="w-full bg-gray-900 border-2 border-gray-700 text-white rounded-full py-5 pl-8 pr-20 focus:border-mrs-red outline-none text-sm md:text-base transition-all"
                    />
                    <button onClick={() => handleSend()} disabled={loading || !input.trim()} className="absolute right-3 p-4 bg-mrs-red text-white rounded-full transition-all hover:scale-110 shadow-mrs-red/30">
                        <Send size={24} />
                    </button>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
};

export default AIEngineer;
