import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { format, subDays, parseISO, isWithinInterval } from 'date-fns';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, AreaChart, Area
} from 'recharts';
import { CalendarIcon, BarChart3 } from 'lucide-react';
import type { ColDef } from 'ag-grid-community';

import EnterpriseHeader from '@/components/EnterpriseHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  AgGridTable
} from '@/components/ui/table';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';

import { 
  dailyUsageData, 
  getUniqueAgents, 
  getUniqueCategories,
  getUniqueModels,
  aggregateByAgent, 
  aggregateByDate,
  calculateEfficiencyMetrics,
  type DailyUsage 
} from '@/data/analyticsData';

const chartConfig = {
  usageCount: { label: "Usage Count", color: "hsl(var(--primary))" },
  inputTokens: { label: "Input Tokens", color: "hsl(210, 100%, 50%)" },
  outputTokens: { label: "Output Tokens", color: "hsl(270, 70%, 60%)" },
  totalTokens: { label: "Total Tokens", color: "hsl(var(--primary))" },
} satisfies ChartConfig;

const Analytics = () => {
  // Filter states
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: subDays(new Date(), 29),
    to: new Date(),
  });
  const [selectedAgent, setSelectedAgent] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedModel, setSelectedModel] = useState<string>('all');
  
  const agents = getUniqueAgents();
  const categories = getUniqueCategories();
  const models = getUniqueModels();

  // Filter data based on selections
  const filteredData = useMemo(() => {
    return dailyUsageData.filter((d: DailyUsage) => {
      const date = parseISO(d.date);
      const inDateRange = isWithinInterval(date, { start: dateRange.from, end: dateRange.to });
      const matchesAgent = selectedAgent === 'all' || d.agentName === selectedAgent;
      const matchesCategory = selectedCategory === 'all' || d.category === selectedCategory;
      const matchesModel = selectedModel === 'all' || d.model === selectedModel;
      return inDateRange && matchesAgent && matchesCategory && matchesModel;
    });
  }, [dateRange, selectedAgent, selectedCategory, selectedModel]);

  // Aggregated data for charts
  const usageByAgent = useMemo(() => aggregateByAgent(filteredData), [filteredData]);
  const usageByDate = useMemo(() => aggregateByDate(filteredData), [filteredData]);
  const efficiencyMetrics = useMemo(() => calculateEfficiencyMetrics(filteredData), [filteredData]);

  // Summary stats
  const stats = useMemo(() => {
    const totalUsage = filteredData.reduce((sum, d) => sum + d.usageCount, 0);
    const totalTokens = filteredData.reduce((sum, d) => sum + d.inputTokens + d.outputTokens, 0);
    const uniqueAgents = new Set(filteredData.map(d => d.agentName)).size;
    const avgTokensPerRequest = totalUsage > 0 ? Math.round(totalTokens / totalUsage) : 0;
    
    return [
      { label: 'Total Usage', value: totalUsage.toLocaleString(), suffix: '' },
      { label: 'Total Tokens', value: Math.round(totalTokens / 1000).toLocaleString(), suffix: 'K' },
      { label: 'Active Agents', value: uniqueAgents.toString(), suffix: '' },
      { label: 'Avg Tokens/Request', value: avgTokensPerRequest.toLocaleString(), suffix: '' },
    ];
  }, [filteredData]);

  const efficiencyColumns = useMemo<ColDef<(typeof efficiencyMetrics)[number]>[]>(
    () => [
      {
        headerName: 'Agent Name',
        field: 'agentName',
        pinned: 'left',
        minWidth: 220,
      },
      {
        headerName: 'Usage Count',
        field: 'usageCount',
        type: 'numericColumn',
        minWidth: 150,
        sort: 'desc',
        valueFormatter: (params) => Number(params.value ?? 0).toLocaleString(),
      },
      {
        headerName: 'Avg Tokens/Request',
        field: 'avgTokensPerRequest',
        type: 'numericColumn',
        minWidth: 190,
        valueFormatter: (params) => Number(params.value ?? 0).toLocaleString(),
        cellStyle: (params) => {
          const value = Number(params.value ?? 0);
          if (value > 1000) return { color: '#dc2626', fontWeight: 600 };
          if (value >= 500) return { color: '#ca8a04', fontWeight: 600 };
          return { color: '#16a34a', fontWeight: 600 };
        },
      },
      {
        headerName: 'Total Tokens',
        field: 'totalTokens',
        type: 'numericColumn',
        minWidth: 170,
        valueFormatter: (params) => Number(params.value ?? 0).toLocaleString(),
      },
    ],
    [efficiencyMetrics],
  );

  return (
    <div className="min-h-screen bg-background">
      <EnterpriseHeader
        portalName="Enterprise AI Portal"
        pageTitle="AI Analytics"
        pageDescription="View your AI usage analysis"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Analytics' },
        ]}
        icon={<BarChart3 className="w-5 h-5 text-black" />}
      />
      
      <main className="w-full max-w-[1900px] mx-auto px-6 xl:px-12 py-8">

        {/* Filters Section */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-4 items-end">
              {/* Date Range Picker */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-muted-foreground">Date Range</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-[260px] justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(dateRange.from, "MMM dd")} - {format(dateRange.to, "MMM dd, yyyy")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="range"
                      selected={{ from: dateRange.from, to: dateRange.to }}
                      onSelect={(range) => {
                        if (range?.from && range?.to) {
                          setDateRange({ from: range.from, to: range.to });
                        }
                      }}
                      numberOfMonths={2}
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Agent Filter */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-muted-foreground">Agent</label>
                <Select value={selectedAgent} onValueChange={setSelectedAgent}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Agents" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Agents</SelectItem>
                    {agents.map(agent => (
                      <SelectItem key={agent} value={agent}>{agent}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Category Filter */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-muted-foreground">Category</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Model Filter */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-muted-foreground">Model</label>
                <Select value={selectedModel} onValueChange={setSelectedModel}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="All Models" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Models</SelectItem>
                    {models.map(model => (
                      <SelectItem key={model} value={model}>
                        {model.charAt(0).toUpperCase() + model.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-6 text-center">
                <div className="text-3xl md:text-4xl font-bold text-foreground">
                  {stat.value}{stat.suffix}
                </div>
                <div className="text-sm text-muted-foreground mt-2">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Row 1 */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Usage by Agent - Horizontal Bar */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Usage by Agent</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <BarChart 
                  data={usageByAgent.slice(0, 8)} 
                  layout="vertical" 
                  margin={{ left: 20, right: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                  <XAxis type="number" />
                  <YAxis 
                    dataKey="agentName" 
                    type="category" 
                    width={100}
                    tick={{ fontSize: 12 }}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar 
                    dataKey="usageCount" 
                    fill="hsl(var(--primary))" 
                    radius={[0, 4, 4, 0]}
                    name="Usage Count"
                  />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Usage Trend Over Time - Line Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Usage Trend Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <LineChart data={usageByDate} margin={{ left: 10, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(value) => format(parseISO(value), 'MMM dd')}
                    tick={{ fontSize: 11 }}
                  />
                  <YAxis />
                  <ChartTooltip 
                    content={<ChartTooltipContent />}
                    labelFormatter={(value) => format(parseISO(value as string), 'MMM dd, yyyy')}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="usageCount" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    name="Usage Count"
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 2 */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Input vs Output Tokens - Stacked Bar */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Input vs Output Tokens by Agent</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <BarChart data={usageByAgent.slice(0, 8)} margin={{ left: 10, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="agentName" 
                    tick={{ fontSize: 10 }}
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                    height={70}
                  />
                  <YAxis tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar 
                    dataKey="inputTokens" 
                    stackId="tokens" 
                    fill="hsl(210, 100%, 50%)" 
                    name="Input Tokens"
                    radius={[0, 0, 0, 0]}
                  />
                  <Bar 
                    dataKey="outputTokens" 
                    stackId="tokens" 
                    fill="hsl(270, 70%, 60%)" 
                    name="Output Tokens"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Token Consumption Over Time - Area Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Token Consumption Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <AreaChart data={usageByDate} margin={{ left: 10, right: 20 }}>
                  <defs>
                    <linearGradient id="tokenGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(value) => format(parseISO(value), 'MMM dd')}
                    tick={{ fontSize: 11 }}
                  />
                  <YAxis tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`} />
                  <ChartTooltip 
                    content={<ChartTooltipContent />}
                    labelFormatter={(value) => format(parseISO(value as string), 'MMM dd, yyyy')}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="totalTokens" 
                    stroke="hsl(var(--primary))" 
                    fill="url(#tokenGradient)"
                    strokeWidth={2}
                    name="Total Tokens"
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Agent Efficiency Summary Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Agent Efficiency Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <AgGridTable
              rowData={efficiencyMetrics}
              columnDefs={efficiencyColumns}
              className="h-[420px]"
              defaultColDef={{
                sortable: true,
                filter: true,
                floatingFilter: true,
              }}
            />
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Analytics;
