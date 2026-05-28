import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import Header from '@/components/Header';
import { ArrowLeft, Copy, Check, MousePointerClick, User, Calendar, ExternalLink, Pencil, Lock, ShieldCheck, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAgents } from '@/contexts/AgentContext';
import { UserAgent } from '@/data/sampleData';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const teams = [
  { id: 'claims', name: 'Claims' },
  { id: 'underwriting', name: 'Underwriting' },
  { id: 'policy-admin', name: 'Policy Admin' },
  { id: 'customer-service', name: 'Customer Service' },
  { id: 'sales', name: 'Sales' },
  { id: 'compliance', name: 'Compliance' },
  { id: 'analytics', name: 'Analytics' },
];

const MyAgentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { agents, updateAgentWithMinorVersion, incrementUsage } = useAgents();
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [hasTrackedView, setHasTrackedView] = useState(false);
  const [hasOpenedEditFromUrl, setHasOpenedEditFromUrl] = useState(false);
  
  const [agent, setAgent] = useState<UserAgent | null>(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editPrompt, setEditPrompt] = useState('');
  const [editTeam, setEditTeam] = useState('');

  useEffect(() => {
    const foundAgent = agents.find(a => a.id === id);
    if (foundAgent) {
      setAgent(foundAgent);
      setEditName(foundAgent.name);
      setEditDescription(foundAgent.description);
      setEditPrompt(foundAgent.prompt);
      // Find team id from category name
      const teamMatch = teams.find(t => t.name === foundAgent.category);
      setEditTeam(teamMatch?.id || '');
      
      // Open edit dialog if edit=true query param is present (only once)
      if (searchParams.get('edit') === 'true' && foundAgent.status !== 'certified' && !hasOpenedEditFromUrl) {
        setIsEditing(true);
        setHasOpenedEditFromUrl(true);
      }
      
      // Track usage only when viewing (not editing) and only once per page load
      if (searchParams.get('edit') !== 'true' && !hasTrackedView) {
        incrementUsage(foundAgent.id);
        setHasTrackedView(true);
      }
    }
  }, [id, searchParams, agents, hasTrackedView, hasOpenedEditFromUrl, incrementUsage]);

  if (!agent) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="w-full max-w-[1900px] mx-auto px-6 xl:px-12 py-8">
          <Link to="/my-agents">
            <Button variant="ghost" size="sm" className="gap-2 mb-4">
              <ArrowLeft className="w-4 h-4" />
              Back to My Agents
            </Button>
          </Link>
          <p className="text-muted-foreground">Agent not found</p>
        </main>
      </div>
    );
  }

  const isLocked = agent.isShared && agent.status === 'certified';
  const canEdit = agent.status !== 'certified';

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

  const handleSaveEdit = () => {
    const selectedTeam = teams.find(t => t.id === editTeam);
    updateAgentWithMinorVersion(agent.id, {
      name: editName,
      description: editDescription,
      prompt: editPrompt,
      category: selectedTeam?.name || agent.category,
    });
    setIsEditing(false);
    // Clear edit param from URL
    if (searchParams.get('edit')) {
      searchParams.delete('edit');
      setSearchParams(searchParams, { replace: true });
    }
    toast({
      title: "Agent updated",
      description: "Your changes have been saved. Version incremented.",
    });
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="w-full max-w-[1900px] mx-auto px-6 xl:px-12 py-8">
        <Link to="/my-agents">
          <Button variant="ghost" size="sm" className="gap-2 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to My Agents
          </Button>
        </Link>
        <div className="mb-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-foreground">{agent.name}</h1>
            <Badge variant="secondary" className="font-mono">
              v{agent.version}
            </Badge>
            <Badge className={getProviderColor(agent.provider)}>
              {agent.provider === 'copilot' ? 'Copilot' : 'Bedrock'}
            </Badge>
            <Badge className={getStatusColor(agent.status)}>{agent.status}</Badge>
            {isLocked && (
              <Badge variant="secondary" className="gap-1">
                <Lock className="w-3 h-3" />
                Locked
              </Badge>
            )}
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
              <div className="flex items-center gap-2">
                {canEdit && (
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="gap-2">
                    <Pencil className="w-4 h-4" />
                    Edit
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={handleCopyPrompt} className="gap-2">
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied' : 'Copy'}
                </Button>
              </div>
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

      {/* Edit Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Agent</DialogTitle>
            <DialogDescription>
              Make changes to your agent. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label>Team</Label>
              <Select value={editTeam} onValueChange={setEditTeam}>
                <SelectTrigger>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <SelectValue placeholder="Select team" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {teams.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-prompt">Prompt</Label>
              <Textarea
                id="edit-prompt"
                value={editPrompt}
                onChange={(e) => setEditPrompt(e.target.value)}
                rows={12}
                className="font-mono text-sm"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyAgentDetail;
