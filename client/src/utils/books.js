export const STATUS_LABELS = {
    draft: 'Draft',
    pending_approval: 'Pending Approval',
    approved: 'Approved',
    changes_requested: 'Changes Requested',
    rejected: 'Rejected',
}

export const SORT_OPTIONS = [
    { value: 'created_at_desc', label: 'Newest First' },
    { value: 'created_at_asc', label: 'Oldest First' },
    { value: 'updated_at_desc', label: 'Recently Updated' },
    { value: 'updated_at_asc', label: 'Least Recently Updated' },
    { value: 'title_asc', label: 'Title A–Z' },
    { value: 'title_desc', label: 'Title Z–A' },
]

export function sortBooks(books, sortValue) {
    const sorted = [...books]
    switch (sortValue) {
        case 'created_at_desc':
            return sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        case 'created_at_asc':
            return sorted.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
        case 'updated_at_desc':
            return sorted.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
        case 'updated_at_asc':
            return sorted.sort((a, b) => new Date(a.updated_at) - new Date(b.updated_at))
        case 'title_asc':
            return sorted.sort((a, b) => a.title.localeCompare(b.title))
        case 'title_desc':
            return sorted.sort((a, b) => b.title.localeCompare(a.title))
        default:
            return sorted
    }
}