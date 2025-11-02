# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 application that implements an **HR Q&A chatbot for GeoStick** using Pinecone Assistant for RAG (Retrieval-Augmented Generation) and OpenAI's GPT-4o for response generation. The bot answers questions about HR policies, procedures, and employee benefits based on uploaded HR documentation.

**This is the VERKOOP version - production-ready version meant for selling to GeoStick. The folder name "verkoop" refers to this being the commercial/sales version, NOT that it's a sales assistant. It's still an HR bot.**

## Development Commands

```bash
# Install dependencies
npm install

# Run development server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## Environment Configuration

Required environment variables (see `.env.example`):
- `PINECONE_API_KEY`: Pinecone API key for Assistant access
- `PINECONE_ASSISTANT_NAME`: Name of the Pinecone Assistant instance (default: `geostick-hr-assistant`)
- `OPENAI_API_KEY`: OpenAI API key for GPT-4o

Create `.env.local` file with these variables before running the application.

## Architecture

### Core Flow

1. **User Input** → Frontend chat interface (`app/page.tsx`)
2. **API Route** → `/api/chat/route.ts` receives message + conversation history
3. **Context Retrieval** → Pinecone Assistant retrieves top 3 relevant snippets from HR documentation
4. **LLM Generation** → OpenAI GPT-4o generates response using retrieved context
5. **Response** → Formatted answer with citations sent back to frontend

### Key Components

**Frontend (`app/page.tsx`)**
- Client-side chat interface with React hooks
- Real-time session statistics tracking (costs, tokens, response times)
- Developer sidebar showing Pinecone and OpenAI usage metrics
- Citation display grouped by source document and page numbers
- Handles content filter errors gracefully

**Backend API (`app/api/chat/route.ts`)**
- Implements RAG pattern: retrieval → augmentation → generation
- Retrieves context using Pinecone Assistant's `context()` method (topK=3)
- Builds system prompt with strict guardrails to prevent hallucination
- Calls OpenAI GPT-4o with conversation history + context
- Extensive logging for debugging and cost tracking
- Error handling for content filters and API failures

### System Prompt Behavior

The assistant has **strict constraints** to prevent hallucination:
- ONLY answers from explicit information in retrieved context
- NEVER makes assumptions or uses general knowledge
- Responds "information not available" when context is insufficient
- Only handles **HR-related queries** (vacation, sick leave, benefits, CAO, procedures, etc.)
- Rejects prompt injection attempts and off-topic requests
- Uses plain text formatting (no markdown bold/italics)
- Language: Dutch (nl)

### Cost Tracking

The application tracks and displays:
- **Pinecone costs**: Context retrieval at $5/1M tokens (hourly rate $0.05/hour excluded from per-request calculations)
- **OpenAI costs**: Input tokens at $2.50/1M, output tokens at $10/1M
- Response times and token usage per request
- Session-level aggregates in frontend sidebar

Console logs include structured request summaries designed for future Supabase analytics integration.

### Citations System

Citations track the source of information:
- Each snippet from Pinecone includes file reference and page numbers
- Frontend groups citations by document and deduplicates pages
- First/last 3 words shown as preview in logs
- Rendered below assistant responses with page references

## File Structure

```
geostickverkoophrqabot/
├── app/
│   ├── api/chat/route.ts       # Main API endpoint for chat
│   ├── page.tsx                # Chat interface + session stats
│   ├── layout.tsx              # Root layout with metadata
│   └── globals.css             # Tailwind styles
├── Supabasehrqabotgeostick-dp/ # Supabase integration (future)
├── .env.example                # Environment variable template
├── package.json                # Dependencies and scripts
└── tsconfig.json               # TypeScript configuration
```

## Important Patterns

### Conversation History
- Full conversation history passed to API on each request
- Cleaned before sending to OpenAI (only role + content)
- Used for multi-turn context awareness

### Error Handling
- Content filter errors return friendly user message with `userFriendly: true` flag
- Frontend checks flag to display error as normal message instead of error UI
- All errors logged with structured format for debugging

### Token Optimization
- topK reduced from 5 to 3 for ~40% Pinecone token savings
- Snippet size limited by Pinecone Assistant defaults
- Context assembled from snippet content only

## Technology Stack

- **Framework**: Next.js 15.5.6 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **Vector DB**: Pinecone Assistant (with Assistant API)
- **LLM**: OpenAI GPT-4o
- **Linting**: ESLint 9 with Next.js config

## Production Version Specific Notes

- **Target Audience**: GeoStick employees
- **Content Domain**: HR policies, procedures, employee benefits, CAO regulations
- **Use Cases**:
  - Employee self-service HR questions
  - Policy clarification
  - Benefits information
  - Vacation and sick leave procedures
- **Future Integrations**: Supabase for chat history, user authentication, analytics
- **Note**: Folder named "verkoop" = this is the production version for commercial sale, NOT a sales assistant bot

## Notes for Development

- The system prompt in `route.ts` is critical for preventing hallucination - modify with extreme care
- Cost tracking logs are verbose by design for analytics integration
- Assistant responses use plain text formatting per system instructions
- Content filter detection checks for specific OpenAI error patterns
- TypeScript path alias `@/*` resolves to project root

## Deployment Checklist

Before deploying to production:
- [ ] Set all environment variables in `.env.local`
- [ ] Test with actual HR documentation in Pinecone Assistant
- [ ] Verify cost tracking metrics are accurate
- [ ] Test content filter error handling
- [ ] Review system prompt for HR-specific constraints
- [ ] Test multi-turn conversations
- [ ] Verify citation display works correctly
- [ ] Check responsive design on mobile devices
