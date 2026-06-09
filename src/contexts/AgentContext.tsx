import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { userCreatedAgents as initialAgents, UserAgent } from '@/data/sampleData';

export type VoteType = 'up' | 'down' | null;

interface AgentVotes {
  [agentId: string]: {
    upvotes: number;
    downvotes: number;
    userVote: VoteType;
  };
}

interface AgentContextType {
  agents: UserAgent[];
  addAgent: (agent: Omit<UserAgent, 'id' | 'createdAt' | 'usageCount'>) => void;
  updateAgent: (id: string, updates: Partial<UserAgent>) => void;
  updateAgentWithMinorVersion: (id: string, updates: Partial<UserAgent>) => void;
  certifyAgent: (id: string) => void;
  incrementUsage: (id: string) => void;
  votes: AgentVotes;
  voteAgent: (agentId: string, vote: VoteType) => void;
  getVotes: (agentId: string) => { upvotes: number; downvotes: number; userVote: VoteType };
  favorites: Set<string>;
  toggleFavorite: (agentId: string) => void;
  isFavorite: (agentId: string) => boolean;
}

const AgentContext = createContext<AgentContextType | undefined>(undefined);

export const AgentProvider = ({ children }: { children: ReactNode }) => {
  const [agents, setAgents] = useState<UserAgent[]>(() => {
    const stored = localStorage.getItem('userAgents');
    const parsed = stored ? JSON.parse(stored) : initialAgents;
    const list = Array.isArray(parsed) ? parsed : initialAgents;
    // Defensive: older localStorage entries may not have `version`, which is required by version bump logic.
    return (list as UserAgent[]).map((a) => ({
      ...a,
      version: typeof (a as any).version === 'string' && (a as any).version.trim().length > 0 ? (a as any).version : '0.0.1',
    }));
  });

  const [votes, setVotes] = useState<AgentVotes>(() => {
    const stored = localStorage.getItem('agentVotes');
    return stored ? JSON.parse(stored) : {};
  });

  const [favorites, setFavorites] = useState<Set<string>>(() => {
    const stored = localStorage.getItem('agentFavorites');
    return stored ? new Set(JSON.parse(stored)) : new Set();
  });

  useEffect(() => {
    localStorage.setItem('userAgents', JSON.stringify(agents));
  }, [agents]);

  useEffect(() => {
    localStorage.setItem('agentVotes', JSON.stringify(votes));
  }, [votes]);

  useEffect(() => {
    localStorage.setItem('agentFavorites', JSON.stringify([...favorites]));
  }, [favorites]);

  const addAgent = (agent: Omit<UserAgent, 'id' | 'createdAt' | 'usageCount'>) => {
    const newAgent: UserAgent = {
      ...agent,
      id: `user-agent-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      version: (agent as any).version ?? '0.0.1',
      usageCount: 0,
    };
    setAgents(prev => [...prev, newAgent]);
  };

  const updateAgent = (id: string, updates: Partial<UserAgent>) => {
    setAgents(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
  };

  // Increment minor version (0.0.X) when editing
  const normalizeVersion = (version?: string) =>
    typeof version === 'string' && version.trim().length > 0 ? version : '0.0.0';

  const incrementMinorVersion = (version?: string): string => {
    const parts = normalizeVersion(version).split('.').map(Number);
    parts[2] = (parts[2] || 0) + 1;
    return parts.join('.');
  };

  // Increment major version (X.0.0) when certifying
  const incrementMajorVersion = (version?: string): string => {
    const parts = normalizeVersion(version).split('.').map(Number);
    const major = parts[0] || 0;
    return `${major + 1}.0.0`;
  };

  const updateAgentWithMinorVersion = (id: string, updates: Partial<UserAgent>) => {
    setAgents(prev => prev.map(a => {
      if (a.id === id) {
        const newVersion = incrementMinorVersion(a.version);
        return { ...a, ...updates, version: newVersion };
      }
      return a;
    }));
  };

  const certifyAgent = (id: string) => {
    setAgents(prev => prev.map(a => {
      if (a.id === id) {
        const newVersion = incrementMajorVersion(a.version);
        return { ...a, status: 'certified' as const, version: newVersion };
      }
      return a;
    }));
  };

  const incrementUsage = (id: string) => {
    setAgents(prev => prev.map(a => a.id === id ? { ...a, usageCount: a.usageCount + 1 } : a));
  };

  const getVotes = (agentId: string) => {
    return votes[agentId] || { upvotes: 0, downvotes: 0, userVote: null };
  };

  const voteAgent = (agentId: string, vote: VoteType) => {
    setVotes(prev => {
      const current = prev[agentId] || { upvotes: 0, downvotes: 0, userVote: null };
      const previousVote = current.userVote;
      
      let newUpvotes = current.upvotes;
      let newDownvotes = current.downvotes;
      
      // Remove previous vote
      if (previousVote === 'up') newUpvotes--;
      if (previousVote === 'down') newDownvotes--;
      
      // Add new vote (if not toggling off)
      if (vote !== previousVote) {
        if (vote === 'up') newUpvotes++;
        if (vote === 'down') newDownvotes++;
      }
      
      return {
        ...prev,
        [agentId]: {
          upvotes: Math.max(0, newUpvotes),
          downvotes: Math.max(0, newDownvotes),
          userVote: vote === previousVote ? null : vote,
        },
      };
    });
  };

  const toggleFavorite = (agentId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(agentId)) {
        newFavorites.delete(agentId);
      } else {
        newFavorites.add(agentId);
      }
      return newFavorites;
    });
  };

  const isFavorite = (agentId: string) => favorites.has(agentId);

  return (
    <AgentContext.Provider value={{ agents, addAgent, updateAgent, updateAgentWithMinorVersion, certifyAgent, incrementUsage, votes, voteAgent, getVotes, favorites, toggleFavorite, isFavorite }}>
      {children}
    </AgentContext.Provider>
  );
};

export const useAgents = () => {
  const context = useContext(AgentContext);
  if (!context) {
    throw new Error('useAgents must be used within an AgentProvider');
  }
  return context;
};
