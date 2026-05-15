import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import EnterpriseHeader from '@/components/EnterpriseHeader';
import { ArrowLeft, Shield, FileText, Scale, Lock, Users, AlertTriangle, Search, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import acceptableUsePdf from '@/assets/acceptable_use_of_ai_tools_policy.pdf';
import governancePdf from '@/assets/AI Governance at Coaction - Draft.pdf';

interface PolicyItem {
  title: string;
  description: string;
  fullText: string;
  pdfUrl?: string;
}

const policies = [
  {
    category: 'Core Policies',
    icon: Shield,
    iconColor: 'text-black',
    iconBg: 'bg-indigo-50',
    cardStyle: 'border-indigo-200 bg-indigo-50/60 hover:border-indigo-400 hover:bg-indigo-100/80',
    items: [
      { title: 'AI Acceptable Use Policy', description: 'Guidelines for appropriate use of AI tools and agents within the organization.', fullText: 'This policy establishes the acceptable use guidelines for AI tools and agents within our organization. All employees must use AI systems responsibly, ensuring outputs are reviewed before use in business decisions. AI should augment human judgment, not replace it. Users must not input confidential client information into external AI systems without proper authorization. Any AI-generated content must be clearly labeled when shared externally. Violations of this policy may result in disciplinary action. Regular training on AI acceptable use will be provided to all staff members.', pdfUrl: acceptableUsePdf },
      { title: 'AI Agent Development Standards', description: 'Technical and ethical standards for creating and deploying AI agents.', fullText: 'These standards govern the development and deployment of AI agents within our organization. All AI agents must undergo rigorous testing before deployment, including bias testing, performance validation, and security assessment. Developers must document all training data sources and model architectures. AI agents must include appropriate logging for audit purposes. Version control and rollback capabilities are mandatory. All agents must be reviewed by the AI Ethics Committee before production deployment. Continuous monitoring must be implemented to detect model drift or degradation.' },
      { title: 'Prompt Engineering Best Practices', description: 'Approved techniques and patterns for crafting effective AI prompts.', fullText: 'This document outlines approved techniques for crafting effective AI prompts. Prompts should be clear, specific, and include relevant context. Use structured formats when requesting specific output types. Include guardrails and constraints to prevent unwanted outputs. Test prompts with edge cases before production use. Document prompt versions and their intended purposes. Avoid prompts that could elicit harmful, biased, or confidential information. Regular prompt audits should be conducted to ensure continued effectiveness and compliance.' },
    ],
  },
  {
    category: 'Data & Privacy',
    icon: Lock,
    iconColor: 'text-black',
    iconBg: 'bg-emerald-50',
    cardStyle: 'border-emerald-200 bg-emerald-50/60 hover:border-emerald-400 hover:bg-emerald-100/80',
    items: [
      { title: 'Data Handling in AI Interactions', description: 'Rules for managing sensitive data when using AI agents.', fullText: 'This policy defines rules for managing sensitive data in AI interactions. Personal Identifiable Information (PII) must be anonymized or pseudonymized before processing by AI systems. Data retention periods for AI interactions are limited to 90 days unless otherwise required. All data transfers to AI systems must use encrypted channels. Users must classify data sensitivity before AI processing. High-sensitivity data requires additional approval workflows. Regular data audits ensure compliance with these requirements.' },
      { title: 'Privacy Impact Assessment Guide', description: 'Framework for evaluating privacy implications of AI deployments.', fullText: 'This framework guides the evaluation of privacy implications for AI deployments. All new AI implementations require a Privacy Impact Assessment (PIA) before launch. The PIA must identify all data types processed, storage locations, access controls, and retention periods. Risk mitigation strategies must be documented for each identified privacy risk. Third-party AI services require enhanced due diligence. Annual reviews of existing AI systems ensure continued privacy compliance. The Data Protection Officer must approve all PIAs.' },
      { title: 'Customer Data Protection Standards', description: 'Safeguards for customer information in AI-assisted processes.', fullText: 'These standards establish safeguards for customer information in AI-assisted processes. Customer consent must be obtained before using their data for AI processing. Customers have the right to opt-out of AI-assisted services. All customer data used in AI systems must be encrypted at rest and in transit. Access to customer data in AI systems is role-based and logged. Customer data cannot be used for AI model training without explicit consent. Data breach notification procedures specific to AI systems are defined.' },
    ],
  },
  {
    category: 'Compliance & Regulatory',
    icon: Scale,
    iconColor: 'text-black',
    iconBg: 'bg-amber-50',
    cardStyle: 'border-amber-200 bg-amber-50/60 hover:border-amber-400 hover:bg-amber-100/80',
    items: [
      { title: 'Insurance Industry AI Regulations', description: 'Overview of regulatory requirements specific to insurance AI applications.', fullText: 'This document provides an overview of regulatory requirements for AI in insurance. AI systems used in underwriting must comply with fair lending laws and anti-discrimination regulations. Explainability requirements mandate that AI decisions affecting customers can be explained in plain language. State-specific regulations on AI in claims processing are catalogued and updated quarterly. Regulatory reporting requirements for AI systems are defined. Compliance testing protocols ensure ongoing adherence to evolving regulations. Staff training on insurance-specific AI regulations is mandatory.' },
      { title: 'Model Risk Management Framework', description: 'Governance structure for AI model validation and monitoring.', fullText: 'This framework establishes governance for AI model validation and monitoring. All models must be independently validated before deployment. Model performance metrics and thresholds are defined for each use case. Continuous monitoring detects model drift, bias emergence, and performance degradation. Model inventory is maintained with documentation of purpose, data sources, and limitations. Quarterly model reviews assess continued fitness for purpose. Model retirement procedures ensure orderly decommissioning. Escalation paths for model issues are clearly defined.' },
      { title: 'Audit Trail Requirements', description: 'Documentation standards for AI decision-making processes.', fullText: 'These requirements define documentation standards for AI decision-making. All AI decisions affecting customers or business outcomes must be logged with timestamps. Audit logs must capture input data, model version, and output produced. Logs must be retained for a minimum of 7 years. Audit trails must be immutable and tamper-evident. Regular audit log reviews verify completeness and accuracy. External auditor access to AI audit trails is facilitated. Audit trail format standards ensure consistency across systems.' },
    ],
  },
  {
    category: 'Ethics & Accountability',
    icon: Users,
    iconColor: 'text-black',
    iconBg: 'bg-rose-50',
    cardStyle: 'border-rose-200 bg-rose-50/60 hover:border-rose-400 hover:bg-rose-100/80',
    items: [
      { title: 'AI Ethics Guidelines', description: 'Principles for responsible and fair AI usage.', fullText: 'These guidelines establish principles for responsible AI usage. AI systems must be designed and operated with fairness, transparency, and accountability. Human dignity and autonomy must be respected in all AI applications. AI should not perpetuate or amplify societal biases. Environmental impact of AI systems should be considered and minimized. Stakeholder interests must be balanced in AI decision-making. Regular ethics reviews assess AI systems against these principles. An AI Ethics Committee provides guidance on complex ethical issues.' },
      { title: 'Bias Detection & Mitigation', description: 'Procedures for identifying and addressing AI bias.', fullText: 'These procedures outline methods for identifying and addressing AI bias. Pre-deployment bias testing is mandatory for all customer-facing AI systems. Protected characteristics must be evaluated for disparate impact. Statistical parity metrics are defined for key use cases. Bias monitoring is continuous post-deployment. Bias remediation procedures include retraining, threshold adjustment, or system modification. Bias incidents are reported and tracked. Annual bias audits by independent parties are conducted. Training on bias awareness is provided to all AI practitioners.' },
      { title: 'Human Oversight Requirements', description: 'Standards for human review of AI-generated outputs.', fullText: 'These standards define requirements for human oversight of AI systems. High-stakes AI decisions require human review before implementation. Human reviewers must have appropriate training and authority. Override mechanisms allow humans to reject AI recommendations. Escalation procedures exist for uncertain or edge cases. Human oversight activities are documented and auditable. Review thresholds are risk-calibrated based on decision impact. Feedback loops ensure human insights improve AI systems. Workload monitoring prevents reviewer fatigue affecting quality.' },
    ],
  },
  {
    category: 'Risk Management',
    icon: AlertTriangle,
    iconColor: 'text-black',
    iconBg: 'bg-orange-50',
    cardStyle: 'border-orange-200 bg-orange-50/60 hover:border-orange-400 hover:bg-orange-100/80',
    items: [
      { title: 'AI Risk Assessment Framework', description: 'Methodology for evaluating risks associated with AI implementations.', fullText: 'This framework provides methodology for evaluating AI implementation risks. Risk categories include operational, reputational, regulatory, and strategic risks. Risk assessment is required before AI project approval. Risk scoring considers likelihood, impact, and velocity. Risk mitigation plans are mandatory for medium and high risks. Residual risk acceptance requires appropriate management approval. Risk registers are maintained for all AI systems. Quarterly risk reviews identify emerging threats. Risk appetite statements guide AI investment decisions.' },
      { title: 'Incident Response Procedures', description: 'Steps to follow when AI-related issues occur.', fullText: 'These procedures define steps for responding to AI-related incidents. Incident classification determines response urgency and escalation path. Initial response includes system isolation if necessary to prevent further harm. Root cause analysis is mandatory for all significant incidents. Customer notification requirements are defined by incident severity. Regulatory reporting timelines are specified. Post-incident reviews identify lessons learned. Remediation tracking ensures issues are fully resolved. Incident metrics are reported to leadership monthly. Tabletop exercises test response readiness annually.' },
      { title: 'Third-Party AI Vendor Guidelines', description: 'Requirements for evaluating and using external AI services.', fullText: 'These guidelines establish requirements for third-party AI vendors. Vendor due diligence includes security, privacy, and ethics assessments. Contractual requirements specify data handling, liability, and audit rights. Vendor risk assessments are updated annually. Performance monitoring ensures service level adherence. Data portability requirements prevent vendor lock-in. Exit strategies are documented for critical AI services. Vendor concentration risk is monitored and managed. Subcontractor oversight requirements flow through to vendors. Vendor incident notification requirements are contractually defined.' },
    ],
  },
];

const governanceItems = [
  {
    category: 'Core Governance Framework',
    icon: Shield,
    iconColor: 'text-black',
    iconBg: 'bg-indigo-50',
    cardStyle: 'border-indigo-200 bg-indigo-50/60 hover:border-indigo-400 hover:bg-indigo-100/80',
    items: [
      { title: 'AI Governance Program', description: 'Board-approved written program governing AI across the entire organization.', fullText: 'Coaction must maintain a formal, board-approved written program that governs AI across the entire organization. This is a live program with named owners, active processes, and documented evidence of operation. The program covers every AI system used across every function — underwriting, claims, finance, operations, producer services, compliance, and any other area where AI influences a process or outcome. It covers the full lifecycle of each system — from acquisition or build, through deployment, ongoing monitoring, and retirement. All three AI categories are included: predictive models, agentic platforms, and neuro-symbolic systems. Both internally built systems and vendor-supplied systems are covered, as well as AI introduced into processes operated by third-party service partners.' },
      { title: 'AI Inventory and Tracking', description: 'Complete, up-to-date inventory of every AI system in use across the organization.', fullText: 'Coaction must maintain a complete, up-to-date inventory of every AI system in use, under active development, under evaluation, or recently retired — across every business function and division. For each entry, the inventory captures: what the system does and what processes it influences; which AI category it belongs to (predictive, agentic, neuro-symbolic, or combination); what data it uses and where that data comes from; who owns it internally, and if externally supplied, who the vendor is; its current deployment status and scope; when it was last validated and when the next review is due; and whether it operates within a third-party or BPO-managed process. Maintaining the inventory is an ongoing operational obligation, not a one-time exercise. This is the first document a regulator will ask for.' },
      { title: 'Documented Model and System Governance', description: 'Comprehensive documentation for every AI system covering purpose, validation, monitoring, and lifecycle.', fullText: 'For every AI system in the inventory, Coaction must maintain documentation covering: the system\'s purpose, intended use, and the processes it is designed to support; the data used to build or train it (source, lineage, quality, and suitability); how it was validated before deployment; its known limitations and controls on use; how its performance is monitored; what triggers a review or retirement decision; and how drift or degradation is detected and addressed. For predictive and analytical models, this includes a plain-language model narrative. For agentic AI systems, documentation must cover the defined scope of autonomous action, Human-in-the-Loop design, exception rate thresholds, and change control procedures.' },
      { title: 'Board and Management Accountability', description: 'Executive ownership and board oversight of AI governance as an enterprise obligation.', fullText: 'AI governance at Coaction is an enterprise obligation owned at the top of the organization — not delegated to any single function. The board must approve AI governance policies and review them at least annually. Senior management must establish and maintain the program, assign qualified owners across functions, oversee AI risk, and take prompt remedial action when problems are identified. A cross-functional governance structure — spanning underwriting, claims, finance, operations, actuarial, data science, legal, compliance, and risk — must be in place and actively operating. Regular, substantive reporting on AI risk must reach the board.' },
    ],
  },
  {
    category: 'Operational Controls',
    icon: AlertTriangle,
    iconColor: 'text-black',
    iconBg: 'bg-orange-50',
    cardStyle: 'border-orange-200 bg-orange-50/60 hover:border-orange-400 hover:bg-orange-100/80',
    items: [
      { title: 'Human-in-the-Loop Governance', description: 'Design and controls for human review of AI decisions as a primary governance control.', fullText: 'For all agentic and neuro-symbolic AI systems operating across Coaction, Human-in-the-Loop (HITL) design is a primary governance control — not an afterthought. Every agent deployment must document: the specific conditions under which human review is required; the escalation path and who receives exceptions; the target exception rate and threshold for system review; and how HITL performance is tracked over time. HITL design must be reviewed as part of every revalidation cycle. A system whose exception rate is trending toward zero requires as much scrutiny as one whose exception rate is too high — both indicate the system may not be operating as intended.' },
      { title: 'Ongoing Monitoring and Revalidation', description: 'Active monitoring and regular revalidation processes for all deployed AI systems.', fullText: 'Deploying an AI system is not the end of the governance obligation — it is the beginning. Coaction must maintain active monitoring for every AI system in production across all functions, including: performance tracking against documented baselines; detection of model or system drift and degradation in accuracy or reliability; a defined revalidation cadence triggered by time passage, material system changes, or significant business environment changes; and clear escalation paths with named accountability. For agentic systems, monitoring must also track operational outcomes — not just technical performance.' },
    ],
  },
  {
    category: 'Compliance & Regulatory',
    icon: Scale,
    iconColor: 'text-black',
    iconBg: 'bg-amber-50',
    cardStyle: 'border-amber-200 bg-amber-50/60 hover:border-amber-400 hover:bg-amber-100/80',
    items: [
      { title: 'Actuarial Validity of AI-Derived Variables', description: 'Requirements for actuarial defensibility of AI-derived factors in underwriting and pricing.', fullText: 'Any AI-derived factor used in underwriting, pricing, or reserving must be actuarially supportable. Coaction must be able to demonstrate: a clear, empirical, statistically significant relationship between the variable and the risk being assessed; that the variable is not prohibited by applicable insurance law; and that its use produces consistent treatment of similarly situated risks. For commercial lines — and particularly for long-tail lines — this obligation is heightened. AI systems that influence reserving, including neuro-symbolic platforms used in claims severity assessment or litigation risk detection, are subject to the same actuarial defensibility standard as underwriting models.' },
      { title: 'Explainability Across All AI Categories', description: 'Requirement to explain AI system operations in plain language for all stakeholders.', fullText: 'Coaction must be able to explain how each AI system operates in plain language that connects inputs to outputs in a logically intuitive way. This applies equally to predictive models used in underwriting and pricing, agentic systems routing documents or processing requests, and neuro-symbolic systems combining pattern recognition with rule-based logic. "The vendor\'s model produced this result" is not an acceptable answer — to a regulator, auditor, senior leader, or a producer or policyholder who asks why a decision was made.' },
      { title: 'Examination Readiness', description: 'Preparation and documentation requirements for regulatory examinations of AI governance.', fullText: 'NAIC and NYDFS have signaled clearly that they will examine AI governance. Coaction must be able to produce on request: the written AI governance program; the complete AI inventory; system documentation for any AI system under review; evidence of validation, testing, and drift monitoring; vendor due diligence files and contracts; board minutes evidencing governance oversight; HITL design documentation for agentic systems; and training records. The question is not whether Coaction will face an AI governance examination — it is whether we will be ready when it happens.' },
    ],
  },
  {
    category: 'Vendor & Third-Party Management',
    icon: Users,
    iconColor: 'text-black',
    iconBg: 'bg-cyan-50',
    cardStyle: 'border-cyan-200 bg-cyan-50/60 hover:border-cyan-400 hover:bg-cyan-100/80',
    items: [
      { title: 'Vendor and Partner Accountability', description: 'Requirements for ensuring third-party AI systems meet Coaction governance standards.', fullText: 'Coaction cannot outsource its AI governance obligations. For every third-party AI system, external data source, bought agent platform, or AI-enabled service operated by a partner on Coaction\'s behalf, the following must be in place: a documented due diligence process conducted before adoption; contractual terms establishing audit rights and regulatory cooperation; active exercise of those audit rights — not just having them on paper; and an obligation on the vendor to operate to governance standards equivalent to those Coaction applies to its own systems. If a vendor\'s system produces an outcome that violates applicable law or governance standards, that is Coaction\'s problem to remediate. Vendor relationships do not transfer accountability.' },
    ],
  },
  {
    category: 'Ethics & Training',
    icon: Users,
    iconColor: 'text-black',
    iconBg: 'bg-rose-50',
    cardStyle: 'border-rose-200 bg-rose-50/60 hover:border-rose-400 hover:bg-rose-100/80',
    items: [
      { title: 'AI Ethics Guidelines', description: 'Principles for responsible and fair AI usage.', fullText: 'These guidelines establish principles for responsible AI usage. AI systems must be designed and operated with fairness, transparency, and accountability. Human dignity and autonomy must be respected in all AI applications. AI should not perpetuate or amplify societal biases. Environmental impact of AI systems should be considered and minimized. Stakeholder interests must be balanced in AI decision-making. Regular ethics reviews assess AI systems against these principles. An AI Ethics Committee provides guidance on complex ethical issues.' },
      { title: 'Training and Organizational Readiness', description: 'Personnel training and organizational preparation for responsible AI use.', fullText: 'All Coaction personnel who interact with, rely on, or are responsible for AI systems must be trained on the responsible and lawful use of those systems. Training must be tailored to each person\'s specific role and the AI systems they work with; completed promptly on onboarding and refreshed on a regular cadence; and documented with records maintained and available for examination. Training is not limited to technical staff — senior leaders, underwriters, claims professionals, operations managers, and finance personnel who use AI-assisted outputs in their work are all within scope.' },
    ],
  },
];

const PoliciesGovernance = () => {
  const [selectedPolicy, setSelectedPolicy] = useState<PolicyItem | null>(null);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'policies' | 'governance'>('policies');

  const activeData = activeTab === 'policies' ? policies : governanceItems;

  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return activeData;
    return activeData
      .map((category) => ({
        ...category,
        items: category.items.filter(
          (item) =>
            item.title.toLowerCase().includes(q) ||
            item.description.toLowerCase().includes(q),
        ),
      }))
      .filter((category) => category.items.length > 0);
  }, [search, activeData]);

  return (
    <div className="min-h-screen bg-slate-50">
      <EnterpriseHeader
        portalName="Enterprise AI Portal"
        pageTitle="AI Policies & Governance"
        pageDescription="Comprehensive library of policies and governance documents for AI agents."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Policies & Governance' },
        ]}
        icon={<Shield className="w-5 h-5 text-black" />}
      />

      <main className="container mx-auto px-6 py-8">

        {/* Search, Tabs, and Document Buttons in one line */}
        <div className="mb-8 flex items-center justify-start gap-3">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-4xl">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search policies…"
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition-all shadow-sm"
            />
          </div>

          {/* Tabs */}
          <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
            <button
              onClick={() => { setActiveTab('policies'); setSearch(''); }}
              className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                activeTab === 'policies'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-indigo-700 hover:bg-indigo-50'
              }`}
            >
              Policies
            </button>
            <button
              onClick={() => { setActiveTab('governance'); setSearch(''); }}
              className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                activeTab === 'governance'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-indigo-700 hover:bg-indigo-50'
              }`}
            >
              Governance
            </button>
          </div>

          {/* Document buttons */}
          {activeTab === 'policies' && (
            <button
              onClick={() => setSelectedPolicy(policies[0].items[0])}
              title="View the full document for AI Acceptable Use Policy"
              className="inline-flex items-center gap-2.5 rounded-xl border border-indigo-200 bg-indigo-50 px-5 py-3 text-sm font-medium text-indigo-700 shadow-sm hover:bg-indigo-100 hover:border-indigo-300 transition-all duration-200"
            >
              <BookOpen className="w-4 h-4" />
              AI Acceptable Use Policy
            </button>
          )}
          {activeTab === 'governance' && (
            <button
              onClick={() =>
                setSelectedPolicy({
                  title: 'AI Governance at Coaction',
                  description: 'Comprehensive governance framework for AI at Coaction',
                  fullText: '',
                  pdfUrl: governancePdf,
                })
              }
              title="View the governance document"
              className="inline-flex items-center gap-2.5 rounded-xl border border-indigo-200 bg-indigo-50 px-5 py-3 text-sm font-medium text-indigo-700 shadow-sm hover:bg-indigo-100 hover:border-indigo-300 transition-all duration-200"
            >
              <BookOpen className="w-4 h-4" />
              AI Governance Framework
            </button>
          )}
        </div>

        {filteredItems.length === 0 && (
          <p className="text-center text-sm text-slate-500 py-12">
            No policies match &ldquo;{search}&rdquo;.
          </p>
        )}

        <div className="space-y-6">
          {filteredItems.map((category) => {
            const Icon = category.icon;
            return (
              <Card
                key={category.category}
                className="border-2 border-indigo-100 bg-white/70 backdrop-blur-sm"
              >
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
                        className={`group flex items-start gap-3 p-4 rounded-lg border hover:shadow-md transition-all duration-200 text-left w-full ${category.cardStyle}`}
                      >
                        <FileText className="w-5 h-5 text-black mt-0.5 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-foreground group-hover:text-indigo-700 transition-colors line-clamp-1">
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
        <DialogContent
          className={
            selectedPolicy?.pdfUrl
              ? 'max-w-5xl h-[90vh] flex flex-col'
              : 'max-w-2xl max-h-[80vh] overflow-y-auto'
          }
        >
          <DialogHeader className="shrink-0">
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-black" />
              {selectedPolicy?.title}
            </DialogTitle>
            <DialogDescription>{selectedPolicy?.description}</DialogDescription>
          </DialogHeader>

          {selectedPolicy?.pdfUrl ? (
            <iframe
              src={selectedPolicy.pdfUrl}
              title={selectedPolicy.title}
              className="flex-1 w-full rounded-lg border border-slate-200 mt-2"
            />
          ) : (
            <div className="mt-4 text-foreground leading-relaxed">
              {selectedPolicy?.fullText}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PoliciesGovernance;
