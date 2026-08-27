import React from 'react';
import { 
  User, 
  MapPin, 
  Mail, 
  Star, 
  GraduationCap, 
  BookOpen, 
  MessageSquareQuote,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import SkillBadge from '../components/SkillBadge';

export default function ProfilePage({ setActiveTab }) {
  const { currentUser } = useAuth();

  if (!currentUser) return null;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      {/* Profile Header Hero */}
      <div className="rounded-3xl bg-gradient-to-r from-indigo-900/50 via-[#10172A] to-slate-900 border border-slate-800 p-8 shadow-2xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center space-x-5">
            <div className="text-5xl p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl">
              {currentUser.avatar || '👩‍💻'}
            </div>
            <div className="space-y-1">
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl font-extrabold text-white tracking-tight">{currentUser.name}</h1>
                <span className="flex items-center space-x-1 text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{currentUser.rating} Rating</span>
                </span>
              </div>
              <p className="text-xs text-indigo-300 font-semibold">{currentUser.experienceLevel} Level</p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 pt-1">
                <span className="flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  <span>{currentUser.location}</span>
                </span>
                <span>•</span>
                <span className="flex items-center space-x-1">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  <span>{currentUser.email}</span>
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('my-skills')}
            className="px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-semibold text-xs transition-all shadow-lg shadow-indigo-500/25"
          >
            Edit Skill Profile
          </button>
        </div>

        {/* Bio */}
        <p className="mt-6 text-xs text-slate-300 bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80 leading-relaxed max-w-3xl">
          {currentUser.bio}
        </p>
      </div>

      {/* Skills Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Skills Taught */}
        <div className="rounded-2xl bg-[#10172A] border border-slate-800 p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <GraduationCap className="w-4 h-4 text-emerald-400" />
              <span>Skills Offered (Can Teach)</span>
            </h3>
            <span className="text-xs text-emerald-400 font-mono font-semibold">{currentUser.skillsTaught?.length || 0} Skills</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {currentUser.skillsTaught?.map((s) => (
              <SkillBadge
                key={s.skillId}
                skill={s}
                proficiency={s.proficiency}
                experienceYears={s.experienceYears}
              />
            ))}
          </div>
        </div>

        {/* Skills Wanted */}
        <div className="rounded-2xl bg-[#10172A] border border-slate-800 p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-indigo-400" />
              <span>Learning Wishlist (Wants to Learn)</span>
            </h3>
            <span className="text-xs text-indigo-400 font-mono font-semibold">{currentUser.skillsWanted?.length || 0} Targets</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {currentUser.skillsWanted?.map((s) => (
              <SkillBadge
                key={s.skillId}
                skill={s}
                priority={s.priority}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Community Reviews & Testimonials */}
      <div className="rounded-2xl bg-[#10172A] border border-slate-800 p-6 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center space-x-2">
          <MessageSquareQuote className="w-4 h-4 text-amber-400" />
          <span>Peer Reviews & Testimonials ({currentUser.reviews?.length || 0})</span>
        </h3>

        {(!currentUser.reviews || currentUser.reviews.length === 0) ? (
          <div className="p-8 text-center text-slate-500 text-xs">
            No reviews yet. Complete your first skill exchange session to receive peer endorsements!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentUser.reviews.map((rev) => (
              <div key={rev.reviewId} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{rev.author?.avatar || '👤'}</span>
                    <span className="text-xs font-bold text-white">{rev.author?.name || 'Peer Learner'}</span>
                  </div>
                  <div className="flex items-center text-amber-400 text-xs">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-400" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed italic">"{rev.comment}"</p>
                <div className="text-[10px] text-slate-500">{new Date(rev.createdAt).toLocaleDateString()}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
