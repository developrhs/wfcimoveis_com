# Plano de atualização e publicação — WFC Imóveis

## 1. Objetivo

Este documento registra o plano para substituir com segurança o site legado hospedado na HostGator por uma nova aplicação da WFC Imóveis, preservando o conteúdo histórico, os arquivos de referência e os dados necessários para uma atualização gradual. A nova aplicação já está no repositório `developrhs/wfcimoveis_com` e deve ser validada antes de qualquer alteração destrutiva no servidor.

## 2. Estado atual identificado

A hospedagem ativa é o **Plano P — wfcimoveis.com**, no servidor `br968`, com diretório inicial `/home3/cwcimo17` e IP de hospedagem `162.241.2.254`. O site legado está em `public_html` e contém páginas PHP/HTML, scripts JavaScript, imagens, arquivos de configuração, `robots.txt`, `sitemap.xml`, formulários e uma instalação Gallery 3.1.3. O backup completo foi gerado pelo cPanel em **09/09/2026 às 09:08:47**.

A nova aplicação é uma aplicação React/Vite com servidor Express/tRPC e banco Drizzle. Ela possui homepage, catálogo de imóveis, detalhes de imóvel, mural de clientes, equipe e painel administrativo. O README principal do projeto documenta as rotas e a direção visual atual.

## 3. Organização do backup legado

O backup original deve ser mantido fora do controle de versão por conter credenciais, dumps de banco, chaves privadas e dados operacionais da hospedagem. A pasta local `backup/legacy-site/` deve conter uma cópia de trabalho do site antigo e dos dumps apenas para consulta e migração controlada.

A estrutura recomendada é:

```text
backup/
├── README.md                         # inventário e regras de segurança
└── legacy-site/                       # ignorado pelo Git
    ├── original-hostgator.tar.gz     # cópia do backup completo
    ├── public_html/                   # arquivos públicos do site antigo
    └── mysql/                         # dumps para análise/migração local
```

Não devem ser enviados ao GitHub: arquivos `.sql`, `.tar.gz`, chaves privadas, arquivos `.env`, configurações com senhas, caixas de e-mail, logs, sessões, diretórios `.cpanel`, `.ssh`, `.ssl`, `.softaculous` ou qualquer arquivo que contenha credenciais.

## 4. Fases do update

### Fase 0 — preservação e inventário

1. Confirmar que o backup completo permanece disponível no cPanel e em uma cópia local protegida.
2. Calcular e registrar o SHA-256 do arquivo original.
3. Inventariar as páginas legadas, imagens, scripts, formulários, sitemap, robots e tabelas dos dumps MySQL.
4. Identificar quais imóveis, fotos, contatos, depoimentos e textos devem ser migrados para a nova aplicação.
5. Mapear URLs antigas para as novas rotas, preservando links relevantes e planejando redirecionamentos.

### Fase 1 — validação da nova aplicação

1. Instalar as dependências com `pnpm install --frozen-lockfile`.
2. Executar testes automatizados com `pnpm test` e build de produção com `pnpm build`.
3. Validar as rotas `/`, `/catalogo`, `/clientes`, `/equipe`, `/imovel/:id` e `/admin` em ambiente de preview.
4. Verificar responsividade, acessibilidade, imagens, links de WhatsApp, filtros, galeria, lightbox, autenticação e operações do painel.
5. Validar o schema e as migrações Drizzle antes de importar qualquer dado legado.

### Fase 2 — migração de conteúdo

1. Criar uma cópia de trabalho dos dumps; nunca editar o backup original.
2. Importar os dumps somente em banco local ou ambiente de staging isolado.
3. Não reutilizar senhas, hashes, tokens ou credenciais do site legado.
4. Transformar o conteúdo legado em dados compatíveis com o modelo atual: imóveis, fotos, clientes, agentes, depoimentos, status e contatos.
5. Normalizar nomes de arquivos, remover duplicatas e verificar se as imagens podem ser usadas na nova aplicação.
6. Revisar manualmente preços, disponibilidade, localização, telefone, CRECI, textos legais e consentimentos.
7. Fazer uma carga inicial idempotente, com relatório dos registros importados, rejeitados e pendentes.

### Fase 3 — preparação de produção

1. Criar ou confirmar as variáveis de ambiente de produção sem gravá-las no repositório.
2. Configurar banco de produção, migrações e backups independentes.
3. Configurar armazenamento das imagens e uploads; não depender de caminhos absolutos do HostGator.
4. Configurar domínio, HTTPS, e-mail transacional, WhatsApp e demais integrações.
5. Preparar uma página de manutenção ou um plano de rollback para reduzir o risco de indisponibilidade.
6. Fazer um deploy de staging e executar checklist funcional e de segurança.

### Fase 4 — troca controlada no HostGator

Esta fase exige confirmação explícita imediatamente antes da remoção ou substituição dos arquivos em `public_html`.

1. Colocar o site em manutenção e registrar o horário da mudança.
2. Fazer uma segunda cópia do estado atual do `public_html` antes da limpeza.
3. **Não apagar a pasta inteira sem uma cópia verificável e sem confirmar o plano de rollback.**
4. Limpar ou mover os arquivos antigos para uma pasta de retenção fora do document root, conforme o método aprovado.
5. Publicar somente o artefato de produção validado.
6. Ajustar permissões, regras do servidor, `robots.txt`, `sitemap.xml`, headers e redirecionamentos.
7. Validar HTTP/HTTPS, domínio com e sem `www`, páginas principais, imagens, formulários, contatos e painel.
8. Conferir logs de erro e acesso durante a primeira janela de observação.

### Fase 5 — pós-publicação e rollback

1. Monitorar a aplicação, banco, formulários e conversões durante pelo menos 24 horas.
2. Comparar as URLs críticas do site antigo com as novas URLs.
3. Corrigir conteúdo faltante sem apagar a fonte histórica.
4. Manter o backup HostGator original e a cópia local até a validação final.
5. Se houver falha crítica, restaurar o `public_html` preservado e reverter DNS/deploy conforme o procedimento documentado.
6. Registrar cada mudança em commits pequenos e descritivos.

## 5. Critérios para autorizar a publicação

A publicação só deve ocorrer quando: a build passar; os testes passarem; os dados principais estiverem revisados; as variáveis de produção estiverem configuradas fora do Git; o rollback tiver sido testado ou validado; o domínio e SSL estiverem confirmados; os formulários e contatos funcionarem; e houver uma cópia independente do estado atual do HostGator.

## 6. Critérios de aceite

| Área | Aceite |
|---|---|
| Homepage | Carrega sem erros, apresenta a marca e direciona ao catálogo e contato |
| Catálogo | Busca, filtros, ordenação e estados de imóveis funcionam |
| Detalhe | Galeria, dados, preço, localização e CTA funcionam |
| Conteúdo | Imóveis, fotos, equipe e depoimentos revisados |
| Administração | Login e operações permitidas funcionam sem expor dados sensíveis |
| SEO | `title`, descrições, canonical, `robots.txt`, sitemap e redirecionamentos revisados |
| Segurança | HTTPS, segredos fora do Git, permissões mínimas e sem dumps públicos |
| Operação | Logs, backup do banco e rollback documentados |
| Compatibilidade | Desktop, tablet e celular validados |

## 7. Próximo passo seguro

O próximo passo é comparar e selecionar os dados do legado que serão migrados para a nova aplicação, validar a build e preparar um staging. A limpeza do `public_html` e a publicação no HostGator ficam bloqueadas até que o checklist esteja concluído e o proprietário confirme explicitamente essa operação destrutiva.

> **Regra de segurança:** backup não é sincronização. O arquivo de 09/09/2026 é uma fotografia da hospedagem naquele momento; qualquer alteração posterior precisa de uma nova cópia antes da publicação.
