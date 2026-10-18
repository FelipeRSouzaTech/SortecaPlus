import { prisma } from "@/lib/db";
import { sincronizar } from "./sincronizar";

const globalAgendador = globalThis as unknown as { agendadorSync?: NodeJS.Timeout };

/** Uma rodada: busca na API só os concursos depois do último que já está no banco. */
export async function rodadaSync(log: (m: string) => void = console.log) {
  const ultimoNoBanco = await prisma.concurso.aggregate({ _max: { numero: true } });
  const r = await sincronizar(prisma, { de: (ultimoNoBanco._max.numero ?? 0) + 1, log: () => {} });
  if (r.gravados.length) {
    log(`[sync] ${r.gravados.length} concurso(s) novo(s): ${r.gravados.join(", ")}`);
    try {
      const { revalidateTag } = await import("next/cache");
      const { TAG_SORTEIOS } = await import("@/lib/lotofacil/repositorio");
      revalidateTag(TAG_SORTEIOS);
    } catch {
      // Fora de um request o Next pode recusar; o cache expira sozinho em 10 min.
    }
  }
  if (r.falhas.length) log(`[sync] falhas: ${r.falhas.map((f) => `${f.numero} (${f.erro})`).join("; ")}`);
  return r;
}

/**
 * Verifica a API periodicamente enquanto o servidor estiver no ar.
 * SYNC_INTERVAL_MIN controla o intervalo (padrão 30; 0 desliga).
 */
export function iniciarAgendador() {
  const minutos = Number(process.env.SYNC_INTERVAL_MIN ?? 30);
  if (!Number.isFinite(minutos) || minutos <= 0 || globalAgendador.agendadorSync) return;

  let rodando = false;
  const tick = async () => {
    if (rodando) return;
    rodando = true;
    try {
      await rodadaSync();
    } catch (e) {
      console.error("[sync] erro:", e);
    } finally {
      rodando = false;
    }
  };

  void tick();
  globalAgendador.agendadorSync = setInterval(tick, minutos * 60_000);
  console.log(`[sync] verificando novos concursos a cada ${minutos} min`);
}
