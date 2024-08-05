from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import random
import os

app = Flask(__name__)
CORS(app)

# Diretório onde as imagens estão localizadas
STATIC_FOLDER = os.path.join(os.getcwd(), 'static')

# Lista de produtos atualizada
list_products = [
    {"id": 1, "name": "Arroz", "price": 5, "image": "Arroz.jpg"},
    {"id": 2, "name": "Feijão", "price": 4, "image": "Feijao.jpg"},
    {"id": 3, "name": "Carne", "price": 20, "image": "Carne.jpg"},
    {"id": 4, "name": "Macarrão", "price": 3, "image": "Macarrao.jpg"},
    {"id": 5, "name": "Leite", "price": 2, "image": "Leite.jpg"},
    {"id": 6, "name": "Pão", "price": 1, "image": "Pao.jpg"},
    {"id": 7, "name": "Queijo", "price": 10, "image": "Queijo.jpg"},
    {"id": 8, "name": "Presunto", "price": 12, "image": "Presunto.jpg"},
    {"id": 9, "name": "Manteiga", "price": 7, "image": "Manteiga.jpg"},
    {"id": 10, "name": "Iogurte", "price": 4, "image": "Iogurte.jpg"},
    {"id": 11, "name": "Frango", "price": 15, "image": "Frango.jpg"},
    {"id": 12, "name": "Peixe", "price": 18, "image": "Peixe.jpg"},
    {"id": 13, "name": "Tomate", "price": 2, "image": "Tomate.jpg"},
    {"id": 14, "name": "Alface", "price": 1, "image": "Alface.jpg"},
    {"id": 15, "name": "Cenoura", "price": 2, "image": "Cenoura.jpg"},
    {"id": 16, "name": "Batata", "price": 3, "image": "Batata.jpg"},
    {"id": 17, "name": "Cebola", "price": 1, "image": "Cebola.jpg"},
    {"id": 18, "name": "Alho", "price": 1, "image": "Alho.jpg"},
    {"id": 19, "name": "Pimentão", "price": 2, "image": "Pimentao.jpg"},
    {"id": 20, "name": "Couve", "price": 2, "image": "Couve.jpg"},
    {"id": 21, "name": "Banana", "price": 1, "image": "Banana.jpg"},
    {"id": 22, "name": "Maçã", "price": 2, "image": "Maca.jpg"},
    {"id": 23, "name": "Laranja", "price": 3, "image": "Laranja.jpg"},
    {"id": 24, "name": "Morango", "price": 5, "image": "Morango.jpg"},
    {"id": 25, "name": "Uva", "price": 4, "image": "Uva.jpg"},
    {"id": 26, "name": "Melancia", "price": 6, "image": "Melancia.jpg"},
    {"id": 27, "name": "Abacate", "price": 4, "image": "Abacate.jpg"},
    {"id": 28, "name": "Abacaxi", "price": 5, "image": "Abacaxi.jpg"},
    {"id": 29, "name": "Manga", "price": 3, "image": "Manga.jpg"},
    {"id": 30, "name": "Kiwi", "price": 6, "image": "Kiwi.jpg"},
    {"id": 31, "name": "Biscoito", "price": 3, "image": "Biscoito.jpg"},
    {"id": 32, "name": "Chocolate", "price": 4, "image": "Chocolate.jpg"},
    {"id": 33, "name": "Salgadinho", "price": 2, "image": "Salgadinho.jpg"},
    {"id": 34, "name": "Refrigerante", "price": 5, "image": "Refrigerante.jpg"},
    {"id": 35, "name": "Suco", "price": 4, "image": "Suco.jpg"},
    {"id": 36, "name": "Café", "price": 6, "image": "Cafe.jpg"},
    {"id": 37, "name": "Chá", "price": 3, "image": "Cha.jpg"},
    {"id": 38, "name": "Açúcar", "price": 2, "image": "Acucar.jpg"},
    {"id": 39, "name": "Sal", "price": 1, "image": "Sal.jpg"},
    {"id": 40, "name": "Óleo", "price": 3, "image": "Oleo.jpg"},
    {"id": 41, "name": "Vinagre", "price": 2, "image": "Vinagre.jpg"},
    {"id": 42, "name": "Molho", "price": 3, "image": "Molho.jpg"},
    {"id": 43, "name": "Catchup", "price": 2, "image": "Catchup.jpg"},
    {"id": 44, "name": "Mostarda", "price": 2, "image": "Mostarda.jpg"},
    {"id": 45, "name": "Maionese", "price": 3, "image": "Maionese.jpg"},
    {"id": 46, "name": "Cereal", "price": 4, "image": "Cereal.jpg"},
    {"id": 47, "name": "Aveia", "price": 3, "image": "Aveia.jpg"},
    {"id": 48, "name": "Farinha", "price": 2, "image": "Farinha.jpg"},
    {"id": 49, "name": "Fubá", "price": 2, "image": "Fuba.jpg"},
    {"id": 50, "name": "Azeite", "price": 5, "image": "Azeite.jpg"}
]

# Embaralha a lista de produtos
products = random.sample(list_products, len(list_products))

# Dados para fases no formato desejado
phases = [
    {"phase": 1, "speed": 1, "time": 20, "budget": 150, "numprod": 4},
    {"phase": 2, "speed": 2, "time": 45, "budget": 40, "numprod": 8},
    {"phase": 3, "speed": 3, "time": 30, "budget": 30, "numprod": 6},
    {"phase": 4, "speed": 4, "time": 60, "budget": 30, "numprod": 6}
]

@app.route('/products', methods=['GET'])
def get_products():
    return jsonify(products)

@app.route('/phases', methods=['GET'])
def get_phases():
    return jsonify(phases)

@app.route('/phase/<int:phase_id>', methods=['GET'])
def get_phase(phase_id):
    phase = next((p for p in phases if p["phase"] == phase_id), None)
    if phase is not None:
        return jsonify(phase)
    else:
        return jsonify({"error": "Phase not found"}), 404

@app.route('/greedy', methods=['POST'])
def run_greedy():
    data = request.json
    budget = data.get('budget', 0)
    
    # Embaralha os produtos para obter uma seleção aleatória
    shuffled_products = random.sample(products, len(products))
    chosen_products = []
    total = 0

    for product in shuffled_products:
        if total + product['price'] <= budget:
            chosen_products.append(product)
            total += product['price']
        if total >= budget:
            break

    return jsonify({"chosen_products": chosen_products, "total": total})

# Serve arquivos estáticos
@app.route('/static/<path:filename>')
def serve_static(filename):
    return send_from_directory(STATIC_FOLDER, filename)

if __name__ == '__main__':
    app.run(debug=True)
