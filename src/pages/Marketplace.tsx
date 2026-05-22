import { useState } from 'react';
import { Link } from 'react-router-dom';
import EnterpriseHeader from '@/components/EnterpriseHeader';
import { Search, ThumbsUp, ThumbsDown, Star, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { sampleAgents, Agent } from '@/data/sampleData';
import { useAgents, VoteType } from '@/contexts/AgentContext';

const categories = ['All', 'Claims', 'Underwriting', 'Policy Admin', 'Customer Service', 'Sales', 'Compliance', 'Analytics', 'Custom'];

const Marketplace = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { agents: userAgents, voteAgent, getVotes, toggleFavorite, isFavorite } = useAgents();

  // Convert shared user agents to marketplace format
  const sharedUserAgents: Agent[] = userAgents
    .filter(agent => agent.isShared)
    .map(agent => ({
      id: agent.id,
      name: agent.name,
      description: agent.description,
      category: agent.category,
      usageCount: agent.usageCount,
      lastUpdated: agent.createdAt,
      status: 'uncertified' as const,
      author: agent.author,
      createdAt: agent.createdAt,
      prompt: agent.prompt,
      provider: agent.provider,
    }));

  // Combine sample agents with shared user agents
  const allAgents = [...sampleAgents, ...sharedUserAgents];

  const formatUsage = (count: number): string => {
    return count >= 1000 ? `${(count / 1000).toFixed(1)}k` : count.toString();
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'certified':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'uncertified':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getProviderColor = (provider: string): string => {
    switch (provider) {
      case 'copilot':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'bedrock':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const handleVote = (e: React.MouseEvent, agentId: string, vote: VoteType) => {
    e.preventDefault();
    e.stopPropagation();
    voteAgent(agentId, vote);
  };

  const handleFavorite = (e: React.MouseEvent, agentId: string) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(agentId);
  };

  // First, filter and sort by usage to get ranking across all available marketplace agents.
  const rankedAgents = [...allAgents]
    .filter(agent => {
      const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || agent.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => b.usageCount - a.usageCount)
    .map((agent, index) => ({ ...agent, rank: index + 1 }));

  // Then sort for display with favorites first
  const filteredAgents = [...rankedAgents].sort((a, b) => {
    const aFav = isFavorite(a.id) ? 1 : 0;
    const bFav = isFavorite(b.id) ? 1 : 0;
    if (aFav !== bFav) return bFav - aFav;
    return a.rank - b.rank;
  });

  return (
    <div className="min-h-screen bg-background">
      <EnterpriseHeader
        portalName="Enterprise AI Portal"
        pageTitle="AI Marketplace"
        pageDescription="Discover and Utilize AI Agents"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Marketplace' },
        ]}
        icon={<Store className="w-5 h-5 text-black" />}
      />
      
      <main className="container mx-auto px-6 py-8">

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle className="text-lg">Available Agents</CardTitle>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by domain" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search agents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredAgents.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No agents found matching your criteria
                </div>
              ) : (
                filteredAgents.map((agent, index) => {
                  const agentVotes = getVotes(agent.id);
                  const favorited = isFavorite(agent.id);
                  return (
                    <Link
                      key={agent.id}
                      to={`/marketplace/agent/${agent.id}`}
                      className="grid grid-cols-[auto_auto_1fr_auto_100px_100px_80px_70px_90px] items-center gap-4 p-4 rounded-lg bg-background hover:bg-muted/50 transition-colors border border-border cursor-pointer"
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`h-8 w-8 p-0 ${favorited ? 'text-amber-500' : 'text-muted-foreground hover:text-amber-500'}`}
                        onClick={(e) => handleFavorite(e, agent.id)}
                      >
                        <Star className={`w-4 h-4 ${favorited ? 'fill-amber-500' : ''}`} />
                      </Button>
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                        {agent.rank}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-medium text-foreground truncate">{agent.name}</h3>
                        <p className="text-sm text-muted-foreground truncate">{agent.description}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`h-8 w-8 p-0 ${agentVotes.userVote === 'up' ? 'text-emerald-600 bg-emerald-100 hover:bg-emerald-200' : 'text-muted-foreground hover:text-emerald-600'}`}
                          onClick={(e) => handleVote(e, agent.id, 'up')}
                        >
                          <ThumbsUp className="w-4 h-4" />
                        </Button>
                        <span className="text-xs font-medium text-muted-foreground min-w-[20px] text-center">
                          {agentVotes.upvotes}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`h-8 w-8 p-0 ${agentVotes.userVote === 'down' ? 'text-rose-600 bg-rose-100 hover:bg-rose-200' : 'text-muted-foreground hover:text-rose-600'}`}
                          onClick={(e) => handleVote(e, agent.id, 'down')}
                        >
                          <ThumbsDown className="w-4 h-4" />
                        </Button>
                        <span className="text-xs font-medium text-muted-foreground min-w-[20px] text-center">
                          {agentVotes.downvotes}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-foreground">
                          {formatUsage(agent.usageCount)} uses
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground text-right">
                        {agent.category}
                      </div>
                      <Badge className={`${getProviderColor(agent.provider)} justify-center`}>
                        {agent.provider === 'copilot' ? 'Copilot' : 'Bedrock'}
                      </Badge>
                      <Badge variant="outline" className="justify-center">
                        v{(agent as any).version || '1.0.0'}
                      </Badge>
                      <Badge className={`${getStatusColor(agent.status)} justify-center`}>
                        {agent.status}
                      </Badge>
                    </Link>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Marketplace;
