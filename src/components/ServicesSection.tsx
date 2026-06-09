import React from "react";
import FadeIn from "./FadeIn";

const SERVICES_DATA = [
  {
    number: "01",
    name: "3D Modeling",
    description:
      "Creation of detailed objects, characters, or environments tailored to specific client needs, ideal for games, products, and visualizations.",
  },
  {
    number: "02",
    name: "Rendering",
    description:
      "High-quality, photorealistic renders that showcase designs with custom lighting, textures, and materials to bring concepts to life.",
  },
  {
    number: "03",
    name: "Motion Design",
    description:
      "Dynamic animations and motion graphics that add energy and storytelling to brands, products, and digital experiences.",
  },
  {
    number: "04",
    name: "Branding",
    description:
      "Crafting cohesive visual identities -- from logos to full brand systems -- that communicate a clear and memorable presence.",
  },
  {
    number: "05",
    name: "Web Design",
    description:
      "Designing clean, modern, and conversion-focused websites with attention to layout, typography, and user experience.",
  },
];

export default function ServicesSection() {
  return (
    <section
      id="services"
      className="relative bg-white text-[#0C0C0C] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32 z-10"
    >
      <div className="max-w-5xl mx-auto">
        {/* Services Heading */}
        <div className="text-center mb-16 sm:mb-20 md:mb-28">
          <FadeIn delay={0} y={40} duration={0.8}>
            <h2
              id="services-section-title"
              className="font-black uppercase leading-none tracking-tight text-[#0C0C0C] text-center"
              style={{ fontSize: "clamp(3rem, 12vw, 160px)" }}
            >
              Services
            </h2>
          </FadeIn>
        </div>

        {/* Services Vertical List */}
        <div className="flex flex-col border-t border-[#0C0C0C]/15" id="services-list-container">
          {SERVICES_DATA.map((service, index) => (
            <FadeIn
              key={index}
              delay={index * 0.1}
              y={30}
              duration={0.8}
              id={`service-item-${index}`}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-8 sm:py-10 md:py-12 border-b border-[#0C0C0C]/15 gap-4 sm:gap-8"
            >
              {/* Left Column: Huge Number */}
              <div
                id={`service-number-${index}`}
                className="font-black text-[#0C0C0C] leading-none shrink-0 min-w-[80px] sm:min-w-[120px]"
                style={{ fontSize: "clamp(2.5rem, 8vw, 140px)" }}
              >
                {service.number}
              </div>

              {/* Right Column: Title + Description stacked */}
              <div className="flex-1 flex flex-col items-start" id={`service-content-${index}`}>
                <h3
                  className="font-semibold uppercase text-[#0C0C0C] tracking-tight mb-2 select-none"
                  style={{ fontSize: "clamp(1.1rem, 2.2vw, 2.1rem)" }}
                >
                  {service.name}
                </h3>
                <p
                  className="font-light leading-relaxed text-[#0C0C0C]/60 text-left"
                  style={{ fontSize: "clamp(0.85rem, 1.6vw, 1.25rem)" }}
                >
                  {service.description}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
