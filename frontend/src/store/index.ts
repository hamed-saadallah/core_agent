import { create } from 'zustand';
import { Agent, Tool, AgentRun } from '@/types';

interface AppStore {
  agents: Agent[];
  tools: Tool[];
  runs: AgentRun[];
  selectedAgent: Agent | null;
  loading: boolean;
  error: string | null;

  setAgents: (agents: Agent[]) => void;
  setTools: (tools: Tool[]) => void;
  setRuns: (runs: AgentRun[]) => void;
  setSelectedAgent: (agent: Agent | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  addAgent: (agent: Agent) => void;
  removeAgent: (id: string) => void;
  updateAgent: (agent: Agent) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  agents: [],
  tools: [],
  runs: [],
  selectedAgent: null,
  loading: false,
  error: null,

  setAgents: (agents) => set({ agents }),
  setTools: (tools) => set({ tools }),
  setRuns: (runs) => set({ runs }),
  setSelectedAgent: (selectedAgent) => set({ selectedAgent }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  addAgent: (agent) => set((state) => ({ agents: [...state.agents, agent] })),
  removeAgent: (id) => set((state) => ({ agents: state.agents.filter((a) => a.id !== id) })),
  updateAgent: (agent) =>
    set((state) => ({
      agents: state.agents.map((a) => (a.id === agent.id ? agent : a)),
    })),
}));
