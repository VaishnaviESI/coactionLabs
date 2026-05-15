import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import EnterpriseHeader from '@/components/EnterpriseHeader';
import {
  Search,
  FolderKanban,
  Users,
  CalendarDays,
  Sparkles,
  Zap,
  ShoppingCart,
  Layers,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type ProjectStatus = 'Discovery' | 'In Progress' | 'Piloting' | 'Live' | 'Retired';
type SummaryFilter = 'all' | 'build' | 'buy' | 'live' | 'in-flight';

interface CatalogueProject {
  id: string;
  name: string;
  description: string;
  category: string;
  owner: string;
  team: string;
  status: ProjectStatus;
  lastUpdated: string;
  impact: string;
  tags: string[];
}

const sampleProjects: CatalogueProject[] = [
  {
    id: 'proj-001',
    name: 'Standard Gen-AI Architecture',
    description: 'Reference architecture for GenAI across CoAction.',
    category: 'Foundations',
    owner: 'Enterprise Architecture',
    team: 'Platform Engineering',
    status: 'Live',
    lastUpdated: '2026-05-12',
    impact: 'Build • Mid-May go-live',
    tags: ['Build', 'Reference Architecture'],
  },
  {
    id: 'proj-002',
    name: 'GP Talos (AWS Build)',
    description: 'Data platform build in AWS for PII and PHI controls.',
    category: 'Foundations',
    owner: 'Data Platform',
    team: 'Infrastructure',
    status: 'In Progress',
    lastUpdated: '2026-05-12',
    impact: 'Build • Q2',
    tags: ['Build', 'PII / PHI'],
  },
  {
    id: 'proj-003',
    name: 'Data Platform + Semantic Layer',
    description: 'Data masking and unstructured data plus semantic layer enablement.',
    category: 'Foundations',
    owner: 'Data Platform',
    team: 'Data Engineering',
    status: 'In Progress',
    lastUpdated: '2026-05-12',
    impact: 'Build • End of Q2',
    tags: ['Build', 'Semantic Layer'],
  },
  {
    id: 'proj-004',
    name: 'AI Governance Framework',
    description: 'AI governance framework and tooling evaluation.',
    category: 'Foundations',
    owner: 'Governance Office',
    team: 'Risk & Compliance',
    status: 'Discovery',
    lastUpdated: '2026-05-12',
    impact: 'Hybrid • Q2',
    tags: ['Hybrid', 'Governance'],
  },
  {
    id: 'proj-005',
    name: 'Binding Authority Chatbot',
    description: 'AI chatbot for Binding Authority workflows.',
    category: 'Enterprise Capabilities',
    owner: 'Binding Authority',
    team: 'Operations Enablement',
    status: 'Discovery',
    lastUpdated: '2026-05-12',
    impact: 'Build • June',
    tags: ['Build', 'Requirements'],
  },
  {
    id: 'proj-006',
    name: 'Forms Library (GenAI)',
    description: 'AI-driven forms ingestion and insights.',
    category: 'Enterprise Capabilities',
    owner: 'Forms Management',
    team: 'Enterprise Ops',
    status: 'Discovery',
    lastUpdated: '2026-05-12',
    impact: 'Hybrid • July',
    tags: ['Hybrid', 'Discovery'],
  },
  {
    id: 'proj-007',
    name: 'Savings Acceleration',
    description: 'AI-driven productivity and capacity optimization.',
    category: 'Enterprise Capabilities',
    owner: 'Transformation Office',
    team: 'Enterprise Operations',
    status: 'Discovery',
    lastUpdated: '2026-05-12',
    impact: 'Build • TBD',
    tags: ['Build', 'Discovery'],
  },
  {
    id: 'proj-008',
    name: 'UW Workbench (Convr)',
    description: 'Submission ingestion and decision support workflows for underwriting.',
    category: 'AI-Enabled Workflows',
    owner: 'Underwriting',
    team: 'Commercial Underwriting',
    status: 'In Progress',
    lastUpdated: '2026-05-12',
    impact: 'Buy + Rent • June go-live',
    tags: ['Buy + Extend', 'UAT'],
  },
  {
    id: 'proj-009',
    name: 'Loss Control (OI + Pigeon AI)',
    description: 'AI-enabled inspections and risk insights.',
    category: 'AI-Enabled Workflows',
    owner: 'Loss Control',
    team: 'Field Risk Engineering',
    status: 'Live',
    lastUpdated: '2026-05-12',
    impact: 'Buy • Active',
    tags: ['Buy', 'Live'],
  },
  {
    id: 'proj-010',
    name: 'Subjectivities (Pigeon AI)',
    description: 'Subjectivity extraction and monitoring in underwriting workflows.',
    category: 'AI-Enabled Workflows',
    owner: 'Underwriting',
    team: 'Policy Operations',
    status: 'Live',
    lastUpdated: '2026-05-12',
    impact: 'Buy • Ongoing',
    tags: ['Buy', 'Active'],
  },
  {
    id: 'proj-011',
    name: 'UW / Claims / Actuarial Workflows',
    description: 'Top 3 AI-enabled workflows prioritized across key functions.',
    category: 'Decision Intelligence',
    owner: 'Analytics Leadership',
    team: 'UW / Claims / Actuarial',
    status: 'In Progress',
    lastUpdated: '2026-05-12',
    impact: 'Hybrid • Pending sign-off',
    tags: ['Hybrid', 'Review'],
  },
];

const categoryOrder = [
  'Foundations',
  'Enterprise Capabilities',
  'AI-Enabled Workflows',
  'Decision Intelligence',
];

const categoryMeta: Record<string, { strip: string; headerBg: string; headerText: string; dotBg: string; iconBg: string }> = {
  'Foundations': {
    strip: 'bg-blue-400',
    headerBg: 'bg-blue-50 border-blue-200',
    headerText: 'text-blue-900',
    dotBg: 'bg-blue-400',
    iconBg: 'bg-blue-100',
  },
  'Enterprise Capabilities': {
    strip: 'bg-amber-400',
    headerBg: 'bg-amber-50 border-amber-200',
    headerText: 'text-amber-900',
    dotBg: 'bg-amber-400',
    iconBg: 'bg-amber-100',
  },
  'AI-Enabled Workflows': {
    strip: 'bg-emerald-400',
    headerBg: 'bg-emerald-50 border-emerald-200',
    headerText: 'text-emerald-900',
    dotBg: 'bg-emerald-400',
    iconBg: 'bg-emerald-100',
  },
  'Decision Intelligence': {
    strip: 'bg-violet-400',
    headerBg: 'bg-violet-50 border-violet-200',
    headerText: 'text-violet-900',
    dotBg: 'bg-violet-400',
    iconBg: 'bg-violet-100',
  },
};

const statuses: Array<'All' | ProjectStatus> = ['All', 'Discovery', 'In Progress', 'Piloting', 'Live', 'Retired'];

const avatarColors = [
  'bg-blue-100 text-blue-700',
  'bg-emerald-100 text-emerald-700',
  'bg-violet-100 text-violet-700',
  'bg-amber-100 text-amber-700',
  'bg-rose-100 text-rose-700',
  'bg-cyan-100 text-cyan-700',
];

const getInitials = (name: string) =>
  name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase();

const getAvatarColor = (name: string) =>
  avatarColors[name.charCodeAt(0) % avatarColors.length];

const statusColor = (status: ProjectStatus): string => {
  switch (status) {
    case 'Live':        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    case 'Piloting':    return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'In Progress': return 'bg-amber-100 text-amber-700 border-amber-200';
    case 'Discovery':   return 'bg-violet-100 text-violet-700 border-violet-200';
    case 'Retired':     return 'bg-slate-100 text-slate-500 border-slate-200';
  }
};

const ProjectCatalogue = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedSummary, setSelectedSummary] = useState<SummaryFilter>('all');

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return sampleProjects.filter((p) => {
      const matchesQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.owner.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q));
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
      const matchesStatus = selectedStatus === 'All' || p.status === selectedStatus;
      const matchesSummary = (() => {
        switch (selectedSummary) {
          case 'build':
            return p.impact.includes('Build');
          case 'buy':
            return p.impact.toLowerCase().includes('buy');
          case 'live':
            return p.status === 'Live';
          case 'in-flight':
            return p.status === 'In Progress' || p.status === 'Discovery';
          default:
            return true;
        }
      })();
      return matchesQuery && matchesCategory && matchesStatus && matchesSummary;
    });
  }, [searchQuery, selectedCategory, selectedStatus, selectedSummary]);

  const grouped = useMemo(
    () =>
      categoryOrder
        .map((cat) => ({ category: cat, projects: filtered.filter((p) => p.category === cat) }))
        .filter((g) => g.projects.length > 0),
    [filtered],
  );

  const totalLive       = sampleProjects.filter((p) => p.status === 'Live').length;
  const totalInProgress = sampleProjects.filter((p) => p.status === 'In Progress').length;
  const totalDiscovery  = sampleProjects.filter((p) => p.status === 'Discovery').length;
  const totalBuild      = sampleProjects.filter((p) => p.impact.includes('Build')).length;
  const totalBuy        = sampleProjects.filter((p) => p.impact.toLowerCase().includes('buy')).length;

  const summaryCards: Array<{
    key: SummaryFilter;
    label: string;
    value: number;
    icon: typeof Layers;
  }> = [
    { key: 'all', label: 'Total initiatives', value: sampleProjects.length, icon: Layers },
    { key: 'build', label: 'Build', value: totalBuild, icon: Zap },
    { key: 'buy', label: 'Buy / Rent', value: totalBuy, icon: ShoppingCart },
    { key: 'live', label: 'In Production', value: totalLive, icon: Sparkles },
    { key: 'in-flight', label: 'In Delivery', value: totalInProgress + totalDiscovery, icon: CalendarDays },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <EnterpriseHeader
        portalName="Enterprise AI Portal"
        color="bg-emerald-100"
        pageTitle="AI Initiatives"
        pageDescription="A single source of truth for every AI initiative; owners, status, and delivery progress."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Workflows' },
        ]}
        icon={<FolderKanban className="w-5 h-5 text-black" />}
      />

      <main className="container mx-auto px-6 py-8 max-w-9xl">
        {/* Title + KPIs */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 font-['Georgia']">AI Initiatives</h1>
            <p className="text-sm text-slate-500">Showing {filtered.length} of {sampleProjects.length} initiatives</p>
          </div>
          <div className="flex flex-nowrap gap-3">
            {summaryCards.map((card) => {
              const isActive = selectedSummary === card.key;
              const isTotal = card.key === 'all';
              const total = sampleProjects.length || 1;
              const percent = `${((card.value / total) * 100).toFixed(1)}%`;
              const colorClass = (() => {
                switch (card.key) {
                  case 'build':
                    return 'bg-blue-700 text-white';
                  case 'buy':
                    return 'bg-emerald-600 text-white';
                  case 'live':
                    return 'bg-slate-500 text-white';
                  case 'in-flight':
                    return 'bg-blue-700 text-white';
                  default:
                    return 'bg-white text-slate-900 border-2 border-emerald-100';
                }
              })();

              return (
                <button
                  key={card.key}
                  type="button"
                  onClick={() => setSelectedSummary(card.key)}
                  className={`rounded-lg px-6 py-4 text-left transition-all min-w-[180px] ${colorClass} ${
                    isActive ? 'ring-2 ring-offset-2 ring-slate-900' : ''
                  }`}
                >
                  <div className={`text-[10px] font-bold tracking-widest uppercase ${isTotal ? 'text-slate-500' : 'text-white/80'}`}>
                    {isTotal ? 'Total Initiatives' : card.label}
                  </div>
                  <div className={`text-3xl font-bold text-center ${isTotal ? 'text-slate-900' : 'text-white'}`}>
                    {card.value}
                  </div>
                  {!isTotal && (
                    <div className="text-xs text-white/80 text-center">{percent}</div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Filter pills row */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            {['All', ...categoryOrder].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'border-slate-300 text-slate-700 bg-white hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search initiatives..."
              className="w-full h-9 rounded-full border border-slate-300 pl-9 pr-3 bg-white text-sm focus:ring-2 focus:ring-slate-900 outline-none"
            />
          </div>
        </div>

        {/* Table */}
        <div className="rounded-lg border border-slate-200 overflow-hidden mb-8">
          <table className="min-w-full border-collapse text-sm">
            <thead className="bg-slate-900 text-white">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-bold tracking-wider uppercase">Domain</th>
                <th className="px-4 py-3 text-left text-xs font-bold tracking-wider uppercase">Initiative</th>
                <th className="px-4 py-3 text-left text-xs font-bold tracking-wider uppercase">Timeline</th>
                <th className="px-4 py-3 text-left text-xs font-bold tracking-wider uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-bold tracking-wider uppercase">Tags</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-400">No projects match those filters.</td>
                </tr>
              ) : (
                filtered.map((project, idx) => (
                  <tr key={project.id} className={`${idx % 2 === 1 ? 'bg-slate-50' : 'bg-white'} border-b border-slate-200`}>
                    <td className="px-4 py-3">
                      <span className="text-blue-700 underline-offset-2 hover:underline font-medium">{project.category}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-slate-900 font-semibold">{project.name}</div>
                      <div className="text-xs text-slate-500">{project.description}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700">{project.impact}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-md px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase text-white ${
                        project.status === 'Live' ? 'bg-emerald-600' :
                        project.status === 'In Progress' ? 'bg-blue-700' :
                        project.status === 'Piloting' ? 'bg-amber-500' :
                        project.status === 'Discovery' ? 'bg-violet-600' :
                        'bg-slate-400'
                      }`}>{project.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {project.tags.map((tag) => (
                          <span key={tag} className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">{tag}</span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="flex flex-col md:flex-row gap-12 mb-2">
          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-3">Status Key</h4>
            <div className="flex flex-col gap-2">
              {(['Live', 'In Progress', 'Piloting', 'Discovery', 'Retired'] as ProjectStatus[]).map((s) => (
                <div key={s} className="flex items-center gap-2">
                  <span className={`inline-block w-3 h-3 rounded-sm border-2 ${
                    s === 'Live' ? 'border-emerald-600' :
                    s === 'In Progress' ? 'border-blue-700' :
                    s === 'Piloting' ? 'border-amber-500' :
                    s === 'Discovery' ? 'border-violet-600' :
                    'border-slate-400'
                  }`} />
                  <span className="text-xs text-slate-700">{s}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-3">Category Key</h4>
            <div className="flex flex-col gap-2">
              {categoryOrder.map((cat) => (
                <div key={cat} className="flex items-center gap-2">
                  <span className={`inline-block w-3 h-3 rounded-full ${categoryMeta[cat].dotBg}`} />
                  <span className="text-xs text-slate-700">{cat}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="text-xs text-slate-400 italic">Status reflects current delivery state. Last updated 2026-05-12.</div>
      </main>
    </div>
  );
};

export default ProjectCatalogue;
