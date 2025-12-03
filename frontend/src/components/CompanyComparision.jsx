import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";

const CompanyComparison = ({ companies }) => {
  const revenueData = companies.map(c => ({
    name: c.name,
    revenue: c.revenue,
    growth: c.yoy_growth
  }));

  const technologyAdoptionData = companies.map(c => ({
    name: c.name,
    AI: c.ai_adoption,
    Cloud: c.cloud_adoption,
    Cybersecurity: c.cybersecurity_adoption,
    Analytics: c.analytics_adoption
  }));

  return (
    <div className="space-y-6" data-testid="company-comparison">
      {/* Revenue Comparison Chart */}
      <Card className="bg-white border-slate-200">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Revenue & Growth Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip 
                contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                labelStyle={{ color: '#0f172a', fontWeight: 600 }}
              />
              <Legend />
              <Bar dataKey="revenue" fill="#3b82f6" name="Revenue ($B)" radius={[8, 8, 0, 0]} />
              <Bar dataKey="growth" fill="#10b981" name="YoY Growth (%)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Technology Adoption Radar */}
      <Card className="bg-white border-slate-200">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Technology Adoption Scores</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {companies.slice(0, 4).map((company, idx) => (
              <div key={company.id}>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">{company.name}</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <RadarChart data={[
                    { subject: 'AI', score: company.ai_adoption, fullMark: 10 },
                    { subject: 'Cloud', score: company.cloud_adoption, fullMark: 10 },
                    { subject: 'Cyber', score: company.cybersecurity_adoption, fullMark: 10 },
                    { subject: 'Analytics', score: company.analytics_adoption, fullMark: 10 }
                  ]}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="subject" stroke="#64748b" />
                    <PolarRadiusAxis angle={90} domain={[0, 10]} stroke="#64748b" />
                    <Radar name={company.name} dataKey="score" stroke={['#3b82f6', '#10b981', '#f59e0b', '#ef4444'][idx]} fill={['#3b82f6', '#10b981', '#f59e0b', '#ef4444'][idx]} fillOpacity={0.6} />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Comparison Table */}
      <Card className="bg-white border-slate-200">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Detailed Company Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold">Company</TableHead>
                  <TableHead className="font-semibold">Revenue ($B)</TableHead>
                  <TableHead className="font-semibold">Growth (%)</TableHead>
                  <TableHead className="font-semibold">Market Share (%)</TableHead>
                  <TableHead className="font-semibold">Services Mix</TableHead>
                  <TableHead className="font-semibold">Innovation</TableHead>
                  <TableHead className="font-semibold">Execution</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {companies.map((company) => (
                  <TableRow key={company.id} className="hover:bg-slate-50 transition-colors">
                    <TableCell className="font-medium">{company.name}</TableCell>
                    <TableCell>{company.revenue.toFixed(1)}</TableCell>
                    <TableCell>
                      <Badge variant={company.yoy_growth > 12 ? "default" : "secondary"} className={company.yoy_growth > 12 ? "bg-green-600" : "bg-slate-400"}>
                        {company.yoy_growth.toFixed(1)}%
                      </Badge>
                    </TableCell>
                    <TableCell>{company.market_share.toFixed(1)}%</TableCell>
                    <TableCell className="text-sm">
                      Consulting: {company.consulting_mix}%<br/>
                      Tech: {company.tech_services_mix}%
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${company.innovation_score * 10}%` }}></div>
                        </div>
                        <span className="text-sm">{company.innovation_score}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-200 rounded-full h-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{ width: `${company.execution_score * 10}%` }}></div>
                        </div>
                        <span className="text-sm">{company.execution_score}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanyComparison;