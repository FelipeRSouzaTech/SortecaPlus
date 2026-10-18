export const TOTAL_DEZENAS = 25;
export const DEZENAS_POR_SORTEIO = 15;
export const MIN_DEZENAS_APOSTA = 15;
export const MAX_DEZENAS_APOSTA = 20;

export const TODAS_DEZENAS: readonly number[] = Array.from({ length: TOTAL_DEZENAS }, (_, i) => i + 1);

export const PRIMOS = new Set([2, 3, 5, 7, 11, 13, 17, 19, 23]);

/** Dezenas da borda do volante 5x5. */
export const MOLDURA = new Set([1, 2, 3, 4, 5, 6, 10, 11, 15, 16, 20, 21, 22, 23, 24, 25]);

export const JANELAS = [10, 25, 50, 100] as const;
export type Janela = (typeof JANELAS)[number] | "todos";

export const formatarDezena = (d: number) => String(d).padStart(2, "0");
