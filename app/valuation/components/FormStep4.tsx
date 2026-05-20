'use client';

import { motion } from 'framer-motion';

interface FormStep4Props {
  formData: any;
  updateFormData: (field: string, value: any) => void;
  errors: any;
}

export default function FormStep4({ formData, updateFormData, errors }: FormStep4Props) {
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
      {/* Nome do responsável */}
      <motion.div variants={itemVariants} className="space-y-3">
        <label className="block text-sm font-medium text-white/80 tracking-wider">
          Nome do Responsável
        </label>
        <input
          type="text"
          value={formData.nomeResponsavel}
          onChange={(e) => updateFormData('nomeResponsavel', e.target.value)}
          placeholder="Seu nome completo"
          className={`w-full bg-white/5 border transition-all duration-300 px-4 py-3 text-white placeholder:text-white/30 focus:outline-none ${
            errors.nomeResponsavel
              ? 'border-red-500/50 focus:border-red-500'
              : 'border-white/10 focus:border-[#b8945a]/50'
          }`}
        />
        {errors.nomeResponsavel && (
          <p className="text-xs text-red-400/70">Este campo é obrigatório</p>
        )}
      </motion.div>

      {/* WhatsApp */}
      <motion.div variants={itemVariants} className="space-y-3">
        <label className="block text-sm font-medium text-white/80 tracking-wider">
          WhatsApp
        </label>
        <input
          type="tel"
          value={formData.whatsapp}
          onChange={(e) => updateFormData('whatsapp', e.target.value)}
          placeholder="(XX) 9XXXX-XXXX"
          className={`w-full bg-white/5 border transition-all duration-300 px-4 py-3 text-white placeholder:text-white/30 focus:outline-none ${
            errors.whatsapp
              ? 'border-red-500/50 focus:border-red-500'
              : 'border-white/10 focus:border-[#b8945a]/50'
          }`}
        />
        {errors.whatsapp && (
          <p className="text-xs text-red-400/70">Este campo é obrigatório</p>
        )}
      </motion.div>

      {/* E-mail */}
      <motion.div variants={itemVariants} className="space-y-3">
        <label className="block text-sm font-medium text-white/80 tracking-wider">
          E-mail
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => updateFormData('email', e.target.value)}
          placeholder="seu@email.com"
          className={`w-full bg-white/5 border transition-all duration-300 px-4 py-3 text-white placeholder:text-white/30 focus:outline-none ${
            errors.email
              ? 'border-red-500/50 focus:border-red-500'
              : 'border-white/10 focus:border-[#b8945a]/50'
          }`}
        />
        {errors.email && (
          <p className="text-xs text-red-400/70">Este campo é obrigatório</p>
        )}
      </motion.div>

      {/* Cidade/Estado */}
      <motion.div variants={itemVariants} className="space-y-3">
        <label className="block text-sm font-medium text-white/80 tracking-wider">
          Cidade/Estado
        </label>
        <input
          type="text"
          value={formData.cidadeEstado}
          onChange={(e) => updateFormData('cidadeEstado', e.target.value)}
          placeholder="Ex: São Paulo, SP"
          className={`w-full bg-white/5 border transition-all duration-300 px-4 py-3 text-white placeholder:text-white/30 focus:outline-none ${
            errors.cidadeEstado
              ? 'border-red-500/50 focus:border-red-500'
              : 'border-white/10 focus:border-[#b8945a]/50'
          }`}
        />
        {errors.cidadeEstado && (
          <p className="text-xs text-red-400/70">Este campo é obrigatório</p>
        )}
      </motion.div>

      {/* Info box */}
      <motion.div
        variants={itemVariants}
        className="p-6 bg-[#b8945a]/5 border border-[#b8945a]/20 rounded-lg"
      >
        <p className="text-sm text-white/70 font-light leading-relaxed">
          <strong className="text-[#b8945a]">Próximo passo:</strong> Após gerar o diagnóstico, um
          consultor especializado da D&M entrará em contato em até 24 horas para discutir os
          resultados e as oportunidades de otimização para sua empresa.
        </p>
      </motion.div>
    </motion.div>
  );
}
