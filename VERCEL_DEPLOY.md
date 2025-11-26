# Deployment pe Vercel - Ghid Rapid

## ⚠️ IMPORTANT: SQLite nu funcționează pe Vercel!

Vercel are filesystem read-only, deci SQLite nu poate scrie. Trebuie să folosești o bază de date externă:

### Opțiuni:
1. **Vercel Postgres** (recomandat) - gratuit până la 256MB
2. **Turso** (SQLite cloud) - gratuit până la 500MB
3. **PlanetScale** (MySQL) - gratuit
4. **Supabase** (PostgreSQL) - gratuit

## Pași pentru Deployment:

### 1. Instalează Vercel CLI
```bash
npm i -g vercel
```

### 2. Login la Vercel
```bash
vercel login
```

### 3. Deploy
```bash
vercel
```

Sau deploy direct din GitHub:
- Push codul pe GitHub
- Mergi pe https://vercel.com
- Importă proiectul
- Configurează environment variables

### 4. Environment Variables în Vercel

După deploy, adaugă în Vercel Dashboard → Settings → Environment Variables:

```
AUTH_SECRET=your-secret-here
AUTH_URL=https://your-app.vercel.app
AUTH_TRUST_HOST=true
DATABASE_URL=your-database-url-here
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

### 5. Actualizează Make.com

După deploy, copiază URL-ul de la Vercel (ex: `https://vita-fit.vercel.app`) și folosește-l în Make.com:

```
https://vita-fit.vercel.app/api/plans/from-make
```

## Recomandare: Turso (SQLite Cloud)

Cel mai simplu pentru tine, pentru că folosești deja SQLite:

1. Mergi pe https://turso.tech
2. Creează cont
3. Creează database
4. Copiază connection string
5. Adaugă în Vercel ca `DATABASE_URL`

Turso e perfect pentru SQLite și funcționează perfect cu Prisma!

