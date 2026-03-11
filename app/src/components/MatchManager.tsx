import { useState, useEffect } from 'react';
import type { Match } from '../model/match';
import type { Team } from '../model/team';
import Table from '@mui/material/Table';
import { TableBody, TableCell, TableHead, TableRow } from '@mui/material';

const MatchManager = () => {
    const [team1Id, setTeam1Id] = useState<number | ''>('');
    const [team2Id, setTeam2Id] = useState<number | ''>('');
    const [matchDate, setMatchDate] = useState('');
    const [location, setLocation] = useState('');
    const [editingId, setEditingId] = useState<number | null>(null);
    const [matches, setMatches] = useState<Match[]>([]);
    const [teams, setTeams] = useState<Team[]>([]);

    useEffect(() => {
        fetchMatches();
        fetchTeams();
    }, []);

    const fetchMatches = async () => {
        try {
            const result = await fetch('http://localhost:8000/matches', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await result.json();
            setMatches(data.matches || []);
        } catch (error) {
            console.error('Error fetching matches:', error);
        }
    };

    const fetchTeams = async () => {
        try {
            const result = await fetch('http://localhost:8000/teams', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await result.json();
            setTeams(data.teams || []);
        } catch (error) {
            console.error('Error fetching teams:', error);
        }
    };

    const handleSave = async () => {
        if (team1Id === team2Id) {
            alert("A team cannot play against itself.");
            return;
        }

        const payload = {
            MatchID: editingId || 0,
            Team1ID: team1Id,
            Team2ID: team2Id,
            MatchDate: matchDate,
            Location: location,
            Status: 'Scheduled'
        };
        
        const method = editingId ? 'PUT' : 'POST';
        
        const result = await fetch('http://localhost:8000/matches', {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        
        if (result.ok) {
            resetForm();
            fetchMatches();
        } else {
            console.error('Failed to save match');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to cancel this match?')) return;
        
        const result = await fetch(`http://localhost:8000/matches/${id}`, {
            method: 'DELETE',
        });
        
        if (result.ok) {
            fetchMatches();
        } else {
            console.error('Failed to delete match');
        }
    };

    const handleEdit = (m: Match) => {
        setTeam1Id(m.Team1ID);
        setTeam2Id(m.Team2ID);
        setMatchDate(m.MatchDate.split('.')[0]); // Simple formatting for datetime-local
        setLocation(m.Location || '');
        setEditingId(m.MatchID);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const resetForm = () => {
        setTeam1Id('');
        setTeam2Id('');
        setMatchDate('');
        setLocation('');
        setEditingId(null);
    };

    return (
        <div className="p-8 max-w-5xl mx-auto flex flex-col gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 transition-all">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-800">
                        {editingId ? 'Reschedule Match' : 'Schedule New Match'}
                    </h2>
                    {editingId && (
                        <button onClick={resetForm} className="text-sm text-slate-400 hover:text-slate-600">
                            Cancel Editing
                        </button>
                    )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Team 1</label>
                        <select 
                            className="px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all font-medium bg-white"
                            value={team1Id}
                            onChange={(e) => setTeam1Id(Number(e.target.value))}
                        >
                            <option value="">Select Team 1</option>
                            {teams.map(t => (
                                <option key={t.TeamID} value={t.TeamID} disabled={t.TeamID === team2Id}>
                                    {t.TeamName}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Team 2</label>
                        <select 
                            className="px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all font-medium bg-white"
                            value={team2Id}
                            onChange={(e) => setTeam2Id(Number(e.target.value))}
                        >
                            <option value="">Select Team 2</option>
                            {teams.map(t => (
                                <option key={t.TeamID} value={t.TeamID} disabled={t.TeamID === team1Id}>
                                    {t.TeamName}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Date & Time</label>
                        <input 
                            type="datetime-local" 
                            className="px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all font-medium"
                            value={matchDate}
                            onChange={(e) => setMatchDate(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Location</label>
                        <input 
                            type="text" 
                            placeholder="e.g. Stadium A"
                            className="px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all font-medium"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        />
                    </div>
                </div>
                <div className="flex gap-4">
                    <button 
                        onClick={handleSave}
                        className={`px-8 py-2.5 font-bold rounded-xl transition-all shadow-sm ${
                            editingId ? 'bg-amber-500 hover:bg-amber-600 text-white' : 'bg-rose-600 hover:bg-rose-700 text-white'
                        }`}
                    >
                        {editingId ? 'Update Match' : 'Schedule Match'}
                    </button>
                    <button onClick={fetchMatches} className="px-8 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all">
                        Refresh
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-50 bg-slate-50/30">
                    <h3 className="font-bold text-slate-800">Match Schedule</h3>
                </div>
                <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 700, color: '#64748b', fontSize: '0.75rem' }}>Match-Up</TableCell>
                            <TableCell sx={{ fontWeight: 700, color: '#64748b', fontSize: '0.75rem' }}>Date & Time</TableCell>
                            <TableCell sx={{ fontWeight: 700, color: '#64748b', fontSize: '0.75rem' }}>Location</TableCell>
                            <TableCell sx={{ fontWeight: 700, color: '#64748b', fontSize: '0.75rem' }}>Status</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 700, color: '#64748b', fontSize: '0.75rem' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {matches.length > 0 ? (
                            matches.map((m) => (
                                <TableRow key={m.MatchID} sx={{ '&:hover': { backgroundColor: '#fff8f8' } }}>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-slate-700">{m.Team1Name}</span>
                                            <span className="text-xs text-slate-400">VS</span>
                                            <span className="font-bold text-slate-700">{m.Team2Name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-slate-600 font-medium">
                                        {new Date(m.MatchDate).toLocaleString()}
                                    </TableCell>
                                    <TableCell className="text-slate-600">{m.Location}</TableCell>
                                    <TableCell>
                                        <span className={`px-2 py-1 rounded-full text-[0.65rem] font-bold uppercase tracking-wider ${
                                            m.Status === 'Scheduled' ? 'bg-sky-100 text-sky-600' : 'bg-slate-100 text-slate-600'
                                        }`}>
                                            {m.Status}
                                        </span>
                                    </TableCell>
                                    <TableCell align="right">
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => handleEdit(m)} className="p-2 text-sky-500 hover:bg-sky-50 rounded-lg" title="Edit">✏️</button>
                                            <button onClick={() => handleDelete(m.MatchID)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg" title="Cancel">🗑️</button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} align="center" className="py-12 text-slate-400 italic">No matches scheduled.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default MatchManager;
