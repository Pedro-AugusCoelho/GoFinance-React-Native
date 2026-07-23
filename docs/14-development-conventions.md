# Convenções de desenvolvimento

- usar TypeScript estrito nos contratos de domínio, storage, navegação e erros;
- usar `unknown` em fronteiras de erro e converter para `AppError`;
- manter casos de uso fora das telas;
- manter SQLite como fonte de verdade offline-first;
- usar nomes de arquivo consistentes em `camelCase` para módulos e `PascalCase` para componentes;
- manter tipos/DTOs próximos ao módulo dono;
- centralizar regras compartilhadas de datas, valores e filtros;
- exibir mensagens de erro na camada de tela, sem expor detalhes técnicos;
- não registrar dados pessoais em logs;
- adicionar testes unitários antes ou junto de novas regras de domínio;
- colocar integrações nativas atrás de adaptadores e validar Android/iOS conforme a matriz.
