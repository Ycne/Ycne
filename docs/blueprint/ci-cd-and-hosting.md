# CI/CD & Hosting

## Frontend (apps/web)
- Build with Bun on GitHub Actions.
- Deploy to Vercel or Static hosting (Netlify, Cloudflare Pages). PWA enabled with service worker and manifest.

## Backend (apps/api)
- Containerize with Docker. Deploy to AWS ECS/Fargate or DigitalOcean App Platform.
- Postgres (AWS RDS/DigitalOcean Managed), Redis optional.
- Use GitHub Actions for CI (typecheck, lint, prisma generate). CD via environment secrets.

## Workflows
- `.github/workflows/web-ci.yml` and `api-ci.yml` run on push/PR.
- Caching for bun and prisma.

## Scalability Notes
- Modular monolith with clear boundaries; later extract payments/logistics as services.
- Use read replicas on Postgres as traffic grows.
- CDN for static assets and image optimization.
