import React from "react";
import { motion } from "motion/react";
import Magnet from "./Magnet";
import FadeIn from "./FadeIn";
import { ContactButton } from "./Buttons";

interface HeroSectionProps {
  onContactClick: () => void;
}

export default function HeroSection({ onContactClick }: HeroSectionProps) {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="hero"
      className="relative w-full h-screen min-h-[600px] flex flex-col justify-between overflow-x-hidden bg-[#0C0C0C]"
      style={{ overflowX: "clip" }}
    >
      {/* 1. Navbar */}
      <FadeIn delay={0} y={-20} duration={0.8} className="w-full z-20">
        <nav
          id="hero-navbar"
          className="flex items-center justify-between px-6 md:px-10 pt-6 md:pt-8 text-[#D7E2EA]"
        >
          {/* Logo / Suman sign */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="font-black tracking-tight text-xl sm:text-2xl hover:opacity-70 transition-opacity cursor-pointer uppercase"
          >
            Suman Mehta
          </button>

          {/* Links */}
          <div className="flex items-center gap-4 sm:gap-6 md:gap-1 tracking-wider font-medium text-sm md:text-lg lg:text-[1.4rem] uppercase">
            <button
              onClick={() => scrollTo("about")}
              className="px-2 transition-opacity duration-200 hover:opacity-70 cursor-pointer"
            >
              About
            </button>
            <span className="opacity-20 select-none text-[10px] md:text-base">/</span>
            <button
              onClick={() => scrollTo("services")}
              className="px-2 transition-opacity duration-200 hover:opacity-70 cursor-pointer"
            >
              Price
            </button>
            <span className="opacity-20 select-none text-[10px] md:text-base">/</span>
            <button
              onClick={() => scrollTo("projects")}
              className="px-2 transition-opacity duration-200 hover:opacity-70 cursor-pointer"
            >
              Projects
            </button>
            <span className="opacity-20 select-none text-[10px] md:text-base">/</span>
            <button
              onClick={onContactClick}
              className="px-2 transition-opacity duration-200 hover:opacity-70 cursor-pointer text-[#B600A8]"
            >
              Contact
            </button>
          </div>
        </nav>
      </FadeIn>

      {/* 2. Hero Heading container */}
      <div className="relative flex-1 flex items-center justify-center w-full z-0 px-4 md:px-10">
        <div className="overflow-hidden w-full flex justify-center">
          <FadeIn delay={0.15} y={40} duration={0.9} className="w-full text-center">
            <h1
              id="hero-massive-heading"
              className="hero-heading font-black uppercase tracking-tight leading-none whitespace-nowrap w-full text-[14vw] sm:text-[15vw] md:text-[16vw] lg:text-[17.5vw] mt-6 sm:mt-4 md:-mt-5 select-none"
            >
              Hi, i&apos;m Suman
            </h1>
          </FadeIn>
        </div>

        {/* 3. Hero Portrait (absolutely centered, with Magnetic effect) */}
        <div
          id="hero-portrait-container"
          className="absolute left-1/2 -translate-x-1/2 z-10 w-[280px] sm:w-[360px] md:w-[440px] lg:w-[520px] 
            top-1/2 -translate-y-1/2 sm:top-auto sm:translate-y-0 sm:bottom-0 pointer-events-auto"
        >
          <FadeIn delay={0.6} y={30} duration={1.1}>
            <Magnet
              padding={150}
              strength={3}
              activeTransition="transform 0.3s ease-out"
              inactiveTransition="transform 0.6s ease-in-out"
              className="w-full max-w-full"
            >
              <img
                src="https://raw.githubusercontent.com/suman-mehta/Bihar-Bijli/refs/heads/main/suman%20mehta%203D.png"
                alt="Portrait of Suman Mehta"
                className="w-full h-auto object-contain pointer-events-none drop-shadow-[0_25px_60px_rgba(182,0,168,0.35)]"
                referrerPolicy="no-referrer"
              />
            </Magnet>
          </FadeIn>
        </div>
      </div>

      {/* 4. Bottom Row */}
      <div className="w-full px-6 md:px-10 pb-7 sm:pb-8 md:pb-10 flex items-end justify-between z-20">
        {/* Left Info paragraph */}
        <div className="overflow-hidden">
          <FadeIn delay={0.35} y={20} duration={0.8}>
            <p
              id="hero-left-desc-p"
              className="text-[#D7E2EA] font-light uppercase tracking-wide leading-snug text-left"
              style={{ fontSize: "clamp(0.75rem, 1.4vw, 1.5rem)", maxWidth: "clamp(160px, 20vw, 260px)" }}
            >
              a 3d creator driven by crafting striking and unforgettable projects
            </p>
          </FadeIn>
        </div>

        {/* Right Button */}
        <div>
          <FadeIn delay={0.5} y={20} duration={0.8}>
            <ContactButton
              id="hero-contact-trigger-btn"
              onClick={onContactClick}
              label="Contact Me"
            />
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
