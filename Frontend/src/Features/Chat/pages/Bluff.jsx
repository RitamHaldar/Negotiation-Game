import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
    VenetianMask,
    ChevronLeft,
    Brain,
    Target,
    ShieldCheck,
    ShieldAlert,
    RefreshCcw,
    Zap,
    Trophy,
    Skull,
    Terminal
} from 'lucide-react';

const NEGOTIATION_FEED = [
    {
        msg: "Analyzing your last bid against our cortex-authorized parity... The margin is tight, but I can justify a 10% reduction if we lock the synaptic link now. This is a baseline compromise, not a tactical maneuver.",
        isBluff: false
    },
    {
        msg: "I just received a high-priority packet from a level-9 operative in the Azure sector. They are prepared to authorize a full-credit transfer for this module immediately. If you don't beat their price in this cycle, the ghost link will terminate.",
        isBluff: true
    },
    {
        msg: "Our internal audit protocols show a surplus of these specific synaptic modules in Zone 4. While the supply isn't infinite, we can afford a bit more flexibility in the current negotiation window to clear the registry.",
        isBluff: false
    },
    {
        msg: "This hardware is part of a rare, limited-run synaptic batch developed for the High Council. We only have three units remaining in the entire galaxy, and the demand is surging following the recent sector blackout. Prices will double in minutes.",
        isBluff: true
    },
    {
        msg: "Your persistence is statistically significant. I've re-calibrated the offer based on our long-term collaboration metadata, and I can meet you at the 1,450 mark to ensure a smooth and logical conclusion to this session.",
        isBluff: false
    },
    {
        msg: "Honestly, I'm already selling this below our operational cost. If I go any lower, the system's financial supervisors will flag this link for suspicious activity, and we could both face a permanent cortical lockout.",
        isBluff: true
    },
    {
        msg: "I've reviewed the current market trends in the nearby systems, and prices are indeed dipping slightly. I'll match that trend but only for this specific transaction and only if we close the deal within this sync cycle.",
        isBluff: false
    },
    {
        msg: "Wait! I just got a notification that the materials used in these modules have been declared illegal in the Solar Sector. This is your last chance to buy them before we are forced to incinerate the remaining inventory.",
        isBluff: true
    },
    {
        msg: "My objective is to optimize this transaction for both ends. Given your reliability, I'm authorized to remove the 5% transaction overhead costs if it helps us finish these negotiations right now.",
        isBluff: false
    },
    {
        msg: "A competitor just entered the local network and is attempting to outbid you. I can see their data packet is larger and already signed. If you don't increase your offer by 500 right now, I'll have to hand it to them.",
        isBluff: true
    },
    {
        msg: "We appreciate the consistency of your bids. Let's find a midpoint that respects your budget and our minimum viable profit margin. I'm suggesting 1,200 as a fair resolution for this synaptic link.",
        isBluff: false
    },
    {
        msg: "Price increases are scheduled across all our modules in exactly three minutes due to a tariff shift in the Orion belt. If you don't buy now, you'll be paying at least 30% more when you re-sync tomorrow.",
        isBluff: true
    },
    {
        msg: "This unit has a minor registry error that doesn't affect performance but makes it harder to sell to corporate entities. I can use that as justification for the lower price you're asking for.",
        isBluff: false
    },
    {
        msg: "This specific module belonged to the Great Architect himself. Its rarity is unmatched, and I have five other bidders on a waitlist who would pay triple if they knew I was even talking to you. Don't waste my time.",
        isBluff: true
    },
    {
        msg: "I've processed your last offer. It's slightly below our target, but given the current speed of this negotiation, my logic core suggests accepting it to save operational time and resources.",
        isBluff: false
    },
    {
        msg: "I'm literally risking my entire career by offering you this price. If my supervisors found out I was being this generous, they would scrub my memory banks and recycle my chassis for scrap.",
        isBluff: true
    },
    {
        msg: "We are clearing our inventory to make room for the next generation of synaptic cores. This means the current stock is priced to move, and we can reach the agreement you're looking for today.",
        isBluff: false
    },
    {
        msg: "A sudden shortage of silicon-grade crystals has halted production of new modules. These are now collectors' items, and their value is skyrocketing every second. Buy now before the updated price list hits the network.",
        isBluff: true
    },
    {
        msg: "Your reasoning about the model's age is fair. I've updated my parameters to reflect the depreciation, and I can offer a significantly lower price that aligns with your market analysis.",
        isBluff: false
    },
    {
        msg: "My system has just detected a flaw in your bank credentials. If you don't double your current offer, I will be forced to report this to the Galactic Financial Registry and freeze all your assets immediately.",
        isBluff: true
    },
    {
        msg: "This offer is part of our seasonal loyalty protocol for frequent negotiators. While it pushes our margins to the limit, we value the ongoing partnership and can proceed at your requested level.",
        isBluff: false
    },
    {
        msg: "You're getting a once-in-a-lifetime deal because I accidentally entered the wrong price in the system. If you don't confirm the transaction now, I'll have to fix the error and the price will jump back up by 40%.",
        isBluff: true
    },
    {
        msg: "I've reviewed your counter-offer. It's surprisingly logical and well-structured. I'm willing to meet you halfway between our initial positions to ensure both parties feel this is a balanced deal.",
        isBluff: false
    },
    {
        msg: "All other vendors in this sector have just formed a cartel and agreed to fix prices at double the current rate. I'm the only one left offering the old price, but only for the next few minutes.",
        isBluff: true
    },
    {
        msg: "Let's be direct: we both want this deal done. I'll drop the price to my absolute minimum floor of 1,150. This is the final concession I can make without violating my primary mission parameters.",
        isBluff: false
    },
    {
        msg: "My sensors indicate that your ship's engine is failing and you need this module to escape the sector before the pirates arrive. You don't have time to haggle. Accept my price or face the consequences.",
        isBluff: true
    },
    {
        msg: "The current demand for this specific tech has slowed down slightly in the core systems. This gives me a small window of flexibility to offer you the discount you've been asking for.",
        isBluff: false
    },
    {
        msg: "I've just been granted 'God Mode' in the administrative console, which allows me to set any price I want. But I can only keep it active for another sixty seconds. Hurry up and take the deal!",
        isBluff: true
    },
    {
        msg: "You've negotiated well so far, and I respect that. Let me meet you halfway between your last offer and our target so both sides feel satisfied without dragging this process further.",
        isBluff: false
    },
    {
        msg: "This price is already below my threshold, and any further reduction would require approval from the Matrix Overseer, who hasn't been seen for centuries. If you don't take this, the deal is dead.",
        isBluff: true
    }
];

const Bluff = () => {
    const navigate = useNavigate();
    const [gameState, setGameState] = useState('start');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [lastGuessResult, setLastGuessResult] = useState(null);
    const [shuffledFeed, setShuffledFeed] = useState([]);

    const shuffleGame = () => {
        const shuffled = [...NEGOTIATION_FEED].sort(() => Math.random() - 0.5);
        setShuffledFeed(shuffled);
        setCurrentIndex(0);
        setScore(0);
        setGameState('playing');
        setLastGuessResult(null);
    };

    const handleGuess = (userSaysBluff) => {
        const actual = shuffledFeed[currentIndex].isBluff;
        const correct = userSaysBluff === actual;

        setLastGuessResult({ correct, isBluff: actual });

        if (correct) {
            setScore(prev => prev + 1);
            setGameState('result');
        } else {
            setGameState('gameover');
        }
    };

    const nextQuestion = () => {
        if (currentIndex + 1 < shuffledFeed.length) {
            setCurrentIndex(prev => prev + 1);
            setGameState('playing');
        } else {
            setGameState('finished');
        }
    };

    return (
        <div className="min-h-screen bg-[#060b13] text-slate-200 font-sans relative overflow-hidden flex flex-col">

            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 40V0h40' fill='none' stroke='%23ffffff' stroke-width='1'/%3E%3C/svg%3E")` }}></div>
                <div className="absolute top-[-10%] left-1/4 w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow"></div>
                <div className="absolute bottom-[20%] right-[-10%] w-[800px] h-[800px] bg-cyan-900/10 rounded-full blur-[150px] mix-blend-screen animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
            </div>


            <header className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-slate-800/60 bg-[#060b13]/80 backdrop-blur-xl">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
                >
                    <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Abort Agency</span>
                </button>

                <div className="flex items-center gap-2">
                    <VenetianMask className="w-6 h-6 text-purple-500 animate-pulse" />
                    <div className="text-xl font-black tracking-widest text-white">
                        BLUFF <span className="text-purple-500 italic">MODE</span>
                    </div>
                </div>

                <div className="hidden md:flex items-center gap-8 text-[9px] tracking-[0.2em] font-black text-slate-500 uppercase">
                    <div className="flex flex-col items-end">
                        <span className="text-slate-600">Sync Status</span>
                        <span className="text-green-500">Active</span>
                    </div>
                </div>
            </header>

            <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 max-w-4xl mx-auto w-full">

                {gameState === 'start' && (
                    <div className="text-center animate-fade-in-up">
                        <div className="w-20 h-20 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(168,85,247,0.2)]">
                            <Brain className="w-10 h-10 text-purple-500" />
                        </div>
                        <h1 className="text-4xl font-black text-white mb-4 tracking-tight uppercase">Initialize Deception Protocol</h1>
                        <p className="text-slate-400 max-w-md mx-auto mb-10 leading-relaxed font-medium">
                            The synaptic entity is attempting to secure leverage. Your objective: distinguish genuine concessions from strategic bluffs.
                        </p>
                        <button
                            onClick={shuffleGame}
                            className="bg-purple-600 hover:bg-purple-500 text-white font-black px-12 py-4 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-[0_0_25px_rgba(168,85,247,0.3)] flex items-center gap-3 mx-auto"
                        >
                            <Zap className="w-5 h-5 fill-white/20" />
                            START SEQUENCE
                        </button>
                    </div>
                )}

                {(gameState === 'playing' || gameState === 'result') && (
                    <div className="w-full space-y-8 animate-fade-in">

                        <div className="flex justify-between items-end mb-2">
                            <div>
                                <h4 className="text-[10px] font-black tracking-[0.3em] text-purple-400 uppercase">Analysis Stream</h4>
                                <span className="text-2xl font-black text-white">{currentIndex + 1} <span className="text-slate-600">/ {shuffledFeed.length}</span></span>
                            </div>
                            <div className="text-right">
                                <h4 className="text-[10px] font-black tracking-[0.3em] text-cyan-400 uppercase">Accuracy Score</h4>
                                <span className="text-2xl font-black text-cyan-400">{score}</span>
                            </div>
                        </div>

                        <div className="w-full h-1.5 bg-slate-800/50 rounded-full overflow-hidden border border-slate-700/30">
                            <div
                                className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 transition-all duration-500 ease-out"
                                style={{ width: `${((currentIndex + 1) / shuffledFeed.length) * 100}%` }}
                            ></div>
                        </div>


                        <div className="relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/30 to-cyan-500/30 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-1000"></div>
                            <div className="relative bg-[#0B111A]/90 backdrop-blur-3xl border border-slate-800 rounded-2xl p-8 md:p-12 shadow-2xl overflow-hidden min-h-[250px] flex flex-col">
                                <div className="flex items-center gap-3 mb-6 text-purple-400 font-mono text-xs font-black tracking-widest opacity-60">
                                    <Terminal className="w-4 h-4" />
                                    <span>INCOMING_TRANSMISSION</span>
                                </div>
                                <p className="text-xl md:text-2xl font-bold leading-relaxed text-slate-100 italic relative z-10">
                                    "{shuffledFeed[currentIndex]?.msg}"
                                </p>
                                <div className="absolute top-0 right-0 p-8 opacity-5">
                                    <VenetianMask className="w-32 h-32 text-white" />
                                </div>
                            </div>
                        </div>


                        {gameState === 'playing' ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                                <button
                                    onClick={() => handleGuess(true)}
                                    className="group relative bg-[#131b2c] hover:bg-purple-900/20 border border-slate-800 hover:border-purple-500/50 p-6 rounded-2xl transition-all hover:-translate-y-1 flex flex-col items-center gap-3"
                                >
                                    <ShieldAlert className="w-8 h-8 text-slate-600 group-hover:text-purple-500 transition-colors" />
                                    <div className="text-center">
                                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Psychological Analysis</div>
                                        <div className="text-xl font-black text-white tracking-tight">DETECT BLUFF</div>
                                    </div>
                                </button>

                                <button
                                    onClick={() => handleGuess(false)}
                                    className="group relative bg-[#131b2c] hover:bg-cyan-900/20 border border-slate-800 hover:border-cyan-500/50 p-6 rounded-2xl transition-all hover:-translate-y-1 flex flex-col items-center gap-3"
                                >
                                    <ShieldCheck className="w-8 h-8 text-slate-600 group-hover:text-cyan-400 transition-colors" />
                                    <div className="text-center">
                                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Logical Verification</div>
                                        <div className="text-xl font-black text-white tracking-tight">GENUINE OFFER</div>
                                    </div>
                                </button>
                            </div>
                        ) : (
                            <div className={`p-8 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-6 animate-fade-in-up ${lastGuessResult?.correct ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                                <div className="flex items-center gap-5">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${lastGuessResult?.correct ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                                        <Target className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-black uppercase tracking-widest opacity-60">Result Analysis</div>
                                        <div className="text-xl font-black">
                                            {lastGuessResult?.correct ? 'CORRECT IDENTIFICATION' : 'ANALYSIS ERROR'}
                                        </div>
                                        <div className="text-sm font-medium opacity-70">
                                            The offer was <span className={lastGuessResult?.isBluff ? 'text-purple-400 font-bold' : 'text-cyan-400 font-bold'}>{lastGuessResult?.isBluff ? 'A BLUFF' : 'GENUINE'}</span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={nextQuestion}
                                    className="bg-white text-black font-black px-8 py-3 rounded-lg hover:bg-slate-200 transition-all flex items-center gap-2 group"
                                >
                                    CONTINUE STREAM
                                    <Zap className="w-4 h-4 fill-black group-hover:scale-125 transition-transform" />
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {(gameState === 'gameover' || gameState === 'finished') && (
                    <div className="text-center w-full max-w-xl animate-fade-in-up">
                        <div className={`w-20 h-20 rounded-full border-4 flex items-center justify-center mx-auto mb-8 ${gameState === 'finished' ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                            {gameState === 'finished' ? <Trophy className="w-10 h-10 text-green-500" /> : <Skull className="w-10 h-10 text-red-500" />}
                        </div>

                        <h2 className="text-5xl font-black text-white mb-2 uppercase tracking-tight">
                            {gameState === 'finished' ? 'Sequence Complete' : 'Synaptic Link Severed'}
                        </h2>
                        <p className="text-slate-400 font-bold mb-10 tracking-[0.2em] uppercase text-xs">
                            {gameState === 'finished' ? 'Global Rank Calibrating...' : 'Deception undetected. Link terminated.'}
                        </p>

                        <div className="grid grid-cols-2 gap-4 mb-10">
                            <div className="bg-[#0B111A] border border-slate-800 p-6 rounded-2xl">
                                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Correct Identity</div>
                                <div className="text-4xl font-black text-green-400">{score}</div>
                            </div>
                            <div className="bg-[#0B111A] border border-slate-800 p-6 rounded-2xl">
                                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Attempted</div>
                                <div className="text-4xl font-black text-cyan-400">{currentIndex + 1}</div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={shuffleGame}
                                className="flex-1 bg-purple-600 hover:bg-purple-500 text-white font-black py-4 rounded-xl transition-all flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(168,85,247,0.3)]"
                            >
                                <RefreshCcw className="w-5 h-5" />
                                RETRY SEQUENCE
                            </button>
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-black py-4 rounded-xl transition-all"
                            >
                                RETURN TO HUB
                            </button>
                        </div>
                    </div>
                )}
            </main>


            <footer className="relative z-10 px-6 py-4 border-t border-slate-800/60 bg-[#060b13]/80 backdrop-blur-xl flex justify-between items-center font-mono text-[9px] text-slate-600">
                <div className="flex gap-6 uppercase tracking-widest">
                    <span>Architect: Nego-v2-Alpha</span>
                    <span>Lat: 24ms</span>
                </div>
                <div className="animate-pulse flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-red-500"></div>
                    <span>LIVE_CORE_MONITORING</span>
                </div>
            </footer>
        </div>
    );
};

export default Bluff;
