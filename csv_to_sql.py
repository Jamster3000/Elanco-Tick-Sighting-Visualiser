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
        "Bio": "The Southern Rodent Tick typically lives for 2–3 years. It is a small tick, measuring 1–3mm, with an oval body and a reddish-brown to black colouration. It is most active from spring through to autumn, with peak activity occurring between April and October.",
        "Habitat": "The Southern Rodent Tick is most commonly found in the underground burrows of small mammals.",
        "Health Risks": "The Southern Rodent Tick is capable of transmitting Lyme disease, bacterial infections, and other associated syndromes through its bite."
    },
    "Marsh tick": {
        "Bio": "The Marsh Tick has a lifespan of 1–2 years, though individuals in colder climates may live longer. It is larger than many other tick species, measuring 4–5mm, with an oval body, reddish-brown or black legs, and a dark brown back marked with distinctive white-silver patterns. It is most active during cooler periods, particularly late winter, early spring, and autumn, with peak activity between February and April.",
        "Habitat": "The Marsh Tick is typically found in marshes, fens, swamps, and wetlands, where it commonly attaches itself to low-lying vegetation.",
        "Health Risks": "The Marsh Tick is known to transmit Lyme disease and other potentially dangerous pathogens."
    },
    "Fox/badger tick": {
        "Bio": "The Fox/Badger Tick has a lifespan of approximately 3 years, progressing through four life stages: egg, larva, nymph, and adult. It is characterised by a tough, pale yellowish scutum (the hard plate on its back), which is proportionally smaller in females. Female Fox/Badger Ticks typically remain attached to a host for 7–8 days before detaching to reproduce. Preferred hosts include foxes, badgers, and dogs; human infestations are uncommon due to this tick's preference for damp, sheltered environments. It is active from early spring through to late autumn, with peak activity between April and May.",
        "Habitat": "The Fox/Badger Tick tends to share its habitat with its preferred hosts, commonly found in fox and badger earths, dog kennels, and similar sheltered dens.",
        "Health Risks": "The Fox/Badger Tick can transmit Lyme disease and Rocky Mountain Spotted Fever. A blood meal from a host is required at each stage of its life cycle."
    },
    "Tree-hole tick": {
        "Bio": "The Tree-hole Tick typically lives for 2–3 years. It ranges in colour from light brown to reddish-brown and varies in size between 2.5mm and 6mm depending on its life stage and feeding status.",
        "Habitat": "The Tree-hole Tick is most commonly found in natural cavities within trees and in the nesting material of birds.",
        "Health Risks": "The Tree-hole Tick is associated with several health risks, including Powassan Virus and tick paralysis, among others."
    },
    "Passerine tick": {
        "Bio": "The Passerine Tick has a lifespan of approximately 1 year. It primarily targets birds as its host, and biting humans is considered rare. It ranges in colour from reddish-brown to black, with adults measuring between 2.3mm and 8mm.",
        "Habitat": "The Passerine Tick is typically found in leaf litter, beneath bamboo bushes, and in areas of high humidity.",
        "Health Risks": "The Passerine Tick poses health risks to both humans and animals. It is known to transmit Lyme disease. In animals, Passerine Ticks act as hosts for tick larvae and nymphs, supporting their life cycle and indirectly increasing tick populations in an area. Ticks carried by birds, such as Ixodes ricinus, can be introduced into domestic environments, posing a risk to pets and livestock. While some studies suggest minimal impact on overall bird health, high infestations of Ixodes ricinus have been shown to cause adverse effects in smaller passerine hosts."
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