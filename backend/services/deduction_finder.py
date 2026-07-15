"""
deduction_finder.py
--------------------
Deduction Finder — asks the user simple yes/no questions and recommends
tax deductions they may be eligible for, explained in plain language.

These deductions are only available under the OLD TAX REGIME.

Each deduction check is its own small function, so it's easy to see
exactly which yes/no answer triggers which recommendation.
"""


def check_80c(has_life_insurance: bool, has_ppf_or_elss: bool) -> dict | None:
    """Section 80C — triggered by life insurance OR PPF/ELSS investments."""
    if not (has_life_insurance or has_ppf_or_elss):
        return None

    return {
        "section": "80C",
        "title": "Section 80C — Savings & Investments",
        "limit": "Up to ₹1,50,000 per year",
        "simple_explanation": (
            "This is the most popular tax-saving section. If you put money into things like "
            "life insurance, PPF (Public Provident Fund), or ELSS mutual funds, that amount gets "
            "subtracted from your taxable income — meaning you pay tax on less money."
        ),
    }


def check_80d(has_health_insurance: bool) -> dict | None:
    """Section 80D — triggered by paying health insurance premiums."""
    if not has_health_insurance:
        return None

    return {
        "section": "80D",
        "title": "Section 80D — Health Insurance Premium",
        "limit": "Up to ₹25,000 per year (₹50,000 if premium is for senior citizen parents)",
        "simple_explanation": (
            "Paying for a health insurance policy for yourself or your family? The government "
            "rewards that by letting you deduct the premium amount from your taxable income. "
            "If you're also paying for your parents' health insurance, you can claim even more."
        ),
    }


def check_nps(has_nps: bool) -> dict | None:
    """Section 80CCD(1B) — triggered by NPS (National Pension System) contributions."""
    if not has_nps:
        return None

    return {
        "section": "80CCD(1B)",
        "title": "NPS — National Pension System",
        "limit": "Up to ₹50,000 per year (extra, on top of 80C)",
        "simple_explanation": (
            "Contributing to NPS for your retirement? You get a special EXTRA deduction for this "
            "— separate from and in addition to your regular ₹1,50,000 limit under 80C. "
            "It's essentially a bonus for saving toward your retirement."
        ),
    }


def check_home_loan(has_home_loan: bool) -> dict | None:
    """Section 24(b) — triggered by an ongoing home loan."""
    if not has_home_loan:
        return None

    return {
        "section": "24(b)",
        "title": "Home Loan Interest",
        "limit": "Up to ₹2,00,000 per year",
        "simple_explanation": (
            "If you're repaying a home loan, the INTEREST portion of your EMIs (not the principal) "
            "can be deducted from your taxable income, for a self-occupied house. "
            "This is separate from the 80C deduction you can claim on the principal repayment."
        ),
    }


def check_education_loan(has_education_loan: bool) -> dict | None:
    """Section 80E — triggered by an ongoing education loan."""
    if not has_education_loan:
        return None

    return {
        "section": "80E",
        "title": "Education Loan Interest",
        "limit": "No upper limit (available for up to 8 years)",
        "simple_explanation": (
            "Paying interest on a loan taken for higher education — for yourself, your spouse, "
            "or your children? The entire interest amount can be deducted, with no maximum cap. "
            "This benefit is available for 8 years from when you start repaying."
        ),
    }


def find_deductions(has_life_insurance: bool, has_ppf_or_elss: bool, has_health_insurance: bool,
                     has_home_loan: bool, has_nps: bool, has_education_loan: bool) -> list:
    """
    Main function: runs every check and collects the deductions that apply.
    Only relevant under the Old Tax Regime.
    """
    checks = [
        check_80c(has_life_insurance, has_ppf_or_elss),
        check_80d(has_health_insurance),
        check_nps(has_nps),
        check_home_loan(has_home_loan),
        check_education_loan(has_education_loan),
    ]

    # Keep only the deductions that actually apply (i.e. not None)
    suggestions = [item for item in checks if item is not None]

    if not suggestions:
        suggestions.append({
            "section": "None found",
            "title": "No Major Deductions Found",
            "limit": "-",
            "simple_explanation": (
                "Based on your answers, you don't have major Old Regime deductions to claim. "
                "In that case, the New Regime — which has lower tax rates but no deductions — "
                "may actually work out better for you. Try the Regime Comparison tool to check."
            ),
        })

    return suggestions
