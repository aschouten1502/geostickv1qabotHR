import { Globe } from "lucide-react";
import { useState } from "react";
import logo from "@/assets/Geosticklogo.png";

const LANGUAGES = [
  { code: "nl", name: "Nederlands", flag: "🇳🇱" },
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "it", name: "Italiano", flag: "🇮🇹" },
  { code: "pl", name: "Polski", flag: "🇵🇱" },
  { code: "tr", name: "Türkçe", flag: "🇹🇷" },
  { code: "ar", name: "العربية", flag: "🇸🇦" },
  { code: "zh", name: "中文", flag: "🇨🇳" },
  { code: "pt", name: "Português", flag: "🇵🇹" },
  { code: "ro", name: "Română", flag: "🇷🇴" },
];

interface ChatHeaderProps {
  selectedLanguage: string;
  onLanguageChange: (code: string) => void;
}

export const ChatHeader = ({ selectedLanguage, onLanguageChange }: ChatHeaderProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const currentLang = LANGUAGES.find((l) => l.code === selectedLanguage) || LANGUAGES[0];

  return (
    <header className="bg-gradient-to-r from-primary to-primary-dark shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="flex items-center justify-between">
          {/* Logo - Verbeterd design */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="bg-white/95 backdrop-blur-md rounded-2xl p-3 sm:p-3.5 shadow-2xl 
                            hover:shadow-accent/20 transition-all duration-300 hover:scale-105
                            border border-white/50">
              <img 
                src={logo} 
                alt="Geostick" 
                className="h-10 sm:h-12 w-auto"
              />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-white text-xl sm:text-2xl font-bold tracking-tight 
                             drop-shadow-lg">
                Geostick HR Bot
              </h1>
              <p className="text-white/95 text-sm mt-0.5 drop-shadow-md">
                Stel al je vragen die je normaal aan de HR zou vragen
              </p>
            </div>
            <div className="sm:hidden">
              <h1 className="text-white text-lg font-bold tracking-tight drop-shadow-lg">
                HR Bot
              </h1>
            </div>
          </div>

          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 
                         px-3 sm:px-4 py-2 rounded-full transition-all shadow-lg
                         text-white text-sm sm:text-base"
            >
              <Globe className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">{currentLang.flag} {currentLang.name}</span>
              <span className="sm:hidden">{currentLang.flag}</span>
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl 
                              overflow-hidden z-50 animate-fade-in">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      onLanguageChange(lang.code);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 hover:bg-accent/20 transition-all
                                flex items-center gap-3 text-sm
                                ${lang.code === selectedLanguage ? "bg-accent/10 font-semibold" : ""}`}
                  >
                    <span className="text-xl">{lang.flag}</span>
                    <span>{lang.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
