# Novel eShelf — Web Repository

This repository contains two separate things:

```
/
├── static/    — the original "coming soon" landing page (pre-launch)
├── client/    — the full Vite/React web client (current, in active development)
└── README.md
```

---

## `static/` — Coming Soon Page

The original pre-launch landing page, built from the BeeDev base template with Novel eShelf branding. Kept in the repo for reference / in case a coming-soon page is needed again (e.g. for a future re-launch or maintenance window), but **not the active project** — see `client/` for that.

### Features
- Neon framed logo presentation with soft glow effects
- Novel eShelf branding and assets
- Responsive layout for mobile, tablet, and desktop
- BeeDev favicon and footer branding

### Structure
```
static/
  assets/
    css/
    images/
    js/
  index.html
```

### Notes
All updates were completed in the `dev` branch before opening a PR to `main`. Deployment uses the finalized static files in the `static/` folder directly — no build step.

---

## `client/` — Web Client (active)

See [`client/README.md`](client/README.md) for the full Vite client documentation — tech stack, local dev setup, environment variables, and deployment instructions.

This is the current, actively developed part of the project: the public marketing/browse site plus author, admin, and moderator dashboards. See `client/README.md` for the note on why deploys go to a folder named `valor66` despite the project being called Novel eShelf.

---

## Open UI/Copy Notes (client)

> Loose notes on pages still being refined — not yet actioned, kept here so they aren't lost.

**Home Page**
- Add active-page indication in the nav — either hide the current page's link or change its color
- Combine the "For Readers / For Authors" section at the bottom with the section at the top instead of having both

**About Page**
- Consider removing the "journey" section

**Pricing Page**
- Rename to "Shop"
- No subscription model
- Quills wording/presentation still TBD

**Library Page**
- No notes yet

---

[← Back to Repository README](../README.md)