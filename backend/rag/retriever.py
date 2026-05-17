from pathlib import Path
import sqlite3
import json
import math
import hashlib

BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR / "rag.db"


def fake_embed(text, dims=128):
    digest = hashlib.sha256(text.encode("utf-8")).digest()
    values = []
    for i in range(dims):
        b = digest[i % len(digest)]
        values.append((b / 255.0) * 2 - 1)
    norm = math.sqrt(sum(v * v for v in values)) or 1.0
    return [v / norm for v in values]


def cosine_similarity(a, b):
    return sum(x * y for x, y in zip(a, b))


def retrieve_context(query, top_k=3):
    if not DB_PATH.exists():
        return []

    conn = sqlite3.connect(DB_PATH)
    rows = conn.execute(
        "SELECT content, source, embedding FROM rag_chunks"
    ).fetchall()
    conn.close()

    query_vec = fake_embed(query)
    scored = []

    for content, source, embedding_json in rows:
        embedding = json.loads(embedding_json)
        score = cosine_similarity(query_vec, embedding)
        scored.append({
            "content": content,
            "source": source,
            "score": score
        })

    scored.sort(key=lambda x: x["score"], reverse=True)
    return scored[:top_k]


if __name__ == "__main__":
    results = retrieve_context("child has fever and rash", top_k=3)
    for item in results:
        print(item["score"], item["source"])
        print(item["content"][:250])
        print("-" * 40)