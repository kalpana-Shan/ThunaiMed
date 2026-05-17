import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "thunai.db")


def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_connection()
    cursor = conn.cursor()

    # Case logs — anonymized, no PII ever stored
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS case_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            symptoms_hash TEXT,
            triage_zone TEXT,
            action_taken TEXT,
            language TEXT,
            synced INTEGER DEFAULT 0
        )
    """)

    # Health facilities — Tamil Nadu PHCs pre-seeded
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS facilities (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            type TEXT NOT NULL,
            latitude REAL NOT NULL,
            longitude REAL NOT NULL,
            phone TEXT,
            district TEXT
        )
    """)

    # Seed facility data only if table is empty
    cursor.execute("SELECT COUNT(*) FROM facilities")
    if cursor.fetchone()[0] == 0:
        facilities = [
            ("Karamadai PHC",       "PHC",               11.2428,  76.9519, "04254-252100", "Coimbatore"),
            ("Mettupalayam PHC",     "PHC",               11.2985,  76.9473, "04254-222345", "Coimbatore"),
            ("Coimbatore GH",        "District Hospital", 11.0168,  76.9558, "0422-2301393", "Coimbatore"),
            ("Perundurai PHC",       "PHC",               11.2786,  77.5868, "04294-220100", "Erode"),
            ("Erode GH",             "District Hospital", 11.3410,  77.7172, "0424-2258911", "Erode"),
            ("Salem GH",             "District Hospital", 11.6643,  78.1460, "0427-2411501", "Salem"),
            ("Namakkal PHC",         "PHC",               11.2189,  78.1676, "04286-220100", "Namakkal"),
            ("Dharmapuri PHC",       "PHC",               12.1279,  78.1580, "04342-260100", "Dharmapuri"),
            ("Krishnagiri PHC",      "PHC",               12.5265,  78.2134, "04343-233100", "Krishnagiri"),
            ("Vellore GH",           "District Hospital", 12.9165,  79.1325, "0416-2232200", "Vellore"),
            ("Tiruvannamalai PHC",   "PHC",               12.2253,  79.0747, "04175-252100", "Tiruvannamalai"),
            ("Cuddalore PHC",        "PHC",               11.7480,  79.7714, "04142-230100", "Cuddalore"),
            ("Madurai GH",           "District Hospital",  9.9252,  78.1198, "0452-2532535", "Madurai"),
            ("Trichy GH",            "District Hospital", 10.7905,  78.7047, "0431-2712929", "Tiruchirappalli"),
            ("Thanjavur GH",         "District Hospital", 10.7870,  79.1378, "04362-230333", "Thanjavur"),
            ("Tirunelveli GH",       "District Hospital",  8.7139,  77.7567, "0462-2572870", "Tirunelveli"),
            ("Nagercoil PHC",        "PHC",                8.1833,  77.4119, "04652-222100", "Kanyakumari"),
            ("Dindigul PHC",         "PHC",               10.3624,  77.9695, "0451-2422100", "Dindigul"),
            ("Pudukottai PHC",       "PHC",               10.3797,  78.8201, "04322-221100", "Pudukottai"),
            ("Virudhunagar PHC",     "PHC",                9.5851,  77.9629, "04562-243100", "Virudhunagar"),
        ]
        cursor.executemany(
            "INSERT INTO facilities (name, type, latitude, longitude, phone, district) VALUES (?,?,?,?,?,?)",
            facilities
        )
        print(f"✅ Seeded {len(facilities)} Tamil Nadu health facilities")

    conn.commit()
    conn.close()
    print("✅ Database initialized at:", DB_PATH)