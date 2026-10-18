import { z } from "zod";
import { MAX_DEZENAS_APOSTA, MIN_DEZENAS_APOSTA } from "./constantes";

const dezena = z.number().int().min(1).max(25);
const faixa = z
  .object({ min: z.number().int().min(0), max: z.number().int().min(0) })
  .refine((f) => f.min <= f.max, "O mínimo não pode ser maior que o máximo");

export const configGeradorSchema = z.object({
  tamanho: z.number().int().min(MIN_DEZENAS_APOSTA).max(MAX_DEZENAS_APOSTA),
  quantidade: z.number().int().min(1).max(50),
  fixas: z.array(dezena).default([]),
  excluidas: z.array(dezena).default([]),
  minQuentes: z.number().int().min(0).max(MAX_DEZENAS_APOSTA).default(0),
  pares: faixa.optional(),
  soma: faixa.optional(),
  repetidas: faixa.optional(),
});

export type ConfigGerador = z.infer<typeof configGeradorSchema>;

export type ContextoRegras = {
  quentes: ReadonlySet<number>;
  /** Dezenas do último concurso (para a regra de repetidas). */
  ultimo: readonly number[] | null;
};

/** Uma regra do gerador. Para criar uma nova, basta acrescentá-la em REGRAS. */
export type Regra = {
  id: string;
  ativa: (cfg: ConfigGerador) => boolean;
  valida: (jogo: readonly number[], cfg: ConfigGerador, ctx: ContextoRegras) => boolean;
};

const dentro = (v: number, f: { min: number; max: number }) => v >= f.min && v <= f.max;

export const REGRAS: Regra[] = [
  {
    id: "fixas",
    ativa: (c) => c.fixas.length > 0,
    valida: (j, c) => c.fixas.every((d) => j.includes(d)),
  },
  {
    id: "excluidas",
    ativa: (c) => c.excluidas.length > 0,
    valida: (j, c) => !c.excluidas.some((d) => j.includes(d)),
  },
  {
    id: "minQuentes",
    ativa: (c) => c.minQuentes > 0,
    valida: (j, c, ctx) => j.filter((d) => ctx.quentes.has(d)).length >= c.minQuentes,
  },
  {
    id: "pares",
    ativa: (c) => c.pares !== undefined,
    valida: (j, c) => dentro(j.filter((d) => d % 2 === 0).length, c.pares!),
  },
  {
    id: "soma",
    ativa: (c) => c.soma !== undefined,
    valida: (j, c) => dentro(j.reduce((a, b) => a + b, 0), c.soma!),
  },
  {
    id: "repetidas",
    ativa: (c) => c.repetidas !== undefined,
    valida: (j, c, ctx) => {
      if (!ctx.ultimo) return true;
      const ultimo = new Set(ctx.ultimo);
      return dentro(j.filter((d) => ultimo.has(d)).length, c.repetidas!);
    },
  },
];

/** Combinações de regras que nunca podem ser satisfeitas, com mensagem para o usuário. */
export function conflitos(cfg: ConfigGerador, ctx: ContextoRegras): string[] {
  const erros: string[] = [];
  const excluidas = new Set(cfg.excluidas);
  const disponiveis = 25 - excluidas.size;

  if (cfg.fixas.some((d) => excluidas.has(d))) erros.push("Uma dezena não pode ser fixa e excluída ao mesmo tempo.");
  if (new Set(cfg.fixas).size > cfg.tamanho) erros.push(`Há mais dezenas fixas que as ${cfg.tamanho} do jogo.`);
  if (disponiveis < cfg.tamanho) erros.push(`Sobram só ${disponiveis} dezenas depois das exclusões; o jogo tem ${cfg.tamanho}.`);

  const quentesDisponiveis = [...ctx.quentes].filter((d) => !excluidas.has(d)).length;
  if (cfg.minQuentes > Math.min(quentesDisponiveis, cfg.tamanho)) {
    erros.push(`Só há ${quentesDisponiveis} dezenas quentes disponíveis para o mínimo de ${cfg.minQuentes}.`);
  }
  if (cfg.pares && cfg.pares.min > cfg.tamanho) erros.push("O mínimo de pares é maior que o tamanho do jogo.");
  return erros;
}
