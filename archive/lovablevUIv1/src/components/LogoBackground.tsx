import logo from "@/assets/Geosticklogo.png";

export const LogoBackground = () => {
  // Create array of 56 logos for beautiful background pattern
  const logoCount = 56;
  const logos = Array.from({ length: logoCount }, (_, i) => i);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Warme gradient achtergrond */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50/80 via-white to-yellow-50/80" />
      
      {/* Logo pattern met verbeterde styling */}
      <div className="absolute inset-0 grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 
                      gap-6 sm:gap-10 md:gap-14 lg:gap-16 
                      p-6 sm:p-10 md:p-14 lg:p-16
                      place-items-center">
        {logos.map((i) => (
          <div 
            key={i} 
            className="flex items-center justify-center transform hover:scale-110 transition-transform duration-500"
          >
            <img
              src={logo}
              alt=""
              className="w-16 sm:w-20 md:w-24 lg:w-28 h-auto"
              style={{
                opacity: 0.06,
                filter: "grayscale(20%) brightness(1.1)",
                mixBlendMode: "multiply",
              }}
            />
          </div>
        ))}
      </div>

      {/* Subtiele overlay voor extra depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-white/40 via-transparent to-white/20" />
    </div>
  );
};
