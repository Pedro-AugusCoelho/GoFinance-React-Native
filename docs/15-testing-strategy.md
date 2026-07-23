# Estratégia de testes

## Estado atual

O projeto possui Jest configurado com `npm test`. A suíte atual contém quatorze testes unitários cobrindo:

- distribuição de centavos no parcelamento;
- criação, edição e exclusão por escopo;
- formato, versão, checksum e rejeição de backup corrompido.
- códigos e mensagens de erros da aplicação.
- datas civis, fusos, datas inválidas, filtros e conversão monetária.

`npx tsc --noEmit` também passa.

## Prioridade futura

1. Testar migração do AsyncStorage para SQLite, incluindo dados vazios, legados, inválidos e falhas.
2. Testar leitura, escrita e restauração SQLite com rollback em caso de erro.
3. Adicionar unitários para datas, filtros, saldo e agrupamento por categoria.
4. Integração de navegação: usuário ausente/presente, abertura de edição e retorno.
5. Interface para cadastro, confirmação de exclusão, seleção de categoria, tema e backup.
6. Cenários de plataforma para permissões de imagem, picker, compartilhamento e date picker.

Fluxos offline devem validar leitura/escrita local, reinício do app, migração e recuperação de JSON. Se API for adicionada, incluir timeout, erro 4xx/5xx, repetição idempotente e conflitos.
