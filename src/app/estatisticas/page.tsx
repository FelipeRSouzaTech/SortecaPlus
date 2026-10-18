import Link from "next/link";
import { formatarDezena, JANELAS, type Janela } from "@/lib/lotofacil/constantes";
import { calcularEstatisticas } from "@/lib/lotofacil/estatisticas";
import { carregarSorteios } from "@/lib/lotofacil/repositorio";

export const dynamic = "force-dynamic";

const OPCOES: Janela[] = [...JANELAS, "todos"];

function lerJanela(v: string | string[] | undefined): Janela {
  if (v === "todos") return "todos";
  const n = Number(v);
  return (JANELAS as readonly number[]).includes(n) ? (n as Janela) : 100;
}

const um = (n: number) => n.toLocaleString("pt-BR", { maximumFractionDigits: 1 });

export default async function EstatisticasPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const janela = lerJanela((await searchParams).janela);
  const sorteios = await carregarSorteios();
  const e = calcularEstatisticas(sorteios, janela);
  const porFrequencia = [...e.dezenas].sort((a, b) => b.vezes - a.vezes || a.dezena - b.dezena);
  const maxVezes = porFrequencia[0]?.vezes || 1;
  const maxPares = Math.max(...e.distribuicaoPares, 1);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-xl font-semibold">Estatísticas</h1>
        <div className="flex flex-wrap gap-1 text-sm">
          {OPCOES.map((j) => (
            <Link
              key={j}
              href={`/estatisticas?janela=${j}`}
              className={`rounded-md border border-line px-3 py-1 ${
                j === janela ? "bg-accent-bg text-accent" : "text-muted hover:text-text"
              }`}
            >
              {j === "todos" ? "Todos" : `Últimos ${j}`}
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          ["Soma média", um(e.mediaSoma)],
          ["Repetidas do anterior", um(e.mediaRepetidas)],
          ["Primos por concurso", um(e.mediaPrimos)],
          ["Moldura por concurso", um(e.mediaMoldura)],
        ].map(([r, v]) => (
          <div key={r} className="rounded-lg bg-surface-2 p-4">
            <div className="text-xs text-muted">{r}</div>
            <div className="mt-1 text-2xl font-semibold">{v}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-[3fr_2fr]">
        <section className="rounded-xl border border-line bg-surface p-4">
          <h2 className="mb-3 font-semibold">
            Frequência por dezena <span className="text-sm font-normal text-muted">({e.totalConcursos} concursos)</span>
          </h2>
          <table className="w-full text-sm">
            <thead className="text-left text-xs text-muted">
              <tr>
                <th className="pb-2 font-normal">Dezena</th>
                <th className="pb-2 font-normal">Vezes</th>
                <th className="w-1/2 pb-2 font-normal" aria-hidden />
                <th className="pb-2 text-right font-normal">Atraso</th>
              </tr>
            </thead>
            <tbody>
              {porFrequencia.map((d) => (
                <tr key={d.dezena} className="border-t border-line">
                  <td className="py-1.5">
                    <span
                      className={`inline-block w-9 rounded text-center font-semibold ${
                        d.classe === "quente" ? "bg-hot-bg text-hot" : d.classe === "fria" ? "bg-cold-bg text-cold" : ""
                      }`}
                    >
                      {formatarDezena(d.dezena)}
                    </span>
                  </td>
                  <td className="tabular-nums">
                    {d.vezes} <span className="text-xs text-muted">({Math.round(d.taxa * 100)}%)</span>
                  </td>
                  <td>
                    <div className="h-2 rounded bg-surface-2">
                      <div className="h-2 rounded bg-accent" style={{ width: `${(d.vezes / maxVezes) * 100}%` }} />
                    </div>
                  </td>
                  <td className="text-right tabular-nums">{d.atraso}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="rounded-xl border border-line bg-surface p-4">
          <h2 className="mb-3 font-semibold">Pares por concurso</h2>
          <div className="space-y-1.5 text-sm">
            {e.distribuicaoPares.map((qtd, pares) =>
              qtd === 0 ? null : (
                <div key={pares} className="flex items-center gap-2">
                  <span className="w-16 text-muted">{pares} pares</span>
                  <div className="h-3 flex-1 rounded bg-surface-2">
                    <div className="h-3 rounded bg-accent" style={{ width: `${(qtd / maxPares) * 100}%` }} />
                  </div>
                  <span className="w-12 text-right tabular-nums">{Math.round((qtd / e.totalConcursos) * 100)}%</span>
                </div>
              ),
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
