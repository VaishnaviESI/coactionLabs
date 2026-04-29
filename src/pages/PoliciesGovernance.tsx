import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import { ArrowLeft, Shield, FileText, Scale, Lock, Users, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

interface PolicyItem {
  title: string;
  description: string;
  fullText: string;
}

const policies = [
  {
    category: 'Core Policies',
    icon: Shield,
    iconColor: 'text-indigo-600',
    iconBg: 'bg-indigo-50',
    items: [
      { title: 'AI Acceptable Use Policy', description: 'Guidelines for appropriate use of AI tools and agents within the organization.', fullText: 'This policy establishes the acceptable use guidelines for AI tools and agents within our organization. All employees must use AI systems responsibly, ensuring outputs are reviewed before use in business decisions. AI should augment human judgment, not replace it. Users must not input confidential client information into external AI systems without proper authorization. Any AI-generated content must be clearly labeled when shared externally. Violations of this policy may result in disciplinary action. Regular training on AI acceptable use will be provided to all staff members.' },
      { title: 'AI Agent Development Standards', description: 'Technical and ethical standards for creating and deploying AI agents.', fullText: 'These standards govern the development and deployment of AI agents within our organization. All AI agents must undergo rigorous testing before deployment, including bias testing, performance validation, and security assessment. Developers must document all training data sources and model architectures. AI agents must include appropriate logging for audit purposes. Version control and rollback capabilities are mandatory. All agents must be reviewed by the AI Ethics Committee before production deployment. Continuous monitoring must be implemented to detect model drift or degradation.' },
      { title: 'Prompt Engineering Best Practices', description: 'Approved techniques and patterns for crafting effective AI prompts.', fullText: 'This document outlines approved techniques for crafting effective AI prompts. Prompts should be clear, specific, and include relevant context. Use structured formats when requesting specific output types. Include guardrails and constraints to prevent unwanted outputs. Test prompts with edge cases before production use. Document prompt versions and their intended purposes. Avoid prompts that could elicit harmful, biased, or confidential information. Regular prompt audits should be conducted to ensure continued effectiveness and compliance.' },
    ],
  },
  {
    category: 'Data & Privacy',
    icon: Lock,
    iconColor: 'text-emerald-600',
    iconBg: 'bg-emerald-50',
    items: [
      { title: 'Data Handling in AI Interactions', description: 'Rules for managing sensitive data when using AI agents.', fullText: 'This policy defines rules for managing sensitive data in AI interactions. Personal Identifiable Information (PII) must be anonymized or pseudonymized before processing by AI systems. Data retention periods for AI interactions are limited to 90 days unless otherwise required. All data transfers to AI systems must use encrypted channels. Users must classify data sensitivity before AI processing. High-sensitivity data requires additional approval workflows. Regular data audits ensure compliance with these requirements.' },
      { title: 'Privacy Impact Assessment Guide', description: 'Framework for evaluating privacy implications of AI deployments.', fullText: 'This framework guides the evaluation of privacy implications for AI deployments. All new AI implementations require a Privacy Impact Assessment (PIA) before launch. The PIA must identify all data types processed, storage locations, access controls, and retention periods. Risk mitigation strategies must be documented for each identified privacy risk. Third-party AI services require enhanced due diligence. Annual reviews of existing AI systems ensure continued privacy compliance. The Data Protection Officer must approve all PIAs.' },
      { title: 'Customer Data Protection Standards', description: 'Safeguards for customer information in AI-assisted processes.', fullText: 'These standards establish safeguards for customer information in AI-assisted processes. Customer consent must be obtained before using their data for AI processing. Customers have the right to opt-out of AI-assisted services. All customer data used in AI systems must be encrypted at rest and in transit. Access to customer data in AI systems is role-based and logged. Customer data cannot be used for AI model training without explicit consent. Data breach notification procedures specific to AI systems are defined.' },
    ],
  },
  {
    category: 'Compliance & Regulatory',
    icon: Scale,
    iconColor: 'text-amber-600',
    iconBg: 'bg-amber-50',
    items: [
      { title: 'Insurance Industry AI Regulations', description: 'Overview of regulatory requirements specific to insurance AI applications.', fullText: 'This document provides an overview of regulatory requirements for AI in insurance. AI systems used in underwriting must comply with fair lending laws and anti-discrimination regulations. Explainability requirements mandate that AI decisions affecting customers can be explained in plain language. State-specific regulations on AI in claims processing are catalogued and updated quarterly. Regulatory reporting requirements for AI systems are defined. Compliance testing protocols ensure ongoing adherence to evolving regulations. Staff training on insurance-specific AI regulations is mandatory.' },
      { title: 'Model Risk Management Framework', description: 'Governance structure for AI model validation and monitoring.', fullText: 'This framework establishes governance for AI model validation and monitoring. All models must be independently validated before deployment. Model performance metrics and thresholds are defined for each use case. Continuous monitoring detects model drift, bias emergence, and performance degradation. Model inventory is maintained with documentation of purpose, data sources, and limitations. Quarterly model reviews assess continued fitness for purpose. Model retirement procedures ensure orderly decommissioning. Escalation paths for model issues are clearly defined.' },
      { title: 'Audit Trail Requirements', description: 'Documentation standards for AI decision-making processes.', fullText: 'These requirements define documentation standards for AI decision-making. All AI decisions affecting customers or business outcomes must be logged with timestamps. Audit logs must capture input data, model version, and output produced. Logs must be retained for a minimum of 7 years. Audit trails must be immutable and tamper-evident. Regular audit log reviews verify completeness and accuracy. External auditor access to AI audit trails is facilitated. Audit trail format standards ensure consistency across systems.' },
    ],
  },
  {
    category: 'Ethics & Accountability',
    icon: Users,
    iconColor: 'text-rose-600',
    iconBg: 'bg-rose-50',
    items: [
      { title: 'AI Ethics Guidelines', description: 'Principles for responsible and fair AI usage.', fullText: 'These guidelines establish principles for responsible AI usage. AI systems must be designed and operated with fairness, transparency, and accountability. Human dignity and autonomy must be respected in all AI applications. AI should not perpetuate or amplify societal biases. Environmental impact of AI systems should be considered and minimized. Stakeholder interests must be balanced in AI decision-making. Regular ethics reviews assess AI systems against these principles. An AI Ethics Committee provides guidance on complex ethical issues.' },
      { title: 'Bias Detection & Mitigation', description: 'Procedures for identifying and addressing AI bias.', fullText: 'These procedures outline methods for identifying and addressing AI bias. Pre-deployment bias testing is mandatory for all customer-facing AI systems. Protected characteristics must be evaluated for disparate impact. Statistical parity metrics are defined for key use cases. Bias monitoring is continuous post-deployment. Bias remediation procedures include retraining, threshold adjustment, or system modification. Bias incidents are reported and tracked. Annual bias audits by independent parties are conducted. Training on bias awareness is provided to all AI practitioners.' },
      { title: 'Human Oversight Requirements', description: 'Standards for human review of AI-generated outputs.', fullText: 'These standards define requirements for human oversight of AI systems. High-stakes AI decisions require human review before implementation. Human reviewers must have appropriate training and authority. Override mechanisms allow humans to reject AI recommendations. Escalation procedures exist for uncertain or edge cases. Human oversight activities are documented and auditable. Review thresholds are risk-calibrated based on decision impact. Feedback loops ensure human insights improve AI systems. Workload monitoring prevents reviewer fatigue affecting quality.' },
    ],
  },
  {
    category: 'Risk Management',
    icon: AlertTriangle,
    iconColor: 'text-orange-600',
    iconBg: 'bg-orange-50',
    items: [
      { title: 'AI Risk Assessment Framework', description: 'Methodology for evaluating risks associated with AI implementations.', fullText: 'This framework provides methodology for evaluating AI implementation risks. Risk categories include operational, reputational, regulatory, and strategic risks. Risk assessment is required before AI project approval. Risk scoring considers likelihood, impact, and velocity. Risk mitigation plans are mandatory for medium and high risks. Residual risk acceptance requires appropriate management approval. Risk registers are maintained for all AI systems. Quarterly risk reviews identify emerging threats. Risk appetite statements guide AI investment decisions.' },
      { title: 'Incident Response Procedures', description: 'Steps to follow when AI-related issues occur.', fullText: 'These procedures define steps for responding to AI-related incidents. Incident classification determines response urgency and escalation path. Initial response includes system isolation if necessary to prevent further harm. Root cause analysis is mandatory for all significant incidents. Customer notification requirements are defined by incident severity. Regulatory reporting timelines are specified. Post-incident reviews identify lessons learned. Remediation tracking ensures issues are fully resolved. Incident metrics are reported to leadership monthly. Tabletop exercises test response readiness annually.' },
      { title: 'Third-Party AI Vendor Guidelines', description: 'Requirements for evaluating and using external AI services.', fullText: 'These guidelines establish requirements for third-party AI vendors. Vendor due diligence includes security, privacy, and ethics assessments. Contractual requirements specify data handling, liability, and audit rights. Vendor risk assessments are updated annually. Performance monitoring ensures service level adherence. Data portability requirements prevent vendor lock-in. Exit strategies are documented for critical AI services. Vendor concentration risk is monitored and managed. Subcontractor oversight requirements flow through to vendors. Vendor incident notification requirements are contractually defined.' },
    ],
  },
];

const PoliciesGovernance = () => {
  const [selectedPolicy, setSelectedPolicy] = useState<PolicyItem | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        <Link to="/">
          <Button variant="ghost" size="sm" className="gap-2 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </Link>

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">AI Policies & Governance</h1>
          <p className="text-muted-foreground">
            Comprehensive library of policies and governance documents for AI agents
          </p>
        </div>

        <div className="space-y-6">
          {policies.map((category) => {
            const Icon = category.icon;
            return (
              <Card key={category.category}>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg ${category.iconBg} flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 ${category.iconColor}`} />
                    </div>
                    {category.category}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {category.items.map((item) => (
                      <button
                        key={item.title}
                        onClick={() => setSelectedPolicy(item)}
                        className="group flex items-start gap-3 p-4 rounded-lg border border-border hover:border-primary/50 hover:shadow-md transition-all duration-200 bg-background text-left w-full"
                      >
                        <FileText className="w-5 h-5 text-muted-foreground group-hover:text-primary mt-0.5 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
                            {item.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {item.description}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>

      <Dialog open={!!selectedPolicy} onOpenChange={() => setSelectedPolicy(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              {selectedPolicy?.title}
            </DialogTitle>
            <DialogDescription>{selectedPolicy?.description}</DialogDescription>
          </DialogHeader>
          <div className="mt-4 text-foreground leading-relaxed">
            {selectedPolicy?.fullText}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PoliciesGovernance;
