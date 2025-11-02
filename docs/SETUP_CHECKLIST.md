# ✅ Setup Checklist - GeoStick HR Bot (Verkoop Versie)

## 📋 Stap 1: Pinecone Setup

### 1.1 Pinecone Account & Assistant
- [ ] Ga naar [https://app.pinecone.io](https://app.pinecone.io)
- [ ] Log in of maak een account aan
- [ ] Ga naar **"Assistants"** in het linkermenu
- [ ] Klik op **"Create Assistant"**
- [ ] Vul in:
  - **Name**: `geostick-hr-assistant` (exact deze naam!)
  - **Description**: "GeoStick HR Q&A Assistant - Verkoop versie"
- [ ] Klik op **"Create"**

### 1.2 HR Documenten Uploaden
- [ ] Open je nieuwe `geostick-hr-assistant`
- [ ] Klik op **"Upload Files"** of **"Add Files"**
- [ ] Upload HR documenten:
  - [ ] CAO documenten (.pdf)
  - [ ] Verzuimprotocol (.pdf, .docx)
  - [ ] Verlofregeling (.pdf, .docx)
  - [ ] Arbeidsvoorwaarden (.pdf)
  - [ ] HR handboek (.pdf, .docx)
  - [ ] Benefits informatie (.pdf)
  - [ ] Andere HR beleid documenten
- [ ] Wacht tot processing klaar is (status: Active)

### 1.3 API Key Ophalen
- [ ] Ga naar **"API Keys"** in het linkermenu
- [ ] Kopieer je bestaande API key OF
- [ ] Klik op **"Create API Key"** voor een nieuwe
- [ ] Bewaar de key veilig (begint met `pcsk_`)

---

## 🔑 Stap 2: OpenAI Setup

### 2.1 OpenAI Account & API Key
- [ ] Ga naar [https://platform.openai.com](https://platform.openai.com)
- [ ] Log in of maak een account aan
- [ ] Ga naar [API Keys](https://platform.openai.com/api-keys)
- [ ] Klik op **"Create new secret key"**
- [ ] Geef de key een naam (bijv. "GeoStick HR Bot")
- [ ] Kopieer de key (begint met `sk-`)
- [ ] Bewaar de key veilig (kun je maar 1x zien!)

### 2.2 Billing Check
- [ ] Ga naar [Billing](https://platform.openai.com/settings/organization/billing/overview)
- [ ] Zorg dat je een payment method hebt toegevoegd
- [ ] Check je usage limits

---

## 💻 Stap 3: Environment Variables Invullen

### 3.1 Open .env.local
- [ ] Open bestand: `geostickverkoophrqabot/.env.local`
- [ ] Het bestand is al aangemaakt en bevat instructies

### 3.2 Vul API Keys In
Vervang de lege waardes:

```env
PINECONE_API_KEY=pcsk_JOUW_KEY_HIER
PINECONE_ASSISTANT_NAME=geostick-hr-assistant
OPENAI_API_KEY=sk-JOUW_KEY_HIER
```

### 3.3 Controleer
- [ ] `PINECONE_API_KEY` begint met `pcsk_`
- [ ] `PINECONE_ASSISTANT_NAME` is exact `geostick-hr-assistant`
- [ ] `OPENAI_API_KEY` begint met `sk-`
- [ ] Geen spaties voor of na de keys
- [ ] Geen aanhalingstekens rond de keys

---

## 🚀 Stap 4: Bot Starten

### 4.1 Installeer Dependencies
```bash
cd geostickverkoophrqabot
npm install
```

### 4.2 Start Development Server
```bash
npm run dev
```

Je zou moeten zien:
```
  ▲ Next.js 15.5.6
  - Local:        http://localhost:3000
  - Ready in XXXms
```

### 4.3 Open Browser
- [ ] Ga naar [http://localhost:3000](http://localhost:3000)
- [ ] Je zou de chat interface moeten zien

---

## 🧪 Stap 5: Testen

### 5.1 Test Basis Functionaliteit
- [ ] Type een test vraag: "Hoeveel vakantiedagen heb ik?"
- [ ] Druk op "Verstuur"
- [ ] Wacht op antwoord (2-5 seconden)

### 5.2 Check Console Logs
Open browser DevTools (F12) → Console tab

Je zou moeten zien:
```
🚀 [API] Chat request received
📚 [API] ========== FETCHING CONTEXT ==========
✅ [API] Context received successfully
💰 [API] ========== PINECONE ASSISTANT USAGE ==========
🤖 [API] ========== CALLING OPENAI ==========
✅ [API] ========== ASSISTANT ANSWER ==========
💰 [API] ========== COMBINED COST SUMMARY ==========
```

### 5.3 Check Developer Sidebar
Rechts in de interface zou je moeten zien:
- [ ] Total Cost (groene box)
- [ ] Pinecone stats (tokens, kosten)
- [ ] OpenAI stats (tokens, kosten)
- [ ] Response times

### 5.4 Test Verschillende Vragen
Probeer:
- [ ] "Wat is het verzuimbeleid?"
- [ ] "Hoe meld ik me ziek?"
- [ ] "Welke vergoedingen krijg ik?"
- [ ] "Wat staat er in de CAO?"

---

## ✅ Stap 6: Verificatie

### 6.1 Controleer of Alles Werkt
- [ ] Bot geeft correcte antwoorden gebaseerd op je HR documenten
- [ ] Citaties verschijnen onder antwoorden
- [ ] Cost tracking werkt (cijfers tellen op in sidebar)
- [ ] Conversatie historie werkt (follow-up vragen)
- [ ] Geen errors in console

### 6.2 Common Issues

**"Missing environment variables" error?**
- Check of `.env.local` in de juiste folder staat
- Check of alle 3 de keys ingevuld zijn
- Restart development server (`npm run dev`)

**"Assistant not found" error?**
- Check of `PINECONE_ASSISTANT_NAME` exact `geostick-hr-assistant` is
- Check of de Assistant status "Active" is in Pinecone Console
- Check of je de juiste API key gebruikt

**"No context found" / Geen antwoorden?**
- Check of je documenten hebt geupload in Pinecone
- Check of processing klaar is (status: Active)
- Check of documenten relevant zijn voor de vraag

**OpenAI API errors?**
- Check of je OpenAI API key correct is
- Check of je billing setup hebt in OpenAI
- Check of je usage limits niet bereikt zijn

---

## 🎉 Success!

Als alles werkt:
- ✅ Bot antwoordt op HR vragen
- ✅ Citaties worden getoond
- ✅ Kosten worden getrackt
- ✅ Logs zijn duidelijk in console

---

## 📊 Volgende Stappen (Later)

### Supabase Integratie
- [ ] Supabase project aanmaken
- [ ] Database schema opzetten
- [ ] Chat history opslaan
- [ ] User authentication
- [ ] Analytics dashboard

### Production Deployment
- [ ] Build voor productie (`npm run build`)
- [ ] Deploy naar Vercel/Netlify
- [ ] Environment variables instellen in hosting platform
- [ ] Custom domain configureren
- [ ] SSL certificaat setup

---

## 📞 Support

Als je vast loopt:
1. Check de console logs (F12 in browser)
2. Check terminal output waar `npm run dev` draait
3. Review deze checklist opnieuw
4. Check [README.md](README.md) voor extra info
5. Check [CLAUDE.md](CLAUDE.md) voor development details

---

**Versie**: 1.0.0
**Laatst bijgewerkt**: 2025-10-29
**Bot Status**: Production Ready (Verkoop Versie)
