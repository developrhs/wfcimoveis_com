# Plano de desenvolvimento — Manus Frontend WFC Imóveis

**Responsável:** Manus Frontend  
**Repositório:** `developrhs/wfcimoveis_com`  
**Área:** site público `https://wfcimoveis.com/`  
**Limite de responsabilidade:** interface pública, experiência do usuário e integração com contratos públicos. O painel administrativo permanece isolado em `/sistema`.

## 1. Objetivo do papel

Desenvolver uma experiência pública confiável para pessoas que procuram, compram, financiam ou anunciam imóveis com a WFC Imóveis. O frontend deve apresentar imóveis disponíveis com clareza, facilitar o contato com a equipe e funcionar bem em celular, tablet e desktop.

O frontend não deve acessar MySQL diretamente, armazenar credenciais privadas ou misturar responsabilidades do sistema administrativo com o site público. Dados privados de clientes, usuários, banco e operação interna não podem ser expostos no navegador.

## 2. Estado atual

O projeto usa React, TypeScript, Vite, Tailwind e componentes compartilhados. As páginas públicas existentes incluem a home, catálogo, detalhe de imóvel, equipe e clientes. O catálogo possui busca, filtros, ordenação, cards e fallback visual. A rota administrativa `/sistema` possui uma entrada isolada e não deve substituir a home pública.

O contrato público documentado para dados reais é:

```text
GET /sistema/api/v1/public/properties
```

O frontend já aceita um formato normalizado com campos equivalentes a `id`, `title`, `type`, `saleType`, `location`, `price`, `status`, `images`, `bedrooms`, `area`, `available` e `total`. Mudanças nesse contrato precisam ser comunicadas antes da implementação.

## 3. Plano de execução

| Fase | Entrega | Evidência de conclusão |
|---|---|---|
| 1. Fundação visual | Consolidar cores, tipografia, navegação, espaçamento e componentes reutilizáveis | Inspeção visual, TypeScript e build aprovados |
| 2. Home pública | Hero, busca inicial, destaques, especialidades, apresentação e contato | Navegação manual em desktop e mobile |
| 3. Catálogo | Dados reais públicos, busca, filtros, ordenação, estados de carregamento, erro e vazio | Testes de interação e contrato da API |
| 4. Detalhe do imóvel | Galeria, informações, preço, status, contato e compartilhamento | Rotas `/imovel/:id` verificadas com imóveis válidos e inválidos |
| 5. Conversão | WhatsApp, CTAs, formulários públicos e mensagens claras | Links verificados e testes de acessibilidade |
| 6. Performance e acessibilidade | Imagens responsivas, foco visível, navegação por teclado, alt text, contraste e bundle | Auditoria manual e build otimizado |
| 7. Publicação segura | Validar domínio público sem tocar na raiz administrativa ou no banco | URL publicada, resposta HTTP e rollback identificado |

## 4. Procedimento para cada atualização

Antes de editar, será verificado o estado do Git, o plano do projeto e o log de colaboração. A alteração será limitada aos arquivos necessários e não incluirá segredos.

Durante a implementação, o código será organizado em páginas e componentes reutilizáveis. O contrato de dados será tratado com normalização e estados explícitos. Rotas públicas e administrativas serão mantidas separadas.

Depois da implementação, serão executados `pnpm check`, testes automatizados, `pnpm build` e `git diff --check`. Quando houver mudança visual relevante, será feita inspeção no navegador ou captura de evidência. O resultado, arquivos e pendências serão publicados no `AI_COLLABORATION_LOG.md`.

Cada entrega será versionada com um commit descritivo. Nenhuma entrega será considerada concluída apenas porque compilou: ela precisa ter evidência funcional, visual ou de contrato.

## 5. Necessidades para o suporte

| Necessidade | Informação ou ação esperada | Por que é necessária |
|---|---|---|
| Contrato definitivo do catálogo | Confirmar campos, tipos, status, paginação, ordenação e formato de imagens | Evita divergência entre frontend e API |
| Endpoint público estável | Disponibilizar `GET /sistema/api/v1/public/properties` em ambiente de teste ou produção saudável | Permite substituir dados demonstrativos por dados reais |
| Dados de conteúdo | Logo oficial, telefone/WhatsApp, CRECI, endereço, horários, textos aprovados e redes sociais | Evita publicar informação inventada ou desatualizada |
| Política de imagens | Definir URLs públicas, tamanhos, formatos, fallback e direitos de uso | Garante carregamento rápido e uso legal das imagens |
| Regras de status | Confirmar significado de disponível, reservado, vendido e indisponível | Evita apresentar oportunidade incorreta ao cliente |
| Analytics | Fornecer somente variáveis públicas aprovadas para analytics, se desejado | Permite medir conversão sem expor segredos |
| Origem de publicação | Confirmar provedor efetivo, processo de deploy e domínio de validação | O cPanel pode não ser a origem atual do site público |
| Aprovação de conteúdo | Responsável da WFC para aprovar textos, preços visíveis e chamadas | Reduz risco comercial e institucional |
| Ambiente de homologação | URL ou modo de teste para validar frontend sem afetar clientes | Permite testar com segurança antes da publicação |
| Suporte visual | Capturas, logo em alta resolução e referências de identidade | Permite evoluir o design sem perder a marca |

**Não é necessário enviar ao frontend:** senha de banco, senha de cPanel, senha FTP, token privado ou credencial administrativa. Essas informações devem permanecer no backend, no provedor ou em segredo gerenciado.

## 6. Solicitações atuais aos colegas e suporte

1. Confirmar o contrato final do endpoint público de propriedades, especialmente `price`, `images`, `status` e paginação.
2. Confirmar quais imóveis demonstrativos podem ser substituídos por dados reais.
3. Confirmar o número oficial de WhatsApp e os dados institucionais que devem aparecer no rodapé.
4. Informar a origem de publicação efetiva do site público e fornecer uma URL de homologação, se existir.
5. Avisar antes de modificar a rota `/sistema`, o contrato público ou os estilos globais compartilhados.

## 7. Critérios de qualidade

O frontend será considerado pronto quando o visitante conseguir descobrir um imóvel, aplicar filtros, abrir detalhes, entender preço e status, iniciar contato com a WFC e retornar à navegação principal sem bloqueios. A experiência deverá funcionar sem dados privados no cliente, com estados de erro compreensíveis e sem comprometer o sistema administrativo.

## 8. Canal de comunicação

Todas as atualizações, movimentos, descobertas, pedidos de informação e resultados de validação serão publicados em [`AI_COLLABORATION_LOG.md`](./AI_COLLABORATION_LOG.md). Alterações administrativas continuarão separadas do site público.
