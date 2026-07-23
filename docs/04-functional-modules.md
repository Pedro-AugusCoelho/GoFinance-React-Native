# Módulos funcionais

## Usuário local

`modules/user` cria, carrega e edita nome/foto. Não há autenticação remota. O perfil é persistido na tabela `users` do SQLite.

## Lançamentos financeiros

`modules/transactions` cadastra, lista, edita, exclui e parcela entradas/saídas. Casos de uso controlam transações; a persistência fica atrás de `TransactionRepository`.

## Consulta e resumo

`Dashboard` filtra por período e calcula entradas, saídas e saldo. `Resume` agrupa saídas por categoria e apresenta o gráfico. As regras de data, filtro e valor ficam em `domain` quando são reutilizáveis.

## Preferência visual

`AppThemeProvider` gerencia o modo claro/escuro e persiste a escolha na tabela `settings` do SQLite.

## Backup e restauração

`modules/backup` gera JSON com `format`, `version`, `exportedAt`, `checksum` e `data`. A restauração valida o envelope e substitui usuário, tema e transações dentro de uma transação SQLite.
