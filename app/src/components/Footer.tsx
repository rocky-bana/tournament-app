import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 px-8 mt-auto border-t border-white/5">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl bg-linear-to-br from-sky-400 to-indigo-400 bg-clip-text text-transparent">🏆</span>
            <h2 className="text-xl font-bold text-white tracking-tight">Tournament<span className="text-sky-400">App</span></h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed">
            The ultimate platform for managing your gaming tournaments with ease.
            Track players, matches, and results in real-time with our premium management suite.
          </p>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-6">Quick Links</h3>
          <ul className="space-y-4 text-sm">
            <li><a href="#" className="hover:text-sky-400 transition-colors">Home</a></li>
            <li><a href="#" className="hover:text-sky-400 transition-colors">Players</a></li>
            <li><a href="#" className="hover:text-sky-400 transition-colors">Matches</a></li>
            <li><a href="#" className="hover:text-sky-400 transition-colors">Support</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-6">Connect</h3>
          <ul className="space-y-4 text-sm">
            <li><a href="#" className="hover:text-sky-400 transition-colors font-medium text-white/90">@tournament_app</a></li>
            <li><a href="#" className="hover:text-sky-400 transition-colors">GitHub</a></li>
            <li><a href="#" className="hover:text-sky-400 transition-colors">Discord</a></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-xs">
          &copy; {new Date().getFullYear()} TournamentApp. All rights reserved.
        </p>
        <div className="flex gap-8 text-xs">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
