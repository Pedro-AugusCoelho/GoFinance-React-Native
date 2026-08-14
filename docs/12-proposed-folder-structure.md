# Estrutura de pastas adotada

```text
src/
├── app/                 bootstrap e navigation
├── core/
│   ├── database/        SQLite, schema e migração
│   ├── errors/          erros tipados
│   └── storage/         ponte legada de migração
├── shared/              componentes e tema
└── modules/
    ├── backup/
    ├── reports/
    ├── statement-import/
    ├── transactions/
    └── user/
```

Novos módulos devem depender de contratos e casos de uso, não de detalhes da UI. Persistência nativa deve ficar atrás de adaptadores em `core` ou no storage do módulo dono.
