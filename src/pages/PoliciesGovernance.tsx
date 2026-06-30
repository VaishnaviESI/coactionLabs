import { useState, useMemo } from 'react';
import EnterpriseHeader from '@/components/EnterpriseHeader';
import { Shield, FileText, Scale, Users, AlertTriangle, Search, BookOpen, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import acceptableUsePdf from '@/assets/acceptable_use_of_ai_tools_policy.pdf';

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


const PoliciesGovernance = () => {
  const [selectedPolicy, setSelectedPolicy] = useState<PolicyItem | null>(null);
  const [showDocumentPreview, setShowDocumentPreview] = useState(false);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'policies' | 'governance'>('policies');

  const activeData = activeTab === 'policies' ? policies : [];

  const filteredItems = useMemo(() => {
    if (activeTab !== 'policies') return [];
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
        </div>

        {activeTab === 'governance' && (
          <Card className="border-2 border-indigo-100 bg-white/70 backdrop-blur-sm">
            <CardContent className="py-16 text-center">
              <Shield className="w-10 h-10 text-blue-700 mx-auto mb-4" />
              <p className="text-base text-slate-700">
                Please contact Joshua Grajewski or Ashok Narayana for any details on AI Governance.
              </p>
            </CardContent>
          </Card>
        )}

        {activeTab === 'policies' && filteredItems.length === 0 && (
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