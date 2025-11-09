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
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Subtle radial gradient base */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-sky-blue/10 to-background" />
      
      {/* Animated Sun with glow - parallax effect */}
      <div 
        className="absolute w-48 h-48 rounded-full opacity-30 transition-transform duration-75"
        style={{
          top: `${15 + scrollY * 0.2}%`,
          right: '10%',
          background: `radial-gradient(circle, hsl(var(--solar-glow)), hsl(var(--primary)) 40%, transparent 70%)`,
          transform: `translateY(${scrollY * 0.1}px)`,
          boxShadow: `0 0 80px 20px hsl(var(--solar-glow) / 0.3)`,
        }}
      />
      
      {/* Sun core */}
      <div 
        className="absolute w-24 h-24 rounded-full opacity-40"
        style={{
          top: `calc(${15 + scrollY * 0.2}% + 48px)`,
          right: 'calc(10% + 48px)',
          background: `radial-gradient(circle, hsl(var(--solar-glow) / 0.9), hsl(var(--primary) / 0.6) 50%, transparent 70%)`,
          transform: `translateY(${scrollY * 0.1}px)`,
        }}
      />

      {/* Parallax Clouds - moving gently on scroll */}
      <div 
        className="absolute w-80 h-24 opacity-15 transition-transform duration-100"
        style={{
          top: `${8 + scrollY * 0.15}%`,
          left: '8%',
          transform: `translateY(${scrollY * 0.08}px)`,
        }}
      >
        <svg viewBox="0 0 200 60" className="w-full h-full">
          <ellipse cx="50" cy="30" rx="40" ry="20" fill="hsl(var(--muted-foreground))" opacity="0.4" />
          <ellipse cx="80" cy="25" rx="35" ry="18" fill="hsl(var(--muted-foreground))" opacity="0.5" />
          <ellipse cx="110" cy="30" rx="40" ry="20" fill="hsl(var(--muted-foreground))" opacity="0.4" />
        </svg>
      </div>

      <div 
        className="absolute w-72 h-20 opacity-12 transition-transform duration-100"
        style={{
          top: `${25 + scrollY * 0.25}%`,
          right: '20%',
          transform: `translateY(${scrollY * 0.12}px)`,
        }}
      >
        <svg viewBox="0 0 200 60" className="w-full h-full">
          <ellipse cx="60" cy="28" rx="42" ry="22" fill="hsl(var(--muted-foreground))" opacity="0.5" />
          <ellipse cx="100" cy="24" rx="38" ry="20" fill="hsl(var(--muted-foreground))" opacity="0.6" />
          <ellipse cx="130" cy="30" rx="35" ry="18" fill="hsl(var(--muted-foreground))" opacity="0.4" />
        </svg>
      </div>

      <div 
        className="absolute w-64 h-20 opacity-10 transition-transform duration-100"
        style={{
          top: `${40 + scrollY * 0.18}%`,
          left: '25%',
          transform: `translateY(${scrollY * 0.09}px)`,
        }}
      >
        <svg viewBox="0 0 200 60" className="w-full h-full">
          <ellipse cx="55" cy="26" rx="36" ry="20" fill="hsl(var(--muted-foreground))" opacity="0.4" />
          <ellipse cx="90" cy="28" rx="40" ry="22" fill="hsl(var(--muted-foreground))" opacity="0.5" />
          <ellipse cx="120" cy="24" rx="33" ry="18" fill="hsl(var(--muted-foreground))" opacity="0.35" />
        </svg>
      </div>

      {/* Floating orbs for depth */}
      <div className="solar-orb solar-orb-1" />
      <div className="solar-orb solar-orb-2" />
      <div className="solar-orb solar-orb-3" />
      
      {/* 3D Grass at bottom - multiple layers for depth */}
      <div className="absolute bottom-0 left-0 w-full h-32 md:h-40">
        {/* Back grass layer - darker, smaller */}
        <div 
          className="absolute bottom-0 left-0 w-full h-24 md:h-32"
          style={{
            background: `linear-gradient(to top, hsl(142 40% 35%), transparent)`,
            opacity: 0.3,
          }}
        >
          <svg className="absolute bottom-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 1200 100">
            {[...Array(80)].map((_, i) => (
              <path
                key={`back-${i}`}
                d={`M${i * 15},100 Q${i * 15 + 1},${85 - Math.random() * 15} ${i * 15 + 2},100`}
                fill="hsl(142 35% 30%)"
                opacity={0.4 + Math.random() * 0.2}
                style={{
                  animation: `sway ${3 + Math.random() * 2}s ease-in-out infinite ${Math.random() * 2}s`,
                }}
              />
            ))}
          </svg>
        </div>

        {/* Middle grass layer */}
        <div 
          className="absolute bottom-0 left-0 w-full h-20 md:h-28"
          style={{
            background: `linear-gradient(to top, hsl(142 50% 40%), transparent)`,
            opacity: 0.5,
          }}
        >
          <svg className="absolute bottom-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 1200 100">
            {[...Array(60)].map((_, i) => (
              <path
                key={`mid-${i}`}
                d={`M${i * 20},100 Q${i * 20 + 2},${75 - Math.random() * 20} ${i * 20 + 4},100`}
                fill="hsl(142 45% 38%)"
                opacity={0.5 + Math.random() * 0.2}
                style={{
                  animation: `sway ${2.5 + Math.random() * 1.5}s ease-in-out infinite ${Math.random() * 1.5}s`,
                }}
              />
            ))}
          </svg>
        </div>

        {/* Front grass layer - brightest, tallest */}
        <div 
          className="absolute bottom-0 left-0 w-full h-16 md:h-24"
          style={{
            background: `linear-gradient(to top, hsl(142 60% 45%), transparent)`,
            opacity: 0.7,
          }}
        >
          <svg className="absolute bottom-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 1200 100">
            {[...Array(50)].map((_, i) => (
              <path
                key={`front-${i}`}
                d={`M${i * 24},100 Q${i * 24 + 3},${60 - Math.random() * 25} ${i * 24 + 6},100`}
                fill="hsl(142 55% 42%)"
                opacity={0.6 + Math.random() * 0.3}
                style={{
                  animation: `sway ${2 + Math.random() * 1}s ease-in-out infinite ${Math.random() * 1}s`,
                }}
              />
            ))}
          </svg>
        </div>
      </div>
    </div>
  );
};
