# Arquitetura atual

```mermaid
flowchart TD
  Bootstrap[index.js / App.tsx] --> Providers[ThemeProvider e AuthProvider]
  Providers --> Router[src/app/navigation]
  Router --> Modules[src/modules]
  Modules --> UseCases[Casos de uso]
  UseCases --> Repository[Repositórios e storage]
  Repository --> SQLite[(SQLite)]
  Backup[Backup] --> Files[FileSystem / DocumentPicker / Sharing]
  Modules --> Shared[src/shared]
  Core[src/core] --> SQLite
```

`app` compõe providers e navegação. `modules` contém fluxos de usuário, transações, relatórios e backup. `core` contém banco, migração e erros. `shared` contém componentes e tema.

As telas de transações usam casos de uso; o repositório SQLite concentra leitura e gravação. A camada de erros usa `AppError` e mensagens traduzidas na apresentação. Ainda há lógica de agregação nas telas e faltam testes de integração nativa.
