<script setup lang="ts">
    import { computed } from 'vue'

    const props = defineProps({
        modelValue: {
            type: String,
            default: ''
        },
        label: {
            type: String,
            required: true
        },
        type: {
            type: String,
            default: 'text',
            validator: (value: string) => ['text', 'email', 'number', 'tel', 'url'].includes(value)
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
        disabled: {
            type: Boolean,
            default: false
        }
    })

    const emit = defineEmits<{
        'update:modelValue': [value: string]
    }>()

    const inputId = computed(() => `input-${Math.random().toString(36).substr(2, 9)}`)

    const handleInput = (event: Event) => {
        const target = event.target as HTMLInputElement
        emit('update:modelValue', target.value)
    }</script>

<template>
    <div class="form-group">
        <label :for="inputId" class="form-label">
            {{ label }}
            <span v-if="required" class="required">*</span>
        </label>
        <div class="input-wrapper">
            <input :id="inputId"
                   :type="type"
                   :value="modelValue"
                   :placeholder="placeholder"
                   :required="required"
                   :disabled="disabled"
                   :class="['form-input', { 'form-input-error': error, 'form-input-filled': modelValue }]"
                   @input="handleInput" />
            <div class="input-border"></div>
        </div>
        <p v-if="error" class="form-error">
            <span class="error-icon">⚠</span>
            {{ error }}
        </p>
    </div>
</template>

<style scoped>
    .form-group {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .form-label {
        font-size: 14px;
        font-weight: 700;
        color: var(--text);
        text-transform: uppercase;
        letter-spacing: 0.5px;
        transition: color 0.2s ease;
    }

    .required {
        color: var(--warning-red);
        margin-left: 4px;
    }

    .input-wrapper {
        position: relative;
    }

    .form-input {
        width: 100%;
        padding: 8px 16px;
        font-size: 15px;
        background-color: var(--off-white-input);
        border: 2px solid var(--shadow-color);
        border-radius: 8px;
        color: var(--text);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        z-index: 1;
    }

    .form-input::placeholder {
        color: var(--placeholder-text);
        background-color: var(--card-bg);
    }

    .form-input:hover:not(:disabled) {
        border-color: var(--primary-light);
        background-color: var(--card-bg);
    }

    .form-input:focus {
        outline: none;
        border-color: var(--primary);
        background-color: var(--card-bg);
        box-shadow: 0 0 0 4px rgba(52, 152, 219, 0.08);
    }

    .form-input:disabled {
        background-color: var(--text);
        color: var(--disabled);
        cursor: not-allowed;
    }

    .form-input-filled {
        background-color: var(--card-bg);
        border-color: var(--primary-light);
    }

    .form-input:focus ~ .input-border {
        width: 100%;
    }

    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-8px);
        }

        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
</style>