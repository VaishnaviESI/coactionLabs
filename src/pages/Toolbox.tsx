import SortableTable from '@/components/SortableTable';
import EnterpriseHeader from '@/components/EnterpriseHeader';
import { Wrench, ExternalLink } from 'lucide-react';

type GovernanceStatus = 'approved' | 'in progress';
type ToolboxType = 'Tool' | 'System' | 'Technology';

interface ToolboxItem {
  id: number;
  order: number;
  name: string;
  type: ToolboxType;
  description: string;
  govStatus: GovernanceStatus;
  audience: string;
  launchUrl?: string;
}

export const toolboxItems: ToolboxItem[] = [
  {
    id: 1,
    order: 1,
    name: 'Microsoft Copilot Chat Authenticated',
    type: 'Tool',
    description: 'AI assistant for employee productivity',
    govStatus: 'approved',
    audience: 'All Employees',
    launchUrl: 'https://sso.coactionspecialty.com/home/bookmark/0oa24n9y19ocdf4x90h8/2557',
  },
  {
    id: 2,
    order: 2,
    name: 'GitHub Copilot',
    type: 'Tool',
    description: 'AI-powered code completion and generation integrated with your development workflow.',
    govStatus: 'approved',
    audience: 'Engineering',
    launchUrl: 'https://sso.coactionspecialty.com/home/bookmark/0oa23x97lla6FGx8D0h8/2557',
  },
  {
    id: 3,
    order: 3,
    name: 'Rivvit',
    type: 'Tool',
    description: 'Insights into investment management and reporting',
    govStatus: 'approved',
    audience: 'CoAction Investment Management',
  },
  {
    id: 4,
    order: 4,
    name: 'Claude',
    type: 'Tool',
    description: 'AI assistant for employee productivity',
    govStatus: 'in progress',
    audience: 'All Employees',
    launchUrl: 'https://sso.coactionspecialty.com/home/prosightspecialty_claude_1/0oa26t7z0o6vOPsLK0h8/aln26t85hfqFxZVOy0h8',
  },
];

const Toolbox = () => {
  const aiTechReviewTemplateUrl = new URL(
    '../assets/CoAction AI Tech Review Template - Questionnaire - v0.9.xlsx',
    import.meta.url,
  ).toString();
  const tableColumns = [
    {
      key: 'order',
      label: '#',
      getValue: (item: ToolboxItem) => item.order,
      cellClassName: 'whitespace-nowrap',
      render: (item: ToolboxItem) => (
        <div className="text-sm font-semibold text-slate-700">{item.order}</div>
      ),
    },
    {
      key: 'name',
      label: 'Name',
      getValue: (item: ToolboxItem) => item.name,
      render: (item: ToolboxItem) => (
        <div className="text-slate-900 font-semibold">{item.name}</div>
      ),
    },
    {
      key: 'type',
      label: 'Type',
      getValue: (item: ToolboxItem) => item.type,
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
              ? 'bg-blue-100 text-blue-700 border-blue-200'
              : 'bg-emerald-100 text-emerald-700 border-emerald-200'
          }`}
        >
          {item.govStatus}
        </span>
      ),
    },
    {
      key: 'launch',
      label: 'Launch',
      getValue: (item: ToolboxItem) => item.launchUrl || '',
      cellClassName: 'whitespace-nowrap',
      render: (item: ToolboxItem) => (
        item.launchUrl ? (
          <a
            href={item.launchUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center text-blue-700 hover:text-blue-900 transition-colors"
            title="Launch"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        ) : (
          <span className="text-slate-500">N/A</span>
        )
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

      <main className="w-full max-w-[1900px] mx-auto px-6 xl:px-12 py-8">
        {/* Title + KPIs */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
          <div />
          <div className="flex justify-end gap-3 overflow-x-auto">
            {[
              { label: 'Total Tools', value: toolboxItems.length, color: 'bg-white text-slate-900 border-2 border-violet-100' },
              { label: 'Approved', value: toolboxItems.filter((i) => i.govStatus === 'approved').length, color: 'bg-blue-100 text-blue-700 border border-blue-200' },
              { label: 'In Progress', value: toolboxItems.filter((i) => i.govStatus === 'in progress').length, color: 'bg-emerald-100 text-emerald-700 border border-emerald-200' },
            ].map((card) => (
              <div key={card.label} className={`rounded-lg px-6 py-4 text-left min-w-[180px] ${card.color} ${card.label === 'In Progress' ? 'text-black' : ''}`}>
                <div className={`text-[10px] font-bold tracking-widest uppercase ${card.color.includes('bg-white') || card.color.includes('bg-violet-100') || card.color.includes('bg-slate-100') ? 'text-slate-500' : card.label === 'In Progress' ? 'text-black' : card.label === 'Approved' ? 'text-black' : 'text-white/80'}`}>
                  {card.label}
                </div>
                <div className={`text-3xl font-bold text-center ${card.color.includes('bg-white') || card.color.includes('bg-violet-100') || card.color.includes('bg-slate-100') ? 'text-slate-900' : card.label === 'In Progress' ? 'text-black' : card.label === 'Approved' ? 'text-black' : 'text-white'}`}>
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
            rowClassName={() => 'bg-white border-b border-slate-200'}
            tableClassName="min-w-full"
          />
        </div>

        {/* Legend */}
        <div className="flex flex-col md:flex-row gap-12 mb-2">
          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-3">Status Key</h4>
            <div className="flex flex-col gap-2">
              {['approved', 'in progress'].map((s) => (
                <div key={s} className="flex items-center gap-2">
                  <span className={`inline-block w-3 h-3 rounded-sm border-2 ${s === 'approved' ? 'border-blue-600' : 'border-emerald-600'}`} />
                  <span className="text-xs text-slate-700">{s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-6 rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-sm text-black">
            Please contact Kip Porterfield or Ashok Narayana with a completed Excel attached to put your AI tool through the AI Governance process.
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
