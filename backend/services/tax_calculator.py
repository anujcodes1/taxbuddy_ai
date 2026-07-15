"""
tax_calculator.py
------------------
This file contains plain Python functions (no AI) for:
1. Calculating tax under the New Regime
2. Calculating tax under the Old Regime
3. Comparing both regimes
4. Calculating HRA exemption
5. Finding possible deductions based on user inputs
6. Recommending which ITR form to file

Numbers used here are simplified for FY 2025-26 and are meant for
educational purposes only, not exact professional tax filing.
"""


def calculate_new_regime_tax(taxable_income: float) -> float:
    """Calculates tax payable under the New Tax Regime slabs."""
    slabs = [
        (400000, 0.0),
        (800000, 0.05),
        (1200000, 0.10),
        (1600000, 0.15),
        (2000000, 0.20),
        (2400000, 0.25),
        (float("inf"), 0.30),
    ]

    tax = 0.0
    previous_limit = 0

    for limit, rate in slabs:
        if taxable_income > limit:
            tax += (limit - previous_limit) * rate
        else:
            tax += (taxable_income - previous_limit) * rate
            break
        previous_limit = limit

    # Section 87A rebate: income up to 12,00,000 pays zero tax under new regime
    if taxable_income <= 1200000:
        tax = 0.0

    # Add 4% health & education cess on top of tax
    tax += tax * 0.04
    return round(tax, 2)


def calculate_old_regime_tax(taxable_income: float, age_group: str = "below60") -> float:
    """Calculates tax payable under the Old Tax Regime slabs."""
    if age_group == "senior":       # 60-80 years
        exemption_limit = 300000
    elif age_group == "super_senior":  # above 80 years
        exemption_limit = 500000
    else:
        exemption_limit = 250000

    slabs = [
        (exemption_limit, 0.0),
        (500000, 0.05),
        (1000000, 0.20),
        (float("inf"), 0.30),
    ]

    tax = 0.0
    previous_limit = 0

    for limit, rate in slabs:
        if limit <= previous_limit:
            continue  # skip if exemption limit already covers this slab
        if taxable_income > limit:
            tax += (limit - previous_limit) * rate
        else:
            tax += (taxable_income - previous_limit) * rate
            break
        previous_limit = limit

    # Section 87A rebate: income up to 5,00,000 pays zero tax under old regime
    if taxable_income <= 500000:
        tax = 0.0

    tax += tax * 0.04  # 4% cess
    return round(tax, 2)


def compare_regimes(gross_income: float, deductions_old_regime: float, age_group: str = "below60") -> dict:
    """
    Compares tax payable under both regimes and tells the user which is better.
    - New Regime: standard deduction of 75,000 only
    - Old Regime: standard deduction of 50,000 + user's other deductions (80C, 80D, HRA, etc.)
    """
    new_regime_taxable_income = max(0, gross_income - 75000)
    old_regime_taxable_income = max(0, gross_income - 50000 - deductions_old_regime)

    new_tax = calculate_new_regime_tax(new_regime_taxable_income)
    old_tax = calculate_old_regime_tax(old_regime_taxable_income, age_group)

    better_regime = "New Regime" if new_tax <= old_tax else "Old Regime"
    savings = abs(new_tax - old_tax)

    return {
        "new_regime_tax": new_tax,
        "old_regime_tax": old_tax,
        "new_regime_taxable_income": new_regime_taxable_income,
        "old_regime_taxable_income": old_regime_taxable_income,
        "better_regime": better_regime,
        "savings": round(savings, 2),
    }


def calculate_hra_exemption(basic_salary: float, hra_received: float, rent_paid: float, is_metro: bool) -> dict:
    """
    HRA exemption = minimum of the following 3 values:
    1. Actual HRA received
    2. Rent paid - 10% of basic salary
    3. 50% of basic salary (metro) or 40% of basic salary (non-metro)
    """
    condition_1 = hra_received
    condition_2 = max(0, rent_paid - (0.10 * basic_salary))
    condition_3 = (0.50 if is_metro else 0.40) * basic_salary

    exemption = min(condition_1, condition_2, condition_3)
    taxable_hra = max(0, hra_received - exemption)

    return {
        "hra_exemption": round(exemption, 2),
        "taxable_hra": round(taxable_hra, 2),
        "breakdown": {
            "actual_hra_received": round(condition_1, 2),
            "rent_minus_10pct_basic": round(condition_2, 2),
            "pct_of_basic_salary": round(condition_3, 2),
        },
    }



