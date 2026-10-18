import "server-only";
import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/db";
import type { Sorteio } from "./estatisticas";

export const TAG_SORTEIOS = "sorteios";

/** Histórico completo em ordem crescente (~3.800 concursos, leve o bastante para ficar em cache). */
export const carregarSorteios = unstable_cache(
  async (): Promise<Sorteio[]> => {
    const concursos = await prisma.concurso.findMany({
      orderBy: { numero: "asc" },
      select: { numero: true, dataApuracao: true, dezenas: { select: { dezena: true } } },
    });
    return concursos.map((c) => ({
      numero: c.numero,
      data: c.dataApuracao.toISOString().slice(0, 10),
      dezenas: c.dezenas.map((d) => d.dezena).sort((a, b) => a - b),
    }));
  },
  ["sorteios"],
  { tags: [TAG_SORTEIOS], revalidate: 600 },
);
