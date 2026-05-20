'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function ValuationHero() {
  const [scrolled, setScrolled] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.85,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const handleScroll = () => {
    const formSection = document.getElementById('valuation-form');
    if (formSection) {
      formSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen pt-[140px] pb-[100px] px-[6%] flex flex-col justify-end overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0c2018] via-[#060e08] to-[#030808] -z-10" />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(184,148,90,.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(184,148,90,.04) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      <motion.div
        className="relative z-10 max-w-[900px]"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Kicker */}
        <motion.div
          variants={itemVariants}
          className="flex items-center gap-4 mb-11"
        >
          <div className="w-8 h-px bg-[#b8945a]" />
          <span className="text-[0.68rem] font-normal tracking-[0.32em] uppercase text-[#b8945a]">
            Diagnóstico Estratégico
          </span>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          variants={itemVariants}
          className="font-['Playfair_Display'] text-[clamp(3.2rem,6.5vw,6.5rem)] font-normal leading-[1.02] -tracking-[0.02em] text-white mb-12"
        >
          Descubra quanto sua empresa pode <em className="italic text-[#b8945a]">valer hoje.</em>
        </motion.h1>

        {/* Hero bottom section */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-2 gap-24 pt-16 border-t border-white/8"
        >
          {/* Left: description */}
          <div className="space-y-6">
            <p className="text-base leading-[1.85] text-white/45 font-light max-w-[420px]">
              Receba uma estimativa preliminar de valuation baseada em indicadores financeiros, maturidade operacional e potencial de crescimento do seu negócio.
            </p>

            {/* Disclaimer */}
            <p className="text-[0.75rem] text-white/40 font-light tracking-[0.01em]">
              Diagnóstico preliminar • Não substitui laudo técnico oficial
            </p>
          </div>

          {/* Right: CTA and metrics */}
          <div className="flex flex-col justify-between gap-8">
            <button
              onClick={handleScroll}
              className="self-start px-7 py-3.5 border border-white/20 text-white text-[0.72rem] font-medium tracking-[0.16em] uppercase transition-all duration-300 hover:border-[#b8945a] hover:text-[#b8945a] flex items-center gap-3.5 group"
            >
              Iniciar Diagnóstico
              <svg
                className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </button>

            {/* Metrics */}
            <div className="flex gap-16">
              <div>
                <span className="font-['Playfair_Display'] text-3xl font-normal text-[#b8945a] block mb-1">
                  150+
                </span>
                <span className="text-[0.75rem] text-white/35 font-light tracking-[0.04em]">
                  Empresas Analisadas
                </span>
              </div>
              <div>
                <span className="font-['Playfair_Display'] text-3xl font-normal text-[#b8945a] block mb-1">
                  8+
                </span>
                <span className="text-[0.75rem] text-white/35 font-light tracking-[0.04em]">
                  Anos de Especialidade
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-[0.7rem] text-white/30 tracking-[0.1em]">SCROLL</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-px h-6 bg-gradient-to-b from-[#b8945a] to-transparent"
          />
        </div>
      </motion.div>
    </section>
  );
}
