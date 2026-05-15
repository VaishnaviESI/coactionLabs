import { Link } from 'react-router-dom';
import EnterpriseHeader from '@/components/EnterpriseHeader';
import { Code2, FileText, Brain, ArrowRight, Wrench } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const toolboxItems = [
  {
    id: 1,
    name: 'Microsoft Copilot Chat Authenticated',
    description: 'Access Microsoft Copilot Chat with secure authentication for enhanced AI-powered conversations.',
    tag: 'developer',
    govStatus: 'approved',
    audience: 'All Teams',
    icon: Brain,
    color: 'bg-blue-100 text-blue-700',
  },
  {
    id: 2,
    name: 'GitHub Copilot',
    description: 'AI-powered code completion and generation integrated with your development workflow.',
    tag: 'developer',
    govStatus: 'approved',
    audience: 'Development Team',
    icon: Code2,
    color: 'bg-emerald-100 text-emerald-700',
  },
  {
    id: 3,
    name: 'Rivvit',
    description: 'Collaborative AI tool for team communication and knowledge sharing.',
    tag: 'assetmanagement',
    govStatus: 'approved',
    audience: 'All Teams',
    icon: FileText,
    color: 'bg-purple-100 text-purple-700',
  },
];

const Toolbox = () => {
  const aiTechReviewTemplateUrl = new URL(
    '../assets/CoAction AI Tech Review Template - Questionnaire - v0.9.xlsx',
    import.meta.url,
  ).toString();
  const getStatusColor = (govStatus: string) => {
    switch (govStatus) {
      case 'approved':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'not approved':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <EnterpriseHeader
        portalName="Enterprise AI Portal"
        color="bg-violet-100"
        pageTitle="AI Systems Registry"
        pageDescription="Build and deploy lightweight AI-powered apps and tools without managing complex infrastructure. Create custom workflows, prompt templates, and utilities that your team can start using immediately."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Toolbox' },
        ]}
        icon={<Wrench className="w-5 h-5 text-black" />}
      />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Title + KPIs */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 font-['Georgia']">AI Toolbox</h1>
            <p className="text-sm text-slate-500">Showing {toolboxItems.length} tools</p>
          </div>
          <div className="flex flex-nowrap gap-3 overflow-x-auto">
            {[
              { label: 'Total Tools', value: toolboxItems.length, color: 'bg-white text-slate-900 border-2 border-violet-100' },
              { label: 'Approved', value: toolboxItems.filter((i) => i.govStatus === 'approved').length, color: 'bg-violet-600 text-white' },
              { label: 'Not Approved', value: toolboxItems.filter((i) => i.govStatus === 'not approved').length, color: 'bg-slate-500 text-white' },
            ].map((card) => (
              <div key={card.label} className={`rounded-lg px-6 py-4 text-left min-w-[180px] ${card.color}`}>
                <div className={`text-[10px] font-bold tracking-widest uppercase ${card.color.includes('bg-white') ? 'text-slate-500' : 'text-white/80'}`}>
                  {card.label}
                </div>
                <div className={`text-3xl font-bold text-center ${card.color.includes('bg-white') ? 'text-slate-900' : 'text-white'}`}>
                  {card.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="rounded-lg border border-slate-200 overflow-hidden mb-8">
          <table className="min-w-full border-collapse text-sm">
            <thead className="bg-slate-900 text-white">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-bold tracking-wider uppercase">Tool</th>
                <th className="px-4 py-3 text-left text-xs font-bold tracking-wider uppercase">Description</th>
                <th className="px-4 py-3 text-left text-xs font-bold tracking-wider uppercase">Audience</th>
                <th className="px-4 py-3 text-left text-xs font-bold tracking-wider uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-bold tracking-wider uppercase">Tag</th>
              </tr>
            </thead>
            <tbody>
              {toolboxItems.map((item, idx) => (
                <tr key={item.id} className={`${idx % 2 === 1 ? 'bg-slate-50' : 'bg-white'} border-b border-slate-200`}>
                  <td className="px-4 py-3">
                    <div className="text-slate-900 font-semibold">{item.name}</div>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-700">{item.description}</td>
                  <td className="px-4 py-3 text-sm text-slate-700">{item.audience}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-md px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase text-white ${
                      item.govStatus === 'approved' ? 'bg-violet-600' : 'bg-slate-500'
                    }`}>{item.govStatus}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">{item.tag}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="flex flex-col md:flex-row gap-12 mb-2">
          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-3">Status Key</h4>
            <div className="flex flex-col gap-2">
              {['approved', 'not approved'].map((s) => (
                <div key={s} className="flex items-center gap-2">
                  <span className={`inline-block w-3 h-3 rounded-sm border-2 ${s === 'approved' ? 'border-violet-600' : 'border-slate-400'}`} />
                  <span className="text-xs text-slate-700">{s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-6 rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-700">
            Please contact Kip Porterfield or Ashok Narayana with a completed Excel attached to put your project through the AI Governance process.
          </p>
          <a
            href={aiTechReviewTemplateUrl}
            download
            className="mt-3 inline-flex items-center rounded-full bg-[#1E3A5F] px-4 py-2 text-xs font-semibold text-white hover:bg-[#162B47] transition-colors"
          >
            Download CoAction AI Tech Review Template - Questionnaire - v0.9.xlsx
          </a>
        </div>
        <div className="text-xs text-slate-400 italic mt-2">Status reflects current governance approval.</div>
      </main>
    </div>
  );
};

export default Toolbox;
