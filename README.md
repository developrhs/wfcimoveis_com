# WFC Imóveis — Redesign e Plataforma de Atendimento

Aplicação web da **WFC Imóveis**, desenvolvida para apresentar a marca, facilitar a descoberta de imóveis, contar histórias de clientes e apoiar a operação comercial. O projeto combina uma experiência pública editorial com um catálogo de ofertas e um painel administrativo para gestão de imóveis, estoque, clientes, agentes, depoimentos e vendas.

> **Status atual:** versão funcional com homepage, catálogo, filtros, páginas individuais de imóveis, galeria com carrossel e lightbox, mural de clientes, página da equipe, painel administrativo, controle de estoque, migração de banco de dados, testes automatizados e build de produção.

## 1. Acesso rápido

| Recurso | Caminho |
|---|---|
| Aplicação publicada | [wfcimoveis-gmyryiuy.manus.space][1] |
| Homepage | `/` |
| Catálogo de imóveis | `/catalogo` |
| Mural de clientes | `/clientes` |
| Página da equipe | `/equipe` |
| Detalhe de imóvel | `/imovel/:id`, por exemplo `/imovel/01310` |
| Painel administrativo | `/admin` |
| Repositório | [developrhs/wfcimoveis_com][2] |

## 2. Objetivos do produto

O redesign foi criado para aproximar a comunicação digital da identidade visual da logo WFC. A interface usa vinho, bordô, areia, branco quente e tons rosados para reforçar reconhecimento de marca sem perder legibilidade.

A homepage funciona como uma landing page institucional e comercial. Ela apresenta a proposta da WFC, direciona o visitante ao catálogo e oferece contato rápido por WhatsApp.

O catálogo funciona como um marketplace imobiliário com a linguagem visual da WFC. O visitante pode pesquisar por título, bairro ou tipo, filtrar por categoria, condição de venda, status e faixa de preço, além de ordenar os resultados.

Cada card de imóvel pode abrir uma página própria. A página detalhada concentra galeria de imagens, carrossel, miniaturas, lightbox, localização, características, descrição, preço, status e CTA contextual para WhatsApp.

O mural de clientes apresenta histórias de pessoas que conquistaram seus imóveis em uma timeline editorial. A página da equipe apresenta Wellington Flávio e Wesley Carvalho, com seus respectivos registros profissionais.

O painel administrativo fornece uma base para operação interna. Ele exibe indicadores, inventário, desempenho comercial, ações rápidas, cadastro de imóvel, reserva e registro de venda.

## 3. Identidade visual e layout

### 3.1 Direção visual

A direção visual combina uma estética editorial imobiliária com elementos de conversão digital. O sistema visual foi organizado em torno das seguintes escolhas:

| Elemento | Decisão de design |
|---|---|
| Cor principal | Vinho/bordô, usado em títulos, CTAs e navegação de destaque |
| Cor de apoio | Rosa queimado, usado em labels, ícones e estados secundários |
| Fundo | Areia e branco quente, para manter a apresentação sofisticada |
| Títulos | `DM Serif Display`, com personalidade editorial |
| Texto de interface | `Manrope`, com boa leitura em telas pequenas |
| Forma | Cards com cantos discretos, linhas finas e sombras suaves |
| Movimento | Transições curtas, hover elevado e microinterações sem excesso |
| Responsividade | Layout mobile-first com adaptações para catálogo, galeria, timeline e painel |

### 3.2 Homepage

A homepage possui:

1. Barra superior com atendimento regional e CTA de contato.
2. Cabeçalho com logo, navegação pública e botão de WhatsApp.
3. Hero editorial com mensagem principal, imagem de imóvel e imagem de apoio.
4. Busca rápida por tipo, região e texto.
5. Seções de especialidades, imóveis em destaque, posicionamento institucional e contato.
6. Navegação para Imóveis, Nossos clientes e Nossa equipe.
7. Botão flutuante de contato por WhatsApp.

### 3.3 Catálogo

O catálogo está organizado em duas colunas no desktop: filtros à esquerda e resultados à direita. Em telas menores, os filtros laterais podem ser abertos por um botão dedicado.

A experiência inclui:

- busca textual por título, bairro ou tipo;
- filtros rápidos por todos, casas, chácaras, lotes, financiamento e reservados;
- filtros detalhados por tipo de imóvel e tipo de venda;
- faixa de preço mínimo e máximo;
- status disponível ou todos os status;
- ordenação por mais recentes, menor preço e maior preço;
- contador de oportunidades encontradas;
- status visual do imóvel;
- código do imóvel;
- CTA de contato;
- clique no card para abrir o detalhe completo.

### 3.4 Página do imóvel

A página `/imovel/:id` separa a apresentação visual da decisão comercial. A galeria ocupa a parte principal da tela, enquanto o bloco de informação organiza preço, status, localização, características e descrição.

O visitante pode:

- avançar e voltar imagens pelo carrossel;
- selecionar uma miniatura;
- abrir a imagem em lightbox;
- visualizar status e contador de imagens;
- consultar características do imóvel;
- favoritar visualmente a oferta;
- compartilhar visualmente a oferta;
- enviar uma mensagem contextual pelo WhatsApp.

### 3.5 Mural de clientes

A página `/clientes` apresenta uma timeline de histórias. Cada registro contém ano, mês, nome, localização, título da conquista, relato, fotografia e status de entrega das chaves.

O layout combina uma linha vertical, marcadores numerados, fotos e blocos de depoimento. A seção final convida o visitante a iniciar sua própria busca.

### 3.6 Nossa equipe

A página `/equipe` apresenta:

| Profissional | Função | Registro |
|---|---|---|
| Wellington Flávio | Diretor e corretor de imóveis | CRECI 21496 |
| Wesley Carvalho | Corretor de imóveis | CRECI 42716 |

A apresentação utiliza os retratos enviados para o projeto, texto institucional, credenciais, contatos e os valores de clareza, presença e propósito.

### 3.7 Painel administrativo

O painel `/admin` usa uma estrutura de navegação lateral persistente no desktop e menu recolhível no mobile. O visual utiliza fundo vinho, cards claros e indicadores de operação.

Módulos disponíveis ou modelados:

- Visão geral;
- Imóveis;
- Clientes;
- Agentes;
- Depoimentos;
- Vendas.

A visão geral mostra quantidade de imóveis, disponibilidade, vendas do mês, valor em carteira, inventário recente, gráfico de desempenho e ações rápidas.

O módulo de imóveis possui busca, tabela, status, estoque, agente responsável, reserva e registro de venda. O formulário de novo imóvel possui campos de identificação, venda, valor e área preparada para mídias.

## 4. Estrutura de pastas

A estrutura abaixo inclui as pastas de aplicação, servidor, banco, arquivos compartilhados, migrações e configuração.

```text
wfc-imoveis-redesign/
├── .git/
├── .gitignore
├── .manus-logs/
│   └── devserver.log
├── .manus/
│   └── ... arquivos internos do ambiente Manus, quando presentes
├── .prettierignore
├── .prettierrc
├── .project-config.json
├── README.md
├── components.json
├── drizzle.config.ts
├── package.json
├── pnpm-lock.yaml
├── patches/
│   └── wouter@3.7.1.patch
├── template.json
├── tsconfig.json
├── vite.config.ts
├── vite.config.ts.bak
├── vitest.config.ts
├── client/
│   ├── index.html
│   ├── public/
│   │   ├── .gitkeep
│   │   └── __manus__/
│   │       ├── debug-collector.js
│   │       └── version.json
│   └── src/
│       ├── App.tsx
│       ├── index.css
│       ├── main.tsx
│       ├── const.ts
│       ├── _core/
│       │   └── hooks/
│       │       └── useAuth.ts
│       ├── components/
│       │   ├── AIChatBox.tsx
│       │   ├── DashboardLayout.tsx
│       │   ├── DashboardLayoutSkeleton.tsx
│       │   ├── ErrorBoundary.tsx
│       │   ├── ManusDialog.tsx
│       │   ├── Map.tsx
│       │   └── ui/
│       │       ├── accordion.tsx
│       │       ├── alert-dialog.tsx
│       │       ├── alert.tsx
│       │       ├── aspect-ratio.tsx
│       │       ├── avatar.tsx
│       │       ├── badge.tsx
│       │       ├── breadcrumb.tsx
│       │       ├── button-group.tsx
│       │       ├── button.tsx
│       │       ├── calendar.tsx
│       │       ├── card.tsx
│       │       ├── carousel.tsx
│       │       ├── chart.tsx
│       │       ├── checkbox.tsx
│       │       ├── collapsible.tsx
│       │       ├── command.tsx
│       │       ├── context-menu.tsx
│       │       ├── dialog.tsx
│       │       ├── drawer.tsx
│       │       ├── dropdown-menu.tsx
│       │       ├── empty.tsx
│       │       ├── field.tsx
│       │       ├── form.tsx
│       │       ├── hover-card.tsx
│       │       ├── input-group.tsx
│       │       ├── input-otp.tsx
│       │       ├── input.tsx
│       │       ├── item.tsx
│       │       ├── kbd.tsx
│       │       ├── label.tsx
│       │       ├── menubar.tsx
│       │       ├── navigation-menu.tsx
│       │       ├── pagination.tsx
│       │       ├── popover.tsx
│       │       ├── progress.tsx
│       │       ├── radio-group.tsx
│       │       ├── resizable.tsx
│       │       ├── scroll-area.tsx
│       │       ├── select.tsx
│       │       ├── separator.tsx
│       │       ├── sheet.tsx
│       │       ├── sidebar.tsx
│       │       ├── skeleton.tsx
│       │       ├── slider.tsx
│       │       ├── sonner.tsx
│       │       ├── spinner.tsx
│       │       ├── switch.tsx
│       │       ├── table.tsx
│       │       ├── tabs.tsx
│       │       ├── textarea.tsx
│       │       ├── toggle-group.tsx
│       │       ├── toggle.tsx
│       │       └── tooltip.tsx
│       ├── contexts/
│       │   └── ThemeContext.tsx
│       ├── hooks/
│       │   ├── useComposition.ts
│       │   ├── useMobile.tsx
│       │   ├── usePersistFn.ts
│       │   └── ... hooks auxiliares
│       ├── lib/
│       │   ├── currency.ts
│       │   ├── trpc.ts
│       │   └── utils.ts
│       └── pages/
│           ├── Admin.tsx
│           ├── Catalog.tsx
│           ├── Clients.tsx
│           ├── ComponentShowcase.tsx
│           ├── Home.tsx
│           ├── NotFound.tsx
│           ├── PropertyDetail.tsx
│           └── Team.tsx
├── server/
│   ├── db.ts
│   ├── routers.ts
│   ├── storage.ts
│   ├── auth.logout.test.ts
│   ├── currency.test.ts
│   ├── inventory.test.ts
│   └── _core/
│       ├── context.ts
│       ├── cookies.ts
│       ├── dataApi.ts
│       ├── env.ts
│       ├── heartbeat.ts
│       ├── imageGeneration.ts
│       ├── index.ts
│       ├── llm.ts
│       ├── map.ts
│       ├── notification.ts
│       ├── oauth.ts
│       ├── sdk.ts
│       ├── storageProxy.ts
│       ├── systemRouter.ts
│       ├── trpc.ts
│       ├── vite.ts
│       ├── voiceTranscription.ts
│       └── types/
│           ├── cookie.d.ts
│           └── manusTypes.ts
├── shared/
│   ├── _core/
│   │   └── errors.ts
│   ├── const.ts
│   ├── inventory.ts
│   └── types.ts
├── drizzle/
│   ├── schema.ts
│   ├── relations.ts
│   ├── migrations/
│   │   └── .gitkeep
│   ├── 0000_cuddly_freak.sql
│   ├── 0001_plain_enchantress.sql
│   └── meta/
│       ├── _journal.json
│       ├── 0000_snapshot.json
│       └── 0001_snapshot.json
└── dist/
    ├── index.js
    └── public/
        ├── index.html
        └── assets/
            ├── index-*.css
            └── index-*.js
```

### 4.1 Arquivos principais do frontend

| Arquivo | Responsabilidade |
|---|---|
| `client/src/App.tsx` | Define o roteamento público e administrativo. |
| `client/src/index.css` | Contém tokens visuais, layout, responsividade e estilos das páginas. |
| `client/src/pages/Home.tsx` | Landing page institucional e comercial. |
| `client/src/pages/Catalog.tsx` | Catálogo, busca, filtros e ordenação. |
| `client/src/pages/PropertyDetail.tsx` | Página individual com galeria e contato. |
| `client/src/pages/Clients.tsx` | Mural de histórias de clientes em timeline. |
| `client/src/pages/Team.tsx` | Apresentação da equipe e CRECI. |
| `client/src/pages/Admin.tsx` | Dashboard e protótipo funcional do painel interno. |
| `client/src/lib/currency.ts` | Formatação e leitura de moeda brasileira. |
| `client/src/lib/trpc.ts` | Cliente tipado para comunicação com o servidor. |

### 4.2 Arquivos principais do servidor

| Arquivo | Responsabilidade |
|---|---|
| `server/_core/index.ts` | Inicializa o servidor Express, Vite e runtime da aplicação. |
| `server/_core/trpc.ts` | Configura procedimentos públicos e protegidos do tRPC. |
| `server/_core/context.ts` | Monta o contexto de requisição, usuário e resposta. |
| `server/_core/env.ts` | Centraliza variáveis de ambiente disponíveis. |
| `server/db.ts` | Inicializa Drizzle e concentra helpers de banco. |
| `server/routers.ts` | Expõe o router principal da aplicação. |
| `server/storage.ts` | Integra armazenamento de arquivos. |
| `server/*.test.ts` | Testes automatizados de autenticação, moeda e estoque. |

### 4.3 Arquivos principais do domínio compartilhado

| Arquivo | Responsabilidade |
|---|---|
| `shared/inventory.ts` | Regra pura de baixa de estoque e transição de status. |
| `shared/const.ts` | Constantes compartilhadas entre client e server. |
| `shared/types.ts` | Tipos compartilhados da aplicação. |
| `shared/_core/errors.ts` | Erros compartilhados e códigos internos. |

## 5. Rotas da aplicação

| Rota | Página | Público |
|---|---|---:|
| `/` | Homepage WFC | Sim |
| `/catalogo` | Catálogo com filtros | Sim |
| `/clientes` | Timeline de clientes satisfeitos | Sim |
| `/equipe` | Equipe WFC e CRECI | Sim |
| `/imovel/:id` | Detalhe de imóvel | Sim |
| `/admin` | Dashboard administrativo visual | Sim, com proteção a implementar |
| `/404` | Página de não encontrado | Sim |

## 6. Banco de dados

O banco usa **MySQL/TiDB** com **Drizzle ORM**. A definição principal está em `drizzle/schema.ts` e as migrações ficam versionadas na pasta `drizzle/`.

### 6.1 Tabelas existentes

| Tabela | Finalidade |
|---|---|
| `users` | Usuários da autenticação Manus, com função `user` ou `admin`. |
| `tipos_imovel` | Tipos de imóvel, como casa, chácara, loteamento e comercial. |
| `tipos_venda` | Condições de venda, como financiamento, ágio e pagamento facilitado. |
| `imoveis` | Cadastro central dos imóveis, preço em centavos, status e estoque. |
| `midias_imovel` | Imagens e vídeos vinculados aos imóveis. |
| `clientes` | Pessoas interessadas ou compradoras. |
| `agentes` | Corretores e agentes responsáveis. |
| `depoimentos` | Histórias e depoimentos publicados no mural. |
| `vendas` | Registro de vendas, valores, quantidade e cliente. |

### 6.2 Regra de preços

Valores persistidos devem ser tratados como inteiros em centavos no campo `valor_centavos` ou `valor_venda_centavos`. A camada visual utiliza `formatBRLFromCents` para exibir reais em formato brasileiro.

Esse contrato evita o problema de dupla conversão que fazia valores aparecerem multiplicados. O parser de entrada deve transformar uma representação digitada pelo usuário em centavos apenas uma vez.

### 6.3 Regra de estoque

A função `applySaleToInventory` implementa a regra de negócio:

- uma unidade disponível vendida muda para `vendido`;
- um empreendimento múltiplo reduz `quantidade_disponivel`;
- o empreendimento só muda para `vendido` quando o estoque chega a zero;
- uma venda acima do estoque disponível é rejeitada;
- a quantidade vendida precisa ser um inteiro maior que zero.

## 7. Comandos de desenvolvimento

O projeto utiliza pnpm. Execute os comandos a partir da raiz do repositório.

| Comando | Finalidade |
|---|---|
| `pnpm install` | Instala dependências. |
| `pnpm dev` | Inicia o servidor de desenvolvimento com hot reload. |
| `pnpm check` | Executa o TypeScript sem emitir arquivos. |
| `pnpm test` | Executa a suíte Vitest. |
| `pnpm test -- --run` | Executa os testes em modo não interativo. |
| `pnpm build` | Gera o bundle frontend e o servidor de produção. |
| `pnpm start` | Inicia o bundle de produção. |
| `pnpm format` | Formata os arquivos com Prettier. |
| `pnpm db:push` | Gera e aplica migrações Drizzle conforme configuração local. |

### 7.1 Fluxo recomendado

1. Instale as dependências com `pnpm install`.
2. Verifique as variáveis de ambiente fornecidas pelo ambiente Manus.
3. Execute `pnpm dev`.
4. Implemente a alteração na camada correspondente.
5. Execute `pnpm check`.
6. Execute `pnpm test -- --run`.
7. Execute `pnpm build`.
8. Revise as rotas em desktop e mobile.
9. Atualize o README quando houver alteração arquitetural.
10. Crie um commit com uma mensagem objetiva.

## 8. Variáveis de ambiente

O runtime Manus fornece as variáveis de ambiente por configuração do projeto. Não faça commit de arquivos `.env` nem de segredos.

Variáveis principais usadas pelo template:

| Variável | Finalidade |
|---|---|
| `DATABASE_URL` | Conexão MySQL/TiDB. |
| `JWT_SECRET` | Assinatura das sessões. |
| `VITE_APP_ID` | Identificador do aplicativo Manus. |
| `OAUTH_SERVER_URL` | Base do servidor OAuth. |
| `VITE_OAUTH_PORTAL_URL` | Portal de login no frontend. |
| `OWNER_OPEN_ID` | Identificador do proprietário. |
| `OWNER_NAME` | Nome do proprietário. |
| `BUILT_IN_FORGE_API_URL` | Endpoint das APIs internas Manus. |
| `BUILT_IN_FORGE_API_KEY` | Chave server-side das APIs internas. |
| `VITE_FRONTEND_FORGE_API_URL` | Endpoint frontend das APIs internas. |
| `VITE_FRONTEND_FORGE_API_KEY` | Chave frontend disponibilizada pelo runtime. |

## 9. Imagens e armazenamento

Imagens grandes não devem ser colocadas em `client/public` nem em `client/src/assets`. O fluxo recomendado é:

1. manter uma cópia local de trabalho fora do repositório;
2. enviar o arquivo pelo armazenamento WebDev;
3. usar o caminho `/manus-storage/...` retornado pelo upload;
4. guardar no banco apenas a referência do arquivo, quando a mídia for persistente.

A página da equipe utiliza os retratos enviados e armazenados nos seguintes caminhos:

- `/manus-storage/wellington-flavio_94c7e382.png`;
- `/manus-storage/wesley-carvalho_e8c6e58e.png`.

As imagens da galeria demonstrativa dos imóveis usam URLs de imagens de referência. Em produção, elas devem ser substituídas por mídias reais da WFC armazenadas no fluxo oficial de arquivos.

## 10. Segurança e próximos ajustes técnicos

A rota `/admin` atualmente representa a interface administrativa e deve ser ligada à autenticação e autorização antes de uso operacional. O controle recomendado é permitir acesso somente a usuários autenticados com função `admin`.

O catálogo e os detalhes ainda usam dados demonstrativos no frontend. A próxima evolução deve substituir esses arrays por procedimentos tRPC públicos que consultem `imoveis`, `tipos_imovel`, `tipos_venda` e `midias_imovel`.

O registro de vendas deve ser conectado a uma transação de banco que crie a venda e atualize o estoque de forma atômica. Isso evita inconsistência quando dois atendentes registrarem vendas simultaneamente.

## 11. Testes

A suíte atual contém:

| Arquivo | Cobertura |
|---|---|
| `server/auth.logout.test.ts` | Limpeza correta do cookie de sessão. |
| `server/currency.test.ts` | Formatação e parsing de valores em reais. |
| `server/inventory.test.ts` | Baixa de estoque, venda unitária, venda múltipla e bloqueio de excesso. |

A última validação registrada passou com **3 arquivos de teste, 8 testes e build de produção aprovado**.

## 12. Histórico recente

| Commit | Descrição |
|---|---|
| `c2ffbb7` | Adiciona detalhes de imóveis, galeria, página da equipe e navegação pública. |
| `8fa65fb` | Adiciona catálogo, painel administrativo, schema de domínio e controle de estoque. |
| `e7c8764` | Cria homepage, identidade visual, busca inicial e utilitários de moeda. |
| `c7a7169` | Inicializa o projeto WebDev full-stack. |

## 13. Convenções de manutenção

Os componentes de página ficam em `client/src/pages`. Componentes reutilizáveis devem ser extraídos para `client/src/components` quando forem utilizados por mais de uma tela.

A lógica de apresentação deve permanecer no frontend. Regras que alteram estoque, vendas, permissões ou dados persistentes devem ser implementadas no servidor e cobertas por testes.

Alterações de schema devem ser feitas primeiro em `drizzle/schema.ts`, gerar uma migração e aplicar a migração pelo fluxo de banco do projeto. Não altere manualmente tabelas em produção sem uma migração versionada.

As mensagens de commit devem descrever uma única mudança principal, preferencialmente usando o padrão `feat:`, `fix:`, `docs:`, `refactor:` ou `test:`.

## Referências

[1]: https://wfcimoveis-gmyryiuy.manus.space "WFC Imóveis — aplicação publicada"
[2]: https://github.com/developrhs/wfcimoveis_com "Repositório GitHub da WFC Imóveis"
