import { useState } from 'react';
import Header from './components/header';
import PlayerManager from './components/PlayerManager';
import TeamManager from './components/TeamManager';
import MatchManager from './components/MatchManager';
import Footer from './components/Footer';

function App() {
  const [currentView, setCurrentView] = useState<'players' | 'teams' | 'matches'>('players');

  return (
    <div className='bg-sky-50 min-h-screen flex flex-col'>
      <Header activeView={currentView} onViewChange={(view: any) => setCurrentView(view)} />
      <main className="flex-grow py-4">
        {currentView === 'players' && <PlayerManager />}
        {currentView === 'teams' && <TeamManager />}
        {currentView === 'matches' && <MatchManager />}
      </main>
      <Footer />
    </div>
  )
}

export default App
