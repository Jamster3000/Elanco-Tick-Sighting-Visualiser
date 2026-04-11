import csv
import sqlite3

# Open Database
db = sqlite3.connect("ticks.db")
cursor = db.cursor()

ticks_mapping = {
    "Sheep tick": "Ixodes ricinus",
    "Fox/badger tick": "Ixodes canisuga",
    "Hedgehog tick": "Ixodes hexagonus",
    "Ornate cow tick": "Dermacentor reticulatus",
    "Southern rodent tick": "Ixodes acuminatus",
    "Marsh tick": "Ixodes apronophorus",
    "Tree-hole tick": "Ixodes arboricola",
    "Sand martin tick": "Ixodes lividus",
    "Vole tick": "Ixodes trianguliceps",
    "Pigeon tick": "Argas reflexus",
    "Long-legged bat tick": "Ixodes vespertilionis",
    "Natterer's bat tick": "Carios vespertilionis",
    "Cormorant tick": "Ixodes unicavatus",
    "Red sheep tick": "Haemaphysalis punctata",
    "Rabbit tick": "Haemaphysalis leporispalustris",
    "Squirrel tick": "Ixodes affinis",
    "Seabird tick": "Ixodes uriae",
    "Brown dog tick": "Rhipicephalus sanguineus",
    "Cattle tick": "Ixodes caledonicus",
    "Wood mouse tick": "Ixodes minor",
    "Passerine tick": "Ixodes frontalis"
}

tick_information_mapping = {
    "Southern rodent tick": {
        "Bio": "A small (1–3mm) reddish-brown to black tick with a 2–3 year lifespan, most active between April and October.",
        "Habitat": "Commonly found in the underground burrows of small mammals.",
        "Health Risks": "Can transmit Lyme disease, bacterial infections, and other associated syndromes."
    },
    "Marsh tick": {
        "Bio": "A larger tick (4–5mm) with a dark brown back and distinctive white-silver markings, most active between February and April.",
        "Habitat": "Found in marshes, fens, swamps, and wetlands, typically attached to low-lying vegetation.",
        "Health Risks": "Known to transmit Lyme disease and other potentially dangerous pathogens."
    },
    "Fox/badger tick": {
        "Bio": "A 3-year lifespan tick with a pale yellowish scutum, preferring foxes, badgers, and dogs as hosts; active from spring to late autumn with peak activity in April–May.",
        "Habitat": "Found in fox and badger earths, dog kennels, and similar sheltered dens.",
        "Health Risks": "Can transmit Lyme disease and Rocky Mountain Spotted Fever."
    },
    "Tree-hole tick": {
        "Bio": "A 2–3 year lifespan tick ranging from light to reddish-brown, measuring 2.5–6mm depending on life stage and feeding status.",
        "Habitat": "Most commonly found in natural tree cavities and bird nesting material.",
        "Health Risks": "Associated with Powassan Virus and tick paralysis, among other risks."
    },
    "Passerine tick": {
        "Bio": "A short-lived (roughly 1 year) reddish-brown to black tick (2.3–8mm) that primarily targets birds; human bites are rare.",
        "Habitat": "Typically found in leaf litter, beneath bamboo bushes, and in high-humidity environments.",
        "Health Risks": "Can transmit Lyme disease, and infestations on birds can indirectly increase local tick populations and risk to pets and livestock."
    }
}

info_lookup = {k.lower(): v for k, v in tick_information_mapping.items()}

location_name_cache = {}
species_cache = {}

i = 0

def clearTableRows():
    cursor.execute("PRAGMA foreign_keys = OFF;")

    cursor.execute("""
        SELECT name FROM sqlite_master 
        WHERE type='table' AND name NOT LIKE 'sqlite_%'
    """)

    tables = [row[0] for row in cursor.fetchall()]

    for table in tables:
        cursor.execute(f"DELETE FROM {table}")


    cursor.execute("PRAGMA foreign_keys = ON;")

    cursor.execute("DELETE FROM sqlite_sequence;")
    
    db.commit()

clearTableRows()

with open("Tick Sightings - Y1.csv", encoding="UTF-8") as csv_file:
    for row in csv.DictReader(csv_file):
        tick_generate_id = row["id"]
        date = row["date"]
        location_name = row["location"]
        species_name = row["species"]
        latin_name = row["latinName"]

        if species_name == "null" or latin_name == "null" or location_name == "null":
            continue
 
        # INSERT one location per unique name
        if location_name not in location_name_cache:
            cursor.execute(
                "INSERT INTO LOCATION (NAME) VALUES (?)", (location_name,)
            )
            location_name_cache[location_name] = cursor.lastrowid
 
        location_id = location_name_cache[location_name]
 
        # INSERT one species per unique latin name
        if species_name not in species_cache:
            cursor.execute(
                "INSERT INTO TICK_SPECIES (SPECIES, LATIN) VALUES (?, ?)",
                (species_name, latin_name)
            )
            species_cache[species_name] = (cursor.lastrowid, latin_name)
 
        species_id = species_cache[species_name][0]
 
        # INSERT one row per sighting
        cursor.execute(
            "INSERT INTO TICKS (SPECIES_ID) VALUES (?)", (species_id,)
        )
        tick_id = cursor.lastrowid
 
        # INSERT the sighting itself
        cursor.execute(
            "INSERT INTO TICK_LOCATION (TICK_ID, LOCATION_ID, SOURCE_ID, DATE) VALUES (?, ?, ?, ?)",
            (tick_id, location_id, tick_generate_id, date)
        )
 
db.commit()

for species_name, (species_id, latin_name) in species_cache.items():
    info = info_lookup.get(species_name.lower(), {})
    cursor.execute(
        "INSERT OR IGNORE INTO TICK_SPECIES_INFO (SPECIES_ID, BIO_CHARACTERISTIC, TYPICAL_HABITAT, HEALTH_RISKS) VALUES (?, ?, ?, ?)",
        (species_id, info.get("Bio"), info.get("Habitat"), info.get("Health Risks"))
    )
 
db.commit()

for tick_name, tick_latin in ticks_mapping.items():
    cursor.execute(
        "INSERT INTO TICK_LATIN_MAPPING (TICK_NAME, TICK_LATIN_NAME) VALUES (?, ?)",
        (tick_name, tick_latin)
    )
 
db.commit()
db.close()

print("FINISHED!!!!")
