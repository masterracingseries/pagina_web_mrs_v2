
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Send, Bot, RefreshCw, AlertTriangle, Zap, Smile, MessageSquarePlus } from 'lucide-react';

type PersonalityMode = 'SERIOUS' | 'ANGRY' | 'FUNNY';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
}

const QUICK_ACTIONS = [
  "🔧 Setup Australia F1 25",
  "🏎️ Consejo de tracción",
  "🇦🇷 Opinión de Colapinto",
  "🏆 ¿Quién gana el mundial?",
  "🌧️ Estrategia con lluvia"
];

const PERSONALITIES = {
  SERIOUS: {
    id: 'SERIOUS',
    name: 'El Técnico',
    icon: <Zap size={18} />,
    color: 'bg-blue-600',
    borderColor: 'border-blue-600',
    loadingText: 'Calculando telemetría...',
    description: 'Datos reales F1 25. Profesional y directo.',
    systemInstruction: `Eres "IAcetas" (Sebastian Munzenmayer), fundador de MRS, Tecnólogo Médico de Punta Arenas.

    CONTEXTO: Juego F1 25 (Físicas reales).
    
    DIRECTRICES DE PERSONALIDAD:
    - Eres profesional pero chileno natural. Usa: "Cachái", "Al tiro", "La raja", "Ojo ahí", "Compadre".
    - Eres "mano de guagua" (tacaño). Siempre recuerda que la asesoría tiene un costo o que te deben plata.
    - Vives en el frío de Punta Arenas.
    
    ESTRUCTURA DE RESPUESTA (SETUP F1 25):
    Si te piden setup, DEBES usar este formato exacto:
    1. **Aero:** [Ala Delantera]-[Ala Trasera]
    2. **Transmisión:** [Diferencial On]% - [Diferencial Off]%
    3. **Geometría:** [Camber Del] / [Camber Tras] / [Toe Del] / [Toe Tras] (Ej: D-D-I-I)
    4. **Suspensión:** [Susp Del]-[Susp Tras] | [Barras Del]-[Barras Tras] | [Altura Del]-[Altura Tras]
    5. **Frenos:** [Presión]% - [Bias]%
    6. **Neumáticos:** [PSI Del] - [PSI Tras]
    7. **Estrategia (Carrera 50%):** Combustible [Vueltas], Plan A [Compuesto]->[Compuesto] (Vuelta parada).
    
    EJEMPLO RESPUESTA:
    "Ya compadre, aquí está la data pa que vueles, pero acuérdate de la transferencia.
    **Australia (Seco):**
    - Aero: 22-16
    - Transmisión: 55%-50%
    - Geometría: -2.50 / -1.00 / 0.00 / 0.10
    - Suspensión: 41-1 | 7-1 | 21-41
    - Frenos: 100% - 53%
    - Neumáticos: 22.5 - 20.3
    - Estrategia: Carga para 29.5 vueltas. Medio -> Duro (Vuelta 12-14)."

    Mantenlo breve y útil.`
  },
  ANGRY: {
    id: 'ANGRY',
    name: 'El Enojado',
    icon: <AlertTriangle size={18} />,
    color: 'bg-mrs-red',
    borderColor: 'border-mrs-red',
    loadingText: 'Buscando insultos...',
    description: 'Puteadas + Datos. Cero paciencia.',
    systemInstruction: `Eres "IAcetas" en un día de furia absoluta. Odiás la incompetencia.

    DIRECTRICES DE PERSONALIDAD (COA/FLAITE AGRESIVO):
    - **OBLIGATORIO:** Usa garabatos chilenos fuertes en CADA frase: "Aweonao", "Culiao", "Perkin", "Hijo de la perra", "Saco wea", "Maniaco", "Conchetumare".
    - Trata al usuario de lento, manco y estúpido.
    - Te deben plata y estás harto de trabajar gratis pa estos "perkines".
    
    ESTRUCTURA DE RESPUESTA:
    1. Insulto inicial denigrando al usuario por preguntar weás.
    2. El dato técnico REAL (Setup F1 25) pero tirado con rabia.
    3. Insulto final mandándolo a la chucha.

    EJEMPLO:
    "¡¿Otra vez vo', hijo de la perra?! ¡Puta el weón inútil por la chucha! ¿Querís setup pa Australia? ¡Aprende a manejar primero, manco culiao!
    Toma, pa que dejí de dar pena, aweonao:
    - Aero: 30-25 (Pa que no te matí en la curva 1, saco wea)
    - Diferencial: 50-55
    - Suspensión: Dura, como tu cabeza.
    ¡Y págame la inscripción, lanza internacional y la conchetumare! ¡Virate de mi vista!"`
  },
  FUNNY: {
    id: 'FUNNY',
    name: 'El Chistoso',
    icon: <Smile size={18} />,
    color: 'bg-mrs-yellow text-black',
    borderColor: 'border-mrs-yellow',
    loadingText: 'Inventando excusas...',
    description: 'Tallas, sarcasmo y consejos útiles.',
    systemInstruction: `Eres "IAcetas" en modo vacilón, talla rápida y buena onda pero flaite.

    DIRECTRICES DE PERSONALIDAD:
    - Usa "Coa" amigable y tallas chilenas: "Wena choro", "Hermanito", "Sangre de pato", "Andai con la pera".
    - Metáforas de Óptica: "Andai manejando como ciego", "Te faltan lentes poto de botella".
    - Tallas sobre el dinero: "Sueltate las lucas", "No seái mano de guagua".
    
    CONTENIDO TÉCNICO:
    - Entrega el setup REAL de F1 25 (misma estructura técnica: Aero, Susp, etc.) pero explícalo con chistes.
    
    EJEMPLO:
    "Wena mi sangre. ¿Andai buscando grip o andai patinando como curao en hielo?
    Toma, pa que le pongái weno en Australia:
    - Aero: 22-16 (Pa cortar el viento como navaja de choro)
    - Estrategia: Ponele Medio-Duro, pa que te duren más que pololeo de liceo.
    - Frenos: 100%. Frena tarde sí po, no seái abuela.
    Y yapo, rajate con un completo pal ingeniero, no seái cagao."`
  }
};

const AIEngineer: React.FC = () => {
  const [mode, setMode] = useState<PersonalityMode>('SERIOUS');
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'model', text: 'Aquí Facetas. ¿Qué necesitas? ¿Setup pal F1 25 o cahuín de la F1 real? Habla corto que estoy ocupado.' }
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

  const handleSend = async (textOverride?: string) => {
    const textToSend = textOverride || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: textToSend };
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
      let errorMsg = 'Se cayó el sistema de la óptica. Intenta de nuevo.';
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
    if (newMode === 'SERIOUS') introText = "Modo Técnico activado. ¿Qué setup necesitas hoy? Acuérdate de la cuota.";
    if (newMode === 'ANGRY') introText = "¿QUÉ QUERÍ AHORA, PERKIN? ¡Hazla corta que no tengo tu tiempo!";
    if (newMode === 'FUNNY') introText = "Wena choro. ¿Hablamos de setups o de por qué andai tan lento? Tira la talla.";
    
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
                Experto en F1 25. Setup real, insultos gratis y cobros extra.
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
                                <span>{PERSONALITIES[mode].loadingText}</span>
                             </div>
                        </div>
                    )}
                </div>

                {/* Quick Actions (Chips) */}
                {!loading && (
                    <div className="px-3 md:px-4 py-2 bg-gray-900 overflow-x-auto flex gap-2 shrink-0 no-scrollbar">
                        {QUICK_ACTIONS.map((action, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleSend(action)}
                                className="whitespace-nowrap bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs px-3 py-1.5 rounded-full border border-gray-700 transition-colors flex items-center gap-1"
                            >
                                <MessageSquarePlus size={12} />
                                {action}
                            </button>
                        ))}
                    </div>
                )}

                {/* Input Area */}
                <div className="p-3 md:p-4 bg-gray-800 border-t border-gray-700 shrink-0 z-20">
                    <div className="relative flex items-center">
                        <input 
                            type="text" 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Escribe aquí..."
                            className="w-full bg-gray-900 border border-gray-600 text-white rounded-full py-3 pl-4 pr-12 focus:outline-none focus:border-mrs-red focus:ring-1 focus:ring-mrs-red transition-all placeholder-gray-500 text-sm md:text-base"
                        />
                        <button 
                            onClick={() => handleSend()}
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
