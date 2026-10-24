//!/usr/bin/env node
/**
 * Sync de um único concurso (número passado como argumento).
 *
 * Uso:
 *   npx tsx scripts/sync-concurso.ts <número-do-concurso>
 *
 * Exemplo:
 *   npx tsx scripts/sync-concurso.ts 2545
 *
 * O script:
 *   1. Busca o concurso na API da Caixa (usar cliente existente).
 *   2. Grava/atualiza no banco (prisma + gravarConcurso).
 *   3. Fecha a conexão Prisma e informa o resultado.
 */

import { prisma } from "@/lib/db";
import { buscarConcurso } from "@/lib/caixa/client";
import { gravarConcurso } from "@/lib/sync/sincronizar";

const [, , rawNumero] = process.argv;
const numero = Number(rawNumero);

if (!Number.isInteger(numero) || numero <= 0) {
  console.error("🔴  Uso: tsx scripts/sync-concurso.ts <número-do-concurso>");
  process.exit(1);
}

(async () => {
  try {
    console.log(`🔎  Buscando concurso ${numero} na API da Caixa…`);
    const concurso = await buscarConcurso(numero);
    console.log("✅  Concurso encontrado. Gravando no banco…");
    await gravarConcurso(prisma, concurso);
    console.log(`🎉  Concurso ${numero} gravado com sucesso.`);
  } catch (e) {
    if (e instanceof Error) {
      console.error(`❗️  Erro ao sincronizar concurso ${numero}: ${e.message}`);
    } else {
      console.error(`❗️  Erro inesperado:`, e);
    }
    process.exit(1);
  } finally {
    // Garante que a conexão seja encerrada mesmo em caso de erro.
    await prisma.$disconnect();
  }
})();
