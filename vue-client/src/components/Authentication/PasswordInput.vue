<script setup lang="ts">import { ref, computed } from 'vue'

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
    })

    const emit = defineEmits<{
        'update:modelValue': [value: string]
    }>()

    const showPassword = ref(false)
    const passwordStrength = ref(0)

    const inputId = computed(() => `password-${Math.random().toString(36).substr(2, 9)}`)

    const inputType = computed(() => showPassword.value ? 'text' : 'password')

    const togglePasswordVisibility = () => {
        showPassword.value = !showPassword.value
    }

    const calculateStrength = (password: string): number => {
        //Basic calculation of how strong the user's password is
        if (!password || props.strengthCheck == false) return 0

        //Add numbers to calculate how storng the user's password is
        //higher numbers = stronger password
        let strength = 0

        //password of 12 or greater is a suggested length for a password
        if (password.length >= 8) strength += 25
        if (password.length >= 12) strength += 25

        //Passwords should include at least one lower and one uppercase
        //Add more strength to the score if the password includes one of both
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25

        //Increase the strength if the password as one or more numbers in it
        if (/[0-9]/.test(password)) strength += 12.5

        //Add more to the strengh if the password includes one or more symbols
        if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) strength += 12.5

        return Math.min(strength, 100)
    }

    const strengthLabel = computed(() => {
        const strength = calculateStrength(props.modelValue)
        if (strength === 0) return ''
        if (strength < 30) return 'Weak'
        if (strength < 60) return 'Fair'
        if (strength < 80) return 'Good'
        return 'Strong'
    })

    const strengthColor = computed(() => {
        const strength = calculateStrength(props.modelValue)
        if (strength === 0) return ''
        if (strength < 30) return 'var(--message-error-icon-background)'
        if (strength < 60) return 'var(--message-warning-icon-background)'
        if (strength < 80) return '#17a2b8'
        return 'var(--message-success-icon-background)'
    })

    const isPasswordMatch = computed(() => {
        return props.matchValue && props.modelValue === props.matchValue && props.modelValue.length > 0
    })

    const handleInput = (event: Event) => {
        const target = event.target as HTMLInputElement
        emit('update:modelValue', target.value)
        passwordStrength.value = calculateStrength(target.value)
    }</script>

<template>
    <div class="form-group">
        <label :for="inputId" class="form-label">
            {{ label }}
            <span v-if="required" class="required">*</span>
        </label>
        <div class="password-input-wrapper">
            <input :id="inputId"
                   :type="inputType"
                   :value="modelValue"
                   :placeholder="placeholder"
                   :required="required"
                   :disabled="disabled"
                   :class="['form-input', { 'form-input-error': error, 'form-input-match': isPasswordMatch }]"
                   @input="handleInput" />
            <button type="button"
                    class="toggle-btn"
                    @click="togglePasswordVisibility"
                    :disabled="disabled"
                    :title="showPassword ? 'Hide password' : 'Show password'">
                <span v-if="showPassword"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye" viewBox="0 -2 16 16"><path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" /><path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" /></svg></span>
                <span v-else><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-slash" viewBox="0 -2 16 16"><path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755q-.247.248-.517.486z" /><path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829" /><path d="M3.35 5.47q-.27.24-.518.487A13 13 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7 7 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12z" /></svg></span>
            </button>
        </div>

        <div v-if="modelValue && strengthCheck" class="strength-container">
            <div class="strength-label">Password strength: {{ strengthLabel }}</div>
            <div class="strength-bar">
                <div class="strength-fill"
                     :style="{
                        width: `${calculateStrength(modelValue)}%`,
                        backgroundColor: strengthColor
                    }" />
            </div>
        </div>

        <p v-if="error" class="form-error">{{ error }}</p>
    </div>
</template>

<style scoped>
    .form-group {
        display: flex;
        flex-direction: column;
        gap: 6px;
    }

    .form-label {
        font-size: 14px;
        font-weight: 600;
        color: var(--text);
    }

    .required {
        color: #dc3545;
        margin-left: 4px;
    }

    .password-input-wrapper {
        position: relative;
        display: flex;
        align-items: center;
    }

    .form-input {
        width: 100%;
        padding: 10px 40px 10px 12px;
        font-size: 14px;
        border: 1.5px solid #e0e0e0;
        border-radius: 6px;
        transition: all 0.2s ease;
        font-family: inherit;
    }

        .form-input:focus {
            outline: none;
            border-color: var(--primary);
            box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
        }

        .form-input:disabled {
            background-color: #f5f5f5;
            color: #999;
            cursor: not-allowed;
        }

    .form-input-error {
        border-color: #dc3545;
    }

        .form-input-error:focus {
            box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
        }

    .toggle-btn {
        position: absolute;
        right: 12px;
        background: none;
        border: none;
        cursor: pointer;
        font-size: 18px;
        padding: 4px 8px;
        border-radius: 4px;
        transition: background-color 0.2s ease;
    }

        .toggle-btn:hover:not(:disabled) {
            background-color: rgba(0, 0, 0, 0.05);
        }

        .toggle-btn:disabled {
            cursor: not-allowed;
            opacity: 0.5;
        }

    .strength-container {
        margin-top: 8px;
    }

    .strength-label {
        font-size: 12px;
        font-weight: 600;
        color: #666;
        margin-bottom: 4px;
    }

    .strength-bar {
        width: 100%;
        height: 4px;
        background-color: #e0e0e0;
        border-radius: 2px;
        overflow: hidden;
    }

    .strength-fill {
        height: 100%;
        transition: width 0.3s ease;
    }

    .form-error {
        font-size: 12px;
        color: #dc3545;
        margin: 0;
    }

    .form-input-match {
        background-color: var(--bg);
        border-color: var(--message-success-icon-background);
        box-shadow: 0 0 0 4px rgba(40, 167, 69, 0.08);
    }

        .form-input-match:focus {
            border-color: var(--message-success-icon-background);
            box-shadow: 0 0 0 4px rgba(40, 167, 69, 0.15);
        }

    @media (max-width: 900px) {
        .form-group {
            gap: 6px;
        }

        .form-label {
            font-size: 14px;
        }

        .form-input {
            font-size: 16px;
            padding: 12px 44px 12px 16px;
        }

        .strength-container {
            margin-top: 6px;
        }

        .strength-label {
            font-size: 12px;
            margin-bottom: 4px;
        }

        .strength-bar {
            height: 6px;
        }

        .toggle-btn {
            width: 40px;
            height: 40px;
            right: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

            .toggle-btn svg {
                width: 20px;
                height: 20px;
            }
    }
</style>