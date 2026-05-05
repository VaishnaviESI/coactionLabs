import { Link } from 'react-router-dom';
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

const tiles = [
  {
    title: 'AI Policies & Governance',
    description: 'Library of policies and governance for AI agents.',
    icon: Shield,
    href: '/policies-governance',
    category: 'Governance',
    imageBg: 'bg-gradient-to-br from-indigo-400 via-indigo-500 to-indigo-600',
    cardBg: 'bg-indigo-50',
    accentText: 'text-indigo-700',
    pattern:
      'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.25) 0%, transparent 40%), radial-gradient(circle at 80% 80%, rgba(0,0,0,0.15) 0%, transparent 40%)',
  },
  {
    title: 'AI Project Catalogue',
    description: 'Browse the portfolio of AI projects, their owners, status, and impact.',
    icon: FolderKanban,
    href: '/project-catalogue',
    category: 'Projects',
    imageBg: 'bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-600',
    cardBg: 'bg-emerald-50',
    accentText: 'text-emerald-700',
    pattern:
      'radial-gradient(circle at 70% 30%, rgba(255,255,255,0.3) 0%, transparent 50%), radial-gradient(circle at 30% 70%, rgba(0,0,0,0.12) 0%, transparent 45%)',
  },
  {
    title: 'AI Academy',
    description: 'Learn how to use AI tools and agents effectively.',
    icon: GraduationCap,
    href: '/academy',
    category: 'Learning',
    imageBg: 'bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600',
    cardBg: 'bg-blue-50',
    accentText: 'text-blue-700',
    pattern:
      'radial-gradient(circle at 50% 20%, rgba(255,255,255,0.3) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(0,0,0,0.15) 0%, transparent 40%)',
  },
  {
    title: 'Marketplace',
    description: 'Discover and adopt certified AI agents across the organization.',
    icon: Store,
    href: '/marketplace',
    category: 'Discover',
    imageBg: 'bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600',
    cardBg: 'bg-purple-50',
    accentText: 'text-purple-700',
    pattern:
      'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3) 0%, transparent 45%), radial-gradient(circle at 75% 75%, rgba(0,0,0,0.12) 0%, transparent 40%)',
    disabled: true,
  },
  {
    title: 'My Agents',
    description: 'Manage the AI agents you have built or adopted.',
    icon: Bot,
    href: '/my-agents',
    category: 'Personal',
    imageBg: 'bg-gradient-to-br from-cyan-400 via-cyan-500 to-cyan-600',
    cardBg: 'bg-cyan-50',
    accentText: 'text-cyan-700',
    pattern:
      'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.3) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(0,0,0,0.12) 0%, transparent 40%)',
    disabled: true,
  },
  {
    title: 'Analytics',
    description: 'Usage, adoption, and performance metrics across your agents.',
    icon: BarChart3,
    href: '/analytics',
    category: 'Insights',
    imageBg: 'bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600',
    cardBg: 'bg-orange-50',
    accentText: 'text-orange-700',
    pattern:
      'radial-gradient(circle at 25% 25%, rgba(255,255,255,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(0,0,0,0.15) 0%, transparent 40%)',
    disabled: true,
  },
  {
    title: 'Ask an Expert',
    description: 'Get help from internal AI experts and champions.',
    icon: MessageCircleQuestion,
    href: '/ask-expert',
    category: 'Support',
    imageBg: 'bg-gradient-to-br from-pink-400 via-pink-500 to-pink-600',
    cardBg: 'bg-pink-50',
    accentText: 'text-pink-700',
    pattern:
      'radial-gradient(circle at 60% 40%, rgba(255,255,255,0.3) 0%, transparent 50%), radial-gradient(circle at 25% 75%, rgba(0,0,0,0.12) 0%, transparent 40%)',
    disabled: true,
  },
  {
    title: "My Team's Agents",
    description: 'Browse the agents in use across your team.',
    icon: Users,
    href: '/team-agents',
    category: 'Team',
    imageBg: 'bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600',
    cardBg: 'bg-amber-50',
    accentText: 'text-amber-700',
    pattern:
      'radial-gradient(circle at 35% 35%, rgba(255,255,255,0.3) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(0,0,0,0.13) 0%, transparent 40%)',
    disabled: true,
  },
  {
    title: 'Certification Queue',
    description: 'Review agents pending certification and approval.',
    icon: BadgeCheck,
    href: '/certification-queue',
    category: 'Review',
    imageBg: 'bg-gradient-to-br from-rose-400 via-rose-500 to-rose-600',
    cardBg: 'bg-rose-50',
    accentText: 'text-rose-700',
    pattern:
      'radial-gradient(circle at 70% 25%, rgba(255,255,255,0.3) 0%, transparent 50%), radial-gradient(circle at 25% 80%, rgba(0,0,0,0.13) 0%, transparent 40%)',
    disabled: true,
  },
  {
    title: 'Ideas Workshop',
    description: 'Submit and explore ideas for new AI agents.',
    icon: Lightbulb,
    href: '/ideas-workshop',
    category: 'Innovate',
    imageBg: 'bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600',
    cardBg: 'bg-yellow-50',
    accentText: 'text-yellow-700',
    pattern:
      'radial-gradient(circle at 50% 30%, rgba(255,255,255,0.35) 0%, transparent 50%), radial-gradient(circle at 30% 75%, rgba(0,0,0,0.13) 0%, transparent 40%)',
    disabled: true,
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-background to-slate-50">
      <Header />

      <main className="w-full px-4 md:px-8 py-12">
        {/* Welcome Section */}
        <div className="mb-12 text-center animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Welcome back, JSmith
          </h2>
          <p className="text-lg text-muted-foreground">
            Your AI journey starts here — explore, govern, and learn.
          </p>
        </div>

        {/* Tiles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 animate-slide-up">
          {tiles.map((tile, index) => {
            const Icon = tile.icon;
            const animationDelay = { animationDelay: `${index * 50}ms` };

            const cardInner = (
              <div
                className={`relative ${tile.cardBg} rounded-2xl shadow-card overflow-hidden h-full flex flex-col ${
                  tile.disabled ? '' : 'hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5'
                }`}
              >
                {/* Colored "image" header with black icon */}
                <div
                  className={`relative h-56 ${tile.imageBg} overflow-hidden`}
                  style={{ backgroundImage: tile.pattern }}
                >
                  {/* Decorative shapes */}
                  <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-white/10 blur-xl" />
                  <div className="absolute -bottom-12 -left-12 w-44 h-44 rounded-full bg-black/10 blur-xl" />

                  {/* Category pill */}
                  <div className="absolute top-5 left-5">
                    <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-sm text-sm font-semibold text-slate-900 shadow-sm">
                      {tile.category}
                    </span>
                  </div>

                  {/* Black icon */}
                  <div
                    className={`absolute bottom-5 right-5 w-20 h-20 rounded-full bg-black flex items-center justify-center shadow-lg ${
                      tile.disabled ? '' : 'group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300'
                    }`}
                  >
                    <Icon className="w-10 h-10 text-white" strokeWidth={2.25} />
                  </div>
                </div>

                {/* Card body */}
                <div className="relative p-8 flex flex-col flex-1">
                  <h3 className="text-2xl font-bold text-slate-900 mb-3 leading-snug">
                    {tile.title}
                  </h3>
                  <p className="text-base text-slate-600 leading-relaxed mb-6 flex-1">
                    {tile.description}
                  </p>

                  {/* Read more / Coming soon footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-black/5">
                    {tile.disabled ? (
                      <span className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                        Coming soon
                      </span>
                    ) : (
                      <span className={`text-sm font-semibold uppercase tracking-wider ${tile.accentText}`}>
                        Explore
                      </span>
                    )}
                    {!tile.disabled && (
                      <ArrowRight
                        className={`w-5 h-5 ${tile.accentText} group-hover:translate-x-1 transition-transform duration-300`}
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
                  className="block rounded-2xl cursor-not-allowed opacity-60"
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
      </main>
    </div>
  );
};

export default Index;
