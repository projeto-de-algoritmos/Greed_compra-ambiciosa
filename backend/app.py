from flask import Flask, jsonify, request
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app)

products = [
    {"id": 1, "name": "Product 1", "price": 10, "image": "product1.jpg"},
    {"id": 2, "name": "Product 2", "price": 20, "image": "product2.jpg"},
    {"id": 3, "name": "Product 3", "price": 5, "image": "product3.jpg"},
    {"id": 4, "name": "Product 4", "price": 15, "image": "product4.jpg"},
    {"id": 5, "name": "Product 5", "price": 25, "image": "product5.jpg"},
    {"id": 6, "name": "Product 6", "price": 30, "image": "product6.jpg"}
]

phases = [
    {"phase": 1, "speed": 1, "time": 60, "budget": 50},
    {"phase": 2, "speed": 2, "time": 45, "budget": 40},
    {"phase": 3, "speed": 3, "time": 30, "budget": 30}
]

@app.route('/products', methods=['GET'])
def get_products():
    return jsonify(products)

@app.route('/phase/<int:phase_id>', methods=['GET'])
def get_phase(phase_id):
    phase = next((phase for phase in phases if phase["phase"] == phase_id), None)
    if phase is not None:
        return jsonify(phase)
    else:
        return jsonify({"error": "Phase not found"}), 404

@app.route('/greedy', methods=['POST'])
def run_greedy():
    data = request.json
    budget = data.get('budget', 0)
    sorted_products = sorted(products, key=lambda x: x['price'])
    chosen_products = []
    total = 0

    for product in sorted_products:
        if total + product['price'] <= budget:
            chosen_products.append(product)
            total += product['price']

    return jsonify({"chosen_products": chosen_products, "total": total})

if __name__ == '__main__':
    app.run(debug=True)
