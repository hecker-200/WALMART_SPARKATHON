import json
import re

# Load products just once at the start
with open("cleaned_products.json", "r") as f:
    PRODUCTS = json.load(f)

def keyword_in_tags(keyword, tags):
    pattern = re.compile(re.escape(keyword.lower()))
    return any(pattern.search(tag) for tag in tags)

def search_products_by_keyword(keyword, max_results=15):
    keyword = keyword.lower()

    matched = [
        p for p in PRODUCTS
        if keyword_in_tags(keyword, p.get("tags", [])) and p.get("availability", False)
    ]

    sorted_matched = sorted(matched, key=lambda x: x.get("rating", 0), reverse=True)
    return sorted_matched[:max_results]
