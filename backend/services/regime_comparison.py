"""
regime_comparison.py
---------------------
Old vs New Tax Regime Comparison — the detailed version.

Inputs:  Salary, Section 80C, Section 80D, HRA Received, Rent Paid
Outputs: Old Regime Tax, New Regime Tax, Savings, Recommended Regime

Each step of the comparison is its own function, and we reuse the core
slab-calculation and HRA logic already written in tax_calculator.py
instead of duplicating it.

Assumption used here (kept simple on purpose):
- Basic Salary (needed for the HRA formula) is estimated as 50% of the
  annual Salary entered, which is a common rule-of-thumb used by most
  online tax calculators when the user doesn't separately enter a
  "Basic Salary" component.
"""

from services import tax_calculator
from services import hra_calculator as hra_calc

# --- Simplification limits used in this calculator ---
SECTION_80C_LIMIT = 150000   # Maximum deduction allowed under Section 80C
SECTION_80D_LIMIT = 25000    # Maximum deduction allowed under Section 80D (self/family, below 60)
BASIC_SALARY_RATIO = 0.50    # Assume Basic Salary = 50% of annual Salary


def estimate_basic_salary(salary: float) -> float:
    """
    Step 1: Estimate Basic Salary from total Salary.
    (Needed because the HRA exemption formula depends on Basic Salary,
    which we don't collect as a separate input in this simplified tool.)
    """
    return salary * BASIC_SALARY_RATIO


def get_hra_exemption(salary: float, hra_received: float, rent_paid: float, is_metro: bool = True) -> float:
    """
    Step 2: Calculate the HRA exemption amount using the standard
    "minimum of three" rule, reusing the existing HRA function.
    """
    basic_salary = estimate_basic_salary(salary)
    hra_result = hra_calc.calculate_hra(basic_salary, hra_received, rent_paid, is_metro)
    return hra_result["hra_exemption"]


def get_total_old_regime_deductions(section_80c: float, section_80d: float, hra_exemption: float) -> float:
    """
    Step 3: Add up all deductions available under the Old Regime.
    80C and 80D are capped at their legal limits; HRA exemption is
    added in full (it's already capped by the HRA formula itself).
    """
    capped_80c = min(section_80c, SECTION_80C_LIMIT)
    capped_80d = min(section_80d, SECTION_80D_LIMIT)
    return capped_80c + capped_80d + hra_exemption


def compute_old_regime_tax(salary: float, section_80c: float, section_80d: float,
                            hra_received: float, rent_paid: float, is_metro: bool = True) -> dict:
    """
    Step 4: Calculate final Old Regime tax after applying standard
    deduction (50,000) plus 80C + 80D + HRA exemption.
    """
    hra_exemption = get_hra_exemption(salary, hra_received, rent_paid, is_metro)
    total_deductions = get_total_old_regime_deductions(section_80c, section_80d, hra_exemption)

    taxable_income = max(0, salary - 50000 - total_deductions)
    tax = tax_calculator.calculate_old_regime_tax(taxable_income)

    return {
        "taxable_income": round(taxable_income, 2),
        "hra_exemption": round(hra_exemption, 2),
        "total_deductions": round(total_deductions, 2),
        "tax": tax,
    }


def compute_new_regime_tax(salary: float) -> dict:
    """
    Step 5: Calculate final New Regime tax.
    Only the flat standard deduction (75,000) applies — 80C, 80D,
    and HRA are NOT available under the New Regime.
    """
    taxable_income = max(0, salary - 75000)
    tax = tax_calculator.calculate_new_regime_tax(taxable_income)

    return {
        "taxable_income": round(taxable_income, 2),
        "tax": tax,
    }


def compare_regimes(salary: float, section_80c: float = 0, section_80d: float = 0,
                     hra_received: float = 0, rent_paid: float = 0, is_metro: bool = True) -> dict:
    """
    Main function: runs both regime calculations and decides which one
    saves the taxpayer more money.
    """
    old_result = compute_old_regime_tax(salary, section_80c, section_80d, hra_received, rent_paid, is_metro)
    new_result = compute_new_regime_tax(salary)

    old_tax = old_result["tax"]
    new_tax = new_result["tax"]

    recommended_regime = "New Regime" if new_tax <= old_tax else "Old Regime"
    savings = round(abs(old_tax - new_tax), 2)

    return {
        "old_regime_tax": old_tax,
        "new_regime_tax": new_tax,
        "savings": savings,
        "recommended_regime": recommended_regime,
        "old_regime_details": old_result,
        "new_regime_details": new_result,
    }
