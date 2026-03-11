import React, { useState } from 'react';

interface HeaderProps {
    activeView: 'players' | 'teams' | 'matches';
    onViewChange: (view: 'players' | 'teams' | 'matches') => void;
}

const Header: React.FC<HeaderProps> = ({ activeView, onViewChange }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleNavClick = (view: 'players' | 'teams' | 'matches') => {
        onViewChange(view);
        setIsMenuOpen(false);
    };

    const NavLink: React.FC<{ view: 'players' | 'teams' | 'matches', label: string }> = ({ view, label }) => (
        <span 
            onClick={() => handleNavClick(view)}
            className={`text-sm font-medium cursor-pointer transition-all duration-200 border-b-2 hover:text-slate-50 py-1 ${
                activeView === view 
                ? 'text-sky-400 border-sky-400' 
                : 'text-slate-400 border-transparent'
            }`}
        >
            {label}
        </span>
    );

    return (
        <header className="flex justify-between items-center px-6 md:px-8 h-[70px] bg-slate-900/90 backdrop-blur-xl border-b border-white/10 sticky top-0 z-[1000] text-slate-50">
            {/* Logo Section */}
            <div className="flex items-center gap-3 cursor-pointer z-[1001]" onClick={() => handleNavClick('players')}>
                <div className="text-2xl bg-linear-to-br from-sky-400 to-indigo-400 bg-clip-text text-transparent">🏆</div>
                <h1 className="text-xl font-bold tracking-tight m-0">Tournament<span className="text-sky-400">App</span></h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
                <div className="flex items-center gap-8">
                    <NavLink view="players" label="Players" />
                    <NavLink view="teams" label="Teams" />
                    <NavLink view="matches" label="Matches" />
                    <div className="w-8 h-8 rounded-full bg-linear-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-[0.75rem] font-semibold text-white cursor-pointer shadow-md ml-2 hover:scale-105 transition-transform">
                        JD
                    </div>
                </div>
            </nav>

            {/* Hamburger Button (Mobile) */}
            <button 
                className="md:hidden p-2 text-slate-400 hover:text-slate-50 focus:outline-none z-[1001]"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
            >
                <div className="w-6 h-5 relative flex flex-col justify-between">
                    <span className={`w-full h-0.5 bg-current rounded-full transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                    <span className={`w-full h-0.5 bg-current rounded-full transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
                    <span className={`w-full h-0.5 bg-current rounded-full transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2.5' : ''}`}></span>
                </div>
            </button>

            {/* Mobile Menu Overlay */}
            <div className={`fixed inset-0 bg-[#0f172a] z-[1500] transition-all duration-300 md:hidden flex flex-col items-center justify-center ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                {/* Close Button specifically for mobile menu */}
                <button 
                    className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-50 focus:outline-none"
                    onClick={() => setIsMenuOpen(false)}
                >
                    <div className="w-6 h-6 relative flex items-center justify-center">
                        <span className="absolute w-full h-0.5 bg-current rounded-full rotate-45"></span>
                        <span className="absolute w-full h-0.5 bg-current rounded-full -rotate-45"></span>
                    </div>
                </button>

                <div className="flex flex-col items-center justify-center gap-10 text-3xl font-bold tracking-tight">
                    <span 
                        onClick={() => handleNavClick('players')}
                        className={`transition-all duration-200 cursor-pointer ${activeView === 'players' ? 'text-sky-400 scale-110' : 'text-slate-300 hover:text-slate-50'}`}
                    >
                        Players
                    </span>
                    <span 
                        onClick={() => handleNavClick('teams')}
                        className={`transition-all duration-200 cursor-pointer ${activeView === 'teams' ? 'text-sky-400 scale-110' : 'text-slate-300 hover:text-slate-50'}`}
                    >
                        Teams
                    </span>
                    <span 
                        onClick={() => handleNavClick('matches')}
                        className={`transition-all duration-200 cursor-pointer ${activeView === 'matches' ? 'text-sky-400 scale-110' : 'text-slate-300 hover:text-slate-50'}`}
                    >
                        Matches
                    </span>
                    
                    <div className="mt-8 flex flex-col items-center gap-4 py-6 px-10 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md">
                        <div className="w-16 h-16 rounded-full bg-linear-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-xl font-bold text-white shadow-xl">
                            JD
                        </div>
                        <div className="text-center">
                            <div className="text-xl text-white font-bold">John Doe</div>
                            <div className="text-sm text-slate-400 font-medium">Administrator</div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
