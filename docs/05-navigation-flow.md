# Fluxo de navegação

```mermaid
flowchart TD
  MainRoute -->|sem usuário| AuthRoutes
  AuthRoutes --> Login[SignIn]
  MainRoute -->|usuário carregado| StackRoutes
  StackRoutes --> Tabs[BottomTabsRoutes]
  Tabs --> Listagem[Dashboard]
  Tabs --> Cadastrar[Register]
  Tabs --> Resumo[Resume]
  Tabs --> Perfil[Profile]
  Dashboard -->|id string| Edit[Edit]
  Edit --> Tabs
```

`RootTabParamList` usa `Listagem`, `Cadastrar`, `Resumo` e `Perfil`, todos sem parâmetros. `AppStackParamList` usa `Home` sem parâmetros e `Edit` com `{ id: string }`. Os tipos são usados diretamente pelos navegadores.
