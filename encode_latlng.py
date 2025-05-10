import typing as tp
import json
import argparse

import time
import requests
from loguru import logger

NOMINATIM_URL = "https://nominatim.openstreetmap.org/search"
NOMINATUM_FIELD_LATITUDE = "lat"
NOMINATUM_FIELD_LONGITUDE = "lon"
NOMINATUM_WAIT_TIME = 1
HEADERS = {"User-Agent": "food/1.0 (philipmassouh@gmail.com)"}



def geocode_address(address: str) -> tuple[float, float]:
    params = {
        "q": address,
        "format": "json",
        "limit": 1
    }
    resp = requests.get(NOMINATIM_URL, params=params, headers=HEADERS)
    data = resp.json()
    if data:
        data = data[0]
        lat = float(data.get(NOMINATUM_FIELD_LATITUDE))
        lon = float(data.get(NOMINATUM_FIELD_LONGITUDE))
        logger.info(f"{address} -> ({lat}, {lon})")
        return lat, lon

    logger.warning(f"Failed to geocode address: {address}")
    return float('nan'), float('nan')

def _add_latlng_to_record(record: dict) -> dict:
    if record["Addresses"] is not None:
        lat, lng = geocode_address(record["Addresses"])
        record["lat"] = lat
        record["lng"] = lng
    else:
        logger.warning(f"Skipping record with no address: {record['Name']}")
    return record

def process_file(fp: str, overwrite=False):
    with open(fp, "r") as f:
        records = json.load(f)
    logger.info(f"Loaded {len(records)} records from {fp}")


    def gen() -> tp.Generator[dict, None, None]:
        for record in records:
            yield _add_latlng_to_record(record)
            time.sleep(NOMINATUM_WAIT_TIME)

    new_records = list(gen())

    with open(fp, "w") as f:
        json.dump(new_records, f, indent=2)

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("path", help="Path to JSON file")
    args = parser.parse_args()

    process_file(args.path)

if __name__ == "__main__":
    main()
