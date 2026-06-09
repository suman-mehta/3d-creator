import React, { useState, useEffect, useRef } from "react";

const ROW_1_GIFS = [
  "https://motionsites.ai/assets/hero-space-voyage-preview-eECLH3Yc.gif",
  "https://motionsites.ai/assets/hero-codenest-preview-Cgppc2qV.gif",
  "https://motionsites.ai/assets/hero-vex-ventures-preview-BczMFIiw.gif",
  "https://motionsites.ai/assets/hero-stellar-ai-v2-preview-DjvxjG3C.gif",
  "https://motionsites.ai/assets/hero-asme-preview-B_nGDnTP.gif",
  "https://motionsites.ai/assets/hero-transform-data-preview-Cx5OU29N.gif",
  "https://motionsites.ai/assets/hero-vitara-preview-Cjz2QYyU.gif",
  "https://motionsites.ai/assets/hero-terra-preview-BFjrCr7T.gif",
  "https://motionsites.ai/assets/hero-skyelite-preview-DHaZIgUv.gif",
  "https://motionsites.ai/assets/hero-aethera-preview-DknSlcTa.gif",
  "https://motionsites.ai/assets/hero-designpro-preview-D8c5_een.gif",
];

const ROW_2_GIFS = [
  "https://motionsites.ai/assets/hero-stellar-ai-preview-D3HL6bw1.gif",
  "https://motionsites.ai/assets/hero-xportfolio-preview-D4A8maiC.gif",
  "https://motionsites.ai/assets/hero-orbit-web3-preview-BXt4OttD.gif",
  "https://motionsites.ai/assets/hero-nexora-preview-cx5HmUgo.gif",
  "https://motionsites.ai/assets/hero-evr-ventures-preview-DZxeVFEX.gif",
  "https://motionsites.ai/assets/hero-planet-orbit-preview-DWAP8Z1P.gif",
  "https://motionsites.ai/assets/hero-new-era-preview-CocuDUm9.gif",
  "https://motionsites.ai/assets/hero-wealth-preview-B70idl_u.gif",
  "https://motionsites.ai/assets/hero-luminex-preview-CxOP7ce6.gif",
  "https://motionsites.ai/assets/hero-celestia-preview-0yO3jXO8.gif",
];

// Tripled lists for infinite-feeling horizontal translation
const ROW_1_TRIPLED = [...ROW_1_GIFS, ...ROW_1_GIFS, ...ROW_1_GIFS];
const ROW_2_TRIPLED = [...ROW_2_GIFS, ...ROW_2_GIFS, ...ROW_2_GIFS];

export default function MarqueeSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const sectionTop = rect.top + window.scrollY;

      // Scroll offset formula provided:
      // (window.scrollY - sectionTop + window.innerHeight) * 0.3
      const calculatedOffset = (window.scrollY - sectionTop + window.innerHeight) * 0.3;
      setOffset(calculatedOffset);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Initialize
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Compute translateX transforms
  // Row 1: Moves RIGHT on scroll (translateX(offset - 200))
  // Row 2: Moves LEFT on scroll (translateX(-(offset - 200)))
  const row1X = offset - 200;
  const row2X = -(offset - 200);

  return (
    <section
      id="marquee"
      ref={sectionRef}
      className="relative w-full bg-[#0C0C0C] pt-24 sm:pt-32 md:pt-40 pb-10 overflow-hidden select-none pointer-events-none"
    >
      <div className="flex flex-col gap-3 w-full">
        {/* Row 1: moves right */}
        <div className="w-full overflow-hidden">
          <div
            id="marquee-row-1"
            className="flex flex-row nowrap gap-3 w-max"
            style={{
              transform: `translate3d(${row1X}px, 0px, 0px)`,
              willChange: "transform",
            }}
          >
            {ROW_1_TRIPLED.map((url, index) => (
              <div
                key={`r1-${index}`}
                id={`r1-tile-${index}`}
                className="w-[280px] h-[180px] sm:w-[350px] sm:h-[220px] md:w-[420px] md:h-[270px] shrink-0 overflow-hidden rounded-2xl bg-[#1A1A1A]"
              >
                <img
                  src={url}
                  alt={`Creative 3D preview row 1 - ${index}`}
                  loading="lazy"
                  className="w-full h-full object-cover grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Row 2: moves left */}
        <div className="w-full overflow-hidden">
          <div
            id="marquee-row-2"
            className="flex flex-row nowrap gap-3 w-max"
            style={{
              transform: `translate3d(${row2X}px, 0px, 0px)`,
              willChange: "transform",
            }}
          >
            {ROW_2_TRIPLED.map((url, index) => (
              <div
                key={`r2-${index}`}
                id={`r2-tile-${index}`}
                className="w-[280px] h-[180px] sm:w-[350px] sm:h-[220px] md:w-[420px] md:h-[270px] shrink-0 overflow-hidden rounded-2xl bg-[#1A1A1A]"
              >
                <img
                  src={url}
                  alt={`Creative 3D preview row 2 - ${index}`}
                  loading="lazy"
                  className="w-full h-full object-cover grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
