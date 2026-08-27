import React from 'react';
import { 
  LayoutDashboard, 
  GraduationCap, 
  Search, 
  Sparkles, 
  Send, 
  Calendar, 
  User, 
  Network, 
  Terminal,
  Layers
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
  { id: 'my-skills', label: 'My Skills', icon: GraduationCap, badge: 'Teach / Learn' },
  { id: 'find-skills', label: 'Explore Skills', icon: Search, badge: '40+' },
  { id: 'matches', label: '2-Way Matches', icon: Sparkles, badge: '95% Match', badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30 font-semibold' },
  { id: 'requests', label: 'Swap Requests', icon: Send, badge: null },
  { id: 'sessions', label: 'Learning Sessions', icon: Calendar, badge: 'Active' },
  { id: 'profile', label: 'My Profile', icon: User, badge: null },
  { id: 'graph-explorer', label: 'Graph Explorer', icon: Network, badge: 'Canvas' },
  { id: 'cypher', label: 'openCypher Queries', icon: Terminal, badge: 'Cypher' }
];

export default function Sidebar({ activeTab, setActiveTab }) {
  return (
    <aside className="w-64 bg-[#0D1326] border-r border-slate-800 flex flex-col h-[calc(100vh-4rem)] select-none">
      {/* Navigation Links */}
      <div className="p-4 flex-1 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
          Platform Navigation
        </div>

        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 shadow-sm shadow-indigo-500/10 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full border font-mono ${
                  item.badgeColor || 'bg-slate-800 text-slate-400 border-slate-700'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Graph Database Callout */}
      <div className="p-4 border-t border-slate-800">
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-950/40 to-slate-900 border border-indigo-900/40 text-xs space-y-2">
          <div className="flex items-center space-x-2 text-indigo-400 font-semibold">
            <Layers className="w-4 h-4" />
            <span>Why Graph Database?</span>
          </div>
          <p className="text-[11px] leading-relaxed text-slate-400">
            Discovers two-way skill matches:
            <code className="block mt-1 font-mono text-[10px] text-indigo-300">
              {"(A)-[:WANTS]->(S1)<-[:HAS]-(B)"}
            </code>
            in O(1) direct relationship hops without heavy SQL joins!
          </p>
        </div>
      </div>
    </aside>
  );
}
