const MEDIA_URL = import.meta.env.VITE_DB_MEDIA

export const getMediaUrl = (path) => {
    if (!path) return null
    return `${MEDIA_URL}${path.startsWith('/') ? path.slice(1) : path}`
}