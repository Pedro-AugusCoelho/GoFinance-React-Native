# Visão geral do projeto

## Objetivo

Controlar finanças pessoais offline-first, com lançamentos de entrada e saída, parcelamento, filtros por período, resumo por categoria e backup local.

## Usuário e plataformas

O app trabalha com um usuário local, sem conta ou servidor. Android e iOS são as plataformas oficiais; a matriz está em [17-platform-support-matrix.md](17-platform-support-matrix.md).

## Tecnologia

Expo SDK 51, React Native 0.74.5, React 18, TypeScript, React Navigation 6, styled-components, SQLite via `expo-sqlite`, Expo FileSystem/DocumentPicker/Sharing, `expo-crypto`, Jest e TypeScript.

## Funcionalidades confirmadas

- criação e edição de usuário local;
- cadastro, edição, exclusão e parcelamento de entradas/saídas;
- filtros por período e resumo mensal por categoria;
- tema claro/escuro;
- backup JSON versionado com checksum e restauração transacional;
- migração automática do armazenamento legado para SQLite.

## Estado geral

O SQLite local é a fonte de verdade. Não há API ou sincronização remota, e nenhuma operação essencial depende de rede.
