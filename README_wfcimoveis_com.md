# Estado factual do site WFC Imóveis

**Projeto:** `developrhs/wfcimoveis_com`  
**Domínio analisado:** `https://wfcimoveis.com`  
**Data da constatação:** 18 de setembro de 2026  
**Escopo:** somente constatação do estado atual do site, das referências de API e da publicação visível no cPanel. Nenhuma alteração foi feita no site, no cPanel, no banco de dados ou no FTP durante esta análise.

## 1. Conclusão objetiva

O domínio `https://wfcimoveis.com` está entregando o site público React/Vite. O catálogo exibido no site busca os imóveis pela API PHP publicada em:

```text
https://wfcimoveis.com/sistema/api/v1/public/properties
```

A mesma API PHP possui o endpoint público de saúde:

```text
https://wfcimoveis.com/sistema/api/v1/health
```

Esse endpoint respondeu HTTP 200 com:

```json
{"ok":true,"service":"wfc-api"}
```

O site não está usando `/api/health` ou `/api/v1/health` como API pública de catálogo. As duas rotas foram consultadas e retornaram o HTML do site, não uma resposta JSON de saúde.

Portanto, no estado constatado, existe uma separação funcional clara:

| Finalidade | Endereço constatado | Resultado |
|---|---|---|
| Site público | `https://wfcimoveis.com/` | HTML da aplicação React/Vite |
| API PHP online | `https://wfcimoveis.com/sistema/api/v1/` | API JSON funcional |
| Catálogo público consumido pelo site | `/sistema/api/v1/public/properties` | HTTP 200 e JSON com imóveis |
| Raiz `/api/health` | `https://wfcimoveis.com/api/health` | HTML do site, não JSON |
| Raiz `/api/v1/health` | `https://wfcimoveis.com/api/v1/health` | HTML do site, não JSON |
| Rota `/sistema/api/health` sem `/v1` | `https://wfcimoveis.com/sistema/api/health` | HTML do painel, não a API JSON |

## 2. Repositório analisado

O repositório foi clonado diretamente do GitHub:

```text
developrhs/wfcimoveis_com
```

Estado encontrado:

```text
2480c64 fix: map public catalog to tb_property columns
6a0c735 fix: read public catalog from existing property table
c211153 feat: add mysql sync schema installer
1d10ce1 fix: make mysql diagnostic compatible with mysql57
37e819f fix: make database diagnostic compatible with mysql 5.7
```

O commit atual analisado é:

```text
2480c64 fix: map public catalog to tb_property columns
```

O repositório estava limpo no momento da clonagem. O projeto contém frontend React/Vite e código Node/Express com rotas internas `/api`, mas a existência dessas rotas no código não significa que elas estejam expostas pelo domínio publicado.

## 3. O que o site público entrega

A página inicial respondeu com conteúdo da imobiliária WFC Imóveis, incluindo catálogo, busca de imóveis, links de WhatsApp e informações de Senador Canedo e região.

A resposta pública apresentou, entre outros elementos:

- título e marca WFC Imóveis;
- navegação para imóveis, clientes, especialidades, equipe e contato;
- catálogo com oportunidades imobiliárias;
- contagem pública de oportunidades;
- links para atendimento por WhatsApp;
- carregamento de arquivos JavaScript e CSS de uma aplicação compilada.

Os cabeçalhos observados indicaram resposta HTTPS servida através do Cloudflare. O HTML público possui arquivos compilados em `/assets/` e a publicação observada no cPanel possui `index.html` dentro de `public_html`.

## 4. Referência de API no código do site

O arquivo `client/src/lib/publicProperties.ts` define a chamada do catálogo como:

```text
/sistema/api/v1/public/properties
```

A chamada é relativa ao domínio atual. Isso significa que, quando executada em `https://wfcimoveis.com`, ela se transforma em:

```text
https://wfcimoveis.com/sistema/api/v1/public/properties
```

O código envia `Accept: application/json` e espera um objeto JSON com a propriedade `items`.

O arquivo `client/src/_core/systemSession.ts` também define chamadas relativas a:

```text
/sistema/api/v1/{path}
```

Esse padrão é usado para autenticação e operações do sistema administrativo quando a aplicação correspondente está disponível.

O roteador React reconhece `/sistema` como uma base separada do site público. No código atual, essa base contém uma tela de entrada do sistema. Isso não altera a constatação de que a API de dados consumida pelo catálogo está em `/sistema/api/v1`.

## 5. Respostas reais das rotas testadas

As seguintes consultas foram realizadas sem enviar dados, sem autenticar e sem alterar estado:

### 5.1 API PHP de saúde

```text
GET https://wfcimoveis.com/sistema/api/v1/health
HTTP 200
Content-Type: application/json; charset=utf-8
Resposta: {"ok":true,"service":"wfc-api"}
```

### 5.2 API PHP do catálogo

```text
GET https://wfcimoveis.com/sistema/api/v1/public/properties
HTTP 200
Content-Type: application/json; charset=utf-8
```

A resposta contém `items` com registros de imóveis. Na amostra observada, existem registros com identificadores como `143` e `142`, além de campos como `title`, `type`, `saleType`, `location`, `price`, `status`, `available`, `bedrooms`, `baths`, `area` e `image`.

### 5.3 Raiz `/api`

```text
GET https://wfcimoveis.com/api/health
HTTP 200
Content-Type: text/html
```

O corpo retornado é o HTML do site público. Não existe, nessa URL publicada, uma resposta JSON de API de saúde.

### 5.4 Raiz `/api/v1`

```text
GET https://wfcimoveis.com/api/v1/health
HTTP 200
Content-Type: text/html
```

O corpo retornado também é o HTML do site público. Não existe, nessa URL publicada, uma resposta JSON de API de saúde.

### 5.5 Caminho sem `/v1` dentro de `/sistema`

```text
GET https://wfcimoveis.com/sistema/api/health
HTTP 200
Content-Type: text/html; charset=UTF-8
```

Essa URL retornou o HTML do painel administrativo, não a resposta JSON da API. O caminho funcional constatado inclui obrigatoriamente `/v1`.

## 6. Estrutura constatada no cPanel

O acesso ao cPanel mostrou:

```text
Usuário: cwcimo17
Domínio primário: wfcimoveis.com
Diretório inicial: /home3/cwcimo17
IP da hospedagem: 162.241.2.254
Certificado SSL: ativo
```

Na raiz da conta existe um diretório separado chamado:

```text
/home3/cwcimo17/wfc_sistema
```

Dentro de `public_html`, o cPanel mostrou os seguintes elementos relevantes:

```text
/home3/cwcimo17/public_html/index.html
/home3/cwcimo17/public_html/assets/
/home3/cwcimo17/public_html/wfc_sistema/
/home3/cwcimo17/public_html/wfc_storage/
/home3/cwcimo17/public_html/.htaccess
/home3/cwcimo17/public_html/README.md
```

Também foram observados arquivos compactados e artefatos de publicação dentro de `public_html`, incluindo pacotes relacionados ao site e ao sistema. Esses arquivos fazem parte do estado hospedado observado, mas não foram abertos, substituídos, removidos ou executados nesta constatação.

A presença de `public_html/wfc_sistema` confirma que há um diretório de sistema dentro da área pública da hospedagem. A presença de `/home3/cwcimo17/wfc_sistema` na raiz da conta confirma também que existe outro diretório de mesmo nome fora de `public_html`. A inspeção desta etapa não concluiu que os dois diretórios tenham o mesmo conteúdo.

## 7. Estado real das duas referências de API

### API PHP do sistema online

A referência funcional constatada é:

```text
https://wfcimoveis.com/sistema/api/v1
```

Ela responde JSON em `/health` e em `/public/properties`. O site público usa essa API para carregar o catálogo.

### API Node/React do projeto do site

O repositório contém referências internas a caminhos como:

```text
/api/trpc
/api/oauth/callback
/api/scheduled/...
```

Essas referências pertencem ao código da aplicação full-stack e às ferramentas de desenvolvimento. Porém, no domínio público atualmente testado, `/api/health` e `/api/v1/health` retornam o HTML do site. Portanto, não há evidência de que uma API Node independente esteja publicada nessas rotas no ambiente de produção atual.

Essa é a possível origem do conflito mencionado: o código do repositório contém uma arquitetura full-stack com rotas `/api`, enquanto o site publicado e o catálogo real estão usando a API PHP em `/sistema/api/v1`.

## 8. O que foi confirmado e o que não foi confirmado

### Confirmado

- O domínio público está acessível por HTTPS.
- O site público está entregando uma aplicação React/Vite compilada.
- O catálogo público responde com dados vindos de `/sistema/api/v1/public/properties`.
- `/sistema/api/v1/health` responde JSON com `ok: true`.
- O caminho `/sistema/api/v1` é diferente de `/api` e de `/api/v1`.
- O cPanel possui `public_html`, `public_html/wfc_sistema`, `public_html/wfc_storage` e um diretório separado `/home3/cwcimo17/wfc_sistema`.
- O certificado SSL do domínio está ativo.

### Não confirmado nesta etapa

- O conteúdo completo atual de `public_html/wfc_sistema`.
- O conteúdo completo atual de `/home3/cwcimo17/wfc_sistema`.
- Qual aplicação está configurada no Application Manager do cPanel.
- Qual processo Node, se algum, está ativo em produção.
- Quais arquivos PHP estão por trás de `/sistema/api/v1`.
- A configuração interna do banco de dados e suas permissões.
- A identidade exata do deploy que gerou o `index.html` público.
- A equivalência entre o código mais recente do GitHub e os arquivos atualmente publicados.

## 9. Estado desta etapa

Este documento registra somente constatações. Nenhum arquivo de produção foi editado. Nenhuma tabela foi criada ou alterada. Nenhum login foi executado. Nenhum upload ou teste de escrita foi feito no FTP.

A constatação central é que o site público, no estado observado, depende da API PHP em `/sistema/api/v1`. As referências `/api` existentes no repositório não correspondem a uma API JSON funcional nas mesmas rotas do domínio público atualmente verificado.

## Referências

[1]: https://wfcimoveis.com "Site público WFC Imóveis"
[2]: https://wfcimoveis.com/sistema/api/v1/health "Endpoint público de saúde da API PHP"
[3]: https://wfcimoveis.com/sistema/api/v1/public/properties "Endpoint público de propriedades consumido pelo site"
[4]: https://github.com/developrhs/wfcimoveis_com "Repositório do site WFC Imóveis"
