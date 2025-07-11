import os
from openai import OpenAI
from dotenv import load_dotenv
import ast

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def get_keywords_from_gpt(query):
    prompt = f"""
    A user asked: "{query}"
    Identify and return a list of shopping-related keywords from this query.
    Respond only with a Python list of keywords like: ["keyword1", "keyword2"]
    """

    try:
        response = client.chat.completions.create(
            model="gpt-4",  # or "gpt-4-0613" if you're restricted
            messages=[
                {"role": "system", "content": "You're a helpful assistant for a shopping cart app."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.2
        )

        result = response.choices[0].message.content.strip()
        keywords = ast.literal_eval(result)
        return keywords if isinstance(keywords, list) else []

    except Exception as e:
        print("⚠️ GPT error or parsing failed:", e)
        return []
