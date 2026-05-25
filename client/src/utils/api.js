export const DB_API = import.meta.env.VITE_DB_API

const MEDIA_URL = import.meta.env.VITE_DB_MEDIA

export const getMediaUrl = (path) => {
    if (!path) return null
    return `${MEDIA_URL}${path.startsWith('/') ? path.slice(1) : path}`
}

export const ENDPOINTS = {
    // ─── User / Auth ──────────────────────────────────────────────
    login:                  'auth/login/',
    logout:                 'auth/logout/',
    signup:                 'auth/register/',
    me:                     'auth/me/',
    verifyEmail:            (token) => `auth/verify-email/?token=${token}`,
    resendVerification:     'auth/resend-verification/',
    forgotPassword:         'auth/forgot-password/',
    resetPassword:          'auth/reset-password/',
    changePassword:         'user/change-password/',
    changeEmail:            'user/change-email/',
    updateProfile:          'user/profile/update/',
    adminProfileUpdate:     'user/admin-profile/update/',
    authorProfileUpdate:    'user/author-profile/update/',
    defaultRoleUpdate:      'user/default-role/update/',
    freeAuthorProfileUpdate:'user/free-author-profile/update/',
    moderatorProfileUpdate: 'user/moderator-profile/update/',

    // ─── Author Requests ──────────────────────────────────────────
    upgradeToFreeAuthor:    'user/free-author/upgrade/',
    authorRequestSubmit:    'user/author-request/submit/',
    authorRequestList:      'user/author-requests/',

    // ─── Books — Public ───────────────────────────────────────────
    referenceData:          'books/public/books/reference-data/',
    featured:               'books/public/featured/',

    // ─── Books — Author ───────────────────────────────────────────
    bookCreate:             'books/author/books/create/',
    bookList:               'books/author/books/',
    bookDetail:             (id) => `books/author/books/${id}/`,
    bookUpdate:             'books/author/books/update/',
    bookSubmit:             'books/author/books/submit/',
    bookDelete:             'books/author/books/delete/',

    genreAdd:               'books/author/books/genres/add/',
    genreRemove:            'books/author/books/genres/remove/',
    keywordAdd:             'books/author/books/keywords/add/',
    keywordRemove:          'books/author/books/keywords/remove/',
    relationshipTagAdd:     'books/author/books/relationship-tags/add/',
    relationshipTagRemove:  'books/author/books/relationship-tags/remove/',

    chapterCreate:          'books/author/chapters/create/',
    chapterList:            'books/author/chapters/',
    chapterUpdate:          'books/author/chapters/update/',
    chapterPublish:         'books/author/chapters/publish/',
    chapterUnpublish:       'books/author/chapters/unpublish/',
    chapterDelete:          'books/author/chapters/delete/',

    pageCreateUpdate:       'books/author/pages/create-update/',
    pagePublish:            'books/author/pages/publish/',
    pageUnpublish:          'books/author/pages/unpublish/',
    pageDelete:             'books/author/pages/delete/',

    // ─── Admin ─────────────────────────────────────────────────
    adminAuthorRequests:    'admin/users/author-requests/',
    adminAuthorReqUpdate:   'admin/users/author-request/update/',
    adminAuthorReqApprove:  'admin/users/author-request/approve/',
    adminBooks:             'books/admin/books',
}