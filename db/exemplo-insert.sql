-- Modelo de carga manual de um concurso da Lotofácil.
-- Exemplo com dados reais do concurso 3806 (16/10/2026).
-- Cada concurso = 1 linha em "concurso" + 15 em "dezena_sorteada" + até 5 em "rateio".
-- Rode dentro de uma transação: se algo violar as regras, nada é gravado.

BEGIN;

INSERT INTO concurso (numero, data_apuracao, acumulado, valor_arrecadado, fonte)
VALUES (3806, '2026-10-16', false, 19727176.00, 'manual');

-- dezena: 1 a 25 · ordem_sorteio: 1 a 15 (use NULL se não souber a ordem)
INSERT INTO dezena_sorteada (concurso_numero, dezena, ordem_sorteio) VALUES
  (3806, 19, 1), (3806,  5, 2), (3806,  4, 3), (3806,  6, 4), (3806,  7, 5),
  (3806, 11, 6), (3806, 21, 7), (3806, 23, 8), (3806,  9, 9), (3806,  8, 10),
  (3806, 13, 11), (3806, 20, 12), (3806, 16, 13), (3806, 25, 14), (3806, 24, 15);

-- acertos: 11 a 15
INSERT INTO rateio (concurso_numero, acertos, ganhadores, valor_premio) VALUES
  (3806, 15, 2, 806564.34),
  (3806, 14, 128, 2642.48),
  (3806, 13, 6346, 35.00),
  (3806, 12, 85921, 14.00),
  (3806, 11, 499520, 7.00);

COMMIT;

-- Conferência: todo concurso deve ter exatamente 15 dezenas.
-- SELECT numero, qtd_dezenas FROM v_concurso WHERE qtd_dezenas <> 15;
