import React, { useState, useEffect } from 'react';
import { Code2 } from 'lucide-react';

const Loading = () => {
    const [dots, setDots] = useState('');
    const [loadingText, setLoadingText] = useState('ESTABLISHING NEURAL LINK');

    useEffect(() => {
        const interval = setInterval(() => {
            setDots(prev => prev.length >= 3 ? '' : prev + '.');
        }, 400);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const texts = [
            'ESTABLISHING NEURAL LINK',
            'BYPASSING SECURITY PROTOCOLS',
            'SYNCING TO GLOBAL ARENA',
            'CALIBRATING AI TENSION LEVELS',
            'OPTIMIZING FOR VOLATILITY',
        ];
        let i = 0;
        const textInterval = setInterval(() => {
            i = (i + 1) % texts.length;
            setLoadingText(texts[i]);
        }, 1500);
        return () => clearInterval(textInterval);
    }, []);

    return (
        <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#060b13] overflow-hidden selection:bg-cyan-500/30">
            <div className="absolute inset-0 pointer-events-none z-0">
                <div 
                    className="absolute inset-0 opacity-[0.03]" 
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 40V0h40' fill='none' stroke='%23ffffff' stroke-width='1'/%3E%3C/svg%3E")` }}
                ></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-900/10 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-purple-900/15 rounded-full blur-[100px] mix-blend-screen animate-pulse-slow" style={{ animationDelay: '1.5s' }}></div>
            </div>

            <div className="relative z-10 flex flex-col items-center animate-fade-in-up">
                
                <div className="relative w-40 h-40 flex items-center justify-center mb-10 group">
                    <div className="absolute inset-2 bg-[#0A111A]/80 rounded-full shadow-[inset_0_0_30px_rgba(0,0,0,0.9)] backdrop-blur-sm"></div>
                    
                    <div className="absolute inset-0 border-[3px] border-t-cyan-400 border-r-transparent border-b-transparent border-l-cyan-400/20 rounded-full animate-[spin_1.5s_linear_infinite] shadow-[0_0_20px_rgba(34,211,238,0.4)]"></div>
                    
                    <div className="absolute inset-[12px] border-[2px] border-b-purple-500 border-t-transparent border-r-purple-500/20 border-l-transparent rounded-full animate-[spin_3s_linear_infinite_reverse] shadow-[0_0_15px_rgba(168,85,247,0.4)]"></div>
                    
                    <div className="absolute inset-[24px] border border-dashed border-slate-700 rounded-full animate-[spin_10s_linear_infinite]"></div>

                    <div className="relative z-20 w-14 h-14 bg-[#050B14] border border-cyan-500/40 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(34,211,238,0.3)] group-hover:shadow-[0_0_50px_rgba(34,211,238,0.5)] transition-shadow duration-700">
                        <div className="absolute inset-0 bg-cyan-400/10 rounded-2xl animate-pulse"></div>
                        <Code2 className="w-6 h-6 text-cyan-400 animate-pulse drop-shadow-[0_0_8px_rgba(34,211,238,1)]" />
                    </div>

                    <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-slate-600"></div>
                    <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-slate-600"></div>
                </div>

                <div className="text-center w-full max-w-sm px-6">
                    <h2 className="text-white text-2xl md:text-3xl font-black tracking-[0.4em] uppercase mb-4 drop-shadow-[0_0_20px_rgba(255,255,255,0.2)] animate-glitch-slight">
                        INITIALIZING
                    </h2>
                    
                    <div className="h-6 flex items-center justify-center gap-3 text-cyan-400 font-mono text-[10px] font-bold tracking-[0.2em] uppercase mb-8 ml-2">
                        <div className="relative flex items-center justify-center w-2 h-2 shrink-0">
                            <div className="absolute w-2 h-2 bg-cyan-400 rounded-full animate-ping"></div>
                            <div className="relative w-1.5 h-1.5 bg-cyan-300 rounded-full"></div>
                        </div>
                        <span className="min-w-[220px] text-left">
                            {loadingText}{dots}
                        </span>
                    </div>

                    <div className="w-full relative">
                        <div className="w-full h-1.5 bg-slate-800/80 rounded-full overflow-hidden shadow-[inset_0_1px_3px_rgba(0,0,0,1)] relative">
                            <div className="absolute top-0 bottom-0 bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,1)] indeterminate-bar">
                                <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-r from-transparent to-white/60"></div>
                            </div>
                        </div>
                        <div className="flex justify-between mt-3 text-[9px] font-mono font-bold text-slate-600 tracking-[0.3em] uppercase">
                            <span>Sector_01</span>
                            <span className="text-cyan-500/50 animate-pulse">Secured</span>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .indeterminate-bar {
                    animation: slideRight 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
                }

                @keyframes slideRight {
                    0% { left: -30%; width: 30%; }
                    50% { left: 40%; width: 50%; }
                    100% { left: 100%; width: 30%; }
                }

                .animate-glitch-slight {
                    animation: glitch-slight 4s infinite;
                }

                @keyframes glitch-slight {
                    0%, 100% { transform: translate(0); }
                    1% { transform: translate(-2px, 1px); }
                    2% { transform: translate(1px, -1px); }
                    3% { transform: translate(0); }
                    50% { transform: translate(0); }
                    51% { transform: translate(1px, 2px); }
                    52% { transform: translate(-1px, -1px); }
                    53% { transform: translate(0); }
                }
            `}</style>
        </div>
    );
};

export default Loading;
