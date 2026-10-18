"use client";

import { useMemo, useState } from "react";
import { formatarDezena, MAX_DEZENAS_APOSTA, MIN_DEZENAS_APOSTA } from "@/lib/lotofacil/constantes";
import type { Estatisticas } from "@/lib/lotofacil/estatisticas";
import { gerarJogos, type ResultadoGerador } from "@/lib/lotofacil/gerador";
import { configGeradorSchema } from "@/lib/lotofacil/regras";
import { Volante, type MarcaDezena } from "./volante";

const ROTULO_JANELA: Record<string, string> = {
  "10": "Últimos 10",
  "25": "Últimos 25",
  "50": "Últimos 50",
  "100": "Últimos 100",
  todos: "Todos os concursos",
};

const FAIXAS_PARES = { qualquer: undefined, "6-8": { min: 6, max: 8 }, "7-9": { min: 7, max: 9 } } as const;

function Metrica({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div className="rounded-lg bg-surface-2 p-4">
      <div className="text-xs text-muted">{rotulo}</div>
      <div className="mt-1 text-2xl font-semibold">{valor}</div>
    </div>
  );
}

function Campo({ rotulo, children }: { rotulo: string; children: React.ReactNode }) {
  return (
    <label className="flex items-center justify-between gap-3 text-sm">
      <span className="text-muted">{rotulo}</span>
      {children}
    </label>
  );
}

const controle = "rounded-md border border-line bg-surface px-2 py-1 text-sm";

export function Gerador({ porJanela, janelas }: { porJanela: Record<string, Estatisticas>; janelas: string[] }) {
  const [janela, setJanela] = useState("25");
  const [marcas, setMarcas] = useState<Record<number, MarcaDezena>>({});
  const [minQuentes, setMinQuentes] = useState(5);
  const [pares, setPares] = useState<keyof typeof FAIXAS_PARES>("6-8");
  const [tamanho, setTamanho] = useState(15);
  const [quantidade, setQuantidade] = useState(3);
  const [resultado, setResultado] = useState<ResultadoGerador | null>(null);

  const est = porJanela[janela]!;
  const quentes = useMemo(() => new Set(est.quentes), [est]);
  const ultimo = est.ultimo;

  const maisQuente = [...est.dezenas].sort((a, b) => b.vezes - a.vezes)[0]!;
  const maisFria = [...est.dezenas].sort((a, b) => a.vezes - b.vezes)[0]!;
  const maiorAtraso = [...est.dezenas].sort((a, b) => b.atraso - a.atraso)[0]!;

  const marcadas = (m: MarcaDezena) =>
    Object.entries(marcas)
      .filter(([, v]) => v === m)
      .map(([k]) => Number(k));

  function gerar() {
    const faixaPares = FAIXAS_PARES[pares];
    const cfg = configGeradorSchema.safeParse({
      tamanho,
      quantidade,
      fixas: marcadas("fixa"),
      excluidas: marcadas("excluida"),
      minQuentes,
      ...(faixaPares && { pares: faixaPares }),
    });
    if (!cfg.success) {
      setResultado({ ok: false, erros: cfg.error.issues.map((i) => i.message) });
      return;
    }
    setResultado(gerarJogos(cfg.data, { quentes, ultimo: ultimo?.dezenas ?? null }));
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="text-xl font-semibold">Gerador Lotofácil</h1>
        {ultimo && (
          <span className="text-sm text-muted">
            Último concurso: {ultimo.numero} · {ultimo.data.split("-").reverse().join("/")}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Metrica rotulo="Mais quente" valor={`${formatarDezena(maisQuente.dezena)} · ${maisQuente.vezes}x`} />
        <Metrica rotulo="Mais fria" valor={`${formatarDezena(maisFria.dezena)} · ${maisFria.vezes}x`} />
        <Metrica rotulo="Maior atraso" valor={`${formatarDezena(maiorAtraso.dezena)} · ${maiorAtraso.atraso} conc.`} />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <section className="rounded-xl border border-line bg-surface p-4">
          <div className="mb-3 flex items-baseline justify-between">
            <h2 className="font-semibold">Volante</h2>
            <span className="text-xs text-muted">Toque: fixar, excluir, liberar</span>
          </div>
          <Volante
            dezenas={est.dezenas}
            marcas={marcas}
            onChange={(d, m) => setMarcas((atual) => ({ ...atual, [d]: m }))}
          />
          <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted">
            <span className="rounded bg-hot-bg px-2 py-0.5 text-hot">quente</span>
            <span className="rounded bg-cold-bg px-2 py-0.5 text-cold">fria</span>
            <span className="rounded px-2 py-0.5 ring-2 ring-accent">fixa</span>
            <span className="line-through">excluída</span>
          </div>
        </section>

        <section className="space-y-3 rounded-xl border border-line bg-surface p-4">
          <h2 className="font-semibold">Regras</h2>
          <Campo rotulo="Janela de análise">
            <select className={controle} value={janela} onChange={(e) => setJanela(e.target.value)}>
              {janelas.map((j) => (
                <option key={j} value={j}>
                  {ROTULO_JANELA[j] ?? j}
                </option>
              ))}
            </select>
          </Campo>
          <Campo rotulo={`Mínimo de quentes: ${minQuentes}`}>
            <input
              type="range"
              min={0}
              max={est.quentes.length}
              value={minQuentes}
              onChange={(e) => setMinQuentes(Number(e.target.value))}
              className="w-40 accent-[var(--accent)]"
            />
          </Campo>
          <Campo rotulo="Pares por jogo">
            <select
              className={controle}
              value={pares}
              onChange={(e) => setPares(e.target.value as keyof typeof FAIXAS_PARES)}
            >
              <option value="qualquer">Qualquer</option>
              <option value="6-8">6 a 8</option>
              <option value="7-9">7 a 9</option>
            </select>
          </Campo>
          <Campo rotulo="Dezenas por jogo">
            <select className={controle} value={tamanho} onChange={(e) => setTamanho(Number(e.target.value))}>
              {Array.from({ length: MAX_DEZENAS_APOSTA - MIN_DEZENAS_APOSTA + 1 }, (_, i) => i + MIN_DEZENAS_APOSTA).map(
                (n) => (
                  <option key={n}>{n}</option>
                ),
              )}
            </select>
          </Campo>
          <Campo rotulo={`Quantidade de jogos: ${quantidade}`}>
            <input
              type="range"
              min={1}
              max={10}
              value={quantidade}
              onChange={(e) => setQuantidade(Number(e.target.value))}
              className="w-40 accent-[var(--accent)]"
            />
          </Campo>
          <button
            type="button"
            onClick={gerar}
            className="w-full rounded-md bg-accent py-2 text-sm font-semibold text-surface hover:opacity-90"
          >
            Gerar jogos
          </button>
        </section>
      </div>

      <section className="rounded-xl border border-line bg-surface p-4">
        <h2 className="font-semibold">Jogos gerados</h2>
        {!resultado && <p className="mt-2 text-sm text-muted">Configure as regras e gere seus jogos.</p>}
        {resultado && !resultado.ok && (
          <ul className="mt-2 space-y-1 text-sm text-danger" role="alert">
            {resultado.erros.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        )}
        {resultado?.ok && (
          <div className="mt-2 divide-y divide-line">
            {resultado.aviso && <p className="pb-2 text-sm text-danger">{resultado.aviso}</p>}
            {resultado.jogos.map((jogo, i) => {
              const fixas = new Set(marcadas("fixa"));
              const pares = jogo.filter((d) => d % 2 === 0).length;
              const soma = jogo.reduce((a, b) => a + b, 0);
              return (
                <div key={jogo.join()} className="py-3">
                  <div className="flex flex-wrap gap-1">
                    {jogo.map((d) => (
                      <span
                        key={d}
                        className={`inline-flex size-8 items-center justify-center rounded-full text-sm font-semibold ${
                          fixas.has(d) ? "bg-accent-bg text-accent" : quentes.has(d) ? "bg-hot-bg text-hot" : "bg-surface-2"
                        }`}
                      >
                        {formatarDezena(d)}
                      </span>
                    ))}
                  </div>
                  <div className="mt-1 text-xs text-muted">
                    Jogo {i + 1} · {jogo.filter((d) => quentes.has(d)).length} quentes · {pares} pares · soma {soma}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
