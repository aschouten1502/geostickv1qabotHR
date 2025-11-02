# 🚀 Deployment Guide - GeoStick HR QA Bot

Complete guide voor het deployen van de GeoStick HR QA Bot naar productie.

---

## 📋 Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Vercel Deployment (Aanbevolen)](#vercel-deployment)
3. [Netlify Deployment](#netlify-deployment)
4. [Docker Deployment](#docker-deployment)
5. [Environment Variables](#environment-variables)
6. [Database Setup](#database-setup)
7. [Post-Deployment](#post-deployment)
8. [Monitoring & Maintenance](#monitoring)
9. [Troubleshooting](#troubleshooting)

---

## Pre-Deployment Checklist

Voordat je deploy naar productie:

### ✅ Code & Dependencies

- [ ] `npm run build` succesvol lokaal
- [ ] `npm run lint` geen errors
- [ ] Alle environment variables gedocumenteerd in `.env.example`
- [ ] `.gitignore` bevat `.env.local`, `node_modules`, `.next`
- [ ] Geen hardcoded API keys in code
- [ ] TypeScript errors opgelost

### ✅ API Keys & Services

- [ ] **Pinecone**: Production API key verkregen
- [ ] **Pinecone Assistant**: HR documenten geüpload en getest
- [ ] **OpenAI**: Production API key met voldoende credits
- [ ] **Supabase**: Production project aangemaakt
- [ ] **Supabase**: Database schema geïnstalleerd via `001_initial_schema.sql`

### ✅ Testing

- [ ] Chat functionaliteit werkt lokaal
- [ ] Alle talen getest (minimaal NL, EN, DE)
- [ ] Error handling getest (offline, rate limits, content filters)
- [ ] Citations verschijnen correct
- [ ] Costs worden correct berekend
- [ ] Supabase logging werkt

### ✅ Security

- [ ] Service role keys alleen server-side gebruikt
- [ ] Geen credentials in git committed
- [ ] Content filters getest
- [ ] Input validation geïmplementeerd

---

## Vercel Deployment

**Aanbevolen** voor Next.js applicaties - makkelijk, snel, gratis tier beschikbaar.

### Stap 1: Vercel Account

1. Ga naar [vercel.com](https://vercel.com)
2. Sign up met GitHub/GitLab/Bitbucket account
3. Verifieer je email

### Stap 2: Project Koppelen

#### Via CLI (snelst)

```bash
# Installeer Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy (eerste keer)
vercel

# Volg de prompts:
# - Set up and deploy? Y
# - Which scope? (kies je account/team)
# - Link to existing project? N
# - Project name? geostick-hr-qabot
# - In which directory is your code? ./
# - Auto-detect project settings? Y
# - Override settings? N
```

#### Via Dashboard (visual)

1. Ga naar [vercel.com/new](https://vercel.com/new)
2. Klik **"Import Project"**
3. Kies je Git repository (GitHub/GitLab)
4. Select de `geostickverkoophrqabot` folder als root
5. Framework Preset: **Next.js** (auto-detected)
6. Klik **"Deploy"** (zonder env vars - voegen we zo toe)

### Stap 3: Environment Variables

1. Ga naar je project dashboard op Vercel
2. Klik **Settings** → **Environment Variables**
3. Voeg de volgende variabelen toe:

**Production Environment:**

| Name | Value | Environment |
|------|-------|-------------|
| `PINECONE_API_KEY` | `pcsk_xxx...` | Production |
| `PINECONE_ASSISTANT_NAME` | `geostick-hr-assistant` | Production |
| `OPENAI_API_KEY` | `sk-proj-xxx...` | Production |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxx.supabase.co` | Production |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOi...` | Production |

**Let op**: Vink **Production**, **Preview**, en **Development** aan als je wilt dat alle environments dezelfde keys gebruiken. Of maak aparte keys per environment.

### Stap 4: Redeploy

1. Ga naar **Deployments** tab
2. Klik op de laatste deployment
3. Klik **"..."** menu → **"Redeploy"**
4. Wacht tot deployment succesvol is (groen vinkje)

### Stap 5: Verifieer

1. Open je deployment URL (bijv. `https://geostick-hr-qabot.vercel.app`)
2. Stel een test vraag
3. Check browser console voor errors
4. Verifieer dat Supabase logs binnenkomen

### Production URL

Na eerste deployment krijg je een URL:
- **Preview**: `https://geostick-hr-qabot-git-main-username.vercel.app`
- **Production**: `https://geostick-hr-qabot.vercel.app`

### Custom Domain (optioneel)

1. Ga naar **Settings** → **Domains**
2. Voeg je eigen domain toe (bijv. `hr-bot.geostick.nl`)
3. Update DNS records volgens Vercel instructies
4. Wacht op SSL certificaat (automatisch)

### CLI Deploy Updates

Voor toekomstige updates:

```bash
# Development preview
vercel

# Production deployment
vercel --prod
```

---

## Netlify Deployment

Alternatief voor Vercel.

### Stap 1: Netlify Account

1. Ga naar [netlify.com](https://www.netlify.com)
2. Sign up / Login met Git provider

### Stap 2: New Site

1. Klik **"Add new site"** → **"Import an existing project"**
2. Kies Git provider
3. Select repository
4. Configure:
   - **Base directory**: `geostickverkoophrqabot`
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`

### Stap 3: Environment Variables

1. Ga naar **Site settings** → **Build & deploy** → **Environment**
2. Klik **"Edit variables"**
3. Voeg alle env vars toe (zie Vercel sectie)

### Stap 4: Deploy

1. Klik **"Deploy site"**
2. Wacht op build (3-5 minuten)
3. Open preview URL

---

## Docker Deployment

Voor self-hosted deployments (VPS, cloud servers).

### Dockerfile

Maak een `Dockerfile` in de project root:

```dockerfile
# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci

# Copy source
COPY . .

# Build
RUN npm run build

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy built files
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

CMD ["npm", "start"]
```

### docker-compose.yml

Voor makkelijk beheer:

```yaml
version: '3.8'

services:
  geostick-hr-bot:
    build: .
    ports:
      - "3000:3000"
    environment:
      - PINECONE_API_KEY=${PINECONE_API_KEY}
      - PINECONE_ASSISTANT_NAME=${PINECONE_ASSISTANT_NAME}
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
      - SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000"]
      interval: 30s
      timeout: 10s
      retries: 3
```

### Deploy Commands

```bash
# Build image
docker build -t geostick-hr-bot .

# Run container
docker run -d \
  --name geostick-hr-bot \
  -p 3000:3000 \
  --env-file .env.production \
  geostick-hr-bot

# Or with docker-compose
docker-compose up -d

# Check logs
docker logs -f geostick-hr-bot

# Stop
docker stop geostick-hr-bot
```

### Reverse Proxy (Nginx)

Voor HTTPS en custom domain:

```nginx
server {
    listen 80;
    server_name hr-bot.geostick.nl;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## Environment Variables

### Verplichte Variabelen

```bash
# Pinecone
PINECONE_API_KEY=           # API key van Pinecone dashboard
PINECONE_ASSISTANT_NAME=    # Naam van je assistant (exact!)

# OpenAI
OPENAI_API_KEY=             # API key van OpenAI platform
```

### Optionele Variabelen (Aanbevolen)

```bash
# Supabase (voor logging/analytics)
NEXT_PUBLIC_SUPABASE_URL=         # Public URL
SUPABASE_SERVICE_ROLE_KEY=        # Service role key (server-side only!)
```

### Development vs Production

Gebruik verschillende keys per environment:

**.env.local** (Development):
```bash
PINECONE_ASSISTANT_NAME=geostick-hr-assistant-dev
OPENAI_API_KEY=sk-proj-dev...
NEXT_PUBLIC_SUPABASE_URL=https://dev-project.supabase.co
```

**.env.production** (Production):
```bash
PINECONE_ASSISTANT_NAME=geostick-hr-assistant-prod
OPENAI_API_KEY=sk-proj-prod...
NEXT_PUBLIC_SUPABASE_URL=https://prod-project.supabase.co
```

---

## Database Setup

### Supabase Production Database

1. **Nieuw project aanmaken**:
   - Ga naar [supabase.com](https://supabase.com)
   - Klik "New Project"
   - Naam: `geostick-hr-bot-production`
   - Region: `Europe West (London)` voor EU
   - Plan: Free tier voor starten, Pro ($25/maand) voor productie traffic

2. **Schema installeren**:
   ```sql
   -- Run in Supabase SQL Editor
   -- Copy-paste volledige inhoud van:
   -- lib/supabase/migrations/001_initial_schema.sql
   ```

3. **Verifieer**:
   ```sql
   -- Check of table bestaat
   SELECT COUNT(*) FROM "Geostick_Logs_Data_QABOTHR";

   -- Check view
   SELECT * FROM request_analytics LIMIT 1;
   ```

4. **API Keys**:
   - Ga naar Settings → API
   - Kopieer `URL` en `service_role` key
   - Voeg toe aan deployment platform (Vercel/Netlify/Docker)

### Backups

**Free tier**: Geen automatische backups

**Pro plan ($25/maand)**:
- Dagelijkse automatische backups
- Point-in-time recovery
- 7 dagen retention

**Manuele backup (Free tier)**:

```bash
# Installeer supabase CLI
npm install -g supabase

# Login
supabase login

# Dump database
supabase db dump --project-ref YOUR_PROJECT_ID > backup.sql

# Restore (indien nodig)
psql -h db.xxx.supabase.co -U postgres < backup.sql
```

---

## Post-Deployment

### Direct na deployment

1. **Smoke test**:
   ```
   ✅ Open production URL
   ✅ Stel 3 test vragen (NL, EN, DE)
   ✅ Check citations verschijnen
   ✅ Verifieer costs in console
   ```

2. **Check Supabase**:
   ```
   ✅ Ga naar Supabase Table Editor
   ✅ Open Geostick_Logs_Data_QABOTHR
   ✅ Zie je de test vragen?
   ```

3. **Monitor APIs**:
   ```
   ✅ Pinecone dashboard: API calls tellen
   ✅ OpenAI dashboard: Usage tracking
   ✅ Supabase dashboard: Database size
   ```

### Eerste week

- **Dagelijks**: Check error logs in Supabase
  ```sql
  SELECT * FROM "Geostick_Logs_Data_QABOTHR"
  WHERE event_type = 'error'
  ORDER BY timestamp DESC;
  ```

- **Dagelijks**: Monitor costs
  ```sql
  SELECT DATE(timestamp) AS date,
         ROUND(SUM(total_cost)::NUMERIC, 4) AS daily_cost
  FROM "Geostick_Logs_Data_QABOTHR"
  GROUP BY DATE(timestamp)
  ORDER BY date DESC
  LIMIT 7;
  ```

- **Wekelijks**: Review meest gestelde vragen
  ```sql
  SELECT question, COUNT(*) AS times_asked
  FROM "Geostick_Logs_Data_QABOTHR"
  WHERE event_type = 'chat_request'
  GROUP BY question
  HAVING COUNT(*) > 1
  ORDER BY times_asked DESC
  LIMIT 20;
  ```

### Alerts Instellen (Optioneel)

**Supabase Edge Function** voor email alerts:

```typescript
// supabase/functions/daily-report/index.ts
import { serve } from 'https://deno.land/std/http/server.ts';

serve(async (req) => {
  // Haal dagelijkse stats op
  const { data, error } = await supabaseClient
    .from('Geostick_Logs_Data_QABOTHR')
    .select('*')
    .gte('timestamp', 'today');

  const totalCost = data?.reduce((sum, log) => sum + log.total_cost, 0);

  // Stuur email als kosten > $5/dag
  if (totalCost > 5) {
    await sendEmail({
      to: 'admin@geostick.nl',
      subject: '⚠️ High costs alert',
      body: `Daily cost: $${totalCost.toFixed(2)}`
    });
  }

  return new Response('OK', { status: 200 });
});
```

Schedule via Supabase Cron:
```sql
SELECT cron.schedule(
  'daily-cost-alert',
  '0 18 * * *', -- 6pm daily
  'https://xxx.supabase.co/functions/v1/daily-report'
);
```

---

## Monitoring

### Key Metrics

Monitor deze metrics wekelijks:

1. **Usage**:
   - Aantal requests per dag
   - Unieke sessies per dag
   - Gemiddelde gesprekken per sessie

2. **Costs**:
   - Dagelijkse kosten
   - Kosten per request
   - Pinecone vs OpenAI verdeling

3. **Performance**:
   - Gemiddelde response tijd
   - Slowest queries (> 5 seconden)
   - Error rate percentage

4. **Quality**:
   - Content filter rate
   - Error categorieën
   - Meest gestelde vragen

### Monitoring Tools

**Optie 1: Supabase SQL Queries**
- Gebruik queries uit [SUPABASE_ANALYTICS.md](./SUPABASE_ANALYTICS.md)
- Run wekelijks en bewaar in Excel/Google Sheets

**Optie 2: Metabase** (Gratis, visual)
1. Installeer Metabase: [metabase.com](https://www.metabase.com)
2. Connect met Supabase (PostgreSQL)
3. Maak dashboards met visualisaties

**Optie 3: Grafana** (Advanced)
1. Installeer Grafana + Prometheus
2. Export metrics via API
3. Real-time dashboards

---

## Troubleshooting

### 🔴 Build Failures

**Error**: `Module not found: Can't resolve '@/lib/...'`

**Oplossing**:
```bash
# Check tsconfig.json paths
# Verifieer dat "@/*" mapped is naar "./*"
```

**Error**: `Type error: X is not assignable to Y`

**Oplossing**:
```bash
npm run lint
# Fix alle TypeScript errors
```

---

### 🔴 Runtime Errors

**Error**: "Missing environment variables"

**Oplossing**:
1. Check deployment platform environment variables
2. Verifieer key namen (exacte match met code)
3. Redeploy na toevoegen variables

**Error**: "Failed to connect to Pinecone"

**Oplossing**:
1. Verifieer API key is correct
2. Check Pinecone dashboard voor API status
3. Test API key lokaal eerst

**Error**: "OpenAI rate limit exceeded"

**Oplossing**:
1. Ga naar OpenAI dashboard → Limits
2. Verhoog rate limit of upgrade plan
3. Implementeer rate limiting in app (toekomstig)

---

### 🔴 Database Issues

**Supabase "relation does not exist"**

**Oplossing**:
```sql
-- Run in SQL Editor
SELECT tablename FROM pg_tables
WHERE tablename = 'Geostick_Logs_Data_QABOTHR';

-- Als empty: run 001_initial_schema.sql opnieuw
```

**Supabase "permission denied"**

**Oplossing**:
```sql
-- Check RLS is disabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE tablename = 'Geostick_Logs_Data_QABOTHR';

-- If rowsecurity = true:
ALTER TABLE "Geostick_Logs_Data_QABOTHR"
DISABLE ROW LEVEL SECURITY;
```

---

## Rollback Plan

Als productie deployment mislukt:

### Vercel

```bash
# List deployments
vercel ls

# Rollback to previous
vercel rollback [deployment-url]
```

### Netlify

1. Ga naar Deploys
2. Klik op vorige succesvolle deployment
3. Klik "Publish deploy"

### Docker

```bash
# Stop current
docker stop geostick-hr-bot

# Start previous version
docker run -d \
  --name geostick-hr-bot \
  geostick-hr-bot:previous-tag
```

---

## Cost Optimization

### Tips om kosten te verlagen

1. **Pinecone**:
   - Verlaag `topK` van 3 naar 2 in `lib/pinecone.ts` (-33% tokens)
   - Monitor hourly rate ($0.05/uur = $36/maand)

2. **OpenAI**:
   - Gebruik `gpt-4o-mini` in plaats van `gpt-4o` (90% goedkoper!)
   - Verlaag max_tokens als antwoorden te lang zijn
   - Cache frequent gestelde vragen (toekomstig)

3. **Supabase**:
   - Archive oude data (> 90 dagen) naar cold storage
   - Free tier = 500MB (genoeg voor ~500k logs)
   - Upgrade naar Pro ($25/maand) alleen als nodig

---

## Security Checklist

Voor productie:

- [ ] Alle API keys via environment variables (niet hardcoded)
- [ ] `.env.local` niet in git
- [ ] HTTPS enabled (automatisch via Vercel/Netlify)
- [ ] CORS configured correct (Next.js default is safe)
- [ ] Rate limiting overwogen (toekomstig via middleware)
- [ ] Supabase service_role key alleen server-side
- [ ] Content filters getest en actief
- [ ] Error messages niet te veel details lekken
- [ ] Logging bevat geen sensitive data (wachtwoorden, etc.)

---

## Support & Contact

Bij vragen over deployment:

- **Vercel**: [vercel.com/docs](https://vercel.com/docs)
- **Netlify**: [docs.netlify.com](https://docs.netlify.com)
- **Supabase**: [supabase.com/docs](https://supabase.com/docs)
- **Docker**: [docs.docker.com](https://docs.docker.com)

Project-specifieke vragen: Zie [README.md](./README.md) → Support sectie

---

**Deployment Version**: 1.0
**Last Updated**: 2025-01-29
**Status**: ✅ Production Ready

---

Happy deploying! 🚀
