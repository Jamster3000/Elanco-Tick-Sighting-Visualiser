const __VLS_props = defineProps({
    type: {
        type: String,
        required: true,
        validator: (value) => ['success', 'error', 'warning'].includes(value)
    },
    message: {
        type: String,
        required: true
    }
}); // @ts-ignore
const __VLS_ctx = {
    ...{},
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['message-success']} */ ;
/** @type {__VLS_StyleScopedClasses['message-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['message-error']} */ ;
/** @type {__VLS_StyleScopedClasses['message-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['message-warning']} */ ;
/** @type {__VLS_StyleScopedClasses['message-icon']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: (['message', `message-${__VLS_ctx.type}`]) },
});
/** @type {__VLS_StyleScopedClasses['message']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "message-icon" },
});
/** @type {__VLS_StyleScopedClasses['message-icon']} */ ;
if (__VLS_ctx.type === 'success') {
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.svg, __VLS_intrinsics.svg)({
        xmlns: "http://www.w3.org/2000/svg",
        width: "18",
        height: "18",
        fill: "currentColor",
        ...{ class: "bi bi-check2" },
        viewBox: "0 -2 16 16",
    });
    /** @type {__VLS_StyleScopedClasses['bi']} */ ;
    /** @type {__VLS_StyleScopedClasses['bi-check2']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.path)({
        d: "M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0",
    });
}
else if (__VLS_ctx.type === 'error') {
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.svg, __VLS_intrinsics.svg)({
        xmlns: "http://www.w3.org/2000/svg",
        width: "18",
        height: "18",
        fill: "currentColor",
        ...{ class: "bi bi-x-lg" },
        viewBox: "0 -2 16 16",
    });
    /** @type {__VLS_StyleScopedClasses['bi']} */ ;
    /** @type {__VLS_StyleScopedClasses['bi-x-lg']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.path, __VLS_intrinsics.path)({
        d: "M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z",
    });
}
else if (__VLS_ctx.type === 'warning') {
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
}
else {
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.svg, __VLS_intrinsics.svg)({
        xmlns: "http://www.w3.org/2000/svg",
        width: "16",
        height: "16",
        fill: "currentColor",
        ...{ class: "bi bi-info-lg" },
        viewBox: "0 0 16 16",
    });
    /** @type {__VLS_StyleScopedClasses['bi']} */ ;
    /** @type {__VLS_StyleScopedClasses['bi-info-lg']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.path)({
        d: "m9.708 6.075-3.024.379-.108.502.595.108c.387.093.464.232.38.619l-.975 4.577c-.255 1.183.14 1.74 1.067 1.74.72 0 1.554-.332 1.933-.789l.116-.549c-.263.232-.65.325-.905.325-.363 0-.494-.255-.402-.704zm.091-2.755a1.32 1.32 0 1 1-2.64 0 1.32 1.32 0 0 1 2.64 0",
    });
}
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "message-text" },
});
/** @type {__VLS_StyleScopedClasses['message-text']} */ ;
(__VLS_ctx.message);
// @ts-ignore
[type, type, type, type, message,];
const __VLS_export = (await import('vue')).defineComponent({
    props: {
        type: {
            type: String,
            required: true,
            validator: (value) => ['success', 'error', 'warning'].includes(value)
        },
        message: {
            type: String,
            required: true
        }
    },
});
export default {};
//# sourceMappingURL=MessageDisplay.vue.js.map