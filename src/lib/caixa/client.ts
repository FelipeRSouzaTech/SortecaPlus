import { toConcursoImportado, type ConcursoImportado } from "./schema";

const BASE_URL = "https://servicebus2.caixa.gov.br/portaldeloterias/api/lotofacil";

export class ConcursoNaoEncontradoError extends Error {
  constructor(public readonly numero: number) {
    super(`Concurso ${numero} não encontrado na API da Caixa`);
  }
}

type Opcoes = {
  tentativas?: number;
  timeoutMs?: number;
  fetchImpl?: typeof fetch;
};

const esperar = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function buscarJson(url: string, { tentativas = 4, timeoutMs = 15_000, fetchImpl = fetch }: Opcoes) {
  let ultimoErro: unknown;
  for (let i = 0; i < tentativas; i++) {
    try {
      const res = await fetchImpl(url, {
        headers: { Accept: "application/json", "User-Agent": "Mozilla/5.0 (SortecaPlus)" },
        signal: AbortSignal.timeout(timeoutMs),
      });
      if (res.status === 404) return { status: res.status, body: null };
      // A API responde 500 para concurso inexistente, mas 500 também pode ser instabilidade:
      // tenta de novo e só considera "não encontrado" se persistir até a última tentativa.
      if (res.status === 500 && i === tentativas - 1) return { status: res.status, body: null };
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return { status: res.status, body: (await res.json()) as unknown };
    } catch (e) {
      ultimoErro = e;
      await esperar(1000 * 2 ** i);
    }
  }
  throw new Error(`Falha ao acessar ${url}: ${String(ultimoErro)}`);
}

/** Último concurso publicado. */
export async function buscarUltimoConcurso(opcoes: Opcoes = {}): Promise<ConcursoImportado> {
  const { body } = await buscarJson(BASE_URL, opcoes);
  if (body === null) throw new Error("API da Caixa não retornou o último concurso");
  return toConcursoImportado(body);
}

export async function buscarConcurso(numero: number, opcoes: Opcoes = {}): Promise<ConcursoImportado> {
  const { body } = await buscarJson(`${BASE_URL}/${numero}`, opcoes);
  if (body === null) throw new ConcursoNaoEncontradoError(numero);
  return toConcursoImportado(body);
}
