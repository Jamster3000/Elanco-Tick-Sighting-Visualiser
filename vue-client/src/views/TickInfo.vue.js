export default {};
;
const __VLS_ctx = {};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['species-container']} */ ;
/** @type {__VLS_StyleScopedClasses['species-container']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-buttons']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h1, __VLS_intrinsics.h1)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "species-container" },
});
/** @type {__VLS_StyleScopedClasses['species-container']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    ...{ onClick: (__VLS_ctx.previousSpecies) },
    ...{ class: "btn btn-secondary nav-buttons" },
});
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-buttons']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "card card-center" },
});
/** @type {__VLS_StyleScopedClasses['card']} */ ;
/** @type {__VLS_StyleScopedClasses['card-center']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({
    ...{ style: {} },
});
(__VLS_ctx.species[__VLS_ctx.currentIndex].name);
__VLS_asFunctionalElement1(__VLS_intrinsics.img)({
    src: (__VLS_ctx.species[__VLS_ctx.currentIndex].image),
    alt: "Tick Photo",
});
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "Sub-Title" },
});
/** @type {__VLS_StyleScopedClasses['Sub-Title']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "Information" },
});
/** @type {__VLS_StyleScopedClasses['Information']} */ ;
(__VLS_ctx.species[__VLS_ctx.currentIndex].bioCharacteristics);
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "Sub-Title" },
});
/** @type {__VLS_StyleScopedClasses['Sub-Title']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "Information" },
});
/** @type {__VLS_StyleScopedClasses['Information']} */ ;
(__VLS_ctx.species[__VLS_ctx.currentIndex].typicalHabitat);
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "Sub-Title" },
});
/** @type {__VLS_StyleScopedClasses['Sub-Title']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "Information" },
});
/** @type {__VLS_StyleScopedClasses['Information']} */ ;
(__VLS_ctx.species[__VLS_ctx.currentIndex].healthRisks);
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "current" },
});
/** @type {__VLS_StyleScopedClasses['current']} */ ;
(__VLS_ctx.currentIndex + 1);
(__VLS_ctx.TotalSpecies);
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    ...{ onClick: (__VLS_ctx.nextSpecies) },
    ...{ class: "btn btn-secondary nav-buttons" },
});
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-buttons']} */ ;
// @ts-ignore
[previousSpecies, species, species, species, species, species, currentIndex, currentIndex, currentIndex, currentIndex, currentIndex, currentIndex, TotalSpecies, nextSpecies,];
const __VLS_export = (await import('vue')).defineComponent({
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
            return this.species.length;
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
});
//# sourceMappingURL=TickInfo.vue.js.map