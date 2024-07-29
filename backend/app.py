from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

products = [
    {"id": 1, "name": "Arroz", "price": 10.0, "image": "static/images/arroz.jpg"},
    {"id": 2, "name": "Feijão", "price": 8.0, "image": "static/images/feijao.jpg"},
    {"id": 3, "name": "Carne", "price": 25.0, "image": "static/images/carne.jpg"},
    {"id": 4, "name": "Macarrão", "price": 5.0, "image": "static/images/macarrao.jpg"},
    {"id": 5, "name": "Leite", "price": 4.5, "image": "static/images/leite.jpg"}
]

@app.route('/products', methods=['GET'])
def get_products():
    return jsonify(products)

@app.route('/purchase', methods=['POST'])
def make_purchase():
    data = request.json
    budget = data.get('budget', 0)

    products_sorted = sorted(products, key=lambda x: x['price'])
    purchased_items = []
    total_spent = 0

    for product in products_sorted:
        if total_spent + product['price'] <= budget:
            purchased_items.append(product)
            total_spent += product['price']
        else:
            break

    return jsonify({"purchased_items": purchased_items, "total_spent": total_spent})

if __name__ == '__main__':
    app.run(debug=True)
