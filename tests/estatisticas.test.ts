import { describe, expect, it } from "vitest";
import { calcularAtraso, calcularEstatisticas, repetidasDoAnterior, type Sorteio } from "@/lib/lotofacil/estatisticas";

const s = (numero: number, dezenas: number[]): Sorteio => ({ numero, data: "2026-01-01", dezenas });

// 1..15, depois 11..25, depois 1..15 de novo
const historico = [
  s(1, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]),
  s(2, [11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25]),
  s(3, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]),
];

describe("calcularEstatisticas", () => {
  it("conta a frequência só dentro da janela", () => {
    const todos = calcularEstatisticas(historico, "todos");
    expect(todos.dezenas.find((d) => d.dezena === 11)?.vezes).toBe(3);
    expect(todos.dezenas.find((d) => d.dezena === 1)?.vezes).toBe(2);
    expect(todos.dezenas.find((d) => d.dezena === 25)?.vezes).toBe(1);

    const ultimos1 = calcularEstatisticas(historico, 10);
    expect(ultimos1.totalConcursos).toBe(3);
  });

  it("classifica quentes e frias de forma estável", () => {
    const e = calcularEstatisticas(historico, "todos", 5);
    expect(e.quentes).toEqual([11, 12, 13, 14, 15]);
    expect(e.frias).toEqual([21, 22, 23, 24, 25]);
    expect(e.dezenas.find((d) => d.dezena === 11)?.classe).toBe("quente");
  });

  it("calcula a distribuição de pares e as médias", () => {
    const e = calcularEstatisticas(historico, "todos");
    // 1..15 tem 7 pares; 11..25 tem 7 pares
    expect(e.distribuicaoPares[7]).toBe(3);
    expect(e.mediaSoma).toBeCloseTo((120 + 270 + 120) / 3);
    expect(e.mediaRepetidas).toBe(5);
  });

  it("usa o concurso anterior à janela para as repetidas", () => {
    // 11 concursos alternando A/B; a janela de 10 começa no 2º, que é comparado com o 1º
    const longo = Array.from({ length: 11 }, (_, i) => s(i + 1, historico[i % 2]!.dezenas));
    const e = calcularEstatisticas(longo, 10);
    expect(e.totalConcursos).toBe(10);
    expect(e.mediaRepetidas).toBe(5);
  });
});

describe("calcularAtraso", () => {
  it("conta concursos desde a última aparição", () => {
    const a = calcularAtraso(historico);
    expect(a.get(1)).toBe(0);
    expect(a.get(25)).toBe(1);
  });

  it("dezena que nunca saiu tem atraso igual ao total de concursos", () => {
    const a = calcularAtraso([historico[0]!]);
    expect(a.get(20)).toBe(1);
  });
});

it("repetidasDoAnterior", () => {
  expect(repetidasDoAnterior([1, 2, 3], [2, 3, 4])).toBe(2);
});
