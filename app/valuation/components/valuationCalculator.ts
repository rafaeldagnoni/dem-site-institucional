// valuationCalculator.ts

interface FormData {
  nomeEmpresa: string;
  segmento: string;
  faturamento: string;
  tempoOperacao: string;
  colaboradores: string;
  lucroMensal: string;
  crescimento: string;
  endividamento: string;
  receitaRecorrente: string;
  concentracaoClientes: string;
  dreGerencial: boolean;
  fluxoCaixa: boolean;
  indicadores: boolean;
  erp: boolean;
  precificacao: boolean;
  conselho: boolean;
  gestaoFinanceira: boolean;
  nomeResponsavel: string;
  whatsapp: string;
  email: string;
  cidadeEstado: string;
}

interface ValuationResult {
  valuationMin: number;
  valuationMax: number;
  valuationFormatted: string;
  dmValueScore: number;
  scoreBreakdown: {
    gestaoFinanceira: number;
    governanca: number;
    escalabilidade: number;
    caixa: number;
    estruturaGerencial: number;
    dependencia: number;
  };
  positiveFactors: string[];
  negativeFactors: string[];
  growthPotential: string;
  growthPercentageMin: number;
  growthPercentageMax: number;
  recommendation: string;
}

export function calculateValuation(formData: FormData): ValuationResult {
  // ============================================================================
  // 1. EXTRAIR LUCRO MENSAL ESTIMADO
  // ============================================================================
  const lucroMensalMap: { [key: string]: number } = {
    'Prejuízo': 0,
    'Até R$ 20 mil': 10000,
    'R$ 20 mil a R$ 100 mil': 60000,
    'R$ 100 mil a R$ 500 mil': 300000,
    'Acima de R$ 500 mil': 750000,
  };

  const lucroMensal = lucroMensalMap[formData.lucroMensal] || 0;
  const lucroAnual = lucroMensal * 12;

  // ============================================================================
  // 2. DETERMINAR PORTE (SIZE CLASS)
  // ============================================================================
  const faturamentoMap: { [key: string]: number } = {
    'Até R$ 500 mil': 250000,
    'R$ 500 mil a R$ 2 milhões': 1250000,
    'R$ 2 milhões a R$ 10 milhões': 6000000,
    'R$ 10 milhões a R$ 50 milhões': 30000000,
    'Acima de R$ 50 milhões': 75000000,
  };

  const faturamentoEstimado = faturamentoMap[formData.faturamento] || 1000000;

  let sizeClass: 'pequena' | 'media' | 'estruturada' = 'pequena';
  if (faturamentoEstimado >= 10000000) {
    sizeClass = 'estruturada';
  } else if (faturamentoEstimado >= 2000000) {
    sizeClass = 'media';
  }

  // ============================================================================
  // 3. MÚLTIPLO BASE POR PORTE
  // ============================================================================
  const baseMultipleRanges = {
    pequena: { min: 2, max: 4 },
    media: { min: 4, max: 6 },
    estruturada: { min: 6, max: 8 },
  };

  const baseRange = baseMultipleRanges[sizeClass];
  let multiplierBase = (baseRange.min + baseRange.max) / 2;

  // ============================================================================
  // 4. FATORES POSITIVOS E NEGATIVOS
  // ============================================================================
  const positiveFactors: string[] = [];
  const negativeFactors: string[] = [];
  let multiplierAdjustment = 0;

  // Fatores Positivos
  if (formData.receitaRecorrente === 'Sim') {
    positiveFactors.push('Receita recorrente estruturada');
    multiplierAdjustment += 0.4;
  } else if (formData.receitaRecorrente === 'Parcial') {
    positiveFactors.push('Receita parcialmente recorrente');
    multiplierAdjustment += 0.15;
  }

  const crescimentoNumerico = parseFloat(formData.crescimento.replace('%', '').trim());
  if (!isNaN(crescimentoNumerico) && crescimentoNumerico > 0) {
    if (crescimentoNumerico >= 15) {
      positiveFactors.push('Crescimento consistente e acelerado');
      multiplierAdjustment += 0.35;
    } else if (crescimentoNumerico > 0) {
      positiveFactors.push('Crescimento positivo');
      multiplierAdjustment += 0.15;
    }
  }

  if (formData.concentracaoClientes.toLowerCase().includes('distribuída') ||
      formData.concentracaoClientes.toLowerCase().includes('baixa')) {
    positiveFactors.push('Carteira de clientes bem distribuída');
    multiplierAdjustment += 0.25;
  }

  const maturityScore = countTrueValues(formData);
  if (maturityScore >= 6) {
    positiveFactors.push('Gestão estruturada e profissionalizada');
    multiplierAdjustment += 0.4;
  } else if (maturityScore >= 4) {
    positiveFactors.push('Boas práticas gerenciais implementadas');
    multiplierAdjustment += 0.2;
  }

  if (formData.dreGerencial && formData.fluxoCaixa) {
    positiveFactors.push('Controles financeiros estruturados');
    multiplierAdjustment += 0.2;
  }

  if (formData.erp) {
    positiveFactors.push('Sistemas integrados de gestão');
    multiplierAdjustment += 0.15;
  }

  if (formData.precificacao) {
    positiveFactors.push('Precificação estratégica e estruturada');
    multiplierAdjustment += 0.1;
  }

  if (formData.conselho) {
    positiveFactors.push('Governança empresarial implementada');
    multiplierAdjustment += 0.2;
  }

  // Fatores Negativos
  if (formData.lucroMensal === 'Prejuízo') {
    negativeFactors.push('Empresa em situação de prejuízo');
    multiplierAdjustment -= 0.8;
  }

  if (formData.endividamento.toLowerCase().includes('alto') ||
      formData.endividamento.toLowerCase().includes('> 50%') ||
      formData.endividamento.toLowerCase().includes('acima de 50')) {
    negativeFactors.push('Endividamento elevado');
    multiplierAdjustment -= 0.3;
  } else if (formData.endividamento.toLowerCase().includes('médio') ||
             formData.endividamento.toLowerCase().includes('30-50%')) {
    negativeFactors.push('Endividamento moderado');
    multiplierAdjustment -= 0.1;
  }

  if (formData.concentracaoClientes.toLowerCase().includes('concentrada') ||
      formData.concentracaoClientes.toLowerCase().includes('alta')) {
    negativeFactors.push('Carteira de clientes concentrada');
    multiplierAdjustment -= 0.25;
  }

  if (maturityScore < 2) {
    negativeFactors.push('Estrutura gerencial incipiente');
    multiplierAdjustment -= 0.3;
  }

  if (crescimentoNumerico && crescimentoNumerico < -5) {
    negativeFactors.push('Encolhimento do negócio');
    multiplierAdjustment -= 0.25;
  }

  // ============================================================================
  // 5. CALCULAR MÚLTIPLO FINAL
  // ============================================================================
  let finalMultiplier = multiplierBase + multiplierAdjustment;
  
  // Limites de sanidade
  if (finalMultiplier < 1) finalMultiplier = 1;
  if (finalMultiplier > 12) finalMultiplier = 12;

  // ============================================================================
  // 6. CALCULAR FAIXA DE VALUATION
  // ============================================================================
  const valuationMin = lucroAnual * (finalMultiplier - 0.5);
  const valuationMax = lucroAnual * (finalMultiplier + 0.5);

  const valuationFormatted = `R$ ${formatCurrency(valuationMin)} a R$ ${formatCurrency(
    valuationMax
  )}`;

  // ============================================================================
  // 7. D&M VALUE SCORE (0-100)
  // ============================================================================
  const scoreBreakdown = calculateScoreBreakdown(formData, lucroAnual, crescimentoNumerico);

  const dmValueScore = Math.round(
    (scoreBreakdown.gestaoFinanceira +
      scoreBreakdown.governanca +
      scoreBreakdown.escalabilidade +
      scoreBreakdown.caixa +
      scoreBreakdown.estruturaGerencial +
      scoreBreakdown.dependencia) /
      6
  );

  // ============================================================================
  // 8. POTENCIAL DE VALORIZAÇÃO FUTURA
  // ============================================================================
  let growthPotentialMin = 15;
  let growthPotentialMax = 35;

  if (maturityScore >= 5) {
    growthPotentialMin = 30;
    growthPotentialMax = 60;
  } else if (maturityScore >= 3) {
    growthPotentialMin = 20;
    growthPotentialMax = 45;
  }

  if (crescimentoNumerico && crescimentoNumerico > 20) {
    growthPotentialMax += 15;
  }

  const growthPotential =
    `Sua empresa possui potencial estimado de valorização entre ${growthPotentialMin}% e ${growthPotentialMax}% ` +
    `com melhoria de gestão financeira${
      maturityScore < 5 ? ', estruturação de controles' : ''
    } e previsibilidade operacional.`;

  // ============================================================================
  // 9. RECOMENDAÇÃO
  // ============================================================================
  let recommendation = '';
  if (dmValueScore < 40) {
    recommendation =
      'Sua empresa necessita de estruturação fundamental em gestão financeira e processos operacionais. Recomendamos iniciar com um diagnóstico de consultoria estratégica.';
  } else if (dmValueScore < 60) {
    recommendation =
      'Existe potencial significativo de valorização através da profissionalização de processos gerenciais e melhor controle financeiro.';
  } else if (dmValueScore < 80) {
    recommendation =
      'Sua empresa já apresenta uma boa estrutura. Recomendamos focar em escalabilidade e redução de dependência operacional.';
  } else {
    recommendation =
      'Sua empresa é bem estruturada. O próximo passo é maximizar a valorização através de estratégia de crescimento alinhada.';
  }

  return {
    valuationMin,
    valuationMax,
    valuationFormatted,
    dmValueScore,
    scoreBreakdown,
    positiveFactors: positiveFactors.slice(0, 4),
    negativeFactors: negativeFactors.slice(0, 4),
    growthPotential,
    growthPercentageMin: growthPotentialMin,
    growthPercentageMax: growthPotentialMax,
    recommendation,
  };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function countTrueValues(formData: FormData): number {
  return [
    formData.dreGerencial,
    formData.fluxoCaixa,
    formData.indicadores,
    formData.erp,
    formData.precificacao,
    formData.conselho,
    formData.gestaoFinanceira,
  ].filter((v) => v === true).length;
}

function calculateScoreBreakdown(
  formData: FormData,
  lucroAnual: number,
  crescimento: number
) {
  // Gestão Financeira (0-20)
  let gestaoFinanceira = 0;
  if (formData.dreGerencial) gestaoFinanceira += 7;
  if (formData.fluxoCaixa) gestaoFinanceira += 7;
  if (formData.indicadores) gestaoFinanceira += 6;
  gestaoFinanceira = Math.min(gestaoFinanceira, 20);

  // Governança (0-15)
  let governanca = 0;
  if (formData.conselho) governanca += 10;
  if (formData.precificacao) governanca += 5;
  governanca = Math.min(governanca, 15);

  // Escalabilidade (0-15)
  let escalabilidade = 0;
  if (!isNaN(crescimento) && crescimento > 0) {
    escalabilidade = Math.min(crescimento / 2, 15);
  }
  if (formData.erp) escalabilidade += 5;
  escalabilidade = Math.min(escalabilidade, 15);

  // Caixa (0-15) - baseado em lucro e endividamento
  let caixa = 0;
  if (lucroAnual > 500000) {
    caixa = 15;
  } else if (lucroAnual > 200000) {
    caixa = 12;
  } else if (lucroAnual > 50000) {
    caixa = 8;
  } else if (lucroAnual > 0) {
    caixa = 3;
  }

  if (formData.endividamento.toLowerCase().includes('alto')) {
    caixa -= 3;
  } else if (formData.endividamento.toLowerCase().includes('médio')) {
    caixa -= 1;
  }
  caixa = Math.max(caixa, 0);
  caixa = Math.min(caixa, 15);

  // Estrutura Gerencial (0-15)
  let estruturaGerencial = 0;
  if (formData.gestaoFinanceira) estruturaGerencial += 8;
  if (formData.erp) estruturaGerencial += 4;
  if (formData.conselho) estruturaGerencial += 3;
  estruturaGerencial = Math.min(estruturaGerencial, 15);

  // Dependência Operacional (0-20)
  let dependencia = 15; // Assume dependência média por padrão
  if (formData.gestaoFinanceira && formData.conselho) {
    dependencia = 20; // Boa estrutura reduz dependência
  }

  return {
    gestaoFinanceira: Math.round(gestaoFinanceira),
    governanca: Math.round(governanca),
    escalabilidade: Math.round(escalabilidade),
    caixa: Math.round(caixa),
    estruturaGerencial: Math.round(estruturaGerencial),
    dependencia: Math.round(dependencia),
  };
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}
