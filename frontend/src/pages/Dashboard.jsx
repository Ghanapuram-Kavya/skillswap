import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Sparkles, 
  GraduationCap, 
  BookOpen, 
  Calendar, 
  Send, 
  ArrowRight, 
  Zap, 
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import MatchCard from '../components/MatchCard';
import SendSwapModal from '../components/SendSwapModal';

export default function Dashboard({ setActiveTab, onOpenCypherModal }) {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState(null);
  const [topMatches, setTopMatches] = useState([]);
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = async () => {
    if (!currentUser) return;
    try {
      setLoading(true);
      const [statsRes, matchesRes, sessionsRes] = await Promise.all([
        api.getOverviewStats(currentUser.userId),
        api.getMatches(currentUser.userId),
        api.getSessions(currentUser.userId)
      ]);

      if (statsRes.success) setStats(statsRes.data);
      if (matchesRes.success) setTopMatches(matchesRes.data.slice(0, 2));
      if (sessionsRes.success) {
        setUpcomingSessions(sessionsRes.data.filter(s => s.status === 'SCHEDULED'));
      }
    } catch (err) {
      console.error('Error loading dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [currentUser]);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      {/* Welcome Hero Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900/60 via-purple-900/40 to-slate-900 border border-indigo-500/30 p-8 shadow-2xl backdrop-blur-md">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Intelligent 2-Way Graph Matching Active</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-sky-400">{currentUser?.name}</span> {currentUser?.avatar}
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              SkillSwap models your skills and learning goals as a connected graph. Discover complementary partners, propose direct swaps, and schedule 1-on-1 learning sessions!
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('my-skills')}
              className="px-4 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-semibold shadow-lg shadow-indigo-500/25 transition-all"
            >
              Manage My Skills
            </button>
            <button
              onClick={() => setActiveTab('matches')}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all"
            >
              Explore 2-Way Matches
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold uppercase text-slate-400">
            <span>2-Way Skill Matches</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white tracking-tight">{stats?.activeMatchesCount || 0}</div>
          <p className="text-[11px] text-emerald-400 font-medium">95% Compatible Partners</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold uppercase text-slate-400">
            <span>Skills You Teach</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white tracking-tight">{currentUser?.skillsTaught?.length || 0}</div>
          <p className="text-[11px] text-slate-400">Offered in Community Graph</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold uppercase text-slate-400">
            <span>Learning Wishlist</span>
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white tracking-tight">{currentUser?.skillsWanted?.length || 0}</div>
          <p className="text-[11px] text-slate-400">Active Learning Targets</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold uppercase text-slate-400">
            <span>Upcoming Sessions</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white tracking-tight">{upcomingSessions.length}</div>
          <p className="text-[11px] text-amber-400 font-medium">Scheduled Video Sessions</p>
        </div>
      </div>

      {/* Top 2-Way Matches Showcase */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              <span>Recommended 2-Way Skill-Swap Partners</span>
            </h2>
            <p className="text-xs text-slate-400">Partners who teach what you want AND want what you teach</p>
          </div>
          <button
            onClick={() => setActiveTab('matches')}
            className="flex items-center space-x-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
          >
            <span>View All Matches</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {topMatches.map((match) => (
            <MatchCard
              key={match.partner.userId}
              match={match}
              onProposeSwap={(m) => setSelectedMatch(m)}
              onViewProfile={(uid) => setActiveTab('profile')}
              onInspectQuery={onOpenCypherModal}
            />
          ))}
        </div>
      </div>

      {/* Upcoming Learning Sessions & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sessions Column */}
        <div className="lg:col-span-2 rounded-2xl bg-slate-900/60 border border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-emerald-400" />
              <span>Scheduled Learning Sessions</span>
            </h3>
            <button
              onClick={() => setActiveTab('sessions')}
              className="text-xs text-slate-400 hover:text-slate-200"
            >
              See all
            </button>
          </div>

          {upcomingSessions.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">
              No upcoming sessions. Accept a swap request to schedule a session!
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingSessions.map((s) => (
                <div key={s.sessionId} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 text-xl">
                      {s.skill?.icon || '💡'}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">
                        {s.skill?.name} • with {s.isTeacher ? s.learner?.name : s.teacher?.name}
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center space-x-2 mt-0.5">
                        <span>📅 {s.date}</span>
                        <span>•</span>
                        <span>⏰ {s.time}</span>
                        <span>•</span>
                        <span className="text-emerald-400">{s.mode}</span>
                      </div>
                    </div>
                  </div>

                  <a
                    href={s.meetingLink}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition-colors"
                  >
                    <span>Join Room</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Graph Navigation Column */}
        <div className="rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-800 p-5 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Interactive Graph Engine</span>
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Experience real-time graph visualization with drag-and-drop physics, category filters, and multi-hop pathfinding.
          </p>

          <div className="space-y-2 pt-2">
            <button
              onClick={() => setActiveTab('graph-explorer')}
              className="w-full py-2.5 px-4 rounded-xl bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-300 border border-indigo-500/30 text-xs font-semibold flex items-center justify-between transition-all"
            >
              <span>Launch Graph Canvas</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenCypherModal}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium flex items-center justify-between transition-all"
            >
              <span>Inspect openCypher Queries</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Propose Swap Modal */}
      {selectedMatch && (
        <SendSwapModal
          isOpen={Boolean(selectedMatch)}
          match={selectedMatch}
          onClose={() => setSelectedMatch(null)}
          onSuccess={() => loadDashboardData()}
        />
      )}
    </div>
  );
}
