import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  Plus, 
  Trash2, 
  Sparkles, 
  Check, 
  HelpCircle,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import SkillBadge from '../components/SkillBadge';

export default function MySkillsPage({ setActiveTab }) {
  const { currentUser, refreshUser } = useAuth();
  const [allSkills, setAllSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states for adding taught skill
  const [teachSkillId, setTeachSkillId] = useState('');
  const [proficiency, setProficiency] = useState('Intermediate');
  const [experienceYears, setExperienceYears] = useState(2);

  // Form states for adding wanted skill
  const [wantSkillId, setWantSkillId] = useState('');
  const [priority, setPriority] = useState('High');
  const [currentLevel, setCurrentLevel] = useState('Beginner');

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await api.getAllSkills();
        if (res.success) {
          setAllSkills(res.data);
          if (res.data.length > 0) {
            setTeachSkillId(res.data[0].skillId);
            setWantSkillId(res.data[1]?.skillId || res.data[0].skillId);
          }
        }
      } catch (err) {
        console.error('Error loading skills:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  const handleAddTaught = async (e) => {
    e.preventDefault();
    if (!teachSkillId) return;
    try {
      await api.addSkillTaught(currentUser.userId, teachSkillId, proficiency, experienceYears);
      await refreshUser();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleRemoveTaught = async (skillId) => {
    try {
      await api.removeSkillTaught(currentUser.userId, skillId);
      await refreshUser();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleAddWanted = async (e) => {
    e.preventDefault();
    if (!wantSkillId) return;
    try {
      await api.addSkillWanted(currentUser.userId, wantSkillId, priority, currentLevel);
      await refreshUser();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleRemoveWanted = async (skillId) => {
    try {
      await api.removeSkillWanted(currentUser.userId, skillId);
      await refreshUser();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold mb-2">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Profile Skill Management</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Manage Your Teaching & Learning Skills</h1>
          <p className="text-xs text-slate-400 mt-1">
            Updating your skill graph allows the 2-way matching engine to instantly discover compatible partners!
          </p>
        </div>

        <button
          onClick={() => setActiveTab('matches')}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold text-xs shadow-lg shadow-indigo-500/25 transition-all"
        >
          <Sparkles className="w-4 h-4" />
          <span>Find 2-Way Matches Now</span>
        </button>
      </div>

      {/* Two-Column Grid: Skills I Teach vs Skills I Want */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Panel 1: Skills I Can Teach (HAS_SKILL) */}
        <div className="rounded-3xl bg-[#10172A] border border-slate-800 p-6 space-y-6 shadow-xl">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white tracking-tight">Skills I Can Teach</h2>
                <p className="text-[11px] text-slate-400">Creates <code className="text-emerald-400 font-mono">:HAS_SKILL</code> relationships</p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              {currentUser?.skillsTaught?.length || 0} Offered
            </span>
          </div>

          {/* Active Skills List */}
          <div className="space-y-2 min-h-[120px]">
            <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider block mb-2">
              Current Teaching Portfolio
            </span>
            <div className="flex flex-wrap gap-2">
              {currentUser?.skillsTaught?.map((s) => (
                <SkillBadge
                  key={s.skillId}
                  skill={s}
                  proficiency={s.proficiency}
                  experienceYears={s.experienceYears}
                  onDelete={() => handleRemoveTaught(s.skillId)}
                />
              ))}
            </div>
          </div>

          {/* Add Skill Form */}
          <form onSubmit={handleAddTaught} className="pt-4 border-t border-slate-800 space-y-3 bg-slate-950/40 p-4 rounded-2xl border">
            <span className="text-xs font-bold text-white flex items-center space-x-1.5">
              <Plus className="w-4 h-4 text-emerald-400" />
              <span>Add Skill You Can Teach</span>
            </span>

            <div>
              <label className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">Select Skill</label>
              <select
                value={teachSkillId}
                onChange={(e) => setTeachSkillId(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                {allSkills.map((sk) => (
                  <option key={sk.skillId} value={sk.skillId}>
                    {sk.icon} {sk.name} ({sk.category})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">Proficiency</label>
                <select
                  value={proficiency}
                  onChange={(e) => setProficiency(e.target.value)}
                  className="w-full p-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">Experience (Years)</label>
                <input
                  type="number"
                  min="1"
                  max="15"
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(Number(e.target.value))}
                  className="w-full p-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs shadow-lg shadow-emerald-500/25 transition-all"
            >
              Add to Teaching Profile
            </button>
          </form>
        </div>

        {/* Panel 2: Skills I Want to Learn (WANTS_TO_LEARN) */}
        <div className="rounded-3xl bg-[#10172A] border border-slate-800 p-6 space-y-6 shadow-xl">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white tracking-tight">Skills I Want to Learn</h2>
                <p className="text-[11px] text-slate-400">Creates <code className="text-indigo-400 font-mono">:WANTS_TO_LEARN</code> relationships</p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
              {currentUser?.skillsWanted?.length || 0} Targets
            </span>
          </div>

          {/* Active Learning Wishlist */}
          <div className="space-y-2 min-h-[120px]">
            <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider block mb-2">
              Current Learning Wishlist
            </span>
            <div className="flex flex-wrap gap-2">
              {currentUser?.skillsWanted?.map((s) => (
                <SkillBadge
                  key={s.skillId}
                  skill={s}
                  priority={s.priority}
                  onDelete={() => handleRemoveWanted(s.skillId)}
                />
              ))}
            </div>
          </div>

          {/* Add Wanted Skill Form */}
          <form onSubmit={handleAddWanted} className="pt-4 border-t border-slate-800 space-y-3 bg-slate-950/40 p-4 rounded-2xl border">
            <span className="text-xs font-bold text-white flex items-center space-x-1.5">
              <Plus className="w-4 h-4 text-indigo-400" />
              <span>Add Skill You Want to Learn</span>
            </span>

            <div>
              <label className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">Select Target Skill</label>
              <select
                value={wantSkillId}
                onChange={(e) => setWantSkillId(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                {allSkills.map((sk) => (
                  <option key={sk.skillId} value={sk.skillId}>
                    {sk.icon} {sk.name} ({sk.category})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">Learning Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full p-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">Current Level</label>
                <select
                  value={currentLevel}
                  onChange={(e) => setCurrentLevel(e.target.value)}
                  className="w-full p-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="None">None (Beginner)</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-semibold text-xs shadow-lg shadow-indigo-500/25 transition-all"
            >
              Add to Learning Wishlist
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
