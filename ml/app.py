from flask import Flask, request, jsonify
from flask_cors import CORS
from utils import clean_and_load_products
from gpt_helper import get_keywords_from_gpt
import re

# 🧹 Load and clean products
products = clean_and_load_products("products.csv", "cleaned_products.json")

app = Flask(__name__)
CORS(app)

# 🔑 Occasion → keywords mapping
occasion_keywords = {
    "trip": ["maggi", "chips", "bisleri", "frooti", "tissues"],
    "birthday": ["cake", "soda", "chips", "plastic bags", "napkins"],
    "monthly groceries": ["rice", "dal", "atta", "turmeric", "soap", "toothpaste"],
    "puja": ["agarbatti", "camphor", "ghee", "diya"],
    "college": ["maggi", "kurkure", "bisleri", "poha", "detergent"]
}

# 🔍 Match helper
def matches_any_tag(query_words, tags):
    return any(word in tags for word in query_words)

@app.route('/generate', methods=['POST'])
def generate_cart():
    data = request.json
    query = data.get('input', '').lower()

    # 🎯 Extract budget
    prices = re.findall(r'\d+', query)
    budget = int(prices[0]) if prices else 9999

    # 🎉 Occasion-based match
    for occasion, keywords in occasion_keywords.items():
        if occasion in query:
            matched = []
            total = 0
            for kw in keywords:
                candidates = [
                    p for p in products
                    if kw in p["name"].lower() and p["availability"]
                ]
                candidates.sort(key=lambda x: x.get("rating", 0), reverse=True)
                for p in candidates:
                    if total + p["price"] <= budget:
                        matched.append(p)
                        total += p["price"]
                        break
            return jsonify({"products": matched})

    # 🤖 GPT-based keyword extraction
    gpt_keywords = get_keywords_from_gpt(query)
    print("🧠 GPT keywords:", gpt_keywords)

    # 📦 General tag search using GPT keywords
    query_words = gpt_keywords if gpt_keywords else re.findall(r'\b[a-zA-Z]+\b', query)

    tag_matched = [
        p for p in products
        if matches_any_tag(query_words, p["tags"]) and p["availability"]
    ]

    # 🏆 Sort by rating DESC, then price ASC
    sorted_tagged = sorted(tag_matched, key=lambda x: (-x.get("rating", 0), x["price"]))

    # 💸 Apply budget filter & limit
    selected = []
    total = 0
    for item in sorted_tagged:
        if total + item["price"] <= budget:
            selected.append(item)
            total += item["price"]
        if len(selected) >= 15:
            break

    return jsonify({"products": selected})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5050, debug=True)
