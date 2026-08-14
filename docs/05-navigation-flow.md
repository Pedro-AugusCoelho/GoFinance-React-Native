# Fluxo de navegação

```mermaid
flowchart TD
  MainRoute -->|sem usuário| AuthRoutes
  AuthRoutes --> Login[SignIn]
  MainRoute -->|usuário carregado| StackRoutes
  StackRoutes --> Tabs[BottomTabsRoutes]
  Tabs --> Listagem[Dashboard]
  Tabs --> Cadastrar[Register]
  Tabs --> Importar[ImportStatement]
  Tabs --> Resumo[Resume]
  Tabs --> Perfil[Profile]
  Dashboard -->|id string| Edit[Edit]
  Edit --> Tabs
  Importar -->|toque no card| Picker[DocumentPicker CSV]
  Picker --> Preview[Prévia / confirmação]
  Preview -->|confirmar| SQLite[(SQLite transactions)]
```

`RootTabParamList` usa `Listagem`, `Cadastrar`, `Importar`, `Resumo` e `Perfil`, todos sem parâmetros. `AppStackParamList` usa `Home` sem parâmetros e `Edit` com `{ id: string }`. Os tipos são usados diretamente pelos navegadores.

A aba `Importar` e o fluxo de importação de extratos estão especificados em [`18-bank-statement-import-prompt.md`](18-bank-statement-import-prompt.md).
