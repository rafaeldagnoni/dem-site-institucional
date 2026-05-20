'use client';

import { motion } from 'framer-motion';

export default function HowItWorks() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
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

  const steps = [
    {
      number: '01',
      title: 'Preencha os dados da empresa',
      description: 'Informações básicas sobre sua operação, receitas e indicadores financeiros.',
    },
    {
      number: '02',
      title: 'Nossa metodologia analisa os drivers de valor',
      description: 'Avaliamos maturidade operacional, gestão financeira e potencial de crescimento.',
    },
    {
      number: '03',
      title: 'Receba uma estimativa preliminar',
      description: 'Diagnóstico completo com valuation estimado e recomendações estratégicas.',
    },
  ];

  return (
    <section className="bg-[#0a0e0b] py-32 px-[6%]">
      <motion.div
        className="max-w-7xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-20">
          <span className="text-[0.64rem] font-medium tracking-[0.3em] uppercase text-[#b8945a] block mb-8">
            Processo
          </span>
          <h2 className="font-['Playfair_Display'] text-[clamp(2.4rem,4vw,3.8rem)] font-normal leading-[1.08] -tracking-[0.02em] text-white max-w-3xl">
            Como funciona o <em className="italic">diagnóstico.</em>
          </h2>
        </motion.div>

        {/* Steps grid */}
        <motion.div
          className="grid grid-cols-3 gap-8"
          variants={containerVariants}
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative"
            >
              {/* Card */}
              <div className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/8 rounded-lg p-8 transition-all duration-300 hover:border-[#b8945a]/30 hover:bg-white/[0.05]">
                {/* Step number */}
                <div className="mb-6">
                  <span className="font-['Playfair_Display'] text-5xl font-normal text-[#b8945a] opacity-20 block">
                    {step.number}
                  </span>
                </div>

                {/* Content */}
                <div className="space-y-4">
                  <h3 className="font-['Playfair_Display'] text-xl font-normal text-white leading-tight">
                    {step.title}
                  </h3>
                  <p className="text-sm leading-[1.75] text-white/45 font-light">
                    {step.description}
                  </p>
                </div>

                {/* Hover accent line */}
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#b8945a] transition-all duration-500 group-hover:w-full rounded-full" />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom info */}
        <motion.div
          variants={itemVariants}
          className="mt-20 pt-12 border-t border-white/8 text-center"
        >
          <p className="text-sm text-white/40 font-light">
            Leva apenas <span className="text-white/60">5-10 minutos</span> para completar o diagnóstico preliminar
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
