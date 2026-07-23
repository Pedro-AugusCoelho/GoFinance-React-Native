# Riscos e questões em aberto

## Estado após a refatoração

A estrutura foi reorganizada em `app`, `core`, `modules` e `shared`. Foram extraídas regras de domínio para transações, criada uma camada de repositório sobre SQLite e implementados casos de uso para listar, cadastrar, editar e excluir transações. A validação de TypeScript passa com `npx tsc --noEmit` e há quatorze testes unitários passando com `npm test`.

O aplicativo é offline-first: o SQLite local é a fonte de verdade e as operações essenciais não dependem de rede. A arquitetura ainda não está concluída porque outros módulos e integrações nativas precisam de cobertura de integração.

## Riscos atuais

- **Dados:** o aplicativo usa SQLite com schema e migração inicial; o arquivo SQLite e o backup JSON ainda não têm criptografia em repouso.
- **Integridade:** o backup tem formato/versionamento, checksum SHA-256, validação de campos e restauração substitutiva em transação SQLite; ainda não há histórico de restaurações.
- **Privacidade:** o backup contém dados pessoais e continua sendo compartilhado como JSON legível; criptografia e retenção do arquivo ainda precisam ser decididas.
- **Manutenção:** algumas telas e módulos ainda coordenam diretamente operações de armazenamento; consultas compartilhadas e os testes da migração continuam em evolução.
- **Qualidade:** existem Jest e quatorze testes cobrindo erros, parcelamento, valores, datas, filtros, casos de uso de transações e contrato/checksum do backup; migração, SQLite, dashboard, navegação e restauração nativa ainda precisam de integração.
- **Compatibilidade:** há uma matriz formal em `docs/17-platform-support-matrix.md`, com baseline Android API 23–34 e iOS 13+, mas a execução em dispositivos/emuladores e o aceite dos fluxos ainda precisam ser registrados por release.
- **Erros:** existe uma camada de erros tipados (`AppError`) e mensagens centralizadas; ainda faltam testes de integração para falhas nativas de arquivo, permissão e compartilhamento.
- **Datas e valores:** datas de calendário inválidas são rejeitadas, a serialização usa referência estável ao meio-dia UTC, valores brasileiros são normalizados e filtros inválidos retornam vazio; date picker ainda precisa de teste em Android/iOS.

## Questões para a equipe

1. Requisito definido: o aplicativo é offline-first. Uma sincronização remota futura será opcional e subordinada ao uso local.
2. Qual é a política de retenção e proteção de backups? O formato é restrito, versionado e tem checksum, mas ainda falta decidir criptografia e retenção.
3. A restauração substitutiva é a regra atual do produto; mesclagem não faz parte desta versão.
4. Devemos adicionar senha ou criptografia nativa ao arquivo de backup? Isso exige decidir como o usuário recuperará a chave em outro aparelho.
5. Parcelas futuras podem ser editadas/excluídas em conjunto? Sim: a interface oferece a parcela atual, a atual e próximas, ou todas.
6. Quais versões e plataformas são oficialmente suportadas? A proposta atual é Android API 23–34 e iOS 13+, conforme `docs/17-platform-support-matrix.md`; isso precisa ser ratificado pela equipe.
7. Qual é o comportamento para falhas de leitura/gravação? A regra atual é preservar os dados, traduzir o erro tipado e alertar o usuário; repetição automática ainda não é usada.
8. Quais métricas de cobertura são necessárias? A base atual tem quatorze testes unitários, mas ainda precisa de integração nativa.

## Próximos passos recomendados

1. Decidir senha/criptografia e política de retenção do backup; checksum e confirmação antes da substituição já estão implementados.
2. Adicionar testes de integração da migração SQLite, restauração transacional, permissões, compartilhamento e fluxos entre tabs e stack.
3. Registrar a execução da matriz Android/iOS em cada release.
4. Se sincronização remota for desejada no futuro, tratá-la como camada opcional, com outbox, idempotência, conflitos e recuperação, sem bloquear o uso offline.
