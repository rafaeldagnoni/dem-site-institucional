'use client';

import { motion } from 'framer-motion';

interface FormStep3Props {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

export default function FormStep3({ formData, updateFormData }: FormStep3Props) {
  const fields = [
    {
      key: 'dreGerencial',
      label: 'Possui DRE gerencial estruturada?',
      description: 'Demonstração de Resultado do Exercício para gestão interna',
    },
    {
      key: 'fluxoCaixa',
      label: 'Fluxo de caixa projetado?',
      description: 'Previsão de entrada e saída de recursos',
    },
    {
      key: 'indicadores',
      label: 'Indicadores e KPIs definidos?',
      description: 'Métricas para acompanhamento da performance',
    },
    {
      key: 'erp',
      label: 'ERP integrado?',
      description: 'Sistema de gestão empresarial implementado',
    },
    {
      key: 'precificacao',
      label: 'Precificação estruturada?',
      description: 'Método sistemático para definir preços',
    },
    {
      key: 'conselho',
      label: 'Conselho/reuniões gerenciais?',
      description: 'Governance e processos decisórios formalizados',
    },
    {
      key: 'gestaoFinanceira',
      label: 'Gestão financeira profissionalizada?',
      description: 'Controles e processos financeiros estruturados',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
      <p className="text-sm text-white/50 mb-8 font-light">
        Marque os itens que sua empresa possui implementados:
      </p>

      {fields.map((field) => (
        <motion.div key={field.key} variants={itemVariants}>
          <label className="flex items-start gap-4 p-4 border border-white/10 cursor-pointer transition-all duration-300 hover:bg-white/[0.02] hover:border-white/20 group">
            <input
              type="checkbox"
              checked={formData[field.key]}
              onChange={(e) => updateFormData(field.key, e.target.checked)}
              className="w-5 h-5 mt-1 accent-[#b8945a] cursor-pointer flex-shrink-0"
            />
            <div className="flex-1">
              <p className="text-sm font-medium text-white group-hover:text-[#b8945a] transition-colors duration-300">
                {field.label}
              </p>
              <p className="text-xs text-white/40 mt-1 font-light">{field.description}</p>
            </div>
          </label>
        </motion.div>
      ))}

      {/* Summary */}
      <motion.div
        variants={itemVariants}
        className="mt-12 p-6 bg-white/[0.03] border border-white/8 rounded-lg"
      >
        <p className="text-xs text-white/50 font-light mb-3">
          <strong className="text-white/70">Score de Maturidade:</strong>
        </p>
        <div className="text-2xl font-['Playfair_Display'] font-normal text-[#b8945a] mb-2">
          {Math.round(
            (Object.values(formData)
              .slice(7, 14)
              .filter((v) => v === true).length / 7) *
              100
          )}
          %
        </div>
        <p className="text-xs text-white/40">
          Dos 7 pilares de maturidade gerencial implementados
        </p>
      </motion.div>
    </motion.div>
  );
}
