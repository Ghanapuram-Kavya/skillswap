import React, { useState } from 'react';
import { 
  Terminal, 
  Copy, 
  Check, 
  Play, 
  Zap, 
  BookOpen, 
  Sparkles, 
  Layers, 
  Network,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const PLAYGROUND_QUERIES = [
  {
    id: 'query-1',
    title: 'Query 1 – Find Users Who Can Teach a Skill (1-Hop)',
    category: 'Direct Match',
    input: 'Python',
    cypher: `// Find all users who can teach Python with proficiency and rating
MATCH (u:User)-[r:HAS_SKILL]->(s:Skill {name: 'Python'})
RETURN u.name AS teacherName,
       u.experienceLevel AS level,
       u.rating AS rating,
       r.proficiency AS proficiency,
       r.experienceYears AS experienceYears
ORDER BY u.rating DESC;`,
    explanation: 'Basic single-hop traversal from Skill node back to User teachers via :HAS_SKILL relationship.'
  },
  {
    id: 'query-2',
    title: 'Query 2 – Direct 2-Way Skill Swap Match (⭐ Key Graph Query)',
    category: 'Bidirectional Traversal',
    input: 'usr-kavya',
    cypher: `// Direct 2-Way Skill-Swap Match Query (Kavya ↔ Rahul)
MATCH (me:User {userId: 'usr-kavya'})-[w:WANTS_TO_LEARN]->(wantedSkill:Skill)<-[th:HAS_SKILL]-(partner:User)
MATCH (partner)-[pw:WANTS_TO_LEARN]->(offeredSkill:Skill)<-[mh:HAS_SKILL]-(me)
WHERE me <> partner
RETURN partner.name AS partnerName,
       partner.experienceLevel AS partnerExperience,
       partner.rating AS partnerRating,
       collect(DISTINCT wantedSkill.name) AS skillsTheyTeach,
       collect(DISTINCT offeredSkill.name) AS skillsYouTeach;`,
    explanation: 'Evaluates the core reciprocal skill exchange cycle in a single declarative graph pattern.'
  },
  {
    id: 'query-3',
    title: 'Query 3 – Multi-Hop Related Skill Recommendations (2+ Hops)',
    category: 'Multi-Hop Traversal',
    input: 'usr-kavya',
    cypher: `// 2-Hop Traversal: User -> WANTS -> SkillA -> RELATED_TO -> SkillB <- HAS_SKILL <- Partner
MATCH (me:User {userId: 'usr-kavya'})-[:WANTS_TO_LEARN]->(targetSkill:Skill)-[:RELATED_TO*1..2]-(relatedSkill:Skill)<-[th:HAS_SKILL]-(partner:User)
WHERE me <> partner 
  AND NOT (me)-[:WANTS_TO_LEARN]->(relatedSkill)
  AND NOT (me)-[:HAS_SKILL]->(relatedSkill)
RETURN partner.name AS recommendedTeacher,
       targetSkill.name AS yourGoal,
       relatedSkill.name AS relatedSkillTaught,
       th.proficiency AS proficiency;`,
    explanation: 'Discovers indirect learning opportunities by following :RELATED_TO edges to find teachers with complementary domains.'
  },
  {
    id: 'query-4',
    title: 'Query 4 – Variable-Depth Prerequisite Chain',
    category: 'Variable Depth Traversal',
    input: 'Angular',
    cypher: `// Traverses prerequisite chain up to 4 hops deep
MATCH path = (s:Skill {name: 'Angular'})-[:REQUIRES*1..4]->(prereq:Skill)
RETURN s.name AS targetSkill,
       [node IN nodes(path) | node.name] AS learningSequence,
       length(path) AS prerequisiteDepth,
       prereq.name AS foundationSkill;`,
    explanation: 'Recursively walks :REQUIRES relationships without recursive SQL joins or fixed iteration limits.'
  }
];

export default function CypherPlaygroundPage() {
  const { currentUser } = useAuth();
  const [selectedQueryId, setSelectedQueryId] = useState('query-2');
  const [copied, setCopied] = useState(false);

  const currentQuery = PLAYGROUND_QUERIES.find(q => q.id === selectedQueryId) || PLAYGROUND_QUERIES[0];

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold mb-2">
          <Terminal className="w-3.5 h-3.5" />
          <span>openCypher Live Query Workbench</span>
        </div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">openCypher & Graph Architecture Hub</h1>
        <p className="text-xs text-slate-400 mt-1">
          Explore and run the openCypher queries that power SkillSwap over CognoDB Bolt protocol.
        </p>
      </div>

      {/* Query Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {PLAYGROUND_QUERIES.map((q) => {
          const isSelected = q.id === selectedQueryId;
          return (
            <button
              key={q.id}
              onClick={() => setSelectedQueryId(q.id)}
              className={`p-4 rounded-2xl border text-left transition-all ${
                isSelected
                  ? 'bg-indigo-500/20 border-indigo-500 text-white shadow-lg shadow-indigo-500/10'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <span className="text-[10px] uppercase font-bold text-indigo-400 block mb-1">{q.category}</span>
              <div className="text-xs font-bold leading-snug">{q.title.split(' – ')[1] || q.title}</div>
            </button>
          );
        })}
      </div>

      {/* Query Viewer Display */}
      <div className="rounded-3xl bg-[#0F172A] border border-slate-800 overflow-hidden shadow-2xl space-y-4 p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">{currentQuery.title}</h2>
            <p className="text-xs text-slate-400">{currentQuery.explanation}</p>
          </div>

          <button
            onClick={() => handleCopy(currentQuery.cypher)}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Cypher'}</span>
          </button>
        </div>

        {/* Code Box */}
        <div className="relative">
          <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-t border-x border-slate-800 rounded-t-2xl text-xs font-mono text-slate-400">
            <span>openCypher (Bolt Protocol)</span>
            <span className="text-indigo-400 font-semibold">Parameterised Execution</span>
          </div>
          <pre className="p-5 rounded-b-2xl bg-[#070B13] border border-slate-800 text-xs font-mono text-indigo-300 overflow-x-auto leading-relaxed shadow-inner">
            {currentQuery.cypher}
          </pre>
        </div>
      </div>

      {/* Comprehensive Why Graph Database Section */}
      <div className="rounded-3xl bg-gradient-to-br from-indigo-950/30 to-slate-900 border border-indigo-500/30 p-6 space-y-4 shadow-xl">
        <div className="flex items-center space-x-2 text-sm font-bold text-white">
          <Zap className="w-4 h-4 text-amber-400" />
          <span>Why SkillSwap Genuinely Requires a Graph Database (Wexa Submission Summary)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
            <h4 className="font-bold text-rose-400 uppercase tracking-wider text-[11px]">Relational (SQL) Limitations:</h4>
            <p className="text-slate-300 leading-relaxed">
              Finding reciprocal 2-way skill matches in a relational database requires joining across at least 4 to 6 junction tables (<code className="text-rose-300">users</code>, <code className="text-rose-300">user_skills_taught</code>, <code className="text-rose-300">user_skills_wanted</code>, <code className="text-rose-300">skills</code>) with self-joins. As the user base grows, nested SQL joins degrade exponentially.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
            <h4 className="font-bold text-emerald-400 uppercase tracking-wider text-[11px]">CognoDB Graph Advantages:</h4>
            <p className="text-slate-300 leading-relaxed">
              CognoDB provides <strong>Index-Free Adjacency</strong> where each node directly references its connected nodes via memory pointers. Traversing relationships is constant-time <code className="text-emerald-300">O(1)</code> per hop, and multi-hop paths (<code className="text-emerald-300">:RELATED_TO*1..2</code>) are natively expressed without recursive CTE overhead.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
