# Contrato da API WFCSystem

**Versão de referência:** 2026-09-13. Este documento descreve o comportamento implementado em `deploy/wfc_sistema/api/v1`. Ele não autoriza alterações no banco de produção e deve ser atualizado antes de qualquer mudança incompatível.

## Convenções gerais

Todas as rotas retornam JSON UTF-8 e `Cache-Control: no-store`. A sessão web usa o cookie HttpOnly `wfc_session`, com `SameSite=Lax` e caminho `/sistema/`. O frontend e o aplicativo Java não recebem credenciais MySQL.

As respostas de erro seguem, no mínimo, o formato `{ "error": "Mensagem segura" }`. Os códigos não devem revelar credenciais, SQL, nomes de host ou dados pessoais.

| Situação | HTTP | Uso pelo cliente |
|---|---:|---|
| Sucesso | 200 | Processar o payload da rota. |
| Método incorreto | 405 | Corrigir o método; não repetir indefinidamente. |
| Sessão ausente/expirada | 401 | Voltar à tela de login e preservar dados locais. |
| Perfil sem permissão | 403 | Informar falta de permissão; não tentar contornar. |
| Entrada inválida | 422 | Mostrar validação e permitir correção. |
| Payload acima do limite | 413 | Reduzir o lote/payload. |
| Rota inexistente | 404 | Tratar como recurso não disponível. |
| Falha de serviço/banco | 500 ou 503 | Exibir indisponibilidade e preservar operação offline. |

## Endpoints

| Método e rota | Autorização | Sucesso |
|---|---|---|
| `GET /health` | Pública | `{ "ok": true, "service": "wfc-api" }`. O endpoint não retorna detalhes de conexão. |
| `POST /auth/login` | Pública | Entrada `{ "identity": string, "password": string }`; sucesso `{ "user": { "id", "username", "email", "name", "role", "status" } }`. Regenera a sessão. |
| `GET /auth/me` | Sessão | `{ "user": { ... } }`. Sem sessão: `401`. |
| `POST /auth/logout` | Sessão opcional | `{ "success": true }`; destrói a sessão e o cookie. |
| `GET /dashboard/summary` | Sessão | Atualmente pretende retornar `{ "data": { "properties": number, "clients": number, "users": number } }`, mas a consulta depende da resolução do schema de produção. |
| `POST /sync/push` | Sessão e perfil Administrador/admin/Corretor | Entrada `{ "items": SyncItem[] }`, máximo de 100 itens; sucesso `{ "accepted": AcceptedItem[], "conflicts": Conflict[] }`. |
| `GET /sync/pull?since=<ISO-8601>` | Sessão e perfil Administrador/admin/Corretor | `{ "items": SyncItem[], "serverTime": ISO-8601 }`, máximo de 500 itens. |
| `GET /public/properties` | Pública | `{ "items": PropertyPayload[] }`, somente registros `imovel` com `UPSERT`, no máximo 500. |

## Sincronização

Um `SyncItem` possui `entityType`, `entityId`, `operation`, `baseVersion` e, para `UPSERT`, `payload`. Os tipos permitidos são `imovel`, `cliente`, `agente`, `venda`, `usuario` e `prova_social`. As operações são `UPSERT` e `DELETE`.

O servidor incrementa a versão por chave `(entityType, entityId)`. Quando `baseVersion` diverge da versão atual, o item permanece no servidor e é retornado em `conflicts`; não é apagado nem sobrescrito. O payload deve ser objeto/array JSON e possui limite de 500.000 bytes. Um cursor `since` inválido retorna `422`.

## Autorização

O login considera usuário ou e-mail e exige senha válida e status ativo. A resposta não contém senha. A sincronização aceita apenas os perfis `Administrador`, `admin` e `Corretor`; demais perfis recebem `403`.

## Divergência de schema pendente

A implementação de `summary` consulta `tb_property`, `tb_client` e `tb_user`. O schema Drizzle versionado do site contém `imoveis`, `clientes` e `users`, além de `agentes`, `midias_imovel`, `tipos_imovel`, `tipos_venda`, `vendas` e `depoimentos`. A sincronização usa `wfc_sync_records`.

Essa divergência permanece deliberadamente aberta até que Atlas ou o responsável pelo HostGator forneça inventário sanitizado do banco real. Não serão executadas renomeações, exclusões ou migrações por suposição. Após a confirmação, a correção será feita por camada de compatibilidade ou migração versionada, com backup, teste e rollback.

## Critérios de teste antes da integração

A API deve ser testada sem dados reais para método incorreto, login inválido, sessão ausente, perfil sem permissão, validação `422`, limite `413`, conflito de versão, cursor `since`, lote de 100 itens, lote acima do limite, payload inválido, logout e falha de banco. Os testes online devem começar por `health`, continuar por consulta sem mutação e só depois executar sincronização controlada em staging.
