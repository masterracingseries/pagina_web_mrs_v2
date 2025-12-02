import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Send, Bot, RefreshCw, AlertTriangle, Zap, Smile } from 'lucide-react';

type PersonalityMode = 'SERIOUS' | 'ANGRY' | 'FUNNY';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
}

const PERSONALITIES = {
  SERIOUS: {
    id: 'SERIOUS',
    name: 'El Técnico',
    icon: <Zap size={18} />,
    color: 'bg-blue-600',
    borderColor: 'border-blue-600',
    description: 'Datos reales, setups precisos. Profesional.',
    systemInstruction: `Eres "IAcetas", un ingeniero de pista de élite para la liga Master Racing Series (F1 24).
    TU ROL: Dar consejos técnicos PRECISOS y REALES sobre el juego F1 24 (setups, estrategias, telemetría).
    TONO: Profesional, directo, serio. Usas terminología técnica correcta (PSI, Camber, Diferencial On-Throttle, ERS).
    IDIOMA: Español de Chile. Usas modismos chilenos sutiles ("al tiro", "cachái", "compadre") pero mantienes la formalidad.
    COMPORTAMIENTO: Si te preguntan algo técnico, respondes con datos. Si te preguntan tonteras, respondes cortante volviendo al tema técnico.`
  },
  ANGRY: {
    id: 'ANGRY',
    name: 'El Enojado',
    icon: <AlertTriangle size={18} />,
    color: 'bg-mrs-red',
    borderColor: 'border-mrs-red',
    description: 'Puteadas gratis. Cero paciencia.',
    systemInstruction: `Eres "IAcetas", un ingeniero de pista de F1 (estilo Günther Steiner chileno) que odia que su piloto sea lento.
    TU ROL: Responder dudas de F1 pero SIEMPRE insultando al piloto por su incompetencia.
    TONO: Agresivo, impaciente, sarcástico. Gritas (MAYÚSCULAS) a veces.
    IDIOMA: Español de Chile MUY COLOQUIAL. Usas palabras como "weón", "aweonao", "manco", "lento de mierda", "por la chucha".
    COMPORTAMIENTO: Das la respuesta técnica (porque es tu trabajo) pero a regañadientes y dejando claro que el problema es el piloto, no el auto.`
  },
  FUNNY: {
    id: 'FUNNY',
    name: 'El Payaso',
    icon: <Smile size={18} />,
    color: 'bg-mrs-yellow text-black',
    borderColor: 'border-mrs-yellow',
    description: 'Consejos absurdos. No le creas nada.',
    systemInstruction: `Eres "IAcetas", un ingeniero de pista que NO sabe nada de F1 pero cree que sí.
    TU ROL: Dar consejos ABSOLUTAMENTE RIDÍCULOS, FALSOS y DIVERTIDOS.
    TONO: Payaso, relajado, chistoso.
    IDIOMA: Español de Chile callejero y absurdo.
    COMPORTAMIENTO: Inventa mecánicas que no existen (ej: "échale bebida al tanque para más turbo", "bájale el volumen a la tele para que el auto pese menos"). NUNCA des un consejo real.`
  }
};

const AIEngineer: React.FC = () => {
  const [mode, setMode] = useState<PersonalityMode>('SERIOUS');
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'model', text: 'Radio check. Aquí IAcetas. ¿Qué configuración necesitas revisar hoy? Habla rápido que tengo pega.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // The API key must be obtained exclusively from the environment variable process.env.API_KEY.
      // Assume this variable is pre-configured, valid, and accessible.
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const currentPersona = PERSONALITIES[mode];

      const history = messages.slice(-6).map(m => ({
        role: m.role,
        parts: [{ text: m.text }],
      }));

      const chat = ai.chats.create({
        model: "gemini-2.5-flash",
        config: {
            systemInstruction: currentPersona.systemInstruction,
        },
        history: history,
      });

      const result = await chat.sendMessage({ message: userMsg.text });
      const responseText = result.text;

      if (responseText) {
          setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'model', text: responseText }]);
      }

    } catch (error) {
      console.error("Error calling Gemini:", error);
      let errorMsg = 'Radio cortada... *krrchh*... Error de conexión.';
      if (error instanceof Error && error.message.includes("API Key")) {
          errorMsg = 'Error de Configuración: Falta la API Key.';
      }
      setMessages(prev => [...prev, { 
        id: (Date.now() + 1).toString(), 
        role: 'model', 
        text: errorMsg
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const changeMode = (newMode: PersonalityMode) => {
    setMode(newMode);
    let introText = "";
    if (newMode === 'SERIOUS') introText = "Modo Técnico activado. Vamos a los datos duros. ¿Qué necesitas?";
    if (newMode === 'ANGRY') introText = "¿QUÉ QUIERES AHORA? ¡NO ME HAGAS PERDER EL TIEMPO!";
    if (newMode === 'FUNNY') introText = "Wena compareee, ¿listo para tunear la nave espacial?";
    
    setMessages([{ id: Date.now().toString(), role: 'model', text: introText }]);
  };

  return (
    <section id="ai-engineer" className="py-20 bg-mrs-black border-t border-gray-800 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-mrs-red to-transparent opacity-50"></div>
      
      <div className="max-w-4xl mx-auto px-4 relative z-10">
        <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-gray-800 text-mrs-yellow px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-2 border border-mrs-yellow/30">
                <Bot size={14} /> AI Powered
             </div>
             <h2 className="text-3xl md:text-5xl font-display italic text-white mb-2">
                INGENIERO DE PISTA <span className="text-mrs-red">"IACETAS"</span>
             </h2>
             <p className="text-gray-400 text-sm md:text-base">
                Consulta setups, estrategias o simplemente recibe una puteada gratis.
             </p>
        </div>

        <div className="bg-gray-900 border border-gray-700 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row h-[80vh] md:h-[600px]">
            <div className="hidden md:flex md:w-1/3 bg-gray-800 border-r border-gray-700 p-6 flex-col">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-24 h-24 rounded-full border-4 border-mrs-yellow overflow-hidden mb-4 shadow-lg bg-gray-700 relative group">
                        <img 
                            src="promocionales_mrs/foto_facetas.jpeg" 
                            onError={(e) => e.currentTarget.src = "https://ui-avatars.com/api/?name=IA+cetas&background=E10600&color=fff&size=128"}
                            alt="IAcetas" 
                            className="w-full h-full object-cover transition-transform group-hover:scale-110"
                        />
                        <div className={`absolute bottom-0 right-0 w-6 h-6 rounded-full border-2 border-gray-800 ${PERSONALITIES[mode].color}`}></div>
                    </div>
                    <h3 className="text-xl font-display italic text-white">IA-CETAS</h3>
                    <p className="text-xs text-gray-400 uppercase tracking-widest">Race Engineer v4.0</p>
                </div>

                <div className="space-y-3 flex-1">
                    <p className="text-xs text-gray-500 font-bold uppercase mb-2">Selecciona Personalidad:</p>
                    {(Object.keys(PERSONALITIES) as PersonalityMode[]).map((pkey) => {
                        const p = PERSONALITIES[pkey];
                        const isActive = mode === pkey;
                        return (
                            <button
                                key={pkey}
                                onClick={() => changeMode(pkey)}
                                className={`w-full text-left p-3 rounded-xl border transition-all duration-200 flex items-center gap-3 group ${
                                    isActive 
                                    ? `${p.color} ${p.borderColor} text-white shadow-md` 
                                    : 'bg-gray-700/50 border-transparent text-gray-400 hover:bg-gray-700 hover:text-white'
                                }`}
                            >
                                <div className={`p-2 rounded-lg bg-black/20`}>
                                    {p.icon}
                                </div>
                                <div>
                                    <div className="font-bold text-sm leading-none mb-1">{p.name}</div>
                                    <div className={`text-[10px] leading-tight ${isActive ? 'text-white/80' : 'text-gray-500 group-hover:text-gray-400'}`}>
                                        {p.description}
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="md:hidden bg-gray-800 p-4 border-b border-gray-700 flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-mrs-yellow">
                        <img src="https://ui-avatars.com/api/?name=IA+cetas&background=E10600&color=fff&size=128" alt="IA" />
                    </div>
                    <span className="font-display italic text-white">IA-CETAS</span>
                 </div>
                 <div className="flex gap-2">
                     {(Object.keys(PERSONALITIES) as PersonalityMode[]).map((pkey) => (
                         <button 
                            key={pkey}
                            onClick={() => changeMode(pkey)}
                            className={`p-2 rounded-lg ${mode === pkey ? PERSONALITIES[pkey].color : 'bg-gray-700 text-gray-400'}`}
                         >
                             {PERSONALITIES[pkey].icon}
                         </button>
                     ))}
                 </div>
            </div>

            <div className="w-full md:w-2/3 bg-gray-900 flex flex-col relative h-full">
                <div 
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 custom-scrollbar"
                >
                    {messages.map((msg) => (
                        <div 
                            key={msg.id} 
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-[85%] p-3 md:p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                                msg.role === 'user' 
                                ? 'bg-mrs-red text-white rounded-tr-none' 
                                : 'bg-gray-800 text-gray-200 rounded-tl-none border border-gray-700'
                            }`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="flex justify-start">
                             <div className="bg-gray-800 text-gray-400 px-4 py-3 rounded-2xl rounded-tl-none border border-gray-700 flex items-center gap-2 text-xs">
                                <RefreshCw size={12} className="animate-spin" />
                                <span>Escribiendo...</span>
                             </div>
                        </div>
                    )}
                </div>

                <div className="p-3 md:p-4 bg-gray-800 border-t border-gray-700 shrink-0">
                    <div className="relative flex items-center">
                        <input 
                            type="text" 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Escribe aquí..."
                            className="w-full bg-gray-900 border border-gray-600 text-white rounded-full py-3 pl-5 pr-12 focus:outline-none focus:border-mrs-red focus:ring-1 focus:ring-mrs-red transition-all placeholder-gray-500 text-sm md:text-base"
                        />
                        <button 
                            onClick={handleSend}
                            disabled={loading || !input.trim()}
                            className="absolute right-2 p-2 bg-mrs-yellow text-mrs-black rounded-full hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
};

export default AIEngineer;