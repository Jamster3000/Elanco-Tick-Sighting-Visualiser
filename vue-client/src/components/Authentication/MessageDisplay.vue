<script setup lang="ts">defineProps({
        type: {
            type: String,
            required: true,
            validator: (value: string) => ['success', 'error', 'warning'].includes(value)
        },
        message: {
            type: String,
            required: true
        }
    })</script>

<template>
    <div :class="['message', `message-${type}`]">
        <span class="message-icon">
            <span v-if="type === 'success'"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-check2" viewBox="0 -2 16 16"><path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0" /></svg></span>
            <span v-else-if="type === 'error'"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-x-lg" viewBox="0 -2 16 16"><path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"></path></svg></span>            <span v-else-if="type === 'warning'">!</span>
            <span v-else><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-info-lg" viewBox="0 0 16 16"><path d="m9.708 6.075-3.024.379-.108.502.595.108c.387.093.464.232.38.619l-.975 4.577c-.255 1.183.14 1.74 1.067 1.74.72 0 1.554-.332 1.933-.789l.116-.549c-.263.232-.65.325-.905.325-.363 0-.494-.255-.402-.704zm.091-2.755a1.32 1.32 0 1 1-2.64 0 1.32 1.32 0 0 1 2.64 0" /></svg></span>
        </span>
        <p class="message-text">{{ message }}</p>
    </div>
</template>

<style scoped>
    .message {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 16px;
        border-radius: 6px;
        margin-bottom: 20px;
        animation: slideIn 0.3s ease;
    }

    .message-icon {
        font-weight: 700;
        font-size: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        flex-shrink: 0;
    }

    .message-text {
        font-size: 14px;
        font-weight: 500;
        margin: 0;
    }

    .message-success {
        background-color: var(--message-success-background);
        color: var(--message-success-text);
        border: 1px solid var(--message-success-border);
    }

        .message-success .message-icon {
            background-color: var(--message-success-icon-background);
            color: white;
        }

    .message-error {
        background-color: var(--message-error-background);
        color: var(--message-error-text);
        border: 1px solid var(--message-error-border);
    }

        .message-error .message-icon {
            background-color: var(--message-error-icon-background);
            color: white;
        }

    .message-warning {
        background-color: var(--message-warning-background);
        color: var(--message-warning-text);
        border: 1px solid var(--message-warning-border);
    }

        .message-warning .message-icon {
            background-color: var(--message-warning-icon-background);
            color: white;
        }

    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }

        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @media (max-width: 900px) {
        .message {
            gap: 12px;
            padding: 12px 16px;
            margin-bottom: 16px;
        }

        .message-text {
            font-size: calc(14px * var(--font-scale, 1));
            font-weight: 500;
        }

        .message-icon {
            width: 32px;
            height: 32px;
            flex-shrink: 0;
        }

            .message-icon svg {
                width: 18px;
                height: 18px;
            }
    }
</style>