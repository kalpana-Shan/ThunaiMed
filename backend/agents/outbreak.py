import hashlib
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from db.database import get_connection


def log_case(symptoms: str, zone: str,
             action_taken: str, language: str = "unknown") -> dict:
    """
    Logs case anonymously. No PII stored.
    Symptoms are SHA256 hashed before storage.
    """
    symptoms_hash = hashlib.sha256(symptoms.encode()).hexdigest()[:16]

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """INSERT INTO case_logs
           (symptoms_hash, triage_zone, action_taken, language)
           VALUES (?, ?, ?, ?)""",
        (symptoms_hash, zone, action_taken, language)
    )
    conn.commit()

    # Outbreak signal — 3+ RED cases today in same language region
    cursor.execute("""
        SELECT COUNT(*) FROM case_logs
        WHERE triage_zone = 'RED'
        AND language = ?
        AND DATE(timestamp) = DATE('now')
    """, (language,))
    red_today = cursor.fetchone()[0]

    # Total cases today
    cursor.execute("""
        SELECT COUNT(*) FROM case_logs
        WHERE DATE(timestamp) = DATE('now')
    """)
    total_today = cursor.fetchone()[0]

    conn.close()

    alert = None
    if red_today >= 3:
        alert = (
            f"⚠️ OUTBREAK SIGNAL: {red_today} RED zone cases today "
            f"in this region. Report to district health officer immediately."
        )

    return {
        "logged": True,
        "case_id": symptoms_hash,
        "total_cases_today": total_today,
        "red_cases_today": red_today,
        "outbreak_alert": alert,
        "note": "Case logged anonymously. No personal data stored."
    }