import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { ArrowLeft, Cloud, Cpu, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAgents } from '@/contexts/AgentContext';

const teams = [
  { id: 'claims', name: 'Claims' },
  { id: 'underwriting', name: 'Underwriting' },
  { id: 'policy-admin', name: 'Policy Admin' },
  { id: 'customer-service', name: 'Customer Service' },
  { id: 'sales', name: 'Sales' },
  { id: 'compliance', name: 'Compliance' },
  { id: 'analytics', name: 'Analytics' },
];

const CreateAgent = () => {
  const [provider, setProvider] = useState<'copilot' | 'bedrock'>('copilot');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [prompt, setPrompt] = useState('');
  const [team, setTeam] = useState('');
  const { toast } = useToast();
  const { addAgent } = useAgents();
  const navigate = useNavigate();

  const isFormValid = name.trim() !== '' && description.trim() !== '' && prompt.trim() !== '' && team !== '';

  const handleCreate = () => {
    const selectedTeam = teams.find(t => t.id === team);
    addAgent({
      name: name.trim(),
      description: description.trim(),
      prompt: prompt.trim(),
      category: selectedTeam?.name || 'Custom',
      provider,
      status: 'uncertified',
      isShared: false,
      author: 'You',
      version: '0.0.1',
    });

    toast({
      title: "Agent created successfully",
      description: "Your agent is now available in My Agents.",
    });

    navigate('/my-agents');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="w-full max-w-[1900px] mx-auto px-6 xl:px-12 py-8">
        <Link to="/">
          <Button variant="ghost" size="sm" className="gap-2 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </Link>
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">Create Agent</h1>
          <p className="text-muted-foreground">Build and deploy your own custom AI agents</p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Agent Configuration</CardTitle>
              <CardDescription>
                Define your agent's details and select a cloud provider
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="agent-name">Agent Name</Label>
                <Input 
                  id="agent-name" 
                  placeholder="My Custom Agent" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="agent-description">Description</Label>
                <Textarea 
                  id="agent-description" 
                  placeholder="Describe what your agent does..." 
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="agent-prompt">Agent Prompt</Label>
                <Textarea 
                  id="agent-prompt" 
                  placeholder="Enter the system prompt that defines your agent's behavior..." 
                  rows={6}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Team</Label>
                <Select value={team} onValueChange={setTeam}>
                  <SelectTrigger>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <SelectValue placeholder="Select your team" />
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

              <div className="space-y-3">
                <Label>Cloud Provider</Label>
                <RadioGroup value={provider} onValueChange={(v) => setProvider(v as 'copilot' | 'bedrock')} className="space-y-3">
                  <div className="flex items-center space-x-3 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer">
                    <RadioGroupItem value="copilot" id="copilot" />
                    <Label htmlFor="copilot" className="flex items-center gap-3 cursor-pointer flex-1">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                        <Cpu className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium">Microsoft Copilot</div>
                        <div className="text-sm text-muted-foreground">Azure-powered AI with enterprise security</div>
                      </div>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer">
                    <RadioGroupItem value="bedrock" id="bedrock" />
                    <Label htmlFor="bedrock" className="flex items-center gap-3 cursor-pointer flex-1">
                      <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                        <Cloud className="w-5 h-5 text-amber-600" />
                      </div>
                      <div>
                        <div className="font-medium">AWS Bedrock</div>
                        <div className="text-sm text-muted-foreground">Foundation models with AWS integration</div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <Button 
                onClick={handleCreate} 
                className="w-full" 
                size="lg"
                disabled={!isFormValid}
              >
                Create Agent
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default CreateAgent;
