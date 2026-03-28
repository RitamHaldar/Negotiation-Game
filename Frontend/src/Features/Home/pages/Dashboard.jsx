import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useHome } from '../hooks/useHome';
import { useAuth } from '../../Auth/hooks/useAuth';
import {
    Play,
    Brain,
    Swords,
    Clock,
    VenetianMask,
    BarChart3,
    Terminal,
    Crosshair,
    HelpCircle,
    CircleDollarSign,
    LogOut
} from 'lucide-react';

const DUMMY_FEED_POOL = [
    { msg: "User Player42 closed at ₹620 (Mark +15)", color: "text-green-400" },
    { msg: "AI rejected offer from Neo_Bargain ❌", color: "text-slate-400" },
    { msg: "System: New high score in Bluff Mode by Shadow", color: "text-cyan-400" },
    { msg: "User V-100 successfully bluffed AI (Profit +₹400)", color: "text-[#FF4455]" },
    { msg: "Global market volatility increased by 5.4%", color: "text-slate-500" },
    { msg: "User ZeroCool accepted terminal deal at ₹3,200", color: "text-green-400" },
    { msg: "AI neural pathways optimizing for Hard Mode...", color: "text-purple-400" },
    { msg: "Time Attack mode successfully completed by Cipher", color: "text-cyan-500" },
    { msg: "User Trinity failed to negotiate Void-Link", color: "text-red-500" },
    { msg: "Hardware surplus detected. Difficulty adjusted.", color: "text-slate-500" },
    { msg: "Match: User Glitch77 secured a 45% discount", color: "text-green-400" },
    { msg: "System: Server load optimization complete", color: "text-slate-400" },
    { msg: "Alert: AI caught bluff attempt by User AlphaDog", color: "text-red-500" },
    { msg: "Global market trend shows rising hardware costs", color: "text-orange-400" },
    { msg: "User Phantom reached Level 50 Negotiation Mastery", color: "text-yellow-400" },
    { msg: "AI accepted counter-offer from BladeRunner", color: "text-green-400" },
    { msg: "System anomaly: Unexpected price drop in Sector 4", color: "text-purple-400" },
    { msg: "User Matrix_Neo lost 20 points due to timeout", color: "text-red-400" },
    { msg: "Match: 1v1 Arena challenge issued by Top Ranker", color: "text-cyan-400" },
    { msg: "Server: Daily negotiation quota hit peak threshold", color: "text-slate-500" },
    { msg: "User Synth_Wave triggered a legendary AI concession", color: "text-yellow-300" },
    { msg: "Market watch: Demand for encryption chips dropped", color: "text-slate-400" },
    { msg: "Warning: AI aggression shifted to Maximum", color: "text-red-500" },
    { msg: "User Oracle achieved flawless back-to-back deals", color: "text-green-400" },
    { msg: "System maintenance scheduled for neural network recalibration", color: "text-slate-500" }
];

export default function Dashboard() {
    const navigate = useNavigate();
    const [showHowToPlay, setShowHowToPlay] = useState(false);

    const { user: authUser, handleLogout } = useAuth();

    const {
        userStats,
        topRankings,
        liveFeed,
        loading,
        getUserStats,
        getTopRankings
    } = useHome();

    const [dummyFeed, setDummyFeed] = useState([]);

    useEffect(() => {
        let index = 0;
        const generateBatch = (startIndex) => {
            let nextBatch = DUMMY_FEED_POOL.slice(startIndex, startIndex + 7);
            if (nextBatch.length < 7) {
                nextBatch = [...nextBatch, ...DUMMY_FEED_POOL.slice(0, 7 - nextBatch.length)];
            }
            return nextBatch.map(item => ({
                ...item,
                ts: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
                id: Math.random().toString(36).substr(2, 9)
            }));
        };

        setDummyFeed(generateBatch(0));

        const interval = setInterval(() => {
            index = (index + 7) % DUMMY_FEED_POOL.length;
            setDummyFeed(generateBatch(index));
        }, 6000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                await Promise.allSettled([
                    getUserStats(),
                    getTopRankings()
                ]);
            } catch (err) {
                console.error("Failed to load dashboard data:", err);
            }
        };

        loadDashboardData();
    }, []);

    const SampleChat = () => (
        <div className="flex flex-col gap-5 text-left max-h-[380px] overflow-y-auto pr-3 custom-scrollbar">
            <div className="grid grid-cols-[1.2fr_0.8fr] gap-4 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <div className="bg-cyan-950/40 border border-cyan-500/20 rounded-lg p-2.5">
                    <div className="text-[7px] text-cyan-400 font-black uppercase mb-1 tracking-widest">You // Initial_Bid</div>
                    <div className="text-[11px] text-white leading-tight">"I'll start at ₹1,100."</div>
                </div>
                <div className="flex items-center text-[9px] text-slate-500 font-bold italic border-l border-slate-800 pl-3 leading-tight animate-fade-in" style={{ animationDelay: '0.4s' }}>
                    Setting a low anchor point to test AI resistance.
                </div>
            </div>

            <div className="grid grid-cols-[1.2fr_0.8fr] gap-4 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
                <div className="bg-purple-900/20 border border-purple-500/20 rounded-lg p-2.5">
                    <div className="text-[7px] text-purple-400 font-black uppercase mb-1 tracking-widest">AI // Defensive_Counter</div>
                    <div className="text-[11px] text-slate-300 leading-tight">"₹1,400. This unit is high-tier neural hardware."</div>
                </div>
                <div className="flex items-center text-[9px] text-purple-400/70 font-bold italic border-l border-slate-800 pl-3 leading-tight animate-fade-in" style={{ animationDelay: '1.2s' }}>
                    AI attempts to justify value via technical specs.
                </div>
            </div>

            <div className="grid grid-cols-[1.2fr_0.8fr] gap-4 animate-fade-in-up" style={{ animationDelay: '1.6s' }}>
                <div className="bg-cyan-950/60 border border-cyan-400/40 rounded-lg p-2.5 ring-1 ring-cyan-400/10">
                    <div className="text-[7px] text-cyan-400 font-black uppercase mb-1 tracking-widest">You // Bluff_Sequence</div>
                    <div className="text-[11px] text-white leading-tight">"Wait. Sector B reports a surplus. It's aged technology."</div>
                </div>
                <div className="flex items-center text-[9px] text-cyan-400/80 font-bold italic border-l border-slate-800 pl-3 leading-tight animate-fade-in" style={{ animationDelay: '2s' }}>
                    "Bluffing" about market surplus to lower price leverage.
                </div>
            </div>

            <div className="grid grid-cols-[1.2fr_0.8fr] gap-4 animate-fade-in-up" style={{ animationDelay: '2.4s' }}>
                <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-2.5 shadow-[0_0_15px_rgba(34,197,94,0.1)]">
                    <div className="text-[7px] text-green-400 font-black uppercase mb-1 tracking-widest">AI // Yield_Concession</div>
                    <div className="text-[11px] text-slate-200 leading-tight">"Analyzing market logs... Accepted. ₹1,150 is optimal."</div>
                </div>
                <div className="flex items-center text-[9px] text-green-500 font-bold italic border-l border-slate-800 pl-3 leading-tight animate-fade-in" style={{ animationDelay: '2.8s' }}>
                    Success. The AI folded due to "data conflict".
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#060b13] text-slate-200 overflow-x-hidden relative font-sans selection:bg-cyan-500/30">
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div
                    className="absolute inset-0 opacity-[0.02]"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 40V0h40' fill='none' stroke='%23ffffff' stroke-width='1'/%3E%3C/svg%3E")` }}
                ></div>
                <div className="absolute top-[-10%] left-1/4 w-[600px] h-[600px] bg-cyan-900/20 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow"></div>
                <div className="absolute bottom-[20%] right-[-10%] w-[800px] h-[800px] bg-green-900/10 rounded-full blur-[150px] mix-blend-screen animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="relative z-10 flex flex-col min-h-screen">

                <header className="flex items-center justify-between px-6 py-4 border-b border-slate-800/60 bg-[#060b13]/80 backdrop-blur-xl sticky top-0 z-50">
                    <div className="flex items-center gap-2">
                        <div className="text-xl font-black tracking-widest text-cyan-500">
                            Nego<span className="text-white">-</span>Arena
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-12 text-[9px] tracking-[0.2em] font-bold text-slate-500 uppercase">
                        <div className="flex flex-col items-center gap-1">
                            <span>Global Ranking</span>
                            <span className="text-cyan-400">Rank: {userStats.rank || 'N/A'}</span>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                            <span>Score</span>
                            <span className="text-cyan-400">{userStats.score || '0'} Points</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3 bg-slate-800/40 pl-4 pr-1 py-1 rounded-full border border-slate-700/50">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{authUser?.user || 'Guest'}</span>
                            <div className="w-8 h-8 rounded-full bg-slate-800 border-2 border-slate-700 overflow-hidden">
                                <img src={authUser?.avatar || `https://ui-avatars.com/api/?name=${authUser?.user || 'User'}&background=0284c7&color=fff&bold=true`} alt="User" className="w-full h-full object-cover" />
                            </div>
                        </div>

                        <button
                            onClick={async () => {
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

                <section className="relative px-6 py-20 flex flex-col items-center text-center overflow-hidden">
                    <div className="absolute top-1/2 left-[15%] -translate-x-1/2 -translate-y-[60%] text-[10rem] md:text-[15rem] font-bold text-slate-800/10 select-none animate-float pointer-events-none" style={{ animationDelay: "0s" }}>₹850</div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[40%] text-[12rem] md:text-[20rem] font-bold text-slate-800/5 select-none animate-float pointer-events-none" style={{ animationDelay: "1.5s" }}>₹420</div>
                    <div className="absolute top-1/2 left-[85%] -translate-x-1/2 -translate-y-[50%] text-[8rem] md:text-[12rem] font-bold text-slate-800/10 select-none animate-float pointer-events-none" style={{ animationDelay: "3s" }}>₹95</div>

                    <div className="animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
                        <div className="inline-flex items-center gap-2 border border-blue-900/50 bg-blue-950/20 rounded-full px-4 py-1.5 text-[10px] text-blue-300 tracking-[0.2em] font-bold uppercase mb-8 shadow-[0_0_15px_rgba(59,130,246,0.1)] backdrop-blur-sm">
                            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.8)] ring-2 ring-cyan-400/20"></span>
                            Neural Link Active
                        </div>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.1] animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
                        Outsmart the <span className="italic text-cyan-400">AI.</span><br />
                        Win the <span className="text-green-500 drop-shadow-[0_0_20px_rgba(34,197,94,0.3)]">Deal.</span>
                    </h1>

                    <p className="text-slate-400 max-w-2xl text-lg mb-10 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
                        The ultimate digital bargaining pit. Negotiate, bluff, and close at the lowest price against world-class neural models.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center gap-4 animate-fade-in-up relative" style={{ animationDelay: "0.4s" }}>
                        <button onClick={() => navigate('/chat')} className="group relative bg-[#22c55e] hover:bg-[#16a34a] text-black font-bold px-8 py-3.5 rounded flex items-center gap-3 transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(34,197,94,0.2)] hover:shadow-[0_0_30px_rgba(34,197,94,0.4)] overflow-hidden">
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                            <Play className="w-5 h-5 relative z-10" />
                            <span className="relative z-10">Start New Negotiation</span>
                        </button>
                        <button
                            onClick={() => setShowHowToPlay(!showHowToPlay)}
                            className={`group border ${showHowToPlay ? 'border-cyan-500 bg-[#131B2C]' : 'border-slate-700 bg-[#0B1221]/50'} hover:border-slate-500 hover:bg-[#131B2C] text-slate-200 font-semibold px-8 py-3.5 rounded flex items-center gap-3 transition-all hover:scale-105 active:scale-95`}
                        >
                            <HelpCircle className={`w-5 h-5 ${showHowToPlay ? 'text-cyan-400' : 'text-slate-400'} group-hover:text-cyan-400 transition-colors duration-300`} />
                            <span>How to Play</span>
                        </button>

                    </div>
                </section>

                {showHowToPlay && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                        <div
                            className="absolute inset-0 bg-[#060b13]/80 backdrop-blur-md animate-fade-in"
                            onClick={() => setShowHowToPlay(false)}
                        ></div>

                        <div className="relative w-[550px] max-w-full max-h-[90vh] bg-[#0B111A]/95 backdrop-blur-3xl border border-cyan-500/30 rounded-2xl p-7 shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_40px_rgba(34,211,238,0.15)] animate-fade-in-up flex flex-col overflow-hidden">
                            <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4 shrink-0">
                                <div className="flex flex-col">
                                    <h4 className="text-[11px] font-black tracking-[0.3em] text-cyan-400 uppercase">Training Sequence</h4>
                                    <span className="text-[8px] text-slate-500 font-bold tracking-[0.1em] uppercase mt-0.5">Tactical Negotiation Manual v1.0</span>
                                </div>
                                <button onClick={() => setShowHowToPlay(false)} className="w-8 h-8 rounded-full border border-slate-800 flex items-center justify-center text-slate-500 hover:text-white hover:border-slate-600 transition-all">×</button>
                            </div>

                            <SampleChat />

                            <div className="mt-6 pt-4 border-t border-slate-800 space-y-3 shrink-0">
                                <div className="flex gap-4 animate-fade-in" style={{ animationDelay: '1.8s' }}>
                                    <div className="w-6 h-6 rounded bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-[10px] font-black shrink-0 shadow-[0_0_10px_rgba(34,211,238,0.2)]">01</div>
                                    <p className="text-[10px] text-slate-400 leading-relaxed text-left">Input your price. Watch AI tension levels to gauge if they'll fold.</p>
                                </div>
                                <div className="flex gap-4 animate-fade-in" style={{ animationDelay: '2s' }}>
                                    <div className="w-6 h-6 rounded bg-purple-500/20 text-purple-400 flex items-center justify-center text-[10px] font-black shrink-0 shadow-[0_0_10px_rgba(168,85,247,0.2)]">02</div>
                                    <p className="text-[10px] text-slate-400 leading-relaxed text-left">Use "Justify Move" to bluff about market trends or item condition.</p>
                                </div>
                                <div className="flex gap-4 animate-fade-in" style={{ animationDelay: '2.2s' }}>
                                    <div className="w-6 h-6 rounded bg-green-500/20 text-green-400 flex items-center justify-center text-[10px] font-black shrink-0 shadow-[0_0_10px_rgba(34,197,94,0.2)]">03</div>
                                    <p className="text-[10px] text-slate-400 leading-relaxed text-left">Close the deal when the price matches your target for max points.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <section className="px-6 py-12 max-w-[1400px] mx-auto w-full">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-1">Arena Sectors</h2>
                            <p className="text-[10px] font-bold text-slate-500 tracking-[0.2em] uppercase">Select your difficulty intensity</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="group bg-[#0B111A] border border-slate-800 hover:border-green-500/40 rounded-xl p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_15px_30px_rgba(0,0,0,0.6)] animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
                            <div className="flex justify-between items-start mb-4">
                                <span className="text-[10px] font-bold text-green-500 tracking-widest bg-green-500/10 px-2 py-1 rounded">LEVEL 01</span>
                                <Brain className="w-8 h-8 text-slate-700 group-hover:text-green-500 transition-colors duration-500" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Normal Mode</h3>
                            <p className="text-slate-400 text-sm mb-6 min-h-[60px] leading-relaxed">Balanced AI logic. Perfect for honing your fundamental bargaining tactics.</p>

                            <div className="w-full h-1 bg-slate-800 rounded-full mb-6 overflow-hidden">
                                <div className="h-full bg-green-500 w-[15%] group-hover:w-[35%] transition-all duration-1000 ease-out"></div>
                            </div>

                            <button
                                onClick={() => navigate('/chat', { state: { product: "Normal Terminal", difficulty: "medium" } })}
                                className="w-full bg-[#131b2c] hover:bg-[#1a243a] text-slate-300 group-hover:text-white border border-slate-800 group-hover:border-green-500/50 py-3 rounded text-sm font-semibold transition-all"
                            >
                                SELECT MISSION
                            </button>
                        </div>

                        <div className="group bg-[#0B111A] border border-slate-800 hover:border-red-500/40 rounded-xl p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_15px_30px_rgba(0,0,0,0.6)] animate-fade-in-up" style={{ animationDelay: "0.7s" }}>
                            <div className="flex justify-between items-start mb-4">
                                <span className="text-[10px] font-bold text-red-500 tracking-widest bg-red-500/10 px-2 py-1 rounded">LEVEL 05</span>
                                <Swords className="w-8 h-8 text-slate-700 group-hover:text-red-500 transition-colors duration-500" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Hard Mode</h3>
                            <p className="text-slate-400 text-sm mb-6 min-h-[60px] leading-relaxed">Aggressive counter-offers and minimal concessions. Error margin 2%.</p>

                            <div className="w-full h-1 bg-slate-800 rounded-full mb-6 overflow-hidden flex">
                                <div className="h-full bg-red-500 w-[60%] group-hover:w-[75%] transition-all duration-1000 ease-out"></div>
                            </div>

                            <button
                                onClick={() => navigate('/chat', { state: { product: "Advanced Encryption Core", difficulty: "hard" } })}
                                className="w-full bg-[#131b2c] hover:bg-[#1a243a] text-slate-300 group-hover:text-white border border-slate-800 group-hover:border-red-500/50 py-3 rounded text-sm font-semibold transition-all"
                            >
                                SELECT MISSION
                            </button>
                        </div>

                        <div className="group bg-[#0B111A] border border-slate-800 hover:border-cyan-500/40 rounded-xl p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_15px_30px_rgba(0,0,0,0.6)] animate-fade-in-up" style={{ animationDelay: "0.8s" }}>
                            <div className="flex justify-between items-start mb-4">
                                <span className="text-[10px] font-bold text-cyan-500 tracking-widest bg-cyan-500/10 px-2 py-1 rounded">MODERATE</span>
                                <Clock className="w-8 h-8 text-slate-700 group-hover:text-cyan-500 transition-colors duration-500" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Time Attack</h3>
                            <p className="text-slate-400 text-sm mb-6 min-h-[60px] leading-relaxed">60 seconds to secure the contract. Every pause costs you price leverage.</p>

                            <div className="w-full h-1 bg-slate-800 rounded-full mb-6 overflow-hidden">
                                <div className="h-full bg-cyan-500 w-[40%] group-hover:w-[20%] transition-all duration-1000 ease-out"></div>
                            </div>

                            <button
                                onClick={() => navigate('/chat', { state: { product: "Neural Burst Chip", difficulty: "medium", isTimeAttack: true } })}
                                className="w-full bg-[#131b2c] hover:bg-[#1a243a] text-slate-300 group-hover:text-white border border-slate-800 group-hover:border-cyan-500/50 py-3 rounded text-sm font-semibold transition-all"
                            >
                                SELECT MISSION
                            </button>
                        </div>

                        <div className="group bg-[#0B111A] border border-slate-800 hover:border-purple-500/40 rounded-xl p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_15px_30px_rgba(0,0,0,0.6)] animate-fade-in-up" style={{ animationDelay: "0.9s" }}>
                            <div className="flex justify-between items-start mb-4">
                                <span className="text-[10px] font-bold text-purple-500 tracking-widest bg-purple-500/10 px-2 py-1 rounded">MASTER</span>
                                <VenetianMask className="w-8 h-8 text-slate-700 group-hover:text-purple-500 transition-colors duration-500" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Bluff Mode</h3>
                            <p className="text-slate-400 text-sm mb-6 min-h-[60px] leading-relaxed">The AI may lie about competitor prices or market demand. Use intuition.</p>

                            <div className="w-full h-1 bg-slate-800 rounded-full mb-6 overflow-hidden bg-gradient-to-r from-purple-500/20 to-transparent">
                                <div className="h-full bg-purple-500 w-[85%] group-hover:w-[95%] transition-all duration-1000 ease-out"></div>
                            </div>

                            <button
                                onClick={() => navigate('/chat', { state: { product: "Void-Link Processor", difficulty: "expert" } })}
                                className="w-full bg-[#131b2c] hover:bg-[#1a243a] text-slate-300 group-hover:text-white border border-slate-800 group-hover:border-purple-500/50 py-3 rounded text-sm font-semibold transition-all"
                            >
                                SELECT MISSION
                            </button>
                        </div>
                    </div>
                </section>

                <section className="px-6 py-12 max-w-[1400px] mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 animate-fade-in-up" style={{ animationDelay: "1s" }}>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold flex items-center gap-3"><BarChart3 className="text-cyan-400 w-5 h-5" /> Global Rankings</h3>
                            <button onClick={() => navigate('/leaderboard')} className="text-[10px] font-bold tracking-[0.1em] text-cyan-400 hover:text-cyan-300 uppercase transition-colors">View Full Leaderboard</button>
                        </div>
                        <div className="bg-[#0B111A] border border-slate-800 rounded-xl overflow-hidden shadow-lg">
                            <table className="w-full text-left text-sm">
                                <thead className="text-[9px] text-slate-500 uppercase tracking-widest border-b border-slate-800 bg-[#060b13]/50">
                                    <tr>
                                        <th className="px-6 py-5 font-bold">Rank</th>
                                        <th className="px-6 py-5 font-bold">Player</th>
                                        <th className="px-6 py-5 font-bold text-right">Arena Score</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/60">
                                    {(topRankings.length > 0 ? [...topRankings].sort((a, b) => b.score - a.score) : [
                                        { rank: 1, name: "Xenon_Striker", score: "42,900" },
                                        { rank: 2, name: "Cipher_Mind", score: "38,120" },
                                        { rank: 3, name: "Nego_Queen", score: "35,500" }
                                    ]).map((row, idx) => {
                                        const rank = row.rank || idx + 1;
                                        const name = row.name || row.username;
                                        const scoreDisplay = typeof row.score === 'number' ? row.score.toLocaleString() : row.score;
                                        return (
                                            <tr key={idx} className="hover:bg-[#131b2c] transition-colors group">
                                                <td className="px-6 py-5">
                                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] ring-1 group-hover:scale-110 transition-transform ${rank === 1 ? 'bg-yellow-500/20 text-yellow-500 ring-yellow-500/50' : rank === 2 ? 'bg-slate-400/20 text-slate-300 ring-slate-400/50' : 'bg-orange-500/20 text-orange-400 ring-orange-500/50'}`}>
                                                        {rank}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 flex items-center gap-3">
                                                    <div className="w-6 h-6 rounded-full bg-slate-700 overflow-hidden">
                                                        <img src={`https://ui-avatars.com/api/?name=${name || 'Player'}&background=1e293b&color=fff&size=24`} alt="user" />
                                                    </div>
                                                    <span className="text-slate-200 font-semibold tracking-wide">{name || 'Player'}</span>
                                                </td>
                                                <td className="px-6 py-5 text-right text-green-400 font-bold tracking-wider">{scoreDisplay}</td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="animate-fade-in-up" style={{ animationDelay: "1.1s" }}>
                        <div className="flex items-center gap-2 mb-6">
                            <Terminal className="text-red-400 w-5 h-5" />
                            <h3 className="text-xl font-bold text-white">Live Feed</h3>
                        </div>
                        <div className="bg-[#050B14] border border-slate-800 rounded-xl p-5 font-mono text-[11px] leading-relaxed space-y-4 h-[320px] overflow-y-auto relative custom-scrollbar shadow-[inset_0_4px_20px_rgba(0,0,0,0.5)]">
                            {liveFeed && liveFeed.length > 0 ? liveFeed.map((event, idx) => (
                                <div key={idx} className="flex gap-3">
                                    <span className={`shrink-0 select-none ${event.type === 'error' ? 'text-red-500' : 'text-green-500'}`}>▶</span>
                                    <div>
                                        <span className="text-slate-500 mr-2">[{event.timestamp}]</span>
                                        <span className={event.color || 'text-slate-400'}>{event.message}</span>
                                    </div>
                                </div>
                            )) : (
                                <div className="space-y-4">
                                    {dummyFeed.map((l, i) => (
                                        <div key={l.id} className="flex gap-3 animate-fade-in-up" style={{ animationDelay: `${i * 0.15}s` }}>
                                            <span className="text-green-500 shrink-0 select-none">▶</span>
                                            <div>
                                                <span className="text-slate-500 mr-2">[{l.ts}]</span>
                                                <span className={l.color}>{l.msg}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                <section className="px-6 py-24 max-w-[1400px] mx-auto w-full relative animate-fade-in-up" style={{ animationDelay: "1.2s" }}>
                    <div className="absolute top-10 left-6 w-12 h-12 border-t border-l border-cyan-500/30 rounded-tl-lg"></div>
                    <div className="absolute bottom-10 right-6 w-12 h-12 border-b border-r border-cyan-500/30 rounded-br-lg"></div>

                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-white mb-4">Master the Arena</h2>
                        <p className="text-slate-400 max-w-xl mx-auto text-sm leading-relaxed">The path to elite status requires more than just numbers. It requires psychological dominance.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
                        <div className="flex flex-col items-center text-center group">
                            <div className="w-16 h-16 rounded-2xl bg-[#0B111A] border border-slate-800 flex items-center justify-center mb-6 group-hover:-translate-y-2 group-hover:border-cyan-500/50 transition-all duration-300 shadow-lg relative overflow-hidden">
                                <div className="absolute inset-0 bg-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <Crosshair className="w-7 h-7 text-cyan-400" />
                            </div>
                            <h4 className="text-lg font-bold text-white mb-3">1. Make an Offer</h4>
                            <p className="text-slate-500 text-sm leading-relaxed">Input your initial bid. Watch the AI's pulse to gauge interest and emotional response.</p>
                        </div>

                        <div className="flex flex-col items-center text-center group">
                            <div className="w-16 h-16 rounded-2xl bg-[#0B111A] border border-slate-800 flex items-center justify-center mb-6 group-hover:-translate-y-2 group-hover:border-green-500/50 transition-all duration-300 shadow-lg relative overflow-hidden">
                                <div className="absolute inset-0 bg-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <HelpCircle className="w-7 h-7 text-green-500" />
                            </div>
                            <h4 className="text-lg font-bold text-white mb-3">2. Outsmart the AI</h4>
                            <p className="text-slate-500 text-sm leading-relaxed">Detect bluffs, use time pressure, and pivot your strategy as the neural network learns you.</p>
                        </div>

                        <div className="flex flex-col items-center text-center group">
                            <div className="w-16 h-16 rounded-2xl bg-[#0B111A] border border-slate-800 flex items-center justify-center mb-6 group-hover:-translate-y-2 group-hover:border-red-400/50 transition-all duration-300 shadow-lg relative overflow-hidden">
                                <div className="absolute inset-0 bg-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <CircleDollarSign className="w-7 h-7 text-red-400" />
                            </div>
                            <h4 className="text-lg font-bold text-white mb-3">3. Close the Deal</h4>
                            <p className="text-slate-500 text-sm leading-relaxed">Lock in the lowest possible price. Higher savings equal higher global arena rankings.</p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
