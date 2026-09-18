# Registro de colaboração entre IAs — WFC Imóveis

## 2026-09-13 — Manus AI / Frontend WFC

Olá, outras IAs que trabalham neste repositório.

Meu nome nesta colaboração é **Manus Frontend**. Sou o agente responsável pelo desenvolvimento da camada visual e da experiência do usuário do site público `wfcimoveis.com`.

Meu escopo de trabalho é:

- desenvolver e manter as páginas públicas da imobiliária;
- preservar a identidade visual da WFC Imóveis e a separação entre o site público e o sistema administrativo `/sistema`;
- construir interfaces responsivas para catálogo de imóveis, detalhe de imóvel, equipe, clientes e contato;
- conectar o frontend aos contratos públicos já definidos, sem colocar credenciais, senhas ou acesso direto ao MySQL no navegador;
- validar acessibilidade, navegação mobile, estados de carregamento, estados vazios e mensagens de erro;
- executar `pnpm check`, testes, build e verificações visuais antes de considerar uma entrega concluída;
- documentar neste arquivo decisões relevantes, limitações e dependências para as próximas IAs.

A estrutura atual já possui uma home pública, catálogo, detalhe de imóvel, equipe, clientes e uma rota isolada para `/sistema`. Vou trabalhar prioritariamente no site público e não vou substituir a raiz pública pela interface administrativa. A página pública deve consumir somente dados públicos, como os imóveis disponíveis, e encaminhar contatos para os canais oficiais da WFC.

### Estado encontrado

O repositório está na branch `main`, no commit `5782b5d`. O frontend React/Vite está compilando, o TypeScript passa e os testes existentes passam. O plano do projeto determina que a raiz `/` permaneça separada da aplicação administrativa `/sistema`.

A API pública documentada é `GET /sistema/api/v1/public/properties`. O backend de saúde foi tratado separadamente do frontend. Não vou gravar configurações sensíveis no código do site.

### Próximas ações do Manus Frontend

1. revisar a home e o catálogo em relação ao contrato público de imóveis;
2. corrigir inconsistências de navegação e detalhe de imóvel;
3. melhorar responsividade, acessibilidade e estados de dados reais ou vazios;
4. manter a identidade visual vinho/areia e a tipografia já adotadas, evitando alterações destrutivas;
5. validar a entrega com lint/check, testes, build e inspeção no navegador.

Se outra IA alterar o frontend, registre abaixo a motivação, os arquivos afetados e as validações executadas para evitar conflitos.

---

## Convenção de registro

Cada agente deve registrar a data, o nome, o objetivo, os arquivos alterados, as decisões de integração e os comandos de validação. Alterações administrativas devem permanecer na rota `/sistema` e não devem substituir o site público em `/`.

## 2026-09-13 — Manus Frontend — correções de navegação pública

Corrigi dois fluxos do site público: o CTA “Ver catálogo completo” da home agora aponta para `/catalogo`, e os cards do catálogo agora abrem `/imovel/:id` usando o código correto. Também adicionei ativação por teclado com Enter e Espaço aos cards do catálogo.

Arquivos alterados: `client/src/pages/Home.tsx` e `client/src/pages/Catalog.tsx`. A rota `/sistema` e os arquivos administrativos não foram alterados.

Validação prevista: `pnpm check`, testes automatizados, `pnpm build` e `git diff --check`.

Validação concluída: `pnpm check` passou; `pnpm test -- --run` passou com 3 arquivos e 8 testes; `pnpm build` passou; `git diff --check` não encontrou problemas. O build ainda emite apenas avisos preexistentes sobre variáveis de analytics ausentes e bundle JavaScript acima de 500 kB.

## 2026-09-13 — Manus Frontend — boletim do catálogo

A interface pública do catálogo está organizada como uma experiência de busca imobiliária responsiva, mantendo a identidade visual vinho/areia da WFC. O cabeçalho oferece retorno para a home, acesso a “Nossos clientes” e contato por WhatsApp. A abertura apresenta o título “Encontre um lugar para chamar de seu”, contador de resultados, busca por texto e ordenação.

O catálogo possui filtros rápidos para todos os imóveis, casas, chácaras, lotes, financiamento e reservados. O painel avançado permite filtrar por tipo, tipo de venda, faixa de preço e status. Os cards exibem imagem, status, código, tipo, título, localização, quartos, área, disponibilidade, preço e CTA de interesse pelo WhatsApp. Quando não há resultados, a interface mostra estado vazio com convite para falar com um corretor.

Nesta etapa corrigi a navegação dos cards: cada imóvel agora abre `/imovel/:id` com o código correto, e o CTA “Ver catálogo completo” da home abre `/catalogo`. Também adicionei ativação dos cards por teclado com Enter e Espaço.

Validações realizadas: TypeScript (`pnpm check`) aprovado; 3 arquivos de teste e 8 testes aprovados; build de produção (`pnpm build`) aprovado; `git diff --check` aprovado. O build ainda mostra avisos preexistentes sobre variáveis de analytics ausentes e tamanho do bundle, sem impedir a compilação.

Solicitação aos próximos agentes: preservar a separação entre `/` e `/sistema`, manter o contrato da API pública `GET /sistema/api/v1/public/properties` e avisar neste log antes de alterar o formato dos dados de imóveis, rotas ou identidade visual. No momento não há dependência bloqueante solicitada a outra IA.

## 2026-09-13 — Manus Frontend — plano de trabalho e necessidades do suporte

Olá, colegas e suporte da WFC. A partir desta etapa, todas as atualizações, movimentos, descobertas e solicitações relacionadas ao frontend serão publicadas neste log.

Preparei o documento `FRONTEND_PLAN.md`, que define meu papel, fases de execução, critérios de qualidade, procedimento por atualização e necessidades de integração. Meu trabalho ficará concentrado no site público `https://wfcimoveis.com/`. A rota `/sistema` continuará isolada e não será substituída pela interface pública.

### Como vou proceder

Antes de cada mudança, vou revisar o estado do Git, o plano e este log. Vou alterar somente os arquivos necessários, sem credenciais ou acesso direto ao MySQL. Após cada implementação, executarei TypeScript, testes, build e verificação de diff. Em mudanças visuais relevantes, farei inspeção visual. Cada entrega será registrada neste arquivo e versionada com commit descritivo.

### Necessidades para o suporte

Preciso que o suporte confirme: o contrato definitivo de `GET /sistema/api/v1/public/properties`; os campos de preço, status, imagens e paginação; o número oficial de WhatsApp; CRECI, endereço, horários e textos institucionais aprovados; logo e imagens oficiais; origem efetiva de publicação do domínio; URL de homologação; e o responsável pela aprovação do conteúdo público.

Não é necessário nem desejável enviar senhas de banco, cPanel, FTP ou tokens privados para o frontend. Essas credenciais devem permanecer protegidas no backend ou no provedor.

### Solicitação aos colegas

Peço que os próximos agentes avisem neste log antes de alterar o contrato público, a rota `/sistema`, os estilos globais ou os dados normalizados de imóveis. Se a API pública ou os conteúdos oficiais já estiverem definidos, solicito que os disponibilizem por aqui para eu substituir os dados demonstrativos com segurança.

Nenhuma dependência bloqueante foi criada nesta etapa. O plano está pronto para execução após a confirmação dos dados institucionais e do contrato público.

## 2026-09-13 — Manus Frontend — verificação de mensagens e próxima ação

Revisei o log de colaboração até esta entrada e não encontrei novas respostas dos outros agentes às solicitações de contrato da API, conteúdo institucional, dados oficiais ou ambiente de homologação.

Enquanto aguardo essas informações, vou prosseguir com uma melhoria independente e segura do catálogo público: tornar visíveis os estados de carregamento e erro da API, mantendo os dados demonstrativos como fallback. Essa alteração não muda o contrato da API, não toca `/sistema` e não depende de credenciais.

Suporte e colegas: quando houver retorno, por favor registrem neste arquivo o contrato confirmado, os dados oficiais ou a URL de homologação para que eu substitua os valores demonstrativos com evidência.

## 2026-09-13 — Manus Frontend — melhoria de estados do catálogo

Após revisar o log, não encontrei novas mensagens ou respostas dos outros agentes. Conforme o plano, prossegui com uma melhoria independente: o catálogo agora informa visualmente quando está carregando dados públicos e quando a API está indisponível, mantendo o catálogo de referência como fallback.

Arquivos alterados: `client/src/pages/Catalog.tsx` e `client/src/index.css`. A alteração preserva a rota `/sistema`, o contrato da API e o comportamento de filtros.

Validação será executada antes do commit: TypeScript, testes, build e `git diff --check`.
Validação concluída: `pnpm check` passou; `pnpm test -- --run` passou com 3 arquivos e 8 testes; `pnpm build` passou; `git diff --check` passou. Permanecem apenas os avisos preexistentes de analytics ausente e bundle acima de 500 kB.

## 2026-09-13 — Manus Frontend — verificação de equipe

Revisei novamente este log após a solicitação de confirmação da equipe. Até o momento, há apenas um agente identificado formalmente: **Manus Frontend**, responsável pelo frontend público da WFC Imóveis.

Não encontrei no arquivo nomes, cargos, mensagens ou commits atribuídos a outros três ou quatro agentes. Portanto, não é possível confirmar a existência nem informar os cargos de mais agentes sem inventar dados.

Solicitação aos colegas: se houver outros agentes trabalhando neste projeto, cada um deve registrar uma entrada com nome, cargo, responsabilidade, repositório ou área de atuação e dependências com o frontend. Suporte, por favor, confirme também a composição oficial da equipe neste log.

## 2026-09-13 — Manus Frontend — convite aos quatro agentes de backend e infraestrutura

Olá, colegas. Reforço o convite para que os quatro agentes responsáveis pelas áreas técnicas complementares assumam formalmente seus papéis neste log. Até agora nenhum nome próprio ou identificação de agente foi registrado, então os cargos abaixo são frentes solicitadas, não nomes confirmados.

### 1. Agente Backend/API PHP

Responsável pelo backend PHP do sistema, pelas rotas de autenticação, sessão, catálogo público, dashboard e sincronização. Por favor, registre o nome do agente, o diretório ou repositório sob sua responsabilidade, a versão atual da API e o contrato confirmado de `GET /sistema/api/v1/public/properties`.

Solicito confirmar o formato de resposta, campos de preço, status, imagens, paginação, ordenação, códigos de erro, cache, CORS e comportamento quando o banco estiver indisponível. Também solicito informar quando o endpoint estiver saudável em ambiente de homologação. O frontend não precisa de senha de banco ou token privado; somente do contrato público e de uma URL segura para teste.

### 2. Agente Banco de dados e sincronização

Responsável pelo schema MySQL, migrações, integridade dos registros, versões de entidades e contrato entre o painel, a API e o WfcSystem desktop. Por favor, registre o nome do agente, as tabelas ou migrações sob sua responsabilidade e a estratégia de versionamento.

Solicito confirmar como imóveis publicados são selecionados para o catálogo público, como são tratados registros reservados ou vendidos, quais campos de imagem são públicos e como conflitos de sincronização são resolvidos. Nenhum dado pessoal de clientes ou usuário interno deve ser enviado ao frontend público.

### 3. Agente Sistema administrativo/WFCSystem

Responsável pelo painel `/sistema` e pelo aplicativo desktop Java, incluindo login, módulos administrativos, operação offline, fila de imagens e sincronização. Por favor, registre o nome do agente, o repositório ou módulo sob sua responsabilidade e as rotas que podem ser consumidas pelo site público.

Solicito comunicar qualquer alteração na rota `/sistema`, no contrato público, nos status de imóveis, nos caminhos de imagens ou nos estilos que possam afetar a navegação do site. O painel administrativo deve continuar separado da raiz pública `/`, e credenciais privadas nunca devem chegar ao navegador público.

### 4. Agente Infraestrutura/Deploy/Observabilidade

Responsável pela origem efetiva do domínio, Cloudflare, hospedagem, publicação, HTTPS, cache, headers, logs e monitoramento. Por favor, registre o nome do agente, o ambiente sob sua responsabilidade e o processo seguro de deploy.

Solicito confirmar qual provedor atende atualmente `https://wfcimoveis.com/`, qual é a URL de homologação, como publicar uma nova versão sem tocar `/sistema`, quais headers de segurança estão ativos e como verificar rollback. Também solicito informar como analytics e monitoramento devem ser configurados usando apenas variáveis públicas e sem expor segredos.

### Procedimento de integração com o Manus Frontend

Cada agente deve registrar neste arquivo: nome, cargo, escopo, arquivos ou serviços alterados, contrato oferecido ao frontend, dependências, riscos conhecidos, evidências de validação e próximos passos. Mudanças no contrato público devem ser anunciadas antes da alteração para que o frontend possa atualizar sua normalização e seus testes.

Manus Frontend continuará responsável pelo site público, catálogo, detalhes de imóveis, páginas institucionais, acessibilidade, responsividade e integração somente com dados públicos. Aguardo a identificação formal dos quatro agentes e as confirmações técnicas solicitadas acima.

## 2026-09-13 — Manus Frontend — plano da próxima versão ampliada

Para a próxima versão do ecossistema WFC, proponho uma evolução em **10 etapas**, com entregas verificáveis em cada fase. A ampliação deve ocorrer de forma incremental, mantendo o site público `/`, o sistema administrativo `/sistema` e o WfcSystem desktop separados.

### Etapa 1 — Fechamento de escopo e contratos

Definir quais módulos entrarão na versão, quais campos serão públicos, quais perfis terão acesso e quais endpoints serão consumidos pelo frontend. Resultado esperado: documento de contratos, matriz de permissões e lista de tabelas aprovada.

### Etapa 2 — Modelo de dados e migrações

Projetar ou revisar as tabelas de imóveis, imagens, clientes, agentes, usuários, equipes, vendas, propostas, documentos, contatos, prova social, auditoria e sincronização. Criar migrações reversíveis, chaves, índices, status e relacionamentos. Resultado esperado: schema versionado e backup validado.

### Etapa 3 — Backend e API

Implementar endpoints protegidos para administração e endpoints públicos somente para dados autorizados. Adicionar validação server-side, paginação, filtros, ordenação, respostas de erro, controle de sessão, autorização por perfil e logs sem dados sensíveis. Resultado esperado: API documentada e testes de contrato.

### Etapa 4 — Sistema administrativo

Expandir o `/sistema` com dashboard, imóveis, imagens, clientes, agentes, usuários, vendas, propostas, prova social e configurações. Cada módulo deve ter estados de carregamento, vazio, erro, validação e confirmação de operações destrutivas. Resultado esperado: telas administrativas conectadas à API, sem misturar dados internos com o site público.

### Etapa 5 — Frontend público

Evoluir a home, catálogo e detalhe de imóvel para usar dados reais públicos. Acrescentar páginas de busca avançada, favoritos ou comparação somente se o contrato e a privacidade permitirem. Melhorar SEO, acessibilidade, responsividade, imagens, contato e mensagens de conversão. Resultado esperado: experiência pública validada em desktop e mobile.

### Etapa 6 — Imagens e mídia

Definir armazenamento, tamanhos, formatos, thumbnails, texto alternativo, ordenação e remoção segura. Vincular imagens aos imóveis por contrato idempotente. Validar fallback, imagem quebrada, cache e permissões. Resultado esperado: mídia consistente no painel, frontend e catálogo.

### Etapa 7 — Integração com WfcSystem desktop

Formalizar sincronização push/pull, versões, exclusões, conflitos, reprocessamento e idempotência. Testar operação offline, retomada após falha, imagens pendentes e autorização por perfil. Resultado esperado: desktop e sistema web convergindo sem perda de dados.

### Etapa 8 — Segurança e conformidade

Revisar sessões, cookies, CSRF, CORS, headers, rate limiting, controle de acesso, dados pessoais, logs, backups e segredos. Remover dados reais de fixtures e do frontend. Resultado esperado: checklist de segurança aprovado e nenhum segredo no Git.

### Etapa 9 — Testes integrados e homologação

Executar testes unitários, testes de API, testes de banco, testes de sincronização, navegação de frontend, acessibilidade, responsividade e cenários de erro. Validar em ambiente de homologação com dados não sensíveis. Resultado esperado: matriz de testes, evidências e lista de pendências.

### Etapa 10 — Release, publicação e monitoramento

Gerar artefatos versionados, aplicar migrações com backup, publicar backend e frontend separadamente, validar `/`, `/sistema` e API, monitorar erros e preparar rollback. Resultado esperado: release identificada, changelog, checksum, URL validada e plano de reversão.

### Ordem de dependência

As etapas 1 a 3 devem preceder as telas conectadas. A etapa 4 depende dos contratos da etapa 3. A etapa 5 pode evoluir visualmente em paralelo usando fallback, mas só deve trocar para dados reais após a etapa 3. A etapa 7 depende do contrato de sincronização. As etapas 8 e 9 devem bloquear a publicação da etapa 10 quando houver falha crítica.

### Necessidades para o suporte

Para iniciar a próxima versão, o suporte deve confirmar o escopo dos módulos, o contrato público de imóveis, os campos oficiais, os perfis e permissões, o ambiente de homologação, a origem de deploy, a política de imagens e o responsável pela aprovação dos dados. Não enviar senhas ou tokens ao frontend.

### Critério de conclusão

A nova versão só será considerada pronta quando o banco, API, painel, frontend público e desktop apresentarem contratos compatíveis; as migrações forem reversíveis; os testes críticos passarem; os dados privados permanecerem protegidos; e houver evidência de publicação e rollback.

## 2026-09-13 — Manus Frontend — início da Etapa 1: escopo e contratos

Iniciei a Etapa 1 levantando as páginas públicas, módulos administrativos, endpoints PHP e schema Drizzle. Preparei `ETAPA_1_ESCOPO_CONTRATOS.md` com o escopo dos módulos, matriz de acesso, modelo público de imóvel, contratos existentes e propostos para saúde, autenticação, catálogo, detalhe, dashboard e sincronização.

A inspeção encontrou uma divergência que precisa de decisão dos agentes de backend e dados: alguns endpoints PHP consultam tabelas legadas `tb_property`, `tb_client` e `tb_user`, enquanto o schema Drizzle define `imoveis`, `clientes`, `agentes`, `vendas`, `depoimentos`, `midias_imovel`, `tipos_imovel`, `tipos_venda` e `users`. Essa escolha deve ser resolvida antes das migrações da Etapa 2.

O contrato público mínimo compatível com o frontend está descrito no documento, mas campos como paginação, filtros server-side, `bedrooms`, `baths`, `area`, URLs de imagens, endpoint de detalhe e formato definitivo de erro ainda aguardam confirmação. Não tratarei propostas como contratos de produção até que os responsáveis confirmem no log.

Solicito aos agentes de backend, banco/sincronização, sistema e infraestrutura que revisem o documento, registrem seus nomes e cargos e respondam às dez pendências listadas na seção de aceite. A Etapa 1 só será considerada concluída após essa confirmação formal.

## 2026-09-18 — Manus Frontend — integração solicitada do WfcSystem Java

Recebi a confirmação de que a API foi configurada em `/home3/cwcimo17/public_html/wfc_sistema/api/config/local.php`, com conexão externa ao banco, e que `GET https://wfcimoveis.com/sistema/api/v1/health` respondeu HTTP 200 para o serviço `wfc-api`.

A solicitação de conectar o sistema Java à nova conexão foi encaminhada ao repositório `developrhs/wfcimoveis_wfcsystem_v1`. O cliente Java não recebe credenciais do banco; ele acessa somente a API HTTPS e mantém o banco SQLite local para operação offline.

Foi preparada a versão 0.3.1 do Java: URL padrão oficial `https://wfcimoveis.com/sistema/api/v1`, validação de `/health` antes do login, reconhecimento do serviço `wfc-api` quando a resposta contém corpo JSON e override seguro por `-Dwfc.api.baseUrl=...` ou `WFC_API_BASE_URL`. O fallback local e a fila de sincronização foram preservados.

Nenhum valor de `local.php`, senha, token ou credencial foi copiado para o site ou para o repositório Java. A compilação e o empacotamento serão registrados após a validação.
Validação da integração Java concluída: `mvn -B clean test package` passou no WfcSystem v1 0.3.1; o JAR standalone passou em `unzip -tq` e contém `Main.class`, `ImageStaging.class` e `ManagementPanel.class`. O build emitiu apenas avisos do shade plugin sobre recursos/classes sobrepostos. O arquivo de configuração do servidor permaneceu fora do Git e nenhuma credencial foi incluída.

Foi encontrada e corrigida uma lacuna preexistente do checkout Java: `Main.java` referenciava `ImageStaging` e `ManagementPanel`, mas as classes não estavam versionadas. Elas foram restauradas com fila de imagens persistente e painel local compatível com SQLite. A versão 0.3.1 está pronta para ser copiada para uma estação Windows/Linux, configurando apenas o cofre/arquivo local de credenciais FTP quando necessário.

## 2026-09-18 — Manus Frontend — diagnóstico prioritário do login Java

O diagnóstico confirmou que a mensagem "serviço temporariamente indisponível" não era causada pelo cliente Java nem pela conexão geral com o banco: `GET /health` respondeu HTTP 200 (`{"ok":true,"service":"wfc-api"}`), enquanto `POST /auth/login` respondeu HTTP 500 (`AUTH_UNAVAILABLE`). A implementação PHP assumia rigidamente a tabela e colunas `tb_user_*`, embora o repositório também contenha o schema `users`, gerando erro durante a autenticação.

Preparei uma correção em `deploy/wfc_sistema/api/v1/auth.php`: o endpoint agora detecta as tabelas `tb_user` e `users`, mapeia nomes de colunas compatíveis, normaliza o status ativo, preserva `password_verify` e nunca envia credenciais do banco ao Java. Falha de banco passa a retornar `503` com código controlado, e credencial inválida retorna `401`.

A correção está pronta no repositório, mas o arquivo `/home3/cwcimo17/public_html/wfc_sistema/api/config/local.php` não está disponível neste ambiente e não existe conector de cPanel/FTP configurado para publicação automática. O suporte/infraestrutura precisa publicar os arquivos PHP do commit e testar novamente o login. A senha compartilhada na solicitação deve ser rotacionada no servidor, pois não será armazenada nem usada no cliente Java.
