import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useHome } from '../hooks/useHome';
import { useAuth } from '../../Auth/hooks/useAuth';
import { useDispatch } from 'react-redux';
import { resetChat } from '../../Chat/chat.slice';
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
    LogOut,
    User
} from 'lucide-react';

const DUMMY_FEED_POOL = [
    { msg: "User Arjun closed deal at ₹610 (Profit +₹120)", color: "text-green-400" },
    { msg: "AI rejected offer from Sneha ❌", color: "text-slate-400" },
    { msg: "System: New Bluff Mode record set by Rohan", color: "text-cyan-400" },
    { msg: "User Kavya exposed AI bluff successfully (Saved ₹380)", color: "text-[#FF4455]" },
    { msg: "Market update: Electronics prices surged by 4.8%", color: "text-slate-500" },
    { msg: "User Rahul finalized deal at ₹3,150", color: "text-green-400" },
    { msg: "AI recalibrating strategy for Hard Mode...", color: "text-purple-400" },
    { msg: "Time Attack cleared by Ananya in record time", color: "text-cyan-500" },
    { msg: "User Vikram failed to detect AI bluff", color: "text-red-500" },
    { msg: "Supply surplus detected. Difficulty adjusted.", color: "text-slate-500" },
    { msg: "Match: User Priya secured a 42% discount", color: "text-green-400" },
    { msg: "System: Server optimization complete", color: "text-slate-400" },
    { msg: "Alert: AI bluff detected by User Karan", color: "text-green-400" },
    { msg: "Market trend: Hardware costs gradually increasing", color: "text-orange-400" },
    { msg: "User Neha reached Level 50 Negotiation Mastery", color: "text-yellow-400" },
    { msg: "AI accepted counter-offer from Aditya", color: "text-green-400" },
    { msg: "System anomaly: Price fluctuation detected in Zone 3", color: "text-purple-400" },
    { msg: "User Aman lost 25 points due to missed bluff detection", color: "text-red-400" },
    { msg: "Match: 1v1 Arena challenge initiated by top player", color: "text-cyan-400" },
    { msg: "Server: Peak negotiation traffic reached", color: "text-slate-500" },
    { msg: "User Isha identified a rare AI deception", color: "text-yellow-300" },
    { msg: "Market watch: Demand for chips slightly dropped", color: "text-slate-400" },
    { msg: "Warning: AI bluff frequency increased", color: "text-red-500" },
    { msg: "User Dev caught consecutive AI bluffs", color: "text-green-400" },
    { msg: "System: Scheduled maintenance for AI tuning", color: "text-slate-500" }
];

const TypewriterText = ({ text, delay = 25, startDelay = 0, onComplete }) => {
    const [displayedText, setDisplayedText] = useState('');
    const [isDone, setIsDone] = useState(false);

    useEffect(() => {
        if (isDone) return;

        let timeout = setTimeout(() => {
            let i = 0;
            const interval = setInterval(() => {
                setDisplayedText(text.slice(0, i + 1));
                i++;
                if (i >= text.length) {
                    clearInterval(interval);
                    setIsDone(true);
                    if (onComplete) onComplete();
                }
            }, delay);
            return () => clearInterval(interval);
        }, startDelay);

        return () => clearTimeout(timeout);
    }, [text, delay, startDelay, onComplete, isDone]);

    return (
        <span className={!isDone ? "after:content-['|'] after:animate-pulse after:ml-0.5 after:text-cyan-400" : ""}>
            {isDone ? text : displayedText}
        </span>
    );
};

const SampleChat = () => {
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => setCurrentStep(1), 500);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        let timer;
        if (currentStep === 2) timer = setTimeout(() => setCurrentStep(3), 1500);
        if (currentStep === 4) timer = setTimeout(() => setCurrentStep(5), 1500);
        if (currentStep === 6) timer = setTimeout(() => setCurrentStep(7), 1500);
        if (currentStep === 8) timer = setTimeout(() => setCurrentStep(9), 1500);
        if (currentStep === 10) timer = setTimeout(() => setCurrentStep(11), 1500);
        return () => clearTimeout(timer);
    }, [currentStep]);

    const nextStep = () => setCurrentStep(prev => prev + 1);
    const chatContainerRef = (node) => {
        if (node) {
            node.scrollTop = node.scrollHeight;
        }
    };

    return (
        <div
            ref={chatContainerRef}
            className="flex flex-col gap-6 text-left max-h-[420px] overflow-y-auto pr-3 custom-scrollbar"
        >
            {currentStep >= 1 && (
                <div className="grid grid-cols-[1.2fr_0.8fr] gap-4 animate-fade-in-up">
                    <div className="bg-cyan-950/40 border border-cyan-500/20 rounded-lg p-3">
                        <div className="text-[7px] text-cyan-400 font-black uppercase mb-1.5 tracking-widest uppercase">You // Initial_Bid</div>
                        <div className="text-[11px] text-white leading-tight min-h-[1.5em]">
                            <TypewriterText
                                text="I'll start at ₹1,100."
                                onComplete={() => currentStep === 1 && nextStep()}
                            />
                        </div>
                    </div>
                    {currentStep >= 2 && (
                        <div className="flex items-center text-[9px] text-slate-500 font-bold italic border-l border-slate-800 pl-3 leading-tight animate-fade-in">
                            Setting a low anchor point to test AI resistance.
                        </div>
                    )}
                </div>
            )}

            {currentStep >= 3 && (
                <div className="grid grid-cols-[1.2fr_0.8fr] gap-4 animate-fade-in-up">
                    <div className="bg-purple-900/20 border border-purple-500/20 rounded-lg p-3">
                        <div className="text-[7px] text-purple-400 font-black uppercase mb-1.5 tracking-widest uppercase">AI // Defensive_Counter</div>
                        <div className="text-[11px] text-slate-300 leading-tight min-h-[1.5em]">
                            <TypewriterText
                                text="₹1,400. This unit is high-tier synaptic hardware."
                                onComplete={() => currentStep === 3 && nextStep()}
                            />
                        </div>
                    </div>
                    {currentStep >= 4 && (
                        <div className="flex items-center text-[9px] text-purple-400/70 font-bold italic border-l border-slate-800 pl-3 leading-tight animate-fade-in">
                            Sentient entity attempts to justify value via technical specs.
                        </div>
                    )}
                </div>
            )}

            {currentStep >= 5 && (
                <div className="grid grid-cols-[1.2fr_0.8fr] gap-4 animate-fade-in-up">
                    <div className="bg-cyan-950/60 border border-cyan-400/40 rounded-lg p-3 ring-1 ring-cyan-400/10">
                        <div className="text-[7px] text-cyan-400 font-black uppercase mb-1.5 tracking-widest uppercase">You // Bluff_Sequence</div>
                        <div className="text-[11px] text-white leading-tight min-h-[1.5em]">
                            <TypewriterText
                                text="Wait. Sector B reports a surplus. It's aged technology."
                                onComplete={() => currentStep === 5 && nextStep()}
                            />
                        </div>
                    </div>
                    {currentStep >= 6 && (
                        <div className="flex items-center text-[9px] text-cyan-400/80 font-bold italic border-l border-slate-800 pl-3 leading-tight animate-fade-in">
                            "Bluffing" about market surplus to lower price leverage.
                        </div>
                    )}
                </div>
            )}

            {currentStep >= 7 && (
                <div className="grid grid-cols-[1.2fr_0.8fr] gap-4 animate-fade-in-up">
                    <div className="bg-purple-900/20 border border-purple-500/20 rounded-lg p-3">
                        <div className="text-[7px] text-purple-400 font-black uppercase mb-1.5 tracking-widest uppercase">AI // Yield_Concession</div>
                        <div className="text-[11px] text-slate-300 leading-tight min-h-[1.5em]">
                            <TypewriterText
                                text="Analyzing market logs... Data conflict detected. Accepted. ₹1,150 is the optimal re-calibration."
                                onComplete={() => currentStep === 7 && nextStep()}
                            />
                        </div>
                    </div>
                    {currentStep >= 8 && (
                        <div className="flex items-center text-[9px] text-green-500 font-bold italic border-l border-slate-800 pl-3 leading-tight animate-fade-in">
                            The AI folded due to "market data conflict" bluff.
                        </div>
                    )}
                </div>
            )}

            {currentStep >= 9 && (
                <div className="grid grid-cols-[1.2fr_0.8fr] gap-4 animate-fade-in-up">
                    <div className="bg-cyan-950/60 border border-cyan-400/40 rounded-lg p-3 ring-1 ring-cyan-400/10">
                        <div className="text-[7px] text-cyan-400 font-black uppercase mb-1.5 tracking-widest uppercase">You // Deal_Finalize</div>
                        <div className="text-[11px] text-white leading-tight min-h-[1.5em]">
                            <TypewriterText
                                text="Excellent. Deal finalized at ₹1,150. I'll take it."
                                onComplete={() => currentStep === 9 && nextStep()}
                            />
                        </div>
                    </div>
                    {currentStep >= 10 && (
                        <div className="flex items-center text-[9px] text-cyan-400 font-bold italic border-l border-slate-800 pl-3 leading-tight animate-fade-in">
                            Accepting the final price to secure the asset.
                        </div>
                    )}
                </div>
            )}

            {currentStep >= 11 && (
                <div className="grid grid-cols-[1.2fr_0.8fr] gap-4 animate-fade-in-up">
                    <div className="bg-green-900/40 border border-green-500/50 rounded-lg p-3 shadow-[0_0_20px_rgba(34,197,94,0.15)]">
                        <div className="text-[7px] text-green-400 font-black uppercase mb-1.5 tracking-widest uppercase">AI // Protocol_Accepted</div>
                        <div className="text-[11px] text-slate-100 leading-tight min-h-[1.5em] font-bold">
                            <TypewriterText
                                text="DEAL_ESTABLISHED. Transferring ownership... Uplink complete. Savings recalculated: 23.33%."
                                onComplete={() => {}}
                            />
                        </div>
                    </div>
                    <div className="flex items-center text-[9px] text-green-400 font-black animate-pulse border-l border-green-500/30 pl-3 leading-tight uppercase tracking-wider">
                        Negotiation Success. Points Awarded.
                    </div>
                </div>
            )}
        </div>
    );
};

const NavigationItem = ({ icon: Icon, label, onClick, isActive, colorClass = "text-slate-400" }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group ${isActive ? 'bg-cyan-500/10 border border-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.1)]' : 'hover:bg-slate-800/40 border border-transparent hover:border-slate-700/50'}`}
    >
        <Icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-cyan-400' : colorClass} group-hover:text-cyan-400`} />
        <span className={`text-[11px] font-bold uppercase tracking-[0.2em] transition-colors duration-300 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`}>
            {label}
        </span>
        {isActive && <div className="ml-auto w-1 h-1 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.8)]"></div>}
    </button>
);

const SidebarContent = ({ userStats, authUser, handleLogout, onNavigate, onHelp, activePath }) => (
    <div className="flex flex-col h-full p-6 animate-fade-in">
        <div className="mb-12 shrink-0">
            <div className="text-2xl font-black tracking-widest text-cyan-500 flex items-center gap-3">
                <Terminal className="w-6 h-6" />
                <span>NegoArena</span>
            </div>
            <div className="mt-1 text-[8px] font-bold text-slate-600 uppercase tracking-[0.3em]">Cortex Interface v2.4</div>
        </div>

        <div className="space-y-2 flex-1">
            <div className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] mb-4 ml-4">Main Menu</div>
            <NavigationItem icon={User} label="Dashboard" isActive={activePath === '/dashboard'} onClick={() => onNavigate('/dashboard')} />
            <NavigationItem icon={BarChart3} label="Leaderboard" isActive={activePath === '/leaderboard'} onClick={() => onNavigate('/leaderboard')} />
            <NavigationItem icon={HelpCircle} label="How to Play" onClick={onHelp} />
            
            <div className="pt-8 pb-4">
                <div className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] mb-4 ml-4">Player Stats</div>
                <div className="bg-slate-900/40 border border-slate-800/60 rounded-xl p-4 space-y-4">
                    <div className="flex flex-col gap-1">
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Global Rank</span>
                        <span className="text-xl font-black text-cyan-400 tracking-tight">#{userStats.rank || 'N/A'}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Arena Score</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-xl font-black text-white tracking-tight">{userStats.score || '0'}</span>
                            <span className="text-[9px] font-bold text-cyan-500 uppercase">PTS</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="mt-auto pt-6 border-t border-slate-800/60 shrink-0 space-y-4">
            <div className="flex items-center gap-3 bg-slate-800/40 p-3 rounded-xl border border-slate-700/30">
                <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center shrink-0">
                    <img 
                        src={authUser?.avatar || `https://ui-avatars.com/api/?name=${authUser?.user || 'User'}&background=0284c7&color=fff&bold=true`} 
                        alt="User" 
                        className="w-full h-full object-cover" 
                    />
                </div>
                <div className="flex flex-col overflow-hidden">
                    <span className="text-[10px] font-black text-white uppercase tracking-wider truncate">{authUser?.user || 'Guest'}</span>
                    <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Active Link</span>
                </div>
            </div>
            <NavigationItem icon={LogOut} label="Log Out" colorClass="text-red-400" onClick={handleLogout} />
        </div>
    </div>
);

export default function Dashboard() {
    const navigate = useNavigate();
    const [showHowToPlay, setShowHowToPlay] = useState(false);
    const [showBluffModal, setShowBluffModal] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [text, setText] = useState('Start New Negotiation');
    const { user: authUser, handleLogout } = useAuth();
    const dispatch = useDispatch();

    const {
        userStats,
        topRankings,
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
    const [intervalId, setIntervalId] = useState(null);
    const originalText = 'Start New Negotiation';
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";

    const handleScramble = () => {
        if (intervalId) clearInterval(intervalId);

        let iteration = 0;
        const newIntervalId = setInterval(() => {
            setText(originalText.split("")
                .map((char, index) => {
                    if (index < iteration) return originalText[index];
                    return characters[Math.floor(Math.random() * characters.length)];
                })
                .join("")
            );

            if (iteration >= originalText.length) {
                clearInterval(newIntervalId);
            }
            iteration += 1 / 3;
        }, 30);

        setIntervalId(newIntervalId);
    };

    const handleMouseLeave = () => {
        if (intervalId) clearInterval(intervalId);
        setText(originalText);
    };

    return (
        <div className="flex min-h-screen bg-[#060b13] text-slate-200 font-sans selection:bg-cyan-500/30">
            <aside className="hidden lg:block w-70 bg-[#0B111A]/60 backdrop-blur-2xl border-r border-slate-800/60 sticky top-0 h-screen z-50">
                <SidebarContent 
                    userStats={userStats} 
                    authUser={authUser} 
                    handleLogout={async () => { await handleLogout(); navigate('/login'); }} 
                    onNavigate={navigate}
                    onHelp={() => setShowHowToPlay(true)}
                    activePath="/dashboard"
                />
            </aside>

            {isSidebarOpen && (
                <div className="lg:hidden fixed inset-0 z-[100] flex">
                    <div className="absolute inset-0 bg-[#060b13]/80 backdrop-blur-md animate-fade-in" onClick={() => setIsSidebarOpen(false)}></div>
                    <aside className="relative w-70 h-full bg-[#0B111A] border-r border-slate-800 shadow-[20px_0_50px_rgba(0,0,0,0.5)] animate-slide-right">
                        <SidebarContent 
                            userStats={userStats} 
                            authUser={authUser} 
                            handleLogout={async () => { await handleLogout(); navigate('/login'); }} 
                            onNavigate={navigate}
                            onHelp={() => {
                                setShowHowToPlay(true);
                                setIsSidebarOpen(false);
                            }}
                            activePath="/dashboard"
                        />
                    </aside>
                </div>
            )}

            <div className="flex-1 flex flex-col relative overflow-x-hidden min-h-screen">
                <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                    <div
                        className="absolute inset-0 opacity-[0.02]"
                        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 40V0h40' fill='none' stroke='%23ffffff' stroke-width='1'/%3E%3C/svg%3E")` }}
                    ></div>
                    <div className="absolute top-[-10%] left-1/4 w-[600px] h-[600px] bg-cyan-900/20 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow"></div>
                </div>

                <div className="lg:hidden flex items-center justify-between px-6 py-4 border-b border-slate-800/60 bg-[#060b13]/80 backdrop-blur-xl sticky top-0 z-40">
                    <div className="text-xl font-black tracking-widest text-cyan-500">NegoArena</div>
                    <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-slate-400 hover:text-white transition-colors">
                        <Terminal className="w-6 h-6" />
                    </button>
                </div>

                <div className="relative z-10 flex flex-col flex-1">


                <section className="relative px-4 sm:px-6 py-12 sm:py-20 flex flex-col items-center text-center overflow-hidden">
                    <div className="absolute top-1/2 left-[15%] -translate-x-1/2 -translate-y-[60%] text-[6rem] sm:text-[10rem] md:text-[15rem] font-bold text-slate-800/10 select-none animate-float pointer-events-none" style={{ animationDelay: "0s" }}>₹850</div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[40%] text-[8rem] sm:text-[12rem] md:text-[20rem] font-bold text-slate-800/5 select-none animate-float pointer-events-none" style={{ animationDelay: "1.5s" }}>₹420</div>
                    <div className="absolute top-1/2 left-[85%] -translate-x-1/2 -translate-y-[50%] text-[5rem] sm:text-[8rem] md:text-[12rem] font-bold text-slate-800/10 select-none animate-float pointer-events-none" style={{ animationDelay: "3s" }}>₹95</div>

                    <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.1] animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
                        Outsmart the <span className="italic text-cyan-400">AI.</span><br />
                        Win the <span className="text-green-500 drop-shadow-[0_0_20px_rgba(34,197,94,0.3)]">Deal.</span>
                    </h1>

                    <p className="text-slate-400 max-w-2xl text-lg mb-10 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
                        The ultimate digital bargaining pit. Negotiate, bluff, and close at the lowest price against state-of-the-art sentient cores.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center gap-4 animate-fade-in-up relative" style={{ animationDelay: "0.4s" }}>
                        <button
                            onMouseEnter={handleScramble}
                            onMouseLeave={handleMouseLeave}
                            onClick={() => {
                                dispatch(resetChat());
                                navigate('/chat', { state: { difficulty: "medium" } });
                            }}
                            className="group relative bg-[#22c55e] hover:bg-[#22c55e] text-black font-bold px-8 py-3.5 rounded flex items-center gap-3 transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_40px_rgba(34,197,94,0.6)] overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 -translate-x-full group-hover:animate-shimmer"></div>
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.4)_0%,transparent_70%)]"></div>
                            <Play className="w-5 h-5 relative z-10 fill-black/20" />
                            <span className="relative z-10 font-mono tracking-tight">{text}</span>
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

                        <div className="relative w-full max-w-[550px] max-h-[90vh] bg-[#0B111A]/95 backdrop-blur-3xl border border-cyan-500/30 rounded-2xl p-5 sm:p-7 shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_40px_rgba(34,211,238,0.15)] animate-fade-in-up flex flex-col overflow-hidden">
                            <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4 shrink-0">
                                <div className="flex flex-col text-left">
                                    <h4 className="text-[9px] sm:text-[11px] font-black tracking-[0.3em] text-cyan-400 uppercase">Training Sequence</h4>
                                    <span className="text-[7px] sm:text-[8px] text-slate-500 font-bold tracking-[0.1em] uppercase mt-0.5">Tactical Negotiation Manual v1.0</span>
                                </div>
                                <button onClick={() => setShowHowToPlay(false)} className="w-8 h-8 rounded-full border border-slate-800 flex items-center justify-center text-slate-500 hover:text-white hover:border-slate-600 transition-all">×</button>
                            </div>

                            <SampleChat />

                            <div className="mt-6 pt-4 border-t border-slate-800 space-y-3 shrink-0 overflow-y-auto pr-1">
                                <div className="flex gap-4 animate-fade-in" style={{ animationDelay: '1.8s' }}>
                                    <div className="w-6 h-6 rounded bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-[9px] sm:text-[10px] font-black shrink-0 shadow-[0_0_10px_rgba(34,211,238,0.2)]">01</div>
                                    <p className="text-[9px] sm:text-[10px] text-slate-400 leading-relaxed text-left">Input your price. Watch AI tension levels to gauge if they'll fold.</p>
                                </div>
                                <div className="flex gap-4 animate-fade-in" style={{ animationDelay: '2s' }}>
                                    <div className="w-6 h-6 rounded bg-purple-500/20 text-purple-400 flex items-center justify-center text-[10px] font-black shrink-0 shadow-[0_0_10px_rgba(168,85,247,0.2)]">02</div>
                                    <p className="text-[10px] text-slate-400 leading-relaxed text-left">Use "Justify Move" to bluff about market trends or item condition.</p>
                                </div>
                                <div className="flex gap-4 animate-fade-in" style={{ animationDelay: '2.2s' }}>
                                    <div className="w-6 h-6 rounded bg-green-500/20 text-green-400 flex items-center justify-center text-[10px] font-black shrink-0 shadow-[0_0_10px_rgba(34,197,94,0.2)]">03</div>
                                    <p className="text-[10px] text-slate-400 leading-relaxed text-left">Close the deal when the price matches your target for max points.</p>
                                </div>
                                <div className="flex gap-4 animate-fade-in" style={{ animationDelay: '2.4s' }}>
                                    <div className="w-6 h-6 rounded bg-red-500/20 text-red-400 flex items-center justify-center text-[10px] font-black shrink-0 shadow-[0_0_10px_rgba(239,68,68,0.2)]">04</div>
                                    <p className="text-[10px] text-slate-400 leading-relaxed text-left"><span className="text-red-400 font-bold">HARD MODE:</span> Negotiate under pressure. Max rounds capped at <span className="text-white font-bold">6</span>.</p>
                                </div>
                                <div className="flex gap-4 animate-fade-in" style={{ animationDelay: '2.6s' }}>
                                    <div className="w-6 h-6 rounded bg-yellow-500/20 text-yellow-500 flex items-center justify-center text-[10px] font-black shrink-0 shadow-[0_0_10px_rgba(234,179,8,0.2)]">05</div>
                                    <p className="text-[10px] text-slate-400 leading-relaxed text-left"><span className="text-yellow-500 font-bold">PROTOCOL ERRORS:</span> If rounds exceed max limits, the synaptic link is severed instantly.</p>
                                </div>
                                <div className="flex gap-4 animate-fade-in" style={{ animationDelay: '2.8s' }}>
                                    <div className="w-6 h-6 rounded bg-orange-500/20 text-orange-400 flex items-center justify-center text-[10px] font-black shrink-0 shadow-[0_0_10px_rgba(249,115,22,0.2)]">06</div>
                                    <p className="text-[10px] text-slate-400 leading-relaxed text-left"><span className="text-orange-400 font-bold">COGNITIVE THRESHOLD:</span> Frustrating the sentient entity drops patience. Below <span className="text-white font-bold">10%</span> results in link termination.</p>
                                </div>
                                <div className="flex gap-4 animate-fade-in" style={{ animationDelay: '3.0s' }}>
                                    <div className="w-6 h-6 rounded bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-[10px] font-black shrink-0 shadow-[0_0_10px_rgba(34,211,238,0.2)]">07</div>
                                    <p className="text-[10px] text-slate-400 leading-relaxed text-left"><span className="text-cyan-400 font-bold">TIME ATTACK:</span> 120s sync window. Price leverage decreases as the timer counts down.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {showBluffModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <div
                            className="absolute inset-0 bg-[#060b13]/90 backdrop-blur-md animate-fade-in"
                            onClick={() => setShowBluffModal(false)}
                        ></div>

                        <div className="relative w-[500px] max-w-full bg-[#0B111A]/95 backdrop-blur-3xl border border-purple-500/30 rounded-2xl p-8 shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_40px_rgba(168,85,247,0.15)] animate-fade-in-up flex flex-col text-center">
                            <button
                                onClick={() => setShowBluffModal(false)}
                                className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
                            >
                                <span className="text-2xl font-light">×</span>
                            </button>

                            <div className="flex justify-center mb-6">
                                <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.2)]">
                                    <VenetianMask className="w-8 h-8 text-purple-500" />
                                </div>
                            </div>

                            <h3 className="text-[11px] font-black tracking-[0.3em] text-purple-400 uppercase mb-2">Psychological Warfare</h3>
                            <h2 className="text-2xl font-bold text-white mb-4">Mastering the Bluff</h2>

                            <div className="text-slate-400 text-sm leading-relaxed mb-8 space-y-4 text-left">
                                <p>
                                    In <span className="text-purple-400 font-bold">Bluff Mode</span>, you're not just negotiating prices—you're detecting deception. Our cortex architects will occasionally use false information to gain leverage.
                                </p>
                                <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 space-y-2">
                                    <div className="flex gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 shrink-0"></div>
                                        <p className="text-xs italic text-slate-300">"Another agent is offering more right now."</p>
                                    </div>
                                    <div className="flex gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 shrink-0"></div>
                                        <p className="text-xs italic text-slate-300">"This is the last unit in current stock."</p>
                                    </div>
                                </div>
                                <p className="text-xs font-medium text-slate-500 border-l-2 border-purple-500/30 pl-3">
                                    Identify if the sentient entity is bluffing or being genuine. One wrong guess severs the cortex sync. How many bluffs can you catch?
                                </p>
                            </div>

                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={() => {
                                        setShowBluffModal(false);
                                        navigate('/bluff');
                                    }}
                                    className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-4 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_rgba(168,85,247,0.3)] flex items-center justify-center gap-2"
                                >
                                    <Play className="w-4 h-4 fill-white/20" />
                                    PROCEED TO ARENA
                                </button>
                                <button
                                    onClick={() => setShowBluffModal(false)}
                                    className="text-[10px] font-bold text-slate-500 uppercase tracking-widest hover:text-slate-300 transition-colors py-2"
                                >
                                    RETURN TO HUB
                                </button>
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
                                onClick={() => {
                                    dispatch(resetChat());
                                    navigate('/chat', { state: { difficulty: "medium" } });
                                }}
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
                                onClick={() => {
                                    dispatch(resetChat());
                                    navigate('/chat', { state: { difficulty: "hard" } });
                                }}
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
                                onClick={() => {
                                    dispatch(resetChat());
                                    navigate('/chat', { state: { difficulty: "medium", isTimeAttack: true } });
                                }}
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
                                onClick={() => setShowBluffModal(true)}
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
                        <div className="bg-[#0B111A] border border-slate-800 rounded-xl overflow-x-auto shadow-lg custom-scrollbar">
                            <table className="w-full text-left text-sm min-w-[500px]">
                                <thead className="text-[9px] text-slate-500 uppercase tracking-widest border-b border-slate-800 bg-[#060b13]/50">
                                    <tr>
                                        <th className="px-6 py-5 font-bold">Rank</th>
                                        <th className="px-6 py-5 font-bold">Player</th>
                                        <th className="px-6 py-5 font-bold text-right">Arena Score</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/60">
                                    {topRankings.length > 0 ? [...topRankings].sort((a, b) => b.score - a.score).slice(0, 5).map((row, idx) => {
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
                                                    <div className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] ring-1 group-hover:scale-110 transition-transform">
                                                        <User className="w-4 h-4 text-slate-400 p-1" />
                                                    </div>
                                                    <span className="text-slate-200 font-semibold tracking-wide">{name || 'Player'}</span>
                                                </td>
                                                <td className="px-6 py-5 text-right text-green-400 font-bold tracking-wider">{scoreDisplay}</td>
                                            </tr>
                                        )
                                    }) : (
                                        <tr>
                                            <td colSpan="3" className="px-6 py-10 text-center text-slate-500 italic font-medium tracking-wide">
                                                No Rankings Yet
                                            </td>
                                        </tr>
                                    )}
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
                            <div className="space-y-4">
                                {dummyFeed.map((l, i) => (
                                    <div key={l.id} className="flex gap-3 animate-fade-in-up" style={{ animationDelay: `${i * 0.4}s` }}>
                                        <span className="text-green-500 shrink-0 select-none">▶</span>
                                        <div>
                                            <span className="text-slate-500 mr-2">[{l.ts}]</span>
                                            <span className={l.color}>
                                                <TypewriterText text={l.msg} delay={20} />
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
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
                            <p className="text-slate-500 text-sm leading-relaxed">Detect bluffs, use time pressure, and pivot your strategy as the cortex lattice learns you.</p>
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
                    <div className="absolute bottom-[20%] right-[-10%] w-[800px] h-[800px] bg-green-900/10 rounded-full blur-[150px] mix-blend-screen animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
                </div>
            </div>
        </div>
    );
}
