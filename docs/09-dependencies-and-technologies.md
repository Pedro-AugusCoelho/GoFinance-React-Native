# Dependências e tecnologias

## Produção

| Dependência | Finalidade |
|---|---|
| Expo 51 / React Native 0.74.5 | runtime e plataforma mobile |
| React Navigation 6 | stack e tabs |
| `expo-sqlite` | persistência local e migração |
| `expo-file-system`, `expo-document-picker`, `expo-sharing` | backup e restauração |
| `expo-crypto` | checksum SHA-256 do backup |
| `react-hook-form`, Yup e resolvers | formulários e validação |
| `date-fns` | manipulação de datas |
| `react-native-svg` e transformer | SVG |
| `victory-native` | gráfico do resumo |

## Desenvolvimento e build

TypeScript, Jest, ts-jest, Babel Expo, Metro customizado, Gradle/Android e Xcode/iOS. Scripts: `start`, `android`, `ios`, `web`, `test` e `test:watch`.
