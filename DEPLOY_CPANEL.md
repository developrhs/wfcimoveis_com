# Deploy no cPanel — WFC Imóveis

## Diagnóstico confirmado em 09/09/2026

O domínio `https://wfcimoveis.com/` está respondendo com uma aplicação React/Vite compilada. O caminho `https://wfcimoveis.com/sistema` também entrega o mesmo `index.html`, mas a aplicação exibe a página interna **404 Page Not Found**, porque o código atual não possui uma rota `/sistema`.

O repositório `developrhs/wfcimoveis_com` implementa atualmente as rotas públicas `/`, `/catalogo`, `/clientes`, `/equipe`, `/imovel/:id` e o painel `/admin`. Ele **não implementa ainda** o login nem os módulos documentados como `/sistema/inicio`, `/sistema/imoveis`, `/sistema/clientes`, `/sistema/usuarios` e `/sistema/perfil`. Não publicar esses caminhos como se estivessem prontos evita ativar um painel incompleto.

A validação local passou com:

- `pnpm install --frozen-lockfile`
- `pnpm check`
- `pnpm test -- --run` — 3 arquivos e 8 testes aprovados
- `pnpm build` — bundle frontend e `dist/index.js` gerados

## Estrutura do pacote

O arquivo `app.js` é o entrypoint esperado pelo Application Manager/Passenger do cPanel e importa `dist/index.js`. O pacote de produção deve conter diretamente dentro de `wfc_sistema/`:

```text
wfc_sistema/
├── app.js
├── package.json
├── pnpm-lock.yaml
└── dist/
    ├── index.js
    └── public/
        ├── index.html
        └── assets/
```

As dependências não devem ser versionadas no pacote. No cPanel, use **Enable Dependencies** ou execute `npm install --omit=dev` com a versão Node.js configurada para a aplicação.

## Configuração do Application Manager

Use estes valores para a aplicação Node.js:

| Campo | Valor |
|---|---|
| Application Name | WFC Sistema |
| Deployment Domain | `wfcimoveis.com` |
| Base Application URL | `/sistema` somente quando a aplicação tiver as rotas do sistema implementadas; para o site atual, validar primeiro a publicação na raiz |
| Application Path | `wfc_sistema` |
| Deployment Environment | Produção |
| Startup file | `app.js` |

Variáveis de ambiente, preenchidas somente no cPanel:

```text
NODE_ENV=production
JWT_SECRET=<segredo longo e aleatório, não versionar>
DATABASE_URL=mysql://USUARIO_MYSQL:SENHA_MYSQL@localhost:3306/cwcimo17_wfc_imoveis
```

O usuário MySQL precisa estar associado a `cwcimo17_wfc_imoveis` com **All Privileges**. A senha do MySQL é independente da senha de qualquer usuário da aplicação.

## Procedimento seguro

1. Preservar o backup existente e criar uma nova cópia do estado atual antes da troca.
2. Extrair o pacote sem criar uma pasta intermediária: `app.js`, `package.json`, `pnpm-lock.yaml` e `dist/` devem ficar diretamente em `/home3/cwcimo17/wfc_sistema/`.
3. Configurar as variáveis de ambiente no Application Manager.
4. Instalar as dependências e executar **Deploy**.
5. Validar o site público e os logs antes de substituir qualquer conteúdo do `public_html`.
6. Não remover arquivos legados nem publicar o painel `/sistema` até que o login e seus módulos existam no código e sejam testados.

O acesso ao cPanel não foi automatizado nesta sessão porque `https://wfcimoveis.com:2083` apresentou a tela de login. Nenhuma alteração foi feita diretamente no HostGator.
