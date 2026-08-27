import React from 'react';
import { 
  Sparkles, 
  ArrowRightLeft, 
  GraduationCap, 
  BookOpen, 
  Star, 
  MapPin, 
  Send,
  UserCheck,
  ChevronRight
} from 'lucide-react';
import SkillBadge from './SkillBadge';

export default function MatchCard({ match, onProposeSwap, onViewProfile, onInspectQuery }) {
  const { partner, matchScore, skillsTheyTeach, skillsYouTeach, compatibilityBreakdown } = match;

  return (
    <div className="relative rounded-2xl bg-[#10172A] border border-slate-800 p-5 hover:border-indigo-500/50 transition-all duration-300 shadow-xl hover:shadow-indigo-500/10 group">
      {/* Top Banner: Match Score Badge & Type */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
        <div className="flex items-center space-x-3">
          <div className="text-3xl p-2 rounded-2xl bg-slate-900 border border-slate-800 shadow-inner">
            {partner.avatar || '👨‍💻'}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-base text-white tracking-tight">{partner.name}</h3>
              <span className="flex items-center space-x-1 text-xs font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                <Star className="w-3 h-3 fill-amber-400" />
                <span>{partner.rating}</span>
              </span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-slate-400 mt-0.5">
              <span>{partner.experienceLevel}</span>
              <span>•</span>
              <span className="flex items-center space-x-1">
                <MapPin className="w-3 h-3 text-slate-500" />
                <span>{partner.location}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Match Score Pill */}
        <div className="text-right">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-500/20 to-emerald-500/20 border border-indigo-500/40 text-emerald-400 font-bold text-sm shadow-sm animate-pulse-glow">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{matchScore}% Match</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1 font-mono">2-Way Cypher Traversal</div>
        </div>
      </div>

      {/* Bio */}
      <p className="text-xs text-slate-300 my-3 leading-relaxed line-clamp-2">
        {partner.bio}
      </p>

      {/* 2-Way Skill Exchange Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-4">
        {/* They Teach You */}
        <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20">
          <div className="flex items-center space-x-1.5 text-xs font-semibold text-emerald-400 mb-2">
            <GraduationCap className="w-4 h-4" />
            <span>They Teach You ({skillsTheyTeach.length})</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {skillsTheyTeach.map((s) => (
              <SkillBadge 
                key={s.skillId} 
                skill={s} 
                proficiency={s.theirProficiency || s.proficiency}
                experienceYears={s.theirExpYears || s.experienceYears}
              />
            ))}
          </div>
        </div>

        {/* You Teach Them */}
        <div className="p-3 rounded-xl bg-indigo-950/20 border border-indigo-500/20">
          <div className="flex items-center space-x-1.5 text-xs font-semibold text-indigo-400 mb-2">
            <BookOpen className="w-4 h-4" />
            <span>You Teach Them ({skillsYouTeach.length})</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {skillsYouTeach.map((s) => (
              <SkillBadge 
                key={s.skillId} 
                skill={s} 
                priority={s.theirPriority || s.priority}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Compatibility Score Breakdown Summary */}
      {compatibilityBreakdown && (
        <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-2 mb-4">
          <div className="flex items-center space-x-1">
            <span className="text-slate-500">Teaching Match:</span>
            <span className="text-emerald-400 font-semibold">{compatibilityBreakdown.teachingMatch}</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="text-slate-500">Learning Match:</span>
            <span className="text-indigo-400 font-semibold">{compatibilityBreakdown.learningMatch}</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="text-slate-500">Rating Bonus:</span>
            <span className="text-amber-400 font-semibold">{compatibilityBreakdown.ratingBonus}</span>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center space-x-3 pt-2">
        <button
          onClick={() => onProposeSwap(match)}
          className="flex-1 flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold text-xs shadow-lg shadow-indigo-500/25 transition-all group-hover:scale-[1.02]"
        >
          <Send className="w-4 h-4" />
          <span>Propose Skill Swap</span>
        </button>

        <button
          onClick={() => onViewProfile(partner.userId)}
          className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-all"
        >
          <span>View Profile</span>
        </button>
      </div>
    </div>
  );
}
