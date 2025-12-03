import { useState, useEffect } from "react";
import axios from "axios";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import CompanyComparison from "../components/CompanyComparison";
import TechnologyTrends from "../components/TechnologyTrends";
import CompetitiveMoves from "../components/CompetitiveMoves";
import FinancialAnalysis from "../components/FinancialAnalysis";
import SWOTAnalysis from "../components/SWOTAnalysis";
import MarketSizing from "../components/MarketSizing";
import Recommendations from "../components/Recommendations";
import { Building2, TrendingUp } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Dashboard = () => {
  const [companies, setCompanies] = useState([]);
  const [news, setNews] = useState([]);
  const [trends, setTrends] = useState([]);
  const [marketData, setMarketData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [companiesRes, newsRes, trendsRes, marketRes] = await Promise.all([
        axios.get(`${API}/companies`),
        axios.get(`${API}/news`),
        axios.get(`${API}/trends`),
        axios.get(`${API}/market-sizing`)
      ]);
      
      setCompanies(companiesRes.data);
      setNews(newsRes.data);
      setTrends(trendsRes.data);
      setMarketData(marketRes.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" data-testid="loading-spinner">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100" data-testid="dashboard-container">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-600 rounded-xl">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Competitive Intelligence Dashboard
              </h1>
              <p className="text-slate-600 mt-1">Technology & Consulting Firms Analysis</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white border-slate-200 hover:shadow-lg transition-shadow" data-testid="overview-card-companies">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Total Companies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-slate-900">{companies.length}</div>
              <p className="text-sm text-slate-500 mt-1">Under Analysis</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 hover:shadow-lg transition-shadow" data-testid="overview-card-news">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Recent Moves</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-slate-900">{news.length}</div>
              <p className="text-sm text-slate-500 mt-1">Tracked Events</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 hover:shadow-lg transition-shadow" data-testid="overview-card-market">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Market Size</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-slate-900">$3.8T</div>
              <p className="text-sm text-slate-500 mt-1">Combined TAM</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="companies" className="space-y-6" data-testid="main-tabs">
          <TabsList className="bg-white border border-slate-200 p-1 rounded-xl shadow-sm inline-flex">
            <TabsTrigger 
              value="companies" 
              className="px-6 py-2.5 rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all"
              data-testid="tab-companies"
            >
              Company Comparison
            </TabsTrigger>
            <TabsTrigger 
              value="trends" 
              className="px-6 py-2.5 rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all"
              data-testid="tab-trends"
            >
              Technology Trends
            </TabsTrigger>
            <TabsTrigger 
              value="moves" 
              className="px-6 py-2.5 rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all"
              data-testid="tab-moves"
            >
              Competitive Moves
            </TabsTrigger>
            <TabsTrigger 
              value="financial" 
              className="px-6 py-2.5 rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all"
              data-testid="tab-financial"
            >
              Financial Analysis
            </TabsTrigger>
            <TabsTrigger 
              value="swot" 
              className="px-6 py-2.5 rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all"
              data-testid="tab-swot"
            >
              SWOT Analysis
            </TabsTrigger>
            <TabsTrigger 
              value="market" 
              className="px-6 py-2.5 rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all"
              data-testid="tab-market"
            >
              Market Sizing
            </TabsTrigger>
            <TabsTrigger 
              value="recommendations" 
              className="px-6 py-2.5 rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all"
              data-testid="tab-recommendations"
            >
              Recommendations
            </TabsTrigger>
          </TabsList>

          <TabsContent value="companies" data-testid="content-companies">
            <CompanyComparison companies={companies} />
          </TabsContent>

          <TabsContent value="trends" data-testid="content-trends">
            <TechnologyTrends trends={trends} companies={companies} />
          </TabsContent>

          <TabsContent value="moves" data-testid="content-moves">
            <CompetitiveMoves news={news} />
          </TabsContent>

          <TabsContent value="financial" data-testid="content-financial">
            <FinancialAnalysis companies={companies} />
          </TabsContent>

          <TabsContent value="swot" data-testid="content-swot">
            <SWOTAnalysis companies={companies} />
          </TabsContent>

          <TabsContent value="market" data-testid="content-market">
            <MarketSizing marketData={marketData} />
          </TabsContent>

          <TabsContent value="recommendations" data-testid="content-recommendations">
            <Recommendations companies={companies} news={news} trends={trends} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;