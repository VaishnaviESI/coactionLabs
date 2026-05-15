import { Link } from 'react-router-dom';
import EnterpriseHeader from '@/components/EnterpriseHeader';
import { Code2, FileText, Brain, ArrowRight, Wrench } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const toolboxItems = [
  {
    id: 1,
    name: 'Microsoft Copilot Chat Authenticated',
    description: 'Access Microsoft Copilot Chat with secure authentication for enhanced AI-powered conversations.',
    tag: 'developer',
    govStatus: 'approved',
    audience: 'All Teams',
    icon: Brain,
    color: 'bg-blue-100 text-blue-700',
  },
  {
    id: 2,
    name: 'GitHub Copilot',
    description: 'AI-powered code completion and generation integrated with your development workflow.',
    tag: 'developer',
    govStatus: 'approved',
    audience: 'Development Team',
    icon: Code2,
    color: 'bg-emerald-100 text-emerald-700',
  },
  {
    id: 3,
    name: 'Rivvit',
    description: 'Collaborative AI tool for team communication and knowledge sharing.',
    tag: 'assetmanagement',
    govStatus: 'approved',
    audience: 'All Teams',
    icon: FileText,
    color: 'bg-purple-100 text-purple-700',
  },
];

const Toolbox = () => {
  const getStatusColor = (govStatus: string) => {
    switch (govStatus) {
      case 'approved':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'not approved':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <EnterpriseHeader
        portalName="Enterprise AI Portal"
        pageTitle="AI Toolbox"
        pageDescription="Build and deploy lightweight AI-powered apps and tools without managing complex infrastructure. Create custom workflows, prompt templates, and utilities that your team can start using immediately."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Toolbox' },
        ]}
        icon={<Wrench className="w-5 h-5 text-black" />}
      />

      <main className="container mx-auto px-6 py-8">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {toolboxItems.map((item) => {
            const Icon = item.icon;

            return (
              <Card
                key={item.id}
                className="flex flex-col transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer"
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-3">
                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${item.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <Badge
                      variant="outline"
                      className={getStatusColor(item.govStatus)}
                    >
                      {item.govStatus}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{item.name}</CardTitle>
                  <p className="text-sm text-slate-500 mt-1">{item.tag}</p>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <p className="text-sm text-slate-600 mb-4 flex-1">
                    {item.description}
                  </p>

                  <div className="space-y-3 border-t border-slate-100 pt-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Audience</span>
                      <span className="font-semibold text-slate-700">{item.audience}</span>
                    </div>

                    <button className="w-full mt-3 rounded-lg bg-slate-900 text-white text-sm font-semibold py-2 hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
                      Open Tool
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-16 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 p-8 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Register Your Approved Tool</h2>
          <p className="text-slate-600 mb-6 max-w-xl mx-auto">
            Have an approved AI tool ready to deploy? Register it with our governance framework and make it available to your organization.
          </p>
          <button className="rounded-full bg-emerald-600 text-white px-6 py-3 font-semibold hover:bg-emerald-700 transition-colors inline-flex items-center gap-2">
            Register Tool
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </main>
    </div>
  );
};

export default Toolbox;
