import { useState, useRef, useEffect } from "react";
import { ChatHeader } from "@/components/ChatHeader";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { LoadingIndicator } from "@/components/LoadingIndicator";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { LogoBackground } from "@/components/LogoBackground";

interface Message {
  role: "user" | "assistant";
  content: string;
  citations?: Array<{ source: string; content: string }>;
}

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("nl");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMessage: Message = { role: "user", content };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // TODO: Replace with actual API call to backend
      // For now, simulate a response
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const assistantMessage: Message = {
        role: "assistant",
        content: `Bedankt voor je vraag! Dit is een demo-antwoord in het ${selectedLanguage}. 
        
Je vroeg: "${content}"

In de echte applicatie zou hier het antwoord van de backend komen met relevante informatie over HR beleid, vakantiedagen, CAO, ziekteverlof, etc.`,
        citations: [
          {
            source: "HR Handboek 2024",
            content: "Dit is een voorbeeld van een citaat uit het HR handboek.",
          },
          {
            source: "CAO Geostick",
            content: "Dit is een voorbeeld van een citaat uit de CAO.",
          },
        ],
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      // In production, show error toast here
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen relative">
      {/* Logo Background Pattern */}
      <LogoBackground />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col h-screen">
        {/* Header */}
        <ChatHeader 
          selectedLanguage={selectedLanguage} 
          onLanguageChange={setSelectedLanguage} 
        />

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {messages.length === 0 ? (
              <WelcomeScreen />
            ) : (
              <div className="space-y-4 sm:space-y-6">
                {messages.map((message, idx) => (
                  <ChatMessage
                    key={idx}
                    role={message.role}
                    content={message.content}
                    citations={message.citations}
                  />
                ))}
                {isLoading && <LoadingIndicator />}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </div>

        {/* Input Area */}
        <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
      </div>
    </div>
  );
};

export default Index;
