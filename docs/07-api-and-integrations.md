# APIs e integrações

## Estado confirmado

Não há `fetch`, Axios, endpoints ou cliente HTTP. O app é offline-first e não depende de API remota.

## Serviços externos e nativos

São usados Expo Font/Splash, ImagePicker, FileSystem, DocumentPicker, Sharing, SQLite, Crypto e DateTimePicker. Metro usa `react-native-svg-transformer`; `victory-native` renderiza o gráfico.

## Autenticação e segurança

Não existe autenticação remota. Dados ficam no SQLite local. O backup usa checksum SHA-256, mas ainda é JSON legível e não possui criptografia de conteúdo.

## Pendências reais

Criptografia/senha e retenção de backups precisam de decisão de produto. Os fluxos nativos de arquivo, permissão e compartilhamento precisam de testes em dispositivos Android/iOS.
