# Novel eShelf — Web Client

The web frontend for the Novel eShelf platform. Handles the public marketing/browse site plus author, admin, and moderator dashboards. The reading experience itself lives in the Expo mobile app, not here — see `noveleshelf-app`.

---

## Tech Stack
- **Build tool:** Vite
- **Framework:** React, React Router
- **State:** Zustand (`authStore` — `setTokens`, `setAuth`, `updateTokens`, `updateUser`, `setCurrentRole`, `clearAuth`)
- **API calls:** plain `fetch`, using a shared `ENDPOINTS` object (`utils/api.js`) and `VITE_DB_API` base URL — see `utils/api.js` for the full list of endpoints currently wired up
- **Media URLs:** `getMediaUrl()` helper in `utils/api.js`, prepends `VITE_DB_MEDIA`

---

## Local Development

```bash
npm install
npm run dev
```

Requires a `.env` file at the project root with local API/media URLs pointed at the Django server (see `noveleshelf-server` for running it locally). There is currently no `.env.example` — ask Melissa for the current variable set if setting this up fresh.

### Mobile preview dimensions
To preview at phone browser dimensions, use **418×824** (matches Melissa's iPhone) in browser dev tools' responsive mode.

---

## Environment Variables

This project keeps both local and live values for each environment-specific variable in `.env` at the same time, with one set commented out. Switching environments means commenting/uncommenting the relevant pairs rather than maintaining separate files.

**Before every build, confirm the live (uncommented) values are active** — building with local values pointed at a live deploy is a common mistake, since Vite bakes env vars into the build at build time, not at runtime.

---

## Deployment

Deploys as a static build (`dist/`) uploaded via cPanel file manager — there's no CI/CD pipeline, this is a manual process.

### Step 1 — Switch environment variables
In `.env`, comment out the local values and uncomment the live values (URLs, API base, media base, etc.).

### Step 2 — Build
```bash
npm run build
```
**Only run this after Step 1.** The build bakes whatever `.env` values are active at build time directly into the output — there's no way to fix this after the fact without rebuilding.

### Step 3 — Upload

Log in to iFast.

**For the preview site:**
- cPanel for `thehive-services`
- Navigate to the folder location below

**For the live site:**
- WHM → List Accounts → orange cPanel icon for `noveleshelf.com`
- Navigate to the folder location below

**Folder location (both):**
- File Manager → `public_html` → `valorSites` → `valor66`
- Empty the `assets` folder first
- Upload `index.html`, `robots.txt`, and `sitemap.xml` from the build's `dist/` folder into the `valor66` folder
- Upload the contents of `dist/assets/` into the `assets` folder
- Always reload the live URL after uploading to confirm it loaded correctly

> **Note on "valor66":** this folder name is a holdover from BeeDev's internal Valor Collective staging naming convention, not a Novel eShelf–specific name. Since Novel eShelf is now live, this same preview path doubles as the staging environment used ahead of Expo app store releases — kept here intentionally rather than renamed, so don't be confused by the mismatch between the folder name and the project name.

---

## Auth & sessions

- **Token storage:** access token in `sessionStorage` (per tab), refresh token in `localStorage` (shared across tabs). Access tokens last 1 day, refresh tokens 30 days, and refresh tokens rotate on every use.
- **Fetch wrapper:** `installAuthenticatedFetch()` in `utils/session.js` wraps `window.fetch` once (called at module scope in `App.jsx`). It tags every request with `X-Client-Platform: vite`, and when a `Bearer` request gets a 401 it refreshes the token and retries once. Auth endpoints (login, logout, signup, refresh, handoff) are skipped.
- **Shared refresh:** `refreshSession()` is the only code that calls `auth/refresh/`. Concurrent callers wait on the same request, because a second refresh with the same token would hit the blacklist and log the user out. It reads the refresh token from `localStorage` (another tab may have rotated it), saves both returned tokens via `updateTokens`, and calls `clearAuth()` if the refresh token is rejected.
- **Startup (`hooks/useUser.js`):** with an access token, calls `/me/`; a 401 drops the access token so the refresh branch runs instead of logging out. With only a refresh token, calls `refreshSession()`, then the effect re-runs and fetches `/me/` once. A network error during that startup refresh still logs the user out.
- **Expo → Vite handoff (`utils/authHandoff.js`, `hooks/useAuthHandoffListener.js`):** Expo sends `?handoff=<token>&role=<currentRole>`. `receiveFromExpo` logs the user in (default role), then switches to `role` if the user has that profile. Both params are stripped from the URL afterward.
- **Purchase Quills** (`/purchase-quills`) is open to any logged-in role — quills go to the user's wallet, not a role profile.

## Admin lists

User Management, Author Requests and Book Approvals share `components/AdminComponents/AdminListControls.jsx` (Sort + "Show N" selects; options in `utils/adminList.js`). They map to the server's `order` (`newest`, `oldest`, `az`, `za`) and `page_size` (10/25/50/100, default 25 here) params, and changing either returns to page 1.

- User Management search runs on the server (`search` param, debounced ~300ms, previous request aborted). The list stays mounted while loading so the search box keeps focus.
- The Gift Ink panel searches users the same way (25 results, A–Z) and keeps the selected recipient even if a new search no longer includes them.

---

## Notes for developers

- Header navigation uses anchor `href` tags rather than React Router's `navigate` for Login/Signup/Dashboard/Logout — established pattern, not an oversight.
- `ENDPOINTS` in `utils/api.js` mixes static string paths and function entries for dynamic segments (e.g. `bookDetail: (id) => \`books/author/books/${id}/\``) — follow this pattern when adding new endpoints rather than inlining URL strings in components.
- See `noveleshelf-server`'s README for the full current list of backend endpoints this client can call — `ENDPOINTS` should be kept in sync with it, but isn't automatically generated from it, so check both when adding a new feature.

---

[← Back to Repository README](../README.md)