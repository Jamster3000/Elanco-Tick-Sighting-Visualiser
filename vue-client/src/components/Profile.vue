<!-- [Modified - From Uiverse.io by withyzu -->
<!-- https://uiverse.io/withyzu/wicked-lionfish-36 -->
<script setup lang="ts">
    defineProps<{
        fullName?: string
    }>()

    const handleLogout = () => {
        localStorage.removeItem('user')
        window.location.href = '/'
    }
</script>

<template>
    <div class="profile">
        <div tabindex="0" class="popup button">
            <div class="popup-header">
                <p class="user-name">
                    {{fullName}}
                </p>

                <svg height="32" width="32" viewBox="0 0 1024 1024" class="icon" xmlns="http://www.w3.org/2000/svg">
                    <path fill="var(--primary)"
                          d="M1021.103385 510.551692A510.551692 510.551692 0 1 1 510.551692 0a510.551692 510.551692 0 0 1 510.551693 510.551692"></path>

                    <g transform="translate(102.4 102.4) scale(0.8)">
                        <path fill="var(--primary-light)"
                              d="M192 896s-64 0-64-64 64-256 384-256 384 192 384 256-64 64-64 64H192zm320-384a192 192 0 1 0 0-384 192 192 0 0 0 0 384z"></path>
                    </g>
                </svg>
            </div>

            <ul class="list-box">
                <li><router-link to="/manage-account" class="item">Manage Account</router-link></li>
                <hr />
                <li><button class="item logout" @click="handleLogout">Logout</button></li>
            </ul>
        </div>
    </div>
</template>

<!--Profile CSS adapted from https://uiverse.io/withyzu/wicked-lionfish-36-->
<style scoped>
    .user-name {
        letter-spacing: 1px;
        font-weight: 600;
        padding: 0.625rem 0rem 0.625rem 0.825rem;
        color: var(--text);
    }

    .profile {
        --fill-hover: hsla(0, 0%, 70%, 0.15);
        --button-fill-hover: hsla(0, 0%, 10%, 0.2);
        --fill-active: hsla(0, 0%, 35%, 0.3);
        --txt: var(--text);
        --br: 0.625rem;
        --gap: 0.25rem;
        --popup-max-h: 20rem;
        display: flex;
        padding: 0;
        margin: 0;
        box-sizing: border-box;
        font-size: 0.975rem;
        color: var(--txt);
    }

    .button {
        position: relative;
        display: inline-block;
        appearance: none;
        outline: 0;
        border: 0;
        cursor: pointer;
        padding: calc(var(--gap) * 2) calc(var(--gap) * 8) calc(var(--gap) * 2) calc(var(--gap) * 4);
        background-color: var(--fill);
        border-radius: var(--br) calc(var(--br) / 2) calc(var(--br) / 2) var(--br);
        transition: background-color 500ms, color 500ms;
    }

        .button:hover {
            background-color: var(--fill-hover);
        }

        .button:focus,
        .button:active {
            background-color: var(--fill-active);
        }

    a, button.item {
        display: block;
        width: 100%;
        padding: calc(var(--gap) * 2) calc(var(--gap) * 8) calc(var(--gap) * 2) calc(var(--gap) * 4);
        text-align: left;
        background-color: transparent;
        border: 0;
        cursor: pointer;
        text-decoration: none;
        font-size: inherit;
        color: inherit;
        border-radius: var(--br) calc(var(--br) / 2) calc(var(--br) / 2) var(--br);
        transition: background-color 500ms, color 500ms;
    }

        a:hover, button.item:hover {
            background-color: var(--button-fill-hover);
        }

    button.logout:hover {
        background-color: var(--message-error-text);
        color: var(--bg);
    }

    a:focus, a:active,
    button.item:focus, button.item:active {
        background-color: var(--fill-active);
    }

    hr {
        margin: 0.4rem;
        border: 1px dashed var(--text);
    }

    .popup {
        position: relative;
        padding: 0 0.225rem 0;
        border-top-right-radius: 1.2rem;
        border-bottom-right-radius: 1.2rem;
    }

    .popup-header {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        align-items: center;
        gap: calc(var(--gap) * 3);
    }

    .list-box {
        position: absolute;
        top: 100%;
        right: 0;
        opacity: 0;
        pointer-events: none;
        margin-top: var(--gap);
        border-radius: var(--br);
        padding: 0 calc(var(--gap) * 1.5);
        background: linear-gradient(135deg, rgba(52, 152, 219, 0.1) 0%, rgba(52, 152, 219, 0.05) 100%);
        background-color: white;
        box-shadow: hsl(0, 0%, 12%) 0px 0px 0px 1px;
        transition: 0.4s;
        overflow: hidden;
        max-height: var(--popup-max-h);
        scrollbar-width: none;
        scroll-behavior: smooth;
        overscroll-behavior: contain;
        display: flex;
        flex-direction: column;
        padding-top: calc(var(--gap) * 2);
        padding-bottom: calc(var(--gap) * 3);
        list-style: none;
        margin: 0;
    }

    .popup:focus .list-box {
        margin-top: 1rem;
        opacity: 1;
    }

    li {
        list-style: none;
    }

    @media (max-width: 900px) {
        .profile {
            --fill-hover: hsla(0, 0%, 70%, 0.15);
            --button-fill-hover: hsla(0, 0%, 10%, 0.2);
            --fill-active: hsla(0, 0%, 35%, 0.3);
            --txt: var(--text);
            --br: 0.625rem;
            --gap: 0.25rem;
            --popup-max-h: 20rem;
            font-size: calc(14px * var(--font-scale, 1));
            position: relative;
            z-index: 1003;
        }

        .user-name {
            letter-spacing: 0.5px;
            font-weight: 600;
            padding: 0.5rem 0rem 0.5rem 0.625rem;
            color: var(--text);
            font-size: calc(14px * var(--font-scale, 1));
        }

        .button {
            padding: calc(var(--gap) * 1.5) calc(var(--gap) * 6) calc(var(--gap) * 1.5) calc(var(--gap) * 3);
        }

        .popup-header {
            gap: calc(var(--gap) * 2);
        }

            .popup-header svg {
                width: 24px;
                height: 24px;
            }

        a, button.item {
            padding: calc(var(--gap) * 1.5) calc(var(--gap) * 6) calc(var(--gap) * 1.5) calc(var(--gap) * 3);
            font-size: calc(14px * var(--font-scale, 1));
        }

        .list-box {
            position: absolute;
            top: 100%;
            right: 0;
            width: auto;
            min-width: 180px;
            z-index: 1003;
            pointer-events: auto;
        }

        hr {
            margin: 0.25rem;
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .button {
            transition: none;
        }

        a, button.item {
            transition: none;
        }

        .list-box {
            transition: none;
        }
    }
</style>