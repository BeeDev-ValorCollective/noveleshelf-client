# Novel eShelf — Web Client

The web frontend for the Novel eShelf platform. Handles the public marketing/browse site plus author, admin, and moderator dashboards. The reading experience itself lives in the Expo mobile app, not here — see `noveleshelf-app`.

---

## Tech Stack
- **Build tool:** Vite
- **Framework:** React, React Router
- **State:** Zustand (`authStore` — `setTokens`, `updateUser`, `clearAuth`)
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

## Notes for developers

- Header navigation uses anchor `href` tags rather than React Router's `navigate` for Login/Signup/Dashboard/Logout — established pattern, not an oversight.
- `ENDPOINTS` in `utils/api.js` mixes static string paths and function entries for dynamic segments (e.g. `bookDetail: (id) => \`books/author/books/${id}/\``) — follow this pattern when adding new endpoints rather than inlining URL strings in components.
- See `noveleshelf-server`'s README for the full current list of backend endpoints this client can call — `ENDPOINTS` should be kept in sync with it, but isn't automatically generated from it, so check both when adding a new feature.

---

[← Back to Repository README](../README.md)