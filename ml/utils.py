import csv
import json
import re
import nltk

from nltk.corpus import stopwords

# Load English stopwords
STOPWORDS = set(stopwords.words('english'))

def generate_tags(row):
    tags = []

    # Include main identifiers in tags
    for col in ["product", "category", "sub_category", "type", "brand"]:
        if row.get(col):
            raw_words = re.findall(r'\b[a-zA-Z]{2,}\b', row[col].lower())
            filtered = [word for word in raw_words if word not in STOPWORDS]
            tags.extend(filtered)

    # Extract from description
    if row.get("description"):
        desc_text = row["description"].lower()
        desc_text = re.sub(r"http\S+|www\S+", "", desc_text)
        desc_words = re.findall(r'\b[a-zA-Z]{2,}\b', desc_text)
        filtered_desc = [word for word in desc_words if word not in STOPWORDS]
        tags.extend(filtered_desc)

    return sorted(list(set(tags)))

def clean_and_load_products(csv_path, json_path="cleaned_products.json"):
    cleaned_data = []
    with open(csv_path, newline='', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile, fieldnames=[
            "id", "product", "category", "sub_category", "brand",
            "mrp", "sale_price", "type", "product_rating", "description"
        ])
        next(reader)  # skip header
        for i, row in enumerate(reader, start=1):
            try:
                name = row["product"].strip()
                price = float(row["sale_price"])
                rating = float(row.get("product_rating", 0)) if row.get("product_rating") else 0.0

                if not name or price <= 0:
                    print(f"❌ Skipping row {i}: Invalid name or price => {name} / {price}")
                    continue

                product = {
                    "id": i,
                    "name": name,
                    "price": round(price),
                    "aisle": row["category"].strip() or "Misc",
                    "availability": True,
                    "rating": round(rating, 1),
                    "tags": generate_tags(row)
                }

                cleaned_data.append(product)
                print(f"✅ Added: {name} ₹{price} ⭐ {rating}")
            except Exception as e:
                print(f"⚠️ Error in row {i}: {e}")
                continue

    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(cleaned_data, f, ensure_ascii=False, indent=2)

    print(f"\n🧼 Total cleaned products: {len(cleaned_data)}")
    return cleaned_data
