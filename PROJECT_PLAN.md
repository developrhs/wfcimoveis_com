# Projeto WFCSystem — plano de conclusão

## Posição atual do tabuleiro

O domínio público `wfcimoveis.com` está sendo servido por uma aplicação React hospedada atrás do Cloudflare. O HostGator possui o pacote PHP do sistema, mas o document root cPanel não é a origem efetiva da página pública. Por isso, copiar arquivos para `public_html/wfc_sistema` não muda automaticamente o que aparece em `/sistema`.

A primeira entrega deve ser visual e reversível: uma tela azul própria para `/sistema`, sem alterar a rota `/`. Depois da prova visual, a mesma rota será conectada ao PHP, ao MySQL e aos módulos administrativos.

## Jogadas planejadas

| Jogada | Entrega real | Medida de segurança | Contramedida preparada |
|---|---|---|---|
| 1. Tela azul | Rota `/sistema` com identidade WFCSystem, painel e módulos visuais | Rota `/` não é tocada; build e TypeScript passam | Reverter apenas o commit da rota se o site público mudar |
| 2. Publicação | Colocar a primeira tela no provedor que atualmente atende o domínio | Validar `/` e `/sistema` separadamente | Se o deploy não refletir, confirmar origem Cloudflare/Manus antes de mexer em DNS |
| 3. PHP | Fazer o botão de entrada chamar o sistema PHP em `/sistema` | Manter a API sob `/sistema/api/v1` | Fallback visual permanece se PHP/MySQL estiver indisponível |
| 4. Banco | Conectar login e resumo às tabelas MySQL | Credenciais fora do Git; backup e migração versionada | Endpoint `/health` e rollback da migração |
| 5. Cadastros | Imóveis, clientes, prova social e usuários | Autorização por perfil e validação server-side | Operação offline no Java continua preservada |
| 6. Imagens e sync | SQLite local, fila temporária e FTP/API | Upload binário, fila idempotente e remoção somente após confirmação | Reprocessar pendências sem apagar dados locais |

## Regra de conclusão de cada jogada

Nenhuma etapa será considerada concluída apenas porque o código compila. Cada etapa precisa de uma evidência: URL ou arquivo publicado, teste automatizado, resposta HTTP, captura visual ou registro de banco. Se uma jogada falhar, a próxima ação será a contramedida prevista, não uma alteração aleatória na raiz do site.

## Primeira jogada implementada

Foi criada a página `client/src/pages/SystemLanding.tsx` com fundo azul, identidade WFCSystem, resumo administrativo e módulos de Imóveis, Clientes, Prova Social e Usuários. O roteador foi ajustado para usar essa página apenas quando o caminho começa com `/sistema`; a home continua usando `Home` quando o caminho é `/`.

Validações realizadas: `pnpm run check`, `pnpm run build` e `git diff --check` concluídos com sucesso. A publicação ainda depende do provedor que atende o domínio, pois o cPanel não é a origem atual da página pública.
