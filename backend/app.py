from flask import Flask, jsonify, request, send_from_directory
import logging
from flask_cors import CORS
import random
import os

app = Flask(__name__)
CORS(app)

logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')

# Diretório onde as imagens estão localizadas
STATIC_FOLDER = os.path.join(os.getcwd(), 'static')

# Lista de produtos atualizada
list_products = [
    {"id": 1, "name": "Arroz", "price": 5.50, "image": "produtos/Arroz.jpg"},
    {"id": 2, "name": "Feijão", "price": 4.25, "image": "produtos/Feijao.jpg"},
    {"id": 3, "name": "Carne", "price": 20, "image": "produtos/Carne.jpg"},
    {"id": 4, "name": "Macarrão", "price": 3.75, "image": "produtos/Macarrao.jpg"},
    {"id": 5, "name": "Leite", "price": 2.20, "image": "produtos/Leite.jpg"},
    {"id": 6, "name": "Pão", "price": 1.50, "image": "produtos/Pao.jpg"},
    {"id": 7, "name": "Queijo", "price": 10.10, "image": "produtos/Queijo.jpg"},
    {"id": 8, "name": "Presunto", "price": 12.30, "image": "produtos/Presunto.jpg"},
    {"id": 9, "name": "Manteiga", "price": 7.25, "image": "produtos/Manteiga.jpg"},
    {"id": 10, "name": "Iogurte", "price": 4, "image": "produtos/Iogurte.jpg"},
    {"id": 11, "name": "Frango", "price": 15, "image": "produtos/Frango.jpg"},
    {"id": 12, "name": "Peixe", "price": 18, "image": "produtos/Peixe.jpg"},
    {"id": 13, "name": "Tomate", "price": 2, "image": "produtos/Tomate.jpg"},
    {"id": 14, "name": "Alface", "price": 1, "image": "produtos/Alface.jpg"},
    {"id": 15, "name": "Cenoura", "price": 2, "image": "produtos/Cenoura.jpg"},
    {"id": 16, "name": "Batata", "price": 3.75, "image": "produtos/Batata.jpg"},
    {"id": 17, "name": "Cebola", "price": 1.75, "image": "produtos/Cebola.jpg"},
    {"id": 18, "name": "Alho", "price": 1.25, "image": "produtos/Alho.jpg"},
    {"id": 19, "name": "Pimentão", "price": 2, "image": "produtos/Pimentao.jpg"},
    {"id": 20, "name": "Couve", "price": 2.50, "image": "produtos/Couve.jpg"},
    {"id": 21, "name": "Banana", "price": 1.75, "image": "produtos/Banana.jpg"},
    {"id": 22, "name": "Maçã", "price": 2, "image": "produtos/Maca.jpg"},
    {"id": 23, "name": "Laranja", "price": 3, "image": "produtos/Laranja.jpg"},
    {"id": 24, "name": "Morango", "price": 5, "image": "produtos/Morango.jpg"},
    {"id": 25, "name": "Uva", "price": 4, "image": "produtos/Uva.jpg"},
    {"id": 26, "name": "Melancia", "price": 6.50, "image": "produtos/Melancia.jpg"},
    {"id": 27, "name": "Abacate", "price": 4.75, "image": "produtos/Abacate.jpg"},
    {"id": 28, "name": "Abacaxi", "price": 5.10, "image": "produtos/Abacaxi.jpg"},
    {"id": 29, "name": "Manga", "price": 3.20, "image": "produtos/Manga.jpg"},
    {"id": 30, "name": "Kiwi", "price": 6.5, "image": "produtos/Kiwi.jpg"},
    {"id": 31, "name": "Biscoito", "price": 3.75, "image": "produtos/Biscoito.jpg"},
    {"id": 32, "name": "Chocolate", "price": 4.50, "image": "produtos/Chocolate.jpg"},
    {"id": 33, "name": "Salgadinho", "price": 2, "image": "produtos/Salgadinho.jpg"},
    {"id": 34, "name": "Refrigerante", "price": 5, "image": "produtos/Refrigerante.jpg"},
    {"id": 35, "name": "Suco", "price": 4, "image": "produtos/Suco.jpg"},
    {"id": 36, "name": "Café", "price": 6.75, "image": "produtos/Cafe.jpg"},
    {"id": 37, "name": "Chá", "price": 3.50, "image": "produtos/Cha.jpg"},
    {"id": 38, "name": "Açúcar", "price": 2.25, "image": "produtos/Acucar.jpg"},
    {"id": 39, "name": "Sal", "price": 1, "image": "produtos/Sal.jpg"},
    {"id": 40, "name": "Óleo", "price": 3, "image": "produtos/Oleo.jpg"},
    {"id": 41, "name": "Vinagre", "price": 2, "image": "produtos/Vinagre.jpg"},
    {"id": 42, "name": "Molho", "price": 3, "image": "produtos/Molho.jpg"},
    {"id": 43, "name": "Catchup", "price": 2, "image": "produtos/Catchup.jpg"},
    {"id": 44, "name": "Mostarda", "price": 2, "image": "produtos/Mostarda.jpg"},
    {"id": 45, "name": "Maionese", "price": 3, "image": "produtos/Maionese.jpg"},
    {"id": 46, "name": "Cereal", "price": 4.50, "image": "produtos/Cereal.jpg"},
    {"id": 47, "name": "Aveia", "price": 3.25, "image": "produtos/Aveia.jpg"},
    {"id": 48, "name": "Farinha", "price": 2.75, "image": "produtos/Farinha.jpg"},
    {"id": 49, "name": "Fubá", "price": 2.50, "image": "produtos/Fuba.jpg"},
    {"id": 50, "name": "Azeite", "price": 5.75, "image": "produtos/Azeite.jpg"}
]

moedas = [
    {"id": 1, "name": "1 Real", "price": 1.0, "image": "moedas/moeda_1_real.jpg"},
    {"id": 2, "name": "50 Centavos", "price": 0.5, "image": "moedas/moeda_50_centavos.jpg"},
    {"id": 3, "name": "25 Centavos", "price": 0.25, "image": "moedas/moeda_25_centavos.jpg"},
    {"id": 4, "name": "10 Centavos", "price": 0.1, "image": "moedas/moeda_10_centavos.jpg"},
    {"id": 5, "name": "5 Centavos", "price": 0.05, "image": "moedas/moeda_5_centavos.jpg"}
]


# Embaralha a lista de produtos
products = random.sample(list_products, len(list_products))

coins = random.sample(moedas, len(moedas))


# Dados para fases no formato desejado
phases = [
    {"phase": 1, "speed": 1, "time": 20, "budget": 15.65, "numprod": 4},
    {"phase": 2, "speed": 2, "time": 45, "budget": 18.95, "numprod": 8},
    {"phase": 3, "speed": 3, "time": 30, "budget": 27.90, "numprod": 6},
    {"phase": 4, "speed": 4, "time": 60, "budget": 30.80, "numprod": 6}
]

@app.route('/products', methods=['GET'])
def get_products():
    return jsonify(products)

@app.route('/coins', methods=['GET'])
def get_coins():
    return jsonify(coins)

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


@app.route('/troco', methods=['POST'])
def min_troco():
    data = request.json
    amount = data.get('amount', 0) * 100  # Convertendo reais para centavos
    user_solution = data.get('user_solution', [])

    # Moedas brasileiras em centavos
    moedas = [100, 50, 25, 10, 5]

    # Algoritmo ambicioso para encontrar a solução ótima
    def min_moedas(moedas, amount):
        moedas.sort(reverse=True)
        result = []
        for moeda in moedas:
            while amount >= moeda:
                amount -= moeda
                result.append(moeda)
        return result

    optimal_solution = min_moedas(moedas, amount)
    user_solution_in_cents = [int(value) for value in user_solution]

    # Verifica se a solução do usuário é ótima
    is_optimal = (sorted(user_solution_in_cents, reverse=True) == sorted(optimal_solution, reverse=True))

    # Log detalhado
    app.logger.debug(f'Solução ótima esperada: {optimal_solution}')
    app.logger.debug(f'Solução do usuário: {user_solution_in_cents}')
    app.logger.debug(f'Valor total esperado: {amount}')
    app.logger.debug(f'Valor total fornecido: {sum(user_solution_in_cents)}')

    return jsonify({
        "optimal_solution": optimal_solution,
        "is_optimal": is_optimal
    })
# Serve arquivos estáticos
@app.route('/static/<path:filename>')
def serve_static(filename):
    return send_from_directory(STATIC_FOLDER, filename)

if __name__ == '__main__':
    app.run(debug=True)
