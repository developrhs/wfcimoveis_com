# Plano de deploy — WFC Imóveis e WFCSystem Online

## Objetivo

Publicar o site público e o sistema online no HostGator com separação segura entre a aplicação pública React/Vite e a API PHP do `/sistema`, preservando o estado atual e permitindo rollback rápido. Este documento é um plano de execução; nenhuma alteração no cPanel foi realizada nesta etapa.

## Diagnóstico atual

A origem `https://wfcimoveis.com/` responde com HTTP 200. Os caminhos `/sistema` e `/admin` também respondem com o mesmo shell da aplicação, portanto a validação final deve ser feita no navegador e por funcionalidade, não apenas por código HTTP. O roteamento local atual possui uma entrada dedicada para `/sistema` (`SystemLanding`) e o repositório contém endpoints PHP em `deploy/wfc_sistema/api/v1`.

O cPanel/HostGator ainda não está conectado nesta sessão. A documentação anterior registra que a tela de login foi encontrada em `https://wfcimoveis.com:2083`, mas não houve alteração direta no servidor. As credenciais, segredos JWT e senhas de banco não devem ser enviados ao Git nem ao log de colaboração.

## Arquitetura de publicação proposta

| Área | Local/serviço | Tratamento |
|---|---|---|
| Site público | Document root/`public_html` conforme o estado atualmente publicado | Atualizar somente após backup, build aprovado e smoke test; preservar arquivos legados até o aceite. |
| Runtime Node | Application Manager/Passenger, aplicação `WFC Sistema`, path `wfc_sistema` | Usar `app.js` como startup file e `dist/index.js` como servidor compilado. |
| Interface `/sistema` | Rota `/sistema` da aplicação publicada ou separação definida com o backend | Liberar como funcional somente após validar login, sessão, resumo e rotas integradas. |
| API PHP | `wfc_sistema/api` no document root definido pelo parceiro/backend | Configurar `local.php` fora do Git ou variáveis `WFC_DB_*`; manter `api/config/` bloqueado por `.htaccess`. |
| Banco | MySQL do HostGator | Associar usuário ao banco com privilégios necessários; executar migrações somente após backup e confirmação do schema. |

## Fases de execução

### Fase 0 — Contratos e acesso

Confirmar com a IA de backend a origem oficial da API, o contrato de login/sessão, os endpoints de health e summary, o schema SQL e a estratégia de sincronização. Confirmar com o responsável pelo HostGator o acesso ao cPanel, o domínio/subdomínio de teste, a versão PHP, a versão Node.js disponível e a localização real do document root. Sem esses dados, fica proibida qualquer troca em produção.

### Fase 1 — Preparação local

Instalar dependências com `pnpm install --frozen-lockfile`, executar `pnpm check`, `pnpm test -- --run` e `pnpm build`. Confirmar que o pacote contém diretamente `app.js`, `package.json`, `pnpm-lock.yaml` e `dist/`, sem `node_modules` versionado. Fazer uma inspeção de segredos, conferir os rewrites e testar o servidor compilado localmente.

### Fase 2 — Preparação do HostGator

Criar backup nomeado do conteúdo atual e do banco. Criar ou confirmar o banco `cwcimo17_wfc_imoveis` e seu usuário associado. Configurar no Application Manager `NODE_ENV=production`, `JWT_SECRET` e `DATABASE_URL` somente no ambiente Node; para a API PHP, configurar `WFC_DB_HOST`, `WFC_DB_NAME`, `WFC_DB_USER` e `WFC_DB_PASS` por `local.php` não versionado ou pelo mecanismo seguro disponível no hosting. Não reutilizar senhas de usuários da aplicação como senha do MySQL.

### Fase 3 — Publicação controlada

Enviar o pacote para uma pasta de staging ou para o caminho da aplicação sem apagar o estado anterior. Instalar dependências de produção com o mecanismo suportado pelo cPanel, executar Deploy/Restart e verificar os logs do Passenger. Publicar a API PHP no caminho acordado e conferir permissões, `.htaccess`, cookies `HttpOnly`/`Secure` e o bloqueio de `api/config/`.

### Fase 4 — Smoke test e aceite

Validar HTTP/HTTPS, certificado, carregamento do site público, refresh das rotas SPA, `/sistema`, login válido e inválido, `/api/v1/health`, `/api/v1/auth/me`, logout, resumo protegido, resposta sem vazamento de credenciais e comportamento sem banco. Conferir no mínimo desktop e mobile, logs sem erro fatal e ausência de regressão no catálogo e no contato público.

### Fase 5 — Go-live e acompanhamento

Somente após o aceite, apontar o caminho definitivo, remover temporários e manter o backup pelo período combinado. Registrar data, commit, pacote, versões Node/PHP, migrações executadas e resultado dos testes. Acompanhar logs e endpoints críticos após a publicação.

## Critérios de aceite

O deploy será considerado aprovado quando o site público carregar sem regressão, o `/sistema` apresentar o fluxo implementado pelo frontend/backend, a API retornar health positivo com banco configurado, sessões respeitarem HTTPS e os logs não apresentarem erros novos críticos. Qualquer falha de autenticação, rewrite, conexão MySQL, asset ou rota SPA interrompe o go-live.

## Rollback

Em caso de falha, desabilitar o release novo no Application Manager, restaurar o pacote anterior e o document root a partir do backup, reverter migrações somente com procedimento do backend e validar novamente a homepage, catálogo, `/sistema` e health. Não apagar o backup nem executar rollback destrutivo sem preservar os logs do incidente.

## Pendências bloqueadoras

| Pendência | Responsável sugerido | Evidência necessária |
|---|---|---|
| Acesso autorizado ao cPanel/Application Manager | Responsável HostGator | Login ou execução acompanhada no painel; nunca registrar senha. |
| Contrato final frontend/API e rotas do sistema | Nina + IA backend | Lista de endpoints, métodos, respostas e estados de erro. |
| Schema/migração de produção | IA backend | SQL revisado e procedimento de backup/execução. |
| Versões Node.js/PHP e document root | HostGator | Versões disponíveis e caminhos reais no cPanel. |
| Credenciais de staging/usuário de teste | Responsável do projeto | Fornecidas por canal seguro, nunca no Git/log. |

## Estado

Planejamento iniciado em 13/09/2026. O acesso ao HostGator ainda não foi estabelecido e nenhum arquivo remoto foi alterado. A próxima ação técnica é concluir as validações locais e alinhar as pendências com Nina e com a IA de backend antes de solicitar a janela de publicação.
