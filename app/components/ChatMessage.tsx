'use client';

import FeedbackButtons from '@/components/FeedbackButtons';

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  citations?: any[];
  logId?: string | null;
}

export const ChatMessage = ({ role, content, citations, logId }: ChatMessageProps) => {
  const isUser = role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} animate-fade-in`}>
      <div className={`flex gap-3 max-w-[85%] sm:max-w-[75%] ${isUser ? "flex-row-reverse" : "flex-row"}`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shadow-lg
                        ${isUser ? "bg-gradient-to-br from-primary to-primary-dark" : "bg-white"}`}>
          {isUser ? (
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          ) : (
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          )}
        </div>

        {/* Message Bubble */}
        <div>
          <div
            className={`px-4 py-3 rounded-2xl shadow-lg text-sm sm:text-base
                       ${
                         isUser
                           ? "bg-gradient-to-br from-[#e32219] to-[#c01d15] text-white"
                           : "bg-white text-gray-800 border border-gray-100"
                       }`}
          >
            <p className="whitespace-pre-wrap break-words">{content}</p>
          </div>

          {/* Citations - Adapted for Pinecone format */}
          {citations && citations.length > 0 && (
            <div className="mt-3 space-y-2">
              {(() => {
                const fileMap = new Map();
                citations.forEach((citation: any) => {
                  citation.references?.forEach((ref: any) => {
                    const fileName = ref.file?.name || 'Onbekend';
                    const pages = ref.pages || [];
                    if (!fileMap.has(fileName)) {
                      fileMap.set(fileName, new Set());
                    }
                    pages.forEach((page: number) => fileMap.get(fileName).add(page));
                  });
                });

                return Array.from(fileMap.entries()).map(([fileName, pagesSet], idx) => {
                  const sortedPages = Array.from(pagesSet).sort((a: any, b: any) => a - b);
                  return (
                    <div
                      key={idx}
                      className="bg-yellow-50 border-l-4 border-[#ece31e]
                                 rounded-lg p-3 text-xs sm:text-sm"
                    >
                      <p className="font-semibold text-gray-800 mb-1">{fileName}</p>
                      {sortedPages.length > 0 && (
                        <p className="text-gray-600">Pagina {sortedPages.join(', ')}</p>
                      )}
                    </div>
                  );
                });
              })()}
            </div>
          )}

          {/* Feedback buttons - alleen voor assistant messages */}
          {!isUser && (
            <FeedbackButtons logId={logId || null} />
          )}
        </div>
      </div>
    </div>
  );
};
