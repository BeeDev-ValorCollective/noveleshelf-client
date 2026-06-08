// utils/display.js
// Shared display name and identifier resolution.
// Used by useDisplayName (logged in user) and any admin component displaying other users.

export function resolveAuthorName(profile, email) {
    if (!profile) return email || '—'
    if (profile.show_real_name && profile.first_name) {
        return `${profile.first_name} ${profile.last_name || ''}`.trim()
    }
    return profile.pen_name || profile.author_username || email || '—'
}

export function resolveAuthorIdentifier(profile, email) {
    if (!profile) return email || '—'
    return profile.author_username || email || '—'
}

export function resolveAdminName(profile, email) {
    if (!profile) return email || '—'
    return profile.admin_username || email || '—'
}

export function resolveModeratorName(profile, email) {
    if (!profile) return email || '—'
    return profile.mod_username || email || '—'
}

export function resolveReaderName(profile, email) {
    if (!profile) return email || '—'
    if (profile.first_name) {
        return `${profile.first_name} ${profile.last_name || ''}`.trim()
    }
    return profile.username || email || '—'
}

// Resolves display name for a user object returned from the API
// (e.g. book.author, req.user) — not the logged in user
export function resolveApiAuthorDisplay(author) {
    if (!author) return { name: '—', identifier: null }
    const name = resolveAuthorName(author, author.email)
    const identifier = resolveAuthorIdentifier(author, author.email)
    return {
        name,
        identifier: identifier !== name ? identifier : null,
    }
}