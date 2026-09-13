# Etapa 1 — Escopo de módulos e contratos de endpoints

**Projeto:** WFC Imóveis  
**Responsável pela especificação:** Manus Frontend  
**Data:** 13 de setembro de 2026  
**Status:** proposta para validação dos agentes de backend, dados, sistema e infraestrutura

## 1. Objetivo

Esta etapa define o limite funcional da próxima versão e o contrato mínimo entre site público, sistema administrativo, API PHP, banco de dados e WfcSystem desktop. O documento distingue o que já existe no repositório, o que é contrato proposto e o que ainda precisa de confirmação do suporte.

A regra central é separar dados públicos de dados internos. O site público pode receber apenas imóveis e conteúdos explicitamente publicados. Dados de clientes, CPFs, usuários, comissões, vendas internas, documentos e credenciais nunca devem ser enviados ao navegador público.

## 2. Arquitetura de responsabilidades

| Camada | Responsabilidade | Não deve fazer |
|---|---|---|
| Site público `/` | Home, catálogo, detalhe de imóvel, equipe, clientes e contato | Acessar MySQL, usar sessão administrativa ou exibir dados privados |
| Sistema `/sistema` | Login, dashboard, cadastros e operação administrativa | Substituir a raiz pública ou expor endpoints sem autorização |
| API `/sistema/api/v1` | Autenticação, autorização, dados públicos, administração e sincronização | Aceitar payload sem validação ou revelar credenciais |
| MySQL | Persistência relacional e integridade | Ser acessado diretamente pelo navegador ou desktop |
| WfcSystem | Operação local/offline e sincronização | Receber credenciais MySQL ou apagar pendências sem confirmação |
| Infraestrutura | HTTPS, deploy, cache, headers, logs e rollback | Publicar segredo no frontend ou alterar a raiz sem backup |

## 3. Escopo dos módulos

### 3.1 Site público — versão incluída

| Módulo | Escopo | Fonte de dados | Estado |
|---|---|---|---|
| Home | Hero, busca rápida, destaques, especialidades, apresentação, contato e WhatsApp | Conteúdo aprovado + catálogo público | Existente com dados demonstrativos |
| Catálogo | Busca, filtros, ordenação, status, preço, disponibilidade e fallback | `GET /public/properties` | Existente; integração pública implementada |
| Detalhe do imóvel | Galeria, localização, descrição, preço, status e contato | Catálogo público ou endpoint de detalhe | Existente visualmente; endpoint de detalhe pendente |
| Equipe | Apresentação de agentes e contato | Conteúdo público aprovado | Existente com dados estáticos |
| Clientes/depoimentos | Prova social aprovada e anonimizada quando necessário | Endpoint público futuro ou conteúdo aprovado | Existente visualmente; contrato pendente |
| SEO e compartilhamento | Título, descrição, imagem social e URLs canônicas | Frontend + conteúdo aprovado | Parcial; validar na fase pública |

### 3.2 Sistema administrativo — versão incluída

| Módulo | Principais operações | Dados envolvidos | Perfil mínimo proposto |
|---|---|---|---|
| Autenticação | Login, sessão, usuário atual, logout | Usuário e sessão | Todos os usuários autorizados |
| Dashboard | Resumo de imóveis, clientes e usuários | Contagens agregadas | Todos os usuários autenticados |
| Imóveis | Criar, editar, publicar, reservar, vender, arquivar | `imoveis`, tipos e agente | Administrador; Corretor com escopo definido |
| Mídia | Associar, ordenar e remover imagens/vídeos | `midias_imovel` | Administrador e Corretor autorizado |
| Clientes | Criar, editar, consultar e inativar clientes | `clientes` | Administrador e Atendimento |
| Agentes/equipe | Cadastro, contato, bio e status público | `agentes` | Administrador |
| Vendas | Registrar venda e associar cliente/agente/imóvel | `vendas` | Administrador; Corretor conforme política |
| Prova social | Criar, revisar, ativar e inativar depoimentos | `depoimentos` | Administrador e Atendimento |
| Usuários | Perfis, status e sessão | `users`/tabela do sistema | Administrador |
| Auditoria | Registrar mudanças relevantes sem segredos | Tabela futura | Administrador/infraestrutura |
| Configurações | Preferências públicas e integrações não secretas | Configuração controlada | Administrador |

### 3.3 WfcSystem desktop — versão incluída

O desktop deve sincronizar apenas entidades permitidas: `imovel`, `cliente`, `agente`, `venda`, `usuario` e `prova_social`. A sincronização deve manter versão, operação e conflito. O site público não deve depender de dados privados do desktop.

## 4. Modelo de dados de referência

O schema Drizzle atual define `users`, `tipos_imovel`, `tipos_venda`, `agentes`, `imoveis`, `midias_imovel`, `clientes`, `depoimentos` e `vendas`. A API PHP também cria `wfc_sync_records` quando necessário. Existe uma divergência que precisa ser resolvida antes da Etapa 2: alguns endpoints PHP legados consultam tabelas `tb_property`, `tb_client` e `tb_user`, enquanto o schema Drizzle usa nomes em português como `imoveis`, `clientes` e `users`.

Essa divergência não será escondida no frontend. O agente de banco/backend deve definir se haverá migração para um único schema, camada de compatibilidade ou adaptador explícito.

## 5. Convenções de resposta

Todas as respostas devem usar JSON UTF-8 e não devem expor stack trace, senha, hash, CPF, token ou credencial. Erros devem usar o formato mínimo:

```json
{
  "error": {
    "code": "PROPERTY_NOT_FOUND",
    "message": "Imóvel não encontrado.",
    "details": {}
  },
  "requestId": "opcional"
}
```

O backend atual usa `{"error":"..."}`. A migração para o formato com `code` deve ser confirmada pelo agente de API antes de alterar o frontend. Até essa confirmação, o frontend deve aceitar a mensagem legada sem presumir `details`.

## 6. Contratos existentes e propostos

### 6.1 Saúde da API — existente

```text
GET /sistema/api/v1/health
```

**Sucesso proposto:**

```json
{
  "ok": true,
  "service": "wfc-sistema",
  "database": "ok",
  "version": "string"
}
```

**Erros:** `503` quando o backend ou banco estiver indisponível; `500` para falha não classificada. O formato exato precisa ser confirmado pelo backend.

### 6.2 Autenticação — existente no pacote PHP

```text
POST /sistema/api/v1/auth/login
Content-Type: application/json
```

**Entrada:**

```json
{
  "identity": "usuario-ou-email",
  "password": "senha"
}
```

**Sucesso:** `200` ou `2xx`, com usuário seguro e cookie de sessão HttpOnly/Secure/SameSite.

```json
{
  "user": {
    "id": 1,
    "username": "usuario",
    "email": "usuario@example.com",
    "name": "Nome público ou interno conforme contexto",
    "role": "Administrador",
    "status": "ativo"
  }
}
```

**Erros:** `400` entrada inválida, `401` credencial inválida, `403` usuário inativo, `429` excesso de tentativas, `503` banco indisponível. Não retornar qual parte da credencial falhou.

```text
GET /sistema/api/v1/auth/me
```

Retorna `200` com `user` quando autenticado e `401` quando não autenticado.

```text
POST /sistema/api/v1/auth/logout
```

Retorna `200` com `{"success":true}` e invalida a sessão. Deve ser seguro repetir.

### 6.3 Catálogo público — existente

```text
GET /sistema/api/v1/public/properties
```

**Query parameters propostos:**

| Parâmetro | Tipo | Observação |
|---|---|---|
| `q` | string | Busca por título, localização ou código |
| `type` | string | Tipo de imóvel |
| `saleType` | string | Tipo de venda |
| `status` | enum | Padrão `disponivel`; valores permitidos precisam ser confirmados |
| `minPrice` | integer | Centavos de real |
| `maxPrice` | integer | Centavos de real |
| `page` | integer | Padrão 1 |
| `pageSize` | integer | Limite máximo definido pelo backend |
| `sort` | enum | `recentes`, `menor`, `maior` |

**Resposta mínima compatível com o frontend atual:**

```json
{
  "items": [
    {
      "id": "01310",
      "title": "Casa dos Sonhos",
      "subtitle": "string|null",
      "description": "string",
      "type": "Casa",
      "saleType": "Financiamento",
      "location": "Senador Canedo · Jardim das Oliveiras",
      "price": 42000000,
      "status": "disponivel",
      "available": 1,
      "total": null,
      "bedrooms": 3,
      "baths": 2,
      "area": "148 m²",
      "images": ["https://..."],
      "updatedAt": "2026-09-13T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 24,
    "total": 1,
    "totalPages": 1
  }
}
```

O backend atualmente retorna `items` de `wfc_sync_records` e limita a 500 registros. `pagination`, filtros, ordenação, `bedrooms`, `baths` e `images` precisam ser confirmados. O endpoint público deve retornar somente imóveis publicados e dados de mídia públicos.

### 6.4 Detalhe público — proposto

```text
GET /sistema/api/v1/public/properties/{id}
```

Retorna `200` com o mesmo modelo do catálogo, acrescido de descrição completa, galeria ordenada e metadados públicos. Retorna `404` sem revelar existência de dados privados quando o imóvel não estiver publicado.

O frontend pode continuar usando fallback enquanto esse endpoint não existir, mas a troca para dados reais exige contrato confirmado.

### 6.5 Resumo administrativo — existente no pacote PHP

```text
GET /sistema/api/v1/dashboard/summary
```

Requer sessão autenticada. O pacote PHP atual retorna:

```json
{
  "data": {
    "properties": 0,
    "clients": 0,
    "users": 0
  }
}
```

O nome e o conteúdo das tabelas consultadas (`tb_property`, `tb_client`, `tb_user`) precisam ser alinhados ao schema oficial antes de produção.

### 6.6 Sincronização — existente no pacote PHP

```text
POST /sistema/api/v1/sync/push
```

Requer sessão e perfil `Administrador`, `admin` ou `Corretor`. Entrada:

```json
{
  "items": [
    {
      "queueId": 10,
      "entityType": "imovel",
      "entityId": "01310",
      "operation": "UPSERT",
      "payload": {},
      "baseVersion": 2
    }
  ]
}
```

O pacote atual aceita no máximo 100 itens, permite os tipos `imovel`, `cliente`, `agente`, `venda`, `usuario` e `prova_social`, e retorna:

```json
{
  "accepted": [
    { "entityType": "imovel", "entityId": "01310", "version": 3 }
  ],
  "conflicts": []
}
```

Conflitos retornam `200` com a lista `conflicts`; o cliente não deve marcar como sincronizado itens não presentes em `accepted`.

```text
GET /sistema/api/v1/sync/pull?since=2026-09-13T00:00:00Z
```

Retorna no máximo 500 itens:

```json
{
  "items": [
    {
      "entityType": "imovel",
      "entityId": "01310",
      "version": 3,
      "operation": "UPSERT",
      "payload": {},
      "updatedAt": "2026-09-13T00:00:00Z"
    }
  ],
  "serverTime": "2026-09-13T00:01:00Z"
}
```

O cliente desktop atualmente espera campos próximos a `updatedAt` e `serverTime`; a compatibilidade deve ser testada. Cursor inválido deve retornar `422`, sessão ausente `401`, permissão insuficiente `403` e falha de banco `500` ou `503` conforme política do backend.

## 7. Matriz de acesso proposta

| Recurso | Público | Atendimento | Corretor | Administrador |
|---|---:|---:|---:|---:|
| Catálogo publicado | Leitura | Leitura | Leitura | Leitura |
| Detalhe publicado | Leitura | Leitura | Leitura | Leitura |
| Imóveis | Não | Leitura/edição a confirmar | Leitura/edição | Total |
| Mídia | Não | Não | Gerenciar vinculada | Total |
| Clientes | Não | Criar/editar | Leitura/edição a confirmar | Total |
| Agentes | Não | Leitura | Leitura | Total |
| Vendas | Não | Não | Criar a confirmar | Total |
| Prova social | Não | Criar/editar a confirmar | Não | Total |
| Usuários e perfis | Não | Não | Não | Total |
| Sincronização desktop | Não | Não | Permitida no pacote atual | Permitida |
| Auditoria | Não | Não | Próprio escopo a confirmar | Total |

Esta matriz é proposta. O backend deve confirmar autorização server-side; o frontend nunca deve ser a única barreira de segurança.

## 8. Pendências que bloqueiam a Etapa 2

1. Escolher o schema oficial: tabelas `tb_*` do PHP legado ou tabelas do Drizzle.
2. Confirmar se o catálogo público aceita filtros e paginação no servidor.
3. Confirmar o modelo final de imagens e URLs públicas.
4. Confirmar os campos `bedrooms`, `baths`, `area` e `subtitle`.
5. Confirmar os nomes oficiais dos perfis e suas permissões.
6. Definir se o detalhe público terá endpoint próprio.
7. Definir o formato definitivo de erro e um `requestId` opcional.
8. Confirmar política de cache e limite de requisições.
9. Confirmar ambiente de homologação e dados não sensíveis.
10. Identificar formalmente os agentes de backend, dados, sistema e infraestrutura.

## 9. Critério de aceite da Etapa 1

A Etapa 1 será aceita quando suporte e agentes confirmarem por escrito neste log: escopo dos módulos, schema oficial, contratos de autenticação e catálogo, matriz de acesso, regras de status, modelo de imagens, ambiente de homologação e responsável por cada integração. Até lá, campos marcados como “proposto” não devem ser tratados como contrato de produção.
