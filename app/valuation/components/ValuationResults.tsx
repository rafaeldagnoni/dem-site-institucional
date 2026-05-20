'use client';

import { motion } from 'framer-motion';

interface ResultsProps {
  data: any;
}

export default function ValuationResults({ data }: ResultsProps) {
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

  const scorePercentage = (data.dmValueScore / 100) * 100;

  return (
    <section
      id="results"
      className="bg-gradient-to-br from-[#0a0e0b] via-[#0f1a12] to-[#0a0e0b] py-32 px-[6%] relative overflow-hidden"
    >
      {/* Background accent */}
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#b8945a]/5 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#082c20]/30 rounded-full blur-3xl" />

      <motion.div
        className="max-w-6xl mx-auto relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-20">
          <span className="text-[0.64rem] font-medium tracking-[0.3em] uppercase text-[#b8945a] block mb-8">
            Diagnóstico Preliminar
          </span>
          <h2 className="font-['Playfair_Display'] text-[clamp(2.4rem,4vw,3.8rem)] font-normal leading-[1.08] -tracking-[0.02em] text-white mb-6">
            Seu diagnóstico preliminar está <em className="italic">pronto.</em>
          </h2>
          <p className="text-base text-white/50 font-light max-w-2xl mx-auto">
            Análise realizada em {new Date().toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' })} para <strong className="text-white/70">{data.nomeEmpresa}</strong>
          </p>
        </motion.div>

        {/* Main grid */}
        <div className="grid grid-cols-2 gap-12 mb-20">
          {/* Valuation estimado */}
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/10 rounded-lg p-12 hover:border-[#b8945a]/30 transition-all duration-300"
          >
            <p className="text-sm text-white/40 font-light tracking-wider mb-4">
              FAIXA ESTIMADA DE VALUATION
            </p>
            <h3 className="font-['Playfair_Display'] text-4xl font-normal text-[#b8945a] mb-2 leading-tight">
              {data.valuationFormatted}
            </h3>
            <p className="text-xs text-white/30 font-light">
              Estimativa preliminar baseada em múltiplos de mercado
            </p>
          </motion.div>

          {/* D&M Value Score */}
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/10 rounded-lg p-12 hover:border-[#b8945a]/30 transition-all duration-300 flex flex-col justify-center items-center text-center"
          >
            <p className="text-sm text-white/40 font-light tracking-wider mb-6">
              D&M VALUE SCORE
            </p>

            {/* Circular score */}
            <div className="relative w-32 h-32 mb-6">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                {/* Background circle */}
                <circle
                  cx="60"
                  cy="60"
                  r="54"
                  fill="none"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="8"
                />
                {/* Progress circle */}
                <motion.circle
                  cx="60"
                  cy="60"
                  r="54"
                  fill="none"
                  stroke="#b8945a"
                  strokeWidth="8"
                  strokeDasharray={`${(scorePercentage / 100) * 339.3} 339.3`}
                  initial={{ strokeDasharray: '0 339.3' }}
                  animate={{ strokeDasharray: `${(scorePercentage / 100) * 339.3} 339.3` }}
                  transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-['Playfair_Display'] text-3xl font-normal text-white">
                  {data.dmValueScore}
                </span>
              </div>
            </div>

            <p className="text-xs text-white/40 font-light">
              Nível de maturidade e valor da empresa
            </p>
          </motion.div>
        </div>

        {/* Score breakdown */}
        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/10 rounded-lg p-12 mb-20"
        >
          <h4 className="font-['Playfair_Display'] text-xl font-normal text-white mb-8">
            Análise por Dimensão
          </h4>

          <div className="grid grid-cols-3 gap-8">
            {[
              {
                label: 'Gestão Financeira',
                value: data.scoreBreakdown.gestaoFinanceira,
                max: 20,
              },
              { label: 'Governança', value: data.scoreBreakdown.governanca, max: 15 },
              {
                label: 'Escalabilidade',
                value: data.scoreBreakdown.escalabilidade,
                max: 15,
              },
              { label: 'Geração de Caixa', value: data.scoreBreakdown.caixa, max: 15 },
              {
                label: 'Estrutura Gerencial',
                value: data.scoreBreakdown.estruturaGerencial,
                max: 15,
              },
              {
                label: 'Dependência Operacional',
                value: data.scoreBreakdown.dependencia,
                max: 20,
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + idx * 0.1 }}
              >
                <div className="mb-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-medium text-white/70">{item.label}</span>
                    <span className="text-sm font-['Playfair_Display'] font-normal text-[#b8945a]">
                      {item.value}/{item.max}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-[#b8945a] to-[#c9a76f] rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${(item.value / item.max) * 100}%` }}
                      transition={{ delay: 0.6 + idx * 0.1, duration: 1.2 }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Positive and negative factors */}
        <div className="grid grid-cols-2 gap-12 mb-20">
          {/* Positive factors */}
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-br from-[#b8945a]/5 to-[#b8945a]/[0.01] border border-[#b8945a]/20 rounded-lg p-8"
          >
            <h4 className="font-['Playfair_Display'] text-lg font-normal text-[#b8945a] mb-6">
              ✓ Fatores Positivos
            </h4>
            <ul className="space-y-3">
              {data.positiveFactors.map((factor: string, idx: number) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + idx * 0.1 }}
                  className="text-sm text-white/60 font-light flex items-start gap-3"
                >
                  <span className="text-[#b8945a] mt-1">•</span>
                  <span>{factor}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Negative factors */}
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-br from-red-500/5 to-red-500/[0.01] border border-red-500/20 rounded-lg p-8"
          >
            <h4 className="font-['Playfair_Display'] text-lg font-normal text-red-400 mb-6">
              ⚠ Fatores para Otimizar
            </h4>
            <ul className="space-y-3">
              {data.negativeFactors.map((factor: string, idx: number) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + idx * 0.1 }}
                  className="text-sm text-white/60 font-light flex items-start gap-3"
                >
                  <span className="text-red-400 mt-1">•</span>
                  <span>{factor}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Growth potential */}
        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-r from-[#082c20] to-[#0c3525] border border-white/10 rounded-lg p-12 mb-20"
        >
          <h4 className="font-['Playfair_Display'] text-lg font-normal text-white mb-4">
            Potencial de Valorização Futura
          </h4>
          <p className="text-base leading-[1.8] text-white/60 font-light">
            {data.growthPotential}
          </p>

          {/* Growth percentage visualization */}
          <div className="mt-8 p-6 bg-white/5 border border-white/10 rounded-lg">
            <div className="flex items-end gap-4 h-24">
              <div className="flex-1">
                <div className="text-center mb-3">
                  <span className="text-sm text-white/50 font-light">Cenário Otimista</span>
                </div>
                <motion.div
                  className="w-full bg-gradient-to-t from-[#b8945a] to-[#c9a76f] rounded-t-lg"
                  initial={{ height: 0 }}
                  animate={{ height: `${data.growthPercentageMax * 1.2}px` }}
                  transition={{ delay: 1, duration: 1 }}
                />
                <div className="text-center mt-2">
                  <span className="text-lg font-['Playfair_Display'] font-normal text-[#b8945a]">
                    +{data.growthPercentageMax}%
                  </span>
                </div>
              </div>
              <div className="flex-1">
                <div className="text-center mb-3">
                  <span className="text-sm text-white/50 font-light">Cenário Conservador</span>
                </div>
                <motion.div
                  className="w-full bg-gradient-to-t from-[#b8945a]/50 to-[#c9a76f]/50 rounded-t-lg"
                  initial={{ height: 0 }}
                  animate={{ height: `${data.growthPercentageMin * 1.2}px` }}
                  transition={{ delay: 1.2, duration: 1 }}
                />
                <div className="text-center mt-2">
                  <span className="text-lg font-['Playfair_Display'] font-normal text-[#b8945a]/70">
                    +{data.growthPercentageMin}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Recommendation */}
        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/10 rounded-lg p-12"
        >
          <h4 className="font-['Playfair_Display'] text-lg font-normal text-white mb-4">
            Recomendação Estratégica
          </h4>
          <p className="text-base leading-[1.8] text-white/60 font-light">
            {data.recommendation}
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
