<script setup lang-="ts">
    import { ref } from 'vue'
    import { useRouter } from 'vue-router'
    import MessageDisplay from "@/components/Authentication/MessageDisplay.vue"
    import FormInput from "@/components/Authentication/FormInput.vue"
    import { SERVER_CONFIG } from '@/config/server';

    const serverURL = SERVER_CONFIG.BASE_URL;

    const router = useRouter()
    const message = ref({ type: '', text: '' })
    const isLoading = ref(false)
    const showDeleteConfirm = ref(false)

    const userData = localStorage.getItem("user")
    const user = userData ? JSON.parse(userData) : null

    const formData = ref({
        newEmail: user?.email || '',
        currentPassword: ''
    })

    const handleUpdateEmail = async () => {
        if (!formData.value.newEmail || !formData.value.currentPassword) {
            message.value = { type: 'error', text: 'Please fill in all fields' }
            return
        }

        isLoading.value = true 

        try {
            const response = await fetch(`${serverURL}/api/auth/update-email`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    currentEmail: user.email,
                    newEmail: formData.value.newEmail,
                    password: formData.value.currentPassword
                })
            })

            const data = await response.json()

            if (response.ok) {
                localStorage.setItem('user', JSON.stringify(data.user))
                message.value = { type: 'success', text: 'Email updated successfully' }
                formData.value.currentPassword = ''
            } else {
                message.value = { type: 'error', text: data.message || 'Failed to update email' }
            }
        } catch (error) {
            message.value = { type: 'error', text: 'An error occurred. Please try again.' }
            console.error('Update email error:', error)
        } finally {
            isLoading.value = false
        }
    }

    const handleDeleteAccount = async () => {
        isLoading.value = true

        try {
            const response = await fetch(`${serverURL}/api/auth/delete-account/${user.id}`, {
                method: "DELETE",
                headers: { 'ContentType': 'application/json' }
            })

            if (response.ok) {
                localStorage.removeItem('user')
                message.value = { type: 'success', text: 'Account deleted. Redirecting...' }
                setTimeout(() => router.push('/'), 2000)
            } else {
                const data = await response.json()
                message.value = { type: 'error', text: data.message || 'Failed to delete account' }
            }
        } catch (error) {
            message.value = { type: 'error', text: 'An error occurred. Please try again.' }
            console.error('Delete account error:', error)
        } finally {
            isLoading.value = false
            showDeleteConfirm.value = false
        }
    }
</script>

<template>
    <div class="container">
        <div class="manage-wrapper">
            <div class="card">
                <h1 class="title">Manage Account</h1>

                <MessageDisplay v-if="message.text"
                                :type="message.type"
                                :message="message.text" />

                <div class="section">
                    <h2 class="section-title">Update Email</h2>
                    <form @submit.prevent="handleUpdateEmail" class="form">
                        <FormInput v-model="formData.newEmail"
                                   label="New Email Address"
                                   type="email"
                                   placeholder="your@newemail.com"
                                   required />

                        <FormInput v-model="formData.currentPassword"
                                   label="Current Password"
                                   type="password"
                                   placeholder="Enter your password to confirm"
                                   required />

                        <button type="submit"
                                class="btn btn-primary btn-block"
                                :disabled="isLoading">
                            {{ isLoading ? 'Updating...' : 'Update Email' }}
                        </button>
                    </form>
                </div>

                <hr class="divider" />

                <div class="section">
                    <h2 class="section-title danger">Delete Account</h2>
                    <p class="warning-text">This action cannot be undone. All your data will be permanently deleted.</p>

                    <div v-if="!showDeleteConfirm" class="button-group">
                        <button class="btn btn-secondary"
                                @click="showDeleteConfirm = true"
                                :disabled="isLoading">
                            Delete Account
                        </button>
                    </div>

                    <div v-else class="confirmation">
                        <p class="confirm-text">Are you sure you want to delete your account?</p>
                        <div class="button-group">
                            <button class="btn btn-secondary"
                                    @click="handleDeleteAccount"
                                    :disabled="isLoading">
                                {{ isLoading ? 'Deleting...' : 'Yes, Delete My Account' }}
                            </button>
                            <button class="btn btn-primary"
                                    @click="showDeleteConfirm = false"
                                    :disabled="isLoading">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .manage-wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
    }

    .card {
        margin-top: 0;
        animation: fadeInUp 0.6s ease;
    }

    .title {
        font-size: 28px;
        font-weight: 700;
        color: var(--text);
        margin-bottom: 12px;
        text-align: center;
    }

    .section {
        margin-bottom: 18px;
    }

    .section-title {
        font-size: 22px;
        font-weight: bold;
        color: var(--text);
        margin-bottom: 16px;
    }

        .section-title.danger {
            color: var(--message-error-text);
            text-align: center;
        }

    .form {
        display: flex;
        flex-direction: column;
        gap: 16px;
    }

    .warning-text {
        font-size: 14px;
        color: var(--message-error-text);
        margin-bottom: 16px;
    }

    .confirmation {
        background: rgba(255, 0, 0, 0.05);
        padding: 6px;
        border-radius: 8px;
        border-left: 4px solid var(--message-error-text);
    }

    .confirm-text {
        font-size: 14px;
        color: var(--text);
        margin-bottom: 16px;
        font-weight: 500;
    }

    .button-group {
        display: flex;
        gap: 12px;
    }

    .btn-block {
        width: 100%;
    }

    .divider {
        height: 1px;
        border: none;
        background: var(--text);
        opacity: 0.1;
        margin: 10px 0;
    }

    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }

        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @media (max-width: 900px) {
        .container {
            padding-top: calc(var(--mobile-header-height)) !important;
        }

        .manage-wrapper {
            display: flex;
            align-items: center;
            justify-content: center;
            padding-top: 10px;
        }

        .card {
            width: 100%;
            max-width: 100%;
            padding: 20px;
            animation: fadeInUp 0.6s ease;
        }

        .title {
            font-size: calc(24px * var(--font-scale, 1));
            font-weight: 700;
            color: var(--text);
            margin-bottom: 12px;
            text-align: center;
        }

        .section {
            margin-bottom: 16px;
        }

        .section-title {
            font-size: calc(20px * var(--font-scale, 1));
            font-weight: bold;
            color: var(--text);
            margin-bottom: 12px;
        }

            .section-title.danger {
                color: var(--message-error-text);
                text-align: center;
            }

        .form {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .warning-text {
            font-size: calc(15px * var(--font-scale, 1));
            color: var(--message-error-text);
            margin-bottom: 12px;
            text-align: center;
        }

        .confirmation {
            background: rgba(255, 0, 0, 0.05);
            padding: 12px;
            border-radius: 6px;
            border-left: 3px solid var(--message-error-text);
        }

        .confirm-text {
            font-size: calc(12px * var(--font-scale, 1));
            color: var(--text);
            margin-bottom: 12px;
            font-weight: 500;
        }

        .button-group {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .btn-block {
            width: 100%;
            padding: 12px 16px;
            font-size: calc(15px * var(--font-scale, 1));
        }

        .divider {
            height: 1px;
            border: none;
            background: var(--text);
            opacity: 0.1;
            margin: 8px 0;
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .card {
            animation: none;
        }
    }
</style>