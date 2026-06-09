import { subDays, format } from 'date-fns';

export interface DailyUsage {
  date: string;
  agentId: string;
  agentName: string;
  category: string;
  model: 'copilot' | 'bedrock';
  usageCount: number;
  inputTokens: number;
  outputTokens: number;
}

// Sample agents for analytics
const agents = [
  { id: 'agent-1', name: 'Code Assistant', category: 'Development', model: 'copilot' as const },
  { id: 'agent-2', name: 'Data Analyst', category: 'Analytics', model: 'bedrock' as const },
  { id: 'agent-3', name: 'Customer Support', category: 'Support', model: 'copilot' as const },
  { id: 'agent-4', name: 'Content Writer', category: 'Marketing', model: 'bedrock' as const },
  { id: 'agent-5', name: 'HR Assistant', category: 'HR', model: 'copilot' as const },
  { id: 'agent-6', name: 'Sales Copilot', category: 'Sales', model: 'bedrock' as const },
  { id: 'agent-7', name: 'Legal Advisor', category: 'Legal', model: 'copilot' as const },
  { id: 'agent-8', name: 'Finance Bot', category: 'Finance', model: 'bedrock' as const },
];

// Generate 30 days of sample data
const generateDailyUsageData = (): DailyUsage[] => {
  const data: DailyUsage[] = [];
  const today = new Date();

  for (let dayOffset = 29; dayOffset >= 0; dayOffset--) {
    const date = subDays(today, dayOffset);
    const dateStr = format(date, 'yyyy-MM-dd');

    agents.forEach((agent) => {
      // Generate realistic usage patterns with some variance
      const baseUsage = Math.floor(Math.random() * 50) + 10;
      const dayOfWeek = date.getDay();
      const weekdayMultiplier = dayOfWeek === 0 || dayOfWeek === 6 ? 0.3 : 1;
      
      const usageCount = Math.floor(baseUsage * weekdayMultiplier * (0.8 + Math.random() * 0.4));
      
      // Token counts vary by agent type
      const avgInputTokens = agent.category === 'Development' ? 800 : 
                             agent.category === 'Analytics' ? 600 : 400;
      const avgOutputTokens = agent.category === 'Development' ? 1200 : 
                              agent.category === 'Analytics' ? 900 : 500;
      
      const inputTokens = Math.floor(usageCount * avgInputTokens * (0.7 + Math.random() * 0.6));
      const outputTokens = Math.floor(usageCount * avgOutputTokens * (0.7 + Math.random() * 0.6));

      data.push({
        date: dateStr,
        agentId: agent.id,
        agentName: agent.name,
        category: agent.category,
        model: agent.model,
        usageCount,
        inputTokens,
        outputTokens,
      });
    });
  }

  return data;
};

export const dailyUsageData = generateDailyUsageData();

// Get unique values for filters
export const getUniqueAgents = () => 
  [...new Set(dailyUsageData.map(d => d.agentName))].sort();

export const getUniqueCategories = () => 
  [...new Set(dailyUsageData.map(d => d.category))].sort();

export const getUniqueModels = () => 
  [...new Set(dailyUsageData.map(d => d.model))];

// Aggregation functions
export const aggregateByAgent = (data: DailyUsage[]) => {
  const aggregated = data.reduce((acc, curr) => {
    if (!acc[curr.agentName]) {
      acc[curr.agentName] = {
        agentName: curr.agentName,
        usageCount: 0,
        inputTokens: 0,
        outputTokens: 0,
      };
    }
    acc[curr.agentName].usageCount += curr.usageCount;
    acc[curr.agentName].inputTokens += curr.inputTokens;
    acc[curr.agentName].outputTokens += curr.outputTokens;
    return acc;
  }, {} as Record<string, { agentName: string; usageCount: number; inputTokens: number; outputTokens: number }>);

  return Object.values(aggregated).sort((a, b) => b.usageCount - a.usageCount);
};

export const aggregateByDate = (data: DailyUsage[]) => {
  const aggregated = data.reduce((acc, curr) => {
    if (!acc[curr.date]) {
      acc[curr.date] = {
        date: curr.date,
        usageCount: 0,
        totalTokens: 0,
        inputTokens: 0,
        outputTokens: 0,
      };
    }
    acc[curr.date].usageCount += curr.usageCount;
    acc[curr.date].totalTokens += curr.inputTokens + curr.outputTokens;
    acc[curr.date].inputTokens += curr.inputTokens;
    acc[curr.date].outputTokens += curr.outputTokens;
    return acc;
  }, {} as Record<string, { date: string; usageCount: number; totalTokens: number; inputTokens: number; outputTokens: number }>);

  return Object.values(aggregated).sort((a, b) => a.date.localeCompare(b.date));
};

export const calculateEfficiencyMetrics = (data: DailyUsage[]) => {
  const byAgent = aggregateByAgent(data);
  return byAgent.map(agent => ({
    ...agent,
    totalTokens: agent.inputTokens + agent.outputTokens,
    avgTokensPerRequest: agent.usageCount > 0 
      ? Math.round((agent.inputTokens + agent.outputTokens) / agent.usageCount) 
      : 0,
  }));
};
