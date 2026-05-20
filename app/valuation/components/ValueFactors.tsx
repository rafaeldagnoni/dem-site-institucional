'use client';

import { motion } from 'framer-motion';

export default function ValueFactors() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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

  const factors = [
    {
      icon: '📈',
      title: 'Margem Operacional',
      description: 'Rentabilidade estruturada reflete qualidade do negócio e eficiência operacional.',
    },
    {
      icon: '💰',
      title: 'Geração de Caixa',
      description: 'Capacidade comprovada de gerar fluxo de caixa positivo e sustentável.',
    },
    {
      icon: '🔄',
      title: 'Receita Recorrente',
      description: 'Receitas previsíveis e recorrentes aumentam significativamente a valorização.',
    },
    {
      icon: '🏛️',
      title: 'Governança',
      description: 'Estrutura de decisão clara e processos bem definidos agregam valor.',
    },
    {
      icon: '📊',
      title: 'Organização Financeira',
      description: 'Controles, indicadores e gestão profissionalizada reduzem riscos.',
    },
    {
      icon: '🚀',
      title: 'Escalabilidade',
      description: 'Modelo de negócio preparado para crescimento sem proporcional aumento de custos.',
    },
    {
      icon: '👥',
      title: 'Baixa Dependência dos Sócios',
      description: 'Empresa capaz de operar independentemente da presença dos fundadores.',
    },
    {
      icon: '📉',
      title: 'Crescimento Previsível',
      description: 'Trajetória de crescimento sustentável e previsível em médio-longo prazo.',
    },
  ];

  return (
    <section className="bg-[#f5f3ee] text-[#0a0e0b] py-32 px-[6%]">
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
            Fatores de Valor
          </span>
          <h2 className="font-['Playfair_Display'] text-[clamp(2.4rem,4vw,3.8rem)] font-normal leading-[1.08] -tracking-[0.02em] text-[#0a0e0b] max-w-3xl">
            O que faz uma empresa <em className="italic">valer mais.</em>
          </h2>
        </motion.div>

        {/* Factors grid */}
        <motion.div
          className="grid grid-cols-2 gap-12"
          variants={containerVariants}
        >
          {factors.map((factor, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group pb-8 border-b border-[#0a0e0b]/10 transition-all duration-300 hover:pb-6"
            >
              {/* Icon and title */}
              <div className="flex items-start gap-4 mb-4">
                <span className="text-4xl leading-none mt-1">{factor.icon}</span>
                <h3 className="font-['Playfair_Display'] text-lg font-normal text-[#0a0e0b] leading-tight group-hover:text-[#b8945a] transition-colors duration-300">
                  {factor.title}
                </h3>
              </div>

              {/* Description */}
              <p className="text-sm leading-[1.75] text-[#6b6560] font-light ml-14">
                {factor.description}
              </p>

              {/* Accent line on hover */}
              <div className="h-0.5 bg-[#b8945a] w-0 group-hover:w-12 transition-all duration-500 mt-4 ml-14" />
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA section */}
        <motion.div
          variants={itemVariants}
          className="mt-24 pt-16 border-t border-[#0a0e0b]/10 text-center"
        >
          <p className="text-base leading-[1.85] text-[#4a4540] font-light mb-8 max-w-2xl mx-auto">
            Quanto maior a presença desses fatores em sua empresa,{' '}
            <strong className="text-[#0a0e0b] font-medium">maior o valuation estimado</strong> e o
            múltiplo de mercado.
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
