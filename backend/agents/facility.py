import math
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from db.database import get_connection


def haversine(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Straight-line distance in km between two GPS coordinates."""
    R = 6371
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat / 2) ** 2 +
         math.cos(math.radians(lat1)) *
         math.cos(math.radians(lat2)) *
         math.sin(dlon / 2) ** 2)
    return R * 2 * math.asin(math.sqrt(a))


def find_nearest_facility(latitude: float, longitude: float,
                           facility_type: str = "any") -> dict:
    conn = get_connection()
    cursor = conn.cursor()

    if facility_type == "any":
        cursor.execute("SELECT * FROM facilities")
    else:
        cursor.execute(
            "SELECT * FROM facilities WHERE type = ?", (facility_type,)
        )

    facilities = cursor.fetchall()
    conn.close()

    if not facilities:
        return {
            "name": "No facilities found in database",
            "type": "unknown",
            "distance_km": 0,
            "phone": None,
            "district": None,
            "note": "Contact your district health office directly."
        }

    nearest = min(
        facilities,
        key=lambda f: haversine(latitude, longitude, f["latitude"], f["longitude"])
    )

    distance = haversine(
        latitude, longitude, nearest["latitude"], nearest["longitude"]
    )

    return {
        "name": nearest["name"],
        "type": nearest["type"],
        "distance_km": round(distance, 1),
        "phone": nearest["phone"],
        "district": nearest["district"],
        "note": "⚠️ Distance is straight-line only. Actual road distance may be longer."
    }