import React, { useEffect, useState } from 'react';
import { FiTrash2 } from 'react-icons/fi';
import { Agent } from '@/types';
import { agentsApi } from '@/api/agents';
import { agentRunsApi, ChatMessage } from '@/api/agent-runs';
import { AgentSelector } from '@/components/TryAgent/AgentSelector';
import { ChatMessageComponent } from '@/components/TryAgent/ChatMessage';
import { ChatInput } from '@/components/TryAgent/ChatInput';

export const TryAgentPage: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [conversationHistory, setConversationHistory] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [agentsLoading, setAgentsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        setAgentsLoading(true);
        setError(null);
        const { agents } = await agentsApi.getAll(0, 100);
        setAgents(agents);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load agents');
      } finally {
        setAgentsLoading(false);
      }
    };

    fetchAgents();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversationHistory]);

  const handleSelectAgent = (agentId: string) => {
    setSelectedAgentId(agentId);
    setConversationHistory([]);
    setError(null);
  };

  const handleSendMessage = async (message: string) => {
    if (!selectedAgentId) {
      setError('Please select an agent first');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const result = await agentRunsApi.chat(selectedAgentId, message, conversationHistory);
      setConversationHistory(result.conversationHistory);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
      setError(errorMessage);
      console.error('Chat error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClearConversation = () => {
    setConversationHistory([]);
    setError(null);
  };

  return (
    <div className="bg-gray-50 flex flex-col">
      <div className="max-w-4xl mx-auto w-full p-4 sm:p-6 flex-1 flex flex-col">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Try Agent</h1>
          <p className="text-sm sm:text-base text-gray-600">
            Chat with your agents to test and improve their quality through interactive feedback
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:gap-6 flex-1 min-h-0">
          {/* Agent Selector */}
          <div>
            <AgentSelector
              agents={agents}
              selectedAgentId={selectedAgentId}
              onSelectAgent={handleSelectAgent}
              isLoading={agentsLoading}
            />
          </div>

          {/* Chat Area */}
          <div className="flex flex-col min-h-0 flex-1">
            <div className="bg-white rounded-lg shadow flex flex-col min-h-[60vh] flex-1 min-h-0">
              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto p-3 sm:p-4 bg-white">
                {conversationHistory.length === 0 && !selectedAgentId && (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <p className="text-center text-sm sm:text-base">Select an agent to start chatting</p>
                  </div>
                )}

                {selectedAgentId && conversationHistory.length === 0 && (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <p className="text-center text-sm sm:text-base">Send a message to start the conversation</p>
                  </div>
                )}

                {conversationHistory.length > 0 && (
                  <div>
                    {conversationHistory.map((msg, idx) => (
                      <ChatMessageComponent key={idx} message={msg} />
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                )}

                {error && (
                  <div className="mt-4 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-xs sm:text-sm text-red-700">{error}</p>
                  </div>
                )}

                {loading && (
                  <div className="flex items-center justify-center p-4">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons and Input */}
              <div className="border-t border-gray-200 bg-gray-50 p-2 sm:p-3 flex justify-between items-center">
                {conversationHistory.length > 0 && (
                  <button
                    onClick={handleClearConversation}
                    disabled={loading}
                    className="flex items-center gap-2 px-3 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-200 rounded-lg disabled:text-gray-400 transition-colors"
                  >
                    <FiTrash2 size={16} />
                    <span className="hidden sm:inline">Clear</span>
                  </button>
                )}
              </div>

              {selectedAgentId && <ChatInput onSendMessage={handleSendMessage} isLoading={loading} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
