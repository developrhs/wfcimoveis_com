# Pacote inicial do sistema WFC

Este pacote deve ser extraído diretamente em `/home3/cwcimo17/public_html/`, produzindo `/home3/cwcimo17/public_html/wfc_sistema/`. Ele não altera os arquivos do site público legado.

## Configuração do banco

A API lê `WFC_DB_HOST`, `WFC_DB_NAME`, `WFC_DB_USER` e `WFC_DB_PASS` do ambiente PHP. Como alternativa, crie diretamente no servidor `/home3/cwcimo17/public_html/wfc_sistema/api/config/local.php` com este conteúdo, substituindo apenas os valores:

```php
<?php
define('WFC_DB_HOST', 'localhost');
define('WFC_DB_NAME', 'cwcimo17_wfc_imoveis');
define('WFC_DB_USER', 'cwcimo17_SEU_USUARIO');
define('WFC_DB_PASS', 'SUA_SENHA');
```

Esse arquivo é bloqueado pelo `.htaccess` e não deve ser enviado ao GitHub. O banco esperado é `cwcimo17_wfc_imoveis`; nunca grave a senha no JavaScript, no repositório ou neste documento.

## Rotas iniciais

- `GET /sistema/api/v1/health`
- `POST /sistema/api/v1/auth/login` com `{ "identity": "...", "password": "..." }`
- `GET /sistema/api/v1/auth/me`
- `POST /sistema/api/v1/auth/logout`
- `GET /sistema/api/v1/dashboard/summary`
- `POST /sistema/api/v1/sync/push` (sessão autenticada; envia alterações com `baseVersion`)
- `GET /sistema/api/v1/sync/pull?since=<ISO-8601>` (sessão autenticada; recebe alterações e exclusões)
- `GET /sistema/api/v1/public/properties` (catálogo público de imóveis sincronizados)

A tela inicial é renderizada por `index.php`, usa sessão PHP com cookie HttpOnly/Secure/SameSite e mostra as contagens de `tb_property`, `tb_client` e `tb_user` depois do login.

As rotas de sincronização criam a tabela `wfc_sync_records` na primeira utilização, desde que o usuário MySQL tenha permissão para `CREATE TABLE`. Essa tabela é a fonte de verdade compartilhada para os registros enviados pelo desktop, mantém versão, operação (`UPSERT` ou `DELETE`) e exclusão lógica. O catálogo público lê somente entidades `imovel` com operação `UPSERT`; não expõe dados da equipe.

## Publicação pelo cPanel

1. Faça upload de `wfc-sistema-initial.zip` em `/home3/cwcimo17/public_html/`.
2. Extraia o ZIP nessa pasta, sem criar uma pasta intermediária adicional. O conteúdo deve ficar em `public_html/wfc_sistema/`, não em `public_html/wfc_sistema/wfc_sistema/`.
3. Confirme que o arquivo final está em `/home3/cwcimo17/public_html/wfc_sistema/index.php`.
4. Configure as variáveis do banco no ambiente PHP.
5. Abra `/sistema/api/v1/health` e confirme a resposta JSON `ok: true`.
6. Abra `/sistema/` e teste login, sessão, logout e dashboard.

Se o ambiente HostGator não disponibilizar variáveis para PHP, crie uma configuração protegida fora do controle de versão e adapte `api/config/database.php`; não publique credenciais em arquivos JavaScript.

## Arquitetura permanente do produto

A instalação possui três partes independentes e permanentes:

| Componente | Endereço ou execução | Responsabilidade |
|---|---|---|
| Site público | `https://wfcimoveis.com/` | Apresentar aos clientes os imóveis, propostas e conteúdo público. |
| Sistema web | `https://wfcimoveis.com/sistema/` | Login e telas administrativas de imóveis, clientes, prova social e usuários. |
| WfcSystem | Aplicação Java local | Permitir cadastros offline em SQLite e sincronizar registros pela API HTTPS e imagens pelo FTP quando houver conexão. |

O deploy do sistema web deve alterar somente `/home3/cwcimo17/public_html/wfc_sistema/`, que é acessado externamente como `/sistema/`. **Nunca substituir, limpar ou extrair arquivos diretamente na raiz de `public_html`**, pois ela pertence ao site público já online.

O sistema web não é uma página de manutenção nem um staging temporário: ele é o painel permanente da operação. O site público e o painel compartilham a API e o banco, mas mantêm responsabilidades e arquivos separados. A aplicação Java local também permanece separada do site e nunca recebe credenciais MySQL; ela usa a API HTTPS para dados e o FTP somente para a fila de imagens.

Para tornar a instalação permanente no HostGator, publique o conteúdo de `deploy/wfc_sistema/` em `/home3/cwcimo17/public_html/wfc_sistema/`, configure o `local.php` protegido com os dados do banco e valide `/sistema/api/v1/health`, login e as telas administrativas. A atualização deve ser feita por cópia de segurança da pasta `wfc_sistema` e substituição somente dentro dela.
