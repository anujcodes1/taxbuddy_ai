"""
hra_calculator.py
------------------
HRA (House Rent Allowance) Exemption Calculator.

Inputs:  Basic Salary, HRA Received, Rent Paid, Metro or Non-Metro
Outputs: HRA Exemption, Taxable HRA, and a full step-by-step explanation

Rule (Section 10(13A) of the Income Tax Act):
HRA exemption = the MINIMUM of the following three amounts:
  1. Actual HRA received from the employer
  2. Rent paid minus 10% of Basic Salary
  3. 50% of Basic Salary (metro city) or 40% of Basic Salary (non-metro city)

Whatever is left of the HRA received, after removing the exempt part,
is added back to taxable income as "Taxable HRA".

Each condition is calculated in its own function so the logic is easy
to follow and test individually.
"""


def calculate_condition_1_actual_hra(hra_received: float) -> float:
    """Condition 1: Actual HRA received from the employer, as-is."""
    return round(hra_received, 2)


def calculate_condition_2_rent_minus_10pct(basic_salary: float, rent_paid: float) -> float:
    """Condition 2: Rent paid minus 10% of Basic Salary (never negative)."""
    value = rent_paid - (0.10 * basic_salary)
    return round(max(0, value), 2)


def calculate_condition_3_pct_of_basic(basic_salary: float, is_metro: bool) -> float:
    """Condition 3: 50% of Basic Salary for metro cities, 40% for non-metro cities."""
    percentage = 0.50 if is_metro else 0.40
    return round(basic_salary * percentage, 2)


def determine_exemption(condition_1: float, condition_2: float, condition_3: float) -> tuple:
    """
    Finds the HRA exemption: the MINIMUM of the three conditions.
    Also returns which condition "won" (was the smallest), since that's
    the one that actually determined the exemption amount.
    """
    conditions = {
        "Actual HRA Received": condition_1,
        "Rent Paid minus 10% of Basic Salary": condition_2,
        "Percentage of Basic Salary": condition_3,
    }
    winning_label = min(conditions, key=conditions.get)
    exemption = conditions[winning_label]
    return exemption, winning_label


def calculate_taxable_hra(hra_received: float, exemption: float) -> float:
    """Whatever portion of HRA received is NOT exempt becomes taxable income."""
    return round(max(0, hra_received - exemption), 2)


def build_explanation(basic_salary: float, hra_received: float, rent_paid: float, is_metro: bool,
                       condition_1: float, condition_2: float, condition_3: float,
                       winning_label: str, exemption: float, taxable_hra: float) -> list:
    """
    Builds a plain-English, step-by-step explanation of the calculation,
    as a list of strings the frontend can render as a numbered list.
    """
    city_type = "Metro" if is_metro else "Non-Metro"
    city_pct = "50%" if is_metro else "40%"

    return [
        f"Step 1 — Actual HRA Received: ₹{hra_received:,.0f}",
        f"Step 2 — Rent Paid minus 10% of Basic Salary: "
        f"₹{rent_paid:,.0f} − (10% × ₹{basic_salary:,.0f}) = ₹{condition_2:,.0f}",
        f"Step 3 — {city_pct} of Basic Salary ({city_type} city): "
        f"{city_pct} × ₹{basic_salary:,.0f} = ₹{condition_3:,.0f}",
        f"Step 4 — HRA Exemption is the SMALLEST of these three values. "
        f"Here, that's \"{winning_label}\" = ₹{exemption:,.0f}",
        f"Step 5 — Taxable HRA = HRA Received − HRA Exemption = "
        f"₹{hra_received:,.0f} − ₹{exemption:,.0f} = ₹{taxable_hra:,.0f}",
    ]


def calculate_hra(basic_salary: float, hra_received: float, rent_paid: float, is_metro: bool) -> dict:
    """
    Main function that ties every step together. This is the only
    function the API route needs to call.
    """
    condition_1 = calculate_condition_1_actual_hra(hra_received)
    condition_2 = calculate_condition_2_rent_minus_10pct(basic_salary, rent_paid)
    condition_3 = calculate_condition_3_pct_of_basic(basic_salary, is_metro)

    exemption, winning_label = determine_exemption(condition_1, condition_2, condition_3)
    taxable_hra = calculate_taxable_hra(hra_received, exemption)

    explanation = build_explanation(
        basic_salary, hra_received, rent_paid, is_metro,
        condition_1, condition_2, condition_3,
        winning_label, exemption, taxable_hra,
    )

    return {
        "hra_exemption": exemption,
        "taxable_hra": taxable_hra,
        "conditions": {
            "actual_hra_received": condition_1,
            "rent_minus_10pct_basic": condition_2,
            "pct_of_basic_salary": condition_3,
        },
        "winning_condition": winning_label,
        "explanation": explanation,
    }
