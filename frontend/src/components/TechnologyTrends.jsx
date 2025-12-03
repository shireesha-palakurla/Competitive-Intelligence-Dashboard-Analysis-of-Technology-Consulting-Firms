import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Cloud, Shield, Database, Brain, Network } from "lucide-react";

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const TechnologyTrends = ({ trends, companies }) => {
  const trendIcons = {
    "Artificial Intelligence": <Brain className="w-5 h-5" />,
    "Cloud Computing": <Cloud className="w-5 h-5" />,
    "Cybersecurity": <Shield className="w-5 h-5" />,
    "Analytics & Big Data": <Database className="w-5 h-5" />,
    "IoT": <Network className="w-5 h-5" />,
    "Blockchain": <TrendingUp className="w-5 h-5" />
  };

  return (
    <div className="space-y-6" data-testid="technology-trends">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {trends.slice(0, 3).map((trend, idx) => (
          <Card key={trend.id} className="bg-white border-slate-200 hover:shadow-lg transition-shadow" data-testid={`trend-card-${idx}`}>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${['bg-blue-100', 'bg-green-100', 'bg-orange-100'][idx]}`}>
                  <div className={['text-blue-600', 'text-green-600', 'text-orange-600'][idx]}>
                    {trendIcons[trend.technology]}
                  </div>
                </div>
                <CardTitle className="text-base">{trend.technology}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Adoption Rate</span>
                  <span className="font-semibold text-slate-900">{trend.adoption_rate}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className={`h-2 rounded-full ${['bg-blue-600', 'bg-green-600', 'bg-orange-600'][idx]}`} style={{ width: `${trend.adoption_rate}%` }}></div>
                </div>
                <div className="flex justify-between text-sm mt-3">
                  <span className="text-slate-600">Growth Rate</span>
                  <span className="font-semibold text-green-600">+{trend.growth_rate}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Market Size</span>
                  <span className="font-semibold text-slate-900">${trend.market_size}B</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Market Size & Growth Chart */}
      <Card className="bg-white border-slate-200">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Market Size & Growth Rate by Technology</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={trends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="technology" stroke="#64748b" />
              <YAxis yAxisId="left" stroke="#64748b" />
              <YAxis yAxisId="right" orientation="right" stroke="#64748b" />
              <Tooltip 
                contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                labelStyle={{ color: '#0f172a', fontWeight: 600 }}
              />
              <Legend />
              <Bar yAxisId="left" dataKey="market_size" fill="#3b82f6" name="Market Size ($B)" radius={[8, 8, 0, 0]} />
              <Bar yAxisId="right" dataKey="growth_rate" fill="#10b981" name="Growth Rate (%)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Adoption Rate Pie Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white border-slate-200">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Technology Adoption Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={trends}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ technology, adoption_rate }) => `${technology}: ${adoption_rate}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="adoption_rate"
                >
                  {trends.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Top Company Technology Scores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {companies.sort((a, b) => {
                const avgA = (a.ai_adoption + a.cloud_adoption + a.cybersecurity_adoption + a.analytics_adoption) / 4;
                const avgB = (b.ai_adoption + b.cloud_adoption + b.cybersecurity_adoption + b.analytics_adoption) / 4;
                return avgB - avgA;
              }).slice(0, 5).map((company, idx) => {
                const avgScore = (company.ai_adoption + company.cloud_adoption + company.cybersecurity_adoption + company.analytics_adoption) / 4;
                return (
                  <div key={company.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-700">{idx + 1}.</span>
                        <span className="text-sm font-medium text-slate-900">{company.name}</span>
                      </div>
                      <span className="text-sm font-semibold text-blue-600">{avgScore.toFixed(1)}/10</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${avgScore * 10}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Technology Announcements */}
      <Card className="bg-white border-slate-200">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Technology Investment Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-900">High Growth Technologies</h3>
              {trends.sort((a, b) => b.growth_rate - a.growth_rate).slice(0, 3).map((trend, idx) => (
                <div key={trend.id} className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-green-900">{trend.technology}</h4>
                      <p className="text-sm text-green-700 mt-1">Expected to grow at {trend.growth_rate}% annually</p>
                    </div>
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-900">Largest Markets</h3>
              {trends.sort((a, b) => b.market_size - a.market_size).slice(0, 3).map((trend, idx) => (
                <div key={trend.id} className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-blue-900">{trend.technology}</h4>
                      <p className="text-sm text-blue-700 mt-1">Market size: ${trend.market_size}B</p>
                    </div>
                    <Database className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TechnologyTrends;