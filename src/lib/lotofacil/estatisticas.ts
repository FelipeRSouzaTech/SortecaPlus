import { MOLDURA, PRIMOS, TODAS_DEZENAS, type Janela } from "./constantes";

/** Um sorteio já gravado; listas sempre em ordem crescente de número do concurso. */
export type Sorteio = {
  numero: number;
  data: string;
  dezenas: number[];
};

export type FrequenciaDezena = {
  dezena: number;
  vezes: number;
  /** Fração dos concursos da janela em que a dezena saiu (0 a 1). */
  taxa: number;
  /** Concursos desde a última vez que saiu (0 = saiu no último). */
  atraso: number;
  classe: "quente" | "fria" | "neutra";
};

export type Estatisticas = {
  janela: Janela;
  totalConcursos: number;
  ultimo: Sorteio | null;
  dezenas: FrequenciaDezena[];
  quentes: number[];
  frias: number[];
  /** Quantos concursos da janela tiveram N pares (índice = N). */
  distribuicaoPares: number[];
  mediaSoma: number;
  mediaPrimos: number;
  mediaMoldura: number;
  mediaRepetidas: number;
};

export function recortarJanela(sorteios: Sorteio[], janela: Janela): Sorteio[] {
  return janela === "todos" ? sorteios : sorteios.slice(-janela);
}

/** Atraso de cada dezena considerando o histórico completo. */
export function calcularAtraso(sorteios: Sorteio[]): Map<number, number> {
  const atraso = new Map<number, number>();
  for (let i = sorteios.length - 1; i >= 0 && atraso.size < TODAS_DEZENAS.length; i--) {
    for (const d of sorteios[i]!.dezenas) {
      if (!atraso.has(d)) atraso.set(d, sorteios.length - 1 - i);
    }
  }
  for (const d of TODAS_DEZENAS) if (!atraso.has(d)) atraso.set(d, sorteios.length);
  return atraso;
}

export function repetidasDoAnterior(atual: number[], anterior: number[]): number {
  const set = new Set(anterior);
  return atual.filter((d) => set.has(d)).length;
}

const media = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0);

/**
 * Frequência, quentes/frias e distribuições da janela escolhida.
 * Quentes = as `qtdClasse` dezenas que mais saíram; frias = as que menos saíram
 * (empate desempata pela dezena menor, para o resultado ser estável).
 */
export function calcularEstatisticas(
  sorteios: Sorteio[],
  janela: Janela,
  qtdClasse = 7,
): Estatisticas {
  const recorte = recortarJanela(sorteios, janela);
  const contagem = new Map<number, number>(TODAS_DEZENAS.map((d) => [d, 0]));
  for (const s of recorte) for (const d of s.dezenas) contagem.set(d, contagem.get(d)! + 1);

  const ranking = [...TODAS_DEZENAS].sort((a, b) => contagem.get(b)! - contagem.get(a)! || a - b);
  const quentes = ranking.slice(0, qtdClasse).sort((a, b) => a - b);
  const frias = ranking.slice(-qtdClasse).sort((a, b) => a - b);
  const atraso = calcularAtraso(sorteios);

  const distribuicaoPares = Array.from({ length: 16 }, () => 0);
  const repetidas: number[] = [];
  recorte.forEach((s, i) => {
    distribuicaoPares[s.dezenas.filter((d) => d % 2 === 0).length]!++;
    const anterior = i > 0 ? recorte[i - 1] : sorteios[sorteios.length - recorte.length - 1];
    if (anterior) repetidas.push(repetidasDoAnterior(s.dezenas, anterior.dezenas));
  });

  return {
    janela,
    totalConcursos: recorte.length,
    ultimo: sorteios.at(-1) ?? null,
    dezenas: TODAS_DEZENAS.map((d) => ({
      dezena: d,
      vezes: contagem.get(d)!,
      taxa: recorte.length ? contagem.get(d)! / recorte.length : 0,
      atraso: atraso.get(d)!,
      classe: quentes.includes(d) ? "quente" : frias.includes(d) ? "fria" : "neutra",
    })),
    quentes,
    frias,
    distribuicaoPares,
    mediaSoma: media(recorte.map((s) => s.dezenas.reduce((a, b) => a + b, 0))),
    mediaPrimos: media(recorte.map((s) => s.dezenas.filter((d) => PRIMOS.has(d)).length)),
    mediaMoldura: media(recorte.map((s) => s.dezenas.filter((d) => MOLDURA.has(d)).length)),
    mediaRepetidas: media(repetidas),
  };
}
