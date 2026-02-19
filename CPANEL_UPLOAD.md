# What to Upload to cPanel File Manager

---

## Before you upload – short version

1. **Build** the main site and the admin on your PC (see section 1 below).
2. **Zip** a folder named **lalnova** that contains:
   - **package.json** (project root)
   - **server/** (entire folder, including **server/.env**)
   - **client/build/** (the **built** main site – not the full `client/` source)
   - **admin/dist/** (optional – the **built** admin; you’ll upload this to **admin.lalnova.com** separately)
3. **Node app on cPanel:**  
   - **Application root** = **lalnova** (the folder that contains `package.json`, `server/`, and `client/`).  
   - **Application startup file** = **server/index.js**
4. **Admin (separate):** The built admin (**admin/dist/**) is not run by Node. You upload the **contents** of **admin/dist/** to the **admin.lalnova.com** document root in File Manager (static files only).

So: you upload **one zip “lalnova”** with server + built client (and optionally built admin). Node runs from **lalnova**; the “others” (client and admin) are the **built** outputs only (client/build and admin/dist).

---

## 1. Build the app on your PC first

In the project root run:

```bash
npm run install-all
npm run build
```

This creates/updates `client/build/`. Do not upload without building.

---

## 2. Folder structure on cPanel (after upload)

Your app folder on cPanel should look like this:

```
lalnova/                    ← application root (use this in "Setup Node.js App")
├── package.json
├── server/
│   ├── .env                 ← must contain DATABASE_URL, JWT_SECRET, CORS_ORIGIN, etc.
│   ├── index.js
│   ├── routes/
│   ├── middleware/
│   └── prisma/
│       ├── schema.prisma
│       ├── seed.js
│       └── migrations/
└── client/
    └── build/               ← from "npm run build"
        ├── index.html
        ├── static/
        │   ├── js/
        │   └── css/
        └── ... (other assets)
```

---

## 3. What to INCLUDE in your zip / upload

| Path | Include? | Notes |
|------|----------|--------|
| **package.json** (root) | ✅ Yes | Required |
| **server/** (entire folder) | ✅ Yes | Include **server/.env** (with your real values for production) |
| **client/build/** (entire folder) | ✅ Yes | Required – the **built** main site (from `npm run build`) |
| **admin/dist/** (entire folder) | ✅ Optional | **Built** admin (from `cd admin && npm run build`); upload its contents to **admin.lalnova.com** doc root |

**Inside `server/` make sure you have:**

- `server/.env` – with DATABASE_URL, JWT_SECRET, CORS_ORIGIN, NODE_ENV, PORT
- `server/index.js`
- `server/routes/` (all files)
- `server/middleware/` (all files)
- `server/prisma/schema.prisma`
- `server/prisma/seed.js`
- `server/prisma/migrations/` (entire folder)

---

## 4. What to EXCLUDE (do not upload)

| Path | Why |
|------|-----|
| **node_modules/** (root and client) | Too large; run `npm install --production` on the server |
| **client/src/** | Not needed; you serve `client/build/` only |
| **client/public/** | Not needed for production (already in build) |
| **admin/** (source: src, node_modules, etc.) | Use **admin/dist/** (built) only; don’t zip the full admin folder |
| **.git/** | Not needed on the server |
| **.env** in project root | App uses **server/.env** only |

---

## 5. Quick zip method (Windows, from project root)

1. Build: `npm run build`
2. Create a new folder, e.g. `lalnova-upload`.
3. Copy into it:
   - `package.json`
   - entire `server/` folder (including `server/.env`)
   - only `client/build/` (copy the **build** folder as `client/build` inside the zip)
4. Zip `lalnova-upload` and upload that zip to cPanel, then extract so that the **application root** is the folder that contains `package.json`, `server/`, and `client/`.

Or from the project root in PowerShell (after `npm run build`):

```powershell
# Create upload folder
New-Item -ItemType Directory -Force -Path lalnova-upload
Copy-Item package.json lalnova-upload/
Copy-Item -Recurse -Force server lalnova-upload/
New-Item -ItemType Directory -Force -Path lalnova-upload\client
Copy-Item -Recurse -Force client\build lalnova-upload\client\
# Then zip lalnova-upload and upload to cPanel
```

---

## 6. On cPanel after upload

1. **Extract** the zip in File Manager so the folder with `package.json` is your app root (e.g. `public_html/lalnova` or your subdomain folder).
2. In **Setup Node.js App** set:
   - **Application root** = that folder (e.g. `lalnova`)
   - **Application startup file** = `server/index.js`
3. Add **Environment variables** in cPanel (if your host allows) – otherwise **server/.env** is used (already uploaded).
4. In **Terminal** or **SSH**, go to the app root and run only:
   ```bash
   npm install --production
   ```
   **Do not run** `prisma migrate deploy` or `prisma generate` on cPanel — they often cause "Out of memory". Run migrations and seed **from your PC** (see CPANEL_HOSTING.md Step 5a).
5. **Start** or **Restart** the Node.js application in cPanel. Remove any "Run JS script" that runs `migrate:prod`.

---

## 7. Before you go live

- In **server/.env** set:
  - `JWT_SECRET` to a long random string (e.g. 32+ characters).
  - `CORS_ORIGIN` to your real domain, e.g. `https://yourdomain.com`.
- Ensure the MySQL user is **added to the database** with **ALL PRIVILEGES** in cPanel → MySQL® Databases.

See **CPANEL_HOSTING.md** for the full hosting steps.
