import os

output_dir = 'food_images'

# Voltando os nomes para português
food_mapping = {
    "rice": "arroz", "beans": "feijao", "meat": "carne",
    "pasta": "macarrao", "milk": "leite",
    "bread": "pao", "cheese": "queijo", "ham": "presunto",
    "butter": "manteiga", "yogurt": "iogurte",
    "chicken": "frango", "fish": "peixe", "tomato": "tomate",
    "lettuce": "alface", "carrot": "cenoura",
    "potato": "batata", "onion": "cebola", "garlic": "alho",
    "pepper": "pimentao", "kale": "couve",
    "banana": "banana", "apple": "maca", "orange": "laranja",
    "strawberry": "morango", "grape": "uva",
    "watermelon": "melancia", "avocado": "abacate", "pineapple": "abacaxi",
    "mango": "manga", "kiwi": "kiwi",
    "cookie": "biscoito", "chocolate": "chocolate", "snack": "salgadinho",
    "soda": "refrigerante",
    "juice": "suco", "coffee": "cafe", "tea": "cha", "sugar": "acucar",
    "salt": "sal",
    "oil": "oleo", "vinegar": "vinagre", "sauce": "molho",
    "ketchup": "catchup", "mustard": "mostarda",
    "mayonnaise": "maionese", "cereal": "cereal", "oat": "aveia",
    "flour": "farinha", "cornmeal": "fuba",
    "olive oil": "azeite"
}


def rename_images(directory, mapping):
    for filename in os.listdir(directory):
        name, ext = os.path.splitext(filename)
        if ext.lower() == '.jpg':
            for english_name, portuguese_name in mapping.items():
                if name == english_name:
                    new_name = f"{portuguese_name.capitalize()}.jpg"
                    old_path = os.path.join(directory, filename)
                    new_path = os.path.join(directory, new_name)
                    os.rename(old_path, new_path)
                    print(f"Renomeado: {filename} -> {new_name}")
                    break


rename_images(output_dir, food_mapping)
