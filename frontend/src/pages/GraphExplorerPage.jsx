import React, { useState, useEffect } from 'react';
import { 
  Network, 
  Search, 
  Route, 
  Zap, 
  Layers, 
  ArrowRight,
  Info,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import GraphCanvas from '../components/GraphCanvas';
import NodeDetailDrawer from '../components/NodeDetailDrawer';

export default function GraphExplorerPage({ setActiveTab, onOpenCypherModal }) {
  const { currentUser } = useAuth();
  const [graphData, setGraphData] = useState({ nodes: [], edges: [] });
  const [selectedNode, setSelectedNode] = useState(null);
  const [loading, setLoading] = useState(true);

  // Pathfinding state
  const [sourceName, setSourceName] = useState('Kavya Nair');
  const [targetName, setTargetName] = useState('Python');
  const [pathResult, setPathResult] = useState(null);
  const [isFindingPath, setIsFindingPath] = useState(false);

  useEffect(() => {
    const loadGraph = async () => {
      try {
        setLoading(true);
        const res = await api.getGraph();
        if (res.success) setGraphData(res.data);
      } catch (err) {
        console.error('Error loading graph canvas:', err);
      } finally {
        setLoading(false);
      }
    };
    loadGraph();
  }, []);

  const handleFindPath = async (e) => {
    if (e) e.preventDefault();
    if (!sourceName || !targetName) return;

    try {
      setIsFindingPath(true);
      const res = await api.findPath(sourceName, targetName);
      if (res.success) setPathResult(res.data);
    } catch (err) {
      alert(err.message);
    } finally {
      setIsFindingPath(false);
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col p-6 space-y-4 animate-fadeIn">
      {/* Top Bar with Pathfinding Controls */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 p-4 rounded-2xl bg-[#0F172A] border border-slate-800 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
            <Network className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-tight">Interactive Graph Canvas</h1>
            <p className="text-xs text-slate-400">Explore peer nodes, skill relationships, and multi-hop paths</p>
          </div>
        </div>

        {/* Pathfinding Form */}
        <form onSubmit={handleFindPath} className="flex flex-wrap items-center gap-2">
          <div className="flex items-center space-x-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-400">From:</span>
            <input
              type="text"
              value={sourceName}
              onChange={(e) => setSourceName(e.target.value)}
              placeholder="e.g. Kavya Nair"
              className="bg-transparent text-slate-200 placeholder-slate-500 focus:outline-none w-28"
            />
          </div>

          <ArrowRight className="w-4 h-4 text-slate-600 hidden sm:block" />

          <div className="flex items-center space-x-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-400">To:</span>
            <input
              type="text"
              value={targetName}
              onChange={(e) => setTargetName(e.target.value)}
              placeholder="e.g. Python"
              className="bg-transparent text-slate-200 placeholder-slate-500 focus:outline-none w-28"
            />
          </div>

          <button
            type="submit"
            disabled={isFindingPath}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 transition-all"
          >
            <Route className="w-3.5 h-3.5" />
            <span>{isFindingPath ? 'Searching...' : 'Find Path'}</span>
          </button>

          {pathResult && (
            <button
              type="button"
              onClick={() => setPathResult(null)}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white text-xs font-medium"
            >
              Clear
            </button>
          )}
        </form>
      </div>

      {/* Path Result Banner if calculated */}
      {pathResult && pathResult.found && (
        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs text-amber-200 animate-fadeIn">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>Shortest Path Found ({pathResult.hopCount} Hops):</strong>{' '}
              {pathResult.path.map((nodeName, idx) => (
                <span key={idx} className="font-semibold text-white">
                  {nodeName}
                  {idx < pathResult.path.length - 1 && ' ➔ '}
                </span>
              ))}
            </span>
          </div>

          <button
            onClick={onOpenCypherModal}
            className="text-[11px] text-amber-400 underline hover:text-amber-300 font-mono"
          >
            View Cypher
          </button>
        </div>
      )}

      {/* Main Graph Canvas */}
      <div className="flex-1 relative overflow-hidden rounded-3xl border border-slate-800 shadow-2xl">
        <GraphCanvas
          graphData={graphData}
          onSelectNode={(n) => setSelectedNode(n)}
          selectedNodeId={selectedNode?.id}
          activeUserId={currentUser?.userId}
          highlightedPath={pathResult?.path || []}
        />
      </div>

      {/* Slide-over Node Inspector */}
      {selectedNode && (
        <NodeDetailDrawer
          node={selectedNode}
          onClose={() => setSelectedNode(null)}
          onFindMatchesForUser={(uid) => {
            setActiveTab('matches');
          }}
          onFindPathFrom={(name) => {
            setSourceName(name);
          }}
        />
      )}
    </div>
  );
}
