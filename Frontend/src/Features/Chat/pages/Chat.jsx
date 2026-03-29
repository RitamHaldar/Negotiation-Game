import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';

import {
  ArrowLeft,
  Clock,
  SquareTerminal,
  SendHorizontal,
  Banknote,
  Terminal,
  LogOut,
  HelpCircle,
  Brain,
  X,
  Mic,
  MicOff
} from 'lucide-react';
import { useChat } from '../hooks/useChat';
import { useAuth } from '../../Auth/hooks/useAuth';
import { resetChat } from '../chat.slice';

function speak(text, personality = "normal") {
  window.speechSynthesis.cancel();

  const cleanText = text
    .replace(/\*/g, '')
    .replace(/[^\u0900-\u097Fa-zA-Z0-9\s.,!?'"₹()+-/]/g, '')
    .trim();

  const utterance = new SpeechSynthesisUtterance(cleanText);
  if (personality === "aggressive") {
    utterance.rate = 1.1;
    utterance.pitch = 0.8;
  } else if (personality === "friendly") {
    utterance.rate = 1;
    utterance.pitch = 1.3;
  } else if (personality === "desperate") {
    utterance.rate = 1.2;
    utterance.pitch = 1;
  }

  utterance.volume = 1;
  window.speechSynthesis.speak(utterance)
  utterance.lang = 'hi-IN';
}

export default function Chat() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [dots, setDots] = useState("");
  const [inputOffer, setInputOffer] = useState("");
  const [inputMessage, setInputMessage] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const [customProduct, setCustomProduct] = useState("");
  const [showInitModal, setShowInitModal] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120);
  const [isTimeAttackMode, setIsTimeAttackMode] = useState(false);
  const [isAIVoiceMuted, setIsAIVoiceMuted] = useState(true);
  const suggestions = [
    "Gaming Laptop", "iPhone 15", "Mirrorless Camera",
    "Electric Scooter", "Custom Keyboard", "iPad Air M2",
    "Dyson Vacuum", "Sony Headphones"
  ];

  const { handleLogout } = useAuth();
  const {
    gameId, product, startingPrice, targetPrice, currentPrice, userPrice,
    round, patience, status, messages, isThinking, score, finalPrice,
    loading, maxRounds
  } = useSelector(state => state.chat);

  const { handleStartGame, handleMakeOffer, handleEndGame, fetchSuggestion } = useChat();

  const stateRef = useRef();
  stateRef.current = { gameId, status, handleEndGame };

  const lastAIMessage = messages && [...messages].reverse().find(m => m.role === 'seller');

  const handleToggleAIVoice = () => {
    const newMuted = !isAIVoiceMuted;
    setIsAIVoiceMuted(newMuted);

    if (newMuted) {
      window.speechSynthesis.cancel();
    } else if (lastAIMessage) {
      speak(lastAIMessage.message, "aggressive");
    }
  };

  useEffect(() => () => {
    if (gameId && status === 'active') handleEndGame(0);
    window.speechSynthesis.cancel();
  }, []);

  useEffect(() => {
    if (!showInitModal && status === 'active' && messages && messages.length > 0 && !isAIVoiceMuted) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === 'seller') {
        speak(lastMessage.message, "aggressive");
      }
    }
  }, [messages.length, showInitModal, status, isAIVoiceMuted]);

  useEffect(() => {
    if (status !== 'active' || !isTimeAttackMode) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          stateRef.current.handleEndGame(0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [status, isTimeAttackMode]);


  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? "" : prev + ".");
    }, 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (gameId && (status === 'accepted' || status === 'rejected' || status === 'completed')) {
      setShowGameOver(true);
    }
  }, [gameId, status]);

  useEffect(() => {
    if (status === 'active' && patience < 10) {
      handleEndGame(0);
      setShowGameOver(true);
    }
  }, [patience, status, handleEndGame]);

  useEffect(() => {
    if (status === 'active' && round > maxRounds) {
      handleEndGame(0);
      setShowGameOver(true);
    }
  }, [round, maxRounds, status, handleEndGame]);

  useEffect(() => {
    if (!gameId && status === 'idle' && !showInitModal && !loading) {
      const selectedProduct = location.state?.product;
      const timeAttackFlag = location.state?.isTimeAttack || false;

      setIsTimeAttackMode(timeAttackFlag);

      if (selectedProduct) {
        const selectedDifficulty = location.state?.difficulty || "medium";
        handleStartGame(selectedProduct, selectedDifficulty);
      } else {
        setShowInitModal(true);
      }
    }
  }, [gameId, status, location.state, showInitModal, loading]);

  const onStartWithProduct = () => {
    if (!customProduct.trim()) return;
    setShowInitModal(false);
    const selectedDifficulty = location.state?.difficulty || "medium";
    handleStartGame(customProduct, selectedDifficulty);
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = (event) => {
      console.error("Speech Recognition Error:", event.error);
      setIsListening(false);
    };
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputMessage(prev => prev ? `${prev} ${transcript}` : transcript);
    };

    recognition.start();
  };

  const onSendOffer = async () => {
    if (!inputOffer || isThinking) return;
    const offer = parseInt(inputOffer);
    const message = inputMessage || `My offer is ₹${offer.toLocaleString()}`;

    try {
      await handleMakeOffer(offer, message);
      setInputOffer("");
      setInputMessage("");
      setSuggestion("");
    } catch (err) {
      console.error("Failed to send offer:", err);
    }
  };

  const onSettle = async () => {
    if (window.confirm(`Are you sure you want to settle at ₹${currentPrice.toLocaleString()}?`)) {
      window.speechSynthesis.cancel();
      await handleEndGame(currentPrice);
    }
  };

  const onGetSuggestion = async () => {
    const hint = await fetchSuggestion();
    setSuggestion(hint);
  };

  const handleNewRun = () => {
    dispatch(resetChat());
    setCustomProduct("");
    setInputOffer("");
    setInputMessage("");
    setSuggestion("");
    setShowInitModal(false);
    setTimeLeft(120);
    setIsTimeAttackMode(false);
    navigate('/chat', { replace: true, state: {} });
  };

  return (
    <div className="min-h-screen bg-[#060b13] text-slate-200 overflow-hidden relative font-sans selection:bg-cyan-500/30">

      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 40V0h40' fill='none' stroke='%23ffffff' stroke-width='1'/%3E%3C/svg%3E")` }}></div>
        <div className="absolute bottom-[-10%] left-[10%] w-[600px] h-[600px] bg-cyan-900/10 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow"></div>
        <div className="absolute top-[10%] right-[-5%] w-[500px] h-[500px] bg-purple-900/15 rounded-full blur-[150px] mix-blend-screen animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 flex flex-col h-screen">

        <header className="flex-none flex items-center justify-between px-4 sm:px-6 py-4 border-b border-slate-800/60 bg-[#060b13]/80 backdrop-blur-xl shrink-0 h-[70px] sm:h-[76px]">
          <div className="flex items-center gap-4 sm:gap-6">
            <button
              onClick={() => {
                window.speechSynthesis.cancel();
                if (status === 'active') handleEndGame(0);
                setShowGameOver(true);
              }}
              className="flex items-center gap-2 sm:gap-3 text-[9px] sm:text-[10px] font-bold text-slate-400 hover:text-white tracking-[0.2em] uppercase transition-colors group"
            >
              <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:-translate-x-1 transition-transform" /> <span className="hidden sm:inline">Exit Arena</span><span className="sm:hidden">Exit</span>
            </button>
            <div className="text-[11px] sm:text-sm font-black italic tracking-widest text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)] uppercase border-l border-slate-700 pl-4 sm:pl-6 animate-fade-in-up truncate max-w-[120px] sm:max-w-none" style={{ animationDelay: '0.1s' }}>
              {product || 'Neural Link'}
            </div>
          </div>

          <div className="hidden md:flex bg-[#111824] border border-slate-800 rounded px-6 py-2 gap-8 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex flex-col items-center justify-center">
              <span className="text-[9px] text-slate-500 font-bold tracking-[0.2em] uppercase">Round</span>
              <span className="text-white font-bold text-sm tracking-wider">{round}/{maxRounds}</span>
            </div>
            {isTimeAttackMode ? (
              <div className={`flex items-center gap-3 ${timeLeft <= 30 ? 'animate-pulse' : ''}`}>
                <Clock className={`w-5 h-5 ${timeLeft <= 30 ? 'text-red-500' : 'text-cyan-500'}`} />
                <span className={`${timeLeft <= 30 ? 'text-red-400' : 'text-cyan-400'} font-black text-2xl tracking-widest w-[80px] text-right`}>
                  {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-cyan-500" />
                <span className="text-cyan-400 font-black text-2xl tracking-widest">SESSION</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 sm:gap-6 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="flex flex-col items-end">
              <span className="text-[8px] sm:text-[9px] text-slate-500 font-bold tracking-[0.2em] uppercase">AI Price</span>
              <span className="text-cyan-400 font-black text-sm sm:text-xl tracking-wider">₹{currentPrice.toLocaleString()}</span>
            </div>
            <div className={`hidden sm:block border ${isThinking ? 'border-amber-500 bg-amber-950/20' : 'border-cyan-500/50 bg-cyan-900/40'} text-cyan-400 text-[10px] font-bold tracking-[0.2em] uppercase px-4 py-1.5 rounded relative overflow-hidden`}>
              <div className={`absolute top-0 left-0 w-full h-full ${isThinking ? 'bg-amber-400/10 animate-pulse' : 'bg-cyan-400/20'}`}></div>
              {isThinking ? 'Thinking' : (status === 'active' ? 'Negotiating' : status.toUpperCase())}
            </div>

            <button
              onClick={async () => {
                window.speechSynthesis.cancel();
                if (status === 'active') await handleEndGame(0);
                dispatch(resetChat());
                await handleLogout();
                navigate('/login');
              }}
              className="flex items-center gap-2 text-slate-500 hover:text-red-400 transition-colors group"
              title="Logout"
            >
              <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </header>

        <main className="flex-1 flex flex-col lg:flex-row gap-4 lg:gap-6 p-4 lg:p-6 overflow-hidden min-h-0">

          <aside className="hidden lg:flex flex-col w-64 xl:w-80 gap-4 lg:gap-6 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>

            <div className="bg-[#0B111A] border border-slate-800 rounded-xl p-6 shadow-lg relative overflow-hidden shrink-0 group">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

              <div className="relative mx-auto w-32 h-32 mb-5 group/avatar">
                <div className="absolute inset-[-4px] border border-dashed border-purple-500/40 rounded-xl rotate-[10deg] group-hover:rotate-0 transition-all duration-700 ease-in-out"></div>
                <div className="absolute inset-0 bg-slate-900 rounded-xl overflow-hidden shadow-[0_0_30px_rgba(168,85,247,0.2)]">
                  <img src="/trader.webp" alt="SmartTrader AI" className="w-full h-full object-cover mix-blend-lighten opacity-80" />
                </div>
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-cyan-400 rounded-full border-[3px] border-[#0B111A] shadow-[0_0_10px_rgba(34,211,238,0.8)] animate-pulse"></div>
              </div>

              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-white tracking-wide mb-2">Smart-Seller AI</h2>
                <span className="inline-block bg-[#2D161F] border border-red-900/50 text-[#FF4455] text-[9px] font-bold tracking-[0.2em] px-4 py-1 rounded-full uppercase">Aggressive</span>
              </div>

              <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[9px] text-slate-500 font-bold tracking-[0.2em] uppercase">Patience Level</span>
                  <span className="text-purple-400 font-bold text-xs tracking-wider">{patience}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden shadow-inner mb-6">
                  <div className="h-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.8)] relative transition-all duration-500" style={{ width: `${patience}%` }}>
                    <div className="absolute right-0 top-0 bottom-0 w-4 bg-white/30"></div>
                  </div>
                </div>

                <button
                  onClick={handleToggleAIVoice}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all duration-300 group/voice ${isAIVoiceMuted
                    ? 'border-slate-800/60 bg-slate-900/40 text-slate-500 hover:border-slate-700'
                    : 'border-purple-500/40 bg-purple-500/5 text-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.05)] hover:border-purple-500/60'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${isAIVoiceMuted ? 'bg-slate-800/80 text-slate-600' : 'bg-purple-500/20 text-purple-400'} transition-colors`}>
                      {isAIVoiceMuted ? <MicOff className="w-4 h-4" /> : <Mic className={`w-4 h-4 ${window.speechSynthesis.speaking ? 'animate-bounce' : ''}`} />}
                    </div>
                    <div className="text-left">
                      <div className="text-[8px] font-black tracking-[0.2em] uppercase opacity-50">Vocal Output</div>
                      <div className="text-[11px] font-black uppercase tracking-wider">
                        {isAIVoiceMuted ? 'Sync Offline' : 'Active Link'}
                      </div>
                    </div>
                  </div>
                  <div className={`w-1.5 h-1.5 rounded-full ${isAIVoiceMuted ? 'bg-slate-700' : 'bg-purple-500 animate-pulse'}`}></div>
                </button>
              </div>

              <div className="flex justify-between border-t border-slate-800/80 pt-4">
                <div>
                  <span className="block text-[9px] text-slate-500 font-bold tracking-[0.2em] uppercase mb-1">Volatility</span>
                  <span className="text-white font-bold text-xs uppercase tracking-wider">High</span>
                </div>
              </div>
            </div>
          </aside>

          <section className="flex-1 flex flex-col bg-transparent overflow-hidden relative">
            <div className="lg:hidden flex items-center justify-between px-4 py-2 bg-[#0B111A]/60 backdrop-blur-md border-b border-slate-800/40 z-30 shrink-0">
                <div className="flex items-center gap-3 flex-1">
                    <div className="flex flex-col">
                        <span className="text-[7px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Patience</span>
                        <span className="text-[10px] font-black text-purple-400 leading-none">{patience}%</span>
                    </div>
                    <div className="flex-1 h-1 bg-slate-900 rounded-full overflow-hidden max-w-[80px]">
                        <div className="h-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.6)] transition-all duration-500" style={{ width: `${patience}%` }}></div>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button 
                        onClick={handleToggleAIVoice}
                        className={`p-1.5 rounded-lg border flex items-center justify-center transition-all ${isAIVoiceMuted ? 'bg-slate-800/40 border-slate-700/50 text-slate-500' : 'bg-purple-500/20 border-purple-500/40 text-purple-400 animate-pulse-slow'}`}
                    >
                        {isAIVoiceMuted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                    </button>
                    <div className="flex flex-col items-end">
                        <span className="text-[7px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Target</span>
                        <span className="text-green-500 font-black text-[10px] leading-none">₹{targetPrice.toLocaleString()}</span>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar px-3 sm:pr-4 py-4 flex flex-col relative w-full h-full">
              {messages.map((m, idx) => (
                <div key={idx} className={`flex flex-col gap-1 mb-8 animate-fade-in-up ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`group relative max-w-[90%] xl:max-w-[75%] transition-all duration-300 ${m.role === 'user' ? 'hover:-translate-x-1' : 'hover:translate-x-1'}`}>
                    
                    <div className={`absolute -inset-[1px] bg-gradient-to-r ${m.role === 'user' ? 'from-cyan-500/0 via-cyan-500/20 to-cyan-500/40' : 'from-purple-500/40 via-purple-500/20 to-purple-500/0'} rounded-2xl blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

                    <div className={`relative backdrop-blur-xl p-5 border shadow-2xl ${m.role === 'user' ? 'bg-cyan-950/20 border-cyan-500/20 rounded-2xl rounded-tr-sm select-none' : 'bg-purple-950/20 border-purple-500/20 rounded-2xl rounded-tl-sm'}`}>
                      
                      <div className={`absolute top-0 bottom-0 w-1 ${m.role === 'user' ? 'right-0 bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.8)]' : 'left-0 bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.8)] opacity-70'}`}></div>

                      <div className="flex items-center justify-between mb-3 gap-8">
                        <div className="flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${m.role === 'user' ? 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)]' : 'bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.6)]'}`}></div>
                          <span className={`text-[9px] font-black uppercase tracking-[0.3em] ${m.role === 'user' ? 'text-cyan-400' : 'text-purple-400'}`}>
                            {m.role === 'user' ? 'You // Sector_Command' : 'AI // Aggressive_Core'}
                          </span>
                        </div>
                        <span className="text-[8px] font-bold text-slate-600 uppercase tracking-widest font-mono">SEQ-{String(idx + 1).padStart(2, '0')}</span>
                      </div>

                      <div className={`text-[13px] leading-relaxed tracking-wide font-medium ${m.role === 'user' ? 'text-cyan-50' : 'text-slate-300'}`}>
                        {m.message}
                      </div>

                      {m.offerPrice && (
                        <div className={`mt-4 pt-3 border-t border-slate-800/40 flex items-center justify-between`}>
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Tactical Bid</span>
                          <div className={`px-3 py-1 rounded-md text-[11px] font-black tracking-widest ${m.role === 'user' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'}`}>
                            ₹{m.offerPrice.toLocaleString()}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {isThinking && (
                <div className="flex items-start mb-8 animate-fade-in-up">
                  <div className="bg-[#171124] border-l-[3px] border-purple-500 rounded-r-xl rounded-tl-sm p-4 backdrop-blur-sm">
                    <div className="flex items-center gap-3 text-[9px] font-mono font-bold tracking-[0.2em] text-purple-400/80 uppercase">
                      <div className="relative flex items-center justify-center w-2 h-2">
                        <div className="absolute w-2 h-2 bg-purple-500 rounded-full animate-ping"></div>
                        <div className="relative w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                      </div>
                      AI ANALYZING MARKET DATA{dots}
                    </div>
                  </div>
                </div>
              )}

              {messages.length === 0 && !isThinking && (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-600 border border-dashed border-slate-800 rounded-3xl m-10">
                  <Terminal className="w-12 h-12 mb-4 opacity-20" />
                  <p className="text-[10px] font-bold tracking-[0.3em] uppercase opacity-40">Initialize Arena to Start</p>
                </div>
              )}
            </div>

            <div className="mt-auto animate-fade-in-up z-20 pt-2 sm:pt-4" style={{ animationDelay: '1.2s' }}>
              <div className="bg-[#0E1522]/95 backdrop-blur-xl border border-slate-800 rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-[0_10px_40px_rgba(0,0,0,0.8)]">
                <div className="flex flex-col gap-2 sm:gap-3">
                  <div className="flex flex-col lg:flex-row lg:flex-nowrap gap-2 sm:gap-3">
                    <div className="flex-1 flex h-14 shadow-inner rounded-lg overflow-hidden border border-slate-800 focus-within:border-cyan-500/50 transition-colors">
                      <input
                        type="text"
                        disabled={status !== 'active' || isThinking}
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && onSendOffer()}
                        placeholder={status === 'active' ? (window.innerWidth < 640 ? "MESSAGE..." : "TYPE YOUR TACTICAL MESSAGE...") : "NEGOTIATION CONCLUDED"}
                        className="flex-1 bg-[#050A11] px-4 sm:px-6 outline-none text-white text-[12px] sm:text-[13px] tracking-[0.1em] placeholder:text-slate-600 font-mono disabled:opacity-50 min-w-0"
                      />
                      <button
                        onClick={toggleListening}
                        disabled={status !== 'active' || isThinking}
                        className={`px-3 sm:px-4 bg-[#0a0f18] border-l border-slate-800 transition-colors ${isListening ? 'text-red-500' : 'text-slate-500 hover:text-cyan-400'} disabled:opacity-50`}
                      >
                        {isListening ? (
                          <MicOff className="w-5 h-5 animate-pulse" />
                        ) : (
                          <Mic className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 lg:w-[260px]">
                        <div className="flex-1 flex h-14 shadow-inner rounded-lg overflow-hidden border border-slate-800 focus-within:border-cyan-500/50 transition-colors">
                        <div className="flex items-center px-3 sm:px-4 bg-[#0a0f18] text-slate-500 text-[10px] sm:text-xs font-mono font-bold border-r border-slate-800">₹</div>
                        <input
                            type="number"
                            disabled={status !== 'active' || isThinking}
                            value={inputOffer}
                            onChange={(e) => setInputOffer(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && onSendOffer()}
                            placeholder="OFFER..."
                            className="flex-1 bg-[#050A11] px-3 sm:px-4 outline-none text-white text-[12px] sm:text-[13px] tracking-[0.1em] placeholder:text-slate-600 font-mono disabled:opacity-50 min-w-0"
                        />
                        </div>
                        <button
                        onClick={onSendOffer}
                        disabled={!inputOffer || isThinking || status !== 'active'}
                        className={`w-full sm:w-[80px] h-14 bg-cyan-400 hover:bg-cyan-300 text-[#060B13] flex justify-center items-center transition-all group overflow-hidden relative shrink-0 ${(!inputOffer || isThinking || status !== 'active') ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                        <div className="absolute inset-0 bg-white/20 -translate-x-[120%] skew-x-[-20deg] group-hover:animate-[slide_0.6s_ease-out]"></div>
                        <SendHorizontal className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 group-active:scale-90 transition-transform relative z-10" />
                        </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <aside className="hidden xl:flex flex-col w-72 h-full gap-4 lg:gap-6 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>

            <div className="bg-[#0B111A] border border-slate-800 rounded-xl p-6 flex-1 flex flex-col relative shadow-lg min-h-[400px]">
              <h3 className="text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase text-center mb-6">Price Dynamics</h3>

              <div className="flex-1 relative flex justify-center py-10 w-[80%] mx-auto">
                <div className="w-2.5 bg-[#050B14] rounded-full h-full relative overflow-hidden shadow-inner">
                  <div className="absolute top-0 inset-x-0 h-[40%] bg-red-900/40"></div>
                  <div className="absolute top-[40%] inset-x-0 h-[20%] bg-purple-900/40"></div>
                  <div className="absolute bottom-0 inset-x-0 h-[40%] bg-cyan-900/40"></div>
                </div>

                <div className="absolute top-0 left-0 text-left">
                  <div className="text-[8px] text-slate-500 font-bold tracking-widest uppercase mb-1">Starting</div>
                  <div className="text-[#FF4455] font-black text-sm">₹{startingPrice.toLocaleString()}</div>
                </div>

                <div className="absolute bottom-0 left-0 text-left">
                  <div className="text-[8px] text-slate-500 font-bold tracking-widest uppercase mb-1">Target</div>
                  <div className="text-cyan-400 font-black text-sm">₹{targetPrice.toLocaleString()}</div>
                </div>

                <div className="absolute inset-x-0 flex items-center z-20 transition-all duration-1000 px-4" style={{ top: `${Math.max(5, Math.min(95, 100 - ((userPrice - targetPrice) / (startingPrice - targetPrice || 1) * 100)))}%` }}>
                  <div className="relative w-full flex items-center justify-center">
                    <div className="w-3.5 h-3.5 bg-cyan-400 rotate-45 border-[2px] border-white shadow-[0_0_20px_rgba(34,211,238,0.8)] z-20 shrink-0"></div>
                    <div className="absolute left-[calc(50%+12px)] bg-[#051118] border-[1.5px] border-cyan-400 px-3 py-1.5 rounded text-white font-black tracking-wider text-[10px] shadow-[0_0_20px_rgba(34,211,238,0.3)] z-10 shrink-0 bg-opacity-95 backdrop-blur whitespace-nowrap">
                      YOU: ₹{userPrice.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>

        </main>

        <nav className="flex-none h-[72px] lg:h-[80px] bg-[#060b13] border-t border-slate-800 flex justify-around sm:justify-center items-stretch gap-2 sm:gap-16 lg:gap-24 px-4 sm:px-6 z-30 shrink-0">
          <button
            onClick={onGetSuggestion}
            disabled={status !== 'active' || isThinking}
            className="group relative flex flex-col items-center justify-center gap-1 px-3 sm:px-8 min-w-[70px] sm:min-w-[120px] transition-all disabled:opacity-30"
          >
            <HelpCircle className="w-5 h-5 lg:w-6 lg:h-6 text-purple-400 relative z-10 group-hover:-translate-y-0.5 transition-transform" />
            <span className="text-[8px] lg:text-[9px] font-bold tracking-[0.2em] text-purple-400 uppercase relative z-10">AI Hint</span>
          </button>

          <button
            onClick={onSettle}
            disabled={status !== 'active' || isThinking || round < 2}
            className="relative group flex flex-col items-center justify-center gap-1 px-3 sm:px-8 min-w-[70px] sm:min-w-[120px] transition-all disabled:opacity-30"
          >
            {status === 'active' && !isThinking && round >= 2 && <div className="absolute top-[-1px] inset-x-0 h-[2px] sm:h-[3px] bg-green-500 shadow-[0_0_12px_rgba(34,197,94,1)]"></div>}
            <Banknote className="w-5 h-5 lg:w-6 lg:h-6 text-green-500 relative z-10" />
            <span className="text-[8px] lg:text-[9px] font-bold tracking-[0.2em] text-green-500 uppercase relative z-10">Settle</span>
          </button>

          <button
            onClick={() => {
              window.speechSynthesis.cancel();
              if (status === 'active') handleEndGame(0);
              setShowGameOver(true);
            }}
            className="group relative flex flex-col items-center justify-center gap-1 px-3 sm:px-8 min-w-[70px] sm:min-w-[120px] hover:bg-red-500/10 transition-all"
          >
            <LogOut className="w-5 h-5 lg:w-6 lg:h-6 text-slate-500 group-hover:text-red-400 group-hover:-translate-y-0.5 transition-all" />
            <span className="text-[8px] lg:text-[9px] font-bold tracking-[0.2em] text-slate-500 group-hover:text-red-400 uppercase transition-colors">Exit</span>
          </button>
        </nav>

        {suggestion && (
          <div className="absolute bottom-32 left-1/2 -translate-x-1/2 bg-purple-900/90 border border-purple-500 p-6 rounded-xl backdrop-blur-md max-w-md animate-fade-in-up z-50 shadow-[0_0_30px_rgba(168,85,247,0.2)]">
            <button
              onClick={() => setSuggestion("")}
              className="absolute top-2 right-2 p-1 text-purple-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 mb-3">
              <Brain className="w-4 h-4 text-purple-400" />
              <span className="text-[10px] font-bold text-purple-400 tracking-widest uppercase">Cortex Advisor</span>
            </div>
            <p className="text-xs text-white leading-relaxed italic pr-4">"{suggestion}"</p>
          </div>
        )}

        {showGameOver && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#060B13]/80 backdrop-blur-2xl animate-fade-in overflow-hidden">
            <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,211,238,0.1),transparent_70%)]"></div>
              <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] opacity-10"></div>
            </div>

            <button
              onClick={() => {
                setShowGameOver(false);
                navigate('/');
              }}
              className="absolute top-8 right-8 w-12 h-12 rounded-full border border-slate-700/50 flex items-center justify-center text-slate-400 hover:text-white hover:border-white transition-all hover:rotate-90 z-[110] bg-slate-900/50 backdrop-blur-md group"
            >
              <X className="w-6 h-6 group-hover:scale-110 transition-transform" />
            </button>

            <div className="relative w-full max-w-2xl flex flex-col items-center text-center overflow-y-auto max-h-[90vh] custom-scrollbar px-4">
              <div className="mb-6 sm:mb-12 relative group">
                <div className="absolute -inset-10 bg-cyan-500/10 blur-[60px] rounded-full animate-pulse opacity-50 group-hover:opacity-100 transition-opacity"></div>
                {(status === 'accepted' || status === 'completed') ? (
                  <div className="relative animate-glitch-text">
                    <h2 className="text-4xl sm:text-6xl md:text-8xl font-black text-green-500 tracking-[0.15em] sm:tracking-[0.2em] uppercase drop-shadow-[0_0_30px_rgba(34,197,94,0.4)] leading-tight">MISSION<br />COMPLETE</h2>
                    <p className="mt-2 sm:mt-4 text-[8px] sm:text-[10px] font-bold tracking-[0.3em] sm:tracking-[0.5em] text-green-400/60 uppercase">Synaptic Connection Stabilized</p>
                  </div>
                ) : (
                  <div className="relative animate-glitch-text">
                    <h2 className="text-4xl sm:text-6xl md:text-8xl font-black text-red-500 tracking-[0.15em] sm:tracking-[0.2em] uppercase drop-shadow-[0_0_30px_rgba(239,68,68,0.4)] leading-tight">LINK<br />SEVERED</h2>
                    <p className="mt-2 sm:mt-4 text-[8px] sm:text-[10px] font-bold tracking-[0.3em] sm:tracking-[0.5em] text-red-400/60 uppercase">Synaptic Connection Terminated</p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6 w-full mb-8 sm:mb-12 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                <div className="bg-slate-900/40 border border-slate-800/60 rounded-xl sm:rounded-2xl p-4 sm:p-6 backdrop-blur-md relative group overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500 opacity-50"></div>
                  <span className="block text-[7px] sm:text-[8px] text-slate-500 font-bold tracking-[0.2em] sm:tracking-[0.3em] uppercase mb-1 sm:mb-2">Final Price</span>
                  <span className="text-lg sm:text-2xl font-black text-white tracking-widest">₹{(finalPrice || currentPrice).toLocaleString()}</span>
                </div>
                <div className="bg-slate-900/40 border border-slate-800/60 rounded-xl sm:rounded-2xl p-4 sm:p-6 backdrop-blur-md relative group overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-purple-500 opacity-50"></div>
                  <span className="block text-[7px] sm:text-[8px] text-slate-500 font-bold tracking-[0.2em] sm:tracking-[0.3em] uppercase mb-1 sm:mb-2">Arena Score</span>
                  <span className="text-lg sm:text-2xl font-black text-white tracking-widest">{score || 0}</span>
                </div>
                <div className="col-span-2 md:col-span-1 bg-slate-900/40 border border-slate-800/60 rounded-xl sm:rounded-2xl p-4 sm:p-6 backdrop-blur-md relative group overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500 opacity-50"></div>
                  <span className="block text-[7px] sm:text-[8px] text-slate-500 font-bold tracking-[0.2em] sm:tracking-[0.3em] uppercase mb-1 sm:mb-2">Total Rounds</span>
                  <span className="text-lg sm:text-2xl font-black text-white tracking-widest">{round} / {maxRounds}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                <button
                  onClick={() => {
                    handleNewRun();
                    setShowGameOver(false);
                  }}
                  className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-black font-black tracking-[0.2em] uppercase py-4 sm:py-5 rounded-xl text-[10px] sm:text-xs transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_30px_rgba(34,211,238,0.2)]"
                >
                  New Mission
                </button>
                <button
                  onClick={() => {
                    setShowGameOver(false);
                    window.speechSynthesis.cancel();
                    dispatch(resetChat());
                    navigate('/');
                  }}
                  className="flex-1 border border-slate-700 hover:border-white text-white font-black tracking-[0.2em] uppercase py-4 sm:py-5 rounded-xl text-[10px] sm:text-xs transition-all hover:scale-[1.02] active:scale-[0.98] backdrop-blur-md"
                >
                  Return to Terminal
                </button>
              </div>
            </div>

            <style jsx>{`
              .animate-glitch-text {
                animation: glitch 3s infinite;
              }
              @keyframes glitch {
                0% { transform: translate(0); text-shadow: none; }
                2% { transform: translate(-2px, 1px); text-shadow: 1px 0 #0ff, -1px 0 #f0f; }
                4% { transform: translate(2px, -1px); text-shadow: -1px 0 #0ff, 1px 0 #f0f; }
                6% { transform: translate(0); text-shadow: none; }
                100% { transform: translate(0); text-shadow: none; }
              }
            `}</style>
          </div>
        )}

        {showInitModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-[#060B13]/90 backdrop-blur-md animate-fade-in"></div>
            <div className="relative bg-[#0B111A] border border-cyan-500/30 rounded-2xl p-5 sm:p-8 max-w-2xl w-full shadow-[0_0_50px_rgba(34,211,238,0.15)] animate-fade-in-up overflow-y-auto max-h-[90vh] custom-scrollbar">

              <button
                onClick={() => navigate('/')}
                className="absolute top-4 right-4 p-2 text-slate-500 hover:text-white transition-colors group z-20"
                title="Return to Dashboard"
              >
                <X className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </button>

              <div className="flex flex-col md:flex-row gap-6 sm:gap-10">
                <div className="flex-1 flex flex-col">
                  <div className="mb-6 sm:mb-8">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
                        <SquareTerminal className="w-5 h-5 text-cyan-400" />
                      </div>
                      <h2 className="text-lg sm:text-xl font-bold text-white tracking-widest uppercase">Target Acquisition</h2>
                    </div>
                    <p className="text-slate-400 text-[10px] sm:text-xs font-medium leading-relaxed tracking-wider">
                      ARENA INITIALIZATION SEQUENCE: Identify the specific asset or contract you wish to negotiate for.
                    </p>
                  </div>

                  <div className="space-y-4 sm:space-y-6">
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none transition-transform duration-300 group-focus-within:translate-x-1">
                        <Terminal className="w-4 h-4 text-cyan-500/50" />
                      </div>
                      <input
                        type="text"
                        autoFocus
                        value={customProduct}
                        onChange={(e) => setCustomProduct(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && onStartWithProduct()}
                        placeholder="IDENTIFY_ASSET_NAME..."
                        className="w-full bg-[#050A11] border border-slate-800 focus:border-cyan-500/50 rounded-xl py-3.5 sm:py-4 pl-12 pr-6 text-white text-[12px] sm:text-sm font-mono tracking-widest outline-none transition-all placeholder:text-slate-600 shadow-inner"
                      />
                    </div>

                    <button
                      onClick={onStartWithProduct}
                      disabled={!customProduct.trim()}
                      className="w-full relative group overflow-hidden bg-cyan-400 hover:bg-cyan-300 text-[#060B13] font-black tracking-[0.2em] uppercase py-3.5 sm:py-4 rounded-xl text-[10px] sm:text-xs transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <div className="absolute inset-0 bg-white/20 -translate-x-[120%] skew-x-[-20deg] group-hover:animate-[slide_0.6s_ease-out]"></div>
                      ESTABLISH UPLINK
                    </button>
                  </div>
                </div>

                <div className="w-full md:w-56 flex flex-col gap-4 border-t md:border-t-0 md:border-l border-slate-800/80 pt-6 md:pt-0 md:pl-8">
                  <h3 className="text-[10px] font-bold text-slate-500 tracking-[0.2em] uppercase mb-2">Suggested Assets</h3>
                  <div className="grid grid-cols-2 md:grid-cols-1 gap-2.5">
                    {suggestions.map((p, i) => (
                      <button
                        key={p}
                        onClick={() => setCustomProduct(p)}
                        className="group relative px-4 py-2.5 bg-[#0a0f18] border border-slate-800/60 rounded-xl text-[10px] font-bold text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-all text-left overflow-hidden animate-fade-in-up"
                        style={{ animationDelay: `${(i + 1) * 0.05}s` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/0 to-cyan-500/0 group-hover:via-cyan-500/5 transition-all duration-500"></div>
                        <span className="relative z-10 uppercase tracking-widest truncate block">{p}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slide {
          100% {
            transform: translateX(200%) skewX(-20deg);
          }
        }
      `}</style>
    </div>
  );
}
