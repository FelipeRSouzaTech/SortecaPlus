import { Gerador } from "@/components/gerador";
import { JANELAS, type Janela } from "@/lib/lotofacil/constantes";
import { calcularEstatisticas, type Estatisticas } from "@/lib/lotofacil/estatisticas";
import { carregarSorteios } from "@/lib/lotofacil/repositorio";

export const dynamic = "force-dynamic";

export default async function Home() {
  const sorteios = await carregarSorteios();
  if (!sorteios.length) {
    return <p className="text-muted">Nenhum concurso no banco ainda. Rode <code>npm run sync</code>.</p>;
  }

  const janelas: Janela[] = [...JANELAS, "todos"];
  const porJanela = Object.fromEntries(janelas.map((j) => [String(j), calcularEstatisticas(sorteios, j)])) as Record<
    string,
    Estatisticas
  >;

  return <Gerador porJanela={porJanela} janelas={janelas.map(String)} />;
}
