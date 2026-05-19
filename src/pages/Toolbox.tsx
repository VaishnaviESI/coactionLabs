import SortableTable from '@/components/SortableTable';
import EnterpriseHeader from '@/components/EnterpriseHeader';
import { Wrench } from 'lucide-react';

type GovernanceStatus = 'approved' | 'in progress';

interface ToolboxItem {
  id: number;
  order: number;
  name: string;
  description: string;
  tag: string;
  url: string;
  govStatus: GovernanceStatus;
  audience: string;
}

const toolboxItems: ToolboxItem[] = [
  {
    id: 1,
    order: 1,
    name: 'Microsoft Copilot Chat Authenticated',
    description: 'AI assistant for employee productivity',
    tag: 'Employee',
    url: '',
    govStatus: 'approved',
    audience: 'All Employees',
  },
  {
    id: 2,
    order: 2,
    name: 'GitHub Copilot',
    description: 'AI-powered code completion and generation integrated with your development workflow.',
    tag: 'Engineer',
    url: '',
    govStatus: 'approved',
    audience: 'Engineering',
  },
  {
    id: 3,
    order: 3,
    name: 'Rivvit',
    description: 'Insights into investment management and reporting',
    tag: 'Asset Management',
    url: '',
    govStatus: 'approved',
    audience: 'CoAction Investment Management',
  },
  {
    id: 4,
    order: 4,
    name: 'Claude',
    description: 'AI assistant for employee productivity',
    tag: 'Employee',
    url: '',
    govStatus: 'in progress',
    audience: 'All Employees',
  },
];

const Toolbox = () => {
  const aiTechReviewTemplateUrl = new URL(
    '../assets/CoAction AI Tech Review Template - Questionnaire - v0.9.xlsx',
    import.meta.url,
  ).toString();
  const tableColumns = [
    {
      key: 'name',
      label: 'Tool',
      getValue: (item: ToolboxItem) => item.name,
      render: (item: ToolboxItem) => (
        <div className="text-slate-900 font-semibold">{item.name}</div>
      ),
    },
    {
      key: 'description',
      label: 'Description',
      getValue: (item: ToolboxItem) => item.description,
      render: (item: ToolboxItem) => (
        <div className="text-sm text-slate-700">{item.description}</div>
      ),
    },
    {
      key: 'tag',
      label: 'Tag',
      getValue: (item: ToolboxItem) => item.tag,
      render: (item: ToolboxItem) => (
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">{item.tag}</span>
      ),
    },
    {
      key: 'url',
      label: 'URL',
      getValue: (item: ToolboxItem) => item.url || '-',
      render: (item: ToolboxItem) => (
        item.url ? (
          <a
            href={item.url}
            target="_blank"
            rel="noreferrer"
            className="text-blue-700 underline-offset-2 hover:underline"
          >
            {item.url}
          </a>
        ) : (
          <span className="text-slate-400">-</span>
        )
      ),
    },
    {
      key: 'audience',
      label: 'Audience',
      getValue: (item: ToolboxItem) => item.audience,
      render: (item: ToolboxItem) => (
        <div className="text-sm text-slate-700">{item.audience}</div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      getValue: (item: ToolboxItem) => item.govStatus,
      cellClassName: 'whitespace-nowrap',
      render: (item: ToolboxItem) => (
        <span
          className={`inline-flex items-center rounded-md border px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase whitespace-nowrap ${
            item.govStatus === 'approved'
              ? 'bg-violet-100 text-violet-700 border-violet-200'
              : 'bg-amber-100 text-amber-700 border-amber-200'
          }`}
        >
          {item.govStatus}
        </span>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <EnterpriseHeader
        portalName="Enterprise AI Portal"
        color="bg-violet-100"
        pageTitle="AI Systems Registry"
        pageDescription="Here is the list of AI systems/tools/technologies and their life cycle status"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Toolbox' },
        ]}
        icon={<Wrench className="w-5 h-5 text-black" />}
      />

      <main className="container mx-auto px-4 py-8 max-w-9xl">
        {/* Title + KPIs */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 font-['Georgia']">AI Toolbox</h1>
            <p className="text-sm text-slate-500">Showing {toolboxItems.length} tools</p>
          </div>
          <div className="flex flex-nowrap gap-3 overflow-x-auto">
            {[
              { label: 'Total Tools', value: toolboxItems.length, color: 'bg-white text-slate-900 border-2 border-violet-100' },
              { label: 'Approved', value: toolboxItems.filter((i) => i.govStatus === 'approved').length, color: 'bg-violet-100 text-violet-700 border border-violet-200' },
              { label: 'In Progress', value: toolboxItems.filter((i) => i.govStatus === 'in progress').length, color: 'bg-amber-100 text-black border border-amber-200' },
            ].map((card) => (
              <div key={card.label} className={`rounded-lg px-6 py-4 text-left min-w-[180px] ${card.color} ${card.label === 'In Progress' ? 'text-black' : ''}`}>
                <div className={`text-[10px] font-bold tracking-widest uppercase ${card.color.includes('bg-white') || card.color.includes('bg-violet-100') || card.color.includes('bg-slate-100') ? 'text-slate-500' : card.label === 'In Progress' ? 'text-black' : 'text-white/80'}`}>
                  {card.label}
                </div>
                <div className={`text-3xl font-bold text-center ${card.color.includes('bg-white') || card.color.includes('bg-violet-100') || card.color.includes('bg-slate-100') ? 'text-slate-900' : card.label === 'In Progress' ? 'text-black' : 'text-white'}`}>
                  {card.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="rounded-lg border border-slate-200 overflow-x-scroll overflow-y-hidden mb-8 [-webkit-overflow-scrolling:touch]">
          <SortableTable
            data={toolboxItems}
            columns={tableColumns}
            rowKey={(item) => String(item.id)}
            rowClassName={(_, idx) => `${idx % 2 === 1 ? 'bg-slate-50' : 'bg-white'} border-b border-slate-200`}
            tableClassName="min-w-[1200px]"
          />
        </div>

        {/* Legend */}
        <div className="flex flex-col md:flex-row gap-12 mb-2">
          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-3">Status Key</h4>
            <div className="flex flex-col gap-2">
              {['approved', 'in progress'].map((s) => (
                <div key={s} className="flex items-center gap-2">
                  <span className={`inline-block w-3 h-3 rounded-sm border-2 ${s === 'approved' ? 'border-violet-600' : 'border-amber-600'}`} />
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
