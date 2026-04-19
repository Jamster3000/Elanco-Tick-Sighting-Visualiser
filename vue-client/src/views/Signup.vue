<script setup lang="ts">
    import { ref } from 'vue'
    import { useRouter } from 'vue-router'
    import MessageDisplay from "../components/Authentication/MessageDisplay.vue"
    import FormInput from "../components/Authentication/FormInput.vue"
    import PasswordInput from "../components/Authentication/PasswordInput.vue"
    import { SERVER_CONFIG } from '@/config/server';

    const serverURL = SERVER_CONFIG.BASE_URL;

    const router = useRouter()
    const message = ref({ type: '', text: '' })
    const isLoading = ref(false)

    const formData = ref({
        email: '',
        password: '',
        confirmPassword: '',
        fullName: ''
    })

    const handleSignup = async () => {
        if (!formData.value.email || !formData.value.password || !formData.value.confirmPassword || !formData.value.fullName) {
            message.value = { type: 'error', text: 'Please fill in all fields' }
            return
        }

        if (formData.value.password !== formData.value.confirmPassword) {
            message.value = { type: 'error', text: 'Passwords do not match' }
            return
        }

        if (formData.value.password.length < 8) {
            message.value = { type: 'error', text: 'Password must be at least 8 characters' }
            return
        }

        isLoading.value = true

        try {
            const response = await fetch(`${serverURL}/api/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': "application/json" },
                body: JSON.stringify({
                    fullName: formData.value.fullName,
                    email: formData.value.email,
                    password: formData.value.password
                })
            })

            const data = await response.json()

            if (response.ok) {
                message.value = { type: 'success', text: 'Account created successfully! Redirecting to login...' }
                setTimeout(() => router.push('/login'), 2000)
            } else {
                message.value = { type: 'error', text: data.message || 'Signup failed' }
            }
        } catch (error) {
            message.value = { type: 'error', text: 'An error occurred. Please try again.' }
            console.error('Signup error:', error)
        } finally {
            isLoading.value = false
        }
    }

    const goToLogin = () => {
        router.push('/login')
    }
</script>

<template>
    <div class="container">
        <div class="auth-wrapper">
            <div class="card">
                <h1 class="auth-title">Create Account</h1>
                <p class="auth-subtitle">Create your account!</p>

                <MessageDisplay
                    v-if="message.text"
                    :type="message.type"
                    :message="message.text"
                />

                <form @submit.prevent="handleSignup" class="auth-form">
                    <FormInput v-model="formData.fullName"
                               label="Full Name"
                               type="text"
                               placeholder="John Doe"
                               required />

                    <FormInput v-model="formData.email"
                               label="Email Address"
                               type="email"
                               placeholder="your@email.com"
                               required />

                    <PasswordInput v-model="formData.password"
                                   label="Password"
                                   placeholder="Enter a strong password"
                                   :strengthCheck=true
                                   required />

                    <PasswordInput v-model="formData.confirmPassword"
                                   label="Confirm Password"
                                   placeholder="Re-enter your password"
                                   :strengthCheck=false
                                   :matchValue="formData.password"
                                   required />

                    <button type="submit"
                            class="btn btn-primary btn-block"
                            :disabled="isLoading">
                        {{ isLoading ? 'Creating account...' : 'Sign Up' }}
                    </button>       
                </form>

                <div class="auth-footer">
                    <p>
                        Already have an account?
                        <a href="#" @click.prevent="goToLogin" class="auth-link">Login here</a>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .container {
        padding-top: calc(var(--header-height)/3) !important;
    }

    .auth-wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .card {
        width: 100%;
        max-width: 420px;
        padding-top: 10px;
        animation: fadeInUp 0.6s ease;
    }

    .auth-title {
        font-size: calc(32px * var(--font-scale, 1));
        font-weight: 700;
        color: var(--text);
        margin-bottom: 8px;
        text-align: center;
    }

    .auth-subtitle {
        font-size: calc(14px * var(--font-scale, 1));
        color: var(--text);
        text-align: center;
        margin-bottom: 12px;
    }

    .auth-form {
        display: flex;
        flex-direction: column;
        gap: 20px;
        margin-bottom: 24px;
    }

    .btn-block {
        width: 100%;
        padding: 12px 24px;
        font-size: calc(16px * var(--font-scale, 1));
        font-weight: 600;
    }

    .auth-footer {
        text-align: center;
        font-size: calc(14px * var(--font-scale, 1));
        color: var(--text);
    }

    .auth-link {
        color: var(--primary);
        text-decoration: none;
        font-weight: 600;
        transition: color 0.2s ease;
    }

        .auth-link:hover {
            color: var(--primary-dark);
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
            padding-top: calc(var(--mobile-top-padding)) !important;
        }

        .auth-wrapper {
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .card {
            width: 100%;
            max-width: 100%;
            padding: 12px;
            animation: fadeInUp 0.6s ease;
        }

        .auth-title {
            font-size: calc(24px * var(--font-scale, 1));
            font-weight: 700;
            color: var(--text);
            margin-bottom:4px;
            text-align: center;
        }

        .auth-subtitle {
            font-size: calc(14px * var(--font-scale, 1));
            color: var(--text);
            text-align: center;
            margin-bottom: 8px;
        }

        .auth-form {
            display: flex;
            flex-direction: column;
            gap: 16px;
            margin-bottom: 20px;
            color: var(--bg);
        }

        .btn-block {
            width: 100%;
            padding: 12px 16px;
            font-size: calc(16px * var(--font-scale, 1));
            font-weight: 600;
        }

        .auth-footer {
            text-align: center;
            font-size: calc(14px * var(--font-scale, 1));
            color: var(--text);
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .card {
            animation: none;
        }
    }
</style>