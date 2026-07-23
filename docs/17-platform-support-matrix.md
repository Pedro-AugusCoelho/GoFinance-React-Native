# Matriz de suporte de plataformas

## Baseline oficial

| Plataforma | Suporte declarado | Origem da configuração | Estado |
|---|---|---|---|
| Android | API 23 a API 34; `armeabi-v7a`, `arm64-v8a`, `x86`, `x86_64` | `android/build.gradle` e `android/gradle.properties` | Configurado; precisa de execução em dispositivos/emuladores |
| iOS | iOS 13.0 ou superior; iPhone e iPad | `ios/Podfile` e `app.json` | Configurado; precisa de execução em dispositivos/simuladores |
| Web | Não é plataforma oficial | Dependência presente, mas sem matriz de comportamento | Não suportado neste ciclo |

O app usa Expo SDK 51, React Native 0.74.5 e Hermes. A matriz deve ser revisada quando o SDK, o React Native ou os targets nativos forem atualizados.

## Recursos com aceite por plataforma

| Recurso | Android | iOS | Critério de aceite |
|---|---|---|---|
| SQLite | API 23+ | iOS 13+ | Abrir o app, migrar dados legados e criar/editar/excluir transação após reinício |
| Criar backup | Compartilhar JSON ou retornar arquivo local | Compartilhar JSON ou retornar arquivo local | Arquivo abre como JSON UTF-8 e contém `format`, `version`, `exportedAt` e `data` |
| Restaurar backup | Document picker seleciona `.json` | Document picker seleciona `.json` | Arquivo inválido é rejeitado; arquivo válido substitui dados sem restauração parcial |
| Compartilhamento | `expo-sharing` com `mimeType` JSON | `expo-sharing` com UTI JSON | Fluxo de compartilhar/salvar é concluído ou informa indisponibilidade |
| SVG | Metro remove `svg` de `assetExts` e usa `react-native-svg-transformer` | Mesmo comportamento | Logo, ícones Google/Apple e splash aparecem sem erro de bundling |
| Date picker | Spinner Android e confirmação OK/Cancelar | Picker nativo iOS | Seleção, cancelamento e alteração de data funcionam em cadastro, edição e filtros |
| Splash | Configuração Expo e recursos Android | Storyboard e assets iOS | Splash usa fundo/asset corretos e desaparece após carregamento das fontes |

## Checklist de release

Antes de considerar uma versão compatível:

1. Executar `npx tsc --noEmit` e `npm test`.
2. Gerar e abrir build Android em API 23 e API 34, em pelo menos um aparelho ARM64.
3. Gerar e abrir build iOS em iOS 13 e na versão mais recente disponível no ciclo.
4. Testar criação, compartilhamento, seleção e restauração de backup em Android e iOS.
5. Testar SVG, splash, date picker, teclado numérico e rotação/tamanho de tela.
6. Registrar o resultado com versão do sistema, aparelho/emulador, build e falha observada.

Até que os passos 2 a 5 sejam executados em cada ciclo, a compatibilidade deve ser considerada “configurada, mas não verificada”, e não “garantida”.
