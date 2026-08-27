import React, { useState } from 'react';
import { 
  X, 
  Terminal, 
  Copy, 
  Check, 
  Zap, 
  BookOpen, 
  Sparkles,
  ArrowRightLeft,
  Network
} from 'lucide-react';

const QUERIES = [
  {
    id: 'two-way-match',
    title: '1. Direct 2-Way Skill Swap Match (⭐ Main Query)',
    category: 'Core Matching',
    description: 'Discovers users who can teach what you want to learn AND want to learn what you can teach. Evaluated directly through bidirectional graph path traversal.',
    cypher: `// Direct 2-Way Skill-Swap Match Query (Kavya ↔ Rahul)
MATCH (me:User {userId: $userId})-[w:WANTS_TO_LEARN]->(wantedSkill:Skill)<-[th:HAS_SKILL]-(partner:User)
MATCH (partner)-[pw:WANTS_TO_LEARN]->(offeredSkill:Skill)<-[mh:HAS_SKILL]-(me)
WHERE me <> partner
RETURN partner.name AS partnerName,
       partner.experienceLevel AS partnerExperience,
       partner.rating AS partnerRating,
       collect(DISTINCT wantedSkill.name) AS skillsTheyTeach,
       collect(DISTINCT offeredSkill.name) AS skillsYouTeach;`,
    relationalSql: `-- Relational Equivalent: Requires 4 table joins with self-joins
SELECT u.name, u.experience_level, u.rating,
       s1.name AS they_teach, s2.name AS you_teach
FROM users u
JOIN user_skills_taught ust ON ust.user_id = u.id
JOIN user_skills_wanted usw_me ON usw_me.skill_id = ust.skill_id AND usw_me.user_id = 'usr-kavya'
JOIN user_skills_wanted usw ON usw.user_id = u.id
JOIN user_skills_taught ust_me ON ust_me.skill_id = usw.skill_id AND ust_me.user_id = 'usr-kavya'
JOIN skills s1 ON s1.id = ust.skill_id
JOIN skills s2 ON s2.id = usw.skill_id
WHERE u.id <> 'usr-kavya';`
  },
  {
    id: 'multi-hop',
    title: '2. Multi-Hop Related Skill Recommendations (2+ Hops)',
    category: 'Recommendations',
    description: 'Discovers indirect learning opportunities by finding mentors teaching skills RELATED_TO what the user wants to learn (e.g. Kavya wants ML -> Python -> Rahul).',
    cypher: `// 2-Hop Traversal: User -> WANTS -> SkillA -> RELATED_TO -> SkillB <- HAS_SKILL <- Partner
MATCH (me:User {userId: $userId})-[:WANTS_TO_LEARN]->(targetSkill:Skill)-[:RELATED_TO*1..2]-(relatedSkill:Skill)<-[th:HAS_SKILL]-(partner:User)
WHERE me <> partner 
  AND NOT (me)-[:WANTS_TO_LEARN]->(relatedSkill)
  AND NOT (me)-[:HAS_SKILL]->(relatedSkill)
RETURN partner.name AS recommendedTeacher,
       partner.avatar AS avatar,
       targetSkill.name AS yourGoal,
       relatedSkill.name AS relatedSkillTaught,
       th.proficiency AS proficiency;`,
    relationalSql: `-- Relational Equivalent: Requires joining across 6 junction tables
-- Plus recursive CTE for variable-depth related skill associations.
WITH RECURSIVE related_graph AS (
  SELECT from_skill_id, to_skill_id, 1 as depth
  FROM skill_relations
  WHERE from_skill_id IN (SELECT skill_id FROM user_skills_wanted WHERE user_id = 'usr-kavya')
  UNION ALL
  SELECT r.from_skill_id, r.to_skill_id, rg.depth + 1
  FROM skill_relations r
  JOIN related_graph rg ON r.from_skill_id = rg.to_skill_id
  WHERE rg.depth < 2
)
SELECT * FROM related_graph ...`
  },
  {
    id: 'prereq-chain',
    title: '3. Prerequisite Learning Path (Variable-Depth)',
    category: 'Learning Paths',
    description: 'Traverses the prerequisite graph to generate the optimal sequence of foundations needed for advanced frameworks (e.g. Angular -> TypeScript -> JavaScript).',
    cypher: `// Variable-depth prerequisite chain traversal
MATCH path = (s:Skill {name: $skillName})-[:REQUIRES*1..4]->(prereq:Skill)
RETURN s.name AS targetSkill,
       [node IN nodes(path) | node.name] AS learningSequence,
       length(path) AS prerequisiteHops,
       prereq.name AS foundationSkill;`,
    relationalSql: `-- Relational Equivalent: Heavy recursive CTE with cycle detection`
  },
  {
    id: 'shortest-path',
    title: '4. Shortest Social & Knowledge Path',
    category: 'Pathfinding',
    description: 'Finds the shortest network path between any two learners or skills across the entire community graph.',
    cypher: `// Shortest path between any two graph entities
MATCH (u1 {name: $name1}), (u2 {name: $name2}),
      p = shortestPath((u1)-[*]-(u2))
RETURN [node IN nodes(p) | {labels: labels(node), name: node.name}] AS pathNodes,
       [rel IN relationships(p) | type(rel)] AS relationshipTypes,
       length(p) AS hopCount;`,
    relationalSql: `-- Relational Equivalent: Not natively supported in standard SQL
-- Requires iterative graph BFS traversal in application code or PL/pgSQL.`
  }
];

export default function CypherViewerModal({ isOpen, onClose, initialQueryId }) {
  const [activeQueryId, setActiveQueryId] = useState(initialQueryId || 'two-way-match');
  const [showSqlComparison, setShowSqlComparison] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentQuery = QUERIES.find(q => q.id === activeQueryId) || QUERIES[0];

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-4xl bg-[#0F172A] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center space-x-2">
                <span>SkillSwap openCypher Workbench</span>
                <span className="text-[10px] uppercase px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                  Bolt Protocol 5.0+
                </span>
              </h2>
              <p className="text-xs text-slate-400">Live graph query engine powered by CognoDB</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          {/* Query Selector Sidebar */}
          <div className="w-full md:w-72 border-r border-slate-800 p-3 space-y-1.5 overflow-y-auto bg-slate-950/40">
            <span className="text-[10px] uppercase font-bold text-slate-500 px-2 block mb-1">Select Cypher Query</span>
            {QUERIES.map((q) => {
              const isSelected = q.id === activeQueryId;
              return (
                <button
                  key={q.id}
                  onClick={() => setActiveQueryId(q.id)}
                  className={`w-full text-left p-2.5 rounded-xl text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="font-semibold text-slate-200">{q.title.split('. ')[1]}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{q.category}</div>
                </button>
              );
            })}

            {/* Why Graph Box */}
            <div className="mt-4 p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400 space-y-1.5">
              <div className="flex items-center space-x-1.5 text-indigo-400 font-semibold">
                <Zap className="w-3.5 h-3.5" />
                <span>Index-Free Adjacency</span>
              </div>
              <p className="text-[10px] leading-relaxed text-slate-400">
                Traversing relationships in CognoDB is an O(1) direct memory pointer operation rather than recursive table scans.
              </p>
            </div>
          </div>

          {/* Query Code & Explanation */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white tracking-tight">{currentQuery.title}</h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowSqlComparison(!showSqlComparison)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium border transition-colors ${
                      showSqlComparison
                        ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    {showSqlComparison ? 'Hide SQL Comparison' : 'Compare vs Relational SQL'}
                  </button>
                  <button
                    onClick={() => handleCopy(currentQuery.cypher)}
                    className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied!' : 'Copy Cypher'}</span>
                  </button>
                </div>
              </div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">{currentQuery.description}</p>
            </div>

            {/* Cypher Code Box */}
            <div className="relative">
              <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900 border-t border-x border-slate-800 rounded-t-xl text-[11px] font-mono text-slate-400">
                <span>openCypher Query (Parameterised)</span>
                <span className="text-indigo-400 font-semibold">CognoDB Driver</span>
              </div>
              <pre className="p-4 rounded-b-xl bg-[#070B13] border border-slate-800 text-xs font-mono text-indigo-300 overflow-x-auto leading-relaxed shadow-inner">
                {currentQuery.cypher}
              </pre>
            </div>

            {/* Relational SQL Comparison */}
            {showSqlComparison && (
              <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/30 space-y-2 animate-fadeIn">
                <div className="flex items-center space-x-2 text-xs font-semibold text-purple-300">
                  <BookOpen className="w-4 h-4 text-purple-400" />
                  <span>Relational (SQL) Equivalent Complexity:</span>
                </div>
                <pre className="p-3 rounded-lg bg-slate-950 border border-purple-900/40 text-[11px] font-mono text-purple-200 overflow-x-auto leading-relaxed">
                  {currentQuery.relationalSql}
                </pre>
                <p className="text-[11px] text-purple-300/80 leading-relaxed">
                  <strong>Why Graph Wins:</strong> In SkillSwap, two-way matching requires joining 4 to 6 separate tables with self-joins in relational databases. In CognoDB, this is naturally expressed in 2 lines of Cypher with direct pointer traversals.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between text-xs text-slate-400">
          <span>Executed over official <code className="text-indigo-400 font-mono">neo4j-driver</code> via Bolt protocol.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
