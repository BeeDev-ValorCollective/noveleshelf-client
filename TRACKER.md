# noveleshelf-client — Tracker

> Part of the Novel eShelf project · [Master Status](https://github.com/BeeDev-ValorCollective/noveleshelf-server/blob/main/PROJECT_STATUS.md)
> **Stack:** Vite · React · React Router · Zustand · CSS
> **Deployed at:** `noveleshelf.com`
> **Last updated:** 4/24/26

---

## Site Structure

```
noveleshelf.com/           → marketing, about, pricing, signup, login (public)
noveleshelf.com/dashboard  → reader dashboard (authenticated)
noveleshelf.com/author/    → author tools (protected, author role)
noveleshelf.com/admin/     → admin tools (protected, admin role)
noveleshelf.com/mod/       → mod tools (protected, mod role)
```

---

## ✅ Completed

### Project Setup
- [x] Vite + React project initialized
- [x] React Router configured
- [x] Zustand installed and configured
- [x] `.env` with `VITE_DB_API` pattern — all API calls use `${import.meta.env.VITE_DB_API}`
- [x] `.env` commented/uncommented pairs for local vs. production

### Auth Store (`store/authStore.js`)
- [x] `user`, `accessToken`, `refreshToken`, `isAuthenticated` state
- [x] `sessionStorage` persistence for access/refresh tokens
- [x] `setAuth(user, accessToken, refreshToken)`
- [x] `updateUser(user)`
- [x] `updateAccessToken(accessToken)`
- [x] `clearAuth()`

### Auth Flow — Pages & Components
- [x] Signup page — calls API, stores auth, redirects
- [x] Login page — calls API, stores auth, role-aware redirect logic scaffolded
- [x] Logout — `useLogout` hook, clears store + sessionStorage
- [x] Protected Dashboard route — redirects to login if not authenticated
- [x] `useUser` hook — token rehydration on page load/refresh
- [x] `useLogout` hook — reusable logout logic

### Layout & Navigation
- [x] Header component — conditionally renders:
  - Authenticated: Dashboard link + Logout button
  - Unauthenticated: Login link + Sign Up link
  - Uses `<a href>` tags (not React Router `navigate`)

### Auth UI Components (reusable)
- [x] `AuthCard`
- [x] `InputField`
- [x] `PrimaryButton`
- [x] `auth.css`

---

## 🔄 In Progress

### userApp — Connecting Remaining Auth Endpoints
*All these endpoints exist and are deployed on the server — client just needs to connect them.*

- [ ] Email verification landing page (`/verify-email?token=...`)
- [ ] Resend verification email UI
- [ ] Change password page/flow
- [ ] Change email page/flow
- [ ] Forgot password page (request reset)
- [ ] Reset password page (`/reset-password?token=...`)

### userApp — Author-Facing Pages
- [ ] Free author upgrade flow (self-service)
- [ ] Free author profile update page
- [ ] Author request submission form (6 request types)
- [ ] "My author requests" page — view status + `reader_notes`

---

## 🔲 Up Next Queue

*Ordered by priority — work top to bottom.*

1. **Email verification landing page** — server is sending the link, users need somewhere to land
2. **Forgot/reset password pages** — core auth, should be done before any further feature work
3. **Change password + change email pages** — account management, high priority
4. **Public marketing pages** — Home, About, Pricing (static content, JSON-driven for easy updates)
5. **Free author upgrade + profile flow** — once marketing pages are in place
6. **Author request form** — needs the 6 request types, dropdown selection
7. **booksApp integration** — blocked until server booksApp endpoints are ready (see 🚫 below)
8. **Author tools (`/author/`)** — book/chapter management, scoped after booksApp is ready
9. **Admin tools (`/admin/`)** — book approval queue, author request management, user management
10. **Mod tools (`/mod/`)** — content moderation (scope TBD)
11. **Reader dashboard** — library, reading history, discovery (scope TBD, likely tied to app too)

---

## 🔗 Ready to Hand Off / Already Connected

| Feature | Status | Notes |
|---------|--------|-------|
| Signup → Server | ✅ Connected | |
| Login → Server | ✅ Connected | |
| Logout → Server | ✅ Connected | |
| All other userApp endpoints | ✅ Server ready | Client pages not built yet |

---

## 🚫 Blocked / Waiting On

| Blocked Feature | Waiting On | Notes |
|-----------------|-----------|-------|
| Book browsing / discovery | Server — booksApp endpoints | Models migrated locally; endpoints in progress |
| Author book/chapter management | Server — booksApp endpoints | |
| Admin book approval queue | Server — booksApp admin endpoints | |
| Reading progress / UserBook | Server — booksApp endpoints | |

---

## 🗒️ Notes

- All API calls pattern: `const DB_API = \`${import.meta.env.VITE_DB_API}\`` then `DB_API + 'endpoint/'`
- Header uses `<a href>` not React Router `navigate` — keep this consistent
- Login has role-aware redirect logic scaffolded but not fully built out yet — revisit when author/admin routes exist
- Marketing content (promotions, pricing, featured books) can live in `public/*.json` files — no redeploy needed to update
- Social login buttons (Google, Apple) are present in Login UI but not yet wired up — leave for later