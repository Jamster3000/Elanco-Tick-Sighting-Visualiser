import { ref } from 'vue';
import { useRouter } from 'vue-router';
import MessageDisplay from "../components/Authentication/MessageDisplay.vue";
import FormInput from "../components/Authentication/FormInput.vue";
import PasswordInput from "../components/Authentication/PasswordInput.vue";
const router = useRouter();
const message = ref({ type: '', text: '' });
const isLoading = ref(false);
const formData = ref({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: ''
});
const handleSignup = async () => {
    if (!formData.value.email || !formData.value.password || !formData.value.confirmPassword || !formData.value.fullName) {
        message.value = { type: 'error', text: 'Please fill in all fields' };
        return;
    }
    if (formData.value.password !== formData.value.confirmPassword) {
        message.value = { type: 'error', text: 'Passwords do not match' };
        return;
    }
    if (formData.value.password.length < 8) {
        message.value = { type: 'error', text: 'Password must be at least 8 characters' };
        return;
    }
    isLoading.value = true;
    try {
        const response = await fetch('http://localhost:5021/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': "application/json" },
            body: JSON.stringify({
                fullName: formData.value.fullName,
                email: formData.value.email,
                password: formData.value.password
            })
        });
        const data = await response.json();
        if (response.ok) {
            message.value = { type: 'success', text: 'Account created successfully! Redirecting to login...' };
            setTimeout(() => router.push('/login'), 2000);
        }
        else {
            message.value = { type: 'error', text: data.message || 'Signup failed' };
        }
    }
    catch (error) {
        message.value = { type: 'error', text: 'An error occurred. Please try again.' };
        console.error('Signup error:', error);
    }
    finally {
        isLoading.value = false;
    }
};
const goToLogin = () => {
    router.push('/login');
};
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['auth-link']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "container" },
});
/** @type {__VLS_StyleScopedClasses['container']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "auth-wrapper" },
});
/** @type {__VLS_StyleScopedClasses['auth-wrapper']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "card" },
});
/** @type {__VLS_StyleScopedClasses['card']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h1, __VLS_intrinsics.h1)({
    ...{ class: "auth-title" },
});
/** @type {__VLS_StyleScopedClasses['auth-title']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "auth-subtitle" },
});
/** @type {__VLS_StyleScopedClasses['auth-subtitle']} */ ;
if (__VLS_ctx.message.text) {
    const __VLS_0 = MessageDisplay;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
        type: (__VLS_ctx.message.type),
        message: (__VLS_ctx.message.text),
    }));
    const __VLS_2 = __VLS_1({
        type: (__VLS_ctx.message.type),
        message: (__VLS_ctx.message.text),
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
}
__VLS_asFunctionalElement1(__VLS_intrinsics.form, __VLS_intrinsics.form)({
    ...{ onSubmit: (__VLS_ctx.handleSignup) },
    ...{ class: "auth-form" },
});
/** @type {__VLS_StyleScopedClasses['auth-form']} */ ;
const __VLS_5 = FormInput;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent1(__VLS_5, new __VLS_5({
    modelValue: (__VLS_ctx.formData.fullName),
    label: "Full Name",
    type: "text",
    placeholder: "John Doe",
    required: true,
}));
const __VLS_7 = __VLS_6({
    modelValue: (__VLS_ctx.formData.fullName),
    label: "Full Name",
    type: "text",
    placeholder: "John Doe",
    required: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_6));
const __VLS_10 = FormInput;
// @ts-ignore
const __VLS_11 = __VLS_asFunctionalComponent1(__VLS_10, new __VLS_10({
    modelValue: (__VLS_ctx.formData.email),
    label: "Email Address",
    type: "email",
    placeholder: "your@email.com",
    required: true,
}));
const __VLS_12 = __VLS_11({
    modelValue: (__VLS_ctx.formData.email),
    label: "Email Address",
    type: "email",
    placeholder: "your@email.com",
    required: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_11));
const __VLS_15 = PasswordInput;
// @ts-ignore
const __VLS_16 = __VLS_asFunctionalComponent1(__VLS_15, new __VLS_15({
    modelValue: (__VLS_ctx.formData.password),
    label: "Password",
    placeholder: "Enter a strong password",
    strengthCheck: (true),
    required: true,
}));
const __VLS_17 = __VLS_16({
    modelValue: (__VLS_ctx.formData.password),
    label: "Password",
    placeholder: "Enter a strong password",
    strengthCheck: (true),
    required: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_16));
const __VLS_20 = PasswordInput;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent1(__VLS_20, new __VLS_20({
    modelValue: (__VLS_ctx.formData.confirmPassword),
    label: "Confirm Password",
    placeholder: "Re-enter your password",
    strengthCheck: (false),
    matchValue: (__VLS_ctx.formData.password),
    required: true,
}));
const __VLS_22 = __VLS_21({
    modelValue: (__VLS_ctx.formData.confirmPassword),
    label: "Confirm Password",
    placeholder: "Re-enter your password",
    strengthCheck: (false),
    matchValue: (__VLS_ctx.formData.password),
    required: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    type: "submit",
    ...{ class: "btn btn-primary btn-block" },
    disabled: (__VLS_ctx.isLoading),
});
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-block']} */ ;
(__VLS_ctx.isLoading ? 'Creating account...' : 'Sign Up');
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "auth-footer" },
});
/** @type {__VLS_StyleScopedClasses['auth-footer']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.a, __VLS_intrinsics.a)({
    ...{ onClick: (__VLS_ctx.goToLogin) },
    href: "#",
    ...{ class: "auth-link" },
});
/** @type {__VLS_StyleScopedClasses['auth-link']} */ ;
// @ts-ignore
[message, message, message, handleSignup, formData, formData, formData, formData, formData, isLoading, isLoading, goToLogin,];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
//# sourceMappingURL=Signup.vue.js.map