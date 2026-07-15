"""
itr_recommender.py
-------------------
ITR Form Recommendation.

Inputs:  Salary, Business Income (yes/no), Capital Gains (yes/no), Rental Income (yes/no)
Outputs: Recommended ITR form + a plain-language explanation of why

Simplified rules used here (based on real ITR eligibility criteria):
- ITR-1 (Sahaj):  Salary + at most one house property + other income,
                   total income up to ₹50 lakh, no capital gains, no business income.
- ITR-2:           Same as above, but with capital gains, OR total income above ₹50 lakh.
- ITR-3:           Business or professional income, taxed under regular books of accounts.
- ITR-4 (Sugam):   Business/professional income under the presumptive taxation scheme.

Since we only ask a simple yes/no for business income (not whether it's
presumptive), we recommend "ITR-3 or ITR-4" together and explain the
difference in plain language.
"""

# Income above this level cannot use the simplest form (ITR-1), even without capital gains
HIGH_INCOME_THRESHOLD = 5000000  # ₹50 lakh

# Friendly, plain-language descriptions of what each form is generally for
ITR_FORM_INFO = {
    "ITR-1 (Sahaj)": "The simplest form — for people with only salary, one house property, "
                      "and modest 'other income' like bank interest.",
    "ITR-2": "For people with a more complex income mix — think capital gains from shares or "
             "property, multiple house properties, or high salary income — but no business income.",
    "ITR-3 or ITR-4": "ITR-3 is for business/professional income calculated with regular books of "
                       "accounts. ITR-4 (Sugam) is a simpler option if you've opted for the "
                       "presumptive taxation scheme (Sections 44AD, 44ADA, or 44AE).",
}


def check_business_income(has_business_income: bool) -> dict | None:
    """
    Business or professional income takes top priority — it always needs
    ITR-3 or ITR-4, regardless of any other income the person has.
    """
    if not has_business_income:
        return None

    return {
        "recommended_form": "ITR-3 or ITR-4",
        "reason": "You have business or professional income, which needs ITR-3 (regular books "
                  "of accounts) or ITR-4 (if you've opted for presumptive taxation). Neither "
                  "ITR-1 nor ITR-2 allow business income to be reported.",
    }


def check_capital_gains(has_capital_gains: bool) -> dict | None:
    """Capital gains (from shares, mutual funds, property, etc.) require ITR-2."""
    if not has_capital_gains:
        return None

    return {
        "recommended_form": "ITR-2",
        "reason": "You have capital gains (profit from selling shares, mutual funds, or property). "
                  "ITR-1 does not allow capital gains to be reported, so you need to move up to ITR-2.",
    }


def check_high_salary(salary: float) -> dict | None:
    """A very high salary alone (above ₹50 lakh) also requires ITR-2, even with simple income."""
    if salary <= HIGH_INCOME_THRESHOLD:
        return None

    return {
        "recommended_form": "ITR-2",
        "reason": f"Your salary (₹{salary:,.0f}) is above the ₹50 lakh limit for ITR-1. Once total "
                  f"income crosses this threshold, you're required to file ITR-2 instead, even if "
                  f"your income sources are otherwise simple.",
    }


def recommend_itr(salary: float, has_business_income: bool, has_capital_gains: bool,
                   has_rental_income: bool) -> dict:
    """
    Main function: checks each condition in priority order (business income
    first, since it's the most restrictive) and returns the first match.
    If nothing special applies, defaults to the simplest form, ITR-1.
    """
    # Check conditions in priority order — the first one that applies wins
    result = (
        check_business_income(has_business_income)
        or check_capital_gains(has_capital_gains)
        or check_high_salary(salary)
    )

    if result is None:
        # No business income, no capital gains, salary within limits.
        # Rental income from a single house property is still allowed under ITR-1.
        rental_note = (
            " Rental income from your house property is also covered under ITR-1, "
            "as long as it's from just one property."
            if has_rental_income
            else ""
        )
        result = {
            "recommended_form": "ITR-1 (Sahaj)",
            "reason": "You have simple income — salary and/or other sources — within the ₹50 lakh "
                      f"limit, with no capital gains or business income.{rental_note}",
        }

    result["form_description"] = ITR_FORM_INFO[result["recommended_form"]]
    return result
