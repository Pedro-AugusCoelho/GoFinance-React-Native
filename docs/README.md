# Documentação do Plutora

Esta pasta documenta o estado atual do aplicativo mobile, suas decisões arquiteturais e as pendências reais. O produto é offline-first.

## Resumo

O Plutora é um aplicativo Expo/React Native offline-first para controle pessoal de finanças. Permite criar um usuário local, registrar entradas e saídas, consultar lançamentos por período, visualizar um resumo por categoria, editar o perfil, alternar tema e exportar/importar backup JSON. Os dados ficam localmente em SQLite; não há backend ou sincronização remota, e nenhuma operação essencial deve depender de rede.

## Documentos

1. [Visão geral](01-project-overview.md)
2. [Arquitetura atual](02-current-architecture.md)
3. [Estrutura atual](03-current-folder-structure.md)
4. [Módulos funcionais](04-functional-modules.md)
5. [Navegação](05-navigation-flow.md)
6. [Fluxo de dados](06-data-flow.md)
7. [APIs e integrações](07-api-and-integrations.md)
8. [Armazenamento e sincronização](08-local-storage-and-synchronization.md)
9. [Dependências e tecnologias](09-dependencies-and-technologies.md)
10. [Débitos técnicos](10-technical-debt.md)
11. [Princípios de arquitetura](11-proposed-architecture.md)
12. [Estrutura adotada](12-proposed-folder-structure.md)
13. [Roadmap](13-refactoring-roadmap.md)
14. [Convenções](14-development-conventions.md)
15. [Estratégia de testes](15-testing-strategy.md)
16. [Riscos e dúvidas](16-risks-and-open-questions.md)
17. [Matriz de suporte de plataformas](17-platform-support-matrix.md)
18. [Prompt: importação de extratos](18-bank-statement-import-prompt.md)
19. [ADRs](decisions/README.md)

## Ordem recomendada

Leia primeiro os documentos 01 a 10 para o estado atual; depois 11 a 15 para princípios, estrutura, roadmap, convenções e testes; por fim, 16 a 18 e os ADRs.

## Pontos pendentes

Ainda precisam ser confirmados: política de retenção e criptografia de backups, execução da matriz nativa em cada release e cobertura de integração desejada. A restauração atual é substitutiva e a sincronização remota, se existir, será opcional.
