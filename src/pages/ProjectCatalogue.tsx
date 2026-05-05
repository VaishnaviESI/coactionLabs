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
    name: 'Claims Triage Copilot',
    description:
      'AI assistant that classifies incoming claims, routes them to the correct queue, and drafts an initial reviewer summary.',
    category: 'Claims',
    owner: 'Priya Patel',
    team: 'Claims Operations',
    status: 'Live',
    lastUpdated: '2026-04-12',
    impact: '↓ 38% triage time',
    tags: ['Claims', 'NLP', 'Routing'],
  },
  {
    id: 'proj-002',
    name: 'Underwriting Risk Synthesizer',
    description:
      'Summarizes broker submissions and surfaces risk signals against historical loss ratios.',
    category: 'Underwriting',
    owner: 'Marcus Lee',
    team: 'Commercial Underwriting',
    status: 'Piloting',
    lastUpdated: '2026-04-22',
    impact: '↑ 22% submission throughput',
    tags: ['Underwriting', 'RAG', 'Risk'],
  },
  {
    id: 'proj-003',
    name: 'Policy Q&A Knowledge Agent',
    description:
      'Internal chat assistant that answers questions about policy wordings, endorsements, and exclusions.',
    category: 'Policy Admin',
    owner: 'Hannah Cohen',
    team: 'Policy Services',
    status: 'In Progress',
    lastUpdated: '2026-04-18',
    impact: '~ pilot in May',
    tags: ['Knowledge', 'RAG', 'Self-service'],
  },
  {
    id: 'proj-004',
    name: 'Customer Sentiment Tracker',
    description:
      'Analyzes call-center transcripts and post-claim surveys to flag at-risk customers.',
    category: 'Customer Service',
    owner: 'Diego Alvarez',
    team: 'Customer Experience',
    status: 'Discovery',
    lastUpdated: '2026-04-25',
    impact: 'Business case in review',
    tags: ['Sentiment', 'Voice', 'Retention'],
  },
  {
    id: 'proj-005',
    name: 'Regulatory Change Watcher',
    description:
      'Monitors regulator publications and produces weekly impact briefs for compliance partners.',
    category: 'Compliance',
    owner: 'Aisha Khan',
    team: 'Compliance',
    status: 'Live',
    lastUpdated: '2026-04-08',
    impact: '↓ 60% manual scan time',
    tags: ['Compliance', 'Monitoring', 'Summarization'],
  },
  {
    id: 'proj-006',
    name: 'Quote Comparison Assistant',
    description:
      'Side-by-side carrier quote comparison with plain-language explanations for producers.',
    category: 'Sales',
    owner: 'Tom Becker',
    team: 'Distribution',
    status: 'Piloting',
    lastUpdated: '2026-04-20',
    impact: '↑ 14% close rate (pilot)',
    tags: ['Sales', 'Comparison', 'Producer'],
  },
];

const categories = [
  'All',
  'Claims',
  'Underwriting',
  'Policy Admin',
  'Customer Service',
  'Sales',
  'Compliance',
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
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/60 via-background to-emerald-50/30">
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
              <FolderKanban className="w-5 h-5 text-emerald-600" />
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
                <Sparkles className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <div className="text-2xl font-semibold text-emerald-700">{totalLive}</div>
                <div className="text-sm text-muted-foreground">Live in production</div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-emerald-100/60 bg-white/70 backdrop-blur-sm">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                <Users className="w-5 h-5 text-emerald-700" />
              </div>
              <div>
                <div className="text-2xl font-semibold text-emerald-700">{totalPiloting}</div>
                <div className="text-sm text-muted-foreground">Active pilots</div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-emerald-100/60 bg-white/70 backdrop-blur-sm">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                <CalendarDays className="w-5 h-5 text-emerald-700" />
              </div>
              <div>
                <div className="text-2xl font-semibold text-emerald-700">{totalInFlight}</div>
                <div className="text-sm text-muted-foreground">In discovery / build</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects, owners, or tags…"
              className="pl-9"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="md:w-56">
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
            <SelectTrigger className="md:w-44">
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
