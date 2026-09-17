# Database

Firm Expo uses [Prisma](https://www.prisma.io/) as its ORM. The schema lives
in `prisma/schema.prisma` — that file is the source of truth, not anything
in this folder.

## First-time setup

1. Copy the env file and fill in your MySQL connection string:
   ```
   cp .env.example .env
   ```
   `DATABASE_URL="mysql://user:password@localhost:3306/firm_expo"`

2. Create the database if it doesn't exist yet:
   ```
   mysql -u root -p -e "CREATE DATABASE firm_expo CHARACTER SET utf8mb4;"
   ```

3. Install dependencies (this also runs `prisma generate` via `postinstall`):
   ```
   npm install
   ```

4. Push the schema to the database:
   ```
   npm run db:push
   ```
   Or, if you want tracked migration files instead:
   ```
   npm run db:migrate
   ```

## Useful commands

- `npm run db:studio` — opens Prisma Studio, a browser GUI for viewing and
  editing the `subscribers` table.
- `npx prisma generate` — regenerate the Prisma Client after changing
  `prisma/schema.prisma` (runs automatically on `npm install`).

## Handy queries (via Prisma Studio or a MySQL client)

- Newest signups: `SELECT name, email, phone, industry, created_at FROM subscribers ORDER BY created_at DESC LIMIT 50;`
- Signups by industry: `SELECT industry, COUNT(*) AS total FROM subscribers GROUP BY industry ORDER BY total DESC;`
