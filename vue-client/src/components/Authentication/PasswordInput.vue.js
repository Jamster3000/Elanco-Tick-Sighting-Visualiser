import { ref, computed } from 'vue';
const props = defineProps({
    modelValue: {
        type: String,
        default: ''
    },
    label: {
        type: String,
        required: true
    },
    placeholder: {
        type: String,
        default: ''
    },
    required: {
        type: Boolean,
        default: false
    },
    error: {
        type: String,
        default: ''
    },
    strengthCheck: {
        type: Boolean,
        default: true
    },
    matchValue: {
        type: String,
        default: ''
    },
    disabled: {
        type: Boolean,
        default: false
    }
});
const emit = defineEmits();
const showPassword = ref(false);
const passwordStrength = ref(0);
const inputId = computed(() => `password-${Math.random().toString(36).substr(2, 9)}`);
const inputType = computed(() => showPassword.value ? 'text' : 'password');
const togglePasswordVisibility = () => {
    showPassword.value = !showPassword.value;
};
const calculateStrength = (password) => {
    //Basic calculation of how strong the user's password is
    if (!password || props.strengthCheck == false)
        return 0;
    //Add numbers to calculate how storng the user's password is
    //higher numbers = stronger password
    let strength = 0;
    //password of 12 or greater is a suggested length for a password
    if (password.length >= 8)
        strength += 25;
    if (password.length >= 12)
        strength += 25;
    //Passwords should include at least one lower and one uppercase
    //Add more strength to the score if the password includes one of both
    if (/[a-z]/.test(password) && /[A-Z]/.test(password))
        strength += 25;
    //Increase the strength if the password as one or more numbers in it
    if (/[0-9]/.test(password))
        strength += 12.5;
    //Add more to the strengh if the password includes one or more symbols
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password))
        strength += 12.5;
    return Math.min(strength, 100);
};
const strengthLabel = computed(() => {
    const strength = calculateStrength(props.modelValue);
    if (strength === 0)
        return '';
    if (strength < 30)
        return 'Weak';
    if (strength < 60)
        return 'Fair';
    if (strength < 80)
        return 'Good';
    return 'Strong';
});
const strengthColor = computed(() => {
    const strength = calculateStrength(props.modelValue);
    if (strength === 0)
        return '';
    if (strength < 30)
        return 'var(--message-error-icon-background)';
    if (strength < 60)
        return 'var(--message-warning-icon-background)';
    if (strength < 80)
        return '#17a2b8';
    return 'var(--message-success-icon-background)';
});
const isPasswordMatch = computed(() => {
    return props.matchValue && props.modelValue === props.matchValue && props.modelValue.length > 0;
});
const handleInput = (event) => {
    const target = event.target;
    emit('update:modelValue', target.value);
    passwordStrength.value = calculateStrength(target.value);
}; // @ts-ignore
const __VLS_ctx = {
    ...{},
    ...{},
    ...{},
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['form-input']} */ ;
/** @type {__VLS_StyleScopedClasses['form-input']} */ ;
/** @type {__VLS_StyleScopedClasses['form-input-error']} */ ;
/** @type {__VLS_StyleScopedClasses['toggle-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['toggle-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['form-input-match']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "form-group" },
});
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)({
    for: (__VLS_ctx.inputId),
    ...{ class: "form-label" },
});
/** @type {__VLS_StyleScopedClasses['form-label']} */ ;
(__VLS_ctx.label);
if (__VLS_ctx.required) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "required" },
    });
    /** @type {__VLS_StyleScopedClasses['required']} */ ;
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "password-input-wrapper" },
});
/** @type {__VLS_StyleScopedClasses['password-input-wrapper']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.input)({
    ...{ onInput: (__VLS_ctx.handleInput) },
    id: (__VLS_ctx.inputId),
    type: (__VLS_ctx.inputType),
    value: (__VLS_ctx.modelValue),
    placeholder: (__VLS_ctx.placeholder),
    required: (__VLS_ctx.required),
    disabled: (__VLS_ctx.disabled),
    ...{ class: (['form-input', { 'form-input-error': __VLS_ctx.error, 'form-input-match': __VLS_ctx.isPasswordMatch }]) },
});
/** @type {__VLS_StyleScopedClasses['form-input']} */ ;
/** @type {__VLS_StyleScopedClasses['form-input-error']} */ ;
/** @type {__VLS_StyleScopedClasses['form-input-match']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    ...{ onClick: (__VLS_ctx.togglePasswordVisibility) },
    type: "button",
    ...{ class: "toggle-btn" },
    disabled: (__VLS_ctx.disabled),
    title: (__VLS_ctx.showPassword ? 'Hide password' : 'Show password'),
});
/** @type {__VLS_StyleScopedClasses['toggle-btn']} */ ;
if (__VLS_ctx.showPassword) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.svg, __VLS_intrinsics.svg)({
        xmlns: "http://www.w3.org/2000/svg",
        width: "16",
        height: "16",
        fill: "currentColor",
        ...{ class: "bi bi-eye" },
        viewBox: "0 -2 16 16",
    });
    /** @type {__VLS_StyleScopedClasses['bi']} */ ;
    /** @type {__VLS_StyleScopedClasses['bi-eye']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.path)({
        d: "M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.path)({
        d: "M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0",
    });
}
else {
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.svg, __VLS_intrinsics.svg)({
        xmlns: "http://www.w3.org/2000/svg",
        width: "16",
        height: "16",
        fill: "currentColor",
        ...{ class: "bi bi-eye-slash" },
        viewBox: "0 -2 16 16",
    });
    /** @type {__VLS_StyleScopedClasses['bi']} */ ;
    /** @type {__VLS_StyleScopedClasses['bi-eye-slash']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.path)({
        d: "M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755q-.247.248-.517.486z",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.path)({
        d: "M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.path)({
        d: "M3.35 5.47q-.27.24-.518.487A13 13 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7 7 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12z",
    });
}
if (__VLS_ctx.modelValue && __VLS_ctx.strengthCheck) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "strength-container" },
    });
    /** @type {__VLS_StyleScopedClasses['strength-container']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "strength-label" },
    });
    /** @type {__VLS_StyleScopedClasses['strength-label']} */ ;
    (__VLS_ctx.strengthLabel);
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "strength-bar" },
    });
    /** @type {__VLS_StyleScopedClasses['strength-bar']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div)({
        ...{ class: "strength-fill" },
        ...{ style: ({
                width: `${__VLS_ctx.calculateStrength(__VLS_ctx.modelValue)}%`,
                backgroundColor: __VLS_ctx.strengthColor
            }) },
    });
    /** @type {__VLS_StyleScopedClasses['strength-fill']} */ ;
}
if (__VLS_ctx.error) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "form-error" },
    });
    /** @type {__VLS_StyleScopedClasses['form-error']} */ ;
    (__VLS_ctx.error);
}
// @ts-ignore
[inputId, inputId, label, required, required, handleInput, inputType, modelValue, modelValue, modelValue, placeholder, disabled, disabled, error, error, error, isPasswordMatch, togglePasswordVisibility, showPassword, showPassword, strengthCheck, strengthLabel, calculateStrength, strengthColor,];
const __VLS_export = (await import('vue')).defineComponent({
    __typeEmits: {},
    props: {
        modelValue: {
            type: String,
            default: ''
        },
        label: {
            type: String,
            required: true
        },
        placeholder: {
            type: String,
            default: ''
        },
        required: {
            type: Boolean,
            default: false
        },
        error: {
            type: String,
            default: ''
        },
        strengthCheck: {
            type: Boolean,
            default: true
        },
        matchValue: {
            type: String,
            default: ''
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },
});
export default {};
//# sourceMappingURL=PasswordInput.vue.js.map