import React from 'react';
import { 
  X, 
  User, 
  Code, 
  Layers, 
  Star, 
  MapPin, 
  Sparkles, 
  ArrowRight, 
  GraduationCap, 
  BookOpen 
} from 'lucide-react';
import SkillBadge from './SkillBadge';

export default function NodeDetailDrawer({ 
  node, 
  onClose, 
  onFindMatchesForUser,
  onFindPathFrom 
}) {
  if (!node) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-[#0F172A] border-l border-slate-800 shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-in-out animate-slideInRight">
      {/* Drawer Header */}
      <div className="p-5 border-b border-slate-800 flex items-start justify-between bg-slate-900/60">
        <div className="flex items-center space-x-3">
          <div className="text-3xl p-2.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
            {node.avatar || node.icon || (node.type === 'User' ? '👤' : node.type === 'Category' ? '📂' : '💡')}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                {node.type}
              </span>
              {node.rating && (
                <span className="flex items-center space-x-1 text-[10px] font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                  <Star className="w-3 h-3 fill-amber-400" />
                  <span>{node.rating}</span>
                </span>
              )}
            </div>
            <h3 className="text-base font-bold text-white mt-1 tracking-tight">{node.label || node.name}</h3>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Drawer Body */}
      <div className="flex-1 p-5 overflow-y-auto space-y-5">
        {/* Description / Bio */}
        {(node.description || node.bio) && (
          <div>
            <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">About / Summary</span>
            <p className="mt-1 text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800">
              {node.description || node.bio}
            </p>
          </div>
        )}

        {/* Node Properties */}
        <div className="space-y-2">
          <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Graph Properties</span>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-slate-500 block text-[10px]">ID</span>
              <span className="font-mono text-slate-200">{node.id}</span>
            </div>

            {node.role && (
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Experience Level</span>
                <span className="text-indigo-400 font-semibold">{node.role}</span>
              </div>
            )}

            {node.category && (
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Category</span>
                <span className="text-sky-400">{node.category}</span>
              </div>
            )}

            {node.location && (
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 col-span-2">
                <span className="text-slate-500 block text-[10px]">Location</span>
                <span className="text-slate-200">{node.location}</span>
              </div>
            )}
          </div>
        </div>

        {/* Cypher Node Match Query */}
        <div>
          <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">openCypher Lookup</span>
          <pre className="mt-1.5 p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-indigo-300 overflow-x-auto">
{`MATCH (n:${node.type || 'Node'} {id: '${node.id}'})
RETURN n;`}
          </pre>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-5 border-t border-slate-800 bg-slate-900/60 space-y-2">
        {node.type === 'User' && (
          <button
            onClick={() => onFindMatchesForUser && onFindMatchesForUser(node.id)}
            className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold text-xs shadow-lg shadow-indigo-500/20 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Find 2-Way Matches For {node.label}</span>
          </button>
        )}

        <button
          onClick={() => onFindPathFrom && onFindPathFrom(node.label || node.name)}
          className="w-full flex items-center justify-center space-x-2 py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-all"
        >
          <ArrowRight className="w-3.5 h-3.5 text-indigo-400" />
          <span>Find Shortest Path From This Node</span>
        </button>
      </div>
    </div>
  );
}
