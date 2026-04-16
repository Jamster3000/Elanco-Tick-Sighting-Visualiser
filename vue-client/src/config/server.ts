export const SERVER_CONFIG = {
    SERVER_ADDRESS: import.meta.env.VITE_SERVER_ADDRESS,
    SERVER_PORT: import.meta.env.VITE_SERVER_PORT,
    BASE_URL: `${import.meta.env.VITE_SERVER_ADDRESS}:${import.meta.env.VITE_SERVER_PORT}`
}