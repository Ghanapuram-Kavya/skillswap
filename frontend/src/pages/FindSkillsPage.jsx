import React, { useState, useEffect } from 'react';
import { 
  Search, 
  GraduationCap, 
  BookOpen, 
  Layers, 
  Users, 
  Sparkles, 
  ChevronRight,
  ArrowRight,
  GitBranch
} from 'lucide-react';
import { api } from '../services/api';
import SkillBadge from '../components/SkillBadge';

export default function FindSkillsPage({ setActiveTab }) {
  const [skills, setSkills] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [skillDetails, setSkillDetails] = useState(null);
  const [prereqPath, setPrereqPath] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [catRes, skillRes] = await Promise.all([
          api.getAllCategories(),
          api.getAllSkills(selectedCategory, searchQuery)
        ]);
        if (catRes.success) setCategories(catRes.data);
        if (skillRes.success) setSkills(skillRes.data);
      } catch (err) {
        console.error('Error loading skills catalog:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [selectedCategory, searchQuery]);

  const handleSelectSkill = async (skill) => {
    setSelectedSkill(skill);
    try {
      const [detailRes, prereqRes] = await Promise.all([
        api.getSkillDetails(skill.skillId),
        api.getPrerequisitePath(skill.name)
      ]);
      if (detailRes.success) setSkillDetails(detailRes.data);
      if (prereqRes.success) setPrereqPath(prereqRes.data);
    } catch (err) {
      console.error('Error loading skill detail:', err);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      {/* Page Header */}
      <div>
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold mb-2">
          <Search className="w-3.5 h-3.5" />
          <span>Skill Directory & Teacher Catalog</span>
        </div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Explore Skills & Prerequisite Paths</h1>
        <p className="text-xs text-slate-400 mt-1">
          Browse the community graph by categories, discover teachers, and inspect multi-hop learning dependencies.
        </p>
      </div>

      {/* Search & Category Filter Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0">
          <button
            onClick={() => setSelectedCategory('')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === ''
                ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25'
                : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            All Categories ({skills.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.categoryId}
              onClick={() => setSelectedCategory(cat.categoryId)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.categoryId
                  ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search skill (e.g. Python, Angular)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {skills.map((skill) => (
          <div
            key={skill.skillId}
            onClick={() => handleSelectSkill(skill)}
            className={`p-5 rounded-2xl bg-[#10172A] border transition-all duration-200 cursor-pointer group hover:-translate-y-0.5 hover:shadow-xl ${
              selectedSkill?.skillId === skill.skillId
                ? 'border-indigo-500 shadow-indigo-500/10'
                : 'border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-3xl p-2.5 rounded-2xl bg-slate-900 border border-slate-800 shadow-inner group-hover:scale-110 transition-transform">
                  {skill.icon || '💡'}
                </span>
                <div>
                  <h3 className="font-bold text-sm text-white group-hover:text-indigo-400 transition-colors">
                    {skill.name}
                  </h3>
                  <span className="text-[10px] text-slate-400 font-medium">{skill.category}</span>
                </div>
              </div>

              <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                {skill.level.split(' ')[0]}
              </span>
            </div>

            <p className="text-xs text-slate-400 mt-3 line-clamp-2 leading-relaxed">
              {skill.description}
            </p>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-3 text-slate-400">
                <span className="flex items-center space-x-1 text-emerald-400">
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>{skill.teacherCount} Teachers</span>
                </span>
                <span>•</span>
                <span className="flex items-center space-x-1 text-indigo-400">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{skill.learnerCount} Learners</span>
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" />
            </div>
          </div>
        ))}
      </div>

      {/* Selected Skill Deep Dive Modal / Panel */}
      {selectedSkill && skillDetails && (
        <div className="rounded-3xl bg-[#0F172A] border border-indigo-500/40 p-6 space-y-6 shadow-2xl animate-fadeIn">
          <div className="flex items-start justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center space-x-3">
              <span className="text-4xl">{selectedSkill.icon}</span>
              <div>
                <h2 className="text-xl font-extrabold text-white tracking-tight">{selectedSkill.name}</h2>
                <p className="text-xs text-slate-400">{selectedSkill.category} • {selectedSkill.level}</p>
              </div>
            </div>

            <button
              onClick={() => setSelectedSkill(null)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white text-xs font-semibold"
            >
              Close Inspector
            </button>
          </div>

          {/* Prerequisite Chain & Graph Relationship View */}
          {prereqPath && prereqPath.learningSequence?.length > 1 && (
            <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 space-y-2">
              <div className="flex items-center space-x-2 text-xs font-bold text-indigo-400">
                <GitBranch className="w-4 h-4" />
                <span>openCypher Prerequisite Learning Chain (Variable Depth Traversal)</span>
              </div>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {prereqPath.learningSequence.slice().reverse().map((seqSkill, idx, arr) => (
                  <React.Fragment key={seqSkill}>
                    <span className="px-3 py-1 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-xs font-semibold text-indigo-200">
                      {seqSkill}
                    </span>
                    {idx < arr.length - 1 && (
                      <ArrowRight className="w-4 h-4 text-slate-500" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}

          {/* Available Teachers Directory */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <GraduationCap className="w-4 h-4 text-emerald-400" />
              <span>Available Community Teachers ({skillDetails.teachers?.length || 0})</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {skillDetails.teachers?.map((t) => (
                <div key={t.userId} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{t.avatar || '👤'}</span>
                    <div>
                      <div className="text-xs font-bold text-white">{t.name}</div>
                      <div className="text-[10px] text-slate-400">{t.proficiency} • {t.experienceYears}y experience</div>
                    </div>
                  </div>
                  <span className="text-xs text-amber-400 font-bold">★ {t.rating}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
