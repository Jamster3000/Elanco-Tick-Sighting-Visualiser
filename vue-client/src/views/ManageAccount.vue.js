import { ref } from 'vue';
import { useRouter } from 'vue-router';
import MessageDisplay from "@/components/Authentication/MessageDisplay.vue";
import FormInput from "@/components/Authentication/FormInput.vue";
const router = useRouter();
const message = ref({ type: '', text: '' });
const isLoading = ref(false);
const showDeleteConfirm = ref(false);
const userData = localStorage.getItem("user");
const user = userData ? JSON.parse(userData) : null;
const formData = ref({
    newEmail: user?.email || '',
    currentPassword: ''
});
const handleUpdateEmail = async () => {
    if (!formData.value.newEmail || !formData.value.currentPassword) {
        message.value = { type: 'error', text: 'Please fill in all fields' };
        return;
    }
    isLoading.value = true;
    try {
        const response = await fetch('http://localhost:5021/api/auth/update-email', {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                currentEmail: user.email,
                newEmail: formData.value.newEmail,
                password: formData.value.currentPassword
            })
        });
        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('user', JSON.stringify(data.user));
            message.value = { type: 'success', text: 'Email updated successfully' };
            formData.value.currentPassword = '';
        }
        else {
            message.value = { type: 'error', text: data.message || 'Failed to update email' };
        }
    }
    catch (error) {
        message.value = { type: 'error', text: 'An error occurred. Please try again.' };
        console.error('Update email error:', error);
    }
    finally {
        isLoading.value = false;
    }
};
const handleDeleteAccount = async () => {
    isLoading.value = true;
    try {
        const response = await fetch(`http://localhost:5021/api/auth/delete-account/${user.id}`, {
            method: "DELETE",
            headers: { 'ContentType': 'application/json' }
        });
        if (response.ok) {
            localStorage.removeItem('user');
            message.value = { type: 'success', text: 'Account deleted. Redirecting...' };
            setTimeout(() => router.push('/'), 2000);
        }
        else {
            const data = await response.json();
            message.value = { type: 'error', text: data.message || 'Failed to delete account' };
        }
    }
    catch (error) {
        message.value = { type: 'error', text: 'An error occurred. Please try again.' };
        console.error('Delete account error:', error);
    }
    finally {
        isLoading.value = false;
        showDeleteConfirm.value = false;
    }
};
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "container" },
});
/** @type {__VLS_StyleScopedClasses['container']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "manage-wrapper" },
});
/** @type {__VLS_StyleScopedClasses['manage-wrapper']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "card" },
});
/** @type {__VLS_StyleScopedClasses['card']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h1, __VLS_intrinsics.h1)({
    ...{ class: "title" },
});
/** @type {__VLS_StyleScopedClasses['title']} */ ;
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
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "section" },
});
/** @type {__VLS_StyleScopedClasses['section']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({
    ...{ class: "section-title" },
});
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.form, __VLS_intrinsics.form)({
    ...{ onSubmit: (__VLS_ctx.handleUpdateEmail) },
    ...{ class: "form" },
});
/** @type {__VLS_StyleScopedClasses['form']} */ ;
const __VLS_5 = FormInput;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent1(__VLS_5, new __VLS_5({
    modelValue: (__VLS_ctx.formData.newEmail),
    label: "New Email Address",
    type: "email",
    placeholder: "your@newemail.com",
    required: true,
}));
const __VLS_7 = __VLS_6({
    modelValue: (__VLS_ctx.formData.newEmail),
    label: "New Email Address",
    type: "email",
    placeholder: "your@newemail.com",
    required: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_6));
const __VLS_10 = FormInput;
// @ts-ignore
const __VLS_11 = __VLS_asFunctionalComponent1(__VLS_10, new __VLS_10({
    modelValue: (__VLS_ctx.formData.currentPassword),
    label: "Current Password",
    type: "password",
    placeholder: "Enter your password to confirm",
    required: true,
}));
const __VLS_12 = __VLS_11({
    modelValue: (__VLS_ctx.formData.currentPassword),
    label: "Current Password",
    type: "password",
    placeholder: "Enter your password to confirm",
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
(__VLS_ctx.isLoading ? 'Updating...' : 'Update Email');
__VLS_asFunctionalElement1(__VLS_intrinsics.hr)({
    ...{ class: "divider" },
});
/** @type {__VLS_StyleScopedClasses['divider']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "section" },
});
/** @type {__VLS_StyleScopedClasses['section']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({
    ...{ class: "section-title danger" },
});
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['danger']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "warning-text" },
});
/** @type {__VLS_StyleScopedClasses['warning-text']} */ ;
if (!__VLS_ctx.showDeleteConfirm) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "button-group" },
    });
    /** @type {__VLS_StyleScopedClasses['button-group']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
        ...{ onClick: (...[$event]) => {
                if (!(!__VLS_ctx.showDeleteConfirm))
                    return;
                __VLS_ctx.showDeleteConfirm = true;
                // @ts-ignore
                [message, message, message, handleUpdateEmail, formData, formData, isLoading, isLoading, showDeleteConfirm, showDeleteConfirm,];
            } },
        ...{ class: "btn btn-secondary" },
        disabled: (__VLS_ctx.isLoading),
    });
    /** @type {__VLS_StyleScopedClasses['btn']} */ ;
    /** @type {__VLS_StyleScopedClasses['btn-secondary']} */ ;
}
else {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "confirmation" },
    });
    /** @type {__VLS_StyleScopedClasses['confirmation']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "confirm-text" },
    });
    /** @type {__VLS_StyleScopedClasses['confirm-text']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "button-group" },
    });
    /** @type {__VLS_StyleScopedClasses['button-group']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
        ...{ onClick: (__VLS_ctx.handleDeleteAccount) },
        ...{ class: "btn btn-secondary" },
        disabled: (__VLS_ctx.isLoading),
    });
    /** @type {__VLS_StyleScopedClasses['btn']} */ ;
    /** @type {__VLS_StyleScopedClasses['btn-secondary']} */ ;
    (__VLS_ctx.isLoading ? 'Deleting...' : 'Yes, Delete My Account');
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
        ...{ onClick: (...[$event]) => {
                if (!!(!__VLS_ctx.showDeleteConfirm))
                    return;
                __VLS_ctx.showDeleteConfirm = false;
                // @ts-ignore
                [isLoading, isLoading, isLoading, showDeleteConfirm, handleDeleteAccount,];
            } },
        ...{ class: "btn btn-primary" },
        disabled: (__VLS_ctx.isLoading),
    });
    /** @type {__VLS_StyleScopedClasses['btn']} */ ;
    /** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
}
// @ts-ignore
[isLoading,];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
//# sourceMappingURL=ManageAccount.vue.js.map