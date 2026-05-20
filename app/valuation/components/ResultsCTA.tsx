'use client';

import { motion } from 'framer-motion';

export default function ResultsCTA() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.85,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      'Olá! Gostaria de saber mais sobre o valuation técnico completo para minha empresa.'
    );
    window.open(
      `https://wa.me/551199999999?text=${text}`,
      '_blank'
    );
  };

  return (
    <section className="bg-[#0a0e0b] py-32 px-[6%] relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#b8945a]/3 rounded-full blur-3xl" />
      </div>

      <motion.div
        className="max-w-3xl mx-auto text-center relative z-10"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-12">
          <span className="text-[0.64rem] font-medium tracking-[0.3em] uppercase text-[#b8945a] block mb-6">
            Próximo Passo
          </span>
          <h2 className="font-['Playfair_Display'] text-[clamp(2.2rem,4vw,3.6rem)] font-normal leading-[1.08] -tracking-[0.02em] text-white mb-8">
            Quer um valuation técnico <em className="italic">completo</em> da sua empresa?
          </h2>
        </motion.div>

        {/* Description */}
        <motion.p
          variants={itemVariants}
          className="text-base leading-[1.85] text-white/50 font-light mb-12 max-w-2xl mx-auto"
        >
          Nossa equipe realiza laudos profissionais de valuation com metodologia financeira
          estruturada, análises de fluxo de caixa descontado, múltiplos de mercado e
          diagnóstico estratégico empresarial completo.
        </motion.p>

        {/* Benefits grid */}
        <motion.div
          className="grid grid-cols-3 gap-8 mb-16 py-12 border-y border-white/10"
          variants={containerVariants}
        >
          {[
            {
              number: '1',
              title: 'Análise Profunda',
              description: 'Avaliação técnica rigorosa de todos os ativos e fluxos financeiros',
            },
            {
              number: '2',
              title: 'Relatório Formal',
              description: 'Laudo documentado e assinado por especialistas em valuation',
            },
            {
              number: '3',
              title: 'Aplicação Real',
              description: 'Válido para M&A, captação de investimentos e gestão estratégica',
            },
          ].map((benefit, idx) => (
            <motion.div key={idx} variants={itemVariants} className="space-y-3">
              <div className="text-4xl font-['Playfair_Display'] font-normal text-[#b8945a] opacity-30">
                {benefit.number}
              </div>
              <h4 className="text-sm font-medium text-white tracking-wider">
                {benefit.title}
              </h4>
              <p className="text-xs leading-[1.6] text-white/40 font-light">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div variants={itemVariants} className="flex gap-6 justify-center flex-wrap">
          <button
            onClick={() => {
              const ctaSection = document.createElement('a');
              ctaSection.href = '#';
              ctaSection.click();
              // Aqui você pode integrar com seu sistema de agendamento
              window.location.href = 'https://calendly.com/seu-link'; // Substitua com seu link
            }}
            className="px-10 py-4 border border-[#b8945a] bg-[#b8945a] text-[#0a0e0b] text-sm font-medium tracking-wider uppercase transition-all duration-300 hover:bg-[#c9a76f] hover:border-[#c9a76f] group flex items-center gap-3"
          >
            Agendar Reunião
            <svg
              className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </button>

          <button
            onClick={handleWhatsApp}
            className="px-10 py-4 border border-white/20 text-white text-sm font-medium tracking-wider uppercase transition-all duration-300 hover:border-[#b8945a] hover:text-[#b8945a] group flex items-center gap-3"
          >
            <svg
              className="w-4 h-4"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-9.746 9.798c0 2.734.732 5.41 2.122 7.709L2.77 22.038l8.154-2.144c2.226 1.212 4.72 1.854 7.322 1.854 5.376 0 9.797-4.42 9.823-9.795a9.794 9.794 0 00-9.823-9.755" />
            </svg>
            Falar no WhatsApp
          </button>
        </motion.div>

        {/* Bottom note */}
        <motion.p
          variants={itemVariants}
          className="text-xs text-white/30 mt-8 font-light"
        >
          Sua solicitação será analisada em até 24 horas. Não compartilhamos seus dados com terceiros.
        </motion.p>
      </motion.div>
    </section>
  );
}
