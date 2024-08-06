import requests
import os
import base64
import time

api_key = 'FPSX243a5602bd79424f91629dfa066d2b1d'
output_dir = 'food_images'
os.makedirs(output_dir, exist_ok=True)

# Usando nomes em inglês para gerar as imagens de IA
food_names = [
    "rice", "beans", "meat", "pasta", "milk", "bread", "cheese", "ham",
    "butter", "yogurt",
    "chicken", "fish", "tomato", "lettuce", "carrot", "potato", "onion",
    "garlic", "pepper", "kale",
    "banana", "apple", "orange", "strawberry", "grape", "watermelon",
    "avocado", "pineapple", "mango", "kiwi",
    "cookie", "chocolate", "snack", "soda", "juice", "coffee",
    "tea", "sugar", "salt",
    "oil", "vinegar", "sauce", "ketchup", "mustard", "mayonnaise", "cereal",
    "oat", "flour", "cornmeal", "olive oil"
]


def generate_image(food_name):
    url = "https://api.freepik.com/v1/ai/text-to-image"

    payload = {
        "prompt": f"package of {food_name}",
        "negative_prompt": "b&w, earth, cartoon, ugly,anime, people",
        "num_inference_steps": 8,
        "guidance_scale": 2,
        "seed": 42,
        "num_images": 1,
        "image": {"size": "square"},
        "styling": {
            "style": "photo",
            "color": "pastel",
            "lightning": "studio",
            "framing": "portrait"
        }
    }
    headers = {
        "x-freepik-api-key": api_key,
        "Content-Type": "application/json",
        "Accept": "application/json"
    }

    try:
        response = requests.post(url, json=payload, headers=headers)
        response.raise_for_status()

        data = response.json()
        if 'data' in data and len(data['data']) > 0:
            img_base64 = data['data'][0]['base64']
            img_data = base64.b64decode(img_base64)
            img_path = os.path.join(output_dir, f"{food_name}.jpg")
            with open(img_path, 'wb') as handler:
                handler.write(img_data)
            print(f"Imagem de {food_name} salva em {img_path}")
        else:
            print(f"Imagem não gerada para {food_name}")

    except requests.exceptions.RequestException as e:
        print(f"Erro ao acessar a API para {food_name}: {e}")


for food in food_names:
    generate_image(food)
    # para não estourar a API
    time.sleep(1)
