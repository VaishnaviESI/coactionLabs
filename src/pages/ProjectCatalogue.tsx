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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    description:
      'Reference architecture for GenAI across CoAction.',
    category: 'Foundations',
    owner: 'Enterprise Architecture',
    team: 'Platform Engineering',
    status: 'Live',
    lastUpdated: '2026-05-12',
    impact: 'Build • Mid-May go-live',
    tags: ['Layer: Foundations', 'Build', 'Reference Architecture'],
  },
  {
    id: 'proj-002',
    name: 'GP Talos (AWS Build)',
    description:
      'Data platform build in AWS for PII and PHI controls.',
    category: 'Foundations',
    owner: 'Data Platform',
    team: 'Infrastructure',
    status: 'In Progress',
    lastUpdated: '2026-05-12',
    impact: 'Build • Q2',
    tags: ['Layer: Foundations', 'Build', 'PII / PHI'],
  },
  {
    id: 'proj-003',
    name: 'Data Platform + Semantic Layer',
    description:
      'Data masking and unstructured data plus semantic layer enablement.',
    category: 'Foundations',
    owner: 'Data Platform',
    team: 'Data Engineering',
    status: 'In Progress',
    lastUpdated: '2026-05-12',
    impact: 'Build • End of Q2',
    tags: ['Layer: Foundations', 'Build', 'Semantic Layer'],
  },
  {
    id: 'proj-004',
    name: 'AI Governance Framework',
    description:
      'AI governance framework and tooling evaluation.',
    category: 'Foundations',
    owner: 'Governance Office',
    team: 'Risk & Compliance',
    status: 'Discovery',
    lastUpdated: '2026-05-12',
    impact: 'Hybrid • Q2',
    tags: ['Layer: Foundations', 'Hybrid', 'Governance'],
  },
  {
    id: 'proj-005',
    name: 'Binding Authority Chatbot',
    description:
      'AI chatbot for Binding Authority workflows.',
    category: 'Enterprise Capabilities',
    owner: 'Binding Authority',
    team: 'Operations Enablement',
    status: 'Discovery',
    lastUpdated: '2026-05-12',
    impact: 'Build • June',
    tags: ['Layer: Enterprise Capabilities', 'Build', 'Requirements'],
  },
  {
    id: 'proj-006',
    name: 'Forms Library (GenAI)',
    description:
      'AI-driven forms ingestion and insights.',
    category: 'Enterprise Capabilities',
    owner: 'Forms Management',
    team: 'Enterprise Ops',
    status: 'Discovery',
    lastUpdated: '2026-05-12',
    impact: 'Hybrid • July',
    tags: ['Layer: Enterprise Capabilities', 'Hybrid', 'Discovery'],
  },
  {
    id: 'proj-007',
    name: 'Savings Acceleration',
    description:
      'AI-driven productivity and capacity optimization.',
    category: 'Enterprise Capabilities',
    owner: 'Transformation Office',
    team: 'Enterprise Operations',
    status: 'Discovery',
    lastUpdated: '2026-05-12',
    impact: 'Build • TBD',
    tags: ['Layer: Enterprise Capabilities', 'Build', 'Discovery'],
  },
  {
    id: 'proj-008',
    name: 'UW Workbench (Convr)',
    description:
      'Submission ingestion and decision support workflows for underwriting.',
    category: 'AI-Enabled Workflows',
    owner: 'Underwriting',
    team: 'Commercial Underwriting',
    status: 'In Progress',
    lastUpdated: '2026-05-12',
    impact: 'Buy + Extend • June go-live',
    tags: ['Layer: AI-Enabled Workflows', 'Buy + Extend', 'UAT'],
  },
  {
    id: 'proj-009',
    name: 'Loss Control (OI + Pigeon AI)',
    description:
      'AI-enabled inspections and risk insights.',
    category: 'AI-Enabled Workflows',
    owner: 'Loss Control',
    team: 'Field Risk Engineering',
    status: 'Live',
    lastUpdated: '2026-05-12',
    impact: 'Buy • Active',
    tags: ['Layer: AI-Enabled Workflows', 'Buy', 'Live'],
  },
  {
    id: 'proj-010',
    name: 'Subjectivities (Pigeon AI)',
    description:
      'Subjectivity extraction and monitoring in underwriting workflows.',
    category: 'AI-Enabled Workflows',
    owner: 'Underwriting',
    team: 'Policy Operations',
    status: 'Live',
    lastUpdated: '2026-05-12',
    impact: 'Buy • Ongoing',
    tags: ['Layer: AI-Enabled Workflows', 'Buy', 'Active'],
  },
  {
    id: 'proj-011',
    name: 'UW / Claims / Actuarial Workflows',
    description:
      'Top 3 AI-enabled workflows prioritized across key functions.',
    category: 'Decision Intelligence',
    owner: 'Analytics Leadership',
    team: 'UW / Claims / Actuarial',
    status: 'In Progress',
    lastUpdated: '2026-05-12',
    impact: 'Hybrid • Pending sign-off',
    tags: ['Layer: Decision Intelligence', 'Hybrid', 'Review'],
  },
];

const categories = [
  'All',
  'Foundations',
  'Enterprise Capabilities',
  'AI-Enabled Workflows',
  'Decision Intelligence',
];
const statuses: Array<'All' | ProjectStatus> = [
  'All',
  'Discovery',
  'In Progress',
  'Piloting',
  'Live',
  'Retired',
];

const statusColor = (status: ProjectStatus): string => {
  switch (status) {
    case 'Live':
      return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    case 'Piloting':
      return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'In Progress':
      return 'bg-amber-100 text-amber-700 border-amber-200';
    case 'Discovery':
      return 'bg-violet-100 text-violet-700 border-violet-200';
    case 'Retired':
      return 'bg-muted text-muted-foreground';
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

  const totalLive = sampleProjects.filter((p) => p.status === 'Live').length;
  const totalPiloting = sampleProjects.filter((p) => p.status === 'Piloting').length;
  const totalInFlight = sampleProjects.filter(
    (p) => p.status === 'In Progress' || p.status === 'Discovery',
  ).length;

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

        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-11 h-11 rounded-xl bg-emerald-100 flex items-center justify-center">
              <FolderKanban className="w-5 h-5 text-black" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">AI Project Catalogue</h1>
          </div>
          <p className="text-muted-foreground">
            A single source of truth for every AI project — owners, status, and impact.
          </p>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="border-emerald-100/60 bg-white/70 backdrop-blur-sm">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-black" />
              </div>
              <div>
                <div className="text-2xl font-semibold text-black">{totalLive}</div>
                <div className="text-sm text-muted-foreground">Live in production</div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-emerald-100/60 bg-white/70 backdrop-blur-sm">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                <Users className="w-5 h-5 text-black" />
              </div>
              <div>
                <div className="text-2xl font-semibold text-black">{totalPiloting}</div>
                <div className="text-sm text-muted-foreground">Active pilots</div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-emerald-100/60 bg-white/70 backdrop-blur-sm">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                <CalendarDays className="w-5 h-5 text-black" />
              </div>
              <div>
                <div className="text-2xl font-semibold text-black">{totalInFlight}</div>
                <div className="text-sm text-muted-foreground">In discovery / build</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="mb-6 rounded-2xl border border-emerald-100/80 bg-white/80 p-3 shadow-sm backdrop-blur-sm">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1 rounded-xl border-l-4 border-emerald-300 bg-emerald-50/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects, owners, or tags…"
              className="h-11 rounded-xl border-0 bg-transparent pl-9 shadow-none focus-visible:ring-1 focus-visible:ring-emerald-300"
            />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="h-11 rounded-xl border-l-4 border-emerald-300 bg-emerald-50/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] md:w-56">
              <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="h-11 rounded-xl border-l-4 border-emerald-300 bg-emerald-50/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] md:w-44">
              <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Project grid */}
        {filtered.length === 0 ? (
          <Card>
            <CardContent className="p-10 text-center text-muted-foreground">
              No projects match those filters yet.
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((project) => (
              <Card
                key={project.id}
                className="border-emerald-100/60 bg-white/70 backdrop-blur-sm hover:border-emerald-300 hover:shadow-md transition-all duration-300"
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-3">
                    <CardTitle className="text-lg leading-snug">{project.name}</CardTitle>
                    <Badge variant="outline" className={statusColor(project.status)}>
                      {project.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {project.description}
                  </p>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div>
                      <span className="font-medium text-foreground">Owner:</span> {project.owner}
                    </div>
                    <div>
                      <span className="font-medium text-foreground">Team:</span> {project.team}
                    </div>
                    <div>
                      <span className="font-medium text-foreground">Impact:</span> {project.impact}
                    </div>
                    <div>
                      <span className="font-medium text-foreground">Updated:</span>{' '}
                      {project.lastUpdated}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {project.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ProjectCatalogue;
