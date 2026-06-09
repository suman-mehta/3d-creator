/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import HeroSection from "./components/HeroSection";
import MarqueeSection from "./components/MarqueeSection";
import AboutSection from "./components/AboutSection";
import ServicesSection from "./components/ServicesSection";
import ProjectsSection from "./components/ProjectsSection";
import ContactFormModal from "./components/ContactFormModal";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, ArrowRight, Instagram, Twitter, Heart, Check } from "lucide-react";

export default function App() {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const triggerLiveProjectNotice = (projectName: string) => {
    setNotification(projectName);
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  return (
    <div
      id="main-app-wrapper"
      className="relative w-full min-h-screen bg-[#0C0C0C] text-[#D7E2EA] font-sans antialiased selection:bg-[#B600A8] selection:text-white"
      style={{ overflowX: "clip" }}
    >
      {/* 3D Cosmic Stars / Particle Background Decorators */}
      <div className="absolute top-1/4 left-1/4 w-[1px] h-[1px] bg-white opacity-40 shadow-[0_0_12px_1px_rgba(255,255,255,0.8)] rounded-full pointer-events-none" />
      <div className="absolute top-2/3 right-10 w-[2px] h-[2px] bg-white opacity-60 shadow-[0_0_15px_2px_rgba(255,255,255,0.9)] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 left-8 w-[1.5px] h-[1.5px] bg-white opacity-30 shadow-[0_0_10px_1px_rgba(255,255,255,0.7)] rounded-full pointer-events-none" />

      {/* Primary Section Stack */}
      <main id="app-main-content">
        {/* 1. Hero Section */}
        <HeroSection onContactClick={() => setIsContactOpen(true)} />

        {/* 2. Marquee Section */}
        <MarqueeSection />

        {/* 3. About Section */}
        <AboutSection onContactClick={() => setIsContactOpen(true)} />

        {/* 4. Services Section */}
        <ServicesSection />

        {/* 5. Projects Section */}
        <ProjectsSection
          onLiveClick={() => triggerLiveProjectNotice("Simulated Project redirection")}
        />
      </main>

      {/* Styled Footer */}
      <footer id="portfolio-footer" className="bg-[#0C0C0C] text-[#D7E2EA]/50 py-16 px-6 border-t border-[#D7E2EA]/5">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          {/* Brand/Signature */}
          <div className="flex flex-col gap-2">
            <h4 className="text-xl font-bold uppercase text-[#D7E2EA] tracking-tighter">
              Suman Mehta <span className="text-[#B600A8]">•</span> 3D Creator
            </h4>
            <p className="text-xs max-w-[280px] leading-relaxed">
              Crafting striking visual experiences, 3D systems, animations, and conversion-focused designs worldwide.
            </p>
          </div>

          {/* Socials & Email */}
          <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
            <div className="flex items-center gap-4">
              <a
                href="https://x.com/itz_suman_mehta"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#B600A8] transition-colors"
                aria-label="Follow Suman on Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://www.instagram.com/itz_suman_mehta__"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#B600A8] transition-colors"
                aria-label="Follow Suman on Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
            <button
              onClick={() => setIsContactOpen(true)}
              className="text-xs uppercase font-semibold tracking-widest text-[#D7E2EA] hover:text-[#B600A8] transition-colors border-b border-[#D7E2EA]/20 pb-1 cursor-pointer"
            >
              Collaborate With Me
            </button>
          </div>
        </div>

        {/* Bottom Credits Block */}
        <div className="max-w-5xl mx-auto mt-12 pt-6 border-t border-[#D7E2EA]/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} Suman Mehta. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Crafted with <Heart className="h-3.5 w-3.5 text-[#B600A8] fill-[#B600A8]" /> from Katihar
          </p>
        </div>
      </footer>

      {/* Contact Form Modal Trigger overlay */}
      <ContactFormModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />

      {/* Simulated Live Project Success Drawer */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 50, x: "-50%" }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#0C0C0C] border-2 border-green-500 rounded-full px-6 py-3.5 flex items-center gap-3 shadow-2xl min-w-[280px]"
          >
            <div className="rounded-full bg-green-500/20 p-1 text-green-500">
              <Check className="h-4 w-4" />
            </div>
            <div className="text-left">
              <div className="text-xs font-semibold uppercase tracking-wider text-green-400">
                Opening Live Workspace
              </div>
              <p className="text-[10px] text-[#D7E2EA]/70">
                Opening interactive 3D scene mockup sandbox...
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
