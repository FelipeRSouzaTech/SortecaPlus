import { describe, expect, it } from "vitest";
import { parseDataBr, toConcursoImportado } from "@/lib/caixa/schema";

// Recorte real da resposta do concurso 1.
const concurso1 = {
  numero: 1,
  dataApuracao: "29/09/2003",
  acumulado: false,
  valorArrecadado: 0,
  listaDezenas: ["02", "03", "05", "06", "09", "10", "11", "13", "14", "16", "18", "20", "23", "24", "25"],
  dezenasSorteadasOrdemSorteio: ["18", "20", "25", "23", "10", "11", "24", "14", "06", "02", "13", "09", "05", "16", "03"],
  listaRateioPremio: [
    { descricaoFaixa: "15 acertos", faixa: 1, numeroDeGanhadores: 5, valorPremio: 49765.82 },
    { descricaoFaixa: "14 acertos", faixa: 2, numeroDeGanhadores: 154, valorPremio: 689.84 },
    { descricaoFaixa: "13 acertos", faixa: 3, numeroDeGanhadores: 4645, valorPremio: 10 },
    { descricaoFaixa: "12 acertos", faixa: 4, numeroDeGanhadores: 48807, valorPremio: 4 },
    { descricaoFaixa: "11 acertos", faixa: 5, numeroDeGanhadores: 257593, valorPremio: 2 },
  ],
  tipoJogo: "LOTOFACIL",
};

describe("toConcursoImportado", () => {
  it("converte a resposta da Caixa para o formato do banco", () => {
    const c = toConcursoImportado(concurso1);
    expect(c.numero).toBe(1);
    expect(c.dataApuracao.toISOString()).toBe("2003-09-29T00:00:00.000Z");
    expect(c.dezenas.map((d) => d.dezena)).toEqual([2, 3, 5, 6, 9, 10, 11, 13, 14, 16, 18, 20, 23, 24, 25]);
    expect(c.dezenas.find((d) => d.dezena === 18)?.ordemSorteio).toBe(1);
    expect(c.dezenas.find((d) => d.dezena === 3)?.ordemSorteio).toBe(15);
    expect(c.rateios).toContainEqual({ acertos: 15, ganhadores: 5, valorPremio: 49765.82 });
    expect(c.rateios).toHaveLength(5);
  });

  it("deixa a ordem nula quando ela não bate com as dezenas", () => {
    const c = toConcursoImportado({ ...concurso1, dezenasSorteadasOrdemSorteio: null });
    expect(c.dezenas.every((d) => d.ordemSorteio === null)).toBe(true);
  });

  it("usa a faixa quando a descrição não tem o número de acertos", () => {
    const c = toConcursoImportado({
      ...concurso1,
      listaRateioPremio: [{ descricaoFaixa: "Faixa 1", faixa: 1, numeroDeGanhadores: 1, valorPremio: 1 }],
    });
    expect(c.rateios[0]?.acertos).toBe(15);
  });

  it("rejeita dezena fora de 1 a 25", () => {
    const dezenas = [...concurso1.listaDezenas];
    dezenas[0] = "26";
    expect(() => toConcursoImportado({ ...concurso1, listaDezenas: dezenas })).toThrow();
  });

  it("rejeita dezenas repetidas", () => {
    const dezenas = [...concurso1.listaDezenas];
    dezenas[1] = dezenas[0]!;
    expect(() => toConcursoImportado({ ...concurso1, listaDezenas: dezenas })).toThrow(/repetidas/);
  });

  it("rejeita quantidade diferente de 15 dezenas", () => {
    expect(() => toConcursoImportado({ ...concurso1, listaDezenas: concurso1.listaDezenas.slice(1) })).toThrow();
  });
});

describe("parseDataBr", () => {
  it("rejeita data inexistente", () => {
    expect(() => parseDataBr("31/02/2020")).toThrow();
  });
});
