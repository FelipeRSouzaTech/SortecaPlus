"use client";

import { formatarDezena } from "@/lib/lotofacil/constantes";
import type { FrequenciaDezena } from "@/lib/lotofacil/estatisticas";

export type MarcaDezena = "livre" | "fixa" | "excluida";

const PROXIMA: Record<MarcaDezena, MarcaDezena> = { livre: "fixa", fixa: "excluida", excluida: "livre" };

export function Volante({
  dezenas,
  marcas,
  onChange,
}: {
  dezenas: FrequenciaDezena[];
  marcas: Record<number, MarcaDezena>;
  onChange: (dezena: number, marca: MarcaDezena) => void;
}) {
  return (
    <div className="grid grid-cols-5 gap-1.5">
      {dezenas.map((d) => {
        const marca = marcas[d.dezena] ?? "livre";
        const cor =
          marca === "excluida"
            ? "bg-surface-2 text-muted line-through"
            : d.classe === "quente"
              ? "bg-hot-bg text-hot"
              : d.classe === "fria"
                ? "bg-cold-bg text-cold"
                : "bg-surface-2 text-text";
        const rotulo = marca === "fixa" ? "fixa" : marca === "excluida" ? "excluída" : d.classe;
        return (
          <button
            key={d.dezena}
            type="button"
            onClick={() => onChange(d.dezena, PROXIMA[marca])}
            aria-label={`Dezena ${formatarDezena(d.dezena)}, ${rotulo}, saiu ${Math.round(d.taxa * 100)}%`}
            className={`rounded-md py-2 text-center transition ${cor} ${
              marca === "fixa" ? "ring-2 ring-accent" : "ring-1 ring-line"
            }`}
          >
            <span className="block text-base font-semibold">{formatarDezena(d.dezena)}</span>
            <span className="text-[11px] opacity-80">{Math.round(d.taxa * 100)}%</span>
          </button>
        );
      })}
    </div>
  );
}
