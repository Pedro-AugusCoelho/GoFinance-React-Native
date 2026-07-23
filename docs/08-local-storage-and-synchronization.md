# Armazenamento local e sincronização

## Persistência

O armazenamento principal é SQLite, por meio de `expo-sqlite`, no arquivo `gofinance.db`. O schema atual contém:

| Tabela | Conteúdo |
|---|---|
| `users` | perfil local do usuário |
| `transactions` | lançamentos, parcelas e seus vínculos |
| `settings` | configurações locais, atualmente o tema |
| `metadata` | versão do schema e controle de migração |

O banco cria índices para data e plano de parcelas. A versão atual do schema é `1`.

### Migração legada

Na primeira abertura do banco, os valores antigos das chaves do AsyncStorage são lidos, validados pelos módulos existentes e gravados em SQLite dentro de uma transação. Após a migração bem-sucedida, as três chaves legadas são removidas. O AsyncStorage permanece apenas como mecanismo de migração de versões antigas.

## Backup

O backup não exporta mais todas as chaves do armazenamento. Ele gera um documento JSON com o envelope:

```json
{
  "format": "gofinance-backup",
  "version": 1,
  "exportedAt": "2026-01-01T00:00:00.000Z",
  "checksum": "sha256...",
  "data": {
    "user": null,
    "theme": "light",
    "transactions": []
  }
}
```

A restauração valida formato, versão, checksum, usuário, tema e transações antes de gravar. Ela substitui os dados atuais dentro de uma transação SQLite, portanto uma falha não deve deixar uma restauração parcialmente aplicada. O arquivo ainda é JSON legível e não possui criptografia; a chave/política de criptografia continua pendente.

## Offline-first e sincronização

Offline-first é uma regra do produto: o SQLite local é a fonte de verdade e nenhuma operação essencial depende de rede. Atualmente não existe sincronização remota, fila pendente, resolução de conflitos ou recuperação de falha de rede — e o app deve continuar plenamente utilizável nesse estado.

Uma sincronização futura deverá ser uma camada opcional, executada em segundo plano e sem bloquear leitura/escrita local. Ela exigirá outbox, identificadores estáveis, idempotência, resolução de conflitos e recuperação de falhas.
