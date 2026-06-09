import React from "react";

interface ButtonProps {
  id?: string;
  onClick?: () => void;
  className?: string;
  label?: string;
}

export function ContactButton({ id, onClick, className = "", label = "Contact Me" }: ButtonProps) {
  return (
    <button
      id={id || "contact-button-com"}
      onClick={onClick}
      className={`relative rounded-full font-medium uppercase tracking-widest transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer 
        px-8 py-3 sm:px-10 sm:py-3.5 md:px-12 md:py-4 
        text-[10px] sm:text-xs md:text-sm lg:text-base text-white ${className}`}
      style={{
        background: "linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)",
        boxShadow: "0px 4px 4px rgba(181, 1, 167, 0.25), inset 4px 4px 12px #7721B1",
        outline: "2px solid #FFFFFF",
        outlineOffset: "-3px",
      }}
    >
      {label}
    </button>
  );
}

export function LiveProjectButton({ id, onClick, className = "", label = "Live Project" }: ButtonProps) {
  return (
    <button
      id={id || "live-project-button-com"}
      onClick={onClick}
      className={`rounded-full border-2 border-[#D7E2EA] text-[#D7E2EA] font-medium uppercase tracking-widest transition-colors duration-200 hover:bg-[#D7E2EA]/10 cursor-pointer
        px-8 py-3 sm:px-10 sm:py-3.5 
        text-xs sm:text-sm md:text-base ${className}`}
    >
      {label}
    </button>
  );
}
