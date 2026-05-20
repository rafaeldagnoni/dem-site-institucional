'use client';

import { motion } from 'framer-motion';

interface FormStep1Props {
  formData: any;
  updateFormData: (field: string, value: any) => void;
  errors: any;
}

export default function FormStep1({ formData, updateFormData, errors }: FormStep1Props) {
  const segments = [
    'Consultoria',
    'Tecnologia',
    'Comércio',
    'Indústria',
    'Saúde',
    'Educação',
    'Serviços',
    'Outro',
  ];

  const revenueRanges = [
    'Até R$ 500 mil',
    'R$ 500 mil a R$ 2 milhões',
    'R$ 2 milhões a R$ 10 milhões',
    'R$ 10 milhões a R$ 50 milhões',
    'Acima de R$ 50 milhões',
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
      {/* Nome da empresa */}
      <motion.div variants={itemVariants} className="space-y-3">
        <label className="block text-sm font-medium text-white/80 tracking-wider">
          Nome da Empresa
        </label>
        <input
          type="text"
          value={formData.nomeEmpresa}
          onChange={(e) => updateFormData('nomeEmpresa', e.target.value)}
          placeholder="Ex: Tech Solutions Brasil"
          className={`w-full bg-white/5 border transition-all duration-300 px-4 py-3 text-white placeholder:text-white/30 focus:outline-none ${
            errors.nomeEmpresa
              ? 'border-red-500/50 focus:border-red-500'
              : 'border-white/10 focus:border-[#b8945a]/50'
          }`}
        />
        {errors.nomeEmpresa && (
          <p className="text-xs text-red-400/70">Este campo é obrigatório</p>
        )}
      </motion.div>

      {/* Segmento */}
      <motion.div variants={itemVariants} className="space-y-3">
        <label className="block text-sm font-medium text-white/80 tracking-wider">
          Segmento de Atuação
        </label>
        <div className="grid grid-cols-2 gap-3">
          {segments.map((seg) => (
            <button
              key={seg}
              onClick={() => updateFormData('segmento', seg)}
              className={`px-4 py-3 border text-sm font-medium transition-all duration-300 text-left ${
                formData.segmento === seg
                  ? 'border-[#b8945a] bg-[#b8945a]/10 text-[#b8945a]'
                  : 'border-white/10 bg-white/5 text-white/60 hover:border-white/20 hover:text-white'
              }`}
            >
              {seg}
            </button>
          ))}
        </div>
        {errors.segmento && (
          <p className="text-xs text-red-400/70">Selecione um segmento</p>
        )}
      </motion.div>

      {/* Faturamento anual */}
      <motion.div variants={itemVariants} className="space-y-3">
        <label className="block text-sm font-medium text-white/80 tracking-wider">
          Faturamento Anual Aproximado
        </label>
        <div className="space-y-2">
          {revenueRanges.map((range) => (
            <label
              key={range}
              className="flex items-center gap-3 p-3 border border-white/10 cursor-pointer transition-all duration-300 hover:bg-white/5 hover:border-white/20"
            >
              <input
                type="radio"
                name="faturamento"
                value={range}
                checked={formData.faturamento === range}
                onChange={(e) => updateFormData('faturamento', e.target.value)}
                className="w-4 h-4 accent-[#b8945a]"
              />
              <span className="text-sm text-white/70">{range}</span>
            </label>
          ))}
        </div>
        {errors.faturamento && (
          <p className="text-xs text-red-400/70">Selecione um faturamento</p>
        )}
      </motion.div>

      {/* Tempo de operação */}
      <motion.div variants={itemVariants} className="space-y-3">
        <label className="block text-sm font-medium text-white/80 tracking-wider">
          Tempo de Operação
        </label>
        <input
          type="text"
          value={formData.tempoOperacao}
          onChange={(e) => updateFormData('tempoOperacao', e.target.value)}
          placeholder="Ex: 5 anos e 3 meses"
          className={`w-full bg-white/5 border transition-all duration-300 px-4 py-3 text-white placeholder:text-white/30 focus:outline-none ${
            errors.tempoOperacao
              ? 'border-red-500/50 focus:border-red-500'
              : 'border-white/10 focus:border-[#b8945a]/50'
          }`}
        />
        {errors.tempoOperacao && (
          <p className="text-xs text-red-400/70">Este campo é obrigatório</p>
        )}
      </motion.div>

      {/* Número de colaboradores */}
      <motion.div variants={itemVariants} className="space-y-3">
        <label className="block text-sm font-medium text-white/80 tracking-wider">
          Número Aproximado de Colaboradores
        </label>
        <input
          type="number"
          value={formData.colaboradores}
          onChange={(e) => updateFormData('colaboradores', e.target.value)}
          placeholder="Ex: 25"
          className={`w-full bg-white/5 border transition-all duration-300 px-4 py-3 text-white placeholder:text-white/30 focus:outline-none ${
            errors.colaboradores
              ? 'border-red-500/50 focus:border-red-500'
              : 'border-white/10 focus:border-[#b8945a]/50'
          }`}
        />
        {errors.colaboradores && (
          <p className="text-xs text-red-400/70">Este campo é obrigatório</p>
        )}
      </motion.div>
    </motion.div>
  );
}
