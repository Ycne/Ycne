FROM oven/bun:1 AS base
WORKDIR /app
COPY package.json bun.lockb tsconfig.json ./
RUN bun install --frozen-lockfile
COPY prisma ./prisma
RUN bunx prisma generate
COPY src ./src
RUN bun run build

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=base /app/dist ./dist
COPY package.json .
RUN npm pkg set type="module" && npm i --omit=dev --no-audit --no-fund
EXPOSE 4000
CMD ["node", "dist/index.js"]
