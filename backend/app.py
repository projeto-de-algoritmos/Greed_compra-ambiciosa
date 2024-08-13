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
    {"id": 1, "name": "Arroz", "price": 5.50, "image": "produtos/Arroz.jpg", "quantity": 7},
    {"id": 2, "name": "Feijão", "price": 4.25, "image": "produtos/Feijao.jpg", "quantity": 12},
    {"id": 3, "name": "Carne", "price": 20.00, "image": "produtos/Carne.jpg", "quantity": 10},
    {"id": 4, "name": "Macarrão", "price": 3.75, "image": "produtos/Macarrao.jpg", "quantity": 15},
    {"id": 5, "name": "Leite", "price": 2.20, "image": "produtos/Leite.jpg", "quantity": 13},
    {"id": 6, "name": "Pão", "price": 1.50, "image": "produtos/Pao.jpg", "quantity": 14},
    {"id": 7, "name": "Queijo", "price": 10.10, "image": "produtos/Queijo.jpg", "quantity": 12},
    {"id": 8, "name": "Presunto", "price": 12.30, "image": "produtos/Presunto.jpg", "quantity": 8},
    {"id": 9, "name": "Manteiga", "price": 7.25, "image": "produtos/Manteiga.jpg", "quantity": 18},
    {"id": 10, "name": "Iogurte", "price": 4.00, "image": "produtos/Iogurte.jpg", "quantity": 22},
    {"id": 11, "name": "Frango", "price": 15.00, "image": "produtos/Frango.jpg", "quantity": 10},
    {"id": 12, "name": "Peixe", "price": 18.00, "image": "produtos/Peixe.jpg", "quantity": 9},
    {"id": 13, "name": "Tomate", "price": 2.00, "image": "produtos/Tomate.jpg", "quantity": 15},
    {"id": 14, "name": "Alface", "price": 1.00, "image": "produtos/Alface.jpg", "quantity": 13},
    {"id": 15, "name": "Cenoura", "price": 2.00, "image": "produtos/Cenoura.jpg", "quantity": 20},
    {"id": 16, "name": "Batata", "price": 3.75, "image": "produtos/Batata.jpg", "quantity": 15},
    {"id": 17, "name": "Cebola", "price": 1.75, "image": "produtos/Cebola.jpg", "quantity": 25},
    {"id": 18, "name": "Alho", "price": 1.25, "image": "produtos/Alho.jpg", "quantity": 14},
    {"id": 19, "name": "Pimentão", "price": 2.00, "image": "produtos/Pimentao.jpg", "quantity": 12},
    {"id": 20, "name": "Couve", "price": 2.50, "image": "produtos/Couve.jpg", "quantity": 15},
    {"id": 21, "name": "Banana", "price": 1.75, "image": "produtos/Banana.jpg", "quantity": 13},
    {"id": 22, "name": "Maçã", "price": 2.00, "image": "produtos/Maca.jpg", "quantity": 12},
    {"id": 23, "name": "Laranja", "price": 3.00, "image": "produtos/Laranja.jpg", "quantity": 18},
    {"id": 24, "name": "Morango", "price": 5.00, "image": "produtos/Morango.jpg", "quantity": 12},
    {"id": 25, "name": "Uva", "price": 4.00, "image": "produtos/Uva.jpg", "quantity": 15},
    {"id": 26, "name": "Melancia", "price": 6.50, "image": "produtos/Melancia.jpg", "quantity": 10},
    {"id": 27, "name": "Abacate", "price": 4.75, "image": "produtos/Abacate.jpg", "quantity": 8},
    {"id": 28, "name": "Abacaxi", "price": 5.10, "image": "produtos/Abacaxi.jpg", "quantity": 10},
    {"id": 29, "name": "Manga", "price": 3.20, "image": "produtos/Manga.jpg", "quantity": 15},
    {"id": 30, "name": "Kiwi", "price": 6.50, "image": "produtos/Kiwi.jpg", "quantity": 12},
    {"id": 31, "name": "Biscoito", "price": 3.75, "image": "produtos/Biscoito.jpg", "quantity": 20},
    {"id": 32, "name": "Chocolate", "price": 4.50, "image": "produtos/Chocolate.jpg", "quantity": 15},
    {"id": 33, "name": "Salgadinho", "price": 2.00, "image": "produtos/Salgadinho.jpg", "quantity": 25},
    {"id": 34, "name": "Refrigerante", "price": 5.00, "image": "produtos/Refrigerante.jpg", "quantity": 18},
    {"id": 35, "name": "Suco", "price": 4.00, "image": "produtos/Suco.jpg", "quantity": 20},
    {"id": 36, "name": "Café", "price": 6.75, "image": "produtos/Cafe.jpg", "quantity": 10},
    {"id": 37, "name": "Chá", "price": 3.50, "image": "produtos/Cha.jpg", "quantity": 15},
    {"id": 38, "name": "Açúcar", "price": 2.25, "image": "produtos/Acucar.jpg", "quantity": 10},
    {"id": 39, "name": "Sal", "price": 1.00, "image": "produtos/Sal.jpg", "quantity": 25},
    {"id": 40, "name": "Óleo", "price": 3.00, "image": "produtos/Oleo.jpg", "quantity": 15},
    {"id": 41, "name": "Vinagre", "price": 2.00, "image": "produtos/Vinagre.jpg", "quantity": 20},
    {"id": 42, "name": "Molho", "price": 3.00, "image": "produtos/Molho.jpg", "quantity": 15},
    {"id": 43, "name": "Catchup", "price": 2.00, "image": "produtos/Catchup.jpg", "quantity": 25},
    {"id": 44, "name": "Mostarda", "price": 2.00, "image": "produtos/Mostarda.jpg", "quantity": 20},
    {"id": 45, "name": "Maionese", "price": 3.00, "image": "produtos/Maionese.jpg", "quantity": 15},
    {"id": 46, "name": "Cereal", "price": 4.50, "image": "produtos/Cereal.jpg", "quantity": 18},
    {"id": 47, "name": "Aveia", "price": 3.25, "image": "produtos/Aveia.jpg", "quantity": 20},
    {"id": 48, "name": "Farinha", "price": 2.75, "image": "produtos/Farinha.jpg", "quantity": 25},
    {"id": 49, "name": "Fubá", "price": 2.50, "image": "produtos/Fuba.jpg", "quantity": 20},
    {"id": 50, "name": "Azeite", "price": 5.75, "image": "produtos/Azeite.jpg", "quantity": 10}
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
    {"phase": 1, "speed": 1, "time": 25, "budget": 35.65, "numprod": 4},
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
    products = data.get('products', [])

    if not products:
        return jsonify({"error": "Nenhum produto recebido"}), 400

    # Imprime o orçamento e a lista de produtos recebidos
    print(f"Orçamento recebido: {budget}")
    print(f"Lista de produtos recebidos: {products}")

    # Ordenar produtos por preço crescente
    sorted_products = sorted(products, key=lambda x: x['price'])
    
    # Imprime a lista de produtos ordenados
    print(f"Produtos ordenados por preço: {sorted_products}")

    chosen_products = []
    preco_total = 0
    remaining_budget = budget

    for product in sorted_products:
        print(f"Verificando produto: {product}")

        # Verifica o número máximo que pode ser comprado com o orçamento restante
        max_quantity = min(product['quantity'], remaining_budget // product['price'])

        if max_quantity > 0:
            chosen_products.append({
                "id": product['id'],
                "name": product['name'],
                "price": product['price'],
                "quantity": max_quantity,
                "image": product['image']
            })
            preco_total += max_quantity * product['price']
            remaining_budget -= max_quantity * product['price']
            product['quantity'] -= max_quantity

        # Se o orçamento restante for zero, não há mais o que comprar
        if remaining_budget <= 0:
            break

    total_quantity = sum(p['quantity'] for p in chosen_products)

    # Imprime o resultado final
    print(f"Lista final de produtos escolhidos: {chosen_products}")
    print(f"Preço total final: {preco_total}")
    print(f"Quantidade total de produtos: {total_quantity}")

    return jsonify({
        "chosen_products": chosen_products,
        "preco_total": preco_total,
        "total_quantity": total_quantity
    })


@app.route('/compare', methods=['POST'])
def compare_solutions():
    data = request.json
    greedy_data = data.get('greedy', {})
    player_data = data.get('player', {})

    greedy_total = greedy_data.get('preco_total', 0)
    player_total = player_data.get('total', 0)

    if greedy_total == 0:
        return jsonify({"error": "Solução do algoritmo greedy não pode ser zero para comparação."}), 400

    percentage_difference = abs((player_total - greedy_total) / greedy_total) * 100

    return jsonify({"percentage_difference": percentage_difference})


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


@app.route('/static/<path:filename>')
def serve_static(filename):
    return send_from_directory(STATIC_FOLDER, filename)


if __name__ == '__main__':
    app.run(debug=True)
