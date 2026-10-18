import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "SortecaPlus · Lotofácil",
  description: "Estatísticas da Lotofácil e gerador de jogos com regras.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body className="min-h-screen font-sans antialiased">
        <header className="border-b border-line bg-surface">
          <nav className="mx-auto flex max-w-5xl items-center gap-6 px-4 py-3">
            <Link href="/" className="text-lg font-semibold text-accent">
              SortecaPlus
            </Link>
            <Link href="/" className="text-sm text-muted hover:text-text">
              Gerador
            </Link>
            <Link href="/estatisticas" className="text-sm text-muted hover:text-text">
              Estatísticas
            </Link>
          </nav>
        </header>
        <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
        <footer className="mx-auto max-w-5xl px-4 pb-8 text-xs text-muted">
          Cada sorteio é independente: as estatísticas ajudam a montar jogos, mas não aumentam a chance de acerto.
          Jogue com responsabilidade.
        </footer>
      </body>
    </html>
  );
}
