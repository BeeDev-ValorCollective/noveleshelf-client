// Server-side sort + page size for admin lists. Values map to the `order` and
// `page_size` query params handled by server/utils/admin_list.py.
export const ADMIN_PAGE_SIZES = [10, 25, 50, 100]
export const ADMIN_DEFAULT_PAGE_SIZE = 25

export const USER_SORT_OPTIONS = [
    { value: 'newest', label: 'Newest joined' },
    { value: 'oldest', label: 'Oldest joined' },
    { value: 'az', label: 'Email A–Z' },
    { value: 'za', label: 'Email Z–A' },
]

export const REQUEST_SORT_OPTIONS = [
    { value: 'newest', label: 'Newest' },
    { value: 'oldest', label: 'Oldest' },
    { value: 'az', label: 'Email A–Z' },
    { value: 'za', label: 'Email Z–A' },
]

export const BOOK_SORT_OPTIONS = [
    { value: 'newest', label: 'Newest' },
    { value: 'oldest', label: 'Oldest' },
    { value: 'az', label: 'Title A–Z' },
    { value: 'za', label: 'Title Z–A' },
]
