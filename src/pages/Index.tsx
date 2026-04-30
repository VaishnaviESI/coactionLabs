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
} from 'lucide-react';

const tiles = [
  {
    title: 'AI Policies & Governance',
    description: 'Library of policies and governance for AI agents.',
    icon: Shield,
    href: '/policies-governance',
    borderColor: 'bg-indigo-500',
    iconBg: 'bg-indigo-50',
    iconColor: 'text-indigo-600',
    gradient: 'from-indigo-500/10 via-indigo-500/5 to-transparent',
  },
  {
    title: 'AI Project Catalogue',
    description: 'Browse the portfolio of AI projects, their owners, status, and impact.',
    icon: FolderKanban,
    href: '/project-catalogue',
    borderColor: 'bg-emerald-500',
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    gradient: 'from-emerald-500/10 via-emerald-500/5 to-transparent',
  },
  {
    title: 'AI Academy',
    description: 'Learn how to use AI tools and agents effectively.',
    icon: GraduationCap,
    href: '/academy',
    borderColor: 'bg-blue-500',
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
    gradient: 'from-blue-500/10 via-blue-500/5 to-transparent',
  },
  {
    title: 'Marketplace',
    description: 'Discover and adopt certified AI agents across the organization.',
    icon: Store,
    href: '/marketplace',
    borderColor: 'bg-purple-500',
    iconBg: 'bg-purple-50',
    iconColor: 'text-purple-600',
    gradient: 'from-purple-500/10 via-purple-500/5 to-transparent',
    disabled: true,
  },
  {
    title: 'My Agents',
    description: 'Manage the AI agents you have built or adopted.',
    icon: Bot,
    href: '/my-agents',
    borderColor: 'bg-cyan-500',
    iconBg: 'bg-cyan-50',
    iconColor: 'text-cyan-600',
    gradient: 'from-cyan-500/10 via-cyan-500/5 to-transparent',
    disabled: true,
  },
  {
    title: 'Analytics',
    description: 'Usage, adoption, and performance metrics across your agents.',
    icon: BarChart3,
    href: '/analytics',
    borderColor: 'bg-orange-500',
    iconBg: 'bg-orange-50',
    iconColor: 'text-orange-600',
    gradient: 'from-orange-500/10 via-orange-500/5 to-transparent',
    disabled: true,
  },
  {
    title: 'Ask an Expert',
    description: 'Get help from internal AI experts and champions.',
    icon: MessageCircleQuestion,
    href: '/ask-expert',
    borderColor: 'bg-pink-500',
    iconBg: 'bg-pink-50',
    iconColor: 'text-pink-600',
    gradient: 'from-pink-500/10 via-pink-500/5 to-transparent',
    disabled: true,
  },
  {
    title: "My Team's Agents",
    description: 'Browse the agents in use across your team.',
    icon: Users,
    href: '/team-agents',
    borderColor: 'bg-amber-500',
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-600',
    gradient: 'from-amber-500/10 via-amber-500/5 to-transparent',
    disabled: true,
  },
  {
    title: 'Certification Queue',
    description: 'Review agents pending certification and approval.',
    icon: BadgeCheck,
    href: '/certification-queue',
    borderColor: 'bg-rose-500',
    iconBg: 'bg-rose-50',
    iconColor: 'text-rose-600',
    gradient: 'from-rose-500/10 via-rose-500/5 to-transparent',
    disabled: true,
  },
  {
    title: 'Ideas Workshop',
    description: 'Submit and explore ideas for new AI agents.',
    icon: Lightbulb,
    href: '/ideas-workshop',
    borderColor: 'bg-yellow-500',
    iconBg: 'bg-yellow-50',
    iconColor: 'text-yellow-600',
    gradient: 'from-yellow-500/10 via-yellow-500/5 to-transparent',
    disabled: true,
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-6 py-12">
        {/* Welcome Section */}
        <div className="mb-10 text-center animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Welcome back, JSmith
          </h2>
          <p className="text-lg text-muted-foreground">
            Your AI journey starts here — explore, govern, and learn.
          </p>
        </div>

        {/* Tiles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-up max-w-6xl mx-auto">
          {tiles.map((tile, index) => {
            const Icon = tile.icon;
            const animationDelay = { animationDelay: `${index * 50}ms` };

            if (tile.disabled) {
              return (
                <div
                  key={tile.title}
                  aria-disabled="true"
                  title="Coming soon"
                  className="block rounded-xl cursor-not-allowed opacity-50 grayscale"
                  style={animationDelay}
                >
                  <div className="relative bg-card rounded-xl shadow-card overflow-hidden h-full">
                    <div className="h-1.5 bg-muted-foreground/30" />
                    <div className="relative p-8">
                      <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center mb-5">
                        <Icon className="w-7 h-7 text-muted-foreground" />
                      </div>
                      <h3 className="text-xl font-semibold text-muted-foreground mb-2">
                        {tile.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {tile.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={tile.title}
                to={tile.href}
                className="group block focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-xl"
                style={animationDelay}
              >
                <div className="relative bg-card rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden h-full hover:-translate-y-1">
                  {/* Colored top border */}
                  <div className={`h-1.5 ${tile.borderColor}`} />

                  {/* Subtle gradient backdrop */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${tile.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}
                  />

                  <div className="relative p-8">
                    {/* Icon */}
                    <div
                      className={`w-14 h-14 rounded-xl ${tile.iconBg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className={`w-7 h-7 ${tile.iconColor}`} />
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {tile.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {tile.description}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Index;
