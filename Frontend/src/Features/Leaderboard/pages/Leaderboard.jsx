import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { useAuth } from '../../Auth/hooks/useAuth';
import {
    ArrowLeft,
    Filter,
    Award,
    LogOut
} from 'lucide-react';

export default function Leaderboard() {
    const navigate = useNavigate();
    const { user: authUser, handleLogout } = useAuth();
    const { leaderboard, loading, getLeaderboard } = useLeaderboard();

    useEffect(() => {
        getLeaderboard();
    }, []);

    const sortedLeaderboard = [...leaderboard].sort((a, b) => b.score - a.score);
    const topThree = sortedLeaderboard.slice(0, 3);

    return (
        <div className="min-h-screen bg-[#0E1117] text-slate-200 overflow-x-hidden relative font-sans selection:bg-cyan-500/30">
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 40V0h40' fill='none' stroke='%23ffffff' stroke-width='1'/%3E%3C/svg%3E")` }}></div>
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-yellow-600/5 rounded-[100%] blur-[120px] mix-blend-screen animate-pulse-slow"></div>
            </div>

            <div className="relative z-10 flex flex-col min-h-screen">
                <header className="flex-none flex items-center justify-between px-4 sm:px-8 py-0 border-b border-slate-800/80 bg-[#060b13]/90 backdrop-blur-xl h-[60px]">
                    <div className="flex items-center gap-10 h-full">
                        <div className="text-sm font-black tracking-widest text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)] cursor-pointer" onClick={() => navigate('/')}>
                            Nego-Arena
                        </div>

                        <nav className="hidden md:flex h-full items-stretch gap-6 text-[10px] font-bold tracking-[0.2em] uppercase text-slate-500">
                            <button className="h-full relative text-cyan-400 transition-colors">
                                LEADERBOARD
                                <div className="absolute bottom-0 inset-x-0 h-[2px] bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]"></div>
                            </button>
                        </nav>
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="w-8 h-8 rounded-full bg-slate-800 border-2 border-slate-700 overflow-hidden">
                            <img src={authUser?.avatar || `https://ui-avatars.com/api/?name=${authUser?.user || 'User'}&background=1e293b&color=22d3ee&bold=true`} alt="User" className="w-full h-full object-cover" />
                        </button>
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

                <div className="px-4 sm:px-8 max-w-[1400px] mx-auto w-full pt-10 pb-20 flex-1 flex flex-col">
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 sm:mb-16 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                        <div>
                            <button onClick={() => navigate('/')} className="flex items-center gap-2 text-[9px] font-bold text-slate-500 hover:text-slate-300 tracking-[0.2em] uppercase mb-6 group transition-colors">
                                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" /> Back to Command
                            </button>
                            <div className="flex items-center gap-3">
                                <span className="text-3xl sm:text-5xl drop-shadow-[0_0_15px_rgba(250,204,21,0.5)] select-none pointer-events-none">🏆</span>
                                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black italic tracking-wider text-white select-none">LEADERBOARD</h1>
                            </div>
                        </div>

                        <div className="flex items-stretch gap-6 h-[70px] sm:h-[80px]">
                            <div className="bg-[#111620] border border-slate-800/80 rounded-sm relative px-6 py-4 flex flex-col justify-center min-w-[140px] sm:min-w-[160px] shadow-lg">
                                <div className="absolute top-0 left-0 bottom-0 w-[3px] bg-cyan-400 shadow-[2px_0_10px_rgba(34,211,238,0.5)]"></div>
                                <span className="text-[8px] sm:text-[9px] text-slate-500 font-bold tracking-[0.2em] uppercase mb-1">Total Players</span>
                                <span className="text-white font-black text-xl sm:text-2xl tracking-wider">{leaderboard.length}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row justify-center items-end gap-6 mb-16 px-4">
                        {topThree[1] && (
                            <div className="w-full md:w-[320px] bg-[#111620]/80 backdrop-blur-sm border border-slate-600 rounded-sm p-6 relative group shadow-[0_10px_30px_rgba(0,0,0,0.5)] animate-fade-in-up hover:-translate-y-2 transition-transform duration-500" style={{ animationDelay: '0.2s', paddingBottom: '30px' }}>
                                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-400 to-transparent"></div>
                                <div className="flex justify-between items-start mb-6">
                                    <div className="text-4xl font-black italic text-slate-500 tracking-wider">#02</div>
                                    <div className="border border-slate-600 px-3 py-1 rounded-sm text-[8px] font-bold text-slate-400 tracking-widest uppercase bg-slate-800/30">Silver_Division</div>
                                </div>
                                <div className="flex flex-col items-center">
                                    <div className="w-20 h-20 rounded-xl border border-slate-400 shadow-[0_0_15px_rgba(148,163,184,0.3)] overflow-hidden mb-4 rounded-tl-sm rounded-br-sm skew-x-[-5deg]">
                                        <div className="w-full h-full skew-x-[5deg] scale-125">
                                            <img src={`https://ui-avatars.com/api/?name=${topThree[1].username}&background=1e293b&color=fff&size=200`} alt="Avatar" className="w-full h-full object-cover filter grayscale contrast-125 brightness-90" />
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-black text-white tracking-widest uppercase mb-1">{topThree[1].username}</h3>
                                    <div className="text-[10px] font-bold text-cyan-400 tracking-[0.2em] mb-6 whitespace-nowrap">SCORE: {topThree[1].score?.toLocaleString()}</div>
                                    <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden flex shadow-inner">
                                        <div className="bg-slate-400 w-[75%] shadow-[0_0_10px_rgba(148,163,184,0.8)]"></div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {topThree[0] && (
                            <div className="w-full md:w-[360px] bg-[#1A1A10]/95 backdrop-blur-sm border-[1.5px] border-yellow-500 rounded-sm p-6 relative group z-10 shadow-[0_0_40px_rgba(234,179,8,0.15)] animate-fade-in-up hover:-translate-y-2 transition-transform duration-500 md:scale-105" style={{ animationDelay: '0.4s', paddingBottom: '35px' }}>
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-500 text-black px-6 py-1.5 text-[10px] font-black tracking-[0.3em] uppercase tilt-shading shadow-[0_5px_15px_rgba(234,179,8,0.4)]">
                                    CHAMPION
                                </div>
                                <div className="absolute inset-0 shadow-[inset_0_0_50px_rgba(234,179,8,0.05)] pointer-events-none"></div>

                                <div className="flex justify-between items-start mb-6 pt-4">
                                    <div className="text-6xl font-black italic text-yellow-500 tracking-wider drop-shadow-[0_2px_10px_rgba(234,179,8,0.5)]">#01</div>
                                    <Award className="w-6 h-6 text-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.6)]" />
                                </div>
                                <div className="flex flex-col items-center">
                                    <div className="w-24 h-24 rounded border-2 border-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.5)] overflow-hidden mb-6 relative">
                                        <div className="absolute inset-0 box-shadow-[inset_0_0_15px_rgba(0,0,0,0.8)] z-10"></div>
                                        <img src={`https://ui-avatars.com/api/?name=${topThree[0].username}&background=1e293b&color=fff&size=200`} alt="Avatar" className="w-full h-full object-cover filter contrast-125 saturate-150" />
                                    </div>
                                    <h3 className="text-xl font-black text-yellow-500 tracking-widest uppercase mb-1 drop-shadow-[0_0_8px_rgba(234,179,8,0.3)]">{topThree[0].username}</h3>
                                    <div className="text-[11px] font-bold text-cyan-400 tracking-[0.2em] mb-8 whitespace-nowrap">SCORE: {topThree[0].score?.toLocaleString()}</div>

                                    <div className="w-full">
                                        <div className="flex justify-between text-[8px] font-bold tracking-[0.3em] text-slate-500 uppercase mb-2">
                                            <span>Mastery Level</span>
                                            <span className="text-slate-400">98.2%</span>
                                        </div>
                                        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden flex gap-[2px]">
                                            <div className="bg-yellow-500 flex-1 shadow-[0_0_15px_rgba(234,179,8,0.8)]"></div>
                                            <div className="bg-yellow-500 flex-1 shadow-[0_0_15px_rgba(234,179,8,0.8)]"></div>
                                            <div className="bg-yellow-500 flex-1 shadow-[0_0_15px_rgba(234,179,8,0.8)]"></div>
                                            <div className="bg-slate-700 w-[5%]"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {topThree[2] && (
                            <div className="w-full md:w-[320px] bg-[#111620]/80 backdrop-blur-sm border border-orange-900/50 rounded-sm p-6 relative group shadow-[0_10px_30px_rgba(0,0,0,0.5)] animate-fade-in-up hover:-translate-y-2 transition-transform duration-500" style={{ animationDelay: '0.3s', paddingBottom: '30px' }}>
                                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent"></div>
                                <div className="flex justify-between items-start mb-6">
                                    <div className="text-4xl font-black italic text-[#c2410c] tracking-wider drop-shadow-[0_0_10px_rgba(234,88,12,0.3)]">#03</div>
                                    <div className="border border-slate-600 px-3 py-1 rounded-sm text-[8px] font-bold text-slate-400 tracking-widest uppercase bg-slate-800/30">Bronze_Division</div>
                                </div>
                                <div className="flex flex-col items-center">
                                    <div className="w-20 h-20 rounded-xl border border-[#ea580c] shadow-[0_0_15px_rgba(234,88,12,0.3)] overflow-hidden mb-4 rounded-tr-sm rounded-bl-sm skew-x-[5deg]">
                                        <div className="w-full h-full skew-x-[-5deg] scale-125">
                                            <img src={`https://ui-avatars.com/api/?name=${topThree[2].username}&background=1e293b&color=fff&size=200`} alt="Avatar" className="w-full h-full object-cover filter contrast-125 sepia-[0.3] hue-rotate-[180deg]" />
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-black text-white tracking-widest uppercase mb-1">{topThree[2].username}</h3>
                                    <div className="text-[10px] font-bold text-cyan-400 tracking-[0.2em] mb-6 whitespace-nowrap">SCORE: {topThree[2].score?.toLocaleString()}</div>
                                    <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden flex shadow-inner">
                                        <div className="bg-[#ea580c] w-[60%] shadow-[0_0_10px_rgba(234,88,12,0.8)]"></div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col xl:flex-row gap-8">
                        <aside className="w-full xl:w-[280px] flex flex-col gap-6 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                            <div className="bg-[#111620] border border-slate-800/80 rounded-sm overflow-hidden shadow-lg p-5">
                                <div className="flex items-center gap-2 mb-6 text-slate-400">
                                    <Filter className="w-3.5 h-3.5" />
                                    <h4 className="text-[9px] font-bold tracking-[0.2em] uppercase">Temporal Filter</h4>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <button className="bg-cyan-400 text-[#060B13] font-bold tracking-widest text-[10px] uppercase py-3 px-4 text-left shadow-[0_0_15px_rgba(34,211,238,0.3)] transition-transform hover:translate-x-1">
                                        All Time
                                    </button>
                                </div>
                            </div>
                        </aside>

                        <div className="flex-1 bg-[#111620] border border-slate-800/80 rounded-sm shadow-xl flex flex-col relative animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-[11px] font-medium tracking-wider">
                                    <thead className="text-[9px] text-slate-500 font-bold tracking-[0.25em] uppercase border-b border-slate-800">
                                        <tr>
                                            <th className="px-8 py-6">Rank</th>
                                            <th className="px-8 py-6">Synaptic Prospect</th>
                                            <th className="px-8 py-6 text-right">Total Score</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800/40 text-slate-300">
                                        {sortedLeaderboard.map((player, index) => (
                                            <tr key={index} className="hover:bg-slate-800/20 transition-colors">
                                                <td className="px-4 sm:px-8 py-5 font-bold italic text-slate-500 whitespace-nowrap">#{index + 1}</td>
                                                <td className="px-4 sm:px-8 py-5 flex items-center gap-4">
                                                    <div className="w-8 h-8 rounded-full bg-slate-800 overflow-hidden border border-slate-700 shrink-0">
                                                        <img src={`https://ui-avatars.com/api/?name=${player.username}&background=0f172a&color=fff&size=32`} alt="Entity" />
                                                    </div>
                                                    <span className="text-white font-bold uppercase tracking-widest text-xs truncate max-w-[120px] sm:max-w-none">{player.username}</span>
                                                </td>
                                                <td className="px-4 sm:px-8 py-5 text-right text-slate-400 font-mono whitespace-nowrap">{player.score?.toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {leaderboard.length === 0 && !loading && (
                                <div className="py-20 text-center text-slate-500 font-bold uppercase tracking-widest">
                                    No Data synchronized yet...
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
