import { z } from "zod";

const dezenaSchema = z.coerce.number().int().min(1).max(25);

const rateioSchema = z.object({
  faixa: z.number().int().min(1).max(5),
  descricaoFaixa: z.string(),
  numeroDeGanhadores: z.number().int().min(0),
  valorPremio: z.number().min(0),
});

/** Resposta de /portaldeloterias/api/lotofacil[/{numero}] (só os campos usados). */
export const caixaLotofacilSchema = z.object({
  numero: z.number().int().positive(),
  dataApuracao: z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/),
  acumulado: z.boolean(),
  valorArrecadado: z.number().min(0).nullable().optional(),
  listaDezenas: z.array(dezenaSchema).length(15),
  dezenasSorteadasOrdemSorteio: z.array(dezenaSchema).nullable().optional(),
  listaRateioPremio: z.array(rateioSchema),
});

export type CaixaLotofacil = z.infer<typeof caixaLotofacilSchema>;

/** Concurso já no formato do nosso banco. */
export type ConcursoImportado = {
  numero: number;
  dataApuracao: Date;
  acumulado: boolean;
  valorArrecadado: number | null;
  dezenas: { dezena: number; ordemSorteio: number | null }[];
  rateios: { acertos: number; ganhadores: number; valorPremio: number }[];
};

/** "29/09/2003" -> Date em UTC (a coluna é DATE, sem fuso). */
export function parseDataBr(data: string): Date {
  const [dia, mes, ano] = data.split("/").map(Number);
  const d = new Date(Date.UTC(ano!, mes! - 1, dia!));
  if (d.getUTCDate() !== dia || d.getUTCMonth() !== mes! - 1) {
    throw new Error(`Data inválida: ${data}`);
  }
  return d;
}

/** "15 acertos" -> 15; se a descrição mudar, cai no mapeamento faixa 1 = 15 acertos. */
function acertosDaFaixa(r: z.infer<typeof rateioSchema>): number {
  const m = /(\d+)\s*acertos/i.exec(r.descricaoFaixa);
  return m ? Number(m[1]) : 16 - r.faixa;
}

export function toConcursoImportado(raw: unknown): ConcursoImportado {
  const j = caixaLotofacilSchema.parse(raw);

  const ordenadas = [...j.listaDezenas].sort((a, b) => a - b);
  if (new Set(ordenadas).size !== 15) {
    throw new Error(`Concurso ${j.numero}: dezenas repetidas`);
  }

  // A ordem do sorteio só é usada se tiver exatamente as mesmas 15 dezenas.
  const ordem = j.dezenasSorteadasOrdemSorteio ?? [];
  const ordemValida =
    ordem.length === 15 && [...ordem].sort((a, b) => a - b).every((d, i) => d === ordenadas[i]);

  return {
    numero: j.numero,
    dataApuracao: parseDataBr(j.dataApuracao),
    acumulado: j.acumulado,
    valorArrecadado: j.valorArrecadado ?? null,
    dezenas: ordenadas.map((dezena) => ({
      dezena,
      ordemSorteio: ordemValida ? ordem.indexOf(dezena) + 1 : null,
    })),
    rateios: j.listaRateioPremio
      .map((r) => ({
        acertos: acertosDaFaixa(r),
        ganhadores: r.numeroDeGanhadores,
        valorPremio: r.valorPremio,
      }))
      .filter((r) => r.acertos >= 11 && r.acertos <= 15),
  };
}
