import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import EnterpriseHeader from '@/components/EnterpriseHeader';
import { ShieldCheck, Clock, ClipboardCheck, FileText, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { useAgents } from '@/contexts/AgentContext';
import { useToast } from '@/hooks/use-toast';

interface StepChecks {
  [stepIndex: number]: boolean;
}

interface ColumnChecks {
  qaCheck: boolean;
  prompts: boolean;
  aiPolicy: boolean;
  steps: {
    qaCheck: StepChecks;
    prompts: StepChecks;
    aiPolicy: StepChecks;
  };
}

interface CertificationChecks {
  [agentId: string]: ColumnChecks;
}

const CertificationQueue = () => {
  const { agents, certifyAgent } = useAgents();
  const { toast } = useToast();
  
  const [certificationChecks, setCertificationChecks] = useState<CertificationChecks>(() => {
    const stored = localStorage.getItem('certificationChecks');
    return stored ? JSON.parse(stored) : {};
  });

  // Get agents pending certification
  const pendingAgents = agents.filter(agent => agent.status === 'pending');

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('certificationChecks', JSON.stringify(certificationChecks));
  }, [certificationChecks]);

  const getDefaultChecks = (): ColumnChecks => ({
    qaCheck: false,
    prompts: false,
    aiPolicy: false,
    steps: {
      qaCheck: {},
      prompts: {},
      aiPolicy: {}
    }
  });

  const getAgentChecks = (agentId: string): ColumnChecks => {
    const stored = certificationChecks[agentId];
    if (!stored) return getDefaultChecks();
    
    // Merge with defaults to handle old localStorage data without steps
    return {
      qaCheck: stored.qaCheck || false,
      prompts: stored.prompts || false,
      aiPolicy: stored.aiPolicy || false,
      steps: {
        qaCheck: stored.steps?.qaCheck || {},
        prompts: stored.steps?.prompts || {},
        aiPolicy: stored.steps?.aiPolicy || {}
      }
    };
  };

  const stepLists: Record<'qaCheck' | 'prompts' | 'aiPolicy', string[]> = {
    qaCheck: [
      'Verify output consistency across multiple runs',
      'Test edge cases and boundary conditions',
      'Confirm response format matches specification',
      'Validate error handling and fallback behavior',
      'Check response time meets performance standards'
    ],
    prompts: [
      'Review system prompt for clarity and completeness',
      'Verify prompt includes appropriate guardrails',
      'Check for proper context and role definition',
      'Validate example inputs/outputs if provided',
      'Ensure prompt follows best practices'
    ],
    aiPolicy: [
      'Confirm no PII/PHI exposure in outputs',
      'Verify compliance with data retention policies',
      'Check for appropriate content filtering',
      'Validate model usage aligns with approved use cases',
      'Ensure audit logging requirements are met'
    ]
  };

  const areAllStepsChecked = (agentId: string, checkType: 'qaCheck' | 'prompts' | 'aiPolicy') => {
    const checks = getAgentChecks(agentId);
    const stepCount = stepLists[checkType].length;
    const stepChecks = checks.steps[checkType];
    return stepCount > 0 && Object.keys(stepChecks).length === stepCount && Object.values(stepChecks).every(Boolean);
  };

  const handleStepCheck = (agentId: string, checkType: 'qaCheck' | 'prompts' | 'aiPolicy', stepIndex: number, checked: boolean) => {
    setCertificationChecks(prev => {
      const stored = prev[agentId];
      const current: ColumnChecks = stored ? {
        qaCheck: stored.qaCheck || false,
        prompts: stored.prompts || false,
        aiPolicy: stored.aiPolicy || false,
        steps: {
          qaCheck: stored.steps?.qaCheck || {},
          prompts: stored.steps?.prompts || {},
          aiPolicy: stored.steps?.aiPolicy || {}
        }
      } : getDefaultChecks();
      
      const updatedSteps = {
        ...current.steps,
        [checkType]: {
          ...current.steps[checkType],
          [stepIndex]: checked
        }
      };
      
      // Check if all steps in this column are now checked
      const stepCount = stepLists[checkType].length;
      const allStepsChecked = Object.keys(updatedSteps[checkType]).length === stepCount && 
                               Object.values(updatedSteps[checkType]).every(Boolean);
      
      const updated: ColumnChecks = {
        ...current,
        steps: updatedSteps,
        [checkType]: allStepsChecked ? true : current[checkType]
      };
      
      // Check if all 3 columns are now checked
      if (updated.qaCheck && updated.prompts && updated.aiPolicy) {
        const agent = agents.find(a => a.id === agentId);
        if (agent) {
          setTimeout(() => {
            certifyAgent(agentId);
            toast({
              title: "Agent Certified",
              description: `"${agent.name}" has passed all checks and is now certified.`,
            });
          }, 300);
        }
        const { [agentId]: _, ...rest } = prev;
        return rest;
      }
      
      return { ...prev, [agentId]: updated };
    });
  };

  const handleColumnCheck = (agentId: string, checkType: 'qaCheck' | 'prompts' | 'aiPolicy', checked: boolean) => {
    setCertificationChecks(prev => {
      const stored = prev[agentId];
      const current: ColumnChecks = stored ? {
        qaCheck: stored.qaCheck || false,
        prompts: stored.prompts || false,
        aiPolicy: stored.aiPolicy || false,
        steps: {
          qaCheck: stored.steps?.qaCheck || {},
          prompts: stored.steps?.prompts || {},
          aiPolicy: stored.steps?.aiPolicy || {}
        }
      } : getDefaultChecks();
      
      // When checking the column directly, also mark all steps as checked
      const stepCount = stepLists[checkType].length;
      const allStepsChecked: StepChecks = {};
      if (checked) {
        for (let i = 0; i < stepCount; i++) {
          allStepsChecked[i] = true;
        }
      }
      
      const updated: ColumnChecks = {
        ...current,
        [checkType]: checked,
        steps: {
          ...current.steps,
          [checkType]: checked ? allStepsChecked : {}
        }
      };
      
      // Check if all 3 are now checked
      if (updated.qaCheck && updated.prompts && updated.aiPolicy) {
        const agent = agents.find(a => a.id === agentId);
        if (agent) {
          setTimeout(() => {
            certifyAgent(agentId);
            toast({
              title: "Agent Certified",
              description: `"${agent.name}" has passed all checks and is now certified.`,
            });
          }, 300);
        }
        const { [agentId]: _, ...rest } = prev;
        return rest;
      }
      
      return { ...prev, [agentId]: updated };
    });
  };

  // All pending agents appear in all columns
  const qaAgents = pendingAgents;
  const promptsAgents = pendingAgents;
  const aiPolicyAgents = pendingAgents;

  const renderAgentCard = (agent: typeof pendingAgents[0], checkType: 'qaCheck' | 'prompts' | 'aiPolicy') => {
    const checks = getAgentChecks(agent.id);
    const isChecked = checks[checkType];
    const completedCount = [checks.qaCheck, checks.prompts, checks.aiPolicy].filter(Boolean).length;
    const stepChecks = checks.steps[checkType];
    const checkedStepsCount = Object.values(stepChecks).filter(Boolean).length;
    const totalSteps = stepLists[checkType].length;
    
    // Calculate overall progress across all columns
    const totalAllSteps = stepLists.qaCheck.length + stepLists.prompts.length + stepLists.aiPolicy.length;
    const completedAllSteps = 
      Object.values(checks.steps.qaCheck).filter(Boolean).length +
      Object.values(checks.steps.prompts).filter(Boolean).length +
      Object.values(checks.steps.aiPolicy).filter(Boolean).length;
    const overallProgress = totalAllSteps > 0 ? Math.round((completedAllSteps / totalAllSteps) * 100) : 0;
    
    return (
      <div
        key={`${agent.id}-${checkType}`}
        className={`p-4 rounded-lg border transition-colors ${
          isChecked 
            ? 'bg-muted/50 border-emerald-300 opacity-75' 
            : 'bg-background border-border hover:border-primary/30'
        }`}
      >
        <div className="flex items-start gap-3">
          <Checkbox
            id={`${agent.id}-${checkType}`}
            checked={isChecked}
            onCheckedChange={(checked) => handleColumnCheck(agent.id, checkType, checked as boolean)}
            className="mt-1"
          />
          <div className="flex-1 min-w-0">
            <label 
              htmlFor={`${agent.id}-${checkType}`}
              className={`font-medium cursor-pointer transition-colors ${
                isChecked ? 'text-muted-foreground line-through' : 'text-foreground hover:text-primary'
              }`}
            >
              {agent.name}
            </label>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{agent.description}</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="secondary" className="text-xs">
                {agent.category}
              </Badge>
              <Badge variant="outline" className="text-xs font-mono">
                v{agent.version}
              </Badge>
              <span className={`text-xs ${completedCount === 3 ? 'text-emerald-600 font-medium' : 'text-muted-foreground'}`}>
                {completedCount}/3 checks
              </span>
            </div>
            
            {/* Overall progress bar */}
            <div className="mt-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-muted-foreground">Overall Progress</span>
                <span className={`text-xs font-medium ${overallProgress === 100 ? 'text-emerald-600' : 'text-foreground'}`}>
                  {overallProgress}%
                </span>
              </div>
              <Progress 
                value={overallProgress} 
                className={`h-2 ${overallProgress === 100 ? '[&>div]:bg-emerald-500' : ''}`}
              />
            </div>
            
            {/* Step-level checkboxes */}
            <div className="mt-3 pt-3 border-t border-border/50">
              <p className="text-xs font-medium text-muted-foreground mb-2">
                Steps ({checkedStepsCount}/{totalSteps}):
              </p>
              <div className="space-y-2">
                {stepLists[checkType].map((step, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <Checkbox
                      id={`${agent.id}-${checkType}-step-${index}`}
                      checked={stepChecks[index] || false}
                      onCheckedChange={(checked) => handleStepCheck(agent.id, checkType, index, checked as boolean)}
                      className="mt-0.5 h-3.5 w-3.5"
                      disabled={isChecked}
                    />
                    <label 
                      htmlFor={`${agent.id}-${checkType}-step-${index}`}
                      className={`text-xs cursor-pointer leading-relaxed ${
                        stepChecks[index] ? 'text-muted-foreground line-through' : 'text-foreground/80'
                      } ${isChecked ? 'opacity-50' : ''}`}
                    >
                      {step}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };


  const renderColumn = (
    title: string, 
    subtitle: string | null,
    icon: React.ReactNode, 
    agents: typeof pendingAgents, 
    checkType: 'qaCheck' | 'prompts' | 'aiPolicy',
    colorClass: string
  ) => (
    <Card className="flex-1">
      <CardHeader className="pb-3">
        <CardTitle className={`text-lg flex items-center gap-2 ${colorClass}`}>
          {icon}
          {title} ({agents.length})
        </CardTitle>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        )}
      </CardHeader>
      <CardContent>
        {agents.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <ShieldCheck className="w-10 h-10 mx-auto mb-3 opacity-50" />
            <p className="text-sm">All clear!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {agents.map(agent => renderAgentCard(agent, checkType))}
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <EnterpriseHeader
        portalName="Enterprise AI Portal"
        pageTitle="Certification Queue"
        pageDescription="Review and certify AI agents for enterprise use"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Certification' },
        ]}
        icon={<ClipboardCheck className="w-5 h-5 text-black" />}
      />
      
      <main className="w-full max-w-[1900px] mx-auto px-6 xl:px-12 py-8">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Certification Queue</h1>
          <p className="text-muted-foreground">Review agents across all certification criteria</p>
          {pendingAgents.length > 0 && (
            <Badge variant="outline" className="mt-3 gap-1 text-amber-600 border-amber-300">
              <Clock className="w-3 h-3" />
              {pendingAgents.length} agent{pendingAgents.length !== 1 ? 's' : ''} pending review
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {renderColumn(
            'QA Check',
            null,
            <ClipboardCheck className="w-5 h-5" />,
            qaAgents,
            'qaCheck',
            'text-blue-600'
          )}
          {renderColumn(
            'Prompts',
            null,
            <FileText className="w-5 h-5" />,
            promptsAgents,
            'prompts',
            'text-amber-600'
          )}
          {renderColumn(
            'AI Policy',
            null,
            <Shield className="w-5 h-5" />,
            aiPolicyAgents,
            'aiPolicy',
            'text-emerald-600'
          )}
        </div>

        {pendingAgents.length === 0 && (
          <Card className="mt-6">
            <CardContent className="py-12">
              <div className="text-center text-muted-foreground">
                <ShieldCheck className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No agents pending certification.</p>
                <p className="text-sm mt-1">All submitted agents have been reviewed.</p>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default CertificationQueue;
