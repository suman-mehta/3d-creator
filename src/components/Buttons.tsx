import React from "react";

interface ButtonProps {
  id?: string;
  onClick?: () => void;
  className?: string;
  label?: string;
}

export function ContactButton({ id, onClick, className = "", label = "Contact Me" }: ButtonProps) {
  return (
    <button className={`focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none focus-visible:ring-offset-2 focus-visible:ring-offset-bg relative rounded-full font-semibold uppercase tracking-widest transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer 
        px-8 py-3 sm:px-10 sm:py-3.5 md:px-12 md:py-4 
        text-[10px] sm:text-xs md:text-sm lg:text-base text-white
        bg-gradient-to-r from-secondary via-primary to-accent
        shadow-[0_4px_12px_rgba(182,0,168,0.25)]
        outline-none border-2 border-white/90 ${className}`}
      id={id || "contact-button-com"}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

export function LiveProjectButton({ id, onClick, className = "", label = "Live Project" }: ButtonProps) {
  return (
    <button className={`focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none focus-visible:ring-offset-2 focus-visible:ring-offset-bg rounded-full border-2 border-text text-text font-medium uppercase tracking-widest transition-colors duration-200 hover:bg-text/10 cursor-pointer
        px-8 py-3 sm:px-10 sm:py-3.5 text-xs sm:text-sm md:text-base ${className}`}
      id={id || "live-project-button-com"}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

