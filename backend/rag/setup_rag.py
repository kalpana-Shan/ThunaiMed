from pathlib import Path
import sqlite3
import json
import math
import hashlib

BASE_DIR = Path(__file__).resolve().parent
DOC_PATH = BASE_DIR / "docs" / "who_imci.txt"
DB_PATH = BASE_DIR / "rag.db"

CHUNK_SIZE = 900
CHUNK_OVERLAP = 150


def read_text():
    if not DOC_PATH.exists():
        raise FileNotFoundError(f"WHO text file not found: {DOC_PATH}")
    return DOC_PATH.read_text(encoding="utf-8", errors="ignore")


def chunk_text(text, chunk_size=CHUNK_SIZE, overlap=CHUNK_OVERLAP):
    text = " ".join(text.split())
    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        chunk = text[start:end].strip()
        if chunk:
            chunks.append(chunk)
        if end >= len(text):
            break
        start = end - overlap
    return chunks


def fake_embed(text, dims=128):
    digest = hashlib.sha256(text.encode("utf-8")).digest()
    values = []
    for i in range(dims):
        b = digest[i % len(digest)]
        values.append((b / 255.0) * 2 - 1)
    norm = math.sqrt(sum(v * v for v in values)) or 1.0
    return [v / norm for v in values]


def init_db(conn):
    conn.execute("""
        CREATE TABLE IF NOT EXISTS rag_chunks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            content TEXT NOT NULL,
            source TEXT NOT NULL,
            embedding TEXT NOT NULL
        )
    """)
    conn.commit()


def reset_table(conn):
    conn.execute("DELETE FROM rag_chunks")
    conn.commit()


def insert_chunks(conn, chunks):
    rows = []
    for chunk in chunks:
        embedding = fake_embed(chunk)
        rows.append((chunk, "WHO IMCI", json.dumps(embedding)))
    conn.executemany(
        "INSERT INTO rag_chunks (content, source, embedding) VALUES (?, ?, ?)",
        rows
    )
    conn.commit()


def main():
    text = read_text()
    chunks = chunk_text(text)
    conn = sqlite3.connect(DB_PATH)
    init_db(conn)
    reset_table(conn)
    insert_chunks(conn, chunks)
    conn.close()
    print(f"Inserted {len(chunks)} RAG chunks into {DB_PATH}")


if __name__ == "__main__":
    main()