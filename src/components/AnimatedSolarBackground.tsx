export const AnimatedSolarBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
      {/* Radial gradient base */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-sky-blue/20 to-background" />
      
      {/* Animated sun rays */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] opacity-30">
        <div className="absolute inset-0 animate-[spin_60s_linear_infinite]">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute top-1/2 left-1/2 w-1 h-full origin-bottom"
              style={{
                transform: `rotate(${i * 45}deg)`,
                background: `linear-gradient(to top, transparent, hsl(var(--solar-glow) / 0.15), transparent)`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Floating orbs representing solar particles */}
      <div className="solar-orb solar-orb-1" />
      <div className="solar-orb solar-orb-2" />
      <div className="solar-orb solar-orb-3" />
      <div className="solar-orb solar-orb-4" />
      <div className="solar-orb solar-orb-5" />
      
      {/* Gentle wave overlay */}
      <svg
        className="absolute bottom-0 left-0 w-full h-64 opacity-20"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
      >
        <path
          fill="hsl(var(--primary) / 0.1)"
          d="M0,96L48,112C96,128,192,160,288,165.3C384,171,480,149,576,133.3C672,117,768,107,864,122.7C960,139,1056,181,1152,181.3C1248,181,1344,139,1392,117.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          className="animate-[wave_15s_ease-in-out_infinite]"
        />
      </svg>
    </div>
  );
};
