import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, AlertTriangle, Users, DollarSign, Target } from "lucide-react";

const categoryIcons = {
  "Innovation": <TrendingUp className="w-4 h-4" />,
  "Risk": <AlertTriangle className="w-4 h-4" />,
  "Talent": <Users className="w-4 h-4" />,
  "Finance": <DollarSign className="w-4 h-4" />,
  "Customer focus": <Target className="w-4 h-4" />
};

const categoryColors = {
  "Innovation": "bg-blue-100 text-blue-700 border-blue-200",
  "Risk": "bg-red-100 text-red-700 border-red-200",
  "Talent": "bg-purple-100 text-purple-700 border-purple-200",
  "Finance": "bg-green-100 text-green-700 border-green-200",
  "Customer focus": "bg-orange-100 text-orange-700 border-orange-200"
};

const CompetitiveMoves = ({ news }) => {
  const [selectedCompany, setSelectedCompany] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const companies = [...new Set(news.map(n => n.company_name))];
  const categories = [...new Set(news.map(n => n.category))];

  const filteredNews = news.filter(item => {
    const companyMatch = selectedCompany === "all" || item.company_name === selectedCompany;
    const categoryMatch = selectedCategory === "all" || item.category === selectedCategory;
    return companyMatch && categoryMatch;
  });

  const categoryCounts = categories.reduce((acc, cat) => {
    acc[cat] = news.filter(n => n.category === cat).length;
    return acc;
  }, {});

  return (
    <div className="space-y-6" data-testid="competitive-moves">
      {/* Category Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {Object.entries(categoryCounts).map(([category, count]) => (
          <Card key={category} className={`border ${categoryColors[category]} hover:shadow-lg transition-shadow cursor-pointer`} onClick={() => setSelectedCategory(category)} data-testid={`category-card-${category.toLowerCase().replace(' ', '-')}`}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    {categoryIcons[category]}
                    <span className="text-sm font-medium">{category}</span>
                  </div>
                  <div className="text-3xl font-bold">{count}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="bg-white border-slate-200">
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="text-sm font-medium text-slate-700 mb-2 block">Filter by Company</label>
              <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                <SelectTrigger data-testid="company-filter">
                  <SelectValue placeholder="All Companies" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Companies</SelectItem>
                  {companies.map(company => (
                    <SelectItem key={company} value={company}>{company}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="text-sm font-medium text-slate-700 mb-2 block">Filter by Category</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger data-testid="category-filter">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* News Timeline */}
      <Card className="bg-white border-slate-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold">Recent Competitive Moves</CardTitle>
            <Badge variant="secondary" className="bg-slate-100 text-slate-700">
              {filteredNews.length} Events
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredNews.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                No news found for the selected filters
              </div>
            ) : (
              filteredNews.sort((a, b) => new Date(b.date) - new Date(a.date)).map((item) => (
                <div key={item.id} className="border border-slate-200 rounded-lg p-5 hover:shadow-md transition-shadow" data-testid="news-item">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant="outline" className="font-semibold text-slate-900 border-slate-300">
                          {item.company_name}
                        </Badge>
                        <Badge variant="outline" className={categoryColors[item.category]}>
                          <span className="flex items-center gap-1">
                            {categoryIcons[item.category]}
                            {item.category}
                          </span>
                        </Badge>
                        <Badge variant={item.impact === "High" ? "default" : "secondary"} className={item.impact === "High" ? "bg-red-600" : "bg-slate-400"}>
                          {item.impact} Impact
                        </Badge>
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">{item.title}</h3>
                      <p className="text-slate-600 mb-2">{item.description}</p>
                      <p className="text-sm text-slate-500">{new Date(item.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white border-slate-200">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Most Active Companies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {companies.map(company => {
                const count = news.filter(n => n.company_name === company).length;
                const maxCount = Math.max(...companies.map(c => news.filter(n => n.company_name === c).length));
                return (
                  <div key={company} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-slate-900">{company}</span>
                      <span className="text-sm font-semibold text-blue-600">{count} moves</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full transition-all" style={{ width: `${(count / maxCount) * 100}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Key Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Innovation Leaders</h4>
                <p className="text-sm text-blue-700">
                  {companies.filter(c => news.filter(n => n.company_name === c && n.category === "Innovation").length > 0).slice(0, 3).join(", ")} are leading in innovation with new technology launches and strategic acquisitions.
                </p>
              </div>
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-2">Talent Focus</h4>
                <p className="text-sm text-green-700">
                  Major firms are ramping up hiring in AI and cloud technologies, indicating a shift towards digital-first services.
                </p>
              </div>
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <h4 className="font-semibold text-orange-900 mb-2">Market Expansion</h4>
                <p className="text-sm text-orange-700">
                  Customer-focused moves show expansion into new markets and strengthening of existing client relationships.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CompetitiveMoves;