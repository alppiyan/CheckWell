import requests

def fetch_product_info(barcode):
    product = fetch_from_api(barcode, "https://world.openfoodfacts.org/api/v0/product/")
    
    if product and product.get("ingredients"):
        return product
    
    product = fetch_from_api(barcode, "https://world.openbeautyfacts.org/api/v0/product/")
    
    return product

def fetch_from_api(barcode, base_url):
    url = f"{base_url}{barcode}.json"
    try:
        response = requests.get(url, timeout=5)  # Timeout eklendi
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
    except requests.exceptions.RequestException as e:
        # Hata durumunda None döndürmek yerine loglama yapılabilir
        print(f"API çağrısı başarısız: {e}")
        return None
