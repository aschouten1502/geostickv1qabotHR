/**
 * ========================================
 * OPENAI - LLM Response Generation
 * ========================================
 *
 * Dit bestand bevat alle logica voor het genereren van antwoorden
 * via OpenAI's GPT-4o model.
 *
 * OpenAI GPT-4o:
 * - Leest de context uit Pinecone
 * - Leest de conversatie geschiedenis
 * - Genereert een antwoord gebaseerd op ALLEEN de context
 * - Detecteert automatisch de taal van de vraag
 */

import OpenAI from 'openai';

// ========================================
// TYPES & INTERFACES
// ========================================

/**
 * Een message in de conversatie (user of assistant)
 */
export interface ConversationMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

/**
 * OpenAI response met usage informatie
 */
export interface OpenAIResponse {
  answer: string;              // Het gegenereerde antwoord
  inputTokens: number;         // Tokens gebruikt voor input (prompt + history + context)
  outputTokens: number;        // Tokens gebruikt voor output (het antwoord)
  totalTokens: number;         // Totaal aantal tokens
  inputCost: number;           // Kosten voor input ($2.50 per 1M tokens)
  outputCost: number;          // Kosten voor output ($10 per 1M tokens)
  totalCost: number;           // Totale OpenAI kosten voor deze request
}

// ========================================
// OPENAI CLIENT
// ========================================

/**
 * Initialiseert de OpenAI client
 *
 * @param apiKey - OpenAI API key uit environment variabelen
 * @returns OpenAI client instance
 * @throws Error als API key ontbreekt
 */
export function initializeOpenAI(apiKey: string): OpenAI {
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not configured');
  }

  return new OpenAI({ apiKey });
}

// ========================================
// MESSAGE PREPARATION
// ========================================

/**
 * Bereidt de messages voor OpenAI voor
 *
 * Dit combineert:
 * 1. System prompt (met context en instructies)
 * 2. Conversatie geschiedenis (eerdere vragen en antwoorden)
 * 3. Huidige vraag van de gebruiker
 *
 * @param systemPrompt - De system prompt met context en instructies
 * @param conversationHistory - Eerdere messages in het gesprek
 * @param currentMessage - De huidige vraag van de gebruiker
 * @returns Array van messages voor OpenAI
 */
export function prepareMessages(
  systemPrompt: string,
  conversationHistory: any[],
  currentMessage: string
): ConversationMessage[] {
  // Clean de conversation history (verwijder citation info, etc.)
  const cleanedHistory = (conversationHistory || []).map((msg: any) => ({
    role: msg.role,
    content: msg.content
  }));

  // Bouw de messages array
  return [
    { role: 'system', content: systemPrompt },
    ...cleanedHistory,
    { role: 'user', content: currentMessage }
  ];
}

// ========================================
// LLM CALL
// ========================================

/**
 * Vraagt OpenAI GPT-4o om een antwoord te genereren
 *
 * Deze functie:
 * 1. Stuurt alle messages naar GPT-4o
 * 2. Gebruikt temperature 0.7 (balans tussen creativiteit en consistentie)
 * 3. Berekent de kosten van input en output tokens
 * 4. Logt alle usage informatie
 *
 * @param openaiClient - Geïnitialiseerde OpenAI client
 * @param messages - Alle messages (system, history, current)
 * @param language - De geselecteerde taal (voor logging)
 * @returns OpenAI response met antwoord en cost info
 */
export async function generateAnswer(
  openaiClient: OpenAI,
  messages: ConversationMessage[],
  language: string
): Promise<OpenAIResponse> {
  console.log('\n💭 [OpenAI] ========== CALLING OPENAI ==========');
  console.log('🤖 [OpenAI] Model: GPT-4o');
  console.log('📨 [OpenAI] Conversation history messages:', messages.length - 2); // -2 voor system en current
  console.log('🌐 [OpenAI] User selected language:', language);
  console.log('🗣️  [OpenAI] AI will auto-detect question language and respond in same language');

  // Call OpenAI API
  const completion = await openaiClient.chat.completions.create({
    model: 'gpt-4o',
    messages: messages as any,
    temperature: 0.7,  // Balans tussen creativiteit (1.0) en strikte precisie (0.0)
  });

  // Extract het antwoord
  const answer = completion.choices[0].message.content || '';

  console.log('\n✅ [OpenAI] ========== ASSISTANT ANSWER ==========');
  console.log('💬 [OpenAI] Answer:', answer);
  console.log('📊 [OpenAI] Answer length:', answer.length, 'characters');

  // Log token usage
  console.log('\n💰 [OpenAI] ========== TOKEN USAGE ==========');
  const inputTokens = completion.usage?.prompt_tokens || 0;
  const outputTokens = completion.usage?.completion_tokens || 0;
  const totalTokens = completion.usage?.total_tokens || 0;

  console.log('🔢 [OpenAI] Input tokens:', inputTokens);
  console.log('🔢 [OpenAI] Output tokens:', outputTokens);
  console.log('🔢 [OpenAI] Total tokens:', totalTokens);

  // Bereken kosten
  // GPT-4o pricing: $2.50 per 1M input tokens, $10 per 1M output tokens
  const inputCost = (inputTokens / 1000000) * 2.50;
  const outputCost = (outputTokens / 1000000) * 10;
  const totalCost = inputCost + outputCost;

  console.log('💵 [OpenAI] Input cost: $' + inputCost.toFixed(6));
  console.log('💵 [OpenAI] Output cost: $' + outputCost.toFixed(6));
  console.log('💵 [OpenAI] Total OpenAI cost: $' + totalCost.toFixed(6));

  return {
    answer,
    inputTokens,
    outputTokens,
    totalTokens,
    inputCost,
    outputCost,
    totalCost
  };
}
