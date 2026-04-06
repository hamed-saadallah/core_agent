import { create } from 'zustand';
import { Agent, Tool, AgentRun, Model } from '@/types';

interface User {
  id: string;
  email: string;
  profile?: {
    firstName?: string;
    lastName?: string;
    avatarUrl?: string;
  };
  isEmailVerified?: boolean;
}

interface AppStore {
  // Auth
  currentUser: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isEmailVerified: boolean;

  // Agents
  agents: Agent[];
  models: Model[];
  tools: Tool[];
  runs: AgentRun[];
  selectedAgent: Agent | null;
  loading: boolean;
  error: string | null;
  executingAgent: Agent | null;
  isExecuteModalOpen: boolean;

  // Auth setters
  setCurrentUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setIsEmailVerified: (verified: boolean) => void;
  logout: () => void;

  // Agents setters
  setAgents: (agents: Agent[]) => void;
  setModels: (models: Model[]) => void;
  setTools: (tools: Tool[]) => void;
  setRuns: (runs: AgentRun[]) => void;
  setSelectedAgent: (agent: Agent | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setExecutingAgent: (agent: Agent | null) => void;
  setIsExecuteModalOpen: (isOpen: boolean) => void;
  addAgent: (agent: Agent) => void;
  removeAgent: (id: string) => void;
  updateAgent: (agent: Agent) => void;
  addModel: (model: Model) => void;
  removeModel: (id: string) => void;
  updateModel: (model: Model) => void;
}

export const useStore = create<AppStore>((set) => ({
  // Auth state
  currentUser: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '') : null,
  token: localStorage.getItem('auth_token'),
  isAuthenticated: !!localStorage.getItem('auth_token'),
  isEmailVerified: false,

  // Agents state
  agents: [],
  models: [],
  tools: [],
  runs: [],
  selectedAgent: null,
  loading: false,
  error: null,
  executingAgent: null,
  isExecuteModalOpen: false,

  // Auth setters
  setCurrentUser: (user) => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
    set({ currentUser: user, isAuthenticated: !!user });
  },

  setToken: (token) => {
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
    set({ token, isAuthenticated: !!token });
  },

  setIsEmailVerified: (verified) => set({ isEmailVerified: verified }),

  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    set({
      currentUser: null,
      token: null,
      isAuthenticated: false,
      isEmailVerified: false,
    });
  },

  // Agents setters
  setAgents: (agents) => set({ agents }),
  setModels: (models) => set({ models }),
  setTools: (tools) => set({ tools }),
  setRuns: (runs) => set({ runs }),
  setSelectedAgent: (selectedAgent) => set({ selectedAgent }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setExecutingAgent: (executingAgent) => set({ executingAgent }),
  setIsExecuteModalOpen: (isExecuteModalOpen) => set({ isExecuteModalOpen }),
  addAgent: (agent) => set((state) => ({ agents: [...state.agents, agent] })),
  removeAgent: (id) => set((state) => ({ agents: state.agents.filter((a) => a.id !== id) })),
  updateAgent: (agent) =>
    set((state) => ({
      agents: state.agents.map((a) => (a.id === agent.id ? agent : a)),
    })),
  addModel: (model) => set((state) => ({ models: [...state.models, model] })),
  removeModel: (id) => set((state) => ({ models: state.models.filter((m) => m.id !== id) })),
  updateModel: (model) =>
    set((state) => ({
      models: state.models.map((m) => (m.id === model.id ? model : m)),
    })),
}));

// Export alias for backward compatibility
export const useAppStore = useStore;
