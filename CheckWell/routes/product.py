from flask import Blueprint, request, jsonify
from services.product_info import fetch_product_info
from utils.health_checker import analyze_health

product_bp = Blueprint('product', __name__)

@product_bp.route('/', methods=['POST'])
def get_product():
    data = request.get_json()
    barcode = data.get("barcode")

    if not barcode :
        return jsonify({"error": "Barcode or product_name required"}), 400

    product = fetch_product_info(barcode=barcode)
    if not product:
        return jsonify({"error": "Product not found or missing ingredients"}), 404

    health_result = analyze_health(product)
    return jsonify({"product": product, "health": health_result})
