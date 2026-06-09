import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from 'next-themes';
import {
  GraduationCap,
  FolderKanban,
  Shield,
  Store,
  Bot,
  BarChart3,
  MessageCircleQuestion,
  Users,
  BadgeCheck,
  Lightbulb,
  ArrowRight,
  Wrench,
  Database,
  X,
  Moon,
  Sun,
  Bell,
  LogIn,
  LogOut,
  Search as SearchIcon,
} from 'lucide-react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import coactionLogo from '../assets/coaction-logo-darkmode-transparent.png';
import { logOktaEvent } from '@/lib/oktaDebug';
import { sampleProjects as projectCatalogueItems } from './ProjectCatalogue';
import { toolboxItems as systemsRegistryItems } from './Toolbox';

type Tile = {
  title: string;
  description: string;
  icon: typeof Shield;
  href: string;
  category: string;
  value: string;
  overview?: string;
  externalUrl?: string;
};

const tiles: Tile[] = [
  {
    title: 'AI Policies and Governance',
    description: 'Governance, standards, and enterprise AI policy controls.',
    icon: Shield,
    href: '/policies-governance',
    category: 'Governance',
    value: '2 documents',
  },
  {
    title: 'AI Initiatives Catalogue',
    description: 'Active AI initiatives, owners, status, and delivery progress.',
    icon: FolderKanban,
    href: '/project-catalogue',
    category: 'Projects',
    value: `${projectCatalogueItems.length} total initiatives`,
  },
  {
    title: 'AI Academy',
    description: 'Courses and learning tracks to build AI fluency.',
    icon: GraduationCap,
    href: '/academy',
    category: 'Learning',
    value: '6 courses',
  },
  {
    title: 'AI Systems Registry',
    description: 'List of AI systems, tools, and technologies along with   their life cycle status.',
    icon: Wrench,
    href: '/toolbox',
    category: 'Create',
    value: `${systemsRegistryItems.length} tools`,
  },
  {
    title: 'AI Agent Studio',
    description: 'A catalogue of all AI agents deployed or in development across CoAction.',
    icon: Bot,
    href: '/agents',
    category: 'Automation',
    value: '12 agents',
  },
  {
    title: 'Data Hub Portal',
    description: 'Access the CoAction Data Hub for data assets, pipelines, and platform resources.',
    icon: Database,
    href: '#',
    externalUrl: 'https://data.coactionspecialty.com/',
    category: 'Data',
    value: 'data.coactionspecialty.com',
  },
  // {
  //   title: 'Agents',
  //   description: 'Run and manage approved automations across your teams.',
  //   icon: Bot,
  //   href: '/my-agents',
  //   category: 'Automation',
  //   value: 'Coming soon',
  //   overview:
  //     'Run, monitor, and manage approved AI automations across your teams. Browse agents assigned to you, trigger runs on demand, review execution history, and configure schedules — all from a single control panel.',
  // },
  // {
  //   title: 'Marketplace',
  //   description: 'Discover and adopt certified AI agents across the organization.',
  //   icon: Store,
  //   href: '/marketplace',
  //   category: 'Discover',
  //   value: 'Coming soon',
  //   overview:
  //     'Browse a curated library of certified AI agents vetted for enterprise use. Find automations built by internal teams or verified partners, review trust scores and usage stats, and deploy approved agents to your team in a single click.',
  // },
  // {
  //   title: 'Analytics',
  //   description: 'Usage, adoption, and performance metrics across your agents.',
  //   icon: BarChart3,
  //   href: '/analytics',
  //   category: 'Insights',
  //   value: 'Coming soon',
  //   overview:
  //     'Monitor AI adoption, usage patterns, and performance metrics across all agents and teams. Identify underperforming automations, track return on investment, and surface data-driven insights to continuously optimize your AI portfolio.',
  // },
  // {
  //   title: 'Ask an Expert',
  //   description: 'Get help from internal AI experts and champions.',
  //   icon: MessageCircleQuestion,
  //   href: '/ask-expert',
  //   category: 'Support',
  //   value: 'Coming soon',
  //   overview:
  //     'Connect directly with internal AI champions and certified experts. Submit questions, book consultations, or browse answers to common challenges from colleagues who have already solved them. Fast-track your team\'s AI adoption with peer expertise.',
  // },
  // {
  //   title: "My Team's Agents",
  //   description: 'Browse the agents in use across your team.',
  //   icon: Users,
  //   href: '/team-agents',
  //   category: 'Team',
  //   value: 'Coming soon',
  //   overview:
  //     'Get a clear view of every AI agent your team has deployed — their status, usage frequency, last-run details, and any pending reviews. Manage approvals, retire outdated automations, and keep your team\'s AI portfolio healthy and current.',
  // },
  // {
  //   title: 'Certification Queue',
  //   description: 'Review agents pending certification and approval.',
  //   icon: BadgeCheck,
  //   href: '/certification-queue',
  //   category: 'Review',
  //   value: 'Coming soon',
  //   overview:
  //     'Review and certify AI agents submitted for enterprise-wide use. Assess submissions against governance standards, run compliance checks, and grant or revoke approval status. Maintain the quality bar that keeps the organization\'s AI ecosystem trustworthy.',
  // },
  // {
  //   title: 'Ideas Workshop',
  //   description: 'Submit and explore ideas for new AI agents.',
  //   icon: Lightbulb,
  //   href: '/ideas-workshop',
  //   category: 'Innovate',
  //   value: 'Coming soon',
  //   overview:
  //     'Submit ideas for new AI agents, upvote proposals from colleagues, and track which concepts are moving into development. A collaborative innovation space that connects problem owners with builders to shape the future of AI at your organization.',
  // },
];

const tileAccentStyles = [
  { iconBg: 'bg-blue-100', stripBg: 'bg-blue-300' },
  { iconBg: 'bg-emerald-100', stripBg: 'bg-emerald-300' },
  { iconBg: 'bg-yellow-100', stripBg: 'bg-yellow-300' },
  { iconBg: 'bg-violet-100', stripBg: 'bg-violet-300' },
] as const;

const Index = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, isAuthenticated, logout, loginWithOkta } = useAuth();
  const { theme, setTheme } = useTheme();
  const [commandOpen, setCommandOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [tourStep, setTourStep] = useState(0);
  const [overviewTile, setOverviewTile] = useState<(typeof tiles)[0] | null>(null);

  const userName = user?.name || 'there';

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : 'U';

  const handleLogout = async () => {
    logOktaEvent('okta:signout-clicked', { source: 'Index' });
    try {
      await logout();
      logOktaEvent('okta:signout-complete', { source: 'Index' });
    } catch (error) {
      logOktaEvent('okta:signout-error', {
        source: 'Index',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  const handleLogin = async () => {
    try {
      await loginWithOkta();
    } catch (error) {
      logOktaEvent('okta:signin-error', {
        source: 'Index',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const quickActions = useMemo(
    () =>
      tiles
        .map((tile) => ({
          label: tile.title,
          description: tile.description,
          href: tile.href,
        })),
    [],
  );

  const filteredTiles = useMemo(
    () =>
      tiles.filter((tile) =>
        tile.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tile.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tile.category.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [searchQuery],
  );

  useEffect(() => {
    const down = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setCommandOpen((open) => !open);
      }
      if (event.key === 'Escape') {
        setTourStep(0);
        setOverviewTile(null);
      }
    };

    window.addEventListener('keydown', down);
    return () => window.removeEventListener('keydown', down);
  }, []);

  const isTourRunning = tourStep > 0;
  const heroTourActive = tourStep === 1;
  const quickAccessTourActive = tourStep === 2;
  const tileTourActive = tourStep === 3;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Combined Header + Hero Section */}
      <header className="sticky top-0 z-50 bg-[#0A1628] text-white shadow-[0_10px_18px_-14px_rgba(15,23,42,0.7)]">
        <div className="w-full px-4 md:px-8 py-8 2xl:py-1">
          <div className="flex w-80 items-center justify-between mb-1 2xl:mb-6">
            <Link to="/" className="flex items-start">
              <div className="p-1.5">
                <img
                  src={coactionLogo}
                  alt="CO/ACTION AI Hub"
                  className="h-20 w-80"
                />
              </div>
            </Link>

            {/* <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="p-2 text-blue-100 hover:bg-white/10 hover:text-white transition-colors rounded-lg"
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>
              <button className="relative p-2 text-blue-100 hover:bg-white/10 hover:text-white transition-colors rounded-lg">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  3
                </span>
              </button>

              <div className="flex items-center gap-2 ml-2">
                {isAuthenticated && !authLoading && (
                  <div className="text-right text-xs">
                    <div className="font-semibold">{user?.name || 'User'}</div>
                    <div className="text-blue-300 text-xs">{user?.email}</div>
                  </div>
                )}
                {isAuthenticated && (
                  <>
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-blue-950 font-semibold text-sm">
                      {initials}
                    </div>
                    <button
                      onClick={handleLogout}
                      className="p-2 text-blue-100 hover:bg-white/10 hover:text-white transition-colors rounded-lg"
                      title="Logout"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </>
                )}
                 
              </div>
            </div> */}
          </div>

          {/* Hero Content */}
          <div className="max-w-4xl mx-auto text-center">
            {/* Welcome Greeting */}
            <h2 className="text-lg 2xl:text-4xl font-bold tracking-tight mb-0.5 2xl:mb-3">
              {isAuthenticated ? `Welcome back, ${userName}.` : 'Welcome to CO/ACTION LABS'}
            </h2>

            {/* Subtitle */}
            <p className="text-xs 2xl:text-lg text-blue-100 mb-2 2xl:mb-8 max-w-2xl mx-auto">
              Explore, learn, and govern - your enterprise&apos;s AI in one place
            </p>

            {/* Search Bar */}
            <div className="mb-0 2xl:mb-6 flex gap-2">
              <div className="relative flex-1 max-w-2xl mx-auto">
                <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 2xl:h-5 2xl:w-5 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search pages, policies, agents..."
                  className="w-full rounded-lg border border-slate-300 bg-white py-1.5 2xl:py-3 pl-10 2xl:pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all"
                />
              </div>
            </div>

            {/* Action Chips */}
            {/* <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => setCommandOpen(true)}
                className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-blue-950 transition-colors hover:bg-slate-100"
              >
                Open Command Bar
              </button>
              <button
                onClick={() => setTourStep(1)}
                className="rounded-full border border-white/40 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                Take a tour
              </button>
            </div> */}
          </div>
        </div>
      </header>

      <main className="w-full max-w-[1900px] mx-auto px-6 xl:px-12 pt-5 pb-0 2xl:py-10">
        {/* Tour Step 1 Message */}
        {tourStep === 1 && (
          <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900">
            Step 1 of 3: This is your home. Use the search bar or Command Bar for quick navigation.
            <button
              onClick={() => setTourStep(2)}
              className="ml-3 rounded-md border border-blue-200 bg-white px-3 py-1.5 text-xs font-semibold text-blue-900 hover:bg-blue-100"
            >
              Next
            </button>
          </div>
        )}

        {/* Quick access cards */}
        <div className={`mb-4 transition-all ${quickAccessTourActive ? 'rounded-lg ring-4 ring-blue-200/70 p-2 -m-2' : ''}`}>
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Quick access</h3>
          {quickAccessTourActive && (
            <div className="mt-2 text-sm text-slate-600">
              Step 2 of 3: These are your core areas for day-to-day work.
              <button
                onClick={() => setTourStep(3)}
                className="ml-3 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Next
              </button>
            </div>
          )}
        </div>

        <div className={`grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 ${tileTourActive ? 'rounded-lg ring-4 ring-blue-200/70 p-2' : ''}`}>
          {filteredTiles.map((tile, index) => {
            const Icon = tile.icon;
            const animationDelay = { animationDelay: `${index * 50}ms` };
            const accent = tileAccentStyles[index % tileAccentStyles.length];

            const cardInner = (
              <div
                className={`group relative h-full overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-5 transition-all duration-200 shadow-sm ${
                  'hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md'
                }`}
              >
                <div className={`absolute inset-y-0 left-0 w-1 rounded-l-2xl ${accent.stripBg}`} />
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-lg font-semibold text-slate-900 leading-snug">
                    {tile.title}
                  </h3>
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-lg ${accent.iconBg} text-black transition-transform duration-200 ${
                      'group-hover:-translate-y-0.5 group-hover:animate-icon-tilt'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                </div>

                <div className="flex flex-1 flex-col">
                  <p className="mb-9 text-sm text-slate-600 leading-relaxed flex-1">
                    {tile.description}
                  </p>

                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                    <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                      {tile.value}
                    </span>
                    <ArrowRight
                      className="h-4 w-4 text-slate-500 transition-transform duration-200 group-hover:translate-x-0.5"
                    />
                  </div>
                </div>
              </div>
            );

            if (tile.externalUrl) {
              return (
                <a
                  key={tile.title}
                  href={tile.externalUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group block focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-2xl"
                  style={animationDelay}
                >
                  {cardInner}
                </a>
              );
            }

            if (tile.overview) {
              return (
                <div
                  key={tile.title}
                  className="group block cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-2xl"
                  style={animationDelay}
                  onClick={() => setOverviewTile(tile)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setOverviewTile(tile); }}
                >
                  {/* Original navigation — commented out; overview modal shown instead:
                  <Link
                    to={tile.href}
                    className="group block focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-2xl"
                    style={animationDelay}
                  >
                    {cardInner}
                  </Link>
                  */}
                  {cardInner}
                </div>
              );
            }

            return (
              <Link
                key={tile.title}
                to={tile.href}
                className="group block focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-2xl"
                style={animationDelay}
              >
                {cardInner}
              </Link>
            );
          })}
        </div>

        {tileTourActive && (
          <div className="mt-4 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-900">
            Step 3 of 3: Select any available tile to jump to that workspace.
            <button
              onClick={() => setTourStep(0)}
              className="ml-3 rounded-md border border-blue-200 bg-white px-3 py-1.5 text-xs font-semibold text-blue-900 hover:bg-blue-100"
            >
              Finish tour
            </button>
          </div>
        )}

        {isTourRunning && (
          <div className="mt-3 text-xs text-slate-500">Press Escape to exit the tour at any time.</div>
        )}
      </main>

      <CommandDialog open={commandOpen} onOpenChange={setCommandOpen}>
        <CommandInput placeholder="Search pages..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Navigate">
            <CommandItem
              onSelect={() => {
                navigate('/');
                setCommandOpen(false);
              }}
            >
              Home
            </CommandItem>
            {quickActions.map((action) => {
              const tile = tiles.find(t => t.href === action.href);
              return (
                <CommandItem
                  key={action.href}
                  onSelect={() => {
                    if (tile && tile.value === 'Coming soon') {
                      setOverviewTile(tile);
                    } else {
                      navigate(action.href);
                    }
                    setCommandOpen(false);
                  }}
                >
                  {action.label}
                </CommandItem>
              );
            })}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Actions">
            <CommandItem
              onSelect={() => {
                setTourStep(1);
                setCommandOpen(false);
              }}
            >
              Start page tour
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>

      {/* Overview modal — shown when a non-navigation tile is clicked */}
      {overviewTile && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setOverviewTile(null)}
        >
          <div
            className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setOverviewTile(null)}
              className="absolute right-4 top-4 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">
                <overviewTile.icon className="h-5 w-5 text-blue-700" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
                  {overviewTile.category}
                </p>
                <h2 className="text-lg font-bold text-slate-900">{overviewTile.title}</h2>
              </div>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              {overviewTile.overview ?? ''}
            </p>

            <div className="mt-5 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                {overviewTile.value}
              </span>
              <button
                onClick={() => setOverviewTile(null)}
                className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-700 transition-colors"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
