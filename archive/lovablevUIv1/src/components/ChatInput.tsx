import { Send } from "lucide-react";
import { useState, FormEvent } from "react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export const ChatInput = ({ onSendMessage, disabled }: ChatInputProps) => {
  const [input, setInput] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSendMessage(input.trim());
      setInput("");
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="border-t border-border bg-white shadow-2xl"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="relative flex items-center gap-2 sm:gap-3 
                        border-2 border-accent rounded-full px-4 sm:px-6 py-2 sm:py-3 
                        bg-white shadow-lg
                        focus-within:shadow-2xl focus-within:scale-[1.02] 
                        transition-all duration-200">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Stel je vraag..."
            disabled={disabled}
            className="flex-1 bg-transparent outline-none text-sm sm:text-base 
                       placeholder:text-muted-foreground disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={disabled || !input.trim()}
            className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full 
                       bg-accent hover:bg-accent/90 
                       disabled:opacity-50 disabled:cursor-not-allowed
                       flex items-center justify-center
                       transition-all duration-200 hover:scale-105 active:scale-95
                       shadow-lg"
          >
            <Send className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" />
          </button>
        </div>
      </div>
    </form>
  );
};
