import { User, Bot } from "lucide-react";

interface Citation {
  source: string;
  content: string;
}

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  citations?: Citation[];
}

export const ChatMessage = ({ role, content, citations }: ChatMessageProps) => {
  const isUser = role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} animate-fade-in`}>
      <div className={`flex gap-3 max-w-[85%] sm:max-w-[75%] ${isUser ? "flex-row-reverse" : "flex-row"}`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shadow-lg
                        ${isUser ? "bg-gradient-to-br from-primary to-primary-dark" : "bg-white"}`}>
          {isUser ? (
            <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          ) : (
            <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
          )}
        </div>

        {/* Message Bubble */}
        <div>
          <div
            className={`px-4 py-3 rounded-2xl shadow-lg text-sm sm:text-base
                       ${
                         isUser
                           ? "bg-gradient-to-br from-primary to-primary-dark text-white"
                           : "bg-white text-foreground"
                       }`}
          >
            <p className="whitespace-pre-wrap break-words">{content}</p>
          </div>

          {/* Citations */}
          {citations && citations.length > 0 && (
            <div className="mt-3 space-y-2">
              {citations.map((citation, idx) => (
                <div
                  key={idx}
                  className="bg-chat-citation-bg border-l-4 border-chat-citation-border 
                             rounded-lg p-3 text-xs sm:text-sm"
                >
                  <p className="font-semibold text-foreground mb-1">{citation.source}</p>
                  <p className="text-muted-foreground">{citation.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
