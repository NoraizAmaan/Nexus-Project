import React, { useEffect, useState, useRef, useCallback } from 'react';
import ForceGraph3D from 'react-force-graph-3d';
import api from '../services/api';

// Professional enterprise colors
const COLORS = {
  project: '#0f766e', // Teal 700
  user: '#1d4ed8',    // Blue 700
  external: '#b45309' // Amber 700
};

export default function OrganizationGraph3D() {
  const [data, setData] = useState({ nodes: [], links: [] });
  const [loading, setLoading] = useState(true);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  
  const [selectedNode, setSelectedNode] = useState(null);
  const [highlightNodes, setHighlightNodes] = useState(new Set());
  const [highlightLinks, setHighlightLinks] = useState(new Set());

  const containerRef = useRef();
  const fgRef = useRef();

  useEffect(() => {
    const fetchGraphData = async () => {
      try {
        const response = await api.get('/users/graph');
        // Map data to use professional colors
        const mappedData = {
          nodes: response.data.nodes.map(n => ({ ...n, color: COLORS[n.group] || COLORS.user })),
          links: response.data.links
        };
        setData(mappedData);
      } catch (error) {
        console.error("Failed to fetch graph data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGraphData();
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      setDimensions({
        width: containerRef.current.clientWidth,
        height: containerRef.current.clientHeight
      });
      
      const handleResize = () => {
        if (containerRef.current) {
           setDimensions({
              width: containerRef.current.clientWidth,
              height: containerRef.current.clientHeight
           });
        }
      };
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [loading]);

  useEffect(() => {
    if (fgRef.current && !loading) {
      fgRef.current.d3Force('charge').strength(-300);
      fgRef.current.d3Force('link').distance(120);
    }
  }, [data, loading]);

  const handleClick = useCallback(node => {
    if (!node) {
      // Reset if clicked outside (though ForceGraph handles background click separately, 
      // we'll handle clear via the side panel X button)
      return;
    }

    setSelectedNode(node);

    // Calculate connections
    const newHighlightNodes = new Set();
    const newHighlightLinks = new Set();

    newHighlightNodes.add(node);
    data.links.forEach(link => {
      // ForceGraph mutates links to be objects, so we check id
      const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
      const targetId = typeof link.target === 'object' ? link.target.id : link.target;
      
      if (sourceId === node.id || targetId === node.id) {
        newHighlightLinks.add(link);
        newHighlightNodes.add(link.source);
        newHighlightNodes.add(link.target);
      }
    });

    setHighlightNodes(newHighlightNodes);
    setHighlightLinks(newHighlightLinks);

  }, [data]);

  const handleClearSelection = () => {
    setSelectedNode(null);
    setHighlightNodes(new Set());
    setHighlightLinks(new Set());
  };

  if (loading) {
    return <div className="flex justify-center items-center h-[600px] dark:text-white font-semibold">Loading 3D Graph...</div>;
  }

  return (
    <div ref={containerRef} className="w-full h-[600px] rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 flex justify-center items-center relative">
      
      <div className="absolute top-4 left-4 bg-white/90 dark:bg-slate-800/90 p-4 rounded-xl border border-gray-200 dark:border-slate-600 backdrop-blur-md z-10 pointer-events-none shadow-lg">
        <h3 className="text-gray-800 dark:text-white font-bold text-sm mb-3 uppercase tracking-wider">Network Legend</h3>
        
        <div className="flex items-center gap-3 mb-2">
          <span className="w-4 h-4 rounded-full" style={{ backgroundColor: COLORS.project }}></span>
          <span className="text-gray-600 dark:text-slate-200 text-sm font-medium">Projects (Hubs)</span>
        </div>
        
        <div className="flex items-center gap-3 mb-2">
          <span className="w-4 h-4 rounded-full" style={{ backgroundColor: COLORS.user }}></span>
          <span className="text-gray-600 dark:text-slate-200 text-sm font-medium">Internal Members</span>
        </div>
        
        <div className="flex items-center gap-3 mb-4">
          <span className="w-4 h-4 rounded-full" style={{ backgroundColor: COLORS.external }}></span>
          <span className="text-gray-600 dark:text-slate-200 text-sm font-medium">External / Guests</span>
        </div>
        
        <div className="text-gray-500 dark:text-slate-400 text-xs border-t border-gray-200 dark:border-slate-600 pt-3 leading-relaxed">
          <p>🖱️ <b>Scroll</b> to zoom</p>
          <p>👆 <b>Drag</b> to rotate</p>
          <p>🎯 <b>Click</b> node to highlight</p>
        </div>
      </div>

      {selectedNode && (
        <div className="absolute top-4 right-4 bg-white dark:bg-slate-800 p-5 rounded-xl border border-gray-200 dark:border-slate-600 shadow-2xl z-20 w-72 transition-all">
          <div className="flex justify-between items-start mb-4">
             <h3 className="text-gray-900 dark:text-white font-bold text-lg leading-tight">{selectedNode.name}</h3>
             <button 
               onClick={handleClearSelection} 
               className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
             >
               ✕
             </button>
          </div>
          <div className="space-y-4">
             <div>
               <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold mb-1">Entity Type</p>
               <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300 capitalize">
                 {selectedNode.group}
               </span>
             </div>
             <div>
               <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold mb-1">Direct Connections</p>
               <p className="text-2xl font-light text-gray-800 dark:text-gray-200">
                  {highlightLinks.size}
               </p>
             </div>
          </div>
        </div>
      )}

      <ForceGraph3D
        ref={fgRef}
        width={dimensions.width}
        height={dimensions.height}
        graphData={data}
        nodeLabel="name"
        nodeColor={node => highlightNodes.size === 0 || highlightNodes.has(node) ? node.color : 'rgba(150, 150, 150, 0.1)'}
        nodeOpacity={1}
        nodeResolution={24}
        linkWidth={link => highlightLinks.size === 0 ? 1.5 : highlightLinks.has(link) ? 3 : 0.5}
        linkColor={link => highlightLinks.size === 0 ? 'rgba(150, 150, 150, 0.4)' : highlightLinks.has(link) ? '#4ade80' : 'rgba(150, 150, 150, 0.05)'}
        linkDirectionalParticles={link => highlightLinks.size === 0 ? 2 : highlightLinks.has(link) ? 4 : 0}
        linkDirectionalParticleWidth={link => highlightLinks.size === 0 ? 1.5 : 3}
        linkDirectionalParticleSpeed={link => highlightLinks.size === 0 ? 0.005 : 0.01}
        onNodeClick={handleClick}
        onBackgroundClick={handleClearSelection}
        backgroundColor="rgba(0,0,0,0)"
      />
    </div>
  );
}
