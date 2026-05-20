'use client';

import { motion } from 'framer-motion';

interface FormStep2Props {
  formData: any;
  updateFormData: (field: string, value: any) => void;
  errors: any;
}

export default function FormStep2({ formData, updateFormData, errors }: FormStep2Props) {
  const profitRanges = [
    'Prejuízo',
    'Até R$ 20 mil',
    'R$ 20 mil a R$ 100 mil',
    'R$ 100 mil a R$ 500 mil',
    'Acima de R$ 500 mil',
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
      {/* Lucro médio mensal */}
      <motion.div variants={itemVariants} className="space-y-3">
        <label className="block text-sm font-medium text-white/80 tracking-wider">
          Lucro Médio Mensal Aproximado
        </label>
        <div className="space-y-2">
          {profitRanges.map((range) => (
            <label
              key={range}
              className="flex items-center gap-3 p-3 border border-white/10 cursor-pointer transition-all duration-300 hover:bg-white/5 hover:border-white/20"
            >
              <input
                type="radio"
                name="lucroMensal"
                value={range}
                checked={formData.lucroMensal === range}
                onChange={(e) => updateFormData('lucroMensal', e.target.value)}
                className="w-4 h-4 accent-[#b8945a]"
              />
              <span className="text-sm text-white/70">{range}</span>
            </label>
          ))}
        </div>
        {errors.lucroMensal && (
          <p className="text-xs text-red-400/70">Selecione uma opção</p>
        )}
      </motion.div>

      {/* Crescimento anual */}
      <motion.div variants={itemVariants} className="space-y-3">
        <label className="block text-sm font-medium text-white/80 tracking-wider">
          Crescimento Anual da Empresa
        </label>
        <input
          type="text"
          value={formData.crescimento}
          onChange={(e) => updateFormData('crescimento', e.target.value)}
          placeholder="Ex: 15% ao ano"
          className={`w-full bg-white/5 border transition-all duration-300 px-4 py-3 text-white placeholder:text-white/30 focus:outline-none ${
            errors.crescimento
              ? 'border-red-500/50 focus:border-red-500'
              : 'border-white/10 focus:border-[#b8945a]/50'
          }`}
        />
        {errors.crescimento && (
          <p className="text-xs text-red-400/70">Este campo é obrigatório</p>
        )}
      </motion.div>

      {/* Endividamento */}
      <motion.div variants={itemVariants} className="space-y-3">
        <label className="block text-sm font-medium text-white/80 tracking-wider">
          Endividamento Atual
        </label>
        <input
          type="text"
          value={formData.endividamento}
          onChange={(e) => updateFormData('endividamento', e.target.value)}
          placeholder="Ex: 30% da receita ou baixo/médio/alto"
          className={`w-full bg-white/5 border transition-all duration-300 px-4 py-3 text-white placeholder:text-white/30 focus:outline-none ${
            errors.endividamento
              ? 'border-red-500/50 focus:border-red-500'
              : 'border-white/10 focus:border-[#b8945a]/50'
          }`}
        />
        {errors.endividamento && (
          <p className="text-xs text-red-400/70">Este campo é obrigatório</p>
        )}
      </motion.div>

      {/* Receita recorrente */}
      <motion.div variants={itemVariants} className="space-y-3">
        <label className="block text-sm font-medium text-white/80 tracking-wider">
          Possui Receita Recorrente?
        </label>
        <div className="grid grid-cols-3 gap-3">
          {['Sim', 'Parcial', 'Não'].map((option) => (
            <button
              key={option}
              onClick={() => updateFormData('receitaRecorrente', option)}
              className={`px-4 py-3 border text-sm font-medium transition-all duration-300 ${
                formData.receitaRecorrente === option
                  ? 'border-[#b8945a] bg-[#b8945a]/10 text-[#b8945a]'
                  : 'border-white/10 bg-white/5 text-white/60 hover:border-white/20 hover:text-white'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
        {errors.receitaRecorrente && (
          <p className="text-xs text-red-400/70">Selecione uma opção</p>
        )}
      </motion.div>

      {/* Concentração de clientes */}
      <motion.div variants={itemVariants} className="space-y-3">
        <label className="block text-sm font-medium text-white/80 tracking-wider">
          Carteira de Clientes Concentrada?
        </label>
        <input
          type="text"
          value={formData.concentracaoClientes}
          onChange={(e) => updateFormData('concentracaoClientes', e.target.value)}
          placeholder="Ex: 3 clientes representam 60% ou Bem distribuída"
          className={`w-full bg-white/5 border transition-all duration-300 px-4 py-3 text-white placeholder:text-white/30 focus:outline-none ${
            errors.concentracaoClientes
              ? 'border-red-500/50 focus:border-red-500'
              : 'border-white/10 focus:border-[#b8945a]/50'
          }`}
        />
        {errors.concentracaoClientes && (
          <p className="text-xs text-red-400/70">Este campo é obrigatório</p>
        )}
      </motion.div>
    </motion.div>
  );
}
