# Node.js + Express TypeScript API

Interview-oriented REST API: TypeScript, Express 5, Sequelize/MySQL, Zod, JWT + Google auth, Redis cache, BullMQ jobs, and pluggable uploads.

## Setup

```powershell
copy .env.example .env
npm install
```

Set MySQL credentials in `.env`. If you previously ran the old JavaScript migrations, use a fresh database (or drop the old tables) so the TypeScript schema can be created, then:

```powershell
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
npm run dev
```

Seeded accounts:

- Admin: `admin@example.com` / `Admin@12345`
- User: `user@example.com` / `User@12345`

If Redis is down, the API still starts. Cache and BullMQ are skipped with a warning.

## Scripts

- `npm run dev` — `tsx watch src/server.ts`
- `npm run build` / `npm start`
- `npm run typecheck`
- `npm run db:migrate` / `npm run db:seed`

## Verify flow

1. `npm run typecheck`
2. Stop MySQL and run `npm run dev` — you should see `Database connection failed`.
3. Start MySQL, migrate, seed, run `npm run dev` — you should see `Database connected (...)`.
4. `GET http://localhost:5000/health` and `GET /health/ready`
5. `POST /api/v1/auth/register` then `login`, `refresh`, `logout`
6. `GET /api/v1/posts?page=1&limit=10&sort=createdAt:desc&search=Welcome`
7. Authenticated `POST /api/v1/posts`, then `PUT` vs `PATCH`, then `DELETE`
8. `GET /unknown-route` → 404
9. Repeat login quickly → 429
10. `POST /api/v1/uploads` with `file` (multipart) while authenticated
11. `POST /api/v1/auth/forgot-password` — worker/log shows the queued email (reset token in the message in development)

Google: `POST /api/v1/auth/google` with `{ "idToken": "..." }` after setting `GOOGLE_CLIENT_ID`.

Uploads: `STORAGE_PROVIDER=local|cloudinary|s3`. Local files are served from `/uploads`.
