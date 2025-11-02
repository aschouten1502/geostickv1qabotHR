/**
 * ========================================
 * CHAT API ROUTE - Main Entry Point
 * ========================================
 *
 * Dit is de hoofdroute voor de chatbot. Wanneer een gebruiker een vraag stelt,
 * komt de request hier binnen.
 *
 * FLOW:
 * 1. Ontvang vraag van gebruiker + conversatie geschiedenis
 * 2. Haal relevante context op uit Pinecone (HR documenten)
 * 3. Genereer system prompt met context
 * 4. Vraag OpenAI om antwoord te genereren
 * 5. Stuur antwoord + citations terug naar gebruiker
 * 6. Log alles voor analytics en debugging
 */

import { NextRequest, NextResponse } from 'next/server';

// Import alle modules
import { initializePinecone, retrieveContext } from '@/lib/pinecone';
import { initializeOpenAI, prepareMessages, generateAnswer } from '@/lib/openai';
import { generateSystemPrompt } from '@/lib/prompts';
import {
  logSuccessfulRequest,
  logError,
  logContentFilter,
  isContentFilterError,
  getUserFriendlyErrorMessage,
  categorizeError,
  type RequestSummary
} from '@/lib/logging';

// ========================================
// MAIN API HANDLER
// ========================================

export async function POST(request: NextRequest) {
  // Start timing voor performance tracking
  const requestStartTime = Date.now();
  console.log('🚀 [API] Chat request received');
  console.log('⏱️  [API] Request start time:', new Date(requestStartTime).toISOString());

  // Initialiseer variabelen
  let message: string = '';
  let conversationHistory: any[] = [];
  let language: string = 'nl';

  try {
    // ========================================
    // STEP 1: Parse en valideer de request
    // ========================================
    const body = await request.json();
    message = body.message;
    conversationHistory = body.conversationHistory;
    language = body.language || 'nl';
    const sessionId = body.sessionId;

    console.log('\n📝 [API] ========== USER QUESTION ==========');
    console.log('🔑 [API] Session ID:', sessionId || 'NO_SESSION_ID');
    console.log('❓ [API] Question:', message);
    console.log('💬 [API] Conversation history length:', conversationHistory?.length || 0);
    console.log('🌐 [API] Selected language:', language);

    // Valideer dat er een message is
    if (!message) {
      console.log('❌ [API] No message provided');
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // ========================================
    // STEP 2: Check environment configuratie
    // ========================================
    const pineconeApiKey = process.env.PINECONE_API_KEY;
    const openaiApiKey = process.env.OPENAI_API_KEY;
    const assistantName = process.env.PINECONE_ASSISTANT_NAME;

    console.log('🔑 [API] Pinecone API Key exists:', !!pineconeApiKey);
    console.log('🔑 [API] OpenAI API Key exists:', !!openaiApiKey);
    console.log('🤖 [API] Assistant name:', assistantName);

    if (!pineconeApiKey || !assistantName || !openaiApiKey) {
      console.log('❌ [API] Missing configuration');
      return NextResponse.json(
        { error: 'Server configuration error: Missing API keys or assistant name' },
        { status: 500 }
      );
    }

    // ========================================
    // STEP 3: Initialiseer Pinecone en haal context op
    // ========================================
    const pineconeClient = initializePinecone(pineconeApiKey);
    const {
      contextText,
      citations,
      pineconeTokens,
      pineconeCost
    } = await retrieveContext(assistantName, pineconeClient, message);

    // ========================================
    // STEP 4: Genereer system prompt
    // ========================================
    const systemPrompt = generateSystemPrompt(contextText, language);

    // ========================================
    // STEP 5: Initialiseer OpenAI en genereer antwoord
    // ========================================
    const openaiClient = initializeOpenAI(openaiApiKey);
    const messages = prepareMessages(systemPrompt, conversationHistory, message);
    const openaiResponse = await generateAnswer(openaiClient, messages, language);

    // ========================================
    // STEP 6: Bereken totale kosten en timing
    // ========================================
    const requestEndTime = Date.now();
    const responseTimeMs = requestEndTime - requestStartTime;
    const responseTimeSeconds = (responseTimeMs / 1000).toFixed(2);
    const combinedTotalCost = pineconeCost + openaiResponse.totalCost;

    console.log('\n💰 [API] ========== COMBINED COST SUMMARY ==========');
    console.log('💵 [API] Pinecone context: $' + pineconeCost.toFixed(6));
    console.log('💵 [API] OpenAI (input + output): $' + openaiResponse.totalCost.toFixed(6));
    console.log('💵 [API] Total per request: $' + combinedTotalCost.toFixed(6));
    console.log('ℹ️  [API] Note: Excludes Pinecone hourly rate ($0.05/hour)');

    console.log('\n⏱️  [API] ========== TIMING ==========');
    console.log('⏱️  [API] Request end time:', new Date(requestEndTime).toISOString());
    console.log('⏱️  [API] Total response time:', responseTimeSeconds, 'seconds');
    console.log('⏱️  [API] Total response time:', responseTimeMs, 'ms');

    // ========================================
    // STEP 7: Log succesvolle request
    // ========================================
    const requestSummary: RequestSummary = {
      session_id: sessionId || 'NO_SESSION_ID',
      timestamp: new Date(requestStartTime).toISOString(),
      question: message,
      answer: openaiResponse.answer,
      response_time_seconds: parseFloat(responseTimeSeconds),
      response_time_ms: responseTimeMs,
      pinecone_tokens: pineconeTokens,
      pinecone_cost: parseFloat(pineconeCost.toFixed(6)),
      openai_input_tokens: openaiResponse.inputTokens,
      openai_output_tokens: openaiResponse.outputTokens,
      openai_total_tokens: openaiResponse.totalTokens,
      openai_cost: parseFloat(openaiResponse.totalCost.toFixed(6)),
      total_cost: parseFloat(combinedTotalCost.toFixed(6)),
      snippets_used: citations.length,
      citations_count: citations.length,
      conversation_history_length: conversationHistory?.length || 0,
      language: language,
      citations: citations
    };

    const logId = await logSuccessfulRequest(requestSummary);

    // ========================================
    // STEP 8: Return response naar frontend
    // ========================================
    return NextResponse.json({
      message: openaiResponse.answer,
      citations: citations,
      logId: logId, // Voor feedback tracking
      usage: {
        prompt_tokens: openaiResponse.inputTokens,
        completion_tokens: openaiResponse.outputTokens,
        total_tokens: openaiResponse.totalTokens
      },
      costBreakdown: {
        pinecone: {
          tokens: pineconeTokens,
          cost: parseFloat(pineconeCost.toFixed(6))
        },
        openai: {
          input_tokens: openaiResponse.inputTokens,
          output_tokens: openaiResponse.outputTokens,
          total_tokens: openaiResponse.totalTokens,
          cost: parseFloat(openaiResponse.totalCost.toFixed(6))
        },
        total_cost: parseFloat(combinedTotalCost.toFixed(6)),
        response_time_seconds: parseFloat(responseTimeSeconds)
      }
    });

  } catch (error: any) {
    // ========================================
    // ERROR HANDLING
    // ========================================

    // Check of dit een content filter error is
    if (isContentFilterError(error)) {
      logContentFilter(requestStartTime, message, conversationHistory);

      return NextResponse.json(
        {
          error: 'content_filter',
          message: 'Je vraag bevat termen die automatisch worden geblokkeerd om misbruik te voorkomen. Als je vraag echt HR-gerelateerd is, neem dan contact op met je leidinggevende of de HR-afdeling voor een persoonlijk gesprek.',
          userFriendly: true
        },
        { status: 400 }
      );
    }

    // Log de error met volledige context
    logError(error, requestStartTime, message, conversationHistory, language);

    // Categoriseer de error en geef user-friendly message
    const { category, source } = categorizeError(error);
    const userMessage = getUserFriendlyErrorMessage(category);

    return NextResponse.json(
      {
        error: category,
        message: userMessage,
        details: error?.message || 'Unknown error',
        type: error?.name || 'Error',
        source: source
      },
      { status: 500 }
    );
  }
}
