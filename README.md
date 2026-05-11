# Cy's Island Rentals

The website for three carefully kept rental homes on Nantucket.

## What's in here

```
cys-island-rentals/
├── index.html              ← HTML shell
├── package.json            ← npm dependencies
├── vite.config.js          ← build tool config
├── tailwind.config.js      ← styling config
├── postcss.config.js       ← styling pipeline
├── .gitignore
└── src/
    ├── App.jsx             ← the whole site (one file)
    ├── main.jsx            ← React entry point
    └── index.css           ← base styles
```

Almost everything lives in `src/App.jsx`. The three house illustrations,
the calendar, the owner portal, the styling — it's all in there.

---

## Getting it online (no terminal required)

### Step 1 — Create a GitHub repository

1. Go to [github.com/new](https://github.com/new)
2. Repository name: `cys-island-rentals` (or anything you like)
3. Set it to **Public** (Vercel's free plan needs public, or you can use Private with paid)
4. **Don't** check any of the "Add a README/.gitignore/license" boxes
5. Click **Create repository**

### Step 2 — Upload these files

On the empty repo page, click **"uploading an existing file"**.

Drag the entire `cys-island-rentals` folder (or all its contents) into
the upload area. GitHub will preserve the folder structure.

> Tip: On the GitHub upload page, drag the **contents** of the folder
> rather than the folder itself, so the files sit at the repo root.

Scroll down and click **Commit changes**.

### Step 3 — Deploy with Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with your GitHub account
2. Click **Add New → Project**
3. Find `cys-island-rentals` in the list and click **Import**
4. Vercel will auto-detect Vite. Leave all settings as-is.
5. Click **Deploy**

After ~30 seconds you'll get a live URL like `cys-island-rentals.vercel.app`.

Every time you commit changes to the GitHub repo, Vercel rebuilds and
redeploys automatically.

### Step 4 (optional) — Custom domain

In Vercel, go to your project → **Settings → Domains** → add your domain
(e.g. `cysislandrentals.com`). Vercel will walk you through the DNS records.

---

## Customizing later

You can edit any file directly on github.com (click the pencil icon),
and Vercel will redeploy in under a minute. Common edits:

- **Phone number & email**: open `src/App.jsx`, search for `(508) 555-0142`
- **House details**: search for `const HOUSES = [` near the top of `src/App.jsx`
- **Admin password**: search for `ADMIN_PASSWORD` at the top of `src/App.jsx`

---

## About availability data

The owner portal currently saves to **`localStorage`** in your browser.
This means:

- ✅ The site looks and works correctly for visitors
- ✅ You can mark dates unavailable from your admin browser
- ❌ Those updates **don't sync** to visitors on other devices

For real shared availability across devices and visitors, you'd add a
small backend (Firebase Firestore is free for low-traffic sites and
takes about 20 lines of code to wire in). Ask Claude to add this when
you're ready.

---

## Running locally (optional)

If you ever want to preview changes on your own computer before pushing:

1. Install [Node.js](https://nodejs.org) (the LTS version)
2. Open Terminal in this folder
3. Run `npm install`
4. Run `npm run dev`
5. Open the URL it prints (usually http://localhost:5173)

You don't need this to deploy — Vercel handles everything in the cloud.
