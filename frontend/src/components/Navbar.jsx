import React, { useState } from 'react';
import { 
  Users, 
  Terminal, 
  Database, 
  ExternalLink, 
  ChevronDown, 
  Sparkles,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onOpenCypherModal, onOpenUserModal }) {
  const { currentUser, allUsers, switchUser, dbHealth } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const isCloud = dbHealth?.mode === 'COGNODB_CLOUD';

  return (
    <header className="h-16 border-b border-slate-800 bg-[#0D1326]/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Brand & Logo */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-sky-400 flex items-center justify-center shadow-lg shadow-indigo-500/25">
          <Sparkles className="w-5 h-5 text-white animate-pulse" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-bold text-lg text-white tracking-tight">Skill<span className="text-indigo-400">Swap</span></span>
            <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              openCypher • CognoDB
            </span>
          </div>
          <p className="text-xs text-slate-400 font-medium">Graph-Based Skill Exchange & Learning Platform</p>
        </div>
      </div>

      {/* Database Connection Pill & Status */}
      <div className="hidden lg:flex items-center space-x-4">
        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
          <Database className={`w-3.5 h-3.5 ${isCloud ? 'text-emerald-400' : 'text-amber-400'}`} />
          <span className="text-slate-300 font-mono">
            {isCloud ? 'CognoDB Cloud (Bolt+s)' : 'In-Memory Graph Engine'}
          </span>
          <span className={`w-2 h-2 rounded-full ${isCloud ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
        </div>

        <div className="flex items-center space-x-1.5 text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>2-Way Match Engine Ready</span>
        </div>
      </div>

      {/* Right Controls: Cypher Inspector & User Switcher */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onOpenCypherModal}
          className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 text-xs font-medium transition-all shadow-sm group"
          title="Inspect openCypher graph queries"
        >
          <Terminal className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
          <span className="hidden sm:inline">openCypher Workbench</span>
        </button>

        {/* User Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-2.5 px-3 py-1.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 transition-all text-left"
          >
            <span className="text-xl">{currentUser?.avatar || '👩‍💻'}</span>
            <div className="hidden md:block">
              <div className="text-xs font-bold text-white flex items-center space-x-1">
                <span>{currentUser?.name || 'Loading...'}</span>
                <span className="text-[10px] text-amber-400">★ {currentUser?.rating || '5.0'}</span>
              </div>
              <div className="text-[10px] text-indigo-300 font-medium">{currentUser?.experienceLevel || 'Student'}</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#0F172A] border border-slate-800 shadow-2xl z-50 py-2 overflow-hidden animate-fadeIn">
              <div className="px-3 py-2 border-b border-slate-800 text-[10px] font-bold uppercase text-slate-500 tracking-wider">
                Switch Active Persona (Graph Node)
              </div>
              <div className="max-h-72 overflow-y-auto space-y-1 p-1">
                {allUsers.map((u) => {
                  const isSelected = u.userId === currentUser?.userId;
                  return (
                    <button
                      key={u.userId}
                      onClick={() => {
                        switchUser(u.userId);
                        setDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all ${
                        isSelected
                          ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                          : 'text-slate-300 hover:bg-slate-800/80'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5">
                        <span className="text-lg">{u.avatar}</span>
                        <div>
                          <div className="text-xs font-semibold text-white">{u.name}</div>
                          <div className="text-[10px] text-slate-400">{u.experienceLevel} • {u.location.split(',')[0]}</div>
                        </div>
                      </div>
                      <span className="text-[10px] text-amber-400 font-semibold">★ {u.rating}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
