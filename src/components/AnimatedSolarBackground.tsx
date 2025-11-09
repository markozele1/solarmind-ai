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
      
      {/* Enhanced Animated Sun */}
      <div 
        className="absolute w-80 h-80 rounded-full blur-3xl opacity-50 animate-pulse"
        style={{
          top: `${20 + scrollY * 0.3}px`,
          right: `${12}%`,
          background: `radial-gradient(circle, hsl(var(--solar-glow)), hsl(var(--primary)) 30%, hsl(var(--primary) / 0.5) 50%, transparent 75%)`,
          transform: `translateY(${scrollY * 0.15}px) scale(${1 + scrollY * 0.0002})`,
          animation: 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        }}
      />
      
      {/* Sun core with glow */}
      <div 
        className="absolute w-40 h-40 rounded-full opacity-70"
        style={{
          top: `${90 + scrollY * 0.3}px`,
          right: `calc(12% + 80px)`,
          background: `radial-gradient(circle, hsl(45 100% 60%), hsl(var(--solar-glow) / 0.9) 40%, hsl(var(--primary) / 0.6) 60%, transparent 75%)`,
          transform: `translateY(${scrollY * 0.15}px)`,
          boxShadow: `0 0 80px hsl(var(--solar-glow) / 0.5), 0 0 120px hsl(var(--primary) / 0.3)`,
        }}
      />
      
      {/* Inner sun highlight */}
      <div 
        className="absolute w-24 h-24 rounded-full opacity-90"
        style={{
          top: `${98 + scrollY * 0.3}px`,
          right: `calc(12% + 88px)`,
          background: `radial-gradient(circle, hsl(50 100% 70%), hsl(45 100% 60%) 50%, transparent 70%)`,
          transform: `translateY(${scrollY * 0.15}px)`,
          boxShadow: `0 0 40px hsl(50 100% 70% / 0.6)`,
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
      
      {/* 3D Grass along bottom edge */}
      <div className="absolute bottom-0 left-0 w-full h-32 overflow-hidden">
        {/* Grass layer 1 - darkest/back */}
        <div className="absolute bottom-0 left-0 w-full h-24 opacity-60">
          {[...Array(80)].map((_, i) => (
            <div
              key={`grass1-${i}`}
              className="absolute bottom-0"
              style={{
                left: `${i * 1.25}%`,
                width: '2px',
                height: `${15 + Math.sin(i * 0.8) * 8}px`,
                background: 'linear-gradient(to top, hsl(120 40% 25%), hsl(120 50% 35%))',
                transform: `rotate(${Math.sin(i * 0.5) * 8}deg) translateY(${Math.sin(i * 0.3) * 2}px)`,
                transformOrigin: 'bottom',
              }}
            />
          ))}
        </div>
        
        {/* Grass layer 2 - medium */}
        <div className="absolute bottom-0 left-0 w-full h-28 opacity-75">
          {[...Array(100)].map((_, i) => (
            <div
              key={`grass2-${i}`}
              className="absolute bottom-0"
              style={{
                left: `${i * 1}%`,
                width: '2.5px',
                height: `${18 + Math.cos(i * 0.7) * 10}px`,
                background: 'linear-gradient(to top, hsl(120 45% 30%), hsl(120 55% 40%))',
                transform: `rotate(${Math.cos(i * 0.4) * 10}deg) translateY(${Math.cos(i * 0.25) * 3}px)`,
                transformOrigin: 'bottom',
                animation: `sway ${3 + (i % 3)}s ease-in-out infinite ${i * 0.1}s`,
              }}
            />
          ))}
        </div>
        
        {/* Grass layer 3 - lightest/front */}
        <div className="absolute bottom-0 left-0 w-full h-32 opacity-90">
          {[...Array(120)].map((_, i) => (
            <div
              key={`grass3-${i}`}
              className="absolute bottom-0"
              style={{
                left: `${i * 0.83}%`,
                width: '3px',
                height: `${22 + Math.sin(i * 0.6) * 12}px`,
                background: 'linear-gradient(to top, hsl(120 50% 35%), hsl(120 60% 45%), hsl(120 65% 50%))',
                transform: `rotate(${Math.sin(i * 0.35) * 12}deg) translateY(${Math.sin(i * 0.2) * 4}px)`,
                transformOrigin: 'bottom',
                animation: `sway ${2.5 + (i % 4)}s ease-in-out infinite ${i * 0.15}s`,
                filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
