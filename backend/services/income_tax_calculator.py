"""
income_tax_calculator.py
-------------------------
A simple, standalone Indian Income Tax Calculator.

Inputs:  Annual Salary, Age
Outputs: Tax, Cess, Rebate, Final Tax

This uses the OLD TAX REGIME slabs, because age-based exemption limits
(below 60 / 60-80 / above 80) only apply under the Old Regime. The New
Regime uses the same slabs for everyone regardless of age.

Each step of the calculation is written as its own small function, so it's
easy to read, test, and reuse individually.
"""

# --- Constants used across the calculations ---
STANDARD_DEDUCTION = 50000     # Flat deduction available to all salaried individuals (Old Regime)
CESS_RATE = 0.04                # 4% Health & Education Cess, applied on tax after rebate
REBATE_87A_INCOME_LIMIT = 500000   # Section 87A rebate is available if taxable income <= this
REBATE_87A_MAX_AMOUNT = 12500       # Maximum rebate amount under Section 87A


def get_age_category(age: int) -> str:
    """
    Step 1: Determine which age category the person falls into.
    This decides the basic exemption limit used in the tax slabs.
    """
    if age >= 80:
        return "super_senior"   # Above 80 years
    elif age >= 60:
        return "senior"         # 60 to 79 years
    else:
        return "regular"        # Below 60 years


def get_taxable_income(annual_salary: float) -> float:
    """
    Step 2: Subtract the standard deduction from annual salary to get
    the taxable income. (We keep it simple here — no other deductions
    like 80C/80D are considered in this standalone calculator.)
    """
    taxable_income = annual_salary - STANDARD_DEDUCTION
    return max(0, taxable_income)


def calculate_tax(taxable_income: float, age: int) -> float:
    """
    Step 3: Calculate income tax based on the Old Regime slabs,
    using the exemption limit that matches the person's age category.

    Slabs (Old Regime):
    - Regular (<60):        0-2.5L: 0% | 2.5L-5L: 5% | 5L-10L: 20% | above 10L: 30%
    - Senior (60-79):       0-3L:   0% | 3L-5L:   5% | 5L-10L: 20% | above 10L: 30%
    - Super Senior (80+):   0-5L:   0%                | 5L-10L: 20% | above 10L: 30%
    """
    age_category = get_age_category(age)

    if age_category == "super_senior":
        exemption_limit = 500000
    elif age_category == "senior":
        exemption_limit = 300000
    else:
        exemption_limit = 250000

    # Define the slab boundaries and their tax rates, starting from the exemption limit
    slabs = [
        (exemption_limit, 0.00),
        (500000, 0.05),
        (1000000, 0.20),
        (float("inf"), 0.30),
    ]

    tax = 0.0
    previous_limit = 0

    for limit, rate in slabs:
        # Skip slabs that are already fully covered by the exemption limit
        if limit <= previous_limit:
            continue

        if taxable_income > limit:
            tax += (limit - previous_limit) * rate
        else:
            tax += (taxable_income - previous_limit) * rate
            break

        previous_limit = limit

    return round(tax, 2)


def calculate_rebate(taxable_income: float, tax: float) -> float:
    """
    Step 4: Calculate Section 87A rebate.
    If taxable income is within the limit, the person gets a rebate
    (up to a maximum amount) that reduces their tax — often to zero.
    """
    if taxable_income <= REBATE_87A_INCOME_LIMIT:
        rebate = min(tax, REBATE_87A_MAX_AMOUNT)
    else:
        rebate = 0.0

    return round(rebate, 2)


def calculate_cess(tax_after_rebate: float) -> float:
    """
    Step 5: Calculate Health & Education Cess (4%) on the tax
    remaining after the rebate has been applied.
    """
    cess = tax_after_rebate * CESS_RATE
    return round(cess, 2)


def calculate_final_tax(tax_after_rebate: float, cess: float) -> float:
    """
    Step 6: Add cess to the tax (after rebate) to get the final
    amount payable by the taxpayer.
    """
    final_tax = tax_after_rebate + cess
    return round(final_tax, 2)


def compute_income_tax(annual_salary: float, age: int) -> dict:
    """
    Main function that ties all the steps together in order.
    This is the only function the API route needs to call.
    """
    taxable_income = get_taxable_income(annual_salary)
    tax = calculate_tax(taxable_income, age)
    rebate = calculate_rebate(taxable_income, tax)
    tax_after_rebate = round(tax - rebate, 2)
    cess = calculate_cess(tax_after_rebate)
    final_tax = calculate_final_tax(tax_after_rebate, cess)

    return {
        "taxable_income": taxable_income,
        "tax": tax,
        "rebate": rebate,
        "cess": cess,
        "final_tax": final_tax,
    }
