# Novel eShelf — Vite Frontend Developer Notes

---

## Tech Stack
- React
- React Router
- Zustand (state management)
- Vite

---

## Auth Store (`src/store/authStore.js`)

The auth store is the single source of truth for authentication and session state. Import it in any component that needs auth data.

### Reading state

```javascript
import useAuthStore from '../store/authStore'

const user = useAuthStore((state) => state.user)
// Full user object returned from the API including all profiles
// {
//     id, email, date_of_birth, default_login_role, is_verified,
//     profile, wallet, admin_profile, author_profile, 
//     free_author_profile, moderator_profile
// }

const currentRole = useAuthStore((state) => state.currentRole)
// The role the user is actively using this session
// Values: 'reader', 'author', 'free_author', 'moderator', 'admin'
// Defaults to user.default_login_role on login
// Changes when user switches role via setCurrentRole

const currentProfile = useAuthStore((state) => state.currentProfile)
// The profile object for the currentRole — already resolved
// No need to manually check which profile to use
// Contains avatar_url and username for the active role

const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
// true/false — use this to check if user is logged in
```

### Actions

```javascript
const setCurrentRole = useAuthStore((state) => state.setCurrentRole)
// Call when user switches role in the hamburger menu
// Automatically updates currentProfile too
// Also persists to localStorage so it survives page refresh
// Example:
setCurrentRole('author')
setCurrentRole('reader')

const clearAuth = useAuthStore((state) => state.clearAuth)
// Call on logout — clears everything from store and storage
```

---

## Avatar Hamburger Menu

### Getting the avatar

```javascript
const currentProfile = useAuthStore((state) => state.currentProfile)

// Avatar is always:
currentProfile?.avatar_url
```

### Getting the display username

```javascript
// Each profile type uses a different username field
currentProfile?.username          // reader profile
currentProfile?.author_username   // paid author and free author
currentProfile?.admin_username    // admin
currentProfile?.mod_username      // moderator

// Safe fallback:
const displayName = 
    currentProfile?.username || 
    currentProfile?.author_username || 
    currentProfile?.admin_username || 
    currentProfile?.mod_username || 
    user?.email
```

### Building the role switcher

```javascript
const user = useAuthStore((state) => state.user)
const currentRole = useAuthStore((state) => state.currentRole)
const setCurrentRole = useAuthStore((state) => state.setCurrentRole)

// Build available roles based on what profiles the user has
const availableRoles = []

if (user?.profile) 
    availableRoles.push({ role: 'reader', label: 'Reader' })
if (user?.free_author_profile) 
    availableRoles.push({ role: 'free_author', label: 'Free Author' })
if (user?.author_profile) 
    availableRoles.push({ role: 'author', label: 'Author' })
if (user?.moderator_profile) 
    availableRoles.push({ role: 'moderator', label: 'Moderator' })
if (user?.admin_profile) 
    availableRoles.push({ role: 'admin', label: 'Admin' })

// Render the switcher
availableRoles.map(item => (
    
        key={item.role}
        onClick={() => setCurrentRole(item.role)}
        className={currentRole === item.role ? 'active' : ''}
    >
        {item.label}
    </a>
))
```

---

## Hooks

### `useUser` (`src/hooks/useUser.js`)
Handles user rehydration on page load or navigation. Call this on any protected page to ensure user data is in the store.

```javascript
import useUser from '../hooks/useUser'

const { user, accessToken } = useUser()
```

- If `accessToken` exists but no `user` in store → calls `/me/` to rehydrate
- If no `accessToken` but `refreshToken` in localStorage → calls `/refresh/` then `/me/`
- If both missing → clears auth and redirects to login

### `useLogout` (`src/hooks/useLogout.js`)
Handles logout — calls the API, clears the store, redirects to login.

```javascript
import useLogout from '../hooks/useLogout'

const { logout } = useLogout()

// call on logout button click
<a onClick={logout}>Logout</a>
```

---

## Token Storage
- `access_token` — `sessionStorage` — short lived (60 mins), cleared on browser close
- `refresh_token` — `localStorage` — longer lived (7 days sliding), persists across browser sessions
- `current_role` — `localStorage` — persists across browser sessions

---

## Environment Variables
All API calls use the base URL from the env file:

```javascript
const DB_API = `${import.meta.env.VITE_DB_API}`

// then use as:
fetch(DB_API + 'auth/login/')
fetch(DB_API + 'auth/me/')
```

Local `.env`:
VITE_DB_API=http://localhost:8000/api/

Production `.env`:
VITE_DB_API=https://api.noveleshelf.com/api/
---

## DEV Console Logs
In development mode the following are automatically logged to the console:
- `🔐 AUTH SET` — on login/register, shows full user, tokens, currentRole, currentProfile
- `👤 USER UPDATED` — when user data is refreshed from `/me/`
- `🔑 ACCESS TOKEN UPDATED` — when token is refreshed
- `🎭 ROLE SWITCHED` — when user switches role, shows new role and profile
- `🚪 AUTH CLEARED` — on logout

These only run in dev — silent in production automatically via `import.meta.env.DEV`.

---

## Protected Routes
Wrap any route that requires authentication with `ProtectedRoute`:

```jsx
import ProtectedRoute from './components/ProtectedRoute'

<Route path="/dashboard" element={
    <ProtectedRoute>
        <Dashboard />
    </ProtectedRoute>
} />
```

`ProtectedRoute` checks `isAuthenticated` from the store and redirects to login if false.

---

## API Calls Pattern
Always include the Bearer token in authenticated requests:

```javascript
const accessToken = useAuthStore((state) => state.accessToken)

const response = await fetch(DB_API + 'user/profile/update/', {
    method: 'PATCH',
    headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ bio: 'new bio' })
})
```

For form-data (file uploads) omit `Content-Type` — browser sets it automatically:

```javascript
const formData = new FormData()
formData.append('bio', 'new bio')
formData.append('avatar_url', file)

const response = await fetch(DB_API + 'user/profile/update/', {
    method: 'PATCH',
    headers: {
        'Authorization': `Bearer ${accessToken}`
    },
    body: formData
})
```

---

## Backend API Reference
See server README for full API documentation.

## Planned Enhancements

### Cross-subdomain auth sharing (noveleshelf.com ↔ app.noveleshelf.com)
- Readers auto redirect to app.noveleshelf.com on login
- Role switching between subdomains
- Shared cookie on .noveleshelf.com domain
- Implement when Expo web app is ready