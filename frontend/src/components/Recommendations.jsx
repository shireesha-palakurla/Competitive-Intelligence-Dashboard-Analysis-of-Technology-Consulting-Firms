import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lightbulb, TrendingUp, Target, AlertCircle, CheckCircle, ArrowRight } from "lucide-react";

const Recommendations = ({ companies, news, trends }) => {
  // Analyze data for insights
  const topPerformers = [...companies].sort((a, b) => b.yoy_growth - a.yoy_growth).slice(0, 3);
  const innovationLeaders = [...companies].sort((a, b) => b.innovation_score - a.innovation_score).slice(0, 3);
  const highGrowthTechs = [...trends].sort((a, b) => b.growth_rate - a.growth_rate).slice(0, 3);
  const innovationNews = news.filter(n => n.category === "Innovation");

  return (
    <div className="space-y-6" data-testid="recommendations">
      {/* Executive Summary */}
      <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white border-0">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-500 rounded-lg">
              <Lightbulb className="w-7 h-7 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">Strategic Recommendations</CardTitle>
              <p className="text-blue-100 mt-1">Key insights and actionable strategies for competitive advantage</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Key Findings */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white border-slate-200 hover:shadow-lg transition-shadow" data-testid="finding-growth">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <CardTitle className="text-base">Growth Leaders</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {topPerformers.map((company, idx) => (
                <div key={company.id} className="flex justify-between items-center">
                  <span className="text-sm text-slate-700">{company.name}</span>
                  <Badge className="bg-green-600">{company.yoy_growth}%</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 hover:shadow-lg transition-shadow" data-testid="finding-innovation">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              <CardTitle className="text-base">Innovation Leaders</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {innovationLeaders.map((company, idx) => (
                <div key={company.id} className="flex justify-between items-center">
                  <span className="text-sm text-slate-700">{company.name}</span>
                  <Badge className="bg-blue-600">{company.innovation_score}/10</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 hover:shadow-lg transition-shadow" data-testid="finding-tech">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-orange-600" />
              <CardTitle className="text-base">Hot Technologies</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {highGrowthTechs.map((tech, idx) => (
                <div key={tech.id} className="flex justify-between items-center">
                  <span className="text-sm text-slate-700">{tech.technology}</span>
                  <Badge className="bg-orange-600">+{tech.growth_rate}%</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Strategic Recommendations */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Priority Recommendations</h2>
        
        <Card className="bg-white border-l-4 border-l-blue-600 border-slate-200">
          <CardHeader>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 rounded-lg mt-1">
                <CheckCircle className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-lg text-slate-900">1. Accelerate AI & Cloud Transformation</CardTitle>
                <p className="text-sm text-slate-600 mt-2">
                  With AI adoption scores averaging 8.2/10 across top firms and cloud computing showing 92.3% adoption rate, 
                  organizations must prioritize these technologies. The AI market is growing at 35.2% annually ($89.5B market size).
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                <ArrowRight className="w-4 h-4" />
                Action Items
              </h4>
              <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
                <li>Invest in AI-powered analytics and automation platforms</li>
                <li>Develop hybrid cloud capabilities to match competitors</li>
                <li>Acquire or partner with AI specialists ({innovationNews.length} recent acquisitions tracked)</li>
                <li>Upskill workforce with AI/ML training programs</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-l-4 border-l-green-600 border-slate-200">
          <CardHeader>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-green-100 rounded-lg mt-1">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-lg text-slate-900">2. Focus on High-Growth Market Segments</CardTitle>
                <p className="text-sm text-slate-600 mt-2">
                  Digital transformation services and AI consulting represent the fastest-growing segments with 28.5% and 16.8% 
                  annual growth respectively. Total addressable market exceeds $3.8T.
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                <ArrowRight className="w-4 h-4" />
                Action Items
              </h4>
              <ul className="list-disc list-inside text-sm text-green-700 space-y-1">
                <li>Expand service offerings in AI consulting and digital transformation</li>
                <li>Target high-growth industries: Healthcare, Financial Services, Technology</li>
                <li>Develop industry-specific solutions and accelerators</li>
                <li>Build strategic partnerships in emerging markets</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-l-4 border-l-orange-600 border-slate-200">
          <CardHeader>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-orange-100 rounded-lg mt-1">
                <CheckCircle className="w-5 h-5 text-orange-600" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-lg text-slate-900">3. Strengthen Talent Acquisition & Retention</CardTitle>
                <p className="text-sm text-slate-600 mt-2">
                  Leading firms like TCS are hiring 40,000+ AI specialists. Talent wars are intensifying as companies 
                  compete for scarce AI, cloud, and cybersecurity expertise.
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h4 className="font-semibold text-orange-900 mb-2 flex items-center gap-2">
                <ArrowRight className="w-4 h-4" />
                Action Items
              </h4>
              <ul className="list-disc list-inside text-sm text-orange-700 space-y-1">
                <li>Launch aggressive AI/cloud talent acquisition programs</li>
                <li>Create internal academies for workforce reskilling</li>
                <li>Offer competitive compensation and career development paths</li>
                <li>Build strategic partnerships with universities and boot camps</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-l-4 border-l-purple-600 border-slate-200">
          <CardHeader>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-purple-100 rounded-lg mt-1">
                <CheckCircle className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-lg text-slate-900">4. Enhance Competitive Positioning</CardTitle>
                <p className="text-sm text-slate-600 mt-2">
                  Top performers balance innovation (avg 8.8/10) with execution excellence (avg 9.0/10). 
                  Leaders quadrant firms show superior market share growth.
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h4 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
                <ArrowRight className="w-4 h-4" />
                Action Items
              </h4>
              <ul className="list-disc list-inside text-sm text-purple-700 space-y-1">
                <li>Invest in R&D to improve innovation scores</li>
                <li>Strengthen project delivery capabilities for execution excellence</li>
                <li>Develop thought leadership through research and publications</li>
                <li>Build strategic alliances with technology vendors</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Risk Factors */}
      <Card className="bg-white border-slate-200">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <CardTitle className="text-xl font-semibold">Risk Factors to Monitor</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Alert className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-800">
                <strong>Market Saturation:</strong> Consulting market consolidation may limit growth opportunities. 
                Differentiation through specialized services is critical.
              </AlertDescription>
            </Alert>
            <Alert className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-800">
                <strong>Technology Disruption:</strong> Rapid AI advancement may commoditize traditional consulting services. 
                Continuous innovation required.
              </AlertDescription>
            </Alert>
            <Alert className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-800">
                <strong>Talent Shortages:</strong> Competition for AI/cloud talent driving up costs. 
                Build vs. buy strategies need evaluation.
              </AlertDescription>
            </Alert>
            <Alert className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-800">
                <strong>Economic Headwinds:</strong> Potential recession could impact consulting budgets. 
                Focus on value-based pricing and ROI demonstration.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>

      {/* Competitive Insights Summary */}
      <Card className="bg-white border-slate-200">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Competitive Landscape Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-slate max-w-none">
            <p className="text-slate-700 leading-relaxed">
              The competitive intelligence analysis reveals a rapidly evolving market where innovation and execution 
              excellence are key differentiators. <strong>Accenture</strong>, <strong>Deloitte</strong>, and <strong>BCG</strong> lead 
              in innovation scores, while <strong>TCS</strong>, <strong>Infosys</strong>, and <strong>Deloitte</strong> excel in execution.
            </p>
            <p className="text-slate-700 leading-relaxed mt-4">
              Technology adoption is accelerating across all firms, with AI (78.5% adoption) and Cloud (92.3% adoption) 
              becoming table stakes. The market is shifting from traditional consulting to technology-enabled services, 
              creating both opportunities and threats for established players.
            </p>
            <p className="text-slate-700 leading-relaxed mt-4">
              <strong>Strategic Priority:</strong> Organizations must balance three imperatives: (1) Accelerate digital 
              transformation capabilities, (2) Secure critical AI/cloud talent, and (3) Differentiate through specialized 
              industry solutions. Firms that successfully execute on these priorities will capture disproportionate market share 
              in the $3.8T+ addressable market.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Recommendations;