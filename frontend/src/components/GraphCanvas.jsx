import React, { useRef, useEffect, useState, useCallback } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Search, 
  Filter, 
  Sparkles,
  Layers,
  Code,
  User
} from 'lucide-react';

const NODE_COLORS = {
  User: { bg: '#6366F1', border: '#818CF8', text: '#FFFFFF', icon: '👤', radius: 26 },
  Skill: { bg: '#0EA5E9', border: '#38BDF8', text: '#FFFFFF', icon: '💡', radius: 22 },
  Category: { bg: '#10B981', border: '#34D399', text: '#FFFFFF', icon: '📂', radius: 28 }
};

export default function GraphCanvas({ 
  graphData, 
  onSelectNode, 
  selectedNodeId, 
  activeUserId = 'usr-kavya',
  highlightedPath = [] 
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  // Viewport transforms
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 0.85 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [draggedNode, setDraggedNode] = useState(null);
  const [hoveredNode, setHoveredNode] = useState(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTypeFilters, setActiveTypeFilters] = useState({
    User: true,
    Skill: true,
    Category: true
  });

  const nodesRef = useRef([]);
  const edgesRef = useRef([]);

  // Initialize node layout
  useEffect(() => {
    if (!graphData || !graphData.nodes) return;

    const width = containerRef.current?.clientWidth || 900;
    const height = containerRef.current?.clientHeight || 600;

    const initialNodes = graphData.nodes.map((node, index) => {
      const existing = nodesRef.current.find(n => n.id === node.id);
      if (existing) {
        return { ...node, x: existing.x, y: existing.y, vx: 0, vy: 0 };
      }

      // Orbital layout by type
      let angle = (index / graphData.nodes.length) * 2 * Math.PI;
      let radius = 220;

      if (node.type === 'Category') {
        radius = 360;
        angle = (index % 8) * (Math.PI / 4);
      } else if (node.type === 'User') {
        if (node.id === activeUserId) {
          return {
            ...node,
            x: width / 2,
            y: height / 2,
            radius: 32,
            isCenter: true
          };
        }
        radius = 300;
        angle = (index % 12) * (Math.PI / 6);
      } else if (node.type === 'Skill') {
        radius = 160 + (index % 3) * 50;
      }

      const cfg = NODE_COLORS[node.type] || NODE_COLORS.Skill;

      return {
        ...node,
        x: width / 2 + Math.cos(angle) * radius + (Math.random() - 0.5) * 30,
        y: height / 2 + Math.sin(angle) * radius + (Math.random() - 0.5) * 30,
        radius: cfg.radius || 22
      };
    });

    nodesRef.current = initialNodes;
    edgesRef.current = graphData.edges || [];

    setTransform({
      x: width / 2 - (width * 0.85) / 2,
      y: height / 2 - (height * 0.85) / 2,
      scale: 0.85
    });
  }, [graphData, activeUserId]);

  // Main Render Function
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    ctx.save();
    ctx.translate(transform.x, transform.y);
    ctx.scale(transform.scale, transform.scale);

    const visibleNodes = nodesRef.current.filter(n => activeTypeFilters[n.type] !== false);
    const visibleNodeIds = new Set(visibleNodes.map(n => n.id));

    // 1. Draw Graph Edges
    edgesRef.current.forEach(edge => {
      if (!visibleNodeIds.has(edge.source) || !visibleNodeIds.has(edge.target)) return;

      const sourceNode = nodesRef.current.find(n => n.id === edge.source);
      const targetNode = nodesRef.current.find(n => n.id === edge.target);
      if (!sourceNode || !targetNode) return;

      const isPathHighlighted = highlightedPath.length > 0 && 
        (highlightedPath.includes(sourceNode.label) && highlightedPath.includes(targetNode.label));

      const isNodeSelected = selectedNodeId && (selectedNodeId === sourceNode.id || selectedNodeId === targetNode.id);
      const isConnectedToActiveUser = sourceNode.id === activeUserId || targetNode.id === activeUserId;

      ctx.beginPath();
      ctx.moveTo(sourceNode.x, sourceNode.y);
      ctx.lineTo(targetNode.x, targetNode.y);

      if (isPathHighlighted) {
        ctx.strokeStyle = '#FBBF24';
        ctx.lineWidth = 3.5;
      } else if (isNodeSelected) {
        ctx.strokeStyle = '#6366F1';
        ctx.lineWidth = 2.5;
      } else if (edge.type === 'HAS_SKILL') {
        ctx.strokeStyle = isConnectedToActiveUser ? 'rgba(16, 185, 129, 0.7)' : 'rgba(16, 185, 129, 0.3)';
        ctx.lineWidth = isConnectedToActiveUser ? 2 : 1;
      } else if (edge.type === 'WANTS_TO_LEARN') {
        ctx.strokeStyle = isConnectedToActiveUser ? 'rgba(99, 102, 241, 0.7)' : 'rgba(99, 102, 241, 0.3)';
        ctx.lineWidth = isConnectedToActiveUser ? 2 : 1;
      } else if (edge.type === 'REQUIRES') {
        ctx.strokeStyle = 'rgba(244, 63, 94, 0.5)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
      } else {
        ctx.strokeStyle = 'rgba(71, 85, 105, 0.35)';
        ctx.lineWidth = 1;
      }
      ctx.stroke();
      ctx.setLineDash([]);

      // Relationship label at midpoint
      if (transform.scale > 0.7) {
        const midX = (sourceNode.x + targetNode.x) / 2;
        const midY = (sourceNode.y + targetNode.y) / 2;
        ctx.font = '9px "JetBrains Mono", monospace';
        ctx.fillStyle = edge.type === 'HAS_SKILL' ? '#6EE7B7' : edge.type === 'WANTS_TO_LEARN' ? '#A5B4FC' : 'rgba(148, 163, 184, 0.6)';
        ctx.textAlign = 'center';
        ctx.fillText(edge.label || edge.type, midX, midY - 3);
      }

      // Arrow head
      const angle = Math.atan2(targetNode.y - sourceNode.y, targetNode.x - sourceNode.x);
      const targetRadius = targetNode.radius || 22;
      const arrowX = targetNode.x - Math.cos(angle) * (targetRadius + 5);
      const arrowY = targetNode.y - Math.sin(angle) * (targetRadius + 5);

      ctx.beginPath();
      ctx.moveTo(arrowX, arrowY);
      ctx.lineTo(arrowX - 7 * Math.cos(angle - Math.PI / 6), arrowY - 7 * Math.sin(angle - Math.PI / 6));
      ctx.lineTo(arrowX - 7 * Math.cos(angle + Math.PI / 6), arrowY - 7 * Math.sin(angle + Math.PI / 6));
      ctx.closePath();
      ctx.fillStyle = isPathHighlighted ? '#FBBF24' : isNodeSelected ? '#6366F1' : 'rgba(100, 116, 139, 0.5)';
      ctx.fill();
    });

    // 2. Draw Nodes
    visibleNodes.forEach(node => {
      const isSelected = selectedNodeId === node.id;
      const isHovered = hoveredNode?.id === node.id;
      const isPathHighlighted = highlightedPath.length > 0 && highlightedPath.includes(node.label);
      const isSearchMatched = searchQuery && node.label.toLowerCase().includes(searchQuery.toLowerCase());
      const isActiveUser = node.id === activeUserId;

      const cfg = NODE_COLORS[node.type] || NODE_COLORS.Skill;
      const radius = (node.radius || 22) * (isSelected || isHovered ? 1.2 : 1);

      // Glow effect for active user / selected node / search match
      if (isActiveUser || isSelected || isPathHighlighted || isSearchMatched) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius + 12, 0, 2 * Math.PI);
        ctx.fillStyle = isActiveUser 
          ? 'rgba(99, 102, 241, 0.4)' 
          : isPathHighlighted 
          ? 'rgba(251, 191, 36, 0.4)' 
          : 'rgba(56, 189, 248, 0.35)';
        ctx.fill();
        ctx.restore();
      }

      // Outer ring for Users
      if (node.type === 'User') {
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius + 3, 0, 2 * Math.PI);
        ctx.strokeStyle = isActiveUser ? '#6366F1' : '#38BDF8';
        ctx.lineWidth = isActiveUser ? 3 : 1.5;
        ctx.stroke();
      }

      // Main Node Body
      ctx.beginPath();
      ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);
      ctx.fillStyle = isSearchMatched ? '#F59E0B' : isActiveUser ? '#4F46E5' : cfg.bg;
      ctx.fill();
      ctx.strokeStyle = isSelected ? '#FFFFFF' : isPathHighlighted ? '#FCD34D' : cfg.border;
      ctx.lineWidth = isSelected ? 3 : 1.5;
      ctx.stroke();

      // Node Icon
      ctx.font = `${Math.round(radius * 0.9)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node.avatar || node.icon || cfg.icon, node.x, node.y + 1);

      // Node Label
      ctx.font = '600 11px Inter, sans-serif';
      ctx.fillStyle = isActiveUser ? '#A5B4FC' : isSelected ? '#38BDF8' : '#E2E8F0';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';

      const maxLen = 16;
      const displayLabel = node.label.length > maxLen ? node.label.slice(0, maxLen - 2) + '…' : node.label;
      ctx.fillText(displayLabel, node.x, node.y + radius + 5);

      // Type Badge
      if (transform.scale > 0.65) {
        ctx.font = '500 9px "JetBrains Mono", monospace';
        ctx.fillStyle = '#94A3B8';
        ctx.fillText(node.type.toUpperCase(), node.x, node.y + radius + 19);
      }
    });

    ctx.restore();
  }, [transform, activeTypeFilters, selectedNodeId, hoveredNode, highlightedPath, searchQuery, activeUserId]);

  // Resize listener
  useEffect(() => {
    const handleResize = () => {
      if (!canvasRef.current || !containerRef.current) return;
      canvasRef.current.width = containerRef.current.clientWidth;
      canvasRef.current.height = containerRef.current.clientHeight;
      render();
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [render]);

  useEffect(() => {
    render();
  }, [render, transform, activeTypeFilters, selectedNodeId, hoveredNode, highlightedPath]);

  // Canvas coordinate conversion
  const getCanvasCoords = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    return {
      x: (clientX - transform.x) / transform.scale,
      y: (clientY - transform.y) / transform.scale,
      rawX: clientX,
      rawY: clientY
    };
  };

  const findNodeAt = (worldX, worldY) => {
    for (let i = nodesRef.current.length - 1; i >= 0; i--) {
      const node = nodesRef.current[i];
      if (activeTypeFilters[node.type] === false) continue;
      const dist = Math.hypot(node.x - worldX, node.y - worldY);
      if (dist <= (node.radius || 22) + 6) {
        return node;
      }
    }
    return null;
  };

  const handleMouseDown = (e) => {
    const coords = getCanvasCoords(e);
    const node = findNodeAt(coords.x, coords.y);

    if (node) {
      setDraggedNode(node);
      if (onSelectNode) onSelectNode(node);
    } else {
      setIsDragging(true);
      setDragStart({ x: coords.rawX - transform.x, y: coords.rawY - transform.y });
    }
  };

  const handleMouseMove = (e) => {
    const coords = getCanvasCoords(e);

    if (draggedNode) {
      draggedNode.x = coords.x;
      draggedNode.y = coords.y;
      render();
    } else if (isDragging) {
      setTransform(prev => ({
        ...prev,
        x: coords.rawX - dragStart.x,
        y: coords.rawY - dragStart.y
      }));
    } else {
      const node = findNodeAt(coords.x, coords.y);
      setHoveredNode(node);
      if (canvasRef.current) {
        canvasRef.current.style.cursor = node ? 'pointer' : 'grab';
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDraggedNode(null);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
    const coords = getCanvasCoords(e);

    setTransform(prev => {
      const newScale = Math.min(Math.max(prev.scale * zoomFactor, 0.3), 3.0);
      return {
        scale: newScale,
        x: coords.rawX - coords.x * newScale,
        y: coords.rawY - coords.y * newScale
      };
    });
  };

  const handleZoom = (direction) => {
    const factor = direction === 'in' ? 1.25 : 0.8;
    const width = containerRef.current?.clientWidth || 800;
    const height = containerRef.current?.clientHeight || 600;

    setTransform(prev => {
      const newScale = Math.min(Math.max(prev.scale * factor, 0.3), 3.0);
      return {
        scale: newScale,
        x: width / 2 - (width / 2 - prev.x) * factor,
        y: height / 2 - (height / 2 - prev.y) * factor
      };
    });
  };

  const handleResetView = () => {
    const width = containerRef.current?.clientWidth || 800;
    const height = containerRef.current?.clientHeight || 600;
    setTransform({
      x: width / 2 - (width * 0.85) / 2,
      y: height / 2 - (height * 0.85) / 2,
      scale: 0.85
    });
  };

  const toggleTypeFilter = (type) => {
    setActiveTypeFilters(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  return (
    <div ref={containerRef} className="relative w-full h-full bg-[#0A0F1D] bg-grid-pattern select-none overflow-hidden rounded-2xl border border-slate-800">
      {/* Top Controls Toolbar */}
      <div className="absolute top-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Node Filters */}
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-xl bg-slate-900/90 border border-slate-800 backdrop-blur-md pointer-events-auto shadow-lg">
          {Object.entries(NODE_COLORS).map(([type, cfg]) => {
            const isActive = activeTypeFilters[type] !== false;
            return (
              <button
                key={type}
                onClick={() => toggleTypeFilter(type)}
                className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
                    : 'text-slate-500 hover:text-slate-400 opacity-50'
                }`}
              >
                <span>{cfg.icon}</span>
                <span>{type}s</span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative pointer-events-auto">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search node on canvas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-200 placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500 backdrop-blur-md w-60 shadow-lg"
          />
        </div>
      </div>

      {/* HTML5 Canvas */}
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      />

      {/* Zoom / Pan Controls */}
      <div className="absolute bottom-4 right-4 z-10 flex items-center space-x-1.5 p-1.5 rounded-xl bg-slate-900/90 border border-slate-800 backdrop-blur-md shadow-lg">
        <button
          onClick={() => handleZoom('in')}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleZoom('out')}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <div className="w-[1px] h-4 bg-slate-700 mx-1"></div>
        <button
          onClick={handleResetView}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Reset View"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Bottom Node Stats Pill */}
      <div className="absolute bottom-4 left-4 z-10 flex items-center space-x-3 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400 backdrop-blur-md">
        <div className="flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
          <span>{graphData?.nodes?.length || 0} Graph Nodes</span>
        </div>
        <div className="w-1 h-1 rounded-full bg-slate-700"></div>
        <div className="flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>{graphData?.edges?.length || 0} Relationships</span>
        </div>
      </div>
    </div>
  );
}
