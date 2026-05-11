import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import { ArrowLeft, Code2, FileText, Brain, BarChart3, Clock, Star, ArrowRight, Wrench } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const toolboxItems = [
  {
    id: 1,
    title: 'Document Summarizer',
    description: 'Automatically summarize long documents, reports, and articles using AI.',
    category: 'Content',
    status: 'Active',
    users: 234,
    rating: 4.8,
    icon: FileText,
    color: 'bg-blue-100 text-blue-700',
  },
  {
    id: 2,
    title: 'Code Reviewer',
    description: 'AI-powered code review tool that analyzes pull requests for best practices.',
    category: 'Development',
    status: 'Active',
    users: 512,
    rating: 4.6,
    icon: Code2,
    color: 'bg-emerald-100 text-emerald-700',
  },
  {
    id: 3,
    title: 'Meeting Insights',
    description: 'Extract key points and action items from meeting transcripts.',
    category: 'Productivity',
    status: 'Active',
    users: 189,
    rating: 4.9,
    icon: Brain,
    color: 'bg-purple-100 text-purple-700',
  },
  {
    id: 4,
    title: 'Analytics Dashboard',
    description: 'Generate insights and visualizations from your data with natural language.',
    category: 'Analytics',
    status: 'Beta',
    users: 87,
    rating: 4.5,
    icon: BarChart3,
    color: 'bg-yellow-100 text-yellow-700',
  },
  {
    id: 5,
    title: 'Email Assistant',
    description: 'Draft, edit, and optimize emails with AI assistance.',
    category: 'Communication',
    status: 'Coming Soon',
    users: 0,
    rating: 0,
    icon: FileText,
    color: 'bg-pink-100 text-pink-700',
  },
  {
    id: 6,
    title: 'Data Transformer',
    description: 'Convert and transform data between formats with intelligent mapping.',
    category: 'Data',
    status: 'Coming Soon',
    users: 0,
    rating: 0,
    icon: Code2,
    color: 'bg-indigo-100 text-indigo-700',
  },
];

const Toolbox = () => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Beta':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Coming Soon':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="container mx-auto px-6 py-8">
        <Link
          to="/"
          className="group inline-flex items-center mb-4 py-1 text-sm font-medium text-slate-600 hover:text-violet-700 transition-colors w-fit"
        >
          <ArrowLeft className="w-4 h-4 shrink-0 transition-transform duration-300 group-hover:-translate-x-0.5" />
          <span className="whitespace-nowrap ml-2 transition-all duration-300 group-hover:opacity-0 group-hover:-translate-x-2 pointer-events-none">
            Back to Dashboard
          </span>
        </Link>

        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-3 mb-3">
            <div className="inline-flex items-center justify-center h-10 w-10 rounded-lg bg-violet-100">
              <Wrench className="w-6 h-6 text-violet-700" />
            </div>
            <Badge className="bg-violet-100 text-violet-700 border-violet-200">
              Create
            </Badge>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-3">AI Toolbox</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Build and deploy lightweight AI-powered apps and tools without managing complex infrastructure. Create custom workflows, prompt templates, and utilities that your team can start using immediately.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {toolboxItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.status === 'Active';
            const isBeta = item.status === 'Beta';

            return (
              <Card
                key={item.id}
                className={`flex flex-col transition-all duration-200 ${
                  isActive || isBeta
                    ? 'hover:shadow-lg hover:-translate-y-0.5 cursor-pointer'
                    : 'opacity-75'
                }`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-3">
                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${item.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <Badge
                      variant="outline"
                      className={getStatusColor(item.status)}
                    >
                      {item.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                  <p className="text-sm text-slate-500 mt-1">{item.category}</p>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <p className="text-sm text-slate-600 mb-4 flex-1">
                    {item.description}
                  </p>

                  <div className="space-y-3 border-t border-slate-100 pt-4">
                    {item.users > 0 && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500">Users</span>
                        <span className="font-semibold text-slate-700">{item.users.toLocaleString()}</span>
                      </div>
                    )}

                    {item.rating > 0 && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500">Rating</span>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span className="font-semibold text-slate-700">{item.rating}</span>
                        </div>
                      </div>
                    )}

                    {(isActive || isBeta) && (
                      <button className="w-full mt-3 rounded-lg bg-slate-900 text-white text-sm font-semibold py-2 hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
                        Open Tool
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}

                    {item.status === 'Coming Soon' && (
                      <button className="w-full mt-3 rounded-lg border border-slate-200 text-slate-600 text-sm font-semibold py-2 bg-slate-50 cursor-not-allowed opacity-50">
                        Coming Soon
                      </button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-16 rounded-2xl bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-100 p-8 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Create Your Own Tool</h2>
          <p className="text-slate-600 mb-6 max-w-xl mx-auto">
            Have an idea for a new AI tool? Get started with our builder and deploy your custom tool to your team in minutes.
          </p>
          <button className="rounded-full bg-violet-600 text-white px-6 py-3 font-semibold hover:bg-violet-700 transition-colors inline-flex items-center gap-2">
            Create New Tool
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </main>
    </div>
  );
};

export default Toolbox;
