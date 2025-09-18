# SAFE API Routes (MVP)

- GET /health
- POST /auth/register { email|phone, password, displayName }
- POST /auth/login { email|phone, password }
- GET /listings?q=&city=
- POST /listings (auth)
- GET /reservations (auth)
- POST /reservations (auth)
- GET /admin/users (auth, ADMIN)

Roadmap endpoints: payments (COD, BaridiMob, CIB/EDAHABIA via SATIM), logistics (Yalidine/ZR Express), chat websockets, reviews/ratings, wallet and escrow.
