import React from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import FadeIn from "./FadeIn";
import { LiveProjectButton } from "./Buttons";
import { ArrowUpRight, Sparkles } from "lucide-react";

const buildProjectUrl = (slug: string) =>
  `https://images.higgs.a` + `i/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_${slug}&w=1280&q=85`;

const PROJECTS_DATA = [
  {
    number: "01",
    name: "Nextlevel Studio",
    category: "Client",
    col1Image1: buildProjectUrl("20260412_055344_5eff02e0-87a5-41ce-b64f-eb08da8f33db.png"),
    col1Image2: buildProjectUrl("20260412_055431_11d841fd-8b41-46a5-82e4-b04f2407a7d8.png"),
    col2Image: buildProjectUrl("20260412_055451_e317bf2d-28d4-48cc-86b0-6f72f25b6327.png"),
  },
  {
    number: "02",
    name: "Aura Brand Identity",
    category: "Personal",
    col1Image1: buildProjectUrl("20260412_055654_911201c5-36d9-4bc6-bac7-331adfce159f.png"),
    col1Image2: buildProjectUrl("20260412_055723_5ceda0b8-d9c2-4665-b2e3-83ba19ba76d1.png"),
    col2Image: buildProjectUrl("20260412_055753_adc5dcbd-a8e6-49c0-b43a-9b030d835cea.png"),
  },
  {
    number: "03",
    name: "Solaris Digital",
    category: "Client",
    col1Image1: buildProjectUrl("20260412_055759_963cfb0b-4bd1-4b0f-9d0a-09bd6cf95b2f.png"),
    col1Image2: buildProjectUrl("20260412_060108_438f781a-9846-4dcc-89ab-c4e6cb830f5b.png"),
    col2Image: buildProjectUrl("20260412_055818_9d062121-ad7e-46b9-999a-1a6a692ef1ee.png"),
  },
];

interface ProjectCardProps {
  key?: React.Key | number;
  project: (typeof PROJECTS_DATA)[0];
  index: number;
  totalCards: number;
  onLiveClick: () => void;
}

function ProjectCard({ project, index, totalCards, onLiveClick }: ProjectCardProps) {
  const cardContainerRef = useRef<HTMLDivElement>(null);

  // Initialize scroll tracking for the specific container. 
  // It starts measuring when the top of the container hits the top of the viewport 
  // and ends when the container scrolls past standard viewport frame.
  const { scrollYProgress } = useScroll({
    target: cardContainerRef as any,
    offset: ["start start", "end start"],
  });

  // Scale calculations specified by user
  const baseScale = 1 - (totalCards - 1 - index) * 0.03;
  // Gently scale down slightly as we scroll past the card, creating beautiful layers
  const scaledOutTransitionValue = baseScale * 0.95;

  const scale = useTransform(scrollYProgress, [0, 1], [baseScale, scaledOutTransitionValue]);

  return (
    <div
      ref={cardContainerRef}
      id={`project-card-container-${index}`}
      className="relative w-full h-[95vh] sm:h-[90vh] md:h-[85vh] mt-10 md:mt-16 flex items-start justify-center"
    >
      <motion.div
        style={{
          scale,
          top: `calc(90px + ${index * 28}px)`,
        }}
        id={`project-card-${index}`}
        className="sticky w-full bg-bg border-2 border-text rounded-3xl p-5 sm:p-7 md:p-10 flex flex-col justify-between overflow-hidden shadow-2xl transition-shadow duration-300 hover:shadow-[0_20px_40px_rgba(215,226,234,0.08)] gap-6"
      >
        {/* Top visual accent blur */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

        {/* Top Row: Number, category, name + Live Button */}
        <div className="flex flex-wrap items-center justify-between w-full border-b border-text/10 pb-5 gap-4">
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Number */}
            <div
              className="font-black text-text leading-none select-none"
              style={{ fontSize: "clamp(2rem, 6vw, 100px)" }}
            >
              {project.number}
            </div>

            {/* Category and Title group */}
            <div>
              <div className="flex items-center gap-1.5 text-primary text-[10px] sm:text-xs font-semibold uppercase tracking-widest mb-0.5 select-none">
                <Sparkles className="h-3 w-3" /> {project.category} project
              </div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold uppercase text-text tracking-tighter select-none">
                {project.name}
              </h3>
            </div>
          </div>

          {/* Ghost button */}
          <LiveProjectButton onClick={onLiveClick} label="Live Project" />
        </div>

        {/* Bottom Row: 2 Column Images Grid */}
        <div className="flex flex-col md:flex-row items-stretch gap-4 sm:gap-6 md:gap-8 w-full flex-1">
          {/* Left column (40% width) - 2 stacked images */}
          <div className="w-full md:w-[40%] flex flex-col gap-4 sm:gap-6 justify-center">
            {/* Top image */}
            <div
              className="overflow-hidden rounded-2xl border border-text/10 group"
              style={{ height: "clamp(120px, 16vw, 220px)" }}
            >
              <img
                src={project.col1Image1}
                alt={`${project.name} Rendering Detail 1`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 select-none"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Bottom image */}
            <div
              className="overflow-hidden rounded-2xl border border-text/10 group"
              style={{ height: "clamp(150px, 22vw, 320px)" }}
            >
              <img
                src={project.col1Image2}
                alt={`${project.name} Rendering Detail 2`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 select-none"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          {/* Right column (60% width) - 1 tall full image */}
          <div className="w-full md:w-[60%] flex min-h-[220px] md:min-h-0">
            <div className="w-full overflow-hidden rounded-2xl border border-text/10 flex-1 group">
              <img
                src={project.col2Image}
                alt={`${project.name} Hero Cover`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 select-none"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

interface ProjectsSectionProps {
  onLiveClick: () => void;
}

export default function ProjectsSection({ onLiveClick }: ProjectsSectionProps) {
  return (
    <section
      id="projects"
      className="relative bg-bg text-text rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] -mt-10 sm:-mt-12 md:-mt-14 px-5 sm:px-8 md:px-10 pb-20 pt-24 z-10 overflow-hidden"
    >
      <div className="max-w-5xl mx-auto">
        {/* Projects Heading */}
        <div className="text-center mb-10 md:mb-16">
          <FadeIn delay={0} y={40} duration={0.8}>
            <h2
              id="projects-section-title"
              className="hero-heading font-black uppercase leading-none tracking-tight text-center"
              style={{ fontSize: "clamp(3rem, 12vw, 160px)" }}
            >
              Project
            </h2>
          </FadeIn>
        </div>

        {/* Stacking Project List */}
        <div className="flex flex-col select-none" id="projects-stack-container">
          {PROJECTS_DATA.map((project, index) => (
            <ProjectCard
              key={index}
              project={project}
              index={index}
              totalCards={PROJECTS_DATA.length}
              onLiveClick={onLiveClick}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
