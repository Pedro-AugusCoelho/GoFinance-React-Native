# Roadmap incremental

## Concluído

- reorganização em `app`, `core`, `modules` e `shared`;
- extração de domínio e casos de uso de transações;
- repositório SQLite e migração do AsyncStorage legado;
- backup versionado, validado, com checksum e restauração transacional;
- erros tipados, contratos de navegação alinhados e testes unitários iniciais.

## Próxima fase

- testes de integração de migração, SQLite, navegação e recursos nativos;
- seletores/consultas compartilhados para dashboard e resumo;
- decisão de criptografia e retenção do backup;
- execução da matriz Android/iOS por release.

## Sincronização remota

Não faz parte da implementação atual. Se for necessária, será uma camada opcional e assíncrona, sem alterar o requisito offline-first.
