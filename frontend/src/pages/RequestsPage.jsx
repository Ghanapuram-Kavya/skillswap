import React, { useState, useEffect } from 'react';
import { 
  Send, 
  Inbox, 
  Check, 
  X, 
  Calendar, 
  Clock, 
  ArrowRightLeft,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import ScheduleSessionModal from '../components/ScheduleSessionModal';

export default function RequestsPage({ setActiveTab }) {
  const { currentUser } = useAuth();
  const [requests, setRequests] = useState([]);
  const [selectedSwapForSession, setSelectedSwapForSession] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadRequests = async () => {
    if (!currentUser) return;
    try {
      setLoading(true);
      const res = await api.getSwapRequests(currentUser.userId);
      if (res.success) setRequests(res.data);
    } catch (err) {
      console.error('Error loading requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, [currentUser]);

  const handleRespond = async (swapId, status) => {
    try {
      await api.respondSwapRequest(swapId, status);
      await loadRequests();
    } catch (err) {
      alert(err.message);
    }
  };

  const incomingRequests = requests.filter(r => r.isIncoming);
  const outgoingRequests = requests.filter(r => !r.isIncoming);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold mb-2">
          <Send className="w-3.5 h-3.5" />
          <span>Skill-Swap Exchanges</span>
        </div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Swap Requests Hub</h1>
        <p className="text-xs text-slate-400 mt-1">
          Review incoming skill proposals, accept exchanges, and schedule live peer learning sessions.
        </p>
      </div>

      {/* Incoming Requests Section */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-white flex items-center space-x-2">
          <Inbox className="w-4 h-4 text-emerald-400" />
          <span>Received Swap Proposals ({incomingRequests.length})</span>
        </h2>

        {incomingRequests.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-slate-900/40 border border-slate-800 text-xs text-slate-500">
            No incoming swap requests right now.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {incomingRequests.map((req) => (
              <div key={req.swapId} className="p-5 rounded-2xl bg-[#10172A] border border-slate-800 space-y-4 shadow-xl">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl">{req.sender?.avatar || '👤'}</span>
                    <div>
                      <h4 className="text-sm font-bold text-white">{req.sender?.name}</h4>
                      <p className="text-[10px] text-slate-400">{req.sender?.experienceLevel} • {req.sender?.location}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full border font-mono ${
                    req.status === 'ACCEPTED'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : req.status === 'REJECTED'
                      ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/30 animate-pulse'
                  }`}>
                    {req.status}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs space-y-2">
                  <div className="flex items-center justify-between text-slate-300">
                    <span>They will teach you: <strong className="text-emerald-400">{req.offeredSkill?.name}</strong></span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span>You will teach them: <strong className="text-indigo-400">{req.wantedSkill?.name}</strong></span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 italic bg-slate-900/60 p-3 rounded-xl border border-slate-800/60">
                  "{req.message}"
                </p>

                {req.status === 'PENDING' && (
                  <div className="flex items-center space-x-3 pt-1">
                    <button
                      onClick={() => handleRespond(req.swapId, 'ACCEPTED')}
                      className="flex-1 flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs transition-all shadow-md shadow-emerald-500/20"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Accept Swap</span>
                    </button>
                    <button
                      onClick={() => handleRespond(req.swapId, 'REJECTED')}
                      className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs font-semibold transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {req.status === 'ACCEPTED' && (
                  <button
                    onClick={() => setSelectedSwapForSession(req)}
                    className="w-full flex items-center justify-center space-x-2 py-2 px-4 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/40 text-xs font-semibold transition-all"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Schedule Learning Session</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Outgoing Requests Section */}
      <div className="space-y-4 pt-4">
        <h2 className="text-base font-bold text-white flex items-center space-x-2">
          <Send className="w-4 h-4 text-indigo-400" />
          <span>Sent Proposals ({outgoingRequests.length})</span>
        </h2>

        {outgoingRequests.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-slate-900/40 border border-slate-800 text-xs text-slate-500">
            You haven't sent any swap requests yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {outgoingRequests.map((req) => (
              <div key={req.swapId} className="p-5 rounded-2xl bg-[#10172A] border border-slate-800 space-y-4 shadow-xl">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl">{req.receiver?.avatar || '👤'}</span>
                    <div>
                      <h4 className="text-sm font-bold text-white">{req.receiver?.name}</h4>
                      <p className="text-[10px] text-slate-400">{req.receiver?.experienceLevel} • {req.receiver?.location}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full border font-mono ${
                    req.status === 'ACCEPTED'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : req.status === 'REJECTED'
                      ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  }`}>
                    {req.status}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs space-y-1">
                  <div className="text-slate-300">
                    Offering: <strong className="text-indigo-400">{req.offeredSkill?.name}</strong> ↔ Wanting: <strong className="text-emerald-400">{req.wantedSkill?.name}</strong>
                  </div>
                </div>

                {req.status === 'ACCEPTED' && (
                  <button
                    onClick={() => setSelectedSwapForSession(req)}
                    className="w-full flex items-center justify-center space-x-2 py-2 px-4 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/40 text-xs font-semibold transition-all"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Schedule Session with {req.receiver?.name}</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Schedule Session Modal */}
      {selectedSwapForSession && (
        <ScheduleSessionModal
          isOpen={Boolean(selectedSwapForSession)}
          swap={selectedSwapForSession}
          currentUser={currentUser}
          onClose={() => setSelectedSwapForSession(null)}
          onSuccess={() => {
            loadRequests();
            setActiveTab('sessions');
          }}
        />
      )}
    </div>
  );
}
