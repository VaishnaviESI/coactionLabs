import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import {
  ArrowLeft,
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
    impact: 'Buy + Extend • June go-live',
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
      return matchesQuery && matchesCategory && matchesStatus;
    });
  }, [searchQuery, selectedCategory, selectedStatus]);

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

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="container mx-auto px-6 py-8">
        <Link
          to="/"
          className="group inline-flex items-center mb-4 py-1 text-sm font-medium text-slate-600 hover:text-emerald-700 transition-colors w-fit"
        >
          <ArrowLeft className="w-4 h-4 shrink-0 transition-transform duration-300 group-hover:-translate-x-0.5" />
          <span className="whitespace-nowrap ml-2 transition-all duration-300 group-hover:opacity-0 group-hover:-translate-x-2 pointer-events-none">
            Back to Dashboard
          </span>
        </Link>

        {/* Page header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-11 h-11 rounded-xl bg-emerald-100 flex items-center justify-center">
              <FolderKanban className="w-5 h-5 text-black" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900">AI Project Catalogue</h1>
          </div>
          <p className="text-slate-500 text-sm">
            A single source of truth for every AI initiative — owners, status, and delivery progress.
          </p>
        </div>

        {/* Summary strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 flex items-center gap-3 shadow-sm">
            <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
              <Layers className="w-4 h-4 text-slate-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-slate-900">{sampleProjects.length}</p>
              <p className="text-xs text-slate-500">Total initiatives</p>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 flex items-center gap-3 shadow-sm">
            <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-slate-900">{totalBuild}</p>
              <p className="text-xs text-slate-500">Build</p>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 flex items-center gap-3 shadow-sm">
            <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
              <ShoppingCart className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-slate-900">{totalBuy}</p>
              <p className="text-xs text-slate-500">Buy / Extend</p>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 flex items-center gap-3 shadow-sm">
            <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-slate-900">{totalLive}</p>
              <p className="text-xs text-slate-500">Live in prod</p>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 flex items-center gap-3 shadow-sm">
            <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
              <CalendarDays className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-slate-900">{totalInProgress + totalDiscovery}</p>
              <p className="text-xs text-slate-500">In flight</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects, owners, or tags…"
                className="h-10 rounded-xl border-slate-200 pl-9 focus-visible:ring-1 focus-visible:ring-emerald-300"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="h-10 rounded-xl border-slate-200 md:w-56">
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All categories</SelectItem>
                {categoryOrder.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="h-10 rounded-xl border-slate-200 md:w-44">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Category-grouped project tiles */}
        {grouped.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-sm text-slate-400">
            No projects match those filters.
          </div>
        ) : (
          <div className="space-y-8">
            {grouped.map(({ category, projects }) => {
              const meta = categoryMeta[category];
              return (
                <div key={category}>
                  {/* Category header */}
                  <div className={`flex items-center gap-3 rounded-xl border px-4 py-2.5 mb-4 ${meta.headerBg}`}>
                    <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${meta.dotBg}`} />
                    <h2 className={`text-sm font-bold uppercase tracking-[0.12em] ${meta.headerText}`}>
                      {category}
                    </h2>
                    <span className={`ml-auto text-xs font-semibold ${meta.headerText} opacity-60`}>
                      {projects.length} {projects.length === 1 ? 'project' : 'projects'}
                    </span>
                  </div>

                  {/* Project tiles */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {projects.map((project) => (
                      <div
                        key={project.id}
                        className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 hover:border-slate-300 hover:shadow-md transition-all duration-200"
                      >
                        {/* Left category strip */}
                        <div className={`absolute inset-y-0 left-0 w-1 ${meta.strip}`} />

                        {/* Title + status */}
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 className="text-base font-semibold text-slate-900 leading-snug">
                            {project.name}
                          </h3>
                          <Badge
                            variant="outline"
                            className={`shrink-0 text-xs ${statusColor(project.status)}`}
                          >
                            {project.status}
                          </Badge>
                        </div>

                        {/* Owner + Pod */}
                        <div className="flex items-center justify-between gap-2 mb-3 rounded-lg bg-slate-50 border border-slate-100 px-3 py-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${getAvatarColor(project.owner)}`}>
                              {getInitials(project.owner)}
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-semibold text-slate-800 truncate">{project.owner}</p>
                              <p className="text-xs text-slate-400">Owner</p>
                            </div>
                          </div>
                          <div className="shrink-0 text-right">
                            <p className="text-xs font-semibold text-slate-700 truncate max-w-[110px]">{project.team}</p>
                            <p className="text-xs text-slate-400">Pod</p>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-sm text-slate-500 leading-relaxed mb-4">
                          {project.description}
                        </p>

                        {/* Timeline */}
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-4">
                          <CalendarDays className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                          <span>{project.impact}</span>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-100">
                          {project.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Legend */}
        <div className="mt-10 flex flex-wrap items-center gap-4 text-xs text-slate-500">
          <span className="font-semibold uppercase tracking-wide text-slate-400">Status:</span>
          {(['Live', 'In Progress', 'Discovery', 'Piloting', 'Retired'] as ProjectStatus[]).map((s) => (
            <span key={s} className={`rounded-full border px-2.5 py-0.5 font-medium ${statusColor(s)}`}>{s}</span>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ProjectCatalogue;
