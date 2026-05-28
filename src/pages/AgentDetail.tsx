import { useParams, Link } from 'react-router-dom';
import Header from '@/components/Header';
import { ArrowLeft, Copy, Check, MousePointerClick, User, Calendar, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { sampleAgents, Agent } from '@/data/sampleData';
import { useAgents } from '@/contexts/AgentContext';

const AgentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const { agents: userAgents, incrementUsage } = useAgents();
  const [hasTrackedView, setHasTrackedView] = useState(false);

  // First check sample agents, then check shared user agents
  const sampleAgent = sampleAgents.find(a => a.id === id);
  const sharedUserAgent = userAgents.find(a => a.id === id && a.isShared);
  
  // Convert shared user agent to Agent format if found
  const agent: Agent | undefined = sampleAgent || (sharedUserAgent ? {
    id: sharedUserAgent.id,
    name: sharedUserAgent.name,
    description: sharedUserAgent.description,
    category: sharedUserAgent.category,
    usageCount: sharedUserAgent.usageCount,
    lastUpdated: sharedUserAgent.createdAt,
    status: 'uncertified' as const,
    author: sharedUserAgent.author,
    createdAt: sharedUserAgent.createdAt,
    prompt: sharedUserAgent.prompt,
    provider: sharedUserAgent.provider,
  } : undefined);

  // Track usage for shared user agents
  useEffect(() => {
    if (sharedUserAgent && !hasTrackedView) {
      incrementUsage(sharedUserAgent.id);
      setHasTrackedView(true);
    }
  }, [sharedUserAgent, hasTrackedView, incrementUsage]);

  if (!agent) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="w-full max-w-[1900px] mx-auto px-6 xl:px-12 py-8">
          <Link to="/marketplace">
            <Button variant="ghost" size="sm" className="gap-2 mb-4">
              <ArrowLeft className="w-4 h-4" />
              Back to Marketplace
            </Button>
          </Link>
          <p className="text-muted-foreground">Agent not found</p>
        </main>
      </div>
    );
  }

  const handleCopyPrompt = async () => {
    await navigator.clipboard.writeText(agent.prompt);
    setCopied(true);
    toast({
      title: "Copied!",
      description: "Prompt copied to clipboard",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenProvider = () => {
    const url = agent.provider === 'copilot' 
      ? 'https://copilot.microsoft.com'
      : 'https://console.aws.amazon.com/bedrock';
    window.open(url, '_blank');
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="w-full max-w-[1900px] mx-auto px-6 xl:px-12 py-8">
        <Link to="/marketplace">
          <Button variant="ghost" size="sm" className="gap-2 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Marketplace
          </Button>
        </Link>
        <div className="mb-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-foreground">{agent.name}</h1>
            <Badge variant="outline">v{(agent as any).version || '1.0.0'}</Badge>
            <Badge className={getStatusColor(agent.status)}>{agent.status}</Badge>
          </div>
          <p className="text-muted-foreground">{agent.description}</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <MousePointerClick className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Uses</p>
                  <p className="text-2xl font-bold text-foreground">{agent.usageCount.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Author</p>
                  <p className="text-2xl font-bold text-foreground">{agent.author}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p className="text-2xl font-bold text-foreground">{new Date(agent.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Prompt Section */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Agent Prompt</CardTitle>
              <Button variant="outline" size="sm" onClick={handleCopyPrompt} className="gap-2">
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied' : 'Copy'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-muted rounded-lg p-4 font-mono text-sm text-foreground whitespace-pre-wrap">
              {agent.prompt}
            </div>
          </CardContent>
        </Card>

        {/* Action Button */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Run this agent</p>
                <p className="text-sm text-muted-foreground">
                  Open {agent.provider === 'copilot' ? 'Microsoft Copilot' : 'AWS Bedrock'} to use this agent
                </p>
              </div>
              <Button onClick={handleOpenProvider} className="gap-2">
                <ExternalLink className="w-4 h-4" />
                Execute Agent
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AgentDetail;
