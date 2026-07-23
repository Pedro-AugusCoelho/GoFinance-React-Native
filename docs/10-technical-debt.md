# Débitos técnicos restantes

## TD-001 — Agregação nas telas

**Impacto:** Médio · **Prioridade:** Média. `Dashboard` e `Resume` ainda calculam parte dos totais e agrupamentos na camada de apresentação. **Próximo passo:** extrair seletores/consultas compartilhados e cobrir com testes.

## TD-002 — Integração nativa sem cobertura automatizada

**Impacto:** Alto · **Prioridade:** Alta. SQLite, picker, compartilhamento, permissões, date picker e splash ainda dependem de validação em Android/iOS reais. **Próximo passo:** executar a matriz da plataforma em cada release.

## TD-003 — Migração SQLite sem teste de integração

**Impacto:** Alto · **Prioridade:** Alta. A migração legada existe e normaliza dados, mas ainda precisa de testes com banco real, dados inválidos e falhas de transação.

## TD-004 — Criptografia e retenção do backup

**Impacto:** Alto · **Prioridade:** Média. O checksum detecta corrupção, mas o JSON ainda é legível. **Próximo passo:** decidir senha/chave, recuperação em outro aparelho e retenção.
