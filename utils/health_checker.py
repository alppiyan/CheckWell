RISK_LEVELS = {
    "paraben": "high",
    "sodium lauryl sulfate": "medium",
    "alcohol denat": "medium",
    "parfum": "low",
    "formaldehyde": "high",
    "triclosan": "high",
    "phenoxyethanol": "medium",
    "phthalates": "high", 
    "benzophenone": "medium",
    "mineral oil": "low",  
    "silicone": "low",  
    "talc": "medium",  
    "coal tar": "high" 
}

def normalize_ingredient(ingredient: str) -> str:
    return ingredient.strip().lower()

def evaluate_ingredient_risk(ingredient: str) -> list[tuple[str, str]]:
    normalized = normalize_ingredient(ingredient)
    return [
        (ingredient, level)
        for keyword, level in RISK_LEVELS.items()
        if keyword in normalized
    ]

def analyze_health(product: dict) -> dict:
    ingredients = product.get("ingredients", [])
    nutriscore = product.get("nutriscore_grade", "Unknown")

    if not ingredients:
        return {
            "error": "Ürün içeriği bulunamadı."
        }

    total_risk = {"high": 0, "medium": 0, "low": 0}
    reasons = []

    for item in ingredients:
        for match, level in evaluate_ingredient_risk(item):
            reasons.append({"ingredient": match.strip(), "risk_level": level})
            total_risk[level] += 1

    is_healthy = (
        total_risk["high"] == 0
        and total_risk["medium"] <= 1
        and nutriscore in ["A", "B"]
    )

    return {
        "is_healthy": is_healthy,
        "risk_summary": total_risk,
        "flagged_ingredients": reasons,
        "nutriscore_grade": nutriscore
    }
