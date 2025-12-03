import { useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, AlertTriangle, Target, Shield } from "lucide-react";
import { toast } from "sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const SWOTAnalysis = ({ companies }) => {
  const [selectedCompany, setSelectedCompany] = useState(companies[0]?.name || "");
  const [swotData, setSwotData] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateSWOT = async () => {
    if (!selectedCompany) return;
    
    setLoading(true);
    try {
      const response = await axios.post(`${API}/swot`, {
        company_name: selectedCompany
      });
      setSwotData(response.data);
      toast.success("SWOT analysis generated successfully!");
    } catch (error) {
      console.error("Error generating SWOT:", error);
      toast.error("Failed to generate SWOT analysis");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6" data-testid="swot-analysis">
      {/* Company Selection */}
      <Card className="bg-white border-slate-200">
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[300px]">
              <label className="text-sm font-medium text-slate-700 mb-2 block">Select Company</label>
              <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                <SelectTrigger data-testid="company-select">
                  <SelectValue placeholder="Select a company" />
                </SelectTrigger>
                <SelectContent>
                  {companies.map(company => (
                    <SelectItem key={company.id} value={company.name}>{company.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button 
              onClick={generateSWOT} 
              disabled={loading || !selectedCompany}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-lg transition-colors"
              data-testid="generate-swot-btn"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Generating...
                </span>
              ) : (
                "Generate AI-Powered SWOT"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {swotData && (
        <>
          {/* Company Overview */}
          <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white border-0">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold">{swotData.company_name}</CardTitle>
                  <p className="text-blue-100 mt-1">SWOT Analysis Report</p>
                </div>
                <Badge variant="secondary" className="bg-white text-blue-700 px-4 py-2">
                  AI Generated
                </Badge>
              </div>
            </CardHeader>
          </Card>

          {/* SWOT Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Strengths */}
            <Card className="bg-green-50 border-green-200" data-testid="swot-strengths">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-green-600 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <CardTitle className="text-xl text-green-900">Strengths</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {swotData.strengths.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 p-3 bg-white border border-green-200 rounded-lg">
                      <span className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                        {idx + 1}
                      </span>
                      <span className="text-slate-700 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Weaknesses */}
            <Card className="bg-red-50 border-red-200" data-testid="swot-weaknesses">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-red-600 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-white" />
                  </div>
                  <CardTitle className="text-xl text-red-900">Weaknesses</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {swotData.weaknesses.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 p-3 bg-white border border-red-200 rounded-lg">
                      <span className="flex-shrink-0 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                        {idx + 1}
                      </span>
                      <span className="text-slate-700 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Opportunities */}
            <Card className="bg-blue-50 border-blue-200" data-testid="swot-opportunities">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-600 rounded-lg">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <CardTitle className="text-xl text-blue-900">Opportunities</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {swotData.opportunities.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 p-3 bg-white border border-blue-200 rounded-lg">
                      <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                        {idx + 1}
                      </span>
                      <span className="text-slate-700 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Threats */}
            <Card className="bg-orange-50 border-orange-200" data-testid="swot-threats">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-orange-600 rounded-lg">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <CardTitle className="text-xl text-orange-900">Threats</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {swotData.threats.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 p-3 bg-white border border-orange-200 rounded-lg">
                      <span className="flex-shrink-0 w-6 h-6 bg-orange-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                        {idx + 1}
                      </span>
                      <span className="text-slate-700 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Strategic Recommendations */}
          <Card className="bg-white border-slate-200">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Strategic Recommendations (TOWS)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">S-O Strategies</h4>
                  <p className="text-sm text-blue-700">Leverage strengths to capitalize on opportunities</p>
                </div>
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">W-O Strategies</h4>
                  <p className="text-sm text-green-700">Address weaknesses to pursue opportunities</p>
                </div>
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <h4 className="font-semibold text-orange-900 mb-2">S-T Strategies</h4>
                  <p className="text-sm text-orange-700">Use strengths to mitigate threats</p>
                </div>
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h4 className="font-semibold text-red-900 mb-2">W-T Strategies</h4>
                  <p className="text-sm text-red-700">Minimize weaknesses and avoid threats</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {!swotData && (
        <Card className="bg-white border-slate-200">
          <CardContent className="py-16 text-center">
            <Shield className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-700 mb-2">No SWOT Analysis Generated</h3>
            <p className="text-slate-500">Select a company and click "Generate AI-Powered SWOT" to get started</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SWOTAnalysis;