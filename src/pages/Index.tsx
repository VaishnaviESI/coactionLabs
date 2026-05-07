import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
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

const tiles = [
  {
    title: 'Policies and Governance',
    description: 'Governance, standards, and enterprise AI policy controls.',
    icon: Shield,
    href: '/policies-governance',
    category: 'Governance',
    value: '42 active',
  },
  {
    title: 'Projects',
    description: 'Active AI initiatives, owners, status, and delivery progress.',
    icon: FolderKanban,
    href: '/project-catalogue',
    category: 'Projects',
    value: '128 shipping',
  },
  {
    title: 'Academy',
    description: 'Courses and learning tracks to build AI fluency.',
    icon: GraduationCap,
    href: '/academy',
    category: 'Learning',
    value: '18 courses',
  },
  {
    title: 'Agents',
    description: 'Run and manage approved automations across your teams.',
    icon: Bot,
    href: '/my-agents',
    category: 'Automation',
    value: '24 available',
    disabled: true,
  },
  {
    title: 'Marketplace',
    description: 'Discover and adopt certified AI agents across the organization.',
    icon: Store,
    href: '/marketplace',
    category: 'Discover',
    value: 'Coming soon',
    disabled: true,
  },
  {
    title: 'Analytics',
    description: 'Usage, adoption, and performance metrics across your agents.',
    icon: BarChart3,
    href: '/analytics',
    category: 'Insights',
    value: 'Coming soon',
    disabled: true,
  },
  {
    title: 'Ask an Expert',
    description: 'Get help from internal AI experts and champions.',
    icon: MessageCircleQuestion,
    href: '/ask-expert',
    category: 'Support',
    value: 'Coming soon',
    disabled: true,
  },
  {
    title: "My Team's Agents",
    description: 'Browse the agents in use across your team.',
    icon: Users,
    href: '/team-agents',
    category: 'Team',
    value: 'Coming soon',
    disabled: true,
  },
  {
    title: 'Certification Queue',
    description: 'Review agents pending certification and approval.',
    icon: BadgeCheck,
    href: '/certification-queue',
    category: 'Review',
    value: 'Coming soon',
    disabled: true,
  },
  {
    title: 'Ideas Workshop',
    description: 'Submit and explore ideas for new AI agents.',
    icon: Lightbulb,
    href: '/ideas-workshop',
    category: 'Innovate',
    value: 'Coming soon',
    disabled: true,
  },
];

const tileAccentStyles = [
  { iconBg: 'bg-blue-100', stripBg: 'bg-blue-300' },
  { iconBg: 'bg-emerald-100', stripBg: 'bg-emerald-300' },
  { iconBg: 'bg-yellow-100', stripBg: 'bg-yellow-300' },
  { iconBg: 'bg-violet-100', stripBg: 'bg-violet-300' },
] as const;

const Index = () => {
  const navigate = useNavigate();
  const [commandOpen, setCommandOpen] = useState(false);
  const [tourStep, setTourStep] = useState(0);

  const quickActions = useMemo(
    () =>
      tiles
        .filter((tile) => !tile.disabled)
        .map((tile) => ({
          label: tile.title,
          description: tile.description,
          href: tile.href,
        })),
    [],
  );

  useEffect(() => {
    const down = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setCommandOpen((open) => !open);
      }
      if (event.key === 'Escape') {
        setTourStep(0);
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
      <Header />

      <main className="w-full px-4 md:px-8 py-10">
        {/* Hero Section */}
        <div
          className={`mb-8 rounded-3xl bg-blue-950 p-8 md:p-10 text-white transition-all ${
            heroTourActive ? 'ring-4 ring-blue-300/70' : ''
          }`}
        >
          <p className="inline-flex items-center rounded-full bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-blue-50">
            This week
          </p>
          <h2 className="mt-5 text-4xl font-bold tracking-tight md:text-5xl">Welcome back, JSmith.</h2>
          <p className="mt-3 max-w-2xl text-base text-blue-100 md:text-lg">
            Explore, govern, and learn - your enterprise&apos;s AI in one place.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setCommandOpen(true)}
              className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-100"
            >
              Open Command Bar
            </button>
            <button
              onClick={() => setTourStep(1)}
              className="rounded-full border border-white/40 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Take a tour
            </button>
          </div>

          {heroTourActive && (
            <div className="mt-4 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-blue-50">
              Step 1 of 3: This is your home summary area. Use the command bar for quick navigation.
              <div className="mt-2">
                <button
                  onClick={() => setTourStep(2)}
                  className="rounded-md bg-white px-3 py-1.5 text-xs font-semibold text-slate-900 hover:bg-slate-100"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

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
          {tiles.map((tile, index) => {
            const Icon = tile.icon;
            const animationDelay = { animationDelay: `${index * 50}ms` };
            const accent = tileAccentStyles[index % tileAccentStyles.length];

            const cardInner = (
              <div
                className={`group relative h-full overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-5 transition-all duration-200 ${
                  tile.disabled
                    ? 'opacity-65'
                    : 'hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-sm'
                }`}
              >
                <div className={`absolute inset-y-0 left-0 w-1 rounded-l-2xl ${accent.stripBg}`} />
                <div className="mb-4 flex items-start justify-between">
                  <div className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                    {tile.category}
                  </div>
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-lg ${accent.iconBg} text-black transition-transform duration-200 ${
                      tile.disabled
                        ? ''
                        : 'group-hover:-translate-y-0.5 group-hover:animate-icon-tilt'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                </div>

                <div className="flex flex-1 flex-col">
                  <h3 className="text-lg font-semibold text-slate-900 leading-snug">
                    {tile.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed flex-1">
                    {tile.description}
                  </p>

                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                    {tile.disabled ? (
                      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                        Coming soon
                      </span>
                    ) : (
                      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                        {tile.value}
                      </span>
                    )}
                    {!tile.disabled && (
                      <ArrowRight
                        className="h-4 w-4 text-slate-500 transition-transform duration-200 group-hover:translate-x-0.5"
                      />
                    )}
                  </div>
                </div>
              </div>
            );

            if (tile.disabled) {
              return (
                <div
                  key={tile.title}
                  aria-disabled="true"
                  title="Coming soon"
                  className="block rounded-2xl cursor-not-allowed"
                  style={animationDelay}
                >
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
            {quickActions.map((action) => (
              <CommandItem
                key={action.href}
                onSelect={() => {
                  navigate(action.href);
                  setCommandOpen(false);
                }}
              >
                {action.label}
              </CommandItem>
            ))}
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
    </div>
  );
};

export default Index;
