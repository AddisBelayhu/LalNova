# Hosting LalNova on cPanel – Step-by-Step Guide

Your project is a **full-stack app**: Node.js (Express) backend + React frontend, with the server serving the built React app in production. Database: **MySQL** (Prisma).

---

## Your domains (cPanel)

| Domain | Document root | Use |
|--------|----------------|-----|
| **lalnova.com** (Main) | `/public_html` | Main site + API. Put the Node.js app here (or in a subfolder) and point this domain to it. |
| **admin.lalnova.com** | `/admin.lalnova.com` | Admin panel. Upload the **built** admin React app here as static files (see “Admin panel” below). |

- CORS is set so both **https://lalnova.com** and **https://admin.lalnova.com** can call the API.
- After SSL is working, enable **Force HTTPS Redirect** for both domains in cPanel → Domains.

---

## What you need before starting

- cPanel hosting with **Node.js** support (many hosts have “Setup Node.js App” in cPanel).
- A **MySQL database** (create it in cPanel → MySQL® Databases).
- Your domain or subdomain pointed to the hosting.

---

## Step 1: Create a MySQL database in cPanel

1. Log in to **cPanel**.
2. Open **MySQL® Databases**.
3. **Create a database** (e.g. `lalnova_db`) and note the full name (often `cpaneluser_lalnova_db`).
4. **Create a MySQL user** with a strong password.
5. **Add the user to the database** with **ALL PRIVILEGES**.
6. Note:
   - Database name (full, e.g. `cpaneluser_lalnova_db`)
   - Username (full, e.g. `cpaneluser_dbuser`)
   - Password
   - Host is usually `localhost` (or the value cPanel shows).

Your **DATABASE_URL** will look like:

```text
mysql://USERNAME:PASSWORD@localhost/DATABASE_NAME
```

Example:

```text
mysql://cpaneluser_dbuser:YourPassword123@localhost/cpaneluser_lalnova_db
```

---

## Step 2: Prepare the app on your computer

1. **Set production env for the server**  
   In the project root (or `server/`), create or edit `.env` with at least:

   ```env
   NODE_ENV=production
   PORT=5000
   DATABASE_URL=mysql://USERNAME:PASSWORD@localhost/DATABASE_NAME
   JWT_SECRET=your-very-long-random-secret-at-least-32-chars
   CORS_ORIGIN=https://yourdomain.com
   ```

   Replace `USERNAME`, `PASSWORD`, `DATABASE_NAME`, and `yourdomain.com`. Use a long random string for `JWT_SECRET`.

2. **Build the React app** (from project root):

   ```bash
   npm run install-all
   npm run build
   ```

3. **Run migrations and seed from your PC** (required, and must be done **before** relying on the app on cPanel):  
   Use **Step 5a** in this guide: enable **Remote MySQL** in cPanel, then from your PC run `npm run migrate:prod` and `npm run seed` with **server/.env** pointing at the cPanel database. Do **not** run Prisma on the server (it often hits “Out of memory” on cPanel).

4. **Zip the project** (for upload):  
   Include at least:
   - `server/` (with Prisma, routes, etc.)
   - `client/build/` (result of `npm run build`)
   - Root `package.json` and `node_modules/` (or omit `node_modules` and run `npm install` on the server).

   Do **not** zip `node_modules` if the zip becomes huge; you’ll run `npm install` on the server instead.

---

## Step 3: Upload files to cPanel

1. In cPanel, open **File Manager**.
2. Go to the folder where you want the app (e.g. `lalnova` inside `public_html` or in a subdomain folder).
3. **Upload** your zip, then **Extract** it so you have the project structure (e.g. `server/`, `client/build/`, `package.json`).

---

## Step 4: Create the Node.js app in cPanel

1. In cPanel, open **Setup Node.js App** (or “Application Manager” / “Node.js Selector”, name depends on host).
2. **Create Application**:
   - **Node.js version**: e.g. 18 or 20.
   - **Application root**: path to the folder that contains your `package.json` (e.g. `lalnova` or `public_html/lalnova`).
   - **Application URL**: your domain or subdomain (e.g. `yourdomain.com` or `app.yourdomain.com`).
   - **Application startup file**: `server/index.js` (relative to application root).
3. Set **Environment** to **Production** if there’s an option.
4. In the same screen, add **Environment variables** (key/value):
   - `NODE_ENV` = `production`
   - `PORT` = value cPanel gives you (often shown in the Node.js app summary, e.g. `5000` or a different port)
   - `DATABASE_URL` = your MySQL URL from Step 1
   - `JWT_SECRET` = your long random secret
   - `CORS_ORIGIN` = `https://yourdomain.com` (your real domain)

5. Save / create the app. cPanel will often show a **command to run** (e.g. “Run NPM Install” and “Start App”). Note the port and document root it uses.

---

## Step 5: Install dependencies on the server (do NOT run Prisma here)

**Important:** Do **not** run `prisma migrate deploy` or `prisma generate` on cPanel — Prisma often hits **"Out of memory"** (WebAssembly/LVE limits). Run migrations and seed **from your PC** (Step 5a). On the server only run **NPM Install** and **Start**; remove any "Run JS script" that runs `migrate:prod`.

1. In **File Manager**, open the project folder (application root).
2. If you have **SSH** access:
   - `cd` to the project directory.
   - Run:
     ```bash
     npm install --production
     # Do NOT run prisma here — run migrations from your PC (Step 5a)
     ```
   If you don’t have SSH, use **Terminal** in cPanel (if available) and run the same commands in the project directory.
3. If the host only has “Run NPM Install” and “Start” in the Node.js app UI:
   - Run “NPM Install” first.
   - Use only **Run NPM Install** and **Start**; do not run any Prisma command on the server.

---

## Step 5a: Run migrations and seed from your PC (required)

Prisma often hits **"Out of memory"** on cPanel (WebAssembly/LVE limits). Run these **once from your computer** against the cPanel MySQL database:

1. **Allow remote MySQL** in cPanel: **Remote MySQL®** → add your **current IP**. Save.
2. **Remote DATABASE_URL** (same user/password/db; use server hostname; encode password if it has special chars):  
   `mysql://lalnovzd_lalnovzd:PASSWORD@your-server-hostname:3306/lalnovzd_lalnova_db`
3. **On your PC**, set **server/.env** to that URL, then in project root:  
   `npm run migrate:prod` then `npm run seed`
4. After that, on cPanel only **Run NPM Install** and **Start**; no Prisma on the server.

**How to seed after npm install on cPanel (if you didn’t seed from PC):**

- **Recommended:** Seed from your PC (steps above) with **server/.env** pointing at the cPanel MySQL URL. No need to run seed on the server.
- **If you must run seed on the server:** In cPanel **Terminal**, go to the app root (the folder that contains `server/`), then run:
  ```bash
  cd server && node prisma/seed.js
  ```
  This uses only the Prisma runtime client (no heavy CLI), so it may work. If you get “Cannot find module” or Prisma errors, the client may not be generated — run **seed from your PC** instead.

---

## Step 6: Start / restart the Node.js app

1. In **Setup Node.js App**, use **Start** (or **Restart**) for your app.
2. Check the log for errors. If you see “listening on port …”, the server is running.

---

## "Can't acquire lock for app" + 503 – action plan

If you see **"Error Can't acquire lock for app: public_html/Lalnova"** and 503, follow this order:

1. **Release the lock**
   - Wait 2–3 minutes (in case NPM Install or another action is still running), then refresh the Node.js page and try **Restart** again.
   - If it still says "Can't acquire lock", in cPanel **Terminal** run:
     ```bash
     source /home/lalnovzd/nodevenv/public_html/Lalnova/22/bin/activate && cd /home/lalnovzd/public_html/Lalnova
     rm -f .cpanel-lock 2>/dev/null; rm -f nodevenv/.cpanel-lock 2>/dev/null; exit
     ```
     (Some hosts put the lock under the app root or the nodevenv path; if you see a lock file in File Manager under **Lalnova** or the path cPanel shows for the app, delete it.) Then try **Restart** again from the Node.js page.

2. **Fix the startup file**
   - Your **Application root** is `public_html/Lalnova`. The app entry point is **server/index.js**, not `index.js`.
   - In the Node.js app settings, set **Application startup file** to **`server/index.js`** (relative to the application root). Save.

3. **Don’t run Prisma from the Node.js page**
   - Use only **Run NPM Install** and **Restart** (or **Start**). Do not use **Run JS script** to run migrate/seed (that can hold the lock or cause memory errors). Do migrations and seed from your PC or from Terminal as in Step 5a.

4. **Restart and check**
   - Click **Restart** (or **Stop** then **Start**). Wait 10–20 seconds, then open **https://lalnova.com/api/health**. If you still get 503, continue with the proxy checks below.

5. **If 503 remains – proxy**
   - Ensure **Application URL** is **lalnova.com** so cPanel can proxy the domain to the app. If your host doesn’t do that, add an **.htaccess** in the domain’s document root (e.g. **public_html**) to proxy to the app’s port (see “If you see 503” below).

---

## If you see 503 Service Unavailable (e.g. on lalnova.com/api/auth/login)

The request never reaches your Node app. Work through these checks on cPanel:

### 1. Confirm the Node app is running

- Go to **Setup Node.js App** (or **Application Manager**).
- Find your app (e.g. **Lalnova**). Status must be **Started** (green). If it’s **Stopped**, click **Start**.
- Open **Application log** (or **Log**). You should see something like `Server running on port 5000` (or another port). If you see errors (e.g. `DATABASE_URL`, ECONNREFUSED), fix **server/.env** and **Restart** the app.
- **Note the port** (e.g. `5000`) shown for the app — you need it for the proxy.

### 2. Confirm the domain is proxied to that port

**lalnova.com** must send all traffic (including `/api/*` and OPTIONS) to the Node app. If the domain’s document root is **public_html** and the Node app lives in **public_html/Lalnova**, the domain is still serving from **public_html** by default, so `/api` never hits Node and you get 503.

Do one of the following:

- **Option A – Application URL**  
  In **Setup Node.js App**, edit your app and set **Application URL** to **https://lalnova.com** (or the domain that should show the app). Save. Many cPanel setups then create the proxy automatically. Test: open **https://lalnova.com/api/health** in a browser; you should get JSON, not 503.

- **Option B – .htaccess proxy**  
  If Option A doesn’t apply or doesn’t work, proxy manually. In **File Manager**, go to the **document root** of **lalnova.com** (usually **public_html**). Create or edit **.htaccess** so it contains only (replace `5000` with your app’s port):

  ```apache
  RewriteEngine On
  RewriteRule ^(.*)$ http://127.0.0.1:5000/$1 [P,L]
  ```

  Save. Test again: **https://lalnova.com/api/health** should return JSON.

### 3. Test from the server (optional)

In cPanel **Terminal**, from any directory run (use your app’s port):

```bash
curl -s http://127.0.0.1:5000/api/health
```

If you get JSON like `{"status":"OK",...}`, the Node app is fine and the problem is only the proxy (Step 2). If `curl` fails, the app isn’t listening or crashed — check the **Application log** and **server/.env**.

### 4. After fixing

Reload **https://lalnova.com** and **https://admin.lalnova.com** and try login again. OPTIONS to **https://lalnova.com/api/auth/login** should no longer return 503 once the proxy is correct.

---

## No “logs view” on the Node.js page – how to see what’s wrong

If your cPanel Node.js app page doesn’t show a log viewer, use one of these:

### 1. App log file (easiest after you deploy)

The server writes to a **log file** in production so you can open it in File Manager:

- **Path:** `public_html/Lalnova/server/logs/app.log`  
  (same as: **Application root** + `/server/logs/app.log`)

In **File Manager** go to **public_html** → **Lalnova** → **server** → **logs** → open **app.log**. You’ll see startup lines (e.g. “Server running on port …”) and each HTTP request. If the app crashes before listening, the last line may show an error.

### 2. cPanel Error Log for the domain

- In cPanel go to **Metrics** → **Errors** (or **Error Log**).
- Choose the domain (e.g. **lalnova.com**). This shows Apache/PHP errors; it won’t show Node.js stdout, but if the proxy or the site is misconfigured you might see relevant errors here.

### 3. Run the app manually in Terminal (to see startup errors)

Use the command cPanel shows at the top of the Node.js page to enter the environment and run the app by hand so you see all output (and any crash) in the terminal:

```bash
source /home/lalnovzd/nodevenv/public_html/Lalnova/22/bin/activate && cd /home/lalnovzd/public_html/Lalnova
node server/index.js
```

Leave this running and watch the terminal. You should see “Server running on port …”. If it crashes, the error will appear there (e.g. missing `DATABASE_URL`, DB connection failed). Press Ctrl+C to stop. Then fix **server/.env** or the database, and start the app again from the Node.js app page (**Restart**).

### 4. Test the app directly (is it the app or the proxy?)

In cPanel **Terminal** (with the same activate + cd as above), in another session or after starting the app:

```bash
curl -s http://127.0.0.1:5000/api/health
```

(Use the port your app uses.) If you get JSON, the Node app is running and the problem is likely the proxy for **lalnova.com**. If you get “Connection refused”, the app isn’t listening (crashed or wrong port).

---

## Step 7: Point the domain to the Node app (proxy)

Your site must be served by Node, not by Apache’s static files. Most cPanel Node.js setups do one of the following:

- **Option A – Built-in proxy**  
  When you set “Application URL” to your domain, cPanel may automatically proxy that domain to your Node port. If visiting `https://yourdomain.com` shows your app, you’re done.

- **Option B – .htaccess proxy**  
  If you have to use the document root (e.g. `public_html`), add an `.htaccess` in the **document root** of that domain with (adjust port if cPanel uses another):

  ```apache
  RewriteEngine On
  RewriteRule ^(.*)$ http://127.0.0.1:5000/$1 [P,L]
  ```

  Replace `5000` with the port your Node app uses. `[P,L]` requires `mod_proxy` and `mod_proxy_http` (usually enabled on cPanel).

- **Option C – Subdomain or subfolder**  
  Some hosts require the Node app to run on a subdomain (e.g. `app.yourdomain.com`). In that case set **Application URL** to that subdomain and use it as `CORS_ORIGIN` and for visiting the site.

---

## Step 8: HTTPS (SSL)

1. In cPanel, use **SSL/TLS** or **Let’s Encrypt** to issue a certificate for your domain.
2. Force HTTPS if desired (cPanel often has “Force HTTPS” or you can add redirect rules in .htaccess).

---

## Checklist summary

| # | Task |
|---|------|
| 1 | Create MySQL database and user in cPanel; note DATABASE_URL. |
| 2 | Set `.env` (NODE_ENV, PORT, DATABASE_URL, JWT_SECRET, CORS_ORIGIN); run `npm run build` (and optionally migrate/seed if DB is reachable). |
| 3 | Upload project (with `server/`, `client/build/`, `package.json`) to cPanel. |
| 4 | Create Node.js app in cPanel; set application root and startup file `server/index.js`; add env vars. |
| 5 | On server: `npm install` and **Start** only. Run **migrate + seed from your PC** (Step 5a); do not run Prisma on cPanel. |
| 6 | Start/restart the Node.js app and check logs. |
| 7 | Ensure domain is proxied to the Node app (cPanel proxy or .htaccess). |
| 8 | Install SSL and optionally force HTTPS. |

---

## If your host doesn’t support Node.js

- You’ll need a host that supports Node.js (e.g. VPS, or a cPanel host that includes “Setup Node.js App”).
- Alternatives: deploy backend to a Node-friendly service (e.g. Render, Railway) and host only the React build on cPanel as a static site; then set `REACT_APP_API_URL` to the backend URL and use the backend’s URL for API calls. Your current `client/.env.production` already uses an API URL pattern for that.

---

## Admin panel (admin.lalnova.com)

Your **admin** subdomain uses document root **/admin.lalnova.com**. To deploy it:

1. In the **admin** folder, set the API URL for production (e.g. in `.env.production` or build env):  
   `REACT_APP_API_URL=https://lalnova.com`
2. Build the admin app: `cd admin && npm run build`
3. In cPanel File Manager, go to **admin.lalnova.com** (document root).
4. Upload the **contents** of `admin/dist/` (e.g. `index.html`, `assets/`) into that folder—not the `dist` folder itself.
5. Ensure **lalnova.com** has SSL; then turn on **Force HTTPS Redirect** for **admin.lalnova.com** so the admin panel is served over HTTPS.

The API already allows CORS from `https://admin.lalnova.com` (see `CORS_ORIGIN` in `server/.env`).
