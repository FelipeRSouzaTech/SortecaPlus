import { TODAS_DEZENAS } from "./constantes";
import { conflitos, REGRAS, type ConfigGerador, type ContextoRegras } from "./regras";

export type Rng = () => number;

/** RNG criptográfico; os testes passam um RNG determinístico. */
export const rngSeguro: Rng = () => {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return buf[0]! / 2 ** 32;
};

export type ResultadoGerador =
  | { ok: true; jogos: number[][]; aviso?: string }
  | { ok: false; erros: string[] };

function embaralhar<T>(xs: T[], rng: Rng): T[] {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

/** Monta um jogo que já respeita fixas, exclusões e mínimo de quentes; o resto é sorteado. */
function montarCandidato(cfg: ConfigGerador, ctx: ContextoRegras, rng: Rng): number[] {
  const excluidas = new Set(cfg.excluidas);
  const jogo = new Set(cfg.fixas);

  const quentesNoJogo = () => [...jogo].filter((d) => ctx.quentes.has(d)).length;
  for (const d of embaralhar([...ctx.quentes].filter((d) => !excluidas.has(d)), rng)) {
    if (quentesNoJogo() >= cfg.minQuentes || jogo.size >= cfg.tamanho) break;
    jogo.add(d);
  }
  for (const d of embaralhar(TODAS_DEZENAS.filter((d) => !excluidas.has(d)), rng)) {
    if (jogo.size >= cfg.tamanho) break;
    jogo.add(d);
  }
  return [...jogo].sort((a, b) => a - b);
}

export function validarJogo(jogo: readonly number[], cfg: ConfigGerador, ctx: ContextoRegras): boolean {
  return REGRAS.every((r) => !r.ativa(cfg) || r.valida(jogo, cfg, ctx));
}

/** Gera jogos distintos que passam em todas as regras ativas. */
export function gerarJogos(
  cfg: ConfigGerador,
  ctx: ContextoRegras,
  { rng = rngSeguro, maxTentativas = 20_000 }: { rng?: Rng; maxTentativas?: number } = {},
): ResultadoGerador {
  const erros = conflitos(cfg, ctx);
  if (erros.length) return { ok: false, erros };

  const vistos = new Set<string>();
  const jogos: number[][] = [];
  for (let t = 0; t < maxTentativas && jogos.length < cfg.quantidade; t++) {
    const jogo = montarCandidato(cfg, ctx, rng);
    const chave = jogo.join(",");
    if (vistos.has(chave) || !validarJogo(jogo, cfg, ctx)) continue;
    vistos.add(chave);
    jogos.push(jogo);
  }

  if (!jogos.length) {
    return { ok: false, erros: ["Nenhum jogo atende todas as regras. Afrouxe algum filtro."] };
  }
  if (jogos.length < cfg.quantidade) {
    return { ok: true, jogos, aviso: `Só foi possível gerar ${jogos.length} jogos distintos com essas regras.` };
  }
  return { ok: true, jogos };
}
