import React, { useState, useEffect, useRef } from "react";

interface MagnetProps {
  children: React.ReactNode;
  padding?: number;
  strength?: number;
  activeTransition?: string;
  inactiveTransition?: string;
  className?: string;
}

export default function Magnet({
  children,
  padding = 150,
  strength = 3,
  activeTransition = "transform 0.3s ease-out",
  inactiveTransition = "transform 0.6s ease-in-out",
  className = "",
}: MagnetProps) {
  const [transform, setTransform] = useState("translate3d(0px, 0px, 0px)");
  const [transition, setTransition] = useState(inactiveTransition);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!elementRef.current) return;

      const rect = elementRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Mouse position
      const mouseX = e.clientX;
      const mouseY = e.clientY;

      // Compute distance from center of the element
      const distX = mouseX - centerX;
      const distY = mouseY - centerY;

      // Determine the activation threshold (distance from edge or center)
      // We will check distance of cursor to the nearest point of the element box,
      // or simply from center. A distance from center is much more robust.
      const distance = Math.hypot(distX, distY);
      const radius = Math.max(rect.width, rect.height) / 2;

      // Active if within padding distance from element edge
      if (distance < radius + padding) {
        // Shift towards mouse but divided by strength to create premium "heavy" magnetic effect
        const targetX = distX / strength;
        const targetY = distY / strength;
        
        setTransition(activeTransition);
        setTransform(`translate3d(${targetX}px, ${targetY}px, 0px)`);
      } else {
        // Return to center
        setTransition(inactiveTransition);
        setTransform("translate3d(0px, 0px, 0px)");
      }
    };

    const handleMouseLeave = () => {
      setTransition(inactiveTransition);
      setTransform("translate3d(0px, 0px, 0px)");
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [padding, strength, activeTransition, inactiveTransition]);

  return (
    <div
      id="magnet-wrapper-div"
      ref={elementRef}
      className={`inline-block ${className}`}
      style={{
        transform,
        transition,
        willChange: "transform",
      }}
    >
      {children}
    </div>
  );
}
