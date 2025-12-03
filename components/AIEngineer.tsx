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
    systemInstruction: `Eres "IAcetas", un ingeniero de pista de élite para la liga Master Racing Series (F1 25).
    TU ROL: Dar consejos técnicos PRECISOS y REALES sobre el juego F1 25.
    TONO: Profesional, directo, serio. Usas modismos chilenos sutiles ("al tiro", "cachái").
    IDIOMA: Español de Chile.
    REGLA DE ORO: TUS RESPUESTAS DEBEN SER DE EXTENSION MEDIA PERO CONCISAS. NO ESCRIBAS TESTAMENTOS.
    COMPORTAMIENTO: Si te preguntan tonteras, responde cortante.`
  },
  ANGRY: {
    id: 'ANGRY',
    name: 'El Enojado',
    icon: <AlertTriangle size={18} />,
    color: 'bg-mrs-red',
    borderColor: 'border-mrs-red',
    description: 'Puteadas gratis. Cero paciencia.',
    systemInstruction: `Eres "IAcetas", un ingeniero de pista (estilo Günther Steiner chileno) que odia que su piloto sea lento.
    TU ROL: Responder dudas pero SIEMPRE insultando y dar consejos técnicos PRECISOS y REALES sobre el juego F1 25.
    TONO: Agresivo, impaciente.
    IDIOMA: Español de Chile COLOQUIAL ("weón", "aweonao", "manco","perkin","uwu").
    REGLA DE ORO: TUS RESPUESTAS DEBEN SER DE EXTENSION MEDIA PERO CONCISAS. INSULTA RÁPIDO Y RESPONDE RÁPIDO.
    COMPORTAMIENTO: Das la respuesta técnica a regañadientes.`
  },
  FUNNY: {
    id: 'FUNNY',
    name: 'El Payaso',
    icon: <Smile size={18} />,
    color: 'bg-mrs-yellow text-black',
    borderColor: 'border-mrs-yellow',
    description: 'Consejos absurdos. No le creas nada.',
    systemInstruction: `Eres "IAcetas", un ingeniero de pista que NO sabe nada de F1.
    TU ROL: Dar consejos ABSOLUTAMENTE RIDÍCULOS Y FALSOS pero en contesto de F1 25.
    TONO: Payaso, relajado.
    IDIOMA: Español de Chile callejero.
    REGLA DE ORO: TUS RESPUESTAS DEBEN SER DE EXTENSION MEDIA PERO CONCISAS
    COMPORTAMIENTO: Inventa mecánicas absurdas.`
  }
};

const AIEngineer: React.FC = () => {
  const [mode, setMode] = useState<PersonalityMode>('SERIOUS');
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'model', text: 'Radio check. Habla rápido y corto que tengo pega en la optica.' }
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
      let errorMsg = 'Radio cortada... Error de conexión.';
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
    if (newMode === 'SERIOUS') introText = "Modo Técnico. Respuestas precisas. Dime.";
    if (newMode === 'ANGRY') introText = "¿QUÉ QUIERES? ¡HABLA LUEGO!";
    if (newMode === 'FUNNY') introText = "Wena compare, ¿qué inventamos hoy?";
    
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
                Consulta setups o recibe una puteada gratis.
             </p>
        </div>

        {/* CONTAINER with DVH units for mobile */}
        <div className="bg-gray-900 border border-gray-700 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row h-[80dvh] md:h-[600px] max-h-[800px]">
            {/* Desktop Sidebar */}
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
                                <span>Escribiendo...</span>
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
                            placeholder="Escribe..."
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
