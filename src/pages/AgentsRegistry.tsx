import { useState, useMemo } from 'react';
import SortableTable from '@/components/SortableTable';
import EnterpriseHeader from '@/components/EnterpriseHeader';
import { Bot, Search } from 'lucide-react';

type AgentStatus = 'Active' | 'In Review' | 'Deprecated';

interface AgentItem {
  id: number;
  order: number;
  name: string;
  owner: string;
  status: AgentStatus;
}

export const agentItems: AgentItem[] = [
  {
    id: 1,
    order: 1,
    name: 'LossRun Agent',
    owner: 'Bob Rolle',
    status: 'In Review',
  },
  {
    id: 2,
    order: 2,
    name: 'Claims Department Assistant',
    owner: 'Irene Koutzoulis',
    status: 'In Review',
  },
  {
    id: 3,
    order: 3,
    name: 'Submission Scrubber',
    owner: 'Hunter Morgan',
    status: 'In Review',
  },
  {
    id: 4,
    order: 4,
    name: 'Submission Review Assistant',
    owner: 'Zac Immordino',
    status: 'In Review',
  },
  {
    id: 5,
    order: 5,
    name: 'EDW Helper',
    owner: 'Noah Rini',
    status: 'In Review',
  },
];

const AgentsRegistry = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return agentItems.filter((a) => {
      const matchesQuery =
        !q ||
        a.name.toLowerCase().includes(q) ||
        a.owner.toLowerCase().includes(q) ||
        a.status.toLowerCase().includes(q);
      const matchesStatus = selectedStatus === 'All' || a.status === selectedStatus;
      return matchesQuery && matchesStatus;
    });
  }, [searchQuery, selectedStatus]);

  const totalActive = agentItems.filter((a) => a.status === 'Active').length;
  const totalInReview = agentItems.filter((a) => a.status === 'In Review').length;
  const totalDeprecated = agentItems.filter((a) => a.status === 'Deprecated').length;

  const tableColumns = [
    {
      key: 'name',
      label: 'Agent Name',
      getValue: (a: AgentItem) => a.name,
      render: (a: AgentItem) => (
        <div className="text-slate-900 font-semibold">{a.name}</div>
      ),
    },
    {
      key: 'owner',
      label: 'Created By / Owner',
      getValue: (a: AgentItem) => a.owner,
      render: (a: AgentItem) => (
        <div className="text-sm text-slate-700">{a.owner}</div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      getValue: (a: AgentItem) => a.status,
      cellClassName: 'whitespace-nowrap',
      render: (a: AgentItem) => (
        <span
          className={`inline-flex items-center rounded-md border px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase whitespace-nowrap ${
            a.status === 'Active'
              ? 'bg-blue-100 text-blue-700 border-blue-200'
              : a.status === 'In Review'
              ? 'bg-amber-100 text-amber-700 border-amber-200'
              : 'bg-slate-100 text-slate-500 border-slate-200'
          }`}
        >
          {a.status}
        </span>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <EnterpriseHeader
        portalName="Enterprise AI Portal"
        color="bg-blue-100"
        pageTitle="Agents Registry"
        pageDescription="A catalogue of all AI agents deployed or in development across CoAction."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Agents' },
        ]}
        icon={<Bot className="w-5 h-5 text-black" />}
      />

      <main className="w-full max-w-[1900px] mx-auto px-6 xl:px-12 py-8">
        {/* Title + KPIs */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 font-['Georgia']">Agents</h1>
            <p className="text-sm text-slate-500">
              Showing {filtered.length} of {agentItems.length} agents
            </p>
          </div>
          <div className="flex flex-nowrap gap-3 overflow-x-auto">
            {[
              {
                label: 'Total Agents',
                value: agentItems.length,
                color: 'bg-white text-slate-900 border-2 border-blue-100',
                labelColor: 'text-slate-500',
              },
              {
                label: 'Active',
                value: totalActive,
                color: 'bg-blue-100 text-blue-700 border border-blue-200',
                labelColor: 'text-blue-700',
              },
              {
                label: 'In Review',
                value: totalInReview,
                color: 'bg-amber-100 text-amber-700 border border-amber-200',
                labelColor: 'text-amber-700',
              },
              {
                label: 'Deprecated',
                value: totalDeprecated,
                color: 'bg-slate-100 text-slate-700 border border-slate-200',
                labelColor: 'text-slate-700',
              },
            ].map((card) => (
              <div
                key={card.label}
                className={`rounded-lg px-6 py-4 text-left min-w-[150px] ${card.color}`}
              >
                <div className={`text-[10px] font-bold tracking-widest uppercase mb-1 ${card.labelColor}`}>
                  {card.label}
                </div>
                <div className="text-3xl font-bold text-center text-slate-900">
                  {card.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Filter + Search row */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            {(['All', 'Active', 'In Review', 'Deprecated'] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSelectedStatus(s)}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                  selectedStatus === s
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'border-slate-300 text-slate-700 bg-white hover:bg-slate-50'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search agents..."
              className="w-full h-9 rounded-full border border-slate-300 pl-9 pr-3 bg-white text-sm focus:ring-2 focus:ring-slate-900 outline-none"
            />
          </div>
        </div>

        {/* Table */}
        <div className="rounded-lg border border-slate-200 overflow-x-scroll overflow-y-hidden mb-8 [-webkit-overflow-scrolling:touch]">
          <SortableTable
            data={filtered}
            columns={tableColumns}
            initialSortKey="order"
            rowKey={(a) => String(a.id)}
            rowClassName={(_, idx) =>
              `${idx % 2 === 1 ? 'bg-slate-50' : 'bg-white'} border-b border-slate-200`
            }
            emptyMessage="No agents match those filters."
            tableClassName="min-w-full"
          />
        </div>
        <div className="text-sm text-black mb-8">
          If you want to access these agents, contact the owner or creator listed above.
        </div>

        {/* Legend */}
        <div className="flex flex-col md:flex-row gap-12 mb-2">
          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-3">Status Key</h4>
            <div className="flex flex-col gap-2">
              {(
                [
                  { label: 'Active', color: 'border-blue-600' },
                  { label: 'In Review', color: 'border-amber-500' },
                  { label: 'Deprecated', color: 'border-slate-400' },
                ] as const
              ).map(({ label, color }) => (
                <div key={label} className="flex items-center gap-2">
                  <span className={`inline-block w-3 h-3 rounded-sm border-2 ${color}`} />
                  <span className="text-xs text-slate-700">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="text-xs text-slate-400 italic mt-2">
          Status reflects current deployment and review state.
        </div>
      </main>
    </div>
  );
};

export default AgentsRegistry;
