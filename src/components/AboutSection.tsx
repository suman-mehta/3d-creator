import React from "react";
import FadeIn from "./FadeIn";
import AnimatedText from "./AnimatedText";
import { ContactButton } from "./Buttons";

interface AboutSectionProps {
  onContactClick: () => void;
}

const getFigmaUrl = (slug: string) => `https://shrug-person-78902957.figma.s` + `ite/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/${slug}`;

export default function AboutSection({ onContactClick }: AboutSectionProps) {
  return (
    <section
      id="about"
      className="relative min-h-screen w-full flex flex-col items-center justify-center px-5 sm:px-8 md:px-10 py-20 bg-bg overflow-hidden"
    >
      {/* Decorative Corner 3D Images grouped into 2 animation triggers */}
      {/* Left Decor Group */}
      <FadeIn
        delay={0.1}
        x={-80}
        y={0}
        duration={0.9}
        className="absolute inset-0 pointer-events-none z-10 select-none"
      >
        {/* Top-Left Moon Image */}
        <div className="absolute top-[4%] left-[1%] sm:left-[2%] md:left-[4%] w-[120px] sm:w-[160px] md:w-[210px]">
          <img
            src={getFigmaUrl("moon_icon.11395d36.png")}
            alt="3D Decorative Moon"
            className="w-full h-auto object-contain drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Bottom-Left 3D Object */}
        <div className="absolute bottom-[8%] left-[3%] sm:left-[6%] md:left-[10%] w-[100px] sm:w-[140px] md:w-[180px]">
          <img
            src={getFigmaUrl("p59_1.4659672e.png")}
            alt="3D Abstract Object"
            className="w-full h-auto object-contain drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
            referrerPolicy="no-referrer"
          />
        </div>
      </FadeIn>

      {/* Right Decor Group */}
      <FadeIn
        delay={0.2}
        x={80}
        y={0}
        duration={0.9}
        className="absolute inset-0 pointer-events-none z-10 select-none"
      >
        {/* Top-Right Lego Image */}
        <div className="absolute top-[4%] right-[1%] sm:right-[2%] md:right-[4%] w-[120px] sm:w-[160px] md:w-[210px]">
          <img
            src={getFigmaUrl("lego_icon-1.703bb594.png")}
            alt="3D Decorative Lego"
            className="w-full h-auto object-contain drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Bottom-Right 3D Group */}
        <div className="absolute bottom-[8%] right-[3%] sm:right-[6%] md:right-[10%] w-[130px] sm:w-[170px] md:w-[220px]">
          <img
            src={getFigmaUrl("Group_134-1.2e04f3ce.png")}
            alt="3D Geometry Group"
            className="w-full h-auto object-contain drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
            referrerPolicy="no-referrer"
          />
        </div>
      </FadeIn>

      {/* Center Block Layout */}
      <div className="flex flex-col items-center justify-center text-center max-w-4xl z-20 px-4">
        {/* About heading */}
        <div className="mb-10 sm:mb-14 md:mb-16">
          <FadeIn delay={0} y={40} duration={0.8}>
            <h2
              id="about-headline"
              className="hero-heading font-black uppercase leading-none tracking-tight select-none"
              style={{ fontSize: "clamp(3rem, 12vw, 160px)" }}
            >
              About me
            </h2>
          </FadeIn>
        </div>

        {/* Animated paragraph */}
        <div className="max-w-[560px] flex justify-center mb-16 sm:mb-20 md:mb-24">
          <AnimatedText
            text="I engineer custom-coded 3D web environments. By fusing rigid mathematical geometry with highly responsive scroll physics, I help brands replace generic template layouts with opinionated, interactive spatial interfaces that run flawlessly across devices."
            className="text-text font-medium text-center leading-relaxed text-base sm:text-lg md:text-xl"
          />
        </div>

        {/* Contact Me Trigger */}
        <div>
          <FadeIn delay={0.1} y={20} duration={0.8}>
            <ContactButton onClick={onContactClick} label="Contact Me" />
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
