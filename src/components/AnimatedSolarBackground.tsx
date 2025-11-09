import { useEffect, useState } from "react";

export const AnimatedSolarBackground = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
      {/* Radial gradient base */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-sky-blue/20 to-background" />
      
      {/* Parallax Sun */}
      <div 
        className="absolute w-64 h-64 rounded-full blur-2xl opacity-40"
        style={{
          top: `${20 + scrollY * 0.3}px`,
          right: `${15}%`,
          background: `radial-gradient(circle, hsl(var(--solar-glow)), hsl(var(--primary)) 40%, transparent 70%)`,
          transform: `translateY(${scrollY * 0.15}px) scale(${1 + scrollY * 0.0002})`,
        }}
      />
      
      {/* Sun core */}
      <div 
        className="absolute w-32 h-32 rounded-full opacity-60"
        style={{
          top: `${84 + scrollY * 0.3}px`,
          right: `calc(15% + 64px)`,
          background: `radial-gradient(circle, hsl(var(--solar-glow) / 0.8), hsl(var(--primary) / 0.5) 50%, transparent 70%)`,
          transform: `translateY(${scrollY * 0.15}px)`,
          boxShadow: `0 0 60px hsl(var(--solar-glow) / 0.4)`,
        }}
      />

      {/* Parallax Clouds */}
      <div 
        className="absolute w-96 h-32 opacity-20"
        style={{
          top: `${100 + scrollY * 0.5}px`,
          left: `10%`,
          transform: `translateY(${scrollY * 0.25}px)`,
        }}
      >
        <svg viewBox="0 0 200 60" className="w-full h-full">
          <ellipse cx="50" cy="30" rx="40" ry="25" fill="hsl(var(--muted-foreground))" opacity="0.3" />
          <ellipse cx="80" cy="25" rx="35" ry="20" fill="hsl(var(--muted-foreground))" opacity="0.4" />
          <ellipse cx="110" cy="30" rx="40" ry="25" fill="hsl(var(--muted-foreground))" opacity="0.3" />
        </svg>
      </div>

      <div 
        className="absolute w-80 h-28 opacity-15"
        style={{
          top: `${250 + scrollY * 0.4}px`,
          right: `25%`,
          transform: `translateY(${scrollY * 0.2}px)`,
        }}
      >
        <svg viewBox="0 0 200 60" className="w-full h-full">
          <ellipse cx="60" cy="30" rx="45" ry="25" fill="hsl(var(--muted-foreground))" opacity="0.4" />
          <ellipse cx="100" cy="25" rx="40" ry="22" fill="hsl(var(--muted-foreground))" opacity="0.5" />
          <ellipse cx="130" cy="32" rx="35" ry="20" fill="hsl(var(--muted-foreground))" opacity="0.3" />
        </svg>
      </div>

      <div 
        className="absolute w-72 h-24 opacity-25"
        style={{
          top: `${450 + scrollY * 0.6}px`,
          left: `30%`,
          transform: `translateY(${scrollY * 0.35}px)`,
        }}
      >
        <svg viewBox="0 0 200 60" className="w-full h-full">
          <ellipse cx="55" cy="28" rx="38" ry="22" fill="hsl(var(--muted-foreground))" opacity="0.3" />
          <ellipse cx="90" cy="30" rx="42" ry="24" fill="hsl(var(--muted-foreground))" opacity="0.4" />
          <ellipse cx="120" cy="26" rx="35" ry="20" fill="hsl(var(--muted-foreground))" opacity="0.35" />
        </svg>
      </div>
      
      {/* Animated sun rays */}
      <div 
        className="absolute w-[800px] h-[800px] opacity-20"
        style={{
          top: `${-200 + scrollY * 0.3}px`,
          right: `calc(15% - 200px)`,
          transform: `translateY(${scrollY * 0.15}px)`,
        }}
      >
        <div className="absolute inset-0 animate-[spin_60s_linear_infinite]">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute top-1/2 left-1/2 w-1 h-full origin-bottom"
              style={{
                transform: `rotate(${i * 45}deg)`,
                background: `linear-gradient(to top, transparent, hsl(var(--solar-glow) / 0.2), transparent)`,
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
