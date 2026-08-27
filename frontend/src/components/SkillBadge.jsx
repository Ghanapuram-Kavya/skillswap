import React from 'react';
import { X } from 'lucide-react';

const CATEGORY_COLORS = {
  'Programming Languages': 'bg-sky-500/10 text-sky-400 border-sky-500/30',
  'Web Development': 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
  'Mobile App Development': 'bg-purple-500/10 text-purple-400 border-purple-500/30',
  'AI & Data Science': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  'Cloud & DevOps': 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  'Databases & Storage': 'bg-rose-500/10 text-rose-400 border-rose-500/30',
  'UI/UX & Creative Design': 'bg-pink-500/10 text-pink-400 border-pink-500/30',
  'Soft Skills & Leadership': 'bg-teal-500/10 text-teal-400 border-teal-500/30'
};

export default function SkillBadge({ 
  skill, 
  onDelete, 
  onClick, 
  showLevel = true,
  proficiency,
  priority,
  experienceYears
}) {
  const colorClass = CATEGORY_COLORS[skill.category] || 'bg-slate-800 text-slate-300 border-slate-700';

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${colorClass} ${
        onClick ? 'cursor-pointer hover:scale-105 hover:shadow-md' : ''
      }`}
    >
      <span className="text-sm">{skill.icon || '💡'}</span>
      <span className="font-semibold">{skill.name}</span>

      {proficiency && (
        <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-black/30 font-mono">
          {proficiency} {experienceYears ? `(${experienceYears}y)` : ''}
        </span>
      )}

      {priority && (
        <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-black/30 font-mono text-amber-300">
          Pri: {priority}
        </span>
      )}

      {onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(skill.skillId);
          }}
          className="p-0.5 rounded-full hover:bg-white/20 text-slate-400 hover:text-white transition-colors"
          title="Remove skill"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}
