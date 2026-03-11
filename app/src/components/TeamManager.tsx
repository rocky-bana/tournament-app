import { useState, useEffect } from 'react';
import type { Team } from '../model/team';
import type { player } from '../model/player';
import Table from '@mui/material/Table';
import { TableBody, TableCell, TableHead, TableRow } from '@mui/material';

const TeamManager = () => {
    const [teamName, setTeamName] = useState('');
    const [captainId, setCaptainId] = useState<number | ''>('');
    const [editingId, setEditingId] = useState<number | null>(null);
    const [teams, setTeams] = useState<Team[]>([]);
    const [players, setPlayers] = useState<player[]>([]);

    useEffect(() => {
        fetchTeams();
        fetchPlayers();
    }, []);

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

    const fetchPlayers = async () => {
        try {
            const result = await fetch('http://localhost:8000/players', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await result.json();
            setPlayers(data.players || []);
        } catch (error) {
            console.error('Error fetching players:', error);
        }
    };

    const handleSave = async () => {
        const payload = {
            TeamID: editingId || 0,
            TeamName: teamName,
            CaptainID: captainId === '' ? null : captainId
        };
        
        const method = editingId ? 'PUT' : 'POST';
        
        const result = await fetch('http://localhost:8000/teams', {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        
        if (result.ok) {
            resetForm();
            fetchTeams();
        } else {
            console.error('Failed to save team');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this team?')) return;
        
        const result = await fetch(`http://localhost:8000/teams/${id}`, {
            method: 'DELETE',
        });
        
        if (result.ok) {
            fetchTeams();
        } else {
            console.error('Failed to delete team');
        }
    };

    const handleEdit = (team: Team) => {
        setTeamName(team.TeamName);
        setCaptainId(team.CaptainID || '');
        setEditingId(team.TeamID);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const resetForm = () => {
        setTeamName('');
        setCaptainId('');
        setEditingId(null);
    };

    return (
        <div className="p-8 max-w-5xl mx-auto flex flex-col gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 transition-all">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-800">
                        {editingId ? 'Edit Team' : 'Team Creation'}
                    </h2>
                    {editingId && (
                        <button onClick={resetForm} className="text-sm text-slate-400 hover:text-slate-600">
                            Cancel Editing
                        </button>
                    )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Team Name</label>
                        <input 
                            type="text" 
                            placeholder="e.g. Dream Team"
                            className="px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all font-medium"
                            value={teamName}
                            onChange={(e) => setTeamName(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Captain</label>
                        <select 
                            className="px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all font-medium bg-white"
                            value={captainId}
                            onChange={(e) => setCaptainId(e.target.value === '' ? '' : Number(e.target.value))}
                        >
                            <option value="">Select a Captain</option>
                            {players.map(p => (
                                <option key={p.PlayerID} value={p.PlayerID}>
                                    {p.FirstName} {p.LastName}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="flex gap-4">
                    <button 
                        onClick={handleSave}
                        className={`px-8 py-2.5 font-bold rounded-xl transition-all shadow-sm ${
                            editingId ? 'bg-amber-500 hover:bg-amber-600 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                        }`}
                    >
                        {editingId ? 'Update Team' : 'Create Team'}
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-50 bg-slate-50/30">
                    <h3 className="font-bold text-slate-800">Teams List</h3>
                </div>
                <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 700, color: '#64748b', fontSize: '0.75rem' }}>ID</TableCell>
                            <TableCell sx={{ fontWeight: 700, color: '#64748b', fontSize: '0.75rem' }}>Team Name</TableCell>
                            <TableCell sx={{ fontWeight: 700, color: '#64748b', fontSize: '0.75rem' }}>Captain</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 700, color: '#64748b', fontSize: '0.75rem' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {teams.length > 0 ? (
                            teams.map((team) => (
                                <TableRow key={team.TeamID} sx={{ '&:hover': { backgroundColor: '#f8fafc' } }}>
                                    <TableCell className="text-slate-500 font-mono text-xs">#{team.TeamID}</TableCell>
                                    <TableCell className="font-semibold text-slate-700">{team.TeamName}</TableCell>
                                    <TableCell className="text-slate-600">{team.CaptainName || 'N/A'}</TableCell>
                                    <TableCell align="right">
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => handleEdit(team)} className="p-2 text-sky-500 hover:bg-sky-50 rounded-lg" title="Edit">✏️</button>
                                            <button onClick={() => handleDelete(team.TeamID)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg" title="Delete">🗑️</button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} align="center" className="py-12 text-slate-400 italic">No teams found.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default TeamManager;
