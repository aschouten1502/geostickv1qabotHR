export const LoadingIndicator = () => {
  return (
    <div className="flex justify-start animate-fade-in">
      <div className="flex gap-3 max-w-[85%] sm:max-w-[75%]">
        {/* Bot Avatar */}
        <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shadow-lg bg-white">
          <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-primary/20" />
        </div>

        {/* Loading Dots */}
        <div className="bg-white px-6 py-4 rounded-2xl shadow-lg">
          <div className="flex gap-1.5">
            <div 
              className="w-2 h-2 rounded-full bg-primary animate-bounce-dot"
              style={{ animationDelay: "0ms" }}
            />
            <div 
              className="w-2 h-2 rounded-full bg-accent animate-bounce-dot"
              style={{ animationDelay: "150ms" }}
            />
            <div 
              className="w-2 h-2 rounded-full bg-primary animate-bounce-dot"
              style={{ animationDelay: "300ms" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
