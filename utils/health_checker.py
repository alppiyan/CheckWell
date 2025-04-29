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
            "error": "\u00dcr\u00fcn i\u00e7eri\u011fi bulunamad\u0131."
        }

    total_risk = {"high": 0, "medium": 0, "low": 0}
    reasons = []

    for item in ingredients:
        for match, level in evaluate_ingredient_risk(item):
            reasons.append({"ingredient": match.strip(), "risk_level": level})
            total_risk[level] += 1

    total_flagged = total_risk["high"] + total_risk["medium"] + total_risk["low"]

    if total_flagged == 0:
        return {    
            "message": "Riskli bileşen bulunamadı.",
            "risk_summary": total_risk,
            "flagged_ingredients": reasons,
            "nutriscore_grade": nutriscore
        }

    total_ingredients = len(ingredients)
    total_score = total_risk["high"] * 3 + total_risk["medium"] * 2 + total_risk["low"] * 1
    max_score = total_ingredients * 3
    health_score = 100 - int((total_score / max_score) * 100) if max_score else 0

    if health_score >= 80:
        health_label = "Sağlıklı"
    elif health_score >= 50:
        health_label = "Dikkatli Kullanım"
    else:
        health_label = "Riskli"

    return {
        "health_score": health_score,
        "health_label": health_label,
        "risk_summary": total_risk,
        "flagged_ingredients": reasons,
        "nutriscore_grade": nutriscore
    }
