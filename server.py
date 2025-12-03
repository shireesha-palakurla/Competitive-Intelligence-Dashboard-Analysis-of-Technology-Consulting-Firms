from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Dict
import uuid
from datetime import datetime, timezone
from emergentintegrations.llm.chat import LlmChat, UserMessage

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Define Models
class Company(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    revenue: float  # in billions
    yoy_growth: float  # percentage
    consulting_mix: float  # percentage
    tech_services_mix: float  # percentage
    global_presence: int  # number of countries
    key_services: List[str]
    major_clients: List[str]
    ai_adoption: float  # score 1-10
    cloud_adoption: float  # score 1-10
    cybersecurity_adoption: float  # score 1-10
    analytics_adoption: float  # score 1-10
    innovation_score: float  # score 1-10
    execution_score: float  # score 1-10
    market_share: float  # percentage

class CompanyNews(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    company_name: str
    title: str
    description: str
    category: str  # Innovation, Risk, Talent, Finance, Customer
    date: str
    impact: str  # High, Medium, Low

class SWOTRequest(BaseModel):
    company_name: str

class SWOTResponse(BaseModel):
    company_name: str
    strengths: List[str]
    weaknesses: List[str]
    opportunities: List[str]
    threats: List[str]

class TechnologyTrend(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    technology: str
    adoption_rate: float  # percentage
    growth_rate: float  # percentage
    market_size: float  # in billions
    year: int

class MarketSizing(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    segment: str
    tam: float  # Total Addressable Market in billions
    sam: float  # Serviceable Available Market in billions
    som: float  # Serviceable Obtainable Market in billions
    region: str
    industry: str
    growth_projection: float  # percentage

# Initialize database with mock data
async def initialize_mock_data():
    # Check if data already exists
    existing_companies = await db.companies.count_documents({})
    if existing_companies > 0:
        return
    
    # Mock company data
    companies = [
        {
            "id": str(uuid.uuid4()),
            "name": "Deloitte",
            "revenue": 64.9,
            "yoy_growth": 12.5,
            "consulting_mix": 60.0,
            "tech_services_mix": 40.0,
            "global_presence": 150,
            "key_services": ["Digital Transformation", "Cloud Migration", "Risk Advisory", "AI/ML Solutions"],
            "major_clients": ["Fortune 500", "Government", "Healthcare", "Financial Services"],
            "ai_adoption": 8.5,
            "cloud_adoption": 9.0,
            "cybersecurity_adoption": 8.7,
            "analytics_adoption": 8.9,
            "innovation_score": 8.8,
            "execution_score": 9.2,
            "market_share": 14.2
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Accenture",
            "revenue": 64.1,
            "yoy_growth": 14.3,
            "consulting_mix": 45.0,
            "tech_services_mix": 55.0,
            "global_presence": 120,
            "key_services": ["Cloud First", "AI at Scale", "Industry X", "Interactive"],
            "major_clients": ["Retail", "Banking", "Telecom", "Energy"],
            "ai_adoption": 9.2,
            "cloud_adoption": 9.5,
            "cybersecurity_adoption": 8.5,
            "analytics_adoption": 9.0,
            "innovation_score": 9.5,
            "execution_score": 9.0,
            "market_share": 14.0
        },
        {
            "id": str(uuid.uuid4()),
            "name": "KPMG",
            "revenue": 36.5,
            "yoy_growth": 9.8,
            "consulting_mix": 55.0,
            "tech_services_mix": 45.0,
            "global_presence": 145,
            "key_services": ["Audit", "Tax", "Advisory", "Digital Transformation"],
            "major_clients": ["Financial Services", "Manufacturing", "Healthcare", "Public Sector"],
            "ai_adoption": 7.5,
            "cloud_adoption": 8.0,
            "cybersecurity_adoption": 8.2,
            "analytics_adoption": 7.8,
            "innovation_score": 7.8,
            "execution_score": 8.5,
            "market_share": 8.0
        },
        {
            "id": str(uuid.uuid4()),
            "name": "EY",
            "revenue": 49.4,
            "yoy_growth": 11.2,
            "consulting_mix": 50.0,
            "tech_services_mix": 50.0,
            "global_presence": 150,
            "key_services": ["Consulting", "Assurance", "Tax", "Strategy"],
            "major_clients": ["Technology", "Financial Services", "Life Sciences", "Government"],
            "ai_adoption": 8.0,
            "cloud_adoption": 8.5,
            "cybersecurity_adoption": 8.3,
            "analytics_adoption": 8.2,
            "innovation_score": 8.3,
            "execution_score": 8.7,
            "market_share": 10.8
        },
        {
            "id": str(uuid.uuid4()),
            "name": "McKinsey",
            "revenue": 15.5,
            "yoy_growth": 8.5,
            "consulting_mix": 95.0,
            "tech_services_mix": 5.0,
            "global_presence": 65,
            "key_services": ["Strategy", "Operations", "Organization", "Digital McKinsey"],
            "major_clients": ["C-Suite", "Private Equity", "Healthcare", "Financial Institutions"],
            "ai_adoption": 8.8,
            "cloud_adoption": 7.5,
            "cybersecurity_adoption": 7.0,
            "analytics_adoption": 9.2,
            "innovation_score": 9.3,
            "execution_score": 8.0,
            "market_share": 3.4
        },
        {
            "id": str(uuid.uuid4()),
            "name": "BCG",
            "revenue": 12.3,
            "yoy_growth": 10.1,
            "consulting_mix": 90.0,
            "tech_services_mix": 10.0,
            "global_presence": 90,
            "key_services": ["Strategy", "Digital Ventures", "BCG X", "BCG Gamma"],
            "major_clients": ["Fortune 100", "Technology", "Healthcare", "Consumer Goods"],
            "ai_adoption": 9.0,
            "cloud_adoption": 8.0,
            "cybersecurity_adoption": 7.5,
            "analytics_adoption": 9.5,
            "innovation_score": 9.7,
            "execution_score": 8.5,
            "market_share": 2.7
        },
        {
            "id": str(uuid.uuid4()),
            "name": "IBM",
            "revenue": 61.9,
            "yoy_growth": 5.5,
            "consulting_mix": 25.0,
            "tech_services_mix": 75.0,
            "global_presence": 175,
            "key_services": ["Hybrid Cloud", "AI & Watson", "Quantum Computing", "Security"],
            "major_clients": ["Enterprise", "Banking", "Healthcare", "Retail"],
            "ai_adoption": 9.8,
            "cloud_adoption": 9.2,
            "cybersecurity_adoption": 9.5,
            "analytics_adoption": 9.0,
            "innovation_score": 9.0,
            "execution_score": 7.5,
            "market_share": 13.5
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Infosys",
            "revenue": 18.6,
            "yoy_growth": 15.4,
            "consulting_mix": 20.0,
            "tech_services_mix": 80.0,
            "global_presence": 56,
            "key_services": ["Digital Services", "Cloud", "Application Development", "AI"],
            "major_clients": ["Banking", "Insurance", "Retail", "Manufacturing"],
            "ai_adoption": 8.2,
            "cloud_adoption": 8.8,
            "cybersecurity_adoption": 7.8,
            "analytics_adoption": 8.5,
            "innovation_score": 8.0,
            "execution_score": 9.0,
            "market_share": 4.1
        },
        {
            "id": str(uuid.uuid4()),
            "name": "TCS",
            "revenue": 27.9,
            "yoy_growth": 16.8,
            "consulting_mix": 15.0,
            "tech_services_mix": 85.0,
            "global_presence": 55,
            "key_services": ["IT Services", "BPO", "Digital Solutions", "Cloud"],
            "major_clients": ["BFSI", "Retail", "Life Sciences", "Technology"],
            "ai_adoption": 8.0,
            "cloud_adoption": 8.5,
            "cybersecurity_adoption": 8.0,
            "analytics_adoption": 8.3,
            "innovation_score": 7.8,
            "execution_score": 9.3,
            "market_share": 6.1
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Capgemini",
            "revenue": 22.5,
            "yoy_growth": 13.2,
            "consulting_mix": 35.0,
            "tech_services_mix": 65.0,
            "global_presence": 50,
            "key_services": ["Digital Transformation", "Cloud", "Cybersecurity", "Data & AI"],
            "major_clients": ["Manufacturing", "Financial Services", "Energy", "Telecom"],
            "ai_adoption": 8.3,
            "cloud_adoption": 8.7,
            "cybersecurity_adoption": 8.5,
            "analytics_adoption": 8.4,
            "innovation_score": 8.5,
            "execution_score": 8.8,
            "market_share": 4.9
        }
    ]
    await db.companies.insert_many(companies)
    
    # Mock news data
    news = [
        {
            "id": str(uuid.uuid4()),
            "company_name": "Accenture",
            "title": "Accenture Acquires AI-Powered Analytics Firm",
            "description": "Strategic acquisition to strengthen AI capabilities in healthcare sector",
            "category": "Innovation",
            "date": "2025-01-15",
            "impact": "High"
        },
        {
            "id": str(uuid.uuid4()),
            "company_name": "Deloitte",
            "title": "Deloitte Launches New Quantum Computing Practice",
            "description": "New practice area focusing on quantum solutions for financial services",
            "category": "Innovation",
            "date": "2025-01-10",
            "impact": "High"
        },
        {
            "id": str(uuid.uuid4()),
            "company_name": "McKinsey",
            "title": "McKinsey Digital Expands to Asia-Pacific",
            "description": "Opening 5 new digital centers across APAC region",
            "category": "Customer focus",
            "date": "2025-01-08",
            "impact": "Medium"
        },
        {
            "id": str(uuid.uuid4()),
            "company_name": "IBM",
            "title": "IBM Partners with Major Cloud Provider",
            "description": "Strategic partnership to enhance hybrid cloud offerings",
            "category": "Customer focus",
            "date": "2024-12-20",
            "impact": "High"
        },
        {
            "id": str(uuid.uuid4()),
            "company_name": "TCS",
            "title": "TCS Announces Major Hiring Push in AI Talent",
            "description": "Plans to hire 40,000 AI specialists in next 12 months",
            "category": "Talent",
            "date": "2024-12-15",
            "impact": "High"
        },
        {
            "id": str(uuid.uuid4()),
            "company_name": "BCG",
            "title": "BCG X Reports Record Growth",
            "description": "Technology build arm sees 50% YoY revenue growth",
            "category": "Finance",
            "date": "2024-12-10",
            "impact": "Medium"
        },
        {
            "id": str(uuid.uuid4()),
            "company_name": "KPMG",
            "title": "KPMG Faces Regulatory Scrutiny",
            "description": "Audit quality concerns raised in recent regulatory review",
            "category": "Risk",
            "date": "2024-12-05",
            "impact": "Medium"
        },
        {
            "id": str(uuid.uuid4()),
            "company_name": "EY",
            "title": "EY Invests $1B in AI and Automation",
            "description": "Multi-year investment to transform service delivery",
            "category": "Innovation",
            "date": "2024-11-28",
            "impact": "High"
        },
        {
            "id": str(uuid.uuid4()),
            "company_name": "Infosys",
            "title": "Infosys Launches Generative AI Platform",
            "description": "New platform enables enterprise AI adoption at scale",
            "category": "Innovation",
            "date": "2024-11-20",
            "impact": "High"
        },
        {
            "id": str(uuid.uuid4()),
            "company_name": "Capgemini",
            "title": "Capgemini Expands Cloud Migration Services",
            "description": "New offerings for multi-cloud enterprise migrations",
            "category": "Customer focus",
            "date": "2024-11-15",
            "impact": "Medium"
        }
    ]
    await db.news.insert_many(news)
    
    # Mock technology trends
    trends = [
        {"id": str(uuid.uuid4()), "technology": "Artificial Intelligence", "adoption_rate": 78.5, "growth_rate": 35.2, "market_size": 89.5, "year": 2025},
        {"id": str(uuid.uuid4()), "technology": "Cloud Computing", "adoption_rate": 92.3, "growth_rate": 18.7, "market_size": 623.3, "year": 2025},
        {"id": str(uuid.uuid4()), "technology": "Cybersecurity", "adoption_rate": 85.7, "growth_rate": 12.4, "market_size": 173.5, "year": 2025},
        {"id": str(uuid.uuid4()), "technology": "Analytics & Big Data", "adoption_rate": 81.2, "growth_rate": 22.8, "market_size": 274.3, "year": 2025},
        {"id": str(uuid.uuid4()), "technology": "IoT", "adoption_rate": 68.4, "growth_rate": 28.5, "market_size": 520.6, "year": 2025},
        {"id": str(uuid.uuid4()), "technology": "Blockchain", "adoption_rate": 42.1, "growth_rate": 67.3, "market_size": 67.4, "year": 2025}
    ]
    await db.trends.insert_many(trends)
    
    # Mock market sizing data
    market_data = [
        {
            "id": str(uuid.uuid4()),
            "segment": "AI Consulting",
            "tam": 450.0,
            "sam": 180.0,
            "som": 45.0,
            "region": "North America",
            "industry": "Technology",
            "growth_projection": 28.5
        },
        {
            "id": str(uuid.uuid4()),
            "segment": "Cloud Services",
            "tam": 850.0,
            "sam": 420.0,
            "som": 95.0,
            "region": "Global",
            "industry": "All Industries",
            "growth_projection": 19.2
        },
        {
            "id": str(uuid.uuid4()),
            "segment": "Digital Transformation",
            "tam": 1200.0,
            "sam": 600.0,
            "som": 150.0,
            "region": "Global",
            "industry": "All Industries",
            "growth_projection": 16.8
        },
        {
            "id": str(uuid.uuid4()),
            "segment": "Cybersecurity Consulting",
            "tam": 380.0,
            "sam": 152.0,
            "som": 38.0,
            "region": "Global",
            "industry": "Financial Services",
            "growth_projection": 12.4
        }
    ]
    await db.market_sizing.insert_many(market_data)

# Routes
@api_router.get("/")
async def root():
    return {"message": "Competitive Intelligence Dashboard API"}

@api_router.get("/companies", response_model=List[Company])
async def get_companies():
    companies = await db.companies.find({}, {"_id": 0}).to_list(1000)
    return companies

@api_router.get("/companies/{company_name}", response_model=Company)
async def get_company(company_name: str):
    company = await db.companies.find_one({"name": company_name}, {"_id": 0})
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    return company

@api_router.get("/news", response_model=List[CompanyNews])
async def get_news(company_name: Optional[str] = None):
    query = {"company_name": company_name} if company_name else {}
    news = await db.news.find(query, {"_id": 0}).to_list(1000)
    return news

@api_router.post("/swot", response_model=SWOTResponse)
async def generate_swot(request: SWOTRequest):
    # Get company data
    company = await db.companies.find_one({"name": request.company_name}, {"_id": 0})
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    
    # Get recent news for the company
    news_items = await db.news.find({"company_name": request.company_name}, {"_id": 0}).to_list(10)
    
    # Prepare context for AI
    context = f"""
Company: {company['name']}
Revenue: ${company['revenue']}B
YoY Growth: {company['yoy_growth']}%
Market Share: {company['market_share']}%
Key Services: {', '.join(company['key_services'])}
AI Adoption Score: {company['ai_adoption']}/10
Cloud Adoption Score: {company['cloud_adoption']}/10
Innovation Score: {company['innovation_score']}/10
Execution Score: {company['execution_score']}/10

Recent News:
"""
    for news in news_items:
        context += f"- {news['title']}: {news['description']}\n"
    
    # Generate SWOT using AI
    try:
        chat = LlmChat(
            api_key=os.environ['EMERGENT_LLM_KEY'],
            session_id=f"swot-{request.company_name}",
            system_message="You are a strategic business analyst. Generate a comprehensive SWOT analysis based on company data provided."
        ).with_model("openai", "gpt-4o-mini")
        
        message = UserMessage(
            text=f"""{context}

Based on this information, generate a SWOT analysis with exactly 4 items in each category (Strengths, Weaknesses, Opportunities, Threats).
Return the response in JSON format:
{{
  "strengths": ["item1", "item2", "item3", "item4"],
  "weaknesses": ["item1", "item2", "item3", "item4"],
  "opportunities": ["item1", "item2", "item3", "item4"],
  "threats": ["item1", "item2", "item3", "item4"]
}}
"""
        )
        
        response = await chat.send_message(message)
        
        # Parse AI response
        import json
        # Extract JSON from response
        response_text = response.strip()
        if "```json" in response_text:
            response_text = response_text.split("```json")[1].split("```")[0]
        elif "```" in response_text:
            response_text = response_text.split("```")[1].split("```")[0]
        
        swot_data = json.loads(response_text)
        
        return SWOTResponse(
            company_name=request.company_name,
            strengths=swot_data.get("strengths", []),
            weaknesses=swot_data.get("weaknesses", []),
            opportunities=swot_data.get("opportunities", []),
            threats=swot_data.get("threats", [])
        )
    except Exception as e:
        logger.error(f"Error generating SWOT: {str(e)}")
        # Fallback to basic SWOT
        return SWOTResponse(
            company_name=request.company_name,
            strengths=[
                f"Strong market position with {company['market_share']}% market share",
                f"High innovation score ({company['innovation_score']}/10)",
                f"Strong execution capabilities ({company['execution_score']}/10)",
                f"Global presence in {company['global_presence']} countries"
            ],
            weaknesses=[
                "Areas for improvement in emerging technologies",
                "Competition from agile startups",
                "Talent acquisition challenges",
                "Legacy system integration complexities"
            ],
            opportunities=[
                "Growing demand for AI and cloud services",
                "Expansion into emerging markets",
                "Strategic partnerships and acquisitions",
                "New service line development"
            ],
            threats=[
                "Intense competition in consulting market",
                "Rapid technological disruption",
                "Economic uncertainty and budget constraints",
                "Cybersecurity and data privacy concerns"
            ]
        )

@api_router.get("/trends", response_model=List[TechnologyTrend])
async def get_trends():
    trends = await db.trends.find({}, {"_id": 0}).to_list(1000)
    return trends

@api_router.get("/market-sizing", response_model=List[MarketSizing])
async def get_market_sizing():
    market_data = await db.market_sizing.find({}, {"_id": 0}).to_list(1000)
    return market_data

@api_router.get("/positioning")
async def get_positioning_data():
    companies = await db.companies.find({}, {"_id": 0}).to_list(1000)
    return [
        {
            "name": c["name"],
            "innovation_score": c["innovation_score"],
            "execution_score": c["execution_score"],
            "market_share": c["market_share"],
            "yoy_growth": c["yoy_growth"]
        }
        for c in companies
    ]

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def startup_event():
    await initialize_mock_data()
    logger.info("Database initialized with mock data")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()