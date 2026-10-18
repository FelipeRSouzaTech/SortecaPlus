/**
 * Busca resultados da Lotofácil na API da Caixa e grava no banco.
 *
 *   npm run sync                    # só os concursos que faltam (1 até o último)
 *   npm run sync -- --de 3800       # a partir do 3800
 *   npm run sync -- --de 10 --ate 20 --forcar   # regrava um intervalo
 */
import { parseArgs } from "node:util";
import { prisma } from "@/lib/db";
import { sincronizar } from "@/lib/sync/sincronizar";

const { values } = parseArgs({
  options: {
    de: { type: "string" },
    ate: { type: "string" },
    forcar: { type: "boolean", default: false },
    concorrencia: { type: "string" },
  },
});

const num = (v: string | undefined) => (v === undefined ? undefined : Number(v));

async function main() {
  const inicio = Date.now();
  const r = await sincronizar(prisma, {
    ...(values.de !== undefined && { de: num(values.de)! }),
    ...(values.ate !== undefined && { ate: num(values.ate)! }),
    ...(values.concorrencia !== undefined && { concorrencia: num(values.concorrencia)! }),
    forcar: values.forcar ?? false,
    log: (m) => console.log(m),
  });
  const seg = Math.round((Date.now() - inicio) / 1000);
  console.log(`Concluído em ${seg}s: ${r.gravados.length} gravados, ${r.ignorados} já existiam, ${r.falhas.length} falhas.`);
  if (r.falhas.length) {
    console.log("Falhas:", r.falhas.map((f) => f.numero).join(", "));
    process.exitCode = 1;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
