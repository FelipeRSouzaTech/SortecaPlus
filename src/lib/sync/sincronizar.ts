import type { PrismaClient } from "@prisma/client";
import { buscarConcurso, buscarUltimoConcurso, ConcursoNaoEncontradoError } from "@/lib/caixa/client";
import type { ConcursoImportado } from "@/lib/caixa/schema";

export type OpcoesSync = {
  /** Primeiro concurso do intervalo (padrão 1). */
  de?: number;
  /** Último concurso do intervalo (padrão: o mais recente da API). */
  ate?: number;
  /** Regrava concursos que já existem no banco. */
  forcar?: boolean;
  /** Requisições simultâneas à API. */
  concorrencia?: number;
  /** Pausa entre requisições de cada worker, em ms. */
  pausaMs?: number;
  log?: (msg: string) => void;
};

export type ResultadoSync = {
  ultimoNaApi: number;
  gravados: number[];
  ignorados: number;
  falhas: { numero: number; erro: string }[];
};

/** Grava (ou substitui) um concurso e suas dezenas/rateios numa única transação. */
export
export async function gravarConcurso(prisma: PrismaClient, c: ConcursoImportado) {
  const dados = {
    dataApuracao: c.dataApuracao,
    acumulado: c.acumulado,
    valorArrecadado: c.valorArrecadado,
    fonte: "api-caixa",
  };
  await prisma.$transaction([
    prisma.concurso.upsert({
      where: { numero: c.numero },
      create: { numero: c.numero, ...dados },
      update: dados,
    }),
    prisma.dezenaSorteada.deleteMany({ where: { concursoNumero: c.numero } }),
    prisma.rateio.deleteMany({ where: { concursoNumero: c.numero } }),
    prisma.dezenaSorteada.createMany({
      data: c.dezenas.map((d) => ({ concursoNumero: c.numero, ...d })),
    }),
    prisma.rateio.createMany({
      data: c.rateios.map((r) => ({ concursoNumero: c.numero, ...r })),
    }),
  ]);
}

const esperar = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function sincronizar(prisma: PrismaClient, opcoes: OpcoesSync = {}): Promise<ResultadoSync> {
  const { forcar = false, concorrencia = 2, pausaMs = 300, log = () => {} } = opcoes;

  const ultimo = await buscarUltimoConcurso();
  const de = Math.max(1, opcoes.de ?? 1);
  const ate = Math.min(ultimo.numero, opcoes.ate ?? ultimo.numero);

  const existentes = new Set(
    (
      await prisma.concurso.findMany({
        where: { numero: { gte: de, lte: ate } },
        select: { numero: true },
      })
    ).map((c) => c.numero),
  );

  const fila: number[] = [];
  for (let n = de; n <= ate; n++) if (forcar || !existentes.has(n)) fila.push(n);

  const resultado: ResultadoSync = {
    ultimoNaApi: ultimo.numero,
    gravados: [],
    ignorados: Math.max(0, ate - de + 1 - fila.length),
    falhas: [],
  };
  log(`Último concurso na API: ${ultimo.numero}. A buscar: ${fila.length}. Já no banco: ${resultado.ignorados}.`);

  let proximo = 0;
  const worker = async () => {
    while (proximo < fila.length) {
      const numero = fila[proximo++]!;
      try {
        // O último já veio na primeira chamada; evita buscá-lo de novo.
        const c = numero === ultimo.numero ? ultimo : await buscarConcurso(numero);
        await gravarConcurso(prisma, c);
        resultado.gravados.push(numero);
        if (resultado.gravados.length % 100 === 0) {
          log(`${resultado.gravados.length}/${fila.length} gravados (último: ${numero})`);
        }
      } catch (e) {
        const erro = e instanceof ConcursoNaoEncontradoError ? "não encontrado" : String(e);
        resultado.falhas.push({ numero, erro });
        log(`Concurso ${numero}: ${erro}`);
      }
      await esperar(pausaMs);
    }
  };

  await Promise.all(Array.from({ length: Math.max(1, concorrencia) }, worker));
  resultado.gravados.sort((a, b) => a - b);
  return resultado;
}
