# ComputerSales — isolated migration workspace

This workspace was assembled from the supplied Library backups. It is intentionally separate from the live site, production hosting, primary domain, DNS records, and original database.

## Included

- `frontend/`: newer supplied Next.js Pages Router source (Next.js 16 / React 19 package declarations), existing UI/assets, and Tailwind configuration.
- `backend/`: Django REST Framework project foundation with health and migration-status endpoints, PostgreSQL configuration, JWT authentication defaults, CORS configuration, and production WSGI/ASGI entry points.
- `docker-compose.dev.yml`: local-only PostgreSQL development instance bound to `127.0.0.1:5433`, with its own named volume.
- `docs/source-api-inventory.md`: route-module inventory derived from the existing Express source.
- `docs/MIGRATION-STATUS.md`: status and remaining compatibility work.

## Hard safety boundary

- No production hostname, domain, DNS, or hosting configuration is changed by this workspace.
- The frontend API base URL now uses `NEXT_PUBLIC_API_URL`, defaulting to `http://127.0.0.1:8000/api`.
- Do not copy a production `.env` file into this workspace.
- Do not point `DATABASE_URL` at the production database. Use the local dev database only.
- No database dump has been restored into any database by this setup step.
- The Django API is not yet a drop-in replacement for the original Express API. Do not point the live site at it.

## Local setup (Windows PowerShell)

Prerequisites: Node.js 20.9+ (Node 22 LTS recommended), Python 3.12, and Docker Desktop.

1. Start isolated PostgreSQL from the project root:

   ```powershell
   docker compose -f docker-compose.dev.yml up -d
   ```

2. Prepare Django:

   ```powershell
   cd backend
   Copy-Item .env.example .env
   py -3.12 -m venv .venv
   .\.venv\Scripts\Activate.ps1
   python -m pip install --upgrade pip
   pip install -r requirements.txt
   python manage.py migrate
   python manage.py runserver 127.0.0.1:8000
   ```

3. In a second PowerShell terminal, prepare frontend:

   ```powershell
   cd frontend
   Copy-Item .env.example .env.local
   npm install
   npm run dev
   ```

4. Open `http://localhost:3000` and test backend health at `http://127.0.0.1:8000/health/`.

The current Django endpoint `/api/migration-status/` explicitly reports that business API migration is in progress. That is deliberate: endpoint parity, data migration, auth semantics, payment flows, upload handling, and integration tests must be completed before this is a production replacement.

## Build check

From `frontend/`, run `npm run build`. A successful build has not yet been verified in this environment because installing Node packages requires registry access. Do not interpret the source archive's upgrade note as a successful build.
