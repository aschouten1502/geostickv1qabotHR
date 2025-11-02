# GeoStick HR Q&A Bot - Production Ready (Verkoop Versie)

Een intelligente HR assistent voor GeoStick die vragen beantwoordt over HR-beleid, procedures en arbeidsvoorwaarden op basis van RAG (Retrieval-Augmented Generation).

**Let op**: De folder heet "verkoop" omdat dit de productie-versie is die verkocht wordt aan GeoStick. Het is GEEN sales assistant, maar een **HR Q&A bot**.

## Overzicht

Deze applicatie gebruikt:
- **Next.js 15** - Modern React framework
- **Pinecone Assistant** - Vector database voor documentopslag en retrieval
- **OpenAI GPT-4o** - Large Language Model voor intelligente antwoorden
- **Supabase** - PostgreSQL database voor logging en analytics
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Modern styling

## Functionaliteit

- ✅ Chat interface voor HR-gerelateerde vragen (12 talen)
- ✅ Real-time cost tracking (Pinecone + OpenAI)
- ✅ Bronvermelding met paginanummers
- ✅ Session tracking & statistieken
- ✅ Developer dashboard met usage metrics
- ✅ Strikte guardrails tegen hallucinatie
- ✅ Supabase logging voor analytics
- ✅ Error tracking en categorisatie
- ✅ Content filter detectie
- 🔜 Feedback functionaliteit (thumbs up/down)

## Installatie

### 1. Clone of kopieer het project

```bash
cd geostickverkoophrqabot
```

### 2. Installeer dependencies

```bash
npm install
```

### 3. Configureer environment variables

Kopieer `.env.example` naar `.env.local`:

```bash
cp .env.example .env.local
```

Vul de volgende waarden in:

```env
# Pinecone Configuration - Production HR Bot
PINECONE_API_KEY=your_pinecone_api_key_here
PINECONE_ASSISTANT_NAME=geostick-hr-assistant

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Supabase Configuration (Optional - voor logging/analytics)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
```

**Note**: Supabase is optioneel. Als je geen Supabase configureert, werkt de chat gewoon maar worden logs alleen naar de console geschreven.

### 4. Start development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in je browser.

## Pinecone Assistant Setup

### Vereisten

1. **Pinecone Account**: Maak een account aan op [pinecone.io](https://www.pinecone.io)
2. **API Key**: Genereer een API key in de Pinecone console
3. **Assistant aanmaken**:
   - Ga naar Pinecone Console → Assistants
   - Klik op "Create Assistant"
   - Naam: `geostick-hr-assistant`
   - Upload HR documentatie (PDFs, Word docs, etc.)

### Ondersteunde documenttypes

- PDF bestanden
- Word documenten (.docx)
- Markdown (.md)
- Tekstbestanden (.txt)

### Documentatie voorbereiden

Upload de volgende HR documentatie naar je Pinecone Assistant:

- CAO documenten
- Verzuimprotocollen
- Verlofregeling
- Arbeidsvoorwaarden
- HR handboek
- Benefits informatie
- HR beleid documenten

## Production Deployment

### Build voor productie

```bash
npm run build
npm start
```

### Environment variables voor productie

Zorg dat alle environment variables correct zijn ingesteld:
- `PINECONE_API_KEY` - Je productie Pinecone API key
- `PINECONE_ASSISTANT_NAME` - Naam van je productie assistant
- `OPENAI_API_KEY` - Je productie OpenAI API key

### Deployment platforms

Deze applicatie kan worden gedeployed op:
- **Vercel** (aanbevolen voor Next.js)
- **Netlify**
- **AWS Amplify**
- **Docker** (zie Dockerfile sectie hieronder)

#### Vercel Deployment

```bash
# Installeer Vercel CLI
npm i -g vercel

# Deploy
vercel

# Voor productie
vercel --prod
```

Voeg environment variables toe via Vercel Dashboard → Settings → Environment Variables.

## Kosten

De applicatie tracked automatisch de kosten:

### Pinecone
- **Context retrieval**: $5 per 1M tokens
- **Hosting**: $0.05 per uur (niet meegeteld in per-request kosten)

### OpenAI GPT-4o
- **Input tokens**: $2.50 per 1M tokens
- **Output tokens**: $10 per 1M tokens

De developer sidebar toont real-time sessie kosten.

## Architectuur

### RAG Flow

```
User Query
    ↓
API Route (/api/chat)
    ↓
Pinecone Assistant (topK=3)
    ↓
Context + System Prompt
    ↓
OpenAI GPT-4o
    ↓
Response + Citations
```

### Belangrijke bestanden

- `app/page.tsx` - Frontend chat interface
- `app/api/chat/route.ts` - Backend RAG logica
- `app/layout.tsx` - Root layout + metadata
- `CLAUDE.md` - Developer instructies voor Claude Code

## System Prompt

De bot heeft strikte guardrails:
- Antwoordt ALLEEN uit retrieved context
- Maakt NOOIT aannames
- Verwijst naar sales team bij onzekerheid
- Weigert off-topic vragen
- Gebruikt plain text (geen markdown)

## Development

### Scripts

```bash
npm run dev    # Start development server
npm run build  # Build voor productie
npm start      # Start productie server
npm run lint   # Run ESLint
```

### Code Quality

- TypeScript strict mode enabled
- ESLint configuratie voor Next.js
- Type-safe API routes
- Proper error handling

## Troubleshooting

### "Missing environment variables"

Controleer of `.env.local` bestaat en alle keys bevat:
```bash
PINECONE_API_KEY
PINECONE_ASSISTANT_NAME
OPENAI_API_KEY
```

### "Assistant not found"

Verifieer dat de `PINECONE_ASSISTANT_NAME` exact overeenkomt met de naam in Pinecone Console.

### "Content filter error"

OpenAI content filters kunnen bepaalde queries blokkeren. Dit wordt automatisch gedetecteerd en user-friendly weergegeven.

### Build errors

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Clear Next.js cache
rm -rf .next
npm run build
```

## Supabase Integration

Supabase is volledig geïntegreerd voor logging en analytics. Zie **[docs/SUPABASE.md](./SUPABASE.md)** voor:

### Wat wordt er gelogd?
- ✅ Alle chat requests met vraag, antwoord, timing
- ✅ Cost tracking (Pinecone + OpenAI per request)
- ✅ Session tracking (unieke gebruikers)
- ✅ Error logs met categorisatie
- ✅ Content filter events
- ✅ Citations en bronnen
- 🔜 User feedback (helpful/not helpful)

### Quick Start

1. **Maak Supabase project aan**: [supabase.com](https://supabase.com)
2. **Run database schema**: Kopieer `lib/supabase/migrations/001_initial_schema.sql` naar SQL Editor
3. **Voeg credentials toe**: Update `.env.local` met Supabase URL + service key
4. **Start app**: Logs verschijnen automatisch in Supabase!

### Analytics

Zie **[docs/SUPABASE_ANALYTICS.md](./SUPABASE_ANALYTICS.md)** voor handige queries:
- 💰 Kosten per dag/week/maand
- ⚡ Performance metrics (response tijden)
- 👥 Meest gestelde vragen
- ❌ Error rates en categorieën
- 📊 Daily/weekly/monthly reports

### Database

**Table**: `Geostick_Logs_Data_QABOTHR`
**View**: `request_analytics` (pre-built daily stats)

Complete documentatie: [docs/SUPABASE.md](./SUPABASE.md)

## Security

- API keys nooit in code committen
- `.env.local` in `.gitignore`
- Environment variables via deployment platform
- Content filter protection
- Input validation

## Documentation

- **[CLAUDE.md](./CLAUDE.md)** - Developer instructions voor Claude Code
- **[PROJECT_STRUCTURE.md](../PROJECT_STRUCTURE.md)** - Complete code structuur uitleg
- **[SUPABASE.md](./SUPABASE.md)** - Database setup en logging
- **[SUPABASE_ANALYTICS.md](./SUPABASE_ANALYTICS.md)** - SQL queries voor analytics
- **[SETUP_CHECKLIST.md](./SETUP_CHECKLIST.md)** - Stap-voor-stap setup checklist

## Support

Voor vragen of problemen:
- **Development**: Check [CLAUDE.md](./CLAUDE.md) voor development guidance
- **Database**: Zie [SUPABASE.md](./SUPABASE.md) voor troubleshooting
- **Structure**: Lees [PROJECT_STRUCTURE.md](../PROJECT_STRUCTURE.md) voor code uitleg
- **Logs**: Review console logs voor debugging
- **APIs**: Controleer Pinecone/OpenAI/Supabase dashboards voor API status

## License

Proprietary - GeoStick Internal Use Only

---

**Versie**: 1.0.0
**Status**: Production Ready
**Laatst bijgewerkt**: 2025-10-29
