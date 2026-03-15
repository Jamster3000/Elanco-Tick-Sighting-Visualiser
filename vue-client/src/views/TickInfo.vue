<template>
    <div class="species-container">
        <button @click="previousSpecies">Previous</button>

        <div class="species-card">
            <h2 style="padding-top: 80px;">{{ species[currentIndex].name }}</h2>
            <img :src="species[currentIndex].image" alt="Tick Photo" />
            <p>Bio Characteristics: {{ species[currentIndex].bioCharacteristics }}</p>
            <p>Typical Habitat: {{species[currentIndex].typicalHabitat}}</p>
            <p>Health Risks: {{species[currentIndex].healthRisks}}</p>
        </div>

        <button @click="nextSpecies">Next</button>
    </div>
</template>

<script>
    export default {
        name: "TickInfo",
        data() {
            return {
                currentIndex: 0,
                species: [
                    {
                        name: "Fox/Badger Tick",
                        image: "/Tick-Images/Fox-Badger-Tick.jpg",
                        bioCharacteristics: "The Southern Rodent tick usually last from 2-3 years, they are small (1-3mm) with an oval body shape and are reddish brown or black uniformly coloured, most active through spring till autumn with the most active months being April and October.",
                        typicalHabitat: "Underground burrows of small mammals.",
                        healthRisks: "Risk of Lyme disease, bacterial infections and other syndromes from a bite of this tick.",
                    },

                    {
                        name: "Marsh Tick",
                        image: "/Tick-Images/Marsh-Tick.jpg",
                        bioCharacteristics: "Typically lives 1–2 years, possibly longer in colder climates. Larger than many ticks (4–5 mm). Oval body, reddish‑brown or black legs, dark brown back with white/silver patterns. Most active in colder months, especially February–April.",
                        typicalHabitat: "Marshes, fens, swamps, wetlands; usually attached to vegetation.",
                        healthRisks: "Risk of Lyme disease and various dangerous pathogens.",
                    },


                    {
                        name: "Southern Rodent Tick",
                        image: "/Tick-Images/Southern-Rodent-Tick.jpg",
                        bioCharacteristics: "The Southern Rodent tick usually lasts 2–3 years. Small (1–3 mm), oval-bodied, reddish brown or black, uniformly coloured. Most active from spring to autumn, peaking in April and October.",
                        typicalHabitat: "Underground burrows of small mammals.",
                        healthRisks: "Risk of Lyme disease, bacterial infections, and other syndromes from bites.",
                    },

                    {
                        name: "Tree Hole Tick",
                        image: "/Tick-Images/Tree-Hole-Tick.jpg",
                        bioCharacteristics: "Lifespan of 2–3 years. Host‑specific. Males do not feed. Light to reddish brown. 2.5–6.0 mm. Wrinkled surface.",
                        typicalHabitat: "Natural cavities in trees; bird nests.",
                        healthRisks: "To humans: Powassan virus, tick paralysis, infections, local irritation. To animals: Powassan virus, tick paralysis, anaemia.",
                    },

                    {
                        name: "Passerine Tick",
                        image: "/Tick-Images/Passerine-Tick.jpg",
                        bioCharacteristics: "1‑year lifespan. Targets birds; human bites rare. Reddish‑brown to blackish, no patterns. Oval, 2.3–8.0 mm. Hairy/fuzzy appearance.",
                        typicalHabitat: "Leaf litter under bamboo bushes; highly humid environments.",
                        healthRisks: "To humans: Lyme borreliosis, tick‑borne encephalitis, anaplasmosis, Borrelia miyamotoi. To animals: Supports life cycles on passerine birds; can drop in domestic areas affecting pets and livestock.",
                    },


                ],
            };
        },

        computed: {
            TotalSpecies() {
                return this.species.length
            }
        },

        methods: {

            nextSpecies() {
                if (this.currentIndex < this.TotalSpecies - 1)
                {
                    this.currentIndex++;
                }
                else
                {
                    this.currentIndex = 0;
                }
            },
            previousSpecies()
            {
                if (this.currentIndex > 0)
                {
                    this.currentIndex--;
                }
                else
                {
                    this.currentIndex = this.TotalSpecies-1;
                }
            },
        },
    };
</script>

<style scoped>

    button {
        width: 150px;
        height: 60px;
    }
    .species-container {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .species-card {
        width: 50%;
        text-align: center;
        margin: 20px;
    }

    p {
        margin-top: 30px;
        text-align: left;
    }

    img {
        width: 200px;
        outline: solid;
        outline-width: 2px;
    }
</style>