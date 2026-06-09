import { useState } from 'react';
import { Link } from 'react-router-dom';
import EnterpriseHeader from '@/components/EnterpriseHeader';
import { Calendar, BarChart2, Share2, Users, Lock, ShieldCheck, Pencil, Plus, Send, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAgents } from '@/contexts/AgentContext';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { UserAgent } from '@/data/sampleData';

const MyAgents = () => {
  const { agents, updateAgent } = useAgents();
  const [agentToShare, setAgentToShare] = useState<UserAgent | null>(null);
  const [agentToEdit, setAgentToEdit] = useState<UserAgent | null>(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const { toast } = useToast();

  const handleShareClick = (agent: UserAgent) => {
    // Prevent unsharing if agent is shared and certified
    if (agent.isShared && agent.status === 'certified') {
      return;
    }
    if (agent.isShared) {
      confirmShare(agent.id, false);
    } else {
      setAgentToShare(agent);
    }
  };

  const isLocked = (agent: UserAgent) => agent.isShared && agent.status === 'certified';

  const handleEditClick = (agent: UserAgent) => {
    setAgentToEdit(agent);
    setEditName(agent.name);
    setEditDescription(agent.description);
  };

  const saveEdit = () => {
    if (!agentToEdit) return;
    updateAgent(agentToEdit.id, { name: editName, description: editDescription });
    setAgentToEdit(null);
    toast({
      title: "Agent updated",
      description: "Your changes have been saved.",
    });
  };

  const confirmShare = (agentId: string, isSharing: boolean) => {
    updateAgent(agentId, { isShared: isSharing });
    setAgentToShare(null);

    toast({
      title: isSharing ? "Agent shared with team" : "Agent unshared",
      description: isSharing
        ? "Your agent is now visible to your team members in My Team's Agents."
        : "Your agent is now private.",
    });
  };

  const handleSubmitForCertification = (agent: UserAgent) => {
    updateAgent(agent.id, { status: 'pending' });
    toast({
      title: "Submitted for Certification",
      description: `"${agent.name}" has been submitted for review. Once certified, it will appear in the AI Marketplace.`,
    });
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-background">
      <EnterpriseHeader
        portalName="Enterprise AI Portal"
        pageTitle="My Agents"
        pageDescription="Manage and share your personal AI agents"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Agents' },
        ]}
        icon={<ShieldCheck className="w-5 h-5 text-black" />}
      />
      
      <main className="w-full max-w-[1900px] mx-auto px-6 xl:px-12 py-8">

          {/* Agents Overview */}
<Card className="mb-6">
  <CardHeader>
    <CardTitle className="text-lg font-bold text-center">Agents Overview</CardTitle>
  </CardHeader>
  <CardContent className="text-center">
    <p className="text-sm text-muted-foreground leading-relaxed">
      This page provides a centralized workspace for managing your personal AI agents. 
      You can create, edit, share, and submit agents for certification before publishing them to the marketplace.
    </p>

    <div className="mt-4">
      <p className="text-sm font-medium text-foreground mb-1">
        Intended Functionality
      </p>
      <p className="text-sm text-muted-foreground">
        Each agent is designed to encapsulate a specific workflow or automation logic. 
        Users can iterate on prompts, track usage, and control visibility across their team and the marketplace lifecycle.
      </p>
    </div>
  </CardContent>
</Card>

        {/* <Card>
          <CardHeader>
            <CardTitle className="text-lg">Your Agents</CardTitle>
          </CardHeader>
          <CardContent>
            {agents.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>You haven't created any agents yet.</p>
                <Link to="/create-agent">
                  <Button className="mt-4">Create Your First Agent</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {agents.map((agent) => (
                  <div
                    key={agent.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-background hover:bg-muted/50 transition-colors border border-border"
                  >
                    <Link 
                      to={`/my-agents/${agent.id}`}
                      className="flex-1 min-w-0 cursor-pointer"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-foreground truncate hover:text-primary transition-colors">{agent.name}</h3>
                        <Badge variant="secondary" className="text-xs font-mono">
                          v{agent.version}
                        </Badge>
                        {agent.isShared && (
                          <Badge variant="secondary" className="gap-1 text-xs">
                            <Users className="w-3 h-3" />
                            Shared
                          </Badge>
                        )}
                        {agent.status === 'certified' ? (
                          <Badge className="gap-1 text-xs bg-emerald-100 text-emerald-700 border-emerald-200">
                            <ShieldCheck className="w-3 h-3" />
                            Certified
                          </Badge>
                        ) : agent.status === 'pending' ? (
                          <Badge variant="outline" className="gap-1 text-xs text-amber-600 border-amber-300">
                            <Clock className="w-3 h-3" />
                            Pending Review
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="gap-1 text-xs text-muted-foreground">
                            Uncertified
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1">{agent.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(agent.createdAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <BarChart2 className="w-3 h-3" />
                          {agent.usageCount} uses
                        </span>
                      </div>
                    </Link>
                    {isLocked(agent) ? (
                      <div className="flex items-center gap-2 text-muted-foreground text-sm shrink-0 ml-4">
                        <Lock className="w-4 h-4" />
                        <span>Locked</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 shrink-0 ml-4">
                        {agent.status === 'uncertified' && (
                          <>
                            <Link to={`/my-agents/${agent.id}?edit=true`}>
                              <Button
                                variant="outline"
                                size="sm"
                                className="gap-2"
                              >
                                <Pencil className="w-4 h-4" />
                                Edit
                              </Button>
                            </Link>
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                              onClick={() => handleSubmitForCertification(agent)}
                            >
                              <Send className="w-4 h-4" />
                              Submit for Certification
                            </Button>
                          </>
                        )}
                        {agent.status !== 'certified' && (
                          <Button
                            variant={agent.isShared ? "secondary" : "outline"}
                            size="sm"
                            className="gap-2"
                            onClick={() => handleShareClick(agent)}
                          >
                            <Share2 className="w-4 h-4" />
                            {agent.isShared ? 'Unshare' : 'Share'}
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card> */}
      </main>

      {/* <AlertDialog open={!!agentToShare} onOpenChange={() => setAgentToShare(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Share this agent?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to share "{agentToShare?.name}"?
              <span className="block mt-2 text-amber-600 font-medium">
                ⚠️ Shared agents will be visible to all members of your team.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => agentToShare && confirmShare(agentToShare.id, true)}>
              Share Agent
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={!!agentToEdit} onOpenChange={() => setAgentToEdit(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Agent</DialogTitle>
            <DialogDescription>
              Make changes to your agent. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
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
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAgentToEdit(null)}>
              Cancel
            </Button>
            <Button onClick={saveEdit}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}
    </div>
  );
};

export default MyAgents;
