# Pacote inicial do sistema WFC

Este pacote deve ser extraído diretamente em `/home3/cwcimo17/public_html/`, produzindo `/home3/cwcimo17/public_html/wfc_sistema/`. Ele não altera os arquivos do site público legado.

## Configuração do banco

A API lê `WFC_DB_HOST`, `WFC_DB_NAME`, `WFC_DB_USER` e `WFC_DB_PASS` do ambiente PHP. No HostGator, configure as quatro variáveis no mecanismo de ambiente disponível para PHP/Apache. O banco esperado é `cwcimo17_wfc_imoveis`; nunca grave a senha no JavaScript, no repositório ou neste documento.

## Rotas iniciais

- `GET /sistema/api/v1/health`
- `POST /sistema/api/v1/auth/login` com `{ "identity": "...", "password": "..." }`
- `GET /sistema/api/v1/auth/me`
- `POST /sistema/api/v1/auth/logout`
- `GET /sistema/api/v1/dashboard/summary`

A tela inicial é renderizada por `index.php`, usa sessão PHP com cookie HttpOnly/Secure/SameSite e mostra as contagens de `tb_property`, `tb_client` e `tb_user` depois do login.

## Publicação pelo cPanel

1. Faça upload de `wfc-sistema-initial.zip` em `/home3/cwcimo17/public_html/`.
2. Extraia o ZIP nessa pasta, sem criar uma pasta intermediária adicional.
3. Confirme que o arquivo final está em `/home3/cwcimo17/public_html/wfc_sistema/index.php`.
4. Configure as variáveis do banco no ambiente PHP.
5. Abra `/sistema/api/v1/health` e confirme a resposta JSON `ok: true`.
6. Abra `/sistema/` e teste login, sessão, logout e dashboard.

Se o ambiente HostGator não disponibilizar variáveis para PHP, crie uma configuração protegida fora do controle de versão e adapte `api/config/database.php`; não publique credenciais em arquivos JavaScript.
