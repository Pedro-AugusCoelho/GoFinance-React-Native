# Estrutura atual de pastas

```text
src/
├── app/                 bootstrap e navegação
├── core/
│   ├── database/        SQLite, schema, migração e leitura de dados
│   ├── errors/          AppError e mensagens de apresentação
│   └── storage/         compatibilidade/migração do AsyncStorage legado
├── shared/              componentes reutilizáveis e tema
└── modules/
    ├── backup/          formato, checksum e restauração
    ├── reports/         resumo mensal
    ├── transactions/    domínio, casos de uso, telas e storage
    └── user/            perfil, autenticação local e storage
```

O legado de `src/screens`, `src/routes`, `src/storage` e `utils` foi substituído pelos módulos atuais; referências históricas devem apontar para os caminhos acima.
