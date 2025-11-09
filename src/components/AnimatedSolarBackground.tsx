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
      {/* Dark dramatic sky with smoke */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-orange-900/40 to-red-900/30" />
      
      {/* Massive explosion effects */}
      <div 
        className="absolute explosion-burst explosion-1"
        style={{
          transform: `translateY(${scrollY * 0.1}px) scale(${1 + Math.sin(Date.now() / 1000) * 0.1})`,
        }}
      />
      <div 
        className="absolute explosion-burst explosion-2"
        style={{
          transform: `translateY(${scrollY * 0.15}px) scale(${1 + Math.cos(Date.now() / 800) * 0.15})`,
        }}
      />
      <div 
        className="absolute explosion-burst explosion-3"
        style={{
          transform: `translateY(${scrollY * 0.2}px) scale(${1 + Math.sin(Date.now() / 1200) * 0.12})`,
        }}
      />
      
      {/* Fire plumes */}
      <div className="absolute fire-plume fire-plume-1" />
      <div className="absolute fire-plume fire-plume-2" />
      <div className="absolute fire-plume fire-plume-3" />
      
      {/* Smoke clouds */}
      <div 
        className="absolute smoke-cloud smoke-1"
        style={{ transform: `translateY(${scrollY * 0.25}px) translateX(${scrollY * 0.05}px)` }}
      />
      <div 
        className="absolute smoke-cloud smoke-2"
        style={{ transform: `translateY(${scrollY * 0.3}px) translateX(${-scrollY * 0.08}px)` }}
      />
      <div 
        className="absolute smoke-cloud smoke-3"
        style={{ transform: `translateY(${scrollY * 0.2}px) translateX(${scrollY * 0.06}px)` }}
      />
      
      {/* Car silhouettes */}
      <div 
        className="absolute car-silhouette car-1"
        style={{ transform: `translateX(${scrollY * 0.4}px)` }}
      >
        <svg viewBox="0 0 100 40" className="w-full h-full fill-black/60">
          <path d="M10,30 L15,20 L25,18 L35,18 L45,20 L50,30 L85,30 L88,25 L90,30 Z M20,32 A4,4 0 1,1 20,24 A4,4 0 1,1 20,32 Z M75,32 A4,4 0 1,1 75,24 A4,4 0 1,1 75,32 Z" />
        </svg>
      </div>
      
      <div 
        className="absolute motorcycle-silhouette moto-1"
        style={{ transform: `translateX(${-scrollY * 0.5}px) scaleX(-1)` }}
      >
        <svg viewBox="0 0 80 40" className="w-full h-full fill-black/70">
          <circle cx="15" cy="30" r="8" />
          <circle cx="60" cy="30" r="8" />
          <path d="M15,30 L25,15 L35,12 L45,15 L55,20 L60,30 M35,12 L38,8 L42,8 L45,12" />
        </svg>
      </div>
      
      {/* Debris particles */}
      <div className="debris-field">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="debris-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>
      
      {/* Sparks and embers */}
      <div className="spark-field">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="spark"
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${20 + Math.random() * 60}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${1 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>
      
      {/* Heat distortion waves */}
      <div className="heat-wave heat-wave-1" />
      <div className="heat-wave heat-wave-2" />
      
      {/* Ground with tire marks and destruction */}
      <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-black/80 via-gray-900/60 to-transparent" />
      <svg
        className="absolute bottom-0 left-0 w-full h-32"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 100"
        preserveAspectRatio="none"
      >
        <path
          fill="url(#groundGradient)"
          d="M0,50 L120,45 L240,52 L360,48 L480,50 L600,47 L720,51 L840,49 L960,50 L1080,48 L1200,51 L1320,49 L1440,50 L1440,100 L0,100 Z"
        />
        <defs>
          <linearGradient id="groundGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(20,20,20,0.9)" />
            <stop offset="100%" stopColor="rgba(0,0,0,1)" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};
