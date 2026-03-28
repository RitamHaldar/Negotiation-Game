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
  CheckCircle2,
  XCircle,
  Brain,
  X
} from 'lucide-react';
import { useChat } from '../hooks/useChat';
import { useAuth } from '../../Auth/hooks/useAuth';
import { resetChat } from '../chat.slice';

export default function Chat() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [dots, setDots] = useState("");
  const [inputOffer, setInputOffer] = useState("");
  const [inputMessage, setInputMessage] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const [customProduct, setCustomProduct] = useState("");
  const [showInitModal, setShowInitModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120);
  const [isTimeAttackMode, setIsTimeAttackMode] = useState(false);

  const { handleLogout } = useAuth();
  const {
    gameId, product, startingPrice, targetPrice, currentPrice, userPrice,
    round, patience, status, messages, isThinking, error, score, finalPrice,
    loading
  } = useSelector(state => state.chat);

  const { handleStartGame, handleMakeOffer, handleEndGame, fetchSuggestion } = useChat();

  const stateRef = useRef();
  stateRef.current = { gameId, status, handleEndGame };

  useEffect(() => () => {
    const { gameId, status, handleEndGame } = stateRef.current;
    if (gameId && status === 'active') handleEndGame(0);
  }, []);

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
    handleStartGame(customProduct, "medium");
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

        <header className="flex-none flex items-center justify-between px-6 py-4 border-b border-slate-800/60 bg-[#060b13]/80 backdrop-blur-xl shrink-0 h-[76px]">
          <div className="flex items-center gap-6">
            <button
              onClick={() => {
                if (status === 'active') handleEndGame(0);
                navigate('/');
              }}
              className="flex items-center gap-3 text-[10px] font-bold text-slate-400 hover:text-white tracking-[0.2em] uppercase transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Exit Arena
            </button>
            <div className="text-sm font-black italic tracking-widest text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)] uppercase border-l border-slate-700 pl-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              {product || 'Neural Link V4'}
            </div>
          </div>

          <div className="hidden md:flex bg-[#111824] border border-slate-800 rounded px-6 py-2 gap-8 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex flex-col items-center justify-center">
              <span className="text-[9px] text-slate-500 font-bold tracking-[0.2em] uppercase">Round</span>
              <span className="text-white font-bold text-sm tracking-wider">{round}</span>
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

          <div className="flex items-center gap-6 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="flex flex-col items-end">
              <span className="text-[9px] text-slate-500 font-bold tracking-[0.2em] uppercase">AI Price</span>
              <span className="text-cyan-400 font-black text-xl tracking-wider">₹{currentPrice.toLocaleString()}</span>
            </div>
            <div className={`border ${error ? 'border-red-500 bg-red-950/20' : 'border-cyan-500/50 bg-cyan-900/40'} text-cyan-400 text-[10px] font-bold tracking-[0.2em] uppercase px-4 py-1.5 rounded relative overflow-hidden`}>
              <div className={`absolute top-0 left-0 w-full h-full ${isThinking || error ? 'bg-red-400/10 animate-pulse' : 'bg-cyan-400/20'}`}></div>
              {error ? 'System Error' : (isThinking ? 'Thinking' : (status === 'active' ? 'Negotiating' : status.toUpperCase()))}
            </div>

            <button
              onClick={async () => {
                if (status === 'active') await handleEndGame(0);
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

        <main className="flex-1 flex flex-col lg:flex-row gap-6 p-6 h-[calc(100vh-156px)] overflow-hidden">

          <aside className="hidden lg:flex flex-col w-[320px] gap-6 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>

            <div className="bg-[#0B111A] border border-slate-800 rounded-xl p-6 shadow-lg relative overflow-hidden shrink-0 group">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

              <div className="relative mx-auto w-32 h-32 mb-5 cursor-pointer">
                <div className="absolute inset-[-4px] border border-dashed border-purple-500/40 rounded-xl rotate-[10deg] group-hover:rotate-0 transition-all duration-700 ease-in-out"></div>
                <div className="absolute inset-0 bg-slate-900 rounded-xl overflow-hidden shadow-[0_0_30px_rgba(168,85,247,0.2)]">
                  <img src="/trader.webp" alt="SmartTrader AI" className="w-full h-full object-cover mix-blend-lighten opacity-80" />
                </div>
                <div className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-cyan-400 rounded-full border-[3px] border-[#0B111A] shadow-[0_0_10px_rgba(34,211,238,0.8)] animate-pulse"></div>
              </div>

              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-white tracking-wide mb-2">SmartTrader AI</h2>
                <span className="inline-block bg-[#2D161F] border border-red-900/50 text-[#FF4455] text-[9px] font-bold tracking-[0.2em] px-4 py-1 rounded-full uppercase">Aggressive</span>
              </div>

              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[9px] text-slate-500 font-bold tracking-[0.2em] uppercase">Patience Level</span>
                  <span className="text-purple-400 font-bold text-xs tracking-wider">{patience}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden shadow-inner">
                  <div className="h-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.8)] relative transition-all duration-500" style={{ width: `${patience}%` }}>
                    <div className="absolute right-0 top-0 bottom-0 w-4 bg-white/30"></div>
                  </div>
                </div>
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

            <div className="flex-1 overflow-y-auto custom-scrollbar pr-4 py-4 flex flex-col relative w-full h-full pb-[150px]">

              {messages.map((m, idx) => (
                <div key={idx} className={`flex flex-col gap-1 mb-8 animate-fade-in-up ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`${m.role === 'user' ? 'bg-[#0A1929]/80 border-r-[3px] border-cyan-400 rounded-l-xl rounded-tr-sm text-right' : 'bg-[#171124] border-l-[3px] border-purple-500 rounded-r-xl rounded-tl-sm text-left'} backdrop-blur-sm p-5 max-w-[85%] shadow-[0_4px_20px_rgba(0,0,0,0.08)] text-sm leading-relaxed relative xl:max-w-[70%] font-medium tracking-wide`}>
                    <div className={`absolute top-0 ${m.role === 'user' ? 'right-[-3px] bg-cyan-300 shadow-[0_0_10px_rgba(34,211,238,1)]' : 'left-[-3px] bg-purple-400 shadow-[0_0_10px_rgba(168,85,247,1)]'} w-[3px] h-[60%]`}></div>
                    <div className="mb-2 text-[10px] uppercase font-bold tracking-widest opacity-50">
                      {m.role === 'user' ? 'You' : 'Seller'} {m.offerPrice ? `// ₹${m.offerPrice.toLocaleString()}` : ''}
                    </div>
                    <span className={m.role === 'user' ? 'text-cyan-50' : 'text-slate-300'}>
                      {m.message}
                    </span>
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

            <div className="absolute bottom-6 left-6 right-6 lg:left-0 lg:right-0 mt-auto animate-fade-in-up z-20" style={{ animationDelay: '1.2s' }}>
              <div className="bg-[#0E1522]/95 backdrop-blur-xl border border-slate-800 rounded-2xl p-4 shadow-[0_10px_40px_rgba(0,0,0,0.8)]">
                <div className="flex flex-col gap-3">
                  <div className="flex gap-3">
                    <div className="flex-1 flex h-14 shadow-inner rounded-lg overflow-hidden border border-slate-800 focus-within:border-cyan-500/50 transition-colors">
                      <input
                        type="text"
                        disabled={status !== 'active' || isThinking}
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && onSendOffer()}
                        placeholder={status === 'active' ? "TYPE YOUR TACTICAL MESSAGE..." : "NEGOTIATION CONCLUDED"}
                        className="flex-1 bg-[#050A11] px-6 outline-none text-white text-[13px] tracking-[0.1em] placeholder:text-slate-600 font-mono disabled:opacity-50"
                      />
                    </div>
                    <div className="w-[180px] flex h-14 shadow-inner rounded-lg overflow-hidden border border-slate-800 focus-within:border-cyan-500/50 transition-colors">
                      <div className="flex items-center px-4 bg-[#0a0f18] text-slate-500 text-xs font-mono font-bold border-r border-slate-800">₹</div>
                      <input
                        type="number"
                        disabled={status !== 'active' || isThinking}
                        value={inputOffer}
                        onChange={(e) => setInputOffer(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && onSendOffer()}
                        placeholder="OFFER..."
                        className="flex-1 bg-[#050A11] px-4 outline-none text-white text-[13px] tracking-[0.1em] placeholder:text-slate-600 font-mono disabled:opacity-50"
                      />
                    </div>
                    <button
                      onClick={onSendOffer}
                      disabled={!inputOffer || isThinking || status !== 'active'}
                      className={`w-[80px] bg-cyan-400 hover:bg-cyan-300 text-[#060B13] flex justify-center items-center transition-all group overflow-hidden relative ${(!inputOffer || isThinking || status !== 'active') ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <div className="absolute inset-0 bg-white/20 -translate-x-[120%] skew-x-[-20deg] group-hover:animate-[slide_0.6s_ease-out]"></div>
                      <SendHorizontal className="w-6 h-6 group-hover:translate-x-1 group-active:scale-90 transition-transform relative z-10" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <aside className="hidden xl:flex flex-col w-[320px] gap-6 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>

            <div className="bg-[#0B111A] border border-slate-800 rounded-xl p-6 flex-1 flex flex-col relative shadow-lg min-h-[400px]">
              <h3 className="text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase text-center mb-6">Price Dynamics</h3>

              <div className="flex-1 relative flex justify-center py-10 w-[80%] mx-auto">
                <div className="w-2.5 bg-[#050B14] rounded-full h-full relative overflow-hidden shadow-inner">
                  <div className="absolute top-0 inset-x-0 h-[40%] bg-red-900/40"></div>
                  <div className="absolute top-[40%] inset-x-0 h-[20%] bg-purple-900/40"></div>
                  <div className="absolute bottom-0 inset-x-0 h-[40%] bg-cyan-900/40"></div>
                </div>

                <div className="absolute top-0 right-0 text-right">
                  <div className="text-[8px] text-slate-500 font-bold tracking-widest uppercase mb-1">Starting</div>
                  <div className="text-[#FF4455] font-black text-sm">₹{startingPrice.toLocaleString()}</div>
                </div>

                <div className="absolute bottom-0 right-0 text-right">
                  <div className="text-[8px] text-slate-500 font-bold tracking-widest uppercase mb-1">Target</div>
                  <div className="text-cyan-400 font-black text-sm">₹{targetPrice.toLocaleString()}</div>
                </div>

                <div className="absolute left-1/2 -track-x-1/2 flex items-center z-20 w-[140%] -ml-[15%] transition-all duration-1000" style={{ top: `${Math.max(5, Math.min(95, 100 - ((userPrice - targetPrice) / (startingPrice - targetPrice || 1) * 100)))}%` }}>
                  <div className="mx-auto flex items-center justify-end w-full pr-[50%] flex-row-reverse">
                    <div className="w-3.5 h-3.5 bg-cyan-400 rotate-45 border-[2px] border-white shadow-[0_0_20px_rgba(34,211,238,0.8)] z-20 shrink-0 relative right-1"></div>
                    <div className="bg-[#051118] border-[1.5px] border-cyan-400 px-3 py-1.5 rounded text-white font-black tracking-wider text-[10px] shadow-[0_0_20px_rgba(34,211,238,0.3)] z-10 shrink-0 bg-opacity-95 backdrop-blur">
                      YOU: ₹{userPrice.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>

        </main>

        <nav className="flex-none h-[80px] bg-[#060b13] border-t border-slate-800 flex justify-center items-stretch gap-8 md:gap-24 px-6 z-30 shrink-0">

          <button
            onClick={onGetSuggestion}
            disabled={status !== 'active' || isThinking}
            className="group relative flex flex-col items-center justify-center gap-1.5 px-8 min-w-[120px] transition-all disabled:opacity-30"
          >
            <HelpCircle className="w-6 h-6 text-purple-400 relative z-10 group-hover:-translate-y-0.5 transition-transform" />
            <span className="text-[9px] font-bold tracking-[0.2em] text-purple-400 uppercase relative z-10">AI Hint</span>
          </button>

          <button
            onClick={onSettle}
            disabled={status !== 'active' || isThinking || round < 2}
            className="relative group flex flex-col items-center justify-center gap-1.5 px-8 min-w-[120px] transition-all disabled:opacity-30"
          >
            {status === 'active' && !isThinking && round >= 2 && <div className="absolute top-[-1px] inset-x-0 h-[3px] bg-green-500 shadow-[0_0_12px_rgba(34,197,94,1)]"></div>}
            <Banknote className="w-6 h-6 text-green-500 relative z-10" />
            <span className="text-[9px] font-bold tracking-[0.2em] text-green-500 uppercase relative z-10">Settle</span>
          </button>

          <button
            onClick={() => {
              if (status === 'active') handleEndGame(0);
              navigate('/');
            }}
            className="group relative flex flex-col items-center justify-center gap-1.5 px-8 min-w-[120px] hover:bg-red-500/10 transition-all"
          >
            <LogOut className="w-6 h-6 text-slate-500 group-hover:text-red-400 group-hover:-translate-y-0.5 transition-all" />
            <span className="text-[9px] font-bold tracking-[0.2em] text-slate-500 group-hover:text-red-400 uppercase transition-colors">Exit</span>
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
              <span className="text-[10px] font-bold text-purple-400 tracking-widest uppercase">Neural Advisor</span>
            </div>
            <p className="text-xs text-white leading-relaxed italic pr-4">"{suggestion}"</p>
          </div>
        )}

        {(status === 'completed' || status === 'accepted' || status === 'rejected') && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-[#060B13]/90 backdrop-blur-md animate-fade-in"></div>
            <div className="relative bg-[#0B111A] border border-slate-800 rounded-2xl p-10 max-w-md w-full text-center shadow-2xl animate-fade-in-up">
              <div className="mb-6 flex justify-center">
                {status === 'rejected' ? (
                  <XCircle className="w-16 h-16 text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
                ) : (
                  <CheckCircle2 className="w-16 h-16 text-green-500 drop-shadow-[0_0_15px_rgba(34,197,94,0.5)]" />
                )}
              </div>
              <h2 className="text-3xl font-black text-white tracking-widest uppercase mb-2">
                {status === 'rejected' ? 'Negotiation Failed' : 'Contract Secured'}
              </h2>
              <p className="text-slate-500 text-xs font-bold tracking-[0.3em] uppercase mb-8">
                Final Price: ₹{finalPrice?.toLocaleString() || currentPrice.toLocaleString()}
              </p>

              <div className="bg-[#050A11] border border-slate-800 rounded-xl p-6 mb-8">
                <span className="block text-[10px] text-slate-500 font-bold tracking-widest uppercase mb-1">Arena Score</span>
                <span className="text-4xl font-black text-white tracking-widest">{score || 0}</span>
              </div>

              <div className="flex gap-4">
                <button onClick={handleNewRun} className="flex-1 bg-cyan-400 hover:bg-cyan-300 text-[#060B13] font-black tracking-widest uppercase py-4 rounded text-xs transition-all">New Run</button>
                <button onClick={() => navigate('/')} className="flex-1 border border-slate-700 hover:border-slate-500 text-white font-black tracking-widest uppercase py-4 rounded text-xs transition-all">Terminal Home</button>
              </div>
            </div>
          </div>
        )}

        {showInitModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-[#060B13]/90 backdrop-blur-md animate-fade-in"></div>
            <div className="relative bg-[#0B111A] border border-cyan-500/30 rounded-2xl p-8 max-w-md w-full shadow-[0_0_50px_rgba(34,211,238,0.15)] animate-fade-in-up">
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
                    <SquareTerminal className="w-5 h-5 text-cyan-400" />
                  </div>
                  <h2 className="text-xl font-bold text-white tracking-widest uppercase">Target Acquisition</h2>
                </div>
                <p className="text-slate-400 text-xs font-medium leading-relaxed tracking-wider">
                  ARENA INITIALIZATION SEQUENCE: Identify the specific asset or contract you wish to negotiate for.
                </p>
              </div>

              <div className="space-y-6">
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
                    className="w-full bg-[#050A11] border border-slate-800 focus:border-cyan-500/50 rounded-xl py-4 pl-12 pr-6 text-white text-sm font-mono tracking-widest outline-none transition-all placeholder:text-slate-600 shadow-inner"
                  />
                </div>

                <button
                  onClick={onStartWithProduct}
                  disabled={!customProduct.trim()}
                  className="w-full relative group overflow-hidden bg-cyan-400 hover:bg-cyan-300 text-[#060B13] font-black tracking-[0.2em] uppercase py-4 rounded-xl text-xs transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <div className="absolute inset-0 bg-white/20 -translate-x-[120%] skew-x-[-20deg] group-hover:animate-[slide_0.6s_ease-out]"></div>
                  ESTABLISH CONNECTION
                </button>
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
