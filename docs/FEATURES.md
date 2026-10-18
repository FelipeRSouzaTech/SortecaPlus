# SortecaPlus — Features (rascunho v0)

> Rascunho inicial para discussão. Vai ser refinado conforme o contexto do produto for definido.

**Stack:** Next.js 15 (App Router) · React 19 · TypeScript estrito · Tailwind CSS 4 · PostgreSQL 16 · Prisma 6 · Zod · Vitest · Playwright · Docker.

## Regras da Lotofácil (base do domínio)

- Volante com 25 dezenas (01–25); aposta de 15 a 20 dezenas.
- Sorteio de 15 dezenas; premiação para 11, 12, 13, 14 e 15 acertos.
- Todo sorteio é independente: nenhuma estatística aumenta a chance real de acerto. O produto ajuda a **montar e filtrar** jogos segundo critérios do usuário, sem prometer resultado.

## MVP

### F1. Base histórica de concursos
- Importar todos os concursos já realizados (número, data, dezenas, rateio).
- Sincronização automática do concurso mais recente (job agendado).
- Fonte de dados: **a definir** (API pública da Caixa vs. arquivo oficial de resultados).

### F2. Análise estatística
- **Frequência:** quantas vezes cada dezena saiu (histórico completo e janelas: últimos 10/25/50/100 concursos).
- **Quentes e frias:** ranking das dezenas mais e menos sorteadas na janela escolhida.
- **Atraso:** há quantos concursos cada dezena não sai.
- Distribuições por concurso: pares/ímpares, soma das dezenas, primos, moldura/miolo, repetidas do concurso anterior.

### F3. Gerador de jogos
- Gera N jogos de 15–20 dezenas.
- Regras configuráveis e combináveis (motor de regras/filtros):
  - Peso para dezenas quentes (ex.: mínimo X quentes por jogo).
  - Dezenas fixas (sempre incluir) e excluídas (nunca incluir).
  - Faixa de pares/ímpares, faixa de soma, quantidade de repetidas do último concurso.
- Validar que cada jogo gerado respeita todas as regras ativas; não gerar jogos duplicados.
- Cada regra é um módulo isolado e testável (para adicionar novas regras ao longo do desenvolvimento).

### F4. Conferência
- Conferir jogos gerados/salvos contra um concurso e mostrar acertos e faixa de prêmio.

## Pós-MVP (a validar)

- Contas de usuário e jogos salvos.
- Backtest: "como esta regra teria se saído nos últimos N concursos".
- Fechamentos/desdobramentos.
- Exportar jogos (PDF/imagem/compartilhar).
- Notificação de novo resultado.

## Perguntas em aberto

1. Público e modelo: gratuito, freemium, assinatura?
2. Precisa de login no MVP ou tudo anônimo?
3. Só Lotofácil ou planejar para outras loterias (Mega-Sena, Quina) desde já?
4. Fonte oficial dos dados históricos.
5. Web apenas ou também PWA/mobile?
