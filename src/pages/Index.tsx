import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import { GraduationCap, FolderKanban, Shield } from 'lucide-react';

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
            return (
              <Link
                key={tile.title}
                to={tile.href}
                className="group block focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-xl"
                style={{ animationDelay: `${index * 50}ms` }}
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
