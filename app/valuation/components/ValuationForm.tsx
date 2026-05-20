'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FormStep1 from './FormStep1';
import FormStep2 from './FormStep2';
import FormStep3 from './FormStep3';
import FormStep4 from './FormStep4';
import { calculateValuation } from './valuationCalculator';

interface FormData {
  // Etapa 1
  nomeEmpresa: string;
  segmento: string;
  faturamento: string;
  tempoOperacao: string;
  colaboradores: string;

  // Etapa 2
  lucroMensal: string;
  crescimento: string;
  endividamento: string;
  receitaRecorrente: string;
  concentracaoClientes: string;

  // Etapa 3
  dreGerencial: boolean;
  fluxoCaixa: boolean;
  indicadores: boolean;
  erp: boolean;
  precificacao: boolean;
  conselho: boolean;
  gestaoFinanceira: boolean;

  // Etapa 4
  nomeResponsavel: string;
  whatsapp: string;
  email: string;
  cidadeEstado: string;
}

const initialFormData: FormData = {
  nomeEmpresa: '',
  segmento: '',
  faturamento: '',
  tempoOperacao: '',
  colaboradores: '',
  lucroMensal: '',
  crescimento: '',
  endividamento: '',
  receitaRecorrente: '',
  concentracaoClientes: '',
  dreGerencial: false,
  fluxoCaixa: false,
  indicadores: false,
  erp: false,
  precificacao: false,
  conselho: false,
  gestaoFinanceira: false,
  nomeResponsavel: '',
  whatsapp: '',
  email: '',
  cidadeEstado: '',
};

interface ValuationFormProps {
  onSubmit: (data: any) => void;
}

export default function ValuationForm({ onSubmit }: ValuationFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateStep = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (currentStep === 1) {
      if (!formData.nomeEmpresa.trim()) newErrors.nomeEmpresa = true;
      if (!formData.segmento) newErrors.segmento = true;
      if (!formData.faturamento) newErrors.faturamento = true;
      if (!formData.tempoOperacao) newErrors.tempoOperacao = true;
      if (!formData.colaboradores) newErrors.colaboradores = true;
    } else if (currentStep === 2) {
      if (!formData.lucroMensal) newErrors.lucroMensal = true;
      if (!formData.crescimento.trim()) newErrors.crescimento = true;
      if (!formData.endividamento.trim()) newErrors.endividamento = true;
      if (!formData.receitaRecorrente) newErrors.receitaRecorrente = true;
      if (!formData.concentracaoClientes.trim()) newErrors.concentracaoClientes = true;
    } else if (currentStep === 4) {
      if (!formData.nomeResponsavel.trim()) newErrors.nomeResponsavel = true;
      if (!formData.whatsapp.trim()) newErrors.whatsapp = true;
      if (!formData.email.trim()) newErrors.email = true;
      if (!formData.cidadeEstado.trim()) newErrors.cidadeEstado = true;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return false;
    }

    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    setCurrentStep((prev) => prev - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;

    setIsSubmitting(true);
    
    // Simular delay de processamento
    setTimeout(() => {
      const result = calculateValuation(formData);
      onSubmit({ ...formData, ...result });
      setIsSubmitting(false);
      setFormData(initialFormData);
      setCurrentStep(1);
    }, 1500);
  };

  const progressPercentage = (currentStep / 4) * 100;

  return (
    <section
      id="valuation-form"
      className="bg-[#082c20] py-32 px-[6%] min-h-screen flex items-center"
    >
      <div className="max-w-2xl mx-auto w-full">
        {/* Progress bar */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-['Playfair_Display'] text-3xl font-normal text-white">
              {currentStep === 1 && 'Perfil da Empresa'}
              {currentStep === 2 && 'Performance Financeira'}
              {currentStep === 3 && 'Maturidade Gerencial'}
              {currentStep === 4 && 'Informações de Contato'}
            </h2>
            <span className="text-sm text-white/40 font-light">
              Etapa <span className="text-white/60">{currentStep}</span> de 4
            </span>
          </div>

          {/* Progress bar background */}
          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#b8945a] to-[#c9a76f]"
              initial={{ width: '25%' }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
        </div>

        {/* Form content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
          >
            {currentStep === 1 && (
              <FormStep1 formData={formData} updateFormData={updateFormData} errors={errors} />
            )}
            {currentStep === 2 && (
              <FormStep2 formData={formData} updateFormData={updateFormData} errors={errors} />
            )}
            {currentStep === 3 && (
              <FormStep3 formData={formData} updateFormData={updateFormData} />
            )}
            {currentStep === 4 && (
              <FormStep4 formData={formData} updateFormData={updateFormData} errors={errors} />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation buttons */}
        <div className="flex gap-4 mt-12 pt-8 border-t border-white/10">
          {currentStep > 1 && (
            <button
              onClick={handlePrev}
              disabled={isSubmitting}
              className="px-8 py-3 border border-white/20 text-white text-sm font-medium tracking-wider uppercase transition-all duration-300 hover:border-[#b8945a] hover:text-[#b8945a] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Voltar
            </button>
          )}

          {currentStep < 4 ? (
            <button
              onClick={handleNext}
              className="ml-auto px-8 py-3 border border-[#b8945a] bg-[#b8945a] text-[#0a0e0b] text-sm font-medium tracking-wider uppercase transition-all duration-300 hover:bg-[#c9a76f] hover:border-[#c9a76f]"
            >
              Próximo
            </button>
          ) : (
            <motion.button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="ml-auto px-8 py-3 border border-[#b8945a] bg-[#b8945a] text-[#0a0e0b] text-sm font-medium tracking-wider uppercase transition-all duration-300 hover:bg-[#c9a76f] hover:border-[#c9a76f] disabled:opacity-60 disabled:cursor-not-allowed relative overflow-hidden"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isSubmitting ? (
                <motion.span
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  Processando...
                </motion.span>
              ) : (
                'Gerar Diagnóstico'
              )}
            </motion.button>
          )}
        </div>

        {/* Info text */}
        <p className="text-xs text-white/30 mt-8 text-center font-light">
          Seus dados são protegidos e não serão compartilhados. Leia nossa política de privacidade.
        </p>
      </div>
    </section>
  );
}
