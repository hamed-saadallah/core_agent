import React from 'react';
import { ChainNode, Agent } from '@/types';

interface ChainNodeListProps {
  nodes: ChainNode[];
  agents: Agent[];
  onRemoveNode: (nodeId: string) => void;
}

export const ChainNodeList: React.FC<ChainNodeListProps> = ({ nodes, agents, onRemoveNode }) => {
  const getAgentName = (agentId: string) => {
    return agents.find((a) => a.id === agentId)?.name || 'Unknown Agent';
  };

  const sortedNodes = [...nodes].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-3">
      {sortedNodes.map((node, index) => (
        <div key={node.id} className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
            {index + 1}
          </div>

          <div className="flex-grow">
            <h4 className="font-semibold text-gray-900">{getAgentName(node.agentId)}</h4>
            <p className="text-xs text-gray-600 mt-1">Agent ID: {node.agentId}</p>

            {node.nodeConfig && Object.keys(node.nodeConfig).length > 0 && (
              <div className="mt-2 p-2 bg-white rounded border border-gray-200">
                <p className="text-xs font-medium text-gray-700 mb-1">Configuration:</p>
                <pre className="text-xs text-gray-600 overflow-auto max-h-24">{JSON.stringify(node.nodeConfig, null, 2)}</pre>
              </div>
            )}
          </div>

          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to remove this node?')) {
                onRemoveNode(node.id);
              }
            }}
            className="flex-shrink-0 px-3 py-2 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200 transition"
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
};
