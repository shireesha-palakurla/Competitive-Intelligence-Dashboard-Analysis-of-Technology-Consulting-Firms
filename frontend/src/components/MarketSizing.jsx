import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, DollarSign, Target } from "lucide-react";

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

const MarketSizing = ({ marketData }) => {
  const totalTAM = marketData.reduce((sum, item) => sum + item.tam, 0);
  const totalSAM = marketData.reduce((sum, item) => sum + item.sam, 0);
  const totalSOM = marketData.reduce((sum, item) => sum + item.som, 0);

  return (
    <div className="space-y-6" data-testid="market-sizing">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-600 to-blue-700 text-white border-0 hover:shadow-lg transition-shadow" data-testid="tam-card">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-blue-100 text-sm mb-2">Total Addressable Market</p>
                <div className="text-4xl font-bold">${totalTAM.toFixed(1)}B</div>
                <p className="text-blue-100 text-sm mt-2">TAM across all segments</p>
              </div>
              <div className="p-3 bg-blue-500 rounded-lg">
                <Target className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-600 to-green-700 text-white border-0 hover:shadow-lg transition-shadow" data-testid="sam-card">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-green-100 text-sm mb-2">Serviceable Available Market</p>
                <div className="text-4xl font-bold">${totalSAM.toFixed(1)}B</div>
                <p className="text-green-100 text-sm mt-2">SAM across all segments</p>
              </div>
              <div className="p-3 bg-green-500 rounded-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-600 to-orange-700 text-white border-0 hover:shadow-lg transition-shadow" data-testid="som-card">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-orange-100 text-sm mb-2">Serviceable Obtainable Market</p>
                <div className="text-4xl font-bold">${totalSOM.toFixed(1)}B</div>
                <p className="text-orange-100 text-sm mt-2">SOM across all segments</p>
              </div>
              <div className="p-3 bg-orange-500 rounded-lg">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* TAM/SAM/SOM by Segment */}
      <Card className="bg-white border-slate-200">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Market Sizing by Segment (TAM/SAM/SOM)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={marketData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="segment" stroke="#64748b" />
              <YAxis stroke="#64748b" label={{ value: 'Market Size ($B)', angle: -90, position: 'insideLeft', fill: '#64748b' }} />
              <Tooltip 
                contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                labelStyle={{ color: '#0f172a', fontWeight: 600 }}
              />
              <Legend />
              <Bar dataKey="tam" fill="#3b82f6" name="TAM ($B)" radius={[8, 8, 0, 0]} />
              <Bar dataKey="sam" fill="#10b981" name="SAM ($B)" radius={[8, 8, 0, 0]} />
              <Bar dataKey="som" fill="#f59e0b" name="SOM ($B)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Segment Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white border-slate-200">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Market Share Distribution (TAM)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={marketData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ segment, tam }) => `${segment}: $${tam}B`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="tam"
                >
                  {marketData.map((entry, index) => (
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
            <CardTitle className="text-xl font-semibold">Growth Projections by Segment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {marketData.sort((a, b) => b.growth_projection - a.growth_projection).map((item, idx) => (
                <div key={item.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-900">{item.segment}</span>
                    <span className="text-sm font-semibold text-green-600">+{item.growth_projection}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full transition-all" style={{ width: `${(item.growth_projection / 30) * 100}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Segment Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {marketData.map((item, idx) => (
          <Card key={item.id} className="bg-white border-slate-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{item.segment}</CardTitle>
                <div className={`w-3 h-3 rounded-full ${COLORS[idx % COLORS.length]}`} style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-slate-600 mb-1">TAM</p>
                    <p className="text-2xl font-bold text-blue-600">${item.tam}B</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 mb-1">SAM</p>
                    <p className="text-2xl font-bold text-green-600">${item.sam}B</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 mb-1">SOM</p>
                    <p className="text-2xl font-bold text-orange-600">${item.som}B</p>
                  </div>
                </div>
                <div className="border-t border-slate-200 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Region</span>
                    <span className="font-medium text-slate-900">{item.region}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Industry</span>
                    <span className="font-medium text-slate-900">{item.industry}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Growth Rate</span>
                    <span className="font-medium text-green-600">+{item.growth_projection}%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Market Insights */}
      <Card className="bg-white border-slate-200">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Market Insights & Opportunities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Largest Opportunity</h4>
              <p className="text-sm text-blue-700">
                {marketData.sort((a, b) => b.tam - a.tam)[0]?.segment} represents the largest TAM at ${marketData.sort((a, b) => b.tam - a.tam)[0]?.tam}B
              </p>
            </div>
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-2">Fastest Growing</h4>
              <p className="text-sm text-green-700">
                {marketData.sort((a, b) => b.growth_projection - a.growth_projection)[0]?.segment} is growing at {marketData.sort((a, b) => b.growth_projection - a.growth_projection)[0]?.growth_projection}% annually
              </p>
            </div>
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <h4 className="font-semibold text-orange-900 mb-2">Market Penetration</h4>
              <p className="text-sm text-orange-700">
                Average SOM/TAM ratio is {((totalSOM / totalTAM) * 100).toFixed(1)}%, indicating significant growth potential
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MarketSizing;