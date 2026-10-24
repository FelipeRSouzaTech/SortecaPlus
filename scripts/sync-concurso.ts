#!/usr/bin/env node
/**
 * Sync de concursos.
 *
 * - Se for passado um número (ex.: `2545`), o script busca **apenas** aquele concurso
 *   na API da Caixa e grava/atualiza no banco.
 * - Se nenhum argumento for fornecido, o script executa a sincronização completa
 *   (mesmo comportamento do comando `npm run sync`), trazendo **todos** os
 *   concursos ainda não presentes no banco.
 *
 * Uso:
 *   npx tsx scripts/sync-concurso.ts            # sincroniza tudo
 *   npx tsx scripts/sync-concurso.ts 2545     # sincroniza somente o concurso 2545
 */

import { prisma } from "@/lib/db";
import { buscarConcurso, ConcursoNaoEncontradoError } from "@/lib/caixa/client";
import { gravarConcurso, sincronizar } from "@/lib/sync/sincronizar";

const [, , rawNumero] = process.argv;
const numero = rawNumero ? Number(rawNumero) : undefined;

(async () => {
  try {
    if (numero !== undefined) {
      if (!Number.isInteger(numero) || numero <= 0) {
        console.error("🔴  Número inválido. Use um inteiro positivo ou nenhum argumento para sincronizar tudo.");
        process.exit(1);
      }
      console.log(`🔎  Buscando concurso ${numero} na API da Caixa…`);
      const concurso = await buscarConcurso(numero);
      console.log("✅  Concurso encontrado. Gravando no banco…");
      await gravarConcurso(prisma, concurso);
      console.log(`🎉  Concurso ${numero} gravado com sucesso.`);
    } else {
      console.log("🔎  Nenhum número fornecido – iniciando sincronização completa…");
      const resultado = await sincronizar(prisma);
      console.log(`✅  Sincronização concluída. ${resultado.gravados.length} concurso(s) gravado(s), ${resultado.falhas.length} falha(s).`);
      if (resultado.falhas.length) {
        console.error("❗️ Falhas:", resultado.falhas.map((f) => `${f.numero} (${f.erro})`).join(", "));
      }
    }
  } catch (e) {
    if (e instanceof ConcursoNaoEncontradoError) {
      console.error(`❗️  Concurso ${numero} não encontrado na API.`);
    } else if (e instanceof Error) {
      console.error(`❗️  Erro ao sincronizar: ${e.message}`);
    } else {
      console.error(`❗️  Erro inesperado:`, e);
    }
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();