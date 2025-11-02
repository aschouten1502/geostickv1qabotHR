/**
 * ========================================
 * MAIN PAGE - Chat Interface
 * ========================================
 *
 * Dit is de hoofdpagina van de chatbot applicatie.
 *
 * COMPONENTEN:
 * - ChatHeader: Header met logo en taal selector
 * - ChatMessage: Toont individuele messages (user + assistant)
 * - ChatInput: Input veld voor gebruiker om vragen te stellen
 * - WelcomeScreen: Welkomstscherm met voorbeeldvragen
 * - LogoBackground: Subtiel logo patroon op achtergrond
 *
 * STATE:
 * - messages: Alle chat messages (user + assistant)
 * - isLoading: Of er momenteel een antwoord wordt gegenereerd
 * - selectedLanguage: De geselecteerde taal (nl, en, pl, etc.)
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import { ChatHeader } from './components/ChatHeader';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { LoadingIndicator } from './components/LoadingIndicator';
import { WelcomeScreen } from './components/WelcomeScreen';
import { LogoBackground } from './components/LogoBackground';

// ========================================
// TYPES
// ========================================

/**
 * Een message in de chat conversatie
 */
interface Message {
  role: 'user' | 'assistant';
  content: string;
  citations?: any[];           // Bronnen voor het antwoord (bestand + pagina's)
  logId?: string | null;       // Log ID voor feedback tracking
  usage?: {                    // Token usage info (optioneel)
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// ========================================
// MAIN COMPONENT
// ========================================

export default function Home() {
  // State management
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('nl');
  const [sessionId] = useState(() => {
    // Try to get existing session ID from localStorage
    if (typeof window !== 'undefined') {
      const existingSessionId = localStorage.getItem('hr_bot_session_id');
      if (existingSessionId) {
        console.log('📌 [Frontend] Existing session ID restored:', existingSessionId);
        return existingSessionId;
      }
    }

    // Generate new session ID
    const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('hr_bot_session_id', newSessionId);
      console.log('🆕 [Frontend] New session ID created:', newSessionId);
    }

    return newSessionId;
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll naar beneden wanneer nieuwe messages komen
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // ========================================
  // MESSAGE HANDLER
  // ========================================
  /**
   * Stuurt een message naar de API en verwerkt het antwoord
   *
   * FLOW:
   * 1. Voeg user message toe aan chat
   * 2. Stuur request naar /api/chat met message + geschiedenis + taal
   * 3. Ontvang antwoord van API
   * 4. Voeg assistant antwoord toe aan chat
   * 5. Bij errors: toon error message aan gebruiker
   */
  const handleSendMessage = async (content: string) => {
    console.log('🚀 [Frontend] Send message initiated');
    console.log('🔑 [Frontend] Session ID:', sessionId);

    // Voeg user message meteen toe aan de chat
    const userMessage: Message = { role: 'user', content };
    setMessages((prev) => [...prev, userMessage]);
    console.log('📤 [Frontend] User message:', content);
    setIsLoading(true);  // Toon loading indicator

    try {
      // Stuur request naar API
      console.log('🌐 [Frontend] Sending fetch request to /api/chat');
      console.log('📊 [Frontend] Payload:', {
        message: content,
        historyLength: messages.length,
        language: selectedLanguage,
        sessionId: sessionId
      });

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content,
          conversationHistory: messages,  // Stuur volledige geschiedenis mee voor context
          language: selectedLanguage,      // Geselecteerde taal (maar AI detecteert automatisch)
          sessionId: sessionId             // Session ID voor tracking
        })
      });

      console.log('📥 [Frontend] Response status:', response.status);
      const data = await response.json();
      console.log('📦 [Frontend] Response data:', data);

      // ========================================
      // ERROR HANDLING
      // ========================================
      if (!response.ok) {
        // Log error voor debugging
        console.error('\n❌ [Frontend] ========== API ERROR RESPONSE ==========');
        console.error('🔴 [Frontend] Status Code:', response.status);
        console.error('📋 [Frontend] Error Category:', data.error || 'Unknown');
        console.error('📍 [Frontend] Error Source:', data.source || 'Unknown');
        console.error('💬 [Frontend] Error Message:', data.message || data.details || 'No message');
        console.error('🔍 [Frontend] Full Response:', JSON.stringify(data, null, 2));
        console.error('========================================\n');

        // Als het een user-friendly error is (bijv. content filter), toon als normaal bericht
        if (data.userFriendly && data.message) {
          const errorMessage: Message = {
            role: 'assistant',
            content: data.message
          };
          setMessages((prev) => [...prev, errorMessage]);
          return; // Stop hier, geen throw
        }

        // Voor server errors met user messages, toon die
        if (data.message) {
          const errorMessage: Message = {
            role: 'assistant',
            content: data.message
          };
          setMessages((prev) => [...prev, errorMessage]);
          return;
        }

        // Anders: throw error voor catch block
        throw new Error(data.details || data.error || 'Failed to send message');
      }

      // ========================================
      // SUCCESS - Voeg antwoord toe
      // ========================================
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.message,
        citations: data.citations,  // Bronnen (bestand + pagina)
        logId: data.logId || null,  // Log ID voor feedback tracking
        usage: data.usage           // Token usage voor debugging
      };

      console.log('✅ [Frontend] Adding assistant message to state');
      console.log('🔑 [Frontend] Log ID:', data.logId || 'NO_LOG_ID');
      setMessages((prev) => [...prev, assistantMessage]);

    } catch (error: any) {
      // ========================================
      // CLIENT-SIDE ERROR
      // ========================================
      // Dit gebeurt bij network errors of andere client-side issues
      console.error('\n❌ [Frontend] ========== ERROR CAUGHT ==========');
      console.error('🔴 [Frontend] Error Type:', error?.name || 'Unknown');
      console.error('📋 [Frontend] Error Message:', error?.message || 'No message');
      console.error('⏱️  [Frontend] Timestamp:', new Date().toISOString());

      if (error?.stack) {
        console.error('🔍 [Frontend] Stack Trace (first 3 lines):');
        const stackLines = error.stack.split('\n').slice(0, 3);
        stackLines.forEach((line: string) => console.error('   ' + line));
      }

      console.error('========================================\n');

      // Toon user-friendly error message
      const errorMessage: Message = {
        role: 'assistant',
        content: `Sorry, er is een fout opgetreden: ${error?.message || 'Onbekende fout. Probeer het opnieuw.'}`
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      // Zet loading altijd uit, of het nu lukt of faalt
      console.log('🏁 [Frontend] Request completed, setting loading to false');
      setIsLoading(false);
    }
  };

  // ========================================
  // RENDER
  // ========================================
  return (
    <div className="flex flex-col h-screen relative">
      {/* Logo Background Pattern - Subtiel op achtergrond */}
      <LogoBackground />

      {/* Main Content - Boven background */}
      <div className="relative z-10 flex flex-col h-screen">
        {/* Header met logo en taal selector */}
        <ChatHeader
          selectedLanguage={selectedLanguage}
          onLanguageChange={setSelectedLanguage}
        />

        {/* Chat Area - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Toon welkomstscherm als er nog geen messages zijn */}
            {messages.length === 0 ? (
              <WelcomeScreen selectedLanguage={selectedLanguage} />
            ) : (
              <div className="space-y-4 sm:space-y-6">
                {/* Render alle messages */}
                {messages.map((message, idx) => (
                  <ChatMessage
                    key={idx}
                    role={message.role}
                    content={message.content}
                    citations={message.citations}
                    logId={message.logId}
                  />
                ))}
                {/* Loading indicator tijdens wachten op antwoord */}
                {isLoading && <LoadingIndicator />}
                {/* Invisible div voor auto-scroll */}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </div>

        {/* Input Area - Fixed onderaan */}
        <ChatInput
          onSendMessage={handleSendMessage}
          disabled={isLoading}
          selectedLanguage={selectedLanguage}
        />
      </div>
    </div>
  );
}
