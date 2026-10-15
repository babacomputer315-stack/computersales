# Migration status and acceptance checklist

## Source inspection

- [x] Extracted four Library backup files into an isolated workspace.
- [x] Identified newer and older Next.js frontend snapshots.
- [x] Identified Express + TypeScript + Drizzle ORM backend source.
- [x] Identified PostgreSQL custom-format backup archive.
- [x] Captured source route-module inventory.
- [x] Removed the hard-coded production API base URL from the copied frontend service clients; use `NEXT_PUBLIC_API_URL` instead.
- [x] Added isolated Django/DRF project configuration and health endpoint.
- [x] Added isolated local-only PostgreSQL Docker Compose configuration.
- [x] Added conservative PWA service worker that does not cache API/auth/cart/checkout responses.

## Not yet complete (must be done before production use)

- [ ] Restore the supplied PostgreSQL dump into a disposable local database and inspect schema/data/constraints.
- [ ] Map all source tables, enum types, relations, sequences, indexes, triggers, and data to Django models/migrations. Do not run a schema migration against production.
- [ ] Port every public/user/admin API route and match response formats, query filters, pagination, validation, sorting, and error handling.
- [ ] Port OTP registration/login, refresh/logout behavior and authorization roles; verify JWT compatibility or plan token re-login.
- [ ] Port payment provider callbacks and order lifecycle only with sandbox credentials and replay-safe tests.
- [ ] Port image/file storage and external integrations (SMS, payment, product feed providers) behind environment variables.
- [ ] Update frontend service methods and API payloads where Express and Django behavior differs.
- [ ] Add automated tests for critical flows: product list/detail/search, cart/checkout, order creation, auth, admin CRUD, media upload, coupons, payment sandbox callbacks.
- [ ] Run frontend lint/build and backend tests in a network-enabled environment; record exact versions and results.
- [ ] Configure a separate staging deployment and separate staging domain only after local acceptance. Never change primary domain/DNS as part of this migration.

## Source route prefixes observed

- `/api/admin`
- `/api/auth`
- `/api/user`
- `/list`
- `/torob`

The complete route-module checklist is in `source-api-inventory.md`.
