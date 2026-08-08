/**
 * ============================================================================
 * MOTOR DE CÁLCULO — Calculadora de Valuation D&M
 * ============================================================================
 * Arquivo separado da interface (valuation/index.html) para permitir testes
 * automatizados independentes (ver valuation/test.html).
 *
 * NATUREZA DESTA FERRAMENTA
 * Esta calculadora produz uma ESTIMATIVA PRELIMINAR, não um laudo de
 * avaliação. Ela combina duas abordagens simplificadas — múltiplos
 * setoriais de EV/EBITDA e uma referência de fluxo de caixa livre — com
 * premissas padronizadas e documentadas neste arquivo. Ela NÃO substitui
 * um valuation profissional, que exige normalização de resultados, análise
 * documental, projeções específicas e julgamento técnico.
 *
 * PENDÊNCIAS DE VALIDAÇÃO (ver também o resumo de entrega)
 * Os valores em CONFIG.multiplos e CONFIG.wacc são PREMISSAS INTERNAS DA
 * FERRAMENTA. Não representam fontes de mercado citáveis. Precisam ser
 * validados (ou substituídos por fontes externas com data) pela D&M antes
 * de qualquer divulgação que os trate como referência de mercado.
 * ============================================================================
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.ValuationEngine = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };

  // ==========================================================================
  // CONFIG — todas as premissas centralizadas e documentadas aqui.
  // ==========================================================================
  var CONFIG = {
    versaoMetodologia: "2.0.0",
    dataAtualizacaoConfig: "2026-08-08", // atualizar sempre que qualquer premissa abaixo mudar

    pesoMultiploPadrao: 0.60, // peso da abordagem de múltiplos no valor de referência
    pesoMultiploDadosIncompletos: 0.78, // usado quando CAPEX/capital de giro/imposto foram estimados por padrão (reduz peso do FCD)

    aliquotaImpostoPadrao: 0.34,
    capexPadraoPctReceita: 0.03,     // usado somente se o usuário não souber informar
    deltaWcPadraoPctReceita: 0.02,   // idem
    caixaMinimoPadraoPctReceita: 0.05, // idem

    projecaoAnos: 5,
    convergenciaCrescimento: 0.72, // peso do crescimento do ano anterior na convergência gradual à perpetuidade

    // --------------------------------------------------------------------
    // WACC — construído por componentes (build-up), não um número único.
    // Todos os valores abaixo são PREMISSAS INTERNAS DA FERRAMENTA,
    // pendentes de validação por fonte externa (ex.: NTN-B para taxa livre
    // de risco, Damodaran ou base local para prêmios de risco). Até essa
    // validação, tratar como "premissa padronizada interna".
    // --------------------------------------------------------------------
    wacc: {
      dataReferencia: "2026-08-08", // PENDENTE DE VALIDAÇÃO — atualizar com data real da fonte quando definida
      taxaLivreRisco: 0.065,        // PENDENTE DE VALIDAÇÃO — proxy de taxa real de longo prazo
      premioRiscoMercado: 0.05,     // PENDENTE DE VALIDAÇÃO — prêmio de risco de mercado (inclui efeito de beta setorial simplificado)
      spreadCustoDivida: 0.04,      // PENDENTE DE VALIDAÇÃO — spread de crédito sobre a taxa livre de risco
      estruturaCapitalPadrao: 0.30, // D/(D+E) padronizado — não é a estrutura real da empresa avaliada
      waccMin: 0.12,
      waccMax: 0.28,
      // prêmio de porte por faixa de receita anual (reduz conforme a empresa cresce)
      premioPorte: [
        { max: 1000000,    premio: 0.050 },
        { max: 5000000,    premio: 0.035 },
        { max: 20000000,   premio: 0.020 },
        { max: 50000000,   premio: 0.010 },
        { max: Infinity,   premio: 0.000 }
      ]
    },

    // --------------------------------------------------------------------
    // MÚLTIPLOS SETORIAIS — estrutura única e documentada.
    // status: "premissa_interna_pendente_validacao" até que a D&M confirme
    // fontes externas (ex.: bases de transações comparáveis, Damodaran,
    // múltiplos de empresas listadas ajustados por iliquidez).
    // --------------------------------------------------------------------
    setores: [
      { value: "tecnologia",   label: "Tecnologia / SaaS",              multiploBase: 8.0, margemRef: 0.25, intervaloInf: 6.0,  intervaloSup: 10.5, compativel: true },
      { value: "saude",        label: "Saúde e clínicas",                multiploBase: 7.0, margemRef: 0.22, intervaloInf: 5.3,  intervaloSup: 9.0,  compativel: true },
      { value: "energia",      label: "Energia e infraestrutura",        multiploBase: 7.0, margemRef: 0.30, intervaloInf: 5.3,  intervaloSup: 9.0,  compativel: true },
      { value: "financeiro",   label: "Serviços financeiros (não regulados)", multiploBase: 6.5, margemRef: 0.28, intervaloInf: 4.9, intervaloSup: 8.4, compativel: true },
      { value: "educacao",     label: "Educação",                        multiploBase: 6.0, margemRef: 0.20, intervaloInf: 4.5,  intervaloSup: 7.8,  compativel: true },
      { value: "servicos",     label: "Serviços B2B",                    multiploBase: 5.5, margemRef: 0.18, intervaloInf: 4.1,  intervaloSup: 7.2,  compativel: true },
      { value: "industria",    label: "Indústria e manufatura",          multiploBase: 5.5, margemRef: 0.15, intervaloInf: 4.1,  intervaloSup: 7.2,  compativel: true },
      { value: "agro",         label: "Agronegócio",                     multiploBase: 5.5, margemRef: 0.18, intervaloInf: 4.1,  intervaloSup: 7.2,  compativel: true },
      { value: "logistica",    label: "Logística e transporte",          multiploBase: 5.0, margemRef: 0.14, intervaloInf: 3.8,  intervaloSup: 6.5,  compativel: true },
      { value: "atacado",      label: "Comércio atacadista",             multiploBase: 4.5, margemRef: 0.09, intervaloInf: 3.4,  intervaloSup: 5.9,  compativel: true },
      { value: "varejo",       label: "Varejo",                          multiploBase: 4.5, margemRef: 0.09, intervaloInf: 3.4,  intervaloSup: 5.9,  compativel: true },
      { value: "alimentacao",  label: "Alimentação e food service",      multiploBase: 4.0, margemRef: 0.12, intervaloInf: 3.0,  intervaloSup: 5.2,  compativel: true },
      { value: "outros",       label: "Outro segmento (operacional)",    multiploBase: 5.0, margemRef: 0.15, intervaloInf: 3.8,  intervaloSup: 6.5,  compativel: true },
      // ---- perfis incompatíveis com o modelo desta ferramenta ----
      { value: "banco",        label: "Banco / instituição de crédito",  compativel: false },
      { value: "seguradora",   label: "Seguradora",                      compativel: false },
      { value: "fintech_credito", label: "Fintech com operação de crédito/endividamento estrutural", compativel: false },
      { value: "holding",      label: "Holding patrimonial",             compativel: false },
      { value: "imoveis",      label: "Negócio cujo valor depende principalmente de imóveis", compativel: false },
      { value: "incorporadora", label: "Incorporadora imobiliária",      compativel: false }
    ],
    dataAtualizacaoMultiplos: "2026-08-08", // PENDENTE DE VALIDAÇÃO EXTERNA
    origemMultiplos: "Referências internas da D&M para estimativas preliminares de empresas privadas — pendente de validação por fonte externa datada.",

    // Perfis de negócio fora do escopo do modelo, além dos setores incompatíveis acima
    perfisIncompativeis: {
      pre_operacional: "Empresa pré-operacional ou sem receita",
      recuperacao_judicial: "Empresa em recuperação judicial",
      continuidade_comprometida: "Continuidade operacional materialmente comprometida"
    },

    crescimentoHistorico: [
      { value: "queda",      label: "Em queda" },
      { value: "estavel",    label: "Estável (0% a 5%)" },
      { value: "moderado",   label: "Moderado (5% a 15%)" },
      { value: "forte",      label: "Forte (15% a 30%)" },
      { value: "acelerado",  label: "Acelerado (acima de 30%)" }
    ],

    // Crescimento ESPERADO (próximos 3 a 5 anos) — separado da trajetória histórica.
    // g = taxa inicial usada no ano 1 da projeção, convergindo gradualmente à perpetuidade.
    crescimentoEsperado: [
      { value: "queda",      label: "Queda",                         g: -0.02 },
      { value: "estavel",    label: "Estabilidade (0% a 5%)",        g: 0.03  },
      { value: "moderado",   label: "Moderado (5% a 10%)",           g: 0.075 },
      { value: "relevante",  label: "Relevante (10% a 20%)",         g: 0.15  },
      { value: "acima20",    label: "Acima de 20%",                  g: 0.24  }
    ],
    gPerpetuidadeMax: 0.045,

    motivos: [
      { value: "venda_total",   label: "Vender totalmente",     hint: "Alienação integral do controle",
        destaques: ["transferibilidade do negócio", "dependência do sócio", "concentração de clientes", "qualidade dos números", "passivos semelhantes a dívida", "preparação para diligência"] },
      { value: "venda_parcial", label: "Vender parcialmente",   hint: "Sócio investidor ou saída parcial",
        destaques: ["governança", "direitos societários", "qualidade da informação", "critérios de negociação", "dependência de pessoas-chave"] },
      { value: "captar",        label: "Captar investimento",   hint: "Rodada de capital para crescimento",
        destaques: ["projeções", "crescimento esperado", "necessidade de capital", "uso dos recursos", "capacidade de sustentar o plano"] },
      { value: "societario",    label: "Movimento societário",  hint: "Entrada, saída ou sucessão de sócios",
        destaques: ["base de valor e data-base", "premissas utilizadas", "documentação de suporte", "assimetrias de informação entre sócios"] },
      { value: "gestao",        label: "Gestão baseada em valor", hint: "Acompanhar a criação de valor",
        destaques: ["direcionadores de valor", "margem", "crescimento", "capital investido", "geração de caixa", "redução de riscos"] }
    ],

    // --------------------------------------------------------------------
    // Fatores qualitativos — cada fator afeta APENAS a(s) área(s) indicada(s),
    // para evitar dupla contagem do mesmo julgamento sobre o valor.
    //   destino: "multiplo" | "wacc" | "amplitude" | "score"
    // O score de prontidão usa TODOS os fatores (é um diagnóstico separado,
    // não entra na conta do valor). O valor (múltiplo/WACC/amplitude) usa
    // apenas os fatores explicitamente atribuídos a cada destino abaixo.
    // --------------------------------------------------------------------
    fatoresMultiplo: {
      dependenciaSocio: {
        alta:  { fator: 0.85, score: 15 },
        media: { fator: 0.95, score: 55 },
        baixa: { fator: 1.05, score: 95 }
      },
      recorrencia: {
        baixa: { fator: 0.93, score: 30 },
        media: { fator: 1.00, score: 60 },
        alta:  { fator: 1.08, score: 95 }
      },
      planejamento: {
        nao:         { fator: 0.96, score: 20 },
        informal:    { fator: 1.00, score: 50 },
        estruturado: { fator: 1.05, score: 95 }
      },
      projecoes: {
        nao:      { fator: 0.97, score: 20 },
        simples:  { fator: 1.00, score: 55 },
        completo: { fator: 1.04, score: 95 }
      },
      governanca: {
        nao:      { fator: 0.96, score: 15 },
        parcial:  { fator: 1.00, score: 55 },
        conselho: { fator: 1.05, score: 95 }
      },
      tempoMercado: {
        novo:         { fator: 0.92, score: 30 },
        consolidando: { fator: 0.99, score: 60 },
        maduro:       { fator: 1.04, score: 90 }
      }
    },
    // fatores usados SOMENTE no score de prontidão (diagnóstico), não no valor
    fatoresSomenteScore: {
      qualidadeContabil: {
        informal: { score: 15 },
        parcial:  { score: 55 },
        auditada: { score: 95 }
      },
      concentracaoClientes: {
        alta:  { score: 20 },
        media: { score: 60 },
        baixa: { score: 95 }
      }
    },
    // fatores que afetam o WACC (risco financeiro/operacional específico), com peso próprio e limitado
    fatoresWacc: {
      qualidadeContabil: { informal: 0.020, parcial: 0.008, auditada: -0.004 },
      concentracaoClientes: { alta: 0.018, media: 0.006, baixa: -0.004 },
      alavancagemAlta: 0.020 // aplicado quando dívida líquida > 3x EBITDA (ver cálculo)
    },
    // amplitude adicional da faixa por qualidade da informação contábil
    amplitudeBase: {
      informal: 0.22,
      parcial:  0.15,
      auditada: 0.10
    },
    amplitudeAssimetriaSuperior: 1.10, // leve assimetria: limite superior um pouco mais largo que o inferior

    opcoes: {
      periodo: [
        { value: "mensal", label: "Mensal" },
        { value: "anual", label: "Anual" }
      ],
      simNao: [
        { value: "sim", label: "Sim" },
        { value: "nao_sei", label: "Não sei informar" }
      ],
      planejamento: [
        { value: "nao", label: "Não existe planejamento formal" },
        { value: "informal", label: "Existe, porém informal" },
        { value: "estruturado", label: "Planejamento e orçamento estruturados" }
      ],
      projecoes: [
        { value: "nao", label: "Não há projeções financeiras" },
        { value: "simples", label: "Projeções simples de faturamento" },
        { value: "completo", label: "Projeções de resultado e caixa integradas" }
      ],
      governanca: [
        { value: "nao", label: "Decisões centralizadas no sócio" },
        { value: "parcial", label: "Gestores com autonomia parcial" },
        { value: "conselho", label: "Governança formal / conselho consultivo" }
      ],
      dependenciaSocio: [
        { value: "alta", label: "Alta — a operação para sem o sócio" },
        { value: "media", label: "Média — o sócio decide, a equipe executa" },
        { value: "baixa", label: "Baixa — gestão profissionalizada" }
      ],
      concentracaoClientes: [
        { value: "alta", label: "Acima de 50% em poucos clientes" },
        { value: "media", label: "Entre 20% e 50%" },
        { value: "baixa", label: "Abaixo de 20% — carteira pulverizada" }
      ],
      qualidadeContabil: [
        { value: "informal", label: "Controles informais / planilhas" },
        { value: "parcial", label: "Contabilidade regular, sem gerencial" },
        { value: "auditada", label: "Demonstrações gerenciais consistentes" }
      ],
      recorrencia: [
        { value: "baixa", label: "Receita pontual, por projeto ou transação" },
        { value: "media", label: "Parte da receita se repete" },
        { value: "alta", label: "Receita recorrente / contratos de longo prazo" }
      ],
      tempoMercado: [
        { value: "novo", label: "Menos de 3 anos" },
        { value: "consolidando", label: "Entre 3 e 10 anos" },
        { value: "maduro", label: "Mais de 10 anos" }
      ],
      funcionarios: [
        { value: "ate10", label: "Até 10" },
        { value: "de11a50", label: "11 a 50" },
        { value: "de51a200", label: "51 a 200" },
        { value: "mais200", label: "Mais de 200" }
      ],
      perfilNegocio: [
        { value: "operacional_estabelecida", label: "Empresa operacional estabelecida, em continuidade normal" },
        { value: "pre_operacional", label: "Empresa pré-operacional ou sem receita" },
        { value: "recuperacao_judicial", label: "Empresa em recuperação judicial" },
        { value: "continuidade_comprometida", label: "Continuidade operacional materialmente comprometida" }
      ]
    },

    // faixas de faturamento anual — mesmas usadas no formulário institucional (para consistência no CRM)
    faixasFaturamento: [
      { max: 1000000,     label: "Até R$ 1 milhão por ano" },
      { max: 5000000,     label: "De R$ 1 milhão a R$ 5 milhões" },
      { max: 10000000,    label: "De R$ 5 milhões a R$ 10 milhões" },
      { max: 30000000,    label: "De R$ 10 milhões a R$ 30 milhões" },
      { max: 100000000,   label: "De R$ 30 milhões a R$ 100 milhões" },
      { max: Infinity,    label: "Acima de R$ 100 milhões" }
    ]
  };

  // ==========================================================================
  // Helpers de busca
  // ==========================================================================
  function findByValue(list, value) {
    for (var i = 0; i < list.length; i++) if (list[i].value === value) return list[i];
    return null;
  }
  function getSetor(value) { return findByValue(CONFIG.setores, value); }
  function getMotivo(value) { return findByValue(CONFIG.motivos, value); }
  function getCrescimentoEsperado(value) { return findByValue(CONFIG.crescimentoEsperado, value); }

  function bucketFaturamento(receitaAnual) {
    for (var i = 0; i < CONFIG.faixasFaturamento.length; i++) {
      if (receitaAnual <= CONFIG.faixasFaturamento[i].max) return CONFIG.faixasFaturamento[i].label;
    }
    return CONFIG.faixasFaturamento[CONFIG.faixasFaturamento.length - 1].label;
  }

  // ==========================================================================
  // Formatação
  // ==========================================================================
  function roundSensible(v) {
    var abs = Math.abs(v);
    var step;
    if (abs < 100000) step = 1000;
    else if (abs < 1000000) step = 10000;
    else if (abs < 10000000) step = 50000;
    else if (abs < 100000000) step = 100000;
    else step = 1000000;
    return Math.round(v / step) * step;
  }

  function brl(v) {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(roundSensible(v));
  }
  function brlExato(v) {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(Math.round(v));
  }
  function pct(v, casas) {
    return new Intl.NumberFormat("pt-BR", { style: "percent", maximumFractionDigits: casas == null ? 1 : casas }).format(v);
  }

  // ==========================================================================
  // WACC — build-up por componentes (documentado em CONFIG.wacc)
  // ==========================================================================
  function calcularWacc(input, receitaAnual, dividaLiquida, ebitda) {
    var w = CONFIG.wacc;
    var premioPorte = w.premioPorte[w.premioPorte.length - 1].premio;
    for (var i = 0; i < w.premioPorte.length; i++) {
      if (receitaAnual <= w.premioPorte[i].max) { premioPorte = w.premioPorte[i].premio; break; }
    }

    var riscoEspecifico = 0;
    riscoEspecifico += CONFIG.fatoresWacc.qualidadeContabil[input.qualidadeContabil] || 0;
    riscoEspecifico += CONFIG.fatoresWacc.concentracaoClientes[input.concentracaoClientes] || 0;
    var alavancagemAlta = ebitda > 0 && dividaLiquida > ebitda * 3;
    if (alavancagemAlta) riscoEspecifico += CONFIG.fatoresWacc.alavancagemAlta;

    var ke = w.taxaLivreRisco + w.premioRiscoMercado + premioPorte + riscoEspecifico;
    var kdBruto = w.taxaLivreRisco + w.spreadCustoDivida;
    var aliquota = input.taxaImpostoUsada;
    var kdLiquido = kdBruto * (1 - aliquota);
    var estruturaCapital = w.estruturaCapitalPadrao;

    var waccBruto = ke * (1 - estruturaCapital) + kdLiquido * estruturaCapital;
    var wacc = clamp(waccBruto, w.waccMin, w.waccMax);

    return {
      wacc: wacc,
      componentes: {
        taxaLivreRisco: w.taxaLivreRisco,
        premioRiscoMercado: w.premioRiscoMercado,
        premioPorte: premioPorte,
        riscoEspecifico: riscoEspecifico,
        custoCapitalProprio: ke,
        custoDividaLiquido: kdLiquido,
        estruturaCapital: estruturaCapital,
        alavancagemAlta: alavancagemAlta,
        dataReferencia: w.dataReferencia
      }
    };
  }

  // ==========================================================================
  // FCFF — fluxo de caixa livre para a firma, projeção de 5 anos + perpetuidade
  // FCFF = EBIT x (1 - alíquota) + Depreciação/Amortização - CAPEX - ΔCapital de Giro
  // ==========================================================================
  function projetarFcff(ebit, depreciacao, capexAno1, deltaWcAno1, aliquota, gInicial, gPerp, wacc) {
    var fcff0 = ebit * (1 - aliquota) + depreciacao - capexAno1 - deltaWcAno1;
    var g = gInicial;
    var fcff = fcff0;
    var evDcf = 0;
    var anos = CONFIG.projecaoAnos;
    var conv = CONFIG.convergenciaCrescimento;
    var fluxos = [];

    for (var ano = 1; ano <= anos; ano++) {
      g = g * conv + gPerp * (1 - conv);
      fcff = fcff * (1 + g);
      var vp = fcff / Math.pow(1 + wacc, ano);
      evDcf += vp;
      fluxos.push({ ano: ano, g: g, fcff: fcff, valorPresente: vp });
    }

    var terminal = (fcff * (1 + gPerp)) / (wacc - gPerp);
    var vpTerminal = terminal / Math.pow(1 + wacc, anos);
    evDcf += vpTerminal;

    return {
      fcff0: fcff0,
      evDcf: Math.max(0, evDcf),
      valorTerminal: terminal,
      vpValorTerminal: vpTerminal,
      fluxos: fluxos
    };
  }

  // ==========================================================================
  // Motor principal
  // ==========================================================================
  function vazio(motivo) {
    return {
      valido: false,
      semValuationAutomatico: false,
      motivoInvalidez: motivo,
      alertas: [],
      premissasUsadas: []
    };
  }

  /**
   * @param {Object} i - respostas do usuário (ver ValuationEngine.CAMPOS_ESPERADOS)
   * @returns {Object} resultado estruturado
   */
  function calcularValuation(i) {
    // ---- 0) Perfil incompatível: nenhum número automático ----
    var setor = getSetor(i.setor);
    var perfilBloqueado =
      (i.perfilNegocio && i.perfilNegocio !== "operacional_estabelecida") ||
      (setor && setor.compativel === false) ||
      !setor;

    if (perfilBloqueado) {
      var r = vazio("perfil_incompativel");
      r.mensagemLimitacao = "Os métodos automatizados desta ferramenta não são adequados ao perfil informado. Uma estimativa responsável exige análise específica da estrutura, dos ativos, dos riscos e da finalidade da avaliação.";
      return r;
    }

    // ---- 1) Anualização e resultado operacional ----
    var m = i.periodo === "mensal" ? 12 : 1;
    var receitaAnual = (i.receita || 0) * m;
    var cmv = (i.cmv || 0) * m;
    var despesas = (i.despesas || 0) * m;
    var depreciacao = (i.depreciacao || 0) * m;

    if (receitaAnual <= 0) {
      var r0 = vazio("receita_zero");
      r0.mensagemLimitacao = "Informe a receita para que a estimativa possa ser processada.";
      return r0;
    }

    var ebitda = receitaAnual - cmv - despesas;
    var ebit = ebitda - depreciacao;
    var margemEbitda = ebitda / receitaAnual;

    // ---- 2) Ativos, dívida financeira, passivos símile-dívida, caixa ----
    var imobilizado = i.imobilizado || 0;
    var estoque = i.estoque || 0;
    var contasReceber = i.contasReceber || 0;
    var caixaTotal = i.caixa || 0;
    var contasPagar = i.contasPagar || 0; // OPERACIONAL — não entra na ponte EV -> equity

    var dividaFinanceira = i.dividasBancarias || 0;
    var passivosSimilaresDivida = i.passivosFiscais || 0;

    var caixaMinimoInformado = i.caixaMinimoNaoSei ? receitaAnual * CONFIG.caixaMinimoPadraoPctReceita : (i.caixaMinimo || 0);
    var caixaExcedente = Math.max(caixaTotal - caixaMinimoInformado, 0);
    var ativosNaoOperacionais = i.ativosNaoOperacionais || 0;

    var dividaLiquidaFinanceira = dividaFinanceira + passivosSimilaresDivida - caixaExcedente;

    // Referência patrimonial — contábil, inclui contas a pagar como passivo (não é a ponte EV->equity)
    var patrimonioReferencia = imobilizado + estoque + contasReceber + caixaTotal
      - dividaFinanceira - passivosSimilaresDivida - contasPagar;

    var alertas = [];
    var premissasUsadas = [];

    // ---- 3) EBITDA <= 0: nenhum valuation automático, só referência patrimonial ----
    if (ebitda <= 0) {
      var r1 = vazio("ebitda_nao_positivo");
      r1.semValuationAutomatico = true;
      r1.valido = true; // dados suficientes para exibir referência, mas sem faixa de valor
      r1.receitaAnual = receitaAnual;
      r1.ebitda = ebitda;
      r1.margemEbitda = margemEbitda;
      r1.patrimonioReferencia = patrimonioReferencia;
      r1.mensagemLimitacao = "A estrutura informada não permite uma estimativa confiável pelos métodos aplicados nesta ferramenta. Empresas com geração operacional negativa exigem análise específica de ativos, capacidade de recuperação, projeções e necessidade de capital.";
      r1.alertas = ["O EBITDA informado é negativo ou nulo. Nesse cenário, a leitura por múltiplos de EBITDA e por fluxo de caixa livre deixa de ser aplicável."];
      return r1;
    }

    // ---- 4) Taxa de imposto ----
    var taxaImpostoUsada = i.taxaImpostoNaoSei ? CONFIG.aliquotaImpostoPadrao : clamp((i.taxaImposto || 0) / 100, 0, 0.5);
    if (i.taxaImpostoNaoSei) premissasUsadas.push("Alíquota efetiva de imposto: usada a premissa padrão de " + pct(CONFIG.aliquotaImpostoPadrao, 0) + " por ausência de informação.");

    // ---- 5) CAPEX e capital de giro ----
    var capex = i.capexNaoSei ? receitaAnual * CONFIG.capexPadraoPctReceita : (i.capex || 0);
    if (i.capexNaoSei) premissasUsadas.push("CAPEX anual: estimado em " + pct(CONFIG.capexPadraoPctReceita, 0) + " da receita, por ausência de informação.");
    var deltaWc = i.deltaWcNaoSei ? receitaAnual * CONFIG.deltaWcPadraoPctReceita : (i.deltaWc || 0);
    if (i.deltaWcNaoSei) premissasUsadas.push("Variação do capital de giro: estimada em " + pct(CONFIG.deltaWcPadraoPctReceita, 0) + " da receita, por ausência de informação.");
    if (i.caixaMinimoNaoSei) premissasUsadas.push("Caixa mínimo operacional: estimado em " + pct(CONFIG.caixaMinimoPadraoPctReceita, 0) + " da receita, por ausência de informação.");

    var dadosFcdIncompletos = !!(i.capexNaoSei || i.deltaWcNaoSei || i.taxaImpostoNaoSei);

    // ---- 6) Fatores do MÚLTIPLO (grupo fechado, sem sobreposição com WACC/score) ----
    var porte =
      receitaAnual < 1000000 ? 0.75 :
      receitaAnual < 5000000 ? 0.87 :
      receitaAnual < 20000000 ? 1.00 :
      receitaAnual < 50000000 ? 1.10 : 1.20;

    var crescHist = findByValue(CONFIG.crescimentoHistorico, i.crescimento) || CONFIG.crescimentoHistorico[2];
    var crescHistFator = { queda: 0.90, estavel: 0.97, moderado: 1.00, forte: 1.05, acelerado: 1.10 }[crescHist.value] || 1.00;

    var margemRel = clamp(margemEbitda / setor.margemRef, 0.4, 2);
    var fatorMargem = clamp(0.85 + 0.15 * margemRel, 0.85, 1.18);

    function fq(cat, key) {
      var tbl = CONFIG.fatoresMultiplo[cat];
      return (tbl && tbl[key]) || { fator: 1.0, score: 55 };
    }

    var itensMultiplo = [
      { label: "Porte e escala de receita", fator: porte },
      { label: "Trajetória histórica de receita", fator: crescHistFator },
      { label: "Margem EBITDA vs. referência setorial", fator: fatorMargem },
      { label: "Dependência do sócio (transferibilidade)", fator: fq("dependenciaSocio", i.dependenciaSocio).fator },
      { label: "Recorrência de receita", fator: fq("recorrencia", i.recorrencia).fator },
      { label: "Planejamento e orçamento", fator: fq("planejamento", i.planejamento).fator },
      { label: "Projeções financeiras", fator: fq("projecoes", i.projecoes).fator },
      { label: "Governança e decisão", fator: fq("governanca", i.governanca).fator },
      { label: "Maturidade de mercado", fator: fq("tempoMercado", i.tempoMercado).fator }
    ];

    var fatorTotal = 1;
    for (var fi = 0; fi < itensMultiplo.length; fi++) fatorTotal *= itensMultiplo[fi].fator;
    fatorTotal = clamp(fatorTotal, 0.55, 1.55);

    var multiploAjustado = clamp(setor.multiploBase * fatorTotal, setor.intervaloInf * 0.85, setor.intervaloSup * 1.10);
    var evMultiplo = Math.max(0, ebitda * multiploAjustado);
    var evMultiploInf = Math.max(0, ebitda * clamp(setor.intervaloInf * fatorTotal, 0.5, multiploAjustado));
    var evMultiploSup = Math.max(0, ebitda * clamp(setor.intervaloSup * fatorTotal, multiploAjustado, 20));

    // ---- 7) WACC (componentes próprios, ver calcularWacc) ----
    var waccResult = calcularWacc(
      { qualidadeContabil: i.qualidadeContabil, concentracaoClientes: i.concentracaoClientes, taxaImpostoUsada: taxaImpostoUsada },
      receitaAnual, dividaLiquidaFinanceira, ebitda
    );
    var wacc = waccResult.wacc;

    // ---- 8) Crescimento esperado (separado do histórico) + perpetuidade ----
    var crescEsp = getCrescimentoEsperado(i.crescimentoEsperado) || CONFIG.crescimentoEsperado[1];
    var gPerp = clamp(Math.min(crescEsp.g, CONFIG.gPerpetuidadeMax), -0.02, CONFIG.gPerpetuidadeMax);
    if (wacc - gPerp < 0.02) gPerp = wacc - 0.02; // salvaguarda: nunca deixar WACC muito próximo da perpetuidade

    // ---- 9) FCFF — projeção central ----
    var fcdCentral = projetarFcff(ebit, depreciacao, capex, deltaWc, taxaImpostoUsada, crescEsp.g, gPerp, wacc);
    var evDcf = fcdCentral.evDcf;

    // cenários de sensibilidade da renda (WACC e crescimento variam nas pontas)
    var waccInf = clamp(wacc - 0.015, CONFIG.wacc.waccMin, CONFIG.wacc.waccMax);
    var waccSup = clamp(wacc + 0.015, CONFIG.wacc.waccMin, CONFIG.wacc.waccMax);
    var gInfCenario = clamp(crescEsp.g - 0.03, -0.03, CONFIG.gPerpetuidadeMax);
    var gSupCenario = clamp(crescEsp.g + 0.03, -0.03, CONFIG.gPerpetuidadeMax);
    var gPerpInf = Math.min(gInfCenario, gPerp);
    var gPerpSup = Math.min(gSupCenario, CONFIG.gPerpetuidadeMax);
    if (waccSup - gPerpSup < 0.02) gPerpSup = waccSup - 0.02;
    if (waccInf - gPerpInf < 0.02) gPerpInf = waccInf - 0.02;

    var evDcfSup = projetarFcff(ebit, depreciacao, capex, deltaWc, taxaImpostoUsada, gSupCenario, gPerpSup, waccInf).evDcf; // melhor cenário: WACC menor, crescimento maior
    var evDcfInf = projetarFcff(ebit, depreciacao, capex, deltaWc, taxaImpostoUsada, gInfCenario, gPerpInf, waccSup).evDcf; // pior cenário: WACC maior, crescimento menor

    // ---- 10) Ponderação (reduz peso do FCD se dados foram estimados por padrão) ----
    var pesoMultiplo = dadosFcdIncompletos ? CONFIG.pesoMultiploDadosIncompletos : CONFIG.pesoMultiploPadrao;
    var pesoRenda = 1 - pesoMultiplo;

    var evBase = evMultiplo * pesoMultiplo + evDcf * pesoRenda;
    var evBaseInf = evMultiploInf * pesoMultiplo + evDcfInf * pesoRenda;
    var evBaseSup = evMultiploSup * pesoMultiplo + evDcfSup * pesoRenda;

    // ---- 11) Ponte EV -> Equity (contas a pagar operacionais NÃO entram aqui) ----
    function ponte(ev) { return ev - dividaFinanceira - passivosSimilaresDivida + caixaExcedente + ativosNaoOperacionais; }
    var equityBase = ponte(evBase);
    var equityInfModelo = ponte(evBaseInf);
    var equitySupModelo = ponte(evBaseSup);

    // ---- 12) Amplitude adicional por qualidade da informação (sem repetir todo o efeito) ----
    var amplitudeBase = CONFIG.amplitudeBase[i.qualidadeContabil] || CONFIG.amplitudeBase.parcial;
    var amplitudeExtra = dadosFcdIncompletos ? 0.04 : 0; // premissas padrão ampliam levemente a incerteza
    var amplitudeTotal = amplitudeBase + amplitudeExtra;

    var equityMin = Math.min(equityInfModelo, equityBase * (1 - amplitudeTotal));
    var equityMax = Math.max(equitySupModelo, equityBase * (1 + amplitudeTotal * CONFIG.amplitudeAssimetriaSuperior));
    equityMin = Math.max(0, equityMin);
    equityMax = Math.max(equityMax, equityMin);

    // piso patrimonial leve: nunca exibir mínimo abaixo de 60% da referência patrimonial quando esta for positiva
    // (não é um piso automático do valor de referência — apenas evita um MÍNIMO da faixa absurdamente baixo)
    if (patrimonioReferencia > 0) {
      equityMin = Math.max(equityMin, patrimonioReferencia * 0.5);
      if (equityMin > equityBase) equityMin = equityBase * 0.9;
    }

    // ---- 13) Alertas (comparativos, não categóricos) ----
    var candidatosAlerta = [];
    if (dividaLiquidaFinanceira > ebitda * 3) {
      candidatosAlerta.push({
        impacto: 3,
        texto: "A dívida líquida financeira supera 3x o EBITDA. Esse nível de alavancagem tende a reduzir o valor disponível ao sócio e pode exigir negociação de covenants ou alongamento de prazos antes de uma transação."
      });
    }
    if (i.dependenciaSocio === "alta") {
      candidatosAlerta.push({
        impacto: 2,
        texto: "A elevada dependência da figura do sócio reduz a transferibilidade do negócio e pode pressionar o valor percebido por compradores ou investidores."
      });
    }
    if (i.qualidadeContabil === "informal") {
      candidatosAlerta.push({
        impacto: 2,
        texto: "Controles informais ampliam a incerteza da estimativa e tendem a gerar desconto de risco informacional em uma negociação. Estruturar a informação financeira é uma ação possível antes de avançar."
      });
    }
    if (i.concentracaoClientes === "alta") {
      candidatosAlerta.push({
        impacto: 1,
        texto: "A concentração de receita em poucos clientes é um fator de risco observado por compradores e investidores, e pode afetar tanto o valor quanto as condições de uma eventual transação."
      });
    }
    // ordena por impacto para permitir identificar o de maior peso, sem alegar isso se houver empate
    candidatosAlerta.sort(function (a, b) { return b.impacto - a.impacto; });
    var alertasTextos = candidatosAlerta.map(function (c) { return c.texto; });

    // ---- 14) Score de prontidão (diagnóstico separado — não influencia o valor) ----
    function scoreOpcao(cat, key) {
      var tbl = CONFIG.fatoresMultiplo[cat] || CONFIG.fatoresSomenteScore[cat];
      return (tbl && tbl[key] && tbl[key].score) || 55;
    }
    function pilar(label, keys) {
      var soma = 0;
      for (var k = 0; k < keys.length; k++) soma += scoreOpcao(keys[k][0], keys[k][1]);
      var score = Math.round(soma / keys.length);
      return { label: label, score: score, nota: score >= 80 ? "Estruturado" : score >= 50 ? "Em evolução" : "Crítico" };
    }
    var pilares = [
      pilar("Informação financeira", [["qualidadeContabil", i.qualidadeContabil], ["projecoes", i.projecoes]]),
      pilar("Planejamento e governança", [["planejamento", i.planejamento], ["governanca", i.governanca]]),
      pilar("Independência da operação", [["dependenciaSocio", i.dependenciaSocio], ["tempoMercado", i.tempoMercado]]),
      pilar("Qualidade da receita", [["recorrencia", i.recorrencia], ["concentracaoClientes", i.concentracaoClientes]])
    ];
    var scoreProntidao = Math.round(pilares.reduce(function (a, p) { return a + p.score; }, 0) / pilares.length);

    var motivo = getMotivo(i.motivo);

    return {
      valido: true,
      semValuationAutomatico: false,
      receitaAnual: receitaAnual,
      ebitda: ebitda,
      ebit: ebit,
      margemEbitda: margemEbitda,
      margemReferenciaSetor: setor.margemRef,

      dividaFinanceira: dividaFinanceira,
      passivosSimilaresDivida: passivosSimilaresDivida,
      caixaTotal: caixaTotal,
      caixaMinimoOperacional: caixaMinimoInformado,
      caixaExcedente: caixaExcedente,
      ativosNaoOperacionais: ativosNaoOperacionais,
      patrimonioReferencia: patrimonioReferencia,

      setorLabel: setor.label,
      multiploBase: setor.multiploBase,
      multiploAjustado: multiploAjustado,
      evMultiplo: evMultiplo,
      evMultiploInf: evMultiploInf,
      evMultiploSup: evMultiploSup,
      dataAtualizacaoMultiplos: CONFIG.dataAtualizacaoMultiplos,
      origemMultiplos: CONFIG.origemMultiplos,

      wacc: wacc,
      waccComponentes: waccResult.componentes,
      gPerpetuidade: gPerp,
      crescimentoEsperadoLabel: crescEsp.label,
      fcff0: fcdCentral.fcff0,
      evDcf: evDcf,
      dadosFcdIncompletos: dadosFcdIncompletos,

      pesoMultiplo: pesoMultiplo,
      pesoRenda: pesoRenda,

      equityBase: equityBase,
      equityMin: equityMin,
      equityMax: equityMax,

      fatoresMultiplo: itensMultiplo,
      pilares: pilares,
      scoreProntidao: scoreProntidao,

      motivoLabel: motivo ? motivo.label : i.motivo,
      motivoDestaques: motivo ? motivo.destaques : [],

      alertas: alertasTextos,
      premissasUsadas: premissasUsadas,
      taxaImpostoUsada: taxaImpostoUsada,
      capexUsado: capex,
      deltaWcUsado: deltaWc,

      faixaFaturamentoLabel: bucketFaturamento(receitaAnual)
    };
  }

  return {
    CONFIG: CONFIG,
    calcularValuation: calcularValuation,
    brl: brl,
    brlExato: brlExato,
    pct: pct,
    roundSensible: roundSensible,
    bucketFaturamento: bucketFaturamento,
    getSetor: getSetor,
    getMotivo: getMotivo,
    getCrescimentoEsperado: getCrescimentoEsperado,
    clamp: clamp
  };
});
