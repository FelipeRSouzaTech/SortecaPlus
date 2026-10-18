-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "concurso" (
    "numero" INTEGER NOT NULL,
    "data_apuracao" DATE NOT NULL,
    "acumulado" BOOLEAN NOT NULL DEFAULT false,
    "valor_arrecadado" DECIMAL(15,2),
    "fonte" VARCHAR(32) NOT NULL DEFAULT 'manual',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "concurso_pkey" PRIMARY KEY ("numero")
);

-- CreateTable
CREATE TABLE "dezena_sorteada" (
    "concurso_numero" INTEGER NOT NULL,
    "dezena" SMALLINT NOT NULL,
    "ordem_sorteio" SMALLINT,

    CONSTRAINT "dezena_sorteada_pkey" PRIMARY KEY ("concurso_numero","dezena")
);

-- CreateTable
CREATE TABLE "rateio" (
    "concurso_numero" INTEGER NOT NULL,
    "acertos" SMALLINT NOT NULL,
    "ganhadores" INTEGER NOT NULL,
    "valor_premio" DECIMAL(15,2) NOT NULL,

    CONSTRAINT "rateio_pkey" PRIMARY KEY ("concurso_numero","acertos")
);

-- CreateIndex
CREATE INDEX "concurso_data_apuracao_idx" ON "concurso"("data_apuracao");

-- CreateIndex
CREATE INDEX "dezena_sorteada_dezena_idx" ON "dezena_sorteada"("dezena");

-- CreateIndex
CREATE UNIQUE INDEX "dezena_sorteada_concurso_numero_ordem_sorteio_key" ON "dezena_sorteada"("concurso_numero", "ordem_sorteio");

-- AddForeignKey
ALTER TABLE "dezena_sorteada" ADD CONSTRAINT "dezena_sorteada_concurso_numero_fkey" FOREIGN KEY ("concurso_numero") REFERENCES "concurso"("numero") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rateio" ADD CONSTRAINT "rateio_concurso_numero_fkey" FOREIGN KEY ("concurso_numero") REFERENCES "concurso"("numero") ON DELETE CASCADE ON UPDATE CASCADE;


-- Regras de domínio da Lotofácil
ALTER TABLE "concurso" ADD CONSTRAINT "concurso_numero_check" CHECK ("numero" > 0);
ALTER TABLE "dezena_sorteada" ADD CONSTRAINT "dezena_sorteada_dezena_check" CHECK ("dezena" BETWEEN 1 AND 25);
ALTER TABLE "dezena_sorteada" ADD CONSTRAINT "dezena_sorteada_ordem_check" CHECK ("ordem_sorteio" IS NULL OR "ordem_sorteio" BETWEEN 1 AND 15);
ALTER TABLE "rateio" ADD CONSTRAINT "rateio_acertos_check" CHECK ("acertos" BETWEEN 11 AND 15);
ALTER TABLE "rateio" ADD CONSTRAINT "rateio_valores_check" CHECK ("ganhadores" >= 0 AND "valor_premio" >= 0);

-- Visão prática: um concurso por linha com as dezenas em array
CREATE VIEW "v_concurso" AS
SELECT c."numero", c."data_apuracao", c."acumulado",
       array_agg(d."dezena" ORDER BY d."dezena") AS "dezenas",
       count(d."dezena") AS "qtd_dezenas"
FROM "concurso" c
LEFT JOIN "dezena_sorteada" d ON d."concurso_numero" = c."numero"
GROUP BY c."numero";
