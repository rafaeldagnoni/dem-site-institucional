/**
 * ============================================================================
 * MOTOR DE CÁLCULO — Calculadora de Valuation D&M (VERSÃO SIMPLIFICADA)
 * ============================================================================
 * Arquivo separado da interface (valuation/simplificada/index.html) para
 * permitir testes automatizados independentes (ver valuation/simplificada/test.html).
 *
 * NATUREZA DESTA FERRAMENTA
 * Esta é a versão RÁPIDA da calculadora de valuation — 6 perguntas, sem
 * necessidade de balanço ou DRE. Usa APENAS múltiplo setorial de EV/EBITDA,
 * com o EBITDA estimado a partir de uma percepção de margem (não de dados
 * contábeis reais). Não considera fluxo de caixa descontado, WACC, ativos,
 * passivos detalhados, nem os demais fatores qualitativos usados na versão
 * completa (ver /valuation/completa/engine.js). Por isso aplica um desconto
 * fixo por informação limitada e uma faixa de valor mais larga. É uma
 * ESTIMATIVA PRELIMINAR, não um laudo de avaliação.
 *
 * Lógica portada fielmente do protótipo em TypeScript (src/lib/valuation-simples.ts)
 * fornecido pelo usuário — mesmos valores, mesmas fórmulas, mesmos textos.
 * ============================================================================
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.ValuationEngineSimples = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };

  // ==========================================================================
  // CONFIG
  // ==========================================================================
  var SETORES = [
    { value: "tecnologia",  label: "Tecnologia / SaaS",             multiplo: 8.0, margemRef: 0.25 },
    { value: "saude",       label: "Saúde e clínicas",               multiplo: 7.0, margemRef: 0.22 },
    { value: "energia",     label: "Energia e infraestrutura",       multiplo: 7.0, margemRef: 0.30 },
    { value: "financeiro",  label: "Serviços financeiros",           multiplo: 6.5, margemRef: 0.28 },
    { value: "educacao",    label: "Educação",                       multiplo: 6.0, margemRef: 0.20 },
    { value: "servicos",    label: "Serviços B2B",                   multiplo: 5.5, margemRef: 0.18 },
    { value: "industria",   label: "Indústria e manufatura",         multiplo: 5.5, margemRef: 0.15 },
    { value: "agro",        label: "Agronegócio",                    multiplo: 5.5, margemRef: 0.18 },
    { value: "logistica",   label: "Logística e transporte",         multiplo: 5.0, margemRef: 0.14 },
    { value: "atacado",     label: "Comércio atacadista",            multiplo: 4.5, margemRef: 0.09 },
    { value: "varejo",      label: "Varejo",                         multiplo: 4.5, margemRef: 0.09 },
    { value: "construcao",  label: "Construção e incorporação",      multiplo: 4.5, margemRef: 0.13 },
    { value: "alimentacao", label: "Alimentação e food service",     multiplo: 4.0, margemRef: 0.12 },
    { value: "outros",      label: "Outro segmento",                 multiplo: 5.0, margemRef: 0.15 }
  ];

  var LUCRATIVIDADE = [
    { value: "prejuizo", label: "Estou no prejuízo ou no zero a zero", margem: 0.00 },
    { value: "baixa",    label: "Sobra pouco — algo em torno de 5%",   margem: 0.05 },
    { value: "media",    label: "Sobra uma parte razoável — cerca de 10% a 15%", margem: 0.12 },
    { value: "boa",      label: "Sobra bastante — cerca de 20%",       margem: 0.20 },
    { value: "alta",     label: "Margem alta — acima de 25%",          margem: 0.28 },
    { value: "naosei",   label: "Não sei estimar",                     margem: -1 }
  ];

  var CRESCIMENTO_SIMPLES = [
    { value: "queda",     label: "Vendendo menos que no ano passado", fator: 0.80 },
    { value: "estavel",   label: "Praticamente estável",              fator: 0.93 },
    { value: "crescendo", label: "Crescendo de forma consistente",    fator: 1.06 },
    { value: "acelerado", label: "Crescendo muito rápido",            fator: 1.18 }
  ];

  var DEPENDENCIA_SIMPLES = [
    { value: "alta",  label: "A empresa depende de mim no dia a dia",        fator: 0.82 },
    { value: "media", label: "Tenho equipe, mas as decisões passam por mim", fator: 0.94 },
    { value: "baixa", label: "A empresa opera sem a minha presença",        fator: 1.06 }
  ];

  var PERIODO_SIMPLES = [
    { value: "mensal", label: "Por mês" },
    { value: "anual",  label: "Por ano" }
  ];

  var NIVEL_INFORMACAO_FATOR = 0.92; // desconto fixo por informação limitada, inerente à versão simplificada

  function findByValue(list, value) {
    for (var i = 0; i < list.length; i++) if (list[i].value === value) return list[i];
    return null;
  }
  function getSetor(value) { return findByValue(SETORES, value); }

  function brl(v) {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(Math.round(v));
  }
  function pct(v, casas) {
    return new Intl.NumberFormat("pt-BR", { style: "percent", maximumFractionDigits: casas == null ? 1 : casas }).format(v);
  }

  // ==========================================================================
  // Motor principal
  // ==========================================================================
  function calcularValuationSimples(i) {
    var setor = getSetor(i.setor) || SETORES[SETORES.length - 1];
    var receitaAnual = i.periodo === "mensal" ? (i.receita || 0) * 12 : (i.receita || 0);
    var dividas = i.dividas || 0;

    var vazio = {
      valido: false,
      receitaAnual: receitaAnual,
      margemUsada: 0,
      margemEstimada: false,
      ebitda: 0,
      multiploSetor: setor.multiplo,
      multiploAjustado: 0,
      enterpriseValue: 0,
      dividas: dividas,
      valorBase: 0,
      valorMin: 0,
      valorMax: 0,
      ajustes: [],
      observacoes: []
    };

    if (receitaAnual <= 0) {
      vazio.mensagem = "Informe o faturamento para que a estimativa seja processada.";
      return vazio;
    }

    var lucro = findByValue(LUCRATIVIDADE, i.lucratividade) || LUCRATIVIDADE[2];
    var margemEstimada = lucro.margem < 0;
    // Sem estimativa do empresário, usa-se a margem de referência do setor com desconto de prudência
    var margemUsada = margemEstimada ? setor.margemRef * 0.8 : lucro.margem;
    var ebitda = receitaAnual * margemUsada;

    var cresc = findByValue(CRESCIMENTO_SIMPLES, i.crescimento) || CRESCIMENTO_SIMPLES[1];
    var dep = findByValue(DEPENDENCIA_SIMPLES, i.dependenciaSocio) || DEPENDENCIA_SIMPLES[1];

    var porte =
      receitaAnual < 1000000 ? 0.70 :
      receitaAnual < 5000000 ? 0.84 :
      receitaAnual < 20000000 ? 1.00 :
      receitaAnual < 50000000 ? 1.10 : 1.20;

    var ajustes = [
      { label: "Porte do faturamento", fator: porte },
      { label: "Trajetória de vendas", fator: cresc.fator },
      { label: "Dependência do dono", fator: dep.fator },
      { label: "Nível de informação disponível", fator: NIVEL_INFORMACAO_FATOR }
    ];

    var fatorTotal = 1;
    for (var k = 0; k < ajustes.length; k++) fatorTotal *= ajustes[k].fator;
    fatorTotal = clamp(fatorTotal, 0.45, 1.60);

    var multiploAjustado = clamp(setor.multiplo * fatorTotal, 1.5, 12);
    var enterpriseValue = Math.max(0, ebitda * multiploAjustado);
    var valorBase = Math.max(0, enterpriseValue - dividas);

    var amplitude = margemEstimada ? 0.35 : 0.25;
    var valorMin = Math.max(0, valorBase * (1 - amplitude));
    var valorMax = valorBase * (1 + amplitude);

    var observacoes = [];
    if (margemEstimada) {
      observacoes.push("Como a lucratividade não foi informada, foi utilizada a margem média do setor com desconto de prudência. Conhecer a própria margem é o primeiro passo para uma estimativa confiável.");
    }
    if (lucro.margem === 0) {
      observacoes.push("Com lucro operacional nulo ou negativo, o valor da empresa passa a depender basicamente do patrimônio e da carteira de clientes — e não da geração de caixa.");
    }
    if (i.dependenciaSocio === "alta") {
      observacoes.push("A dependência do dono é hoje o principal fator de desconto no valor da sua empresa. Também é o de correção mais rápida.");
    }
    if (dividas > enterpriseValue * 0.5 && enterpriseValue > 0) {
      observacoes.push("O nível de dívida informado consome parcela relevante do valor. Reorganizar o passivo antes de negociar tende a preservar valor ao sócio.");
    }
    observacoes.push("Esta é a versão simplificada. A versão completa considera EBITDA real, fluxo de caixa descontado, ativos, passivos fiscais e governança — e entrega uma faixa mais estreita.");

    return {
      valido: true,
      receitaAnual: receitaAnual,
      margemUsada: margemUsada,
      margemEstimada: margemEstimada,
      ebitda: ebitda,
      multiploSetor: setor.multiplo,
      multiploAjustado: multiploAjustado,
      enterpriseValue: enterpriseValue,
      dividas: dividas,
      valorBase: valorBase,
      valorMin: valorMin,
      valorMax: valorMax,
      ajustes: ajustes,
      observacoes: observacoes,
      setorLabel: setor.label
    };
  }

  return {
    SETORES: SETORES,
    LUCRATIVIDADE: LUCRATIVIDADE,
    CRESCIMENTO_SIMPLES: CRESCIMENTO_SIMPLES,
    DEPENDENCIA_SIMPLES: DEPENDENCIA_SIMPLES,
    PERIODO_SIMPLES: PERIODO_SIMPLES,
    getSetor: getSetor,
    calcularValuationSimples: calcularValuationSimples,
    brl: brl,
    pct: pct,
    clamp: clamp
  };
});
