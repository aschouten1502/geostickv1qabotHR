import { MessageCircle } from "lucide-react";

export const WelcomeScreen = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full px-4 animate-fade-in">
      <div className="relative">
        {/* Gradient Circle */}
        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-primary via-primary-dark to-accent 
                        flex items-center justify-center shadow-2xl">
          <MessageCircle className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
        </div>
        {/* Pulse effect */}
        <div className="absolute inset-0 w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-primary to-accent 
                        opacity-20 animate-ping" />
      </div>

      <h2 className="mt-8 text-2xl sm:text-3xl font-bold text-foreground text-center">
        Welkom bij Geostick HR Bot
      </h2>
      <p className="mt-3 text-sm sm:text-base text-muted-foreground text-center max-w-md">
        Stel al je vragen over HR beleid, vakantiedagen, CAO, ziekteverlof en meer.
        Ik help je graag verder!
      </p>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl">
        <div className="bg-white rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all">
          <p className="text-sm text-muted-foreground">Bijvoorbeeld:</p>
          <p className="mt-1 text-sm sm:text-base font-medium text-foreground">
            "Hoeveel vakantiedagen heb ik?"
          </p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all">
          <p className="text-sm text-muted-foreground">Bijvoorbeeld:</p>
          <p className="mt-1 text-sm sm:text-base font-medium text-foreground">
            "Wat moet ik doen bij ziekte?"
          </p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all">
          <p className="text-sm text-muted-foreground">Bijvoorbeeld:</p>
          <p className="mt-1 text-sm sm:text-base font-medium text-foreground">
            "Hoe vraag ik verlof aan?"
          </p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all">
          <p className="text-sm text-muted-foreground">Bijvoorbeeld:</p>
          <p className="mt-1 text-sm sm:text-base font-medium text-foreground">
            "Wat staat er in de CAO?"
          </p>
        </div>
      </div>
    </div>
  );
};
