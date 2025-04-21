import requests

def fetch_product_info(barcode):
    product = fetch_from_openfoodfacts_by_barcode(barcode)
    
    if product and product.get("ingredients"):
        return product
    
    product = fetch_from_openbeautyfacts_by_barcode(barcode)
    
    return product

def fetch_from_openfoodfacts_by_barcode(barcode):
    url = f"https://world.openfoodfacts.org/api/v0/product/{barcode}.json"
    response = requests.get(url)

    if response.status_code != 200:
        return None

    data = response.json()
    product_data = data.get("product", {})
    ingredients_text = product_data.get("ingredients_text", "")
    ingredients = [i.strip() for i in ingredients_text.split(",") if i.strip()]

    return {
        "name": product_data.get("product_name", "Unknown"),
        "ingredients": ingredients if ingredients else None,
        "nutriscore_grade": product_data.get("nutriscore_grade")
    }

def fetch_from_openbeautyfacts_by_barcode(barcode):
    url = f"https://world.openbeautyfacts.org/api/v0/product/{barcode}.json"
    response = requests.get(url)

    if response.status_code != 200:
        return None

    data = response.json()
    product_data = data.get("product", {})
    ingredients_text = product_data.get("ingredients_text", "")
    ingredients = [i.strip() for i in ingredients_text.split(",") if i.strip()]

    return {
        "name": product_data.get("product_name", "Unknown"),
        "ingredients": ingredients if ingredients else None,
        "nutriscore_grade": product_data.get("nutriscore_grade")
    }
