import { useState, useMemo } from 'react';
import EnterpriseHeader from '@/components/EnterpriseHeader';
import { Shield, FileText, Scale, Users, AlertTriangle, Search, BookOpen, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import acceptableUsePdf from '@/assets/acceptable_use_of_ai_tools_policy.pdf';
import governancePdf from '@/assets/AI Governance at Coaction - Draft.pdf';

interface PolicyItem {
  title: string;
  description: string;
  fullText: string;
  pdfUrl?: string;
  pdfPage?: number;
}

const normalizeSearchText = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const policies = [
  {
    category: 'Definitions & Scope',
    icon: BookOpen,
    iconColor: 'text-black',
    iconBg: 'bg-indigo-50',
    cardStyle: 'border-indigo-200 bg-indigo-50/60 hover:border-indigo-400 hover:bg-indigo-100/80',
    items: [
      { title: 'Purpose & Scope of the Policy', description: 'Expectations and scope for employee use of AI tools.', fullText: 'The purpose of this Policy is to establish expectations and guidelines for the appropriate use of artificial intelligence (AI) tools in the workplace. This Policy aims to ensure that AI technology is used in a lawful and ethical manner to enhance productivity, efficiency, and decision-making, while complying with applicable law and respecting privacy, confidentiality, and data security. This Policy applies to all Company full-time employees, part-time employees, temporary workers and contractors. It applies to the use of AI Tools when conducting Company business whether on a Company-provided or non-company provided device.', pdfUrl: acceptableUsePdf, pdfPage: 1 },
      { title: 'AI Tools Defined', description: 'Definition of AI tools and included/excluded examples.', fullText: 'AI Tools are any software, system, service, model, or feature that uses machine-learning, generative, statistical, or other artificial-intelligence methods to: generate or transform content or synthetic media (including code); produce predictions, classifications, recommendations, or summaries; extract patterns or meaning from data; or autonomously or semi-autonomously orchestrate actions or decisions. This includes general models and copilots (LLMs, image/audio models), domain models (fraud/risk scoring), computer vision, speech-to-text/text-to-speech, recommendation systems, retrieval-augmented systems, and agentic automations. Embedded AI features inside applications are also included. Purely deterministic tools such as spreadsheets, calculators, SQL, traditional business-rule engines, and basic RPA/macros that do not learn from data are excluded.', pdfUrl: acceptableUsePdf, pdfPage: 1 },
      { title: 'Approved vs. Unapproved AI Tools', description: 'Definition of approved tools (e.g. Microsoft Copilot Chat) and unapproved tools accessible via public websites.', fullText: 'Approved AI Tools are those developed by the Company or obtained from a third-party vendor to which you have been provided access for use within the scope of your employment. Approved AI Tools include Microsoft Copilot Chat. You are encouraged to take advantage of Approved AI Tools for their intended purpose. Unapproved AI Tools are those that have not been approved by the Company but to which you may still have access via a public website or other similar means. If there is any question as to whether a particular tool is considered an AI Tool or whether it is Approved or Unapproved, please contact Ramana Narayanam, Head of Information Technology.', pdfUrl: acceptableUsePdf, pdfPage: 1 },
    ],
  },
  {
    category: 'Rules for All AI Tools',
    icon: Shield,
    iconColor: 'text-black',
    iconBg: 'bg-amber-50',
    cardStyle: 'border-amber-200 bg-amber-50/60 hover:border-amber-400 hover:bg-amber-100/80',
    items: [
      { title: 'Rules Applicable to the Use of All AI Tools (Part 1)', description: 'General rules and prohibitions for all AI tool usage.', fullText: 'AI Tools may produce inaccurate, misleading, or biased outputs and can amplify existing inequalities or violate privacy expectations. Many AI Tools are prone to hallucinations, bias, false answers, or stale information — responses must always be carefully verified by a human. Key rules: Do not represent AI-generated work as your own original work. Do not integrate any AI Tools with internal Company software without written permission from your manager and Ramana Narayanam, SVP Head of IT. Employees are prohibited from using AI Tools in claims handling, including drafting coverage letters, assessing injury or damages, unless specifically provided by the Company for that purpose.', pdfUrl: acceptableUsePdf, pdfPage: 2 },
      { title: 'Rules Applicable to the Use of All AI Tools (Part 2)', description: 'Additional rules and prohibited uses for AI tools.', fullText: 'Employees are prohibited from using AI Tools in underwriting, rating, risk selection and pricing of insurance products unless specifically provided by the Company. Employees are prohibited from using AI Tools in recruitment, screening of candidates, or internal employment decisions — any attempt must be approved by Legal and HR in writing. Unless approved by Ramana Narayanam, Employees are prohibited from developing or deploying agentic automation. When using AI Tools, you must inform your manager about the extent of Unapproved AI Tool usage and verify that AI-generated information is accurate. Use of AI Tools to transcribe, record, or summarize meetings is prohibited unless authorized by HR and Legal.', pdfUrl: acceptableUsePdf, pdfPage: 2 },
    ],
  },
  {
    category: 'Rules for Unapproved AI Tools',
    icon: AlertTriangle,
    iconColor: 'text-black',
    iconBg: 'bg-red-50',
    cardStyle: 'border-red-200 bg-red-50/60 hover:border-red-400 hover:bg-red-100/80',
    items: [
      { title: 'Rules Applicable to the Use of Unapproved AI Tools', description: 'Additional restrictions including prohibition on uploading confidential information.', fullText: 'Do not upload or input any Confidential Information into any Unapproved AI Tool. This includes: submissions from insureds or distribution partners; passwords and credentials; personally identifiable information about any person; protected health information; Company financial information; documents marked Confidential, Sensitive, or Proprietary; and any non-public Company information. Uploading Confidential Information into an Unapproved AI Tool may breach confidentiality obligations, risks widespread disclosure, and may cause the Company\'s rights to that information to be challenged. Employees must also comply with the Company\'s Code of Business Conduct & Ethics and relevant provisions of the Employee Handbook.', pdfUrl: acceptableUsePdf, pdfPage: 3 },
    ],
  },
  {
    category: 'Enforcement & Employee Rights',
    icon: Scale,
    iconColor: 'text-black',
    iconBg: 'bg-cyan-50',
    cardStyle: 'border-cyan-200 bg-cyan-50/60 hover:border-cyan-400 hover:bg-cyan-100/80',
    items: [
      { title: 'Violations of This Policy', description: 'Consequences for policy violations.', fullText: 'Violations of this Policy may result in disciplinary action, up to and including termination of employment or contract. Nothing herein shall modify the at-will nature of an employee\'s employment with the Company. If Employees have questions about this policy, they should contact the Company\'s Legal Department at LegalDept@coactionspecialty.com.', pdfUrl: acceptableUsePdf, pdfPage: 4 },
      { title: 'Non-Interference with Protected Activity', description: 'Statement of employee rights and protected activity.', fullText: 'Nothing in this Policy is designed or intended to interfere with, restrain, or prevent employee communications regarding wages, hours, other terms and conditions of employment or any other rights protected by the National Labor Relations Act.', pdfUrl: acceptableUsePdf, pdfPage: 4 },
      { title: 'Policy Changes', description: 'Policy amendment and change notice section.', fullText: 'AI technology and the laws and regulations governing AI are rapidly evolving and as such, this Policy may be amended from time to time to reflect the evolving landscape.', pdfUrl: acceptableUsePdf, pdfPage: 4 },
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
      { title: 'AI Governance Program', description: 'Board-approved written program governing AI across the entire organization.', fullText: 'Coaction must maintain a formal, board-approved written program that governs AI across the entire organization. This is a live program with named owners, active processes, and documented evidence of operation. The program covers every AI system used across every function — underwriting, claims, finance, operations, producer services, compliance, and any other area where AI influences a process or outcome. It covers the full lifecycle of each system — from acquisition or build, through deployment, ongoing monitoring, and retirement. All three AI categories are included: predictive models, agentic platforms, and neuro-symbolic systems. Both internally built systems and vendor-supplied systems are covered, as well as AI introduced into processes operated by third-party service partners.', pdfUrl: governancePdf, pdfPage: 2 },
      { title: 'AI Inventory and Tracking', description: 'Complete, up-to-date inventory of every AI system in use across the organization.', fullText: 'Coaction must maintain a complete, up-to-date inventory of every AI system in use, under active development, under evaluation, or recently retired — across every business function and division. For each entry, the inventory captures: what the system does and what processes it influences; which AI category it belongs to (predictive, agentic, neuro-symbolic, or combination); what data it uses and where that data comes from; who owns it internally, and if externally supplied, who the vendor is; its current deployment status and scope; when it was last validated and when the next review is due; and whether it operates within a third-party or BPO-managed process. Maintaining the inventory is an ongoing operational obligation, not a one-time exercise. This is the first document a regulator will ask for.', pdfUrl: governancePdf, pdfPage: 3 },
      { title: 'Documented Model and System Governance', description: 'Comprehensive documentation for every AI system covering purpose, validation, monitoring, and lifecycle.', fullText: 'For every AI system in the inventory, Coaction must maintain documentation covering: the system\'s purpose, intended use, and the processes it is designed to support; the data used to build or train it (source, lineage, quality, and suitability); how it was validated before deployment; its known limitations and controls on use; how its performance is monitored; what triggers a review or retirement decision; and how drift or degradation is detected and addressed. For predictive and analytical models, this includes a plain-language model narrative. For agentic AI systems, documentation must cover the defined scope of autonomous action, Human-in-the-Loop design, exception rate thresholds, and change control procedures.', pdfUrl: governancePdf, pdfPage: 3 },
      { title: 'Board and Management Accountability', description: 'Executive ownership and board oversight of AI governance as an enterprise obligation.', fullText: 'AI governance at Coaction is an enterprise obligation owned at the top of the organization — not delegated to any single function. The board must approve AI governance policies and review them at least annually. Senior management must establish and maintain the program, assign qualified owners across functions, oversee AI risk, and take prompt remedial action when problems are identified. A cross-functional governance structure — spanning underwriting, claims, finance, operations, actuarial, data science, legal, compliance, and risk — must be in place and actively operating. Regular, substantive reporting on AI risk must reach the board.', pdfUrl: governancePdf, pdfPage: 7 },
    ],
  },
  {
    category: 'Operational Controls',
    icon: AlertTriangle,
    iconColor: 'text-black',
    iconBg: 'bg-orange-50',
    cardStyle: 'border-orange-200 bg-orange-50/60 hover:border-orange-400 hover:bg-orange-100/80',
    items: [
      { title: 'Human-in-the-Loop Governance', description: 'Design and controls for human review of AI decisions as a primary governance control.', fullText: 'For all agentic and neuro-symbolic AI systems operating across Coaction, Human-in-the-Loop (HITL) design is a primary governance control — not an afterthought. Every agent deployment must document: the specific conditions under which human review is required; the escalation path and who receives exceptions; the target exception rate and threshold for system review; and how HITL performance is tracked over time. HITL design must be reviewed as part of every revalidation cycle. A system whose exception rate is trending toward zero requires as much scrutiny as one whose exception rate is too high — both indicate the system may not be operating as intended.', pdfUrl: governancePdf, pdfPage: 4 },
      { title: 'Ongoing Monitoring and Revalidation', description: 'Active monitoring and regular revalidation processes for all deployed AI systems.', fullText: 'Deploying an AI system is not the end of the governance obligation — it is the beginning. Coaction must maintain active monitoring for every AI system in production across all functions, including: performance tracking against documented baselines; detection of model or system drift and degradation in accuracy or reliability; a defined revalidation cadence triggered by time passage, material system changes, or significant business environment changes; and clear escalation paths with named accountability. For agentic systems, monitoring must also track operational outcomes — not just technical performance.', pdfUrl: governancePdf, pdfPage: 5 },
    ],
  },
  {
    category: 'Compliance & Regulatory',
    icon: Scale,
    iconColor: 'text-black',
    iconBg: 'bg-amber-50',
    cardStyle: 'border-amber-200 bg-amber-50/60 hover:border-amber-400 hover:bg-amber-100/80',
    items: [
      { title: 'Actuarial Validity of AI-Derived Variables', description: 'Requirements for actuarial defensibility of AI-derived factors in underwriting and pricing.', fullText: 'Any AI-derived factor used in underwriting, pricing, or reserving must be actuarially supportable. Coaction must be able to demonstrate: a clear, empirical, statistically significant relationship between the variable and the risk being assessed; that the variable is not prohibited by applicable insurance law; and that its use produces consistent treatment of similarly situated risks. For commercial lines — and particularly for long-tail lines — this obligation is heightened. AI systems that influence reserving, including neuro-symbolic platforms used in claims severity assessment or litigation risk detection, are subject to the same actuarial defensibility standard as underwriting models.', pdfUrl: governancePdf, pdfPage: 5 },
      { title: 'Explainability Across All AI Categories', description: 'Requirement to explain AI system operations in plain language for all stakeholders.', fullText: 'Coaction must be able to explain how each AI system operates in plain language that connects inputs to outputs in a logically intuitive way. This applies equally to predictive models used in underwriting and pricing, agentic systems routing documents or processing requests, and neuro-symbolic systems combining pattern recognition with rule-based logic. "The vendor\'s model produced this result" is not an acceptable answer — to a regulator, auditor, senior leader, or a producer or policyholder who asks why a decision was made.', pdfUrl: governancePdf, pdfPage: 6 },
      { title: 'Examination Readiness', description: 'Preparation and documentation requirements for regulatory examinations of AI governance.', fullText: 'NAIC and NYDFS have signaled clearly that they will examine AI governance. Coaction must be able to produce on request: the written AI governance program; the complete AI inventory; system documentation for any AI system under review; evidence of validation, testing, and drift monitoring; vendor due diligence files and contracts; board minutes evidencing governance oversight; HITL design documentation for agentic systems; and training records. The question is not whether Coaction will face an AI governance examination — it is whether we will be ready when it happens.', pdfUrl: governancePdf, pdfPage: 8 },
    ],
  },
  {
    category: 'Vendor & Third-Party Management',
    icon: Users,
    iconColor: 'text-black',
    iconBg: 'bg-cyan-50',
    cardStyle: 'border-cyan-200 bg-cyan-50/60 hover:border-cyan-400 hover:bg-cyan-100/80',
    items: [
      { title: 'Vendor and Partner Accountability', description: 'Requirements for ensuring third-party AI systems meet Coaction governance standards.', fullText: 'Coaction cannot outsource its AI governance obligations. For every third-party AI system, external data source, bought agent platform, or AI-enabled service operated by a partner on Coaction\'s behalf, the following must be in place: a documented due diligence process conducted before adoption; contractual terms establishing audit rights and regulatory cooperation; active exercise of those audit rights — not just having them on paper; and an obligation on the vendor to operate to governance standards equivalent to those Coaction applies to its own systems. If a vendor\'s system produces an outcome that violates applicable law or governance standards, that is Coaction\'s problem to remediate. Vendor relationships do not transfer accountability.', pdfUrl: governancePdf, pdfPage: 6 },
    ],
  },
  {
    category: 'Ethics & Training',
    icon: Users,
    iconColor: 'text-black',
    iconBg: 'bg-rose-50',
    cardStyle: 'border-rose-200 bg-rose-50/60 hover:border-rose-400 hover:bg-rose-100/80',
    items: [
      { title: 'AI Ethics Guidelines', description: 'Principles for responsible and fair AI usage.', fullText: 'These guidelines establish principles for responsible AI usage. AI systems must be designed and operated with fairness, transparency, and accountability. Human dignity and autonomy must be respected in all AI applications. AI should not perpetuate or amplify societal biases. Environmental impact of AI systems should be considered and minimized. Stakeholder interests must be balanced in AI decision-making. Regular ethics reviews assess AI systems against these principles. An AI Ethics Committee provides guidance on complex ethical issues.', pdfUrl: governancePdf, pdfPage: 7 },
      { title: 'Training and Organizational Readiness', description: 'Personnel training and organizational preparation for responsible AI use across all roles and functions.', fullText: 'All Coaction personnel who interact with, rely on, or are responsible for AI systems must be trained on the responsible and lawful use of those systems. Training must be: tailored to each person\'s specific role and the AI systems they work with; completed promptly on onboarding and refreshed on a regular cadence; and documented, with records maintained and available for examination. Training is not limited to technical staff. Senior leaders, underwriters, claims professionals, operations managers, and finance personnel who use AI-assisted outputs in their work are all within scope. Training records must be maintained and producible for regulatory examination.', pdfUrl: governancePdf, pdfPage: 7 },
    ],
  },
  {
    category: 'AI Landscape at Coaction',
    icon: BookOpen,
    iconColor: 'text-black',
    iconBg: 'bg-teal-50',
    cardStyle: 'border-teal-200 bg-teal-50/60 hover:border-teal-400 hover:bg-teal-100/80',
    items: [
      { title: 'Predictive and Analytical Models', description: 'AI systems supporting underwriting, pricing, reserving, and fraud detection decisions.', fullText: 'AI systems that analyze data to support underwriting, pricing, reserving, and fraud detection decisions. These are subject to the most direct regulatory scrutiny under NAIC and NYDFS guidance and require full actuarial defensibility.', pdfUrl: governancePdf, pdfPage: 1 },
      { title: 'Agentic AI (Operational Automation)', description: 'AI agents that autonomously execute multi-step operational tasks across business functions.', fullText: 'AI agents that autonomously execute multi-step operational tasks across any business function — including but not limited to claims processing, policy servicing, financial operations, document management, and producer services. These systems act on behalf of Coaction and are fully subject to this governance framework even where they do not directly influence underwriting or pricing.', pdfUrl: governancePdf, pdfPage: 1 },
      { title: 'Neuro-Symbolic Platforms', description: 'AI systems combining neural pattern recognition with symbolic rule-based reasoning.', fullText: 'AI systems that combine neural pattern recognition with symbolic rule-based reasoning. These may operate across both analytical and operational domains simultaneously — for example, identifying litigation risk signals in claims while also routing correspondence. Both the neural and symbolic layers require separate, documented governance controls. Any system that does not clearly fit one category should be treated as fitting all three until a determination is made.', pdfUrl: governancePdf, pdfPage: 1 },
    ],
  },
  {
    category: 'The Practical Test',
    icon: AlertTriangle,
    iconColor: 'text-black',
    iconBg: 'bg-amber-50',
    cardStyle: 'border-amber-200 bg-amber-50/60 hover:border-amber-400 hover:bg-amber-100/80',
    items: [
      { title: 'Do we know what AI we are running?', description: 'Inventory completeness across every function and division.', fullText: 'Is the inventory complete, current, and maintained — across every function and division, not just underwriting?', pdfUrl: governancePdf, pdfPage: 8 },
      { title: 'Can we explain what each system does and why?', description: 'Plain-language narratives for every material AI system.', fullText: 'Is there a plain-language narrative for every material AI system, covering all three AI categories?', pdfUrl: governancePdf, pdfPage: 8 },
      { title: 'Do we know if our systems are still working as intended?', description: 'Active monitoring with drift detection and escalation paths.', fullText: 'Is there active monitoring with documented drift detection, exception rate tracking, and escalation paths?', pdfUrl: governancePdf, pdfPage: 8 },
      { title: 'Can we defend every AI-derived variable actuarially?', description: 'Actuarial support for factors used in underwriting, pricing, and reserving.', fullText: 'Are factors used in underwriting, pricing, and reserving supported by documented actuarial analysis?', pdfUrl: governancePdf, pdfPage: 8 },
      { title: 'Are we genuinely accountable for our vendors and partners?', description: 'Audit rights exercised, including for agentic platform vendors and BPO partners.', fullText: 'Do we have audit rights — and have we exercised them, including for agentic platform vendors and BPO partners?', pdfUrl: governancePdf, pdfPage: 8 },
      { title: 'Are our HITL controls documented and functioning?', description: 'Exception design documented, monitored, and reviewed for every agent deployment.', fullText: 'For every agent deployment, is the exception design documented, monitored, and reviewed?', pdfUrl: governancePdf, pdfPage: 8 },
      { title: 'Could we hand a regulator our documentation today?', description: 'Governance program approved, evidenced, and examination-ready.', fullText: 'Is the governance program approved, evidenced, and examination-ready across the full scope of Coaction\'s AI use? If the answer to any of these is no, that is a gap. Identifying the gap is the first step. Closing it — with documented, evidenced action — is the obligation.', pdfUrl: governancePdf, pdfPage: 8 },
    ],
  },
];

const PoliciesGovernance = () => {
  const [selectedPolicy, setSelectedPolicy] = useState<PolicyItem | null>(null);
  const [showDocumentPreview, setShowDocumentPreview] = useState(false);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'policies' | 'governance'>('policies');

  const activeData = activeTab === 'policies' ? policies : governanceItems;

  const filteredItems = useMemo(() => {
    const normalizedQuery = normalizeSearchText(search);
    if (!normalizedQuery) return activeData;

    const terms = normalizedQuery.split(' ').filter(Boolean);

    return activeData
      .map((category) => ({
        ...category,
        items: category.items.filter(
          (item) => {
            const searchableText = normalizeSearchText(
              `${category.category} ${item.title} ${item.description} ${item.fullText}`,
            );

            return terms.every((term) => searchableText.includes(term));
          },
        ),
      }))
      .filter((category) => category.items.length > 0);
  }, [search, activeData]);

  return (
    <div className="min-h-screen bg-slate-50">
      <EnterpriseHeader
        portalName="Enterprise AI Portal"
        color="bg-blue-100"
        pageTitle="AI Policies & Governance"
        pageDescription="Comprehensive library of policies and governance documents for AI agents."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Policies & Governance' },
        ]}
        icon={<Shield className="w-5 h-5 text-black" />}
      />

      <main className="w-full max-w-[1900px] mx-auto px-6 xl:px-12 py-8">

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
                  ? 'bg-blue-700 text-white shadow-sm'
                  : 'text-slate-600 hover:text-blue-700 hover:bg-blue-50'
              }`}
            >
              Policies
            </button>
            <button
              onClick={() => { setActiveTab('governance'); setSearch(''); }}
              className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                activeTab === 'governance'
                  ? 'bg-blue-700 text-white shadow-sm'
                  : 'text-slate-600 hover:text-blue-700 hover:bg-blue-50'
              }`}
            >
              Governance
            </button>
          </div>

          {/* Document button */}
          {activeTab === 'policies' && (
            <button
              onClick={() => {
                setSelectedPolicy({
                  title: 'Employee Acceptable Use Policy',
                  description: 'Employee Acceptable Use of AI Tools Policy',
                  fullText: '',
                  pdfUrl: acceptableUsePdf,
                });
                setShowDocumentPreview(true);
              }}
              title="View the full document for Employee Acceptable Use of AI Tools Policy"
              className="inline-flex items-center gap-2.5 rounded-xl border border-blue-200 bg-blue-50 px-5 py-3 text-sm font-medium text-blue-700 shadow-sm hover:bg-blue-100 hover:border-blue-300 transition-all duration-200"
            >
              <BookOpen className="w-4 h-4" />
              Employee Acceptable Use Policy
            </button>
          )}
          {activeTab === 'governance' && (
            <button
              onClick={() => {
                setSelectedPolicy({
                  title: 'AI Governance at Coaction',
                  description: 'Comprehensive governance framework for AI at Coaction',
                  fullText: '',
                  pdfUrl: governancePdf,
                });
                setShowDocumentPreview(true);
              }}
              title="View the governance document"
              className="inline-flex items-center gap-2.5 rounded-xl border border-blue-200 bg-blue-50 px-5 py-3 text-sm font-medium text-blue-700 shadow-sm hover:bg-blue-100 hover:border-blue-300 transition-all duration-200"
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
                        onClick={() => {
                          setSelectedPolicy(item);
                          setShowDocumentPreview(false);
                        }}
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

      <Dialog
        open={!!selectedPolicy}
        onOpenChange={() => {
          setSelectedPolicy(null);
          setShowDocumentPreview(false);
        }}
      >
        <DialogContent
          className={
            showDocumentPreview
              ? 'max-w-3xl h-[70vh] flex flex-col'
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

          {selectedPolicy?.fullText && (
            <div className="mt-4 text-foreground leading-relaxed">
              {selectedPolicy.fullText}
            </div>
          )} 

          {showDocumentPreview && selectedPolicy?.pdfUrl && (
            <iframe
              src={selectedPolicy.pdfUrl}
              title={selectedPolicy.title}
              className="flex-1 w-full rounded-lg border border-slate-200 mt-2"
            />
          )}

          {selectedPolicy?.pdfUrl && (
            <div className="mt-3">
              <a
                href={selectedPolicy.pdfPage ? `${selectedPolicy.pdfUrl}#page=${selectedPolicy.pdfPage}` : selectedPolicy.pdfUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                View in Document
              </a>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PoliciesGovernance;