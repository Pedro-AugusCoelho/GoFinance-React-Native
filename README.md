# GoFinance

Aplicativo mobile offline-first para controle de finanças pessoais, desenvolvido com Expo e React Native.

O GoFinance permite registrar entradas e saídas, acompanhar parcelas, visualizar resumos por categoria e manter os dados disponíveis sem conexão com a internet.

## Recursos

- Cadastro e edição de entradas e saídas.
- Parcelamento com distribuição correta dos centavos.
- Edição ou exclusão da parcela atual, das próximas ou de todo o plano.
- Filtros por período.
- Resumo mensal por categoria com gráfico.
- Perfil local com nome e foto.
- Tema claro e escuro.
- Banco local SQLite.
- Migração automática de instalações legadas baseadas em AsyncStorage.
- Backup JSON versionado, validado e protegido por checksum SHA-256.
- Restauração substitutiva dentro de uma transação SQLite.

## Princípio offline-first

O SQLite local é a fonte de verdade do aplicativo. As operações essenciais — cadastro, edição, exclusão, consulta, perfil, tema e backup — não dependem de rede.

Não existe backend ou sincronização remota atualmente. Caso seja adicionada no futuro, deverá ser opcional e não poderá bloquear o uso offline.

## Tecnologias

- Expo SDK 51
- React Native 0.74.5
- TypeScript
- React Navigation 6
- SQLite com `expo-sqlite`
- `styled-components`
- React Hook Form + Yup
- Jest + ts-jest
- `date-fns`
- Expo FileSystem, DocumentPicker, Sharing, ImagePicker e Crypto

## Arquitetura

```text
src/
├── app/                 bootstrap e navegação
├── core/
│   ├── database/        SQLite, schema e migração
│   ├── errors/          erros tipados
│   └── storage/         ponte legada de migração
├── shared/              componentes e tema
└── modules/
    ├── backup/
    ├── reports/
    ├── transactions/
    └── user/
```

As telas delegam regras de negócio aos casos de uso. A persistência fica atrás de repositórios e adaptadores locais.

## Requisitos

- Node.js compatível com Expo SDK 51.
- Android Studio e SDK Android para executar no Android.
- macOS e Xcode para executar no iOS.

Suporte declarado: Android API 23–34 e iOS 13+. Consulte a [matriz de suporte](docs/17-platform-support-matrix.md).

## Instalação

```bash
npm install
```

Inicie o servidor Expo:

```bash
npm start
```

Execute diretamente em uma plataforma nativa:

```bash
npm run android
npm run ios
```

O suporte Web está disponível como dependência do Expo, mas não é uma plataforma oficial deste projeto.

## Testes e validação

```bash
npm test
npx tsc --noEmit
```

A suíte atual cobre erros tipados, parcelamento, valores, datas, filtros, casos de uso de transações e formato/checksum do backup.

## Backup e migração

O backup contém apenas dados do aplicativo e utiliza um envelope com formato, versão, data de exportação, checksum e dados. Arquivos incompatíveis ou corrompidos são rejeitados antes da gravação.

Na primeira execução após a atualização, dados antigos do AsyncStorage são migrados para SQLite. As chaves legadas só são removidas após a migração ser concluída com sucesso.

O backup ainda é um arquivo JSON legível e não possui criptografia de conteúdo. Essa política precisa ser definida antes de usar o recurso para dados altamente sensíveis.

## Documentação

A documentação técnica está em [`docs/`](docs/README.md), incluindo:

- arquitetura e estrutura de pastas;
- fluxo de dados;
- armazenamento e backup;
- estratégia de testes;
- riscos e questões em aberto;
- matriz de suporte de plataformas;
- decisões arquiteturais.

## Status

Projeto em evolução. A base offline-first, o armazenamento SQLite, a migração legada, os casos de uso de transações e os testes unitários estão implementados. Ainda estão planejados testes de integração nativa, execução completa da matriz Android/iOS e decisão sobre criptografia dos backups.
