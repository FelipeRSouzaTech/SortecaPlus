import { describe, expect, it } from "vitest";
import { gerarJogos, validarJogo, type Rng } from "@/lib/lotofacil/gerador";
import { configGeradorSchema, type ConfigGerador, type ContextoRegras } from "@/lib/lotofacil/regras";

/** RNG determinístico (mulberry32) para testes reprodutíveis. */
function rngFixo(seed: number): Rng {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const ctx: ContextoRegras = {
  quentes: new Set([2, 5, 10, 11, 13, 20, 25]),
  ultimo: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
};

const cfg = (parcial: Partial<ConfigGerador> = {}): ConfigGerador =>
  configGeradorSchema.parse({ tamanho: 15, quantidade: 5, ...parcial });

describe("gerarJogos", () => {
  it("gera a quantidade pedida de jogos distintos, ordenados e do tamanho certo", () => {
    const r = gerarJogos(cfg({ quantidade: 10 }), ctx, { rng: rngFixo(1) });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.jogos).toHaveLength(10);
    expect(new Set(r.jogos.map((j) => j.join())).size).toBe(10);
    for (const j of r.jogos) {
      expect(j).toHaveLength(15);
      expect(new Set(j).size).toBe(15);
      expect([...j].sort((a, b) => a - b)).toEqual(j);
      expect(j.every((d) => d >= 1 && d <= 25)).toBe(true);
    }
  });

  it("respeita todas as regras combinadas", () => {
    const c = cfg({
      quantidade: 8,
      tamanho: 17,
      fixas: [1, 25],
      excluidas: [3, 4],
      minQuentes: 5,
      pares: { min: 7, max: 9 },
      soma: { min: 200, max: 240 },
      repetidas: { min: 8, max: 10 },
    });
    const r = gerarJogos(c, ctx, { rng: rngFixo(7) });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    for (const j of r.jogos) {
      expect(j).toHaveLength(17);
      expect(j).toContain(1);
      expect(j).toContain(25);
      expect(j).not.toContain(3);
      expect(j.filter((d) => ctx.quentes.has(d)).length).toBeGreaterThanOrEqual(5);
      expect(validarJogo(j, c, ctx)).toBe(true);
    }
  });

  it("recusa regras em conflito sem tentar gerar", () => {
    const r = gerarJogos(cfg({ fixas: [1], excluidas: [1] }), ctx);
    expect(r).toEqual({ ok: false, erros: [expect.stringMatching(/fixa e excluída/)] });

    const muitasExcluidas = gerarJogos(cfg({ excluidas: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] }), ctx);
    expect(muitasExcluidas.ok).toBe(false);

    const quentesDemais = gerarJogos(cfg({ minQuentes: 8 }), ctx);
    expect(quentesDemais.ok).toBe(false);
  });

  it("avisa quando não há jogos distintos suficientes", () => {
    // 15 fixas = um único jogo possível
    const fixas = Array.from({ length: 15 }, (_, i) => i + 1);
    const r = gerarJogos(cfg({ fixas, quantidade: 3 }), ctx, { rng: rngFixo(3), maxTentativas: 50 });
    expect(r.ok && r.jogos.length === 1 && r.aviso).toBeTruthy();
  });

  it("falha com mensagem quando nenhuma combinação satisfaz o filtro", () => {
    const r = gerarJogos(cfg({ soma: { min: 400, max: 500 } }), ctx, { rng: rngFixo(2), maxTentativas: 200 });
    expect(r.ok).toBe(false);
  });
});

describe("configGeradorSchema", () => {
  it("rejeita tamanho fora de 15 a 20", () => {
    expect(() => configGeradorSchema.parse({ tamanho: 14, quantidade: 1 })).toThrow();
    expect(() => configGeradorSchema.parse({ tamanho: 21, quantidade: 1 })).toThrow();
  });

  it("rejeita faixa com mínimo maior que o máximo", () => {
    expect(() => configGeradorSchema.parse({ tamanho: 15, quantidade: 1, pares: { min: 9, max: 7 } })).toThrow();
  });
});
