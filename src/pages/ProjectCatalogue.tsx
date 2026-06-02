import { useMemo, useState } from 'react';
import SortableTable from '@/components/SortableTable';
import EnterpriseHeader from '@/components/EnterpriseHeader';
import {
  Search,
  FolderKanban,
  CalendarDays,
  Zap,
  Layers,
} from 'lucide-react';

type ProjectStatus = 'Discovery' | 'In Progress' | 'In Production' | '';
type SummaryFilter = 'all' | 'build-subscribe' | 'delivery-production-discovery';

interface CatalogueProject {
  id: string;
  order?: number;
  name: string;
  description: string;
  category: string;
  buildVsBuyRent: string;
  owner: string;
  team: string;
  status: ProjectStatus;
  timeline: string;
  vendorUrl: string;
  tags: string[];
  subRows?: CatalogueProject[];
}

export const sampleProjects: CatalogueProject[] = [
  {
    id: 'proj-000',
    order: 0,
    name: 'CoAction Labs - AI Hub',
    description: 'Enterprise AI portal for governance, initiatives, academy, and systems registry.',
    category: 'Enterprise Platform',
    buildVsBuyRent: 'Build',
    owner: 'Ramana Narayanan',
    team: 'AI Engineering',
    status: 'In Production',
    timeline: 'Q2 2026',
    vendorUrl: 'https://labs.coactionspecialty.com/',
    tags: ['AI Hub', 'Portal'],
  },
  {
    id: 'proj-001',
    order: 1,
    name: 'GP Talos',
    description: 'Enterprise knowledge and insights discovery tool built on NSAI platform',
    category: 'Enterprise Intelligence',
    buildVsBuyRent: 'Subscribe',
    owner: "CEO's Office",
    team: 'Growth Protocol',
    status: 'In Progress',
    timeline: 'Q2 2026',
    vendorUrl: 'https://growthprotocol.ai',
    tags: ['Enterprise Intelligence'],
  },
  {
    id: 'proj-002',
    order: 2,
    name: 'K2View',
    description: 'Anonymize sensitive data at scale while preserving structure, relationships, and context. This is required to support NSAI initiatives such as GP Talos.',
    category: 'Security & Privacy',
    buildVsBuyRent: 'Subscribe',
    owner: 'Priyanka Kapoor',
    team: 'Data Engineering',
    status: 'In Progress',
    timeline: 'Q3 2026',
    vendorUrl: 'https://www.k2view.com/',
    tags: ['Data Platform', 'Semantic Model'],
  },
  {
    id: 'proj-003',
    order: 3,
    name: 'AtScale Semantic Platform',
    description: 'Power AI agents, BI tools, and analytical applications with governed business logic, consistent metrics, and cost-controlled performance.',
    category: 'Semantic Models',
    buildVsBuyRent: 'Subscribe',
    owner: 'Priyanka Kapoor',
    team: 'Data Engineering',
    status: 'In Progress',
    timeline: 'Q3 2026',
    vendorUrl: 'https://www.atscale.com/',
    tags: ['Semantic Layer'],
  },
  {
    id: 'proj-004',
    order: 4,
    name: 'AI Governance Framework',
    description: 'AI governance framework and tooling evaluation.',
    category: 'Governance',
    buildVsBuyRent: 'Build',
    owner: 'Joshua Grajewski',
    team: 'Legal, Risk & Compliance',
    status: 'Discovery',
    timeline: 'Q3 2026',
    vendorUrl: 'TBD',
    tags: ['AI Governance'],
  },
  {
    id: 'proj-005',
    order: 5,
    name: 'Project Vega - Agentic AI on CoAction platform',
    description: 'AI-driven productivity and capacity harvesting.',
    category: 'Enterprise Efficiency',
    buildVsBuyRent: 'Build',
    owner: 'Kari Hilder, Bertrand  Spunberg',
    team: 'CoAction IT / SmartIMS IT',
    status: 'In Progress',
    timeline: 'Q3 2026',
    vendorUrl: 'CoAction Agentic Platform',
    tags: ['Chatbot'],
    subRows: [
      {
        id: 'proj-005a',
        name: 'Project Vega: AI Assisted Chatbot for Binding Authority',
        description: 'An AI assisted chatbot to support Binding Authority underwriters and broker partners',
        category: 'Underwriting Assistant',
        buildVsBuyRent: 'Build',
        owner: 'Alexia Selland',
        team: 'Binding Authority IT',
        status: 'In Progress',
        timeline: 'Q2 2026',
        vendorUrl: 'CoAction Agentic Platform',
        tags: ['Chatbot', 'Underwriter Assistant', 'Appetite Assistant', 'Customer Service'],
      },
      {
        id: 'proj-005b',
        name: 'AI Assisted Forms Library for Product Development',
        description: 'AI-driven forms ingestion and insights for Product Development and Underwriting',
        category: 'Product Development',
        buildVsBuyRent: 'Build',
        owner: 'Sebastian Alia',
        team: 'Product Development',
        status: 'In Progress',
        timeline: 'Q3 2026',
        vendorUrl: 'CoAction Agentic Platform',
        tags: ['AI Assisted Forms Library', 'Coverage Insights'],
      },
    ],
  },
  {
    id: 'proj-006',
    order: 6,
    name: 'Project CoSave',
    description: 'AI-driven productivity and capacity harvesting.',
    category: 'Enterprise Efficiency',
    buildVsBuyRent: 'Subscribe',
    owner: 'Kari Hilder, Bertrand  Spunberg',
    team: 'SmartIMS',
    status: 'Discovery',
    timeline: 'Q3 2026',
    vendorUrl: 'https://smartims.com/industries/insurance/xymphony/',
    tags: ['Xymphony'],
    subRows: [
      {
        id: 'proj-006a',
        name: 'Claims Ops - FNOL',
        description: 'FNOL Intake, Triage & Routing Process Automation',
        category: 'Enterprise Efficiency',
        buildVsBuyRent: 'Subscribe',
        owner: 'Irene Koutzoulis',
        team: 'SmartIMS',
        status: 'In Progress',
        timeline: 'Q3 2026',
        vendorUrl: 'https://smartims.com/industries/insurance/xymphony/',
        tags: ['Xymphony'],
      },
      {
        id: 'proj-006b',
        name: 'Treasury Ops - Cash Log',
        description: 'Cash Log Process Automation',
        category: 'Enterprise Efficiency',
        buildVsBuyRent: 'Subscribe',
        owner: 'Ralph Trama',
        team: 'SmartIMS',
        status: 'In Progress',
        timeline: 'Q3 2026',
        vendorUrl: 'https://smartims.com/industries/insurance/xymphony/',
        tags: ['Xymphony'],
      },
      {
        id: 'proj-006c',
        name: 'UW Ops - Loss Runs',
        description: 'Loss Run Process Auttomation',
        category: 'Enterprise Efficiency',
        buildVsBuyRent: 'Subscribe',
        owner: 'Peggy House',
        team: 'SmartIMS',
        status: 'Discovery',
        timeline: 'TBD',
        vendorUrl: 'https://smartims.com/industries/insurance/xymphony/',
        tags: ['Xymphony'],
      },
    ],
  },
  {
    id: 'proj-007',
    order: 7,
    name: 'Project Cortex',
    description: 'AI Assisted Underwriting Workbench for CoAction Underwriters',
    category: 'Underwriting Workbench',
    buildVsBuyRent: 'Subscribe',
    owner: 'Tim Ryan',
    team: 'Underwriting',
    status: 'In Progress',
    timeline: 'Q3 2026',
    vendorUrl: 'https://convr.com/workbench/',
    tags: ['Underwriter Workbench'],
    subRows: [
      {
        id: 'proj-007a',
        name: 'E&S Property',
        description: 'AI Assisted Underwriting Workbench for CoAction Underwriters',
        category: 'Underwriting Workbench',
        buildVsBuyRent: 'Subscribe',
        owner: 'Tim Ryan',
        team: 'Underwriting',
        status: 'In Progress',
        timeline: 'Q3 2026',
        vendorUrl: 'https://convr.com/workbench/',
        tags: ['Underwriter Workbench'],
      },
      {
        id: 'proj-007b',
        name: 'Excess Casualty',
        description: 'AI Assisted Underwriting Workbench for CoAction Underwriters',
        category: 'Underwriting Workbench',
        buildVsBuyRent: 'Subscribe',
        owner: 'Tim Ryan',
        team: 'Underwriting',
        status: 'In Progress',
        timeline: '',
        vendorUrl: 'https://convr.com/workbench/',
        tags: ['Underwriter Workbench'],
      },
      {
        id: 'proj-007c',
        name: 'Rater Prep across all verticals',
        description: 'AI Assisted Underwriting Workbench for CoAction Underwriters',
        category: 'Underwriting Workbench',
        buildVsBuyRent: 'Subscribe',
        owner: 'Tim Ryan',
        team: 'Underwriting',
        status: 'In Progress',
        timeline: '',
        vendorUrl: 'https://convr.com/workbench/',
        tags: ['Underwriter Workbench'],
      },
      {
        id: 'proj-007d',
        name: 'Ingestion across all verticals',
        description: 'AI Assisted Underwriting Workbench for CoAction Underwriters',
        category: 'Underwriting Workbench',
        buildVsBuyRent: 'Subscribe',
        owner: 'Tim Ryan',
        team: 'Underwriting',
        status: 'In Progress',
        timeline: '',
        vendorUrl: 'https://convr.com/workbench/',
        tags: ['Underwriter Workbench'],
      },
    ],
  },
  {
    id: 'proj-008',
    order: 8,
    name: 'Loss Control (OI + Pigeon AI)',
    description: 'AI-enabled inspections and risk insights.',
    category: 'Operational Efficiency',
    buildVsBuyRent: 'Subscribe',
    owner: 'Peggy House',
    team: 'UW Operations & Risk Engineering',
    status: 'In Production',
    timeline: 'Active',
    vendorUrl: 'https://www.oipinsurtech.com/',
    tags: [],
  },
  {
    id: 'proj-009',
    order: 9,
    name: 'AI Assisted Subjectivity Management',
    description: 'Subjectivity extraction and monitoring in underwriting workflows.',
    category: 'Operational Efficiency',
    buildVsBuyRent: 'Subscribe',
    owner: 'Peggy House',
    team: 'UW Operations & Risk Engineering',
    status: 'In Production',
    timeline: 'Active',
    vendorUrl: 'https://pigeonsubjectivities.com/',
    tags: [],
  },
  {
    id: 'proj-010',
    order: 10,
    name: 'GP NSAI for Claims',
    description: 'Claims Workflows & Decision Insights',
    category: 'Decision Intelligence',
    buildVsBuyRent: 'Subscribe',
    owner: 'Jolene Casatelli',
    team: 'Growth Protocol',
    status: 'Discovery',
    timeline: 'TBD',
    vendorUrl: 'https://growthprotocol.ai',
    tags: ['NSAI'],
  },
  {
    id: 'proj-011',
    order: 11,
    name: 'GP NSAI for Underwriting',
    description: 'Underwriting Workflows & Decision Insights',
    category: 'Decision Intelligence',
    buildVsBuyRent: 'Subscribe',
    owner: 'Jon Levy',
    team: 'Growth Protocol',
    status: 'Discovery',
    timeline: 'TBD',
    vendorUrl: 'https://growthprotocol.ai',
    tags: ['NSAI'],
  },
  {
    id: 'proj-012',
    order: 12,
    name: 'Inspection Review',
    description: 'Variance Detection at Scale, Carrier-Guideline Compliance, Compliance Tracking + Audit Trail',
    category: 'Operational Efficiency',
    buildVsBuyRent: 'Subscribe',
    owner: 'Peggy House',
    team: 'UW Operations & Risk Engineering',
    status: 'Discovery',
    timeline: 'Q3 2026',
    vendorUrl: 'https://www.boundai.ai/',
    tags: [],
  },
  {
    id: 'proj-013',
    order: 13,
    name: 'Policy Checking',
    description: 'Underlying-Layer Reconciliation, Tower Integrity Validation, Forms & Exclusions Audit',
    category: 'Operational Efficiency',
    buildVsBuyRent: 'Subscribe',
    owner: 'Peggy House',
    team: 'UW Operations & Risk Engineering',
    status: 'Discovery',
    timeline: 'Q3 2026',
    vendorUrl: '',
    tags: [],
  },
  {
    id: 'proj-014',
    order: 14,
    name: 'Quote Comparison',
    description: 'Expiring ↔ Renewal Reconciliation, Material-Change Detection, UA-Friendly Workflow',
    category: 'Operational Efficiency',
    buildVsBuyRent: 'Subscribe',
    owner: 'Peggy House',
    team: 'UW Operations & Risk Engineering',
    status: 'Discovery',
    timeline: 'Q4 2026',
    vendorUrl: '',
    tags: [],
  },
  {
    id: 'proj-015',
    order: 15,
    name: 'File Audit',
    description: 'Authority & Binding Compliance, 19-Point Automated File Score, Auto-Generated UER',
    category: 'Operational Efficiency',
    buildVsBuyRent: 'Subscribe',
    owner: 'Peggy House',
    team: 'UW Operations & Risk Engineering',
    status: 'Discovery',
    timeline: 'Q1 2027',
    vendorUrl: '',
    tags: [],
  },
  {
    id: 'proj-016',
    order: 16,
    name: '3rd Party Data Integration into GP',
    description: '3rd party data integration into GP to drive insights',
    category: 'Decision Intelligence',
    buildVsBuyRent: 'Subscribe',
    owner: 'Bertrand  Spunberg',
    team: 'Growth Protocol',
    status: 'Discovery',
    timeline: 'Q3 2026',
    vendorUrl: 'https://growthprotocol.ai',
    tags: ['NSAI'],
    subRows: [
      {
        id: 'proj-016a',
        name: 'CRC',
        description: '3rd party data integration into GP to drive insights',
        category: 'Decision Intelligence',
        buildVsBuyRent: 'Subscribe',
        owner: 'Bertrand  Spunberg',
        team: 'Growth Protocol',
        status: 'Discovery',
        timeline: 'Q3 2026',
        vendorUrl: 'https://growthprotocol.ai',
        tags: ['NSAI'],
      },
      {
        id: 'proj-016b',
        name: 'Verisk',
        description: '3rd party data integration into GP to drive insights',
        category: 'Decision Intelligence',
        buildVsBuyRent: 'Subscribe',
        owner: 'Bertrand  Spunberg',
        team: 'Growth Protocol',
        status: 'Discovery',
        timeline: 'Q3 2026',
        vendorUrl: 'https://growthprotocol.ai',
        tags: ['NSAI'],
      },
    ],
  },
];

const categoryOrder = Array.from(new Set(sampleProjects.map((project) => project.category)));


const ProjectCatalogue = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedSummary, setSelectedSummary] = useState<SummaryFilter>('all');

  const projectOrderById = useMemo(
    () =>
      Object.fromEntries(
        [...sampleProjects]
          .sort((left, right) => left.name.localeCompare(right.name))
          .map((project, index) => [project.id, index + 1]),
      ) as Record<string, number>,
    [],
  );

  const isBuildBuy = (project: CatalogueProject) => /build|subscribe/i.test(project.buildVsBuyRent);
  const isDeliveryProductionDiscovery = (project: CatalogueProject) =>
    project.status === 'In Progress' || project.status === 'In Production' || project.status === 'Discovery';

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return sampleProjects.filter((p) => {
      const matchesQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.owner.toLowerCase().includes(q) ||
        p.team.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.buildVsBuyRent.toLowerCase().includes(q) ||
        p.vendorUrl.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q));
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
      const matchesStatus = selectedStatus === 'All' || p.status === selectedStatus;
      const matchesSummary = (() => {
        switch (selectedSummary) {
          case 'build-subscribe':
            return isBuildBuy(p);
          case 'delivery-production-discovery':
            return isDeliveryProductionDiscovery(p);
          default:
            return true;
        }
      })();
      return matchesQuery && matchesCategory && matchesStatus && matchesSummary;
    });
  }, [searchQuery, selectedCategory, selectedStatus, selectedSummary, isBuildBuy, isDeliveryProductionDiscovery]);

  const totalBuildBuy = sampleProjects.filter(isBuildBuy).length;
  const totalDeliveryProductionDiscovery = sampleProjects.filter(isDeliveryProductionDiscovery).length;
  const totalBuild = sampleProjects.filter((project) => /build/i.test(project.buildVsBuyRent)).length;
  const totalSubscribe = sampleProjects.filter((project) => /subscribe/i.test(project.buildVsBuyRent)).length;
  const totalInProgress = sampleProjects.filter((project) => project.status === 'In Progress').length;
  const totalInProduction = sampleProjects.filter((project) => project.status === 'In Production').length;
  const totalDiscovery = sampleProjects.filter((project) => project.status === 'Discovery').length;

  const tableColumns = [
    {
      key: 'order',
      label: '#',
      getValue: (project: CatalogueProject) => project.order,
      cellClassName: 'whitespace-nowrap',
      render: (project: CatalogueProject) => (
        <div className="text-sm font-semibold text-slate-700">
          {projectOrderById[project.id] ?? ''}
        </div>
      ),
    },
    {
      key: 'name',
      label: 'Initiatives',
      getValue: (project: CatalogueProject) => project.name,
      headerClassName: 'sticky left-0 z-20 bg-slate-900 min-w-[500px] w-[500px]',
      cellClassName: 'sticky left-0 z-10 bg-white min-w-[500px] w-[500px] border-r border-slate-200 align-top',
      render: (project: CatalogueProject) => (
        <div className="max-w-[500px] whitespace-normal break-words">
          <div className="text-slate-900 font-semibold">{project.name}</div>
          <div className="text-xs text-slate-500">{project.description}</div>
        </div>
      ),
    },
    {
      key: 'category',
      label: 'Category',
      getValue: (project: CatalogueProject) => project.category,
      render: (project: CatalogueProject) => (
        <span className="text-blue-700 underline-offset-2 hover:underline font-medium">{project.category}</span>
      ),
    },
    {
      key: 'buildVsBuyRent',
      label: 'Build vs Subscribe',
      getValue: (project: CatalogueProject) => project.buildVsBuyRent,
      render: (project: CatalogueProject) => (
        <div className="text-sm text-slate-700">
          {project.buildVsBuyRent}
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      getValue: (project: CatalogueProject) => project.status,
      cellClassName: 'whitespace-nowrap',
      render: (project: CatalogueProject) => (
        <span
          className={`inline-flex items-center rounded-md border px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase whitespace-nowrap ${
            project.status === 'Discovery' ? 'bg-slate-100 text-slate-700 border-slate-200' :
            project.status === 'In Production' ? 'bg-blue-100 text-blue-700 border-blue-200' :
            project.status === 'In Progress' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
            'bg-slate-100 text-slate-500 border-slate-200'
          }`}
        >
          {project.status === 'In Production' ? 'Production' : project.status}
        </span>
      ),
    },
    {
      key: 'owner',
      label: 'Owner',
      getValue: (project: CatalogueProject) => project.owner,
      render: (project: CatalogueProject) => <div className="text-sm text-slate-700">{project.owner}</div>,
    },
    {
      key: 'team',
      label: 'Team',
      getValue: (project: CatalogueProject) => project.team,
      render: (project: CatalogueProject) => <div className="text-sm text-slate-700">{project.team}</div>,
    },
    {
      key: 'timeline',
      label: 'Timeline',
      getValue: (project: CatalogueProject) => project.timeline,
      render: (project: CatalogueProject) => <div className="text-sm text-slate-700">{project.timeline}</div>,
    },
    {
      key: 'vendorUrl',
      label: 'URL',
      getValue: (project: CatalogueProject) =>
        project.status === 'In Production' && /^https?:\/\//i.test(project.vendorUrl)
          ? project.vendorUrl
          : 'N/A',
      render: (project: CatalogueProject) => (
        project.status === 'In Production' && /^https?:\/\//i.test(project.vendorUrl) ? (
          <a
            href={project.vendorUrl}
            target="_blank"
            rel="noreferrer"
            className="text-blue-700 underline-offset-2 hover:underline"
          >
            Click to open
          </a>
        ) : (
          <span className="text-slate-500">N/A</span>
        )
      ),
    },
    {
      key: 'tags',
      label: 'Tags',
      getValue: (project: CatalogueProject) => project.tags.join(', '),
      render: (project: CatalogueProject) => (
        project.tags.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {project.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">{tag}</span>
            ))}
          </div>
        ) : (
          <span className="text-slate-400">-</span>
        )
      ),
    },
  ];

  const summaryCards: Array<{
    key: SummaryFilter;
    label: string;
    value: number;
    icon: typeof Layers;
  }> = [
    { key: 'all', label: 'Total initiatives', value: sampleProjects.length, icon: Layers },
    { key: 'build-subscribe', label: 'Build + Subscribe', value: totalBuildBuy, icon: Zap },
    { key: 'delivery-production-discovery', label: 'In Progress + In Production + Discovery', value: totalDeliveryProductionDiscovery, icon: CalendarDays },
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

      <main className="w-full max-w-[1900px] mx-auto px-6 xl:px-12 py-8">
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
              const colorClass = (() => {
                switch (card.key) {
                  case 'build-subscribe':
                    return 'bg-emerald-100 text-emerald-700 border border-emerald-200';
                  case 'delivery-production-discovery':
                    return 'bg-blue-100 text-blue-700 border border-blue-200';
                  default:
                    return 'bg-white text-slate-900 border border-slate-200';
                }
              })();

              return (
                <button
                  key={card.key}
                  type="button"
                  onClick={() => setSelectedSummary(card.key)}
                  className={`rounded-lg text-left transition-all min-w-[180px] overflow-hidden ${
                    isTotal ? 'px-6 py-4' : ''
                  } ${colorClass} ${
                    isActive ? 'ring-2 ring-offset-2 ring-slate-900' : ''
                  }`}
                >
                  {card.key === 'build-subscribe' ? (
                    <div className="grid h-full grid-cols-2 divide-x divide-emerald-300">
                      <div className="px-4 py-4 text-center">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Build</div>
                        <div className="text-3xl font-bold text-slate-900">{totalBuild}</div>
                      </div>
                      <div className="px-4 py-4 text-center">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Subscribe</div>
                        <div className="text-3xl font-bold text-slate-900">{totalSubscribe}</div>
                      </div>
                    </div>
                  ) : card.key === 'delivery-production-discovery' ? (
                    <div className="grid h-full grid-cols-3 divide-x divide-blue-300">
                      <div className="px-3 py-4 text-center">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-blue-700">In Progress</div>
                        <div className="text-3xl font-bold text-slate-900">{totalInProgress}</div>
                      </div>
                      <div className="px-3 py-4 text-center">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-blue-700">Production</div>
                        <div className="text-3xl font-bold text-slate-900">{totalInProduction}</div>
                      </div>
                      <div className="px-3 py-4 text-center">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-blue-700">Discovery</div>
                        <div className="text-3xl font-bold text-slate-900">{totalDiscovery}</div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex h-full flex-col justify-center">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 text-center mb-1">Total Initiatives</div>
                      <div className={`text-3xl font-bold text-center ${isTotal ? 'text-slate-900' : 'text-slate-900'}`}>
                        {card.value}
                      </div>
                    </div>
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
        <div className="rounded-lg border border-slate-200 overflow-x-auto overflow-y-hidden mb-8">
          <SortableTable
            data={filtered}
            columns={tableColumns}
            initialSortKey="name"
            rowKey={(project) => project.id}
            rowClassName={() => 'bg-white border-b border-slate-200'}
            subrowClassName={() => 'bg-white border-l-4 border-l-emerald-300 border-b border-slate-200'}
            emptyMessage="No projects match those filters."
            tableClassName="min-w-[2100px]"
            getChildren={(project) => project.subRows?.length ? project.subRows : undefined}
          />
        </div>

        {/* Legend */}
        <div className="flex flex-col md:flex-row gap-12 mb-2">
          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-3">Status Key</h4>
            <div className="flex flex-col gap-2">
              {(['In Production', 'In Progress', 'Discovery'] as ProjectStatus[]).map((s) => (
                <div key={s} className="flex items-center gap-2">
                  <span className={`inline-block w-3 h-3 rounded-sm border-2 ${
                    s === 'In Production' ? 'border-emerald-600' :
                    s === 'In Progress' ? 'border-blue-700' :
                    'border-violet-600'
                  }`} />
                  <span className="text-xs text-slate-700">{s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="text-xs text-slate-400 italic">Status reflects current delivery state.</div>
      </main>
    </div>
  );
};

export default ProjectCatalogue;
