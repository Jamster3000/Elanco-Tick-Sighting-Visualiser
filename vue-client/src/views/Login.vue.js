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
    password: ''
});
const handleLogin = async () => {
    if (!formData.value.email || !formData.value.password) {
        message.value = { type: 'error', text: 'Please fill in all fields' };
        return;
    }
    isLoading.value = true;
    try {
        const response = await fetch('http://localhost:5021/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': "application/json" },
            body: JSON.stringify({
                email: formData.value.email,
                password: formData.value.password
            })
        });
        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('user', JSON.stringify(data.user));
            const firstName = data.user.fullName.split(' ')[0];
            message.value = { type: 'success', text: `Successfully logged in. Welcome ${firstName}. Redirecting in 3 seconds.` };
            setTimeout(() => router.push('/'), 3000);
        }
        else {
            message.value = { type: 'error', text: data.message || 'Login failed' };
        }
    }
    catch (error) {
        message.value = { type: 'error', text: 'An error occurred. Please try again.' };
        console.error('Login error:', error);
    }
    finally {
        isLoading.value = false;
    }
};
const goToSignup = () => {
    router.push('/Signup');
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
    ...{ onSubmit: (__VLS_ctx.handleLogin) },
    ...{ class: "auth-form" },
});
/** @type {__VLS_StyleScopedClasses['auth-form']} */ ;
const __VLS_5 = FormInput;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent1(__VLS_5, new __VLS_5({
    modelValue: (__VLS_ctx.formData.email),
    label: "Email Address",
    type: "email",
    placeholder: "your@email.com",
    required: true,
}));
const __VLS_7 = __VLS_6({
    modelValue: (__VLS_ctx.formData.email),
    label: "Email Address",
    type: "email",
    placeholder: "your@email.com",
    required: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_6));
const __VLS_10 = PasswordInput;
// @ts-ignore
const __VLS_11 = __VLS_asFunctionalComponent1(__VLS_10, new __VLS_10({
    modelValue: (__VLS_ctx.formData.password),
    label: "Password",
    placeholder: "Enter your password",
    strengthCheck: (false),
    required: true,
}));
const __VLS_12 = __VLS_11({
    modelValue: (__VLS_ctx.formData.password),
    label: "Password",
    placeholder: "Enter your password",
    strengthCheck: (false),
    required: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_11));
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    type: "submit",
    ...{ class: "btn btn-primary btn-block" },
    disabled: (__VLS_ctx.isLoading),
});
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-block']} */ ;
(__VLS_ctx.isLoading ? 'Logging in...' : 'Login');
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "auth-footer" },
});
/** @type {__VLS_StyleScopedClasses['auth-footer']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.a, __VLS_intrinsics.a)({
    ...{ onClick: (__VLS_ctx.goToSignup) },
    href: "#",
    ...{ class: "auth-link" },
});
/** @type {__VLS_StyleScopedClasses['auth-link']} */ ;
// @ts-ignore
[message, message, message, handleLogin, formData, formData, isLoading, isLoading, goToSignup,];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
//# sourceMappingURL=Login.vue.js.map