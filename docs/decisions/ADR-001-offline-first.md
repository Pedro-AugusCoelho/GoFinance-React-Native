# ADR-001 — Aplicativo offline-first

## Status

Aceito

## Contexto

O GoFinance é um aplicativo pessoal de finanças e precisa continuar útil sem conexão de rede. Cadastro, edição, exclusão, consultas, tema, perfil e backup não podem depender de servidor.

## Decisão

O SQLite local é a fonte de verdade. Todas as operações essenciais devem confirmar primeiro no armazenamento local. Uma sincronização remota futura será opcional, assíncrona e subordinada ao uso offline.

## Alternativas consideradas

- exigir conexão para persistir dados;
- usar servidor remoto como fonte de verdade;
- manter somente AsyncStorage sem schema.

## Consequências positivas

- o app funciona sem rede;
- dados e resposta da interface têm baixa latência;
- falhas de rede não bloqueiam o usuário;
- migrações e integridade ficam sob controle local.

## Consequências negativas

- sincronização entre aparelhos exigirá outbox, idempotência e resolução de conflitos;
- backups e recuperação local precisam de política própria;
- SQLite não oferece criptografia em repouso por padrão.

## Data

2026-07-23
