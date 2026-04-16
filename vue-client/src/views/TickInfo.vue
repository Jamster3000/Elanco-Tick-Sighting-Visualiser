
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
                        bioCharacteristics: "The Southern Rodent tick usually live from 2-3 years, they are small (1-3mm) with an oval body shape and are reddish brown or black uniformly coloured, most active through spring till autumn with the most active months being April and October.",
                        typicalHabitat: "Underground burrows of small mammals.",
                        healthRisks: "Risk of Lyme disease, bacterial infections and other syndromes from a bite of this tick.",
                    },

                    {
                        name: "Marsh Tick",
                        image: "/Tick-Images/marshtick_2.webp",
                        bioCharacteristics: "Typically lives 1–2 years, possibly longer in colder climates. Larger than many ticks (4–5 mm). Oval body, reddish‑brown or black legs, dark brown back with white/silver patterns. Most active in colder months, especially February–April.",
                        typicalHabitat: "Marshes, fens, swamps, wetlands; usually attached to vegetation.",
                        healthRisks: "Risk of Lyme disease and various dangerous pathogens.",
                    },


                    {
                        name: "Southern Rodent Tick",
                        image: "/Tick-Images/Southern-Rodent-Tick.jpg",
                        bioCharacteristics: "The Southern Rodent tick usually live 2–3 years. Small (1–3 mm), oval-bodied, reddish brown or black, uniformly coloured. Most active from spring to autumn, peaking in April and October.",
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
                if (this.currentIndex < this.TotalSpecies - 1) {
                    this.currentIndex++;
                }
                else {
                    this.currentIndex = 0;
                }
            },
            previousSpecies() {
                if (this.currentIndex > 0) {
                    this.currentIndex--;
                }
                else {
                    this.currentIndex = this.TotalSpecies - 1;
                }
            },
        },
    };
</script>

<template>
    <h1 class="title">Tick Information</h1>
    <div class="species-container">
        <button class="btn btn-secondary nav-buttons" @click="previousSpecies">Previous</button>

        <div class="card card-center">
            <h1 style="padding-bottom: 30px;" class="tick-name">{{ species[currentIndex].name }}</h1>
            <img :src="species[currentIndex].image" alt="Tick Photo" />
            <h2 class="tick-name">Bio Characteristics</h2>
            <p class="Information">{{ species[currentIndex].bioCharacteristics }}</p>
            <h2 class="tick-name">Typical Habitat</h2>
            <p class="Information">{{species[currentIndex].typicalHabitat}}</p>
            <h2 class="tick-name">Health Risks</h2>
            <p class="Information">{{species[currentIndex].healthRisks}}</p>
            <p class="current">{{currentIndex+1}} / {{TotalSpecies}}</p>
        </div>

        <button class="btn btn-secondary nav-buttons" @click="nextSpecies">Next</button>
    </div>
</template>

<style scoped>
    h1.title {
        text-align: center;
        padding-top: var(--top-padding);
        text-decoration: underline;
        font-size: calc(32px * var(--font-scale, 1));
    }

    h1.tick-name {
        text-decoration: underline;
        font-size: calc(32px * var(--font-scale, 1));
    }

    h2.tick-name {
        text-decoration: underline;
        font-size: calc(24px * var(--font-scale, 1));
    }

    .current {
        text-align: center;
    }

    .species-container {
        display: flex;
        gap: 20px;
        align-items: flex-start;
        justify-content: center;
    }

        .species-container img {
            width: 200px;
            border: 2px solid;
            border-radius: 8px;
            transition: height 1s, width 1s;
        }

            .species-container img:hover {
                height: 60%;
                width: 60%;
            }

    .nav-buttons {
        font-size: calc(22px * var(--font-scale, 1));
        margin-top: 20px;
        align-self: flex-start;
        width: 150px;
        height: 60px;
        background: var(--bg);
        color: var(--primary);
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        padding: 10px 20px;
        border-radius: 8px;
        border: solid 2px;
        cursor: pointer;
        transition: background-color 0.7s, height 0.2s, width 0.2s;
    }

        .nav-buttons:hover {
            background-color: lightgrey;
            height: 70px;
            width: 160px;
        }

    .Information {
        margin: 10px;
        text-align: center;
        font-size: calc(18px * var(--font-scale, 1));
    }

    .Sub-Title {
        text-decoration: underline;
        font-size: 30px;
    }
</style>