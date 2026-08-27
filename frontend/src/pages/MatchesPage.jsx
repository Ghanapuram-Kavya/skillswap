import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ArrowRightLeft, 
  Layers, 
  GraduationCap, 
  BookOpen, 
  Zap, 
  Info, 
  Send,
  GitBranch
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import MatchCard from '../components/MatchCard';
import SendSwapModal from '../components/SendSwapModal';

export default function MatchesPage({ setActiveTab, onOpenCypherModal }) {
  const { currentUser } = useAuth();
  const [activeTab, setSubTab] = useState('direct'); // 'direct' or 'multihop'
  const [directMatches, setDirectMatches] = useState([]);
  const [multiHopRecs, setMultiHopRecs] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadMatches = async () => {
    if (!currentUser) return;
    try {
      setLoading(true);
      const [matchesRes, multiHopRes] = await Promise.all([
        api.getMatches(currentUser.userId),
        api.getMultiHopRecommendations(currentUser.userId)
      ]);

      if (matchesRes.success) setDirectMatches(matchesRes.data);
      if (multiHopRes.success) setMultiHopRecs(multiHopRes.data);
    } catch (err) {
      console.error('Error loading matches:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMatches();
  }, [currentUser]);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500/20 to-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Graph Match Engine</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Intelligent Skill-Swap & Learning Recommendations
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Traverses the community graph to find complementary 2-way matches and multi-hop related skill opportunities.
          </p>
        </div>

        <button
          onClick={onOpenCypherModal}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all"
        >
          <Zap className="w-4 h-4 text-indigo-400" />
          <span>Inspect Cypher Match Query</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setSubTab('direct')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'direct'
              ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <ArrowRightLeft className="w-4 h-4" />
          <span>Direct 2-Way Matches ({directMatches.length})</span>
        </button>

        <button
          onClick={() => setSubTab('multihop')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'multihop'
              ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <GitBranch className="w-4 h-4" />
          <span>Multi-Hop Indirect Recommendations ({multiHopRecs.length})</span>
        </button>
      </div>

      {/* Direct 2-Way Matches View */}
      {activeTab === 'direct' && (
        <div className="space-y-6">
          {/* Algorithm Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-slate-900 to-slate-900 border border-indigo-500/30 flex items-start space-x-3 text-xs text-slate-300">
            <Info className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <strong className="text-white block">How Direct 2-Way Matching Works:</strong>
              <p className="text-slate-400 leading-relaxed">
                The openCypher matching query searches for complementary bidirectional paths:
                <code className="mx-1 text-emerald-300 font-mono">{"(:User {userId: '" + (currentUser?.userId || 'usr-kavya') + "'})-[:WANTS_TO_LEARN]->(:Skill)<-[:HAS_SKILL]-(:Partner)"}</code>
                and vice-versa. Compatibility score is weighted across teaching match (40%), learning match (40%), experience level (10%), and rating (10%).
              </p>
            </div>
          </div>

          {directMatches.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-[#10172A] border border-slate-800 space-y-3">
              <Sparkles className="w-8 h-8 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-white">No 2-Way Matches Found Yet</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Try adding more skills to your teaching portfolio or learning wishlist to unlock complementary partners!
              </p>
              <button
                onClick={() => setActiveTab('my-skills')}
                className="px-4 py-2 rounded-xl bg-indigo-500 text-white text-xs font-semibold"
              >
                Add More Skills
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {directMatches.map((match) => (
                <MatchCard
                  key={match.partner.userId}
                  match={match}
                  onProposeSwap={(m) => setSelectedMatch(m)}
                  onViewProfile={(uid) => setActiveTab('profile')}
                  onInspectQuery={onOpenCypherModal}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Multi-Hop Indirect Recommendations View */}
      {activeTab === 'multihop' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-900 to-slate-900 border border-purple-500/30 flex items-start space-x-3 text-xs text-slate-300">
            <GitBranch className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <strong className="text-white block">Multi-Hop Traversal (2+ Hops):</strong>
              <p className="text-slate-400 leading-relaxed">
                Discovers teachers who possess skills <em>related</em> to what you want to learn:
                <code className="mx-1 text-purple-300 font-mono">{"(Me)-[:WANTS]->(TargetSkill)-[:RELATED_TO*1..2]-(RelatedSkill)<-[:HAS_SKILL]-(Teacher)"}</code>.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {multiHopRecs.map((rec, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-[#10172A] border border-slate-800 space-y-4 hover:border-purple-500/40 transition-all">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl">{rec.teacher.avatar}</span>
                    <div>
                      <h4 className="text-sm font-bold text-white">{rec.teacher.name}</h4>
                      <p className="text-[10px] text-slate-400">{rec.teacher.experienceLevel} • {rec.teacher.location}</p>
                    </div>
                  </div>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30 font-semibold">
                    2-Hop Match
                  </span>
                </div>

                <p className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 leading-relaxed">
                  💡 {rec.reason}
                </p>

                <div className="flex items-center justify-between text-xs pt-1">
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-500 block">They Teach (Related):</span>
                    <span className="font-semibold text-emerald-400">{rec.relatedSkillTaught.icon} {rec.relatedSkillTaught.name} ({rec.proficiency})</span>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedMatch({
                        partner: rec.teacher,
                        skillsTheyTeach: [rec.relatedSkillTaught],
                        skillsYouTeach: currentUser.skillsTaught || []
                      });
                    }}
                    className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-purple-500 hover:bg-purple-600 text-white font-semibold text-xs transition-all shadow-md shadow-purple-500/20"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Propose Swap</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Send Swap Modal */}
      {selectedMatch && (
        <SendSwapModal
          isOpen={Boolean(selectedMatch)}
          match={selectedMatch}
          onClose={() => setSelectedMatch(null)}
          onSuccess={() => loadMatches()}
        />
      )}
    </div>
  );
}
