<script setup lang="ts">
    import { ref } from 'vue'
    import { useRouter } from 'vue-router'
    import MessageDisplay from "../components/Authentication/MessageDisplay.vue"
    import FormInput from "../components/Authentication/FormInput.vue"
    import PasswordInput from "../components/Authentication/PasswordInput.vue"

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

        isLoading.value = true
    }

    const goToSignup = () => {
        router.push('/Signup')
    }
</script>

<template>
    <div class="container">
        <div class="auth-wrapper">
            <div class="card">
                <h1 class="auth-title">Login</h1>
                <p class="auth-subtitle">Login in to your account</p>

                <MessageDisplay v-if="message.text"
                                :type="message.type"
                                :message="message.text" />

                <form @submit.prevent="handleSignup" class="auth-form">
                    <FormInput v-model="formData.email"
                               label="Email Address"
                               type="email"
                               placeholder="your@email.com"
                               required />

                    <PasswordInput v-model="formData.password"
                                   label="Password"
                                   placeholder="Enter your password"
                                   :strengthCheck=true
                                   required />

                    <button type="submit"
                            class="btn btn-primary btn-block"
                            :disabled="isLoading">
                        {{ isLoading ? 'Logging in...' : 'Login' }}
                    </button>
                </form>

                <div class="auth-footer">
                    <p>
                        Don't have an account yet?
                        <a href="#" @click.prevent="goToSignup" class="auth-link">Create an account here</a>
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
        font-size: 32px;
        font-weight: 700;
        color: var(--text);
        margin-bottom: 8px;
        text-align: center;
    }

    .auth-subtitle {
        font-size: 14px;
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
        font-size: 16px;
        font-weight: 600;
    }

    .auth-footer {
        text-align: center;
        font-size: 14px;
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
</style>