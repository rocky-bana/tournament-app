import { useState, useEffect } from 'react';
import type { player } from '../model/player';
import Table from '@mui/material/Table';
import { TableBody, TableCell, TableHead, TableRow } from '@mui/material';

const PlayerManager = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [editingId, setEditingId] = useState<number | null>(null);
    const [resultVal, setResultVal] = useState<player[]>([]);

    useEffect(() => {
        CallService();
    }, []);

    const Savedata = async () => {
        const payload: player = {
            PlayerID: editingId || 0,
            FirstName: firstName,
            LastName: lastName,
            PhoneNumber: phoneNumber
        };
        
        const method = editingId ? 'PUT' : 'POST';
        
        const result = await fetch('http://localhost:8000/players/', {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        
        if (result.ok) {
            setFirstName('');
            setLastName('');
            setPhoneNumber('');
            setEditingId(null);
            CallService();
        } else {
            console.error('Failed to save player');
        }
    };

    const DeletePlayer = async (id: number) => {
        if (!confirm('Are you sure you want to delete this player?')) return;
        
        const result = await fetch(`http://localhost:8000/players/${id}`, {
            method: 'DELETE',
        });
        
        if (result.ok) {
            CallService();
        } else {
            console.error('Failed to delete player');
        }
    };

    const EditPlayer = (player: player) => {
        setFirstName(player.FirstName);
        setLastName(player.LastName);
        setPhoneNumber(player.PhoneNumber);
        setEditingId(player.PlayerID);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const CancelEdit = () => {
        setFirstName('');
        setLastName('');
        setPhoneNumber('');
        setEditingId(null);
    };

    const CallService = async () => {
        try {
            const result = await fetch('http://localhost:8000/players/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const resultJson = await result.json();
            const data = resultJson.players;
            setResultVal(data || []);
        } catch (error) {
            console.error('Error fetching players:', error);
        }
    };

    return (
        <div className="p-8 max-w-5xl mx-auto flex flex-col gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 transition-all">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-800">
                        {editingId ? 'Edit Player' : 'Player Registration'}
                    </h2>
                    {editingId && (
                        <button 
                            onClick={CancelEdit}
                            className="text-sm text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            Cancel Editing
                        </button>
                    )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">First Name</label>
                        <input 
                            type="text" 
                            placeholder="e.g. John"
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-50 focus:bg-slate-50/50 transition-all font-medium"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Last Name</label>
                        <input 
                            type="text" 
                            placeholder="e.g. Doe"
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-50 focus:bg-slate-50/50 transition-all font-medium"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Phone Number</label>
                        <input 
                            type="text" 
                            placeholder="e.g. +123456789"
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-50 focus:bg-slate-50/50 transition-all font-medium"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                    </div>
                </div>
                <div className="flex gap-4">
                    <button 
                        onClick={Savedata}
                        className={`px-8 py-2.5 font-bold rounded-xl transition-all shadow-sm ${
                            editingId 
                            ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-200' 
                            : 'bg-sky-600 hover:bg-sky-700 text-white shadow-sky-200'
                        }`}
                    >
                        {editingId ? 'Update Player' : 'Register Player'}
                    </button>
                    <button 
                        onClick={CallService}
                        className="px-8 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all"
                    >
                        Sync Data
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-50 bg-slate-50/30">
                    <h3 className="font-bold text-slate-800">Player Directory</h3>
                </div>
                <Table sx={{ minWidth: 650 }} aria-label="player table">
                    <TableHead>
                        <TableRow sx={{ '& th': { borderBottom: '1px solid #f1f5f9', py: 2 } }}>
                            <TableCell sx={{ fontWeight: 700, color: '#64748b', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>ID</TableCell>
                            <TableCell sx={{ fontWeight: 700, color: '#64748b', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>Full Name</TableCell>
                            <TableCell sx={{ fontWeight: 700, color: '#64748b', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>Phone Number</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 700, color: '#64748b', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {resultVal.length > 0 ? (
                            resultVal.map((row) => (
                                <TableRow
                                    key={row.PlayerID}
                                    sx={{ 
                                        '&:last-child td, &:last-child th': { border: 0 }, 
                                        '&:hover': { backgroundColor: '#fdfbff' },
                                        transition: 'background-color 0.2s'
                                    }}
                                >
                                    <TableCell className="text-slate-500 font-mono text-xs">#{row.PlayerID}</TableCell>
                                    <TableCell>
                                        <div className="font-semibold text-slate-700">{row.FirstName} {row.LastName}</div>
                                    </TableCell>
                                    <TableCell className="text-slate-600">{row.PhoneNumber}</TableCell>
                                    <TableCell align="right">
                                        <div className="flex justify-end gap-2">
                                            <button 
                                                onClick={() => EditPlayer(row)}
                                                className="p-2 text-sky-500 hover:bg-sky-50 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                ✏️
                                            </button>
                                            <button 
                                                onClick={() => DeletePlayer(row.PlayerID)}
                                                className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                                                title="Delete"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} align="center" className="py-12">
                                    <div className="flex flex-col items-center gap-2">
                                        <span className="text-3xl opacity-20">👤</span>
                                        <p className="text-slate-400 font-medium italic">No competitors registered yet</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default PlayerManager;
