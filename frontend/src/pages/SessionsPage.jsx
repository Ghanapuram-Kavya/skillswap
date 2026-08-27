import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  Video, 
  CheckCircle2, 
  Star, 
  ExternalLink, 
  GraduationCap, 
  BookOpen,
  MessageSquarePlus
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export default function SessionsPage() {
  const { currentUser } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [activeTab, setSubTab] = useState('upcoming'); // 'upcoming' or 'completed'
  const [ratingModalSession, setRatingModalSession] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);

  const loadSessions = async () => {
    if (!currentUser) return;
    try {
      setLoading(true);
      const res = await api.getSessions(currentUser.userId);
      if (res.success) setSessions(res.data);
    } catch (err) {
      console.error('Error loading sessions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSessions();
  }, [currentUser]);

  const handleCompleteSession = async (e) => {
    e.preventDefault();
    if (!ratingModalSession) return;
    try {
      await api.completeSession(ratingModalSession.sessionId, rating, comment);
      setRatingModalSession(null);
      setComment('');
      await loadSessions();
    } catch (err) {
      alert(err.message);
    }
  };

  const upcomingSessions = sessions.filter(s => s.status === 'SCHEDULED');
  const completedSessions = sessions.filter(s => s.status === 'COMPLETED');

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold mb-2">
          <Calendar className="w-3.5 h-3.5" />
          <span>Live Learning Hub</span>
        </div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Peer Learning Sessions</h1>
        <p className="text-xs text-slate-400 mt-1">
          Join scheduled 1-on-1 video rooms, track completed exchanges, and write reviews.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setSubTab('upcoming')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'upcoming'
              ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Upcoming Sessions ({upcomingSessions.length})</span>
        </button>

        <button
          onClick={() => setSubTab('completed')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'completed'
              ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Completed Exchanges ({completedSessions.length})</span>
        </button>
      </div>

      {/* Upcoming Sessions List */}
      {activeTab === 'upcoming' && (
        <div className="space-y-4">
          {upcomingSessions.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-[#10172A] border border-slate-800 text-xs text-slate-500">
              No upcoming scheduled sessions. Accept a swap request to schedule one!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {upcomingSessions.map((session) => (
                <div key={session.sessionId} className="p-6 rounded-2xl bg-[#10172A] border border-slate-800 space-y-5 shadow-xl hover:border-emerald-500/40 transition-all">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-3xl p-2.5 rounded-2xl bg-slate-900 border border-slate-800 shadow-inner">
                        {session.skill?.icon || '💡'}
                      </span>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                          {session.isTeacher ? 'You are Teaching' : 'You are Learning'}
                        </span>
                        <h3 className="font-bold text-base text-white">{session.skill?.name}</h3>
                        <p className="text-xs text-slate-400">
                          Partner: <strong className="text-slate-200">{session.isTeacher ? session.learner?.name : session.teacher?.name}</strong>
                        </p>
                      </div>
                    </div>

                    <span className="text-[10px] uppercase font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      Scheduled
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-slate-500 block text-[10px]">Date</span>
                      <span className="text-slate-200 font-medium">📅 {session.date}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Time</span>
                      <span className="text-slate-200 font-medium">⏰ {session.time}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 pt-1">
                    <a
                      href={session.meetingLink}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold text-xs shadow-lg shadow-emerald-500/20 transition-all"
                    >
                      <Video className="w-4 h-4" />
                      <span>Join Live Meeting Room</span>
                      <ExternalLink className="w-3.5 h-3.5 ml-1" />
                    </a>

                    <button
                      onClick={() => setRatingModalSession(session)}
                      className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition-colors"
                      title="Mark as completed & leave review"
                    >
                      Mark Done
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Completed Sessions List */}
      {activeTab === 'completed' && (
        <div className="space-y-4">
          {completedSessions.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-[#10172A] border border-slate-800 text-xs text-slate-500">
              No completed sessions recorded yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {completedSessions.map((session) => (
                <div key={session.sessionId} className="p-5 rounded-2xl bg-[#10172A] border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{session.skill?.icon || '💡'}</span>
                      <div>
                        <h4 className="text-sm font-bold text-white">{session.skill?.name}</h4>
                        <p className="text-[11px] text-slate-400">
                          {session.isTeacher ? `Taught to ${session.learner?.name}` : `Learned from ${session.teacher?.name}`}
                        </p>
                      </div>
                    </div>
                    <span className="flex items-center space-x-1 text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Completed</span>
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Session Date: {session.date} • {session.mode}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Star Rating Modal */}
      {ratingModalSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md bg-[#0F172A] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-6 space-y-4">
            <h3 className="text-base font-bold text-white">Complete Session & Leave Review</h3>
            <p className="text-xs text-slate-400">
              How was your learning experience with {ratingModalSession.teacher?.name}?
            </p>

            <form onSubmit={handleCompleteSession} className="space-y-4 pt-2">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">Rating (1 to 5 Stars)</label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-2 text-2xl transition-transform hover:scale-125"
                    >
                      <Star className={`w-6 h-6 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-600'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">Feedback / Comment</label>
                <textarea
                  rows="3"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share what you learned and praise their teaching clarity..."
                  className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                ></textarea>
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setRatingModalSession(null)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold shadow-lg shadow-emerald-500/25"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
