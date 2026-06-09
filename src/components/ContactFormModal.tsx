import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Send, CheckCircle2, MessageSquare, Sparkles } from "lucide-react";

interface ContactFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactFormModal({ isOpen, onClose }: ContactFormModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    projectType: "3d_modeling",
    message: "",
  });

  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      alert("Please fill in all required fields.");
      return;
    }

    setStatus("submitting");

    const serviceLabels: Record<string, string> = {
      "3d_modeling": "3D Modeling Services",
      "rendering": "High Fidelity Rendering",
      "motion_design": "Motion Design & Animation",
      "branding": "Signature Branding Systems",
      "web_design": "Fine Web Crafting",
    };
    const selectedService = serviceLabels[formData.projectType] || formData.projectType;

    // Structure beautiful prefilled message
    const emailSubject = `Project Inquiry: ${selectedService} - ${formData.name}`;
    const emailBody = `Hello Suman,\n\nI am reaching out regarding a project inquiry for: ${selectedService}.\n\nMessage Details:\n"${formData.message}"\n\n--------------------\nLead Contact Details:\nName: ${formData.name}\nEmail: ${formData.email}\n\nSent from your 3D Creator Portfolio Landing Page.`;

    // Construct Mailto link
    const mailtoUrl = `mailto:sumankumardphs438@gmail.com?subject=${encodeURIComponent(
      emailSubject
    )}&body=${encodeURIComponent(emailBody)}`;

    // Programmatic redirect to open native mail tool
    setTimeout(() => {
      window.location.href = mailtoUrl;
      setStatus("success");
    }, 1200);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#0C0C0C]/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="relative w-full max-w-lg overflow-hidden rounded-[2.5rem] border-2 border-[#D7E2EA]/20 bg-[#0C0C0C] p-6 sm:p-8 md:p-10 shadow-2xl"
          >
            {/* Outline Glow Decorator */}
            <div className="absolute -top-12 -left-12 w-32 h-32 bg-[#B600A8]/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-[#7621B0]/20 rounded-full blur-3xl pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={() => {
                if (status === "success") {
                  setFormData({
                    name: "",
                    email: "",
                    projectType: "3d_modeling",
                    message: "",
                  });
                  setStatus("idle");
                }
                onClose();
              }}
              className="absolute right-6 top-6 rounded-full border border-[#D7E2EA]/10 bg-[#0C0C0C] p-2 text-[#D7E2EA] transition-colors hover:border-[#D7E2EA]/30 hover:bg-[#D7E2EA]/10 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            {status === "success" ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-8 text-center"
              >
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-[#B600A8]/20 rounded-full blur-xl scale-125" />
                  <div className="relative rounded-full border-2 border-green-500 bg-[#0C0C0C] p-4 text-green-500">
                    <CheckCircle2 className="h-12 w-12" />
                  </div>
                </div>

                <h3 className="hero-heading text-3xl font-black uppercase tracking-tight mb-2">
                  Message Sent!
                </h3>
                <p className="text-[#D7E2EA]/70 text-sm sm:text-base max-w-[320px] leading-relaxed">
                  Thanks for reaching out! Suman Mehta will review your project details and get back to you shortly.
                </p>

                <div className="mt-6 flex flex-col gap-2 w-full">
                  <a
                    href="https://wa.me/917739105800"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 rounded-2xl bg-green-600/20 hover:bg-green-600/35 border border-green-500/30 text-green-400 py-2.5 text-xs font-semibold uppercase tracking-widest transition-colors cursor-pointer"
                  >
                    🚀 Fast-track on WhatsApp
                  </a>
                </div>

                <button
                  onClick={() => {
                    setFormData({
                      name: "",
                      email: "",
                      projectType: "3d_modeling",
                      message: "",
                    });
                    setStatus("idle");
                    onClose();
                  }}
                  className="mt-6 rounded-full border-2 border-[#D7E2EA] px-8 py-2.5 text-xs font-semibold uppercase tracking-widest text-[#D7E2EA] transition-colors hover:bg-[#D7E2EA]/10 cursor-pointer"
                >
                  Close Window
                </button>
              </motion.div>
            ) : (
              <div>
                <div className="mb-6">
                  <div className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[#B600A8] mb-1">
                    <Sparkles className="h-3.5 w-3.5" /> Direct Inquiry
                  </div>
                  <h2 className="text-3xl font-black uppercase text-[#D7E2EA] tracking-tight">
                    Let&apos;s Create
                  </h2>
                  <p className="text-[#D7E2EA]/60 text-xs sm:text-sm mb-4">
                    Fill out the card below, or reach out directly to Suman Mehta at <a href="mailto:sumankumardphs438@gmail.com" className="text-[#B600A8] hover:underline">sumankumardphs438@gmail.com</a>.
                  </p>

                  {/* Real Contact Badges */}
                  <div className="flex flex-wrap gap-2 pt-1 pb-2">
                    <a
                      href="https://wa.me/917739105800"
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 rounded-full bg-[#D7E2EA]/5 hover:bg-[#D7E2EA]/10 border border-[#D7E2EA]/10 px-3 py-1.5 text-[11px] font-medium text-[#D7E2EA] tracking-wider uppercase transition-colors"
                    >
                      💬 WhatsApp
                    </a>
                    <a
                      href="tel:+917739105800"
                      className="flex items-center gap-1.5 rounded-full bg-[#D7E2EA]/5 hover:bg-[#D7E2EA]/10 border border-[#D7E2EA]/10 px-3 py-1.5 text-[11px] font-medium text-[#D7E2EA] tracking-wider uppercase transition-colors"
                    >
                      📞 +91 7739105800
                    </a>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wider text-[#D7E2EA]/85 mb-1.5">
                      Your Name <span className="text-[#B600A8]">*</span>
                    </label>
                    <input
                      required
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Liam Porter"
                      className="w-full rounded-2xl border border-[#D7E2EA]/10 bg-[#0C0C0C] px-4 py-3 text-sm text-[#D7E2EA] placeholder-[#D7E2EA]/30 outline-none transition-all focus:border-[#B600A8]/50 focus:ring-1 focus:ring-[#B600A8]/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wider text-[#D7E2EA]/85 mb-1.5">
                      Your Email <span className="text-[#B600A8]">*</span>
                    </label>
                    <input
                      required
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="e.g. liam@nextlevel.studio"
                      className="w-full rounded-2xl border border-[#D7E2EA]/10 bg-[#0C0C0C] px-4 py-3 text-sm text-[#D7E2EA] placeholder-[#D7E2EA]/30 outline-none transition-all focus:border-[#B600A8]/50 focus:ring-1 focus:ring-[#B600A8]/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wider text-[#D7E2EA]/85 mb-1.5">
                      Project Requirement
                    </label>
                    <select
                      name="projectType"
                      value={formData.projectType}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-[#D7E2EA]/10 bg-[#0C0C0C] px-4 py-3 text-sm text-[#D7E2EA] outline-none transition-all focus:border-[#B600A8]/50 focus:ring-1 focus:ring-[#B600A8]/50 cursor-pointer [&>option]:bg-[#0C0C0C]"
                    >
                      <option value="3d_modeling">01 - 3D Modeling Services</option>
                      <option value="rendering">02 - High Fidelity Rendering</option>
                      <option value="motion_design">03 - Motion Design & Animation</option>
                      <option value="branding">04 - Signature Branding Systems</option>
                      <option value="web_design">05 - Fine Web Crafting</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wider text-[#D7E2EA]/85 mb-1.5">
                      Your Message <span className="text-[#B600A8]">*</span>
                    </label>
                    <textarea
                      required
                      rows={3}
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Describe the aesthetic, scope, or idea of what you want to bring to life..."
                      className="w-full rounded-2xl border border-[#D7E2EA]/10 bg-[#0C0C0C] px-4 py-3 text-sm text-[#D7E2EA] placeholder-[#D7E2EA]/30 outline-none transition-all focus:border-[#B600A8]/50 focus:ring-1 focus:ring-[#B600A8]/50 resize-none"
                    />
                  </div>

                  <button
                    disabled={status === "submitting"}
                    type="submit"
                    className="relative w-full rounded-full bg-gradient-to-r from-[#B600A8] to-[#7621B0] py-3.5 text-xs font-medium uppercase tracking-widest text-white shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:scale-100 disabled:opacity-40 cursor-pointer flex items-center justify-center gap-2 mt-2"
                  >
                    {status === "submitting" ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Transmitting...
                      </>
                    ) : (
                      <>
                        <Send className="h-3.5 w-3.5" /> Submit Inquiry
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
