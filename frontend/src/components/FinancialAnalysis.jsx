import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, BarChart, Bar, Legend } from "recharts";

const FinancialAnalysis = ({ companies }) => {
  const positioningData = companies.map(c => ({
    name: c.name,
    innovation: c.innovation_score,
    execution: c.execution_score,
    marketShare: c.market_share,
    revenue: c.revenue
  }));

  const marketShareData = companies.map(c => ({
    name: c.name,
    marketShare: c.market_share,
    revenue: c.revenue
  })).sort((a, b) => b.marketShare - a.marketShare);

  const getQuadrant = (innovation, execution) => {
    if (innovation >= 8 && execution >= 8) return "Leaders";
    if (innovation >= 8 && execution < 8) return "Visionaries";
    if (innovation < 8 && execution >= 8) return "Performers";
    return "Challengers";
  };

  const quadrantColors = {
    "Leaders": "#10b981",
    "Visionaries": "#3b82f6",
    "Performers": "#f59e0b",
    "Challengers": "#ef4444"
  };

  return (
    <div className="space-y-6" data-testid="financial-analysis">
      {/* Competitive Positioning Matrix */}
      <Card className="bg-white border-slate-200">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Competitive Positioning Matrix (Innovation vs Execution)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={500}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                type="number" 
                dataKey="innovation" 
                name="Innovation Score" 
                domain={[6, 10]}
                stroke="#64748b"
                label={{ value: 'Innovation Score', position: 'insideBottom', offset: -10, fill: '#64748b' }}
              />
              <YAxis 
                type="number" 
                dataKey="execution" 
                name="Execution Score" 
                domain={[6, 10]}
                stroke="#64748b"
                label={{ value: 'Execution Score', angle: -90, position: 'insideLeft', fill: '#64748b' }}
              />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }}
                contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                labelStyle={{ color: '#0f172a', fontWeight: 600 }}
                formatter={(value, name, props) => {
                  if (name === 'innovation') return [value, 'Innovation'];
                  if (name === 'execution') return [value, 'Execution'];
                  return [value, name];
                }}
              />
              <Scatter name="Companies" data={positioningData} fill="#8884d8">
                {positioningData.map((entry, index) => {
                  const quadrant = getQuadrant(entry.innovation, entry.execution);
                  return <Cell key={`cell-${index}`} fill={quadrantColors[quadrant]} />;
                })}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
          
          {/* Quadrant Legend */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-green-600"></div>
                <h4 className="font-semibold text-green-900">Leaders</h4>
              </div>
              <p className="text-sm text-green-700">High Innovation & Execution</p>
              <p className="text-xs text-green-600 mt-1">
                {companies.filter(c => getQuadrant(c.innovation_score, c.execution_score) === "Leaders").map(c => c.name).join(", ")}
              </p>
            </div>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                <h4 className="font-semibold text-blue-900">Visionaries</h4>
              </div>
              <p className="text-sm text-blue-700">High Innovation, Lower Execution</p>
              <p className="text-xs text-blue-600 mt-1">
                {companies.filter(c => getQuadrant(c.innovation_score, c.execution_score) === "Visionaries").map(c => c.name).join(", ") || "None"}
              </p>
            </div>
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-orange-600"></div>
                <h4 className="font-semibold text-orange-900">Performers</h4>
              </div>
              <p className="text-sm text-orange-700">High Execution, Lower Innovation</p>
              <p className="text-xs text-orange-600 mt-1">
                {companies.filter(c => getQuadrant(c.innovation_score, c.execution_score) === "Performers").map(c => c.name).join(", ") || "None"}
              </p>
            </div>
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-red-600"></div>
                <h4 className="font-semibold text-red-900">Challengers</h4>
              </div>
              <p className="text-sm text-red-700">Lower Innovation & Execution</p>
              <p className="text-xs text-red-600 mt-1">
                {companies.filter(c => getQuadrant(c.innovation_score, c.execution_score) === "Challengers").map(c => c.name).join(", ") || "None"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Market Share vs Growth */}
      <Card className="bg-white border-slate-200">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Market Share vs Growth Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                type="number" 
                dataKey="marketShare" 
                name="Market Share" 
                stroke="#64748b"
                label={{ value: 'Market Share (%)', position: 'insideBottom', offset: -10, fill: '#64748b' }}
              />
              <YAxis 
                type="number" 
                dataKey="yoy_growth" 
                name="YoY Growth" 
                stroke="#64748b"
                label={{ value: 'YoY Growth (%)', angle: -90, position: 'insideLeft', fill: '#64748b' }}
              />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }}
                contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
              />
              <Scatter 
                name="Companies" 
                data={companies.map(c => ({ ...c, marketShare: c.market_share }))}
                fill="#3b82f6"
              />
            </ScatterChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Market Share Distribution */}
      <Card className="bg-white border-slate-200">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Market Share Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={marketShareData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip 
                contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
              />
              <Legend />
              <Bar dataKey="marketShare" fill="#3b82f6" name="Market Share (%)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Financial Metrics Table */}
      <Card className="bg-white border-slate-200">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Key Financial Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {companies.map(company => (
              <div key={company.id} className="p-4 border border-slate-200 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-lg text-slate-900 mb-3">{company.name}</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Revenue</span>
                    <span className="font-semibold text-slate-900">${company.revenue}B</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">YoY Growth</span>
                    <span className={`font-semibold ${company.yoy_growth > 12 ? 'text-green-600' : 'text-slate-700'}`}>
                      {company.yoy_growth}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Market Share</span>
                    <span className="font-semibold text-slate-900">{company.market_share}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Global Presence</span>
                    <span className="font-semibold text-slate-900">{company.global_presence} countries</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialAnalysis;