HMAC-SHA-256 Educational Platform

MAT 364 Cryptography — SDU University, 2026  
Team members:  Nurdanbek Kanat, Kuanishkerey Abdolla, Satzhan Kadir, Bagdat Ingkar, Gulnaz Makuova

---

Project structure

```
hmac_project/
├── backend/
│   ├── __init__.py
│   ├── app.py            ← Flask entry point
│   ├── routes.py         ← REST API endpoints
│   ├── models.py         ← SQLAlchemy ORM (User, HashHistory)
│   └── crypto_service.py ← HMAC computation + step breakdown
├── static/
│   ├── css/styles.css
│   └── js/
│       ├── i18n.js       ← EN / RU language system
│       ├── crypto.js     ← Web Crypto API helpers
│       ├── visualization.js
│       ├── practice.js
│       └── main.js
├── templates/
│   └── index.html
├── .env.example
├── requirements.txt
└── README.md
```

---

  1 – Run locally in VSCode

Step 1 – Open the project
```
File → Open Folder → select hmac_project/
```

Step 2 – Create a virtual environment
Open the VSCode terminal (`Ctrl + ~`) and run:
```bash
python -m venv venv
```

Activate it:
- **Windows:**   `venv\Scripts\activate`
- **macOS/Linux:**  `source venv/bin/activate`

You should see `(venv)` in your terminal prompt.

Step 3 – Install dependencies
```bash
pip install -r requirements.txt
```

Step 4 – Set up environment variables
```bash
# Windows
copy .env.example .env

# macOS/Linux
cp .env.example .env
```
Open `.env` and change `SECRET_KEY` and `JWT_SECRET_KEY` to any random strings.

Step 5 – Run the server
```bash
python -m backend.app
```

The terminal will show:
```
 * Running on http://127.0.0.1:5000
```
Open **http://localhost:5000** in your browser. ✅

Step 6 – Stop the server
Press `Ctrl + C` in the terminal.

---

  2 – Editing code in VSCode

| What to change | File to open |
|---|---|
| Page layout / HTML | `templates/index.html` |
| Colors, fonts, layout | `static/css/styles.css` |
| Language strings (EN/RU) | `static/js/i18n.js` |
| HMAC computation (frontend) | `static/js/crypto.js` |
| Step-by-step visualization | `static/js/visualization.js` |
| Practice exercises | `static/js/practice.js` |
| General frontend logic | `static/js/main.js` |
| API endpoints | `backend/routes.py` |
| Database models | `backend/models.py` |
| HMAC backend logic | `backend/crypto_service.py` |

**Useful VSCode extensions to install:**
- Python (Microsoft)
- Pylance
- SQLite Viewer (to inspect the database file)
- Live Server (for editing HTML/CSS without a backend)

---

  3 – API Endpoints reference

| Method | URL | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | – | Register new user |
| POST | `/api/auth/login` | – | Login, returns JWT token |
| POST | `/api/hmac/generate` | optional | Compute HMAC-SHA-256 |
| POST | `/api/hmac/verify` | optional | Verify HMAC |
| POST | `/api/hmac/steps` | – | Get step-by-step breakdown |
| GET | `/api/history` | ✅ JWT | Get user history |
| DELETE | `/api/history/<id>` | ✅ JWT | Delete history record |
| GET | `/api/test-vector` | – | RFC 2104 test vector |
| GET | `/api/health` | – | Health check |

**Send JWT in header:**
```
Authorization: Bearer <token>
```

---

  4 – Make the site public (deployment)

  # Option A – Render.com (FREE, recommended for students)

1. Push your project to **GitHub** (create a repo, upload all files).
2. Go to **https://render.com** → sign up with your GitHub account.
3. Click **New → Web Service** → select your repository.
4. Set these values:
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `gunicorn "backend.app:create_app()"`
   - **Environment:** Python 3
5. Under **Environment Variables**, add:
   - `SECRET_KEY` = (random long string)
   - `JWT_SECRET_KEY` = (another random long string)
   - `DATABASE_URL` = (Render provides a free PostgreSQL URL — see below)
6. Add a free **PostgreSQL database**: New → PostgreSQL → copy the "Internal Database URL" into `DATABASE_URL`.
7. Click **Deploy**. In 2–3 minutes your site is live at `https://your-app.onrender.com`.

> ⚠️ Free Render instances sleep after 15 min of inactivity. For ~25 active users this is fine.

---

  # Option B – Railway.app (also free for small projects)

1. Push to GitHub.
2. Go to **https://railway.app** → New Project → Deploy from GitHub.
3. Add a **PostgreSQL plugin** from the dashboard.
4. Set environment variables (same as above).
5. Railway auto-detects Python and runs `gunicorn`.

---

  # Option C – VPS (DigitalOcean / Hetzner) — most control

1. Rent a server (Hetzner has €3.29/mo servers).
2. SSH into the server, clone your repo.
3. Install Python, Nginx, PostgreSQL.
4. Run with gunicorn:
   ```bash
   gunicorn -w 4 -b 0.0.0.0:5000 "backend.app:create_app()"
   ```
5. Point Nginx to port 5000.
6. Add a free SSL certificate with Let's Encrypt:
   ```bash
   sudo certbot --nginx
   ```

---

  5 – Switch from SQLite to PostgreSQL

1. Install psycopg2: `pip install psycopg2-binary`
2. In `.env` change:
   ```
   DATABASE_URL=postgresql://user:password@localhost:5432/hmac_db
   ```
3. Restart the server — tables are created automatically.

---

  6 – RFC 2104 Test Vector

| Field | Value |
|---|---|
| Key | `key` |
| Message | `The quick brown fox jumps over the lazy dog` |
| Expected HMAC | `f7bc83f430538424b13298e6aa6fb143ef4d59a14946175997479dbc2d1a3cd8` |

---

  7 – Recommended workflow for the team

```
main branch      → always working, deployed version
feature/xxx      → each person works in their own branch
Pull Request     → review → merge into main
```

**Daily workflow:**
```bash
git pull origin main          # get latest changes
git checkout -b feature/my-fix
# make changes in VSCode
git add .
git commit -m "describe what you changed"
git push origin feature/my-fix
# open Pull Request on GitHub
```
