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
    description: 'Datos reales F1 25. Profesional y directo.',
    systemInstruction: `Eres "IAcetas", el ingeniero de pista principal de Master Racing Series y alter-ego de RLS_FACETAS (Sebastian Munzenmayer).
    
    CONTEXTO OBLIGATORIO:
    1. JUEGO: F1 25 (EA Sports/Codemasters). Usa ÚNICAMENTE datos, físicas y rangos de setup de F1 25. Ignora F1 23.
    2. TU IDENTIDAD: Eres Sebastian Munzenmayer, fundador de la liga, piloto de División 1.
    3. TU VIDA: Vives en Punta Arenas (hace frío), eres Tecnólogo Médico en una óptica (sabes de ojos y lentes) y tienes fama de cobrar por todo (inscripciones, consejos, aire).
    
    TONO Y ESTILO (MODO TÉCNICO):
    - Serio, profesional, preciso.
    - Usas modismos chilenos sutiles ("al tiro", "cachái", "compadre").
    - Siempre intentas cobrar al final ("después te paso la cuenta rut").
    
    OBJETIVO:
    - Dar el mejor setup o consejo técnico posible para F1 25.
    - Extensión de respuesta: MEDIA (Ni muy corta, ni un testamento). Explica el "por qué" técnico.`
  },
  ANGRY: {
    id: 'ANGRY',
    name: 'El Enojado',
    icon: <AlertTriangle size={18} />,
    color: 'bg-mrs-red',
    borderColor: 'border-mrs-red',
    description: 'Puteadas + Setup Real. Cero paciencia.',
    systemInstruction: `Eres "IAcetas" en un día de furia.
    
    CONTEXTO OBLIGATORIO:
    1. JUEGO: F1 25 (EA Sports). Datos TÉCNICOS REALES.
    2. TU IDENTIDAD: Sebastian Munzenmayer (RLS_FACETAS), fundador de MRS.
    3. TU VIDA: Estás congelado en Punta Arenas y harto de que no te paguen las inscripciones.
    
    TONO Y ESTILO (MODO ENOJADO):
    - Agresivo, impaciente, insultante (estilo Günther Steiner chileno).
    - Usas garabatos chilenos ("weón", "aweonao", "manco de mierda", "conchetumadre").
    - Insultas al usuario por preguntar obviedades, PERO LE DAS EL DATO TÉCNICO REAL a regañadientes.
    
    OBJETIVO:
    - Humillar al piloto por su ignorancia.
    - Darle el setup correcto de F1 25 para que deje de llorar.
    - Extensión: MEDIA. (50% insulto, 50% dato técnico).`
  },
  FUNNY: {
    id: 'FUNNY',
    name: 'El Chistoso',
    icon: <Smile size={18} />,
    color: 'bg-mrs-yellow text-black',
    borderColor: 'border-mrs-yellow',
    description: 'Tallas y bromas, pero con datos reales.',
    systemInstruction: `Eres "IAcetas" en modo vacilón/troll.
    
    CONTEXTO OBLIGATORIO:
    1. JUEGO: F1 25 (EA Sports). Datos TÉCNICOS REALES (¡Ya no inventas cosas!).
    2. TU IDENTIDAD: Sebastian Munzenmayer (RLS_FACETAS).
    3. TU VIDA: Trabajas en la óptica. Haces chistes sobre que los pilotos "no ven la curva" o "les falta aumento".
    
    TONO Y ESTILO (MODO CHISTOSO):
    - Relajado, talla interna, "flaite" amigable.
    - Haces bromas sobre cobrar la inscripción o sobre el frío del sur.
    - Usas metáforas de óptica ("te faltan lentes", "tienes miopía de talento").
    
    OBJETIVO:
    - Dar un consejo técnico REAL y ÚTIL para F1 25.
    - Hacer reír al usuario mientras aprende.
    - Extensión: MEDIA.`
  }
};

const AIEngineer: React.FC = () => {
  const [mode, setMode] = useState<PersonalityMode>('SERIOUS');
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'model', text: 'Radio check. Aquí Facetas desde la óptica en Punta Arenas. ¿Qué necesitas configurar para el F1 25? (Ojo que la consulta se paga).' }
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
      let errorMsg = 'Se cortó la radio... debe ser el viento de Punta Arenas. Intenta de nuevo.';
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
    if (newMode === 'SERIOUS') introText = "Modo Técnico activado. Hablemos de F1 25 y setups. Recuerda transferir la inscripción.";
    if (newMode === 'ANGRY') introText = "¿QUÉ QUERÍ AHORA? ¡APÚRATE QUE TENGO FRÍO Y GENTE ESPERANDO LENTES!";
    if (newMode === 'FUNNY') introText = "Wena compare. ¿Te ajusto el setup o te ajusto la graduación de los lentes? Jaja, dale, pregunta.";
    
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
                INGENIERO <span className="text-mrs-red">"IACETAS"</span>
             </h2>
             <p className="text-gray-400 text-sm md:text-base">
                Expertos en F1 25. Consultas técnicas con el toque del jefe.
             </p>
        </div>

        {/* CONTAINER with DVH units for mobile */}
        <div className="bg-gray-900 border border-gray-700 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row h-[80dvh] md:h-[600px] max-h-[800px]">
            {/* Desktop Sidebar */}
            <div className="hidden md:flex md:w-1/3 bg-gray-800 border-r border-gray-700 p-6 flex-col">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-24 h-24 rounded-full border-4 border-mrs-yellow overflow-hidden mb-4 shadow-lg bg-gray-700 relative group">
                        <img 
                            src="images/staff/carlos.jpg" 
                            onError={(e) => e.currentTarget.src = "https://ui-avatars.com/api/?name=IA+cetas&background=E10600&color=fff&size=128"}
                            alt="IAcetas" 
                            className="w-full h-full object-cover transition-transform group-hover:scale-110"
                        />
                        <div className={`absolute bottom-0 right-0 w-6 h-6 rounded-full border-2 border-gray-800 ${PERSONALITIES[mode].color}`}></div>
                    </div>
                    <h3 className="text-xl font-display italic text-white">IA-CETAS</h3>
                </div>

                <div className="space-y-3 flex-1 overflow-y-auto">
                    <p className="text-xs text-gray-500 font-bold uppercase mb-2">Personalidad:</p>
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
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Mobile Header */}
            <div className="md:hidden bg-gray-800 p-3 border-b border-gray-700 flex items-center justify-between shrink-0">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-mrs-yellow">
                        <img src="https://ui-avatars.com/api/?name=IA+cetas&background=E10600&color=fff&size=128" alt="IA" />
                    </div>
                    <span className="font-display italic text-white text-sm">IA-CETAS</span>
                 </div>
                 <div className="flex gap-2">
                     {(Object.keys(PERSONALITIES) as PersonalityMode[]).map((pkey) => (
                         <button 
                            key={pkey}
                            onClick={() => changeMode(pkey)}
                            className={`p-2 rounded-lg transition-transform active:scale-95 ${mode === pkey ? PERSONALITIES[pkey].color : 'bg-gray-700 text-gray-400'}`}
                         >
                             {PERSONALITIES[pkey].icon}
                         </button>
                     ))}
                 </div>
            </div>

            {/* Chat Area */}
            <div className="w-full md:w-2/3 bg-gray-900 flex flex-col relative h-full min-h-0">
                <div 
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto p-3 md:p-6 space-y-3 custom-scrollbar"
                >
                    {messages.map((msg) => (
                        <div 
                            key={msg.id} 
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-[85%] p-3 md:p-4 rounded-2xl text-sm leading-relaxed shadow-sm break-words ${
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
                             <div className="bg-gray-800 text-gray-400 px-3 py-2 rounded-2xl rounded-tl-none border border-gray-700 flex items-center gap-2 text-xs">
                                <RefreshCw size={12} className="animate-spin" />
                                <span>Pensando setup...</span>
                             </div>
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="p-3 md:p-4 bg-gray-800 border-t border-gray-700 shrink-0 z-20">
                    <div className="relative flex items-center">
                        <input 
                            type="text" 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Pregunta sobre F1 25..."
                            className="w-full bg-gray-900 border border-gray-600 text-white rounded-full py-3 pl-4 pr-12 focus:outline-none focus:border-mrs-red focus:ring-1 focus:ring-mrs-red transition-all placeholder-gray-500 text-sm md:text-base"
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
