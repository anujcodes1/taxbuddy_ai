"""
main.py
-------
This is the entry point of the TaxBuddy AI backend.
It creates the FastAPI app, sets up CORS (so the React frontend can call it),
builds the LangChain + FAISS RAG chatbot on startup, and defines all API routes.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import os

from services.rag_chatbot import rag_chatbot
from services import tax_calculator
from services import income_tax_calculator
from services import regime_comparison
from services import hra_calculator
from services import deduction_finder
from services import itr_recommender

# Load environment variables (like GEMINI_API_KEY) from .env file
load_dotenv()

app = FastAPI(title="TaxBuddy AI API")

# Allow the React frontend to talk to this backend.
# Locally this defaults to "*" (any origin) for convenience.
# In production, set ALLOWED_ORIGINS in your .env to your deployed frontend's
# URL (comma-separated if you have more than one), e.g.:
#   ALLOWED_ORIGINS=https://taxbuddy-ai.vercel.app
allowed_origins_env = os.getenv("ALLOWED_ORIGINS", "*")
allowed_origins = [origin.strip() for origin in allowed_origins_env.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup_event():
    """Runs once when the server starts. Builds the FAISS + LangChain RAG chatbot."""
    rag_chatbot.build()


# ---------------------------------------------------------------------------
# Request/Response models (Pydantic) — these define the shape of incoming data
# ---------------------------------------------------------------------------

class ChatRequest(BaseModel):
    message: str


class RegimeCompareRequest(BaseModel):
    salary: float
    section_80c: float = 0
    section_80d: float = 0
    hra_received: float = 0
    rent_paid: float = 0
    is_metro: bool = True


class TaxCalculatorRequest(BaseModel):
    gross_income: float
    regime: str            # "new" or "old"
    deductions: float = 0  # only used for old regime
    age_group: str = "below60"


class HRARequest(BaseModel):
    basic_salary: float
    hra_received: float
    rent_paid: float
    is_metro: bool


class DeductionFinderRequest(BaseModel):
    has_life_insurance: bool = False
    has_ppf_or_elss: bool = False
    has_health_insurance: bool = False
    has_home_loan: bool = False
    has_nps: bool = False
    has_education_loan: bool = False


class IncomeTaxRequest(BaseModel):
    annual_salary: float
    age: int


class ITRRecommendationRequest(BaseModel):
    salary: float = 0
    has_business_income: bool = False
    has_capital_gains: bool = False
    has_rental_income: bool = False


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------

@app.get("/")
def root():
    """Simple health check route."""
    return {"status": "TaxBuddy AI backend is running"}


@app.post("/api/chat")
def chat(request: ChatRequest):
    """AI Tax Chatbot — RAG pipeline powered by LangChain + FAISS + Gemini."""
    if not request.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")

    try:
        reply = rag_chatbot.ask(request.message)
        return {"reply": reply}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chatbot error: {str(e)}")


@app.post("/api/calculate-tax")
def calculate_tax(request: TaxCalculatorRequest):
    """Income Tax Calculator for either New or Old regime."""
    if request.regime == "new":
        taxable_income = max(0, request.gross_income - 75000)
        tax = tax_calculator.calculate_new_regime_tax(taxable_income)
    else:
        taxable_income = max(0, request.gross_income - 50000 - request.deductions)
        tax = tax_calculator.calculate_old_regime_tax(taxable_income, request.age_group)

    return {"taxable_income": taxable_income, "tax_payable": tax}


@app.post("/api/income-tax-calculator")
def income_tax_calculator_route(request: IncomeTaxRequest):
    """
    Indian Income Tax Calculator (Old Regime, age-based slabs).
    Inputs: Annual Salary, Age
    Outputs: Tax, Rebate, Cess, Final Tax
    """
    if request.annual_salary < 0:
        raise HTTPException(status_code=400, detail="Annual salary cannot be negative")
    if request.age <= 0 or request.age > 120:
        raise HTTPException(status_code=400, detail="Please enter a valid age")

    result = income_tax_calculator.compute_income_tax(request.annual_salary, request.age)
    return result


@app.post("/api/compare-regimes")
def compare_regimes(request: RegimeCompareRequest):
    """Old vs New Regime Comparison — detailed version with 80C, 80D, HRA, Rent."""
    if request.salary < 0:
        raise HTTPException(status_code=400, detail="Salary cannot be negative")

    result = regime_comparison.compare_regimes(
        salary=request.salary,
        section_80c=request.section_80c,
        section_80d=request.section_80d,
        hra_received=request.hra_received,
        rent_paid=request.rent_paid,
        is_metro=request.is_metro,
    )
    return result


@app.post("/api/hra-calculator")
def hra_calculator_route(request: HRARequest):
    """HRA Exemption Calculator — returns exemption, taxable HRA, and a full step-by-step explanation."""
    if request.basic_salary < 0 or request.hra_received < 0 or request.rent_paid < 0:
        raise HTTPException(status_code=400, detail="Amounts cannot be negative")

    result = hra_calculator.calculate_hra(
        request.basic_salary, request.hra_received, request.rent_paid, request.is_metro
    )
    return result


@app.post("/api/deduction-finder")
def deduction_finder_route(request: DeductionFinderRequest):
    """Deduction Finder — suggests applicable sections, explained in plain language."""
    result = deduction_finder.find_deductions(
        request.has_life_insurance,
        request.has_ppf_or_elss,
        request.has_health_insurance,
        request.has_home_loan,
        request.has_nps,
        request.has_education_loan,
    )
    return {"suggestions": result}


@app.post("/api/recommend-itr")
def recommend_itr_route(request: ITRRecommendationRequest):
    """ITR Form Recommendation — explained in plain language."""
    result = itr_recommender.recommend_itr(
        request.salary,
        request.has_business_income,
        request.has_capital_gains,
        request.has_rental_income,
    )
    return result
