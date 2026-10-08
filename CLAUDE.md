# site-wordcom

Projeto **Next.js**. Stack definida pelo dono do projeto; não propor outra sem ele pedir.

---

# PROTOCOLO OBRIGATÓRIO — ler antes de criar ou alterar qualquer UI

**Gatilho:** qualquer pedido para criar o site, criar/alterar página, componente, seção,
layout, tipografia, cor, animação ou copy. Inclui "cria o site", "faz a home",
"ajusta o hero", "deixa mais bonito".

**Não escrever uma linha de código de UI antes de completar os passos 1 e 2.**

## Passo 1 — Ler as skills (nesta ordem)

| # | O que ler | Para quê |
|---|---|---|
| 1 | `.agents/skills/frontend-design/SKILL.md` | Direção estética + processo de 2 passes + copy. **Sempre.** |
| 2 | `skills/impeccable/.agent/skills/impeccable/reference/craft-floor.md` | Piso de qualidade e proibições. **Sempre, imediatamente antes de editar UI.** |
| 3 | `skills/emilkowalski-skills/skills/animate/SKILL.md` + `RECIPES.md` | Só se houver motion/interação |
| 4 | `skills/emilkowalski-skills/skills/mobile-native/SKILL.md` | Antes do primeiro componente (baseline mobile) |
| 5 | `skills/impeccable/.agent/skills/impeccable/reference/new-work.md` | Só se for mundo visual novo / superfície nova |
| 6 | `skills/impeccable/.agent/skills/impeccable/reference/{layout,typeset,colorize,animate}.md` | Conforme o eixo em que se está trabalhando |

`skills/NOTAS-ESTUDO.md` é o resumo de tudo com os números exatos. Serve para consulta
rápida, **não substitui** a leitura dos itens 1 e 2.

Consulta sob demanda (ui-ux-pro-max, Python 3.13 instalado e testado):
```bash
python skills/ui-ux-pro-max-skill/.claude/skills/ui-ux-pro-max/scripts/search.py "<query>" --domain <ux|color|typography|landing|icons|chart>
python skills/ui-ux-pro-max-skill/.claude/skills/ui-ux-pro-max/scripts/search.py "<query>" --stack nextjs
```

## Passo 2 — Plano de design antes do código (frontend-design, passe 1)

Produzir e mostrar ao usuário, antes de codar:
- **Color:** 4–6 hex nomeados
- **Type:** 1 ou 2 famílias e seus papéis (se 2, claramente distintas)
- **Layout:** conceito em uma frase + wireframe ASCII + alinhamento
- **Principles:** o que torna esta página única

Depois **revisar o plano contra o brief**: se eu chegaria no mesmo resultado partindo de um
prompt genérico parecido, é default — revisar e dizer o que mudou e por quê. Só então codar.

## Passo 3 — Hierarquia na hora do conflito

As skills se contradizem. Ordem de precedência:

1. **frontend-design + impeccable** → identidade, direção, piso de craft (concordam entre si)
2. **emilkowalski** → números de motion e interação (os mais precisos)
3. **ui-ux-pro-max** → checklist de cobertura (a11y, forms, nav, perf) e consulta de dados.
   **Nunca** como fonte de direção estética — o catálogo dela (glassmorphism, gradientes,
   grids de card, fontes Google populares) é exatamente o que as duas primeiras proíbem.
4. **framer-motion-skills** → referência de API apenas

Conflitos já mapeados e como resolver:
- **Curva/duração:** emilkowalski para UI funcional (`cubic-bezier(0.23,1,0.32,1)`, <300ms);
  impeccable para o momento autoral da landing (`cubic-bezier(0.16,1,0.3,1)`, até 500–800ms)
- **Propriedades:** `transform`/`opacity` como base; blur/mask/clip-path/shadow liberados
  no momento focal, limitados a regiões isoladas
- **API Motion:** usar `motion` (`motion/react`), não `framer-motion`; usar a string
  `transform` completa, não os atalhos `x`/`y` (não são hardware-accelerated)

---

# PISO NÃO-NEGOCIÁVEL (resumo; o detalhe está nos arquivos acima)

## Proibido
`transition: all` · `scale(0)` como entrada · `ease-in` em UI · animar atalho de teclado ou
ação 100+×/dia · animar `width`/`height`/`margin`/`top`/`left` · `transform-origin: center`
em popover (modal é exceção) · keyframes em elemento disparado rapidamente · hover sem
`@media (hover: hover) and (pointer: fine)` · ausência de `prefers-reduced-motion` ·
`user-scalable=no` · `100vh` em app shell · `user-select: none` no `body`

Estrutura: grid de cards iguais ícone+título+texto como estrutura da página · cards aninhados ·
template hero-métrica · **eyebrow/kicker acima de título (ban absoluto)** · numeração 01/02/03
sem sequência real · texto em gradiente · glass/blur decorativo · `border-left` colorido >1px ·
`box-shadow: 4px 4px 0` fora de neobrutalismo real · sparkline/progress ring como conteúdo ·
mono como fantasia de "técnico" · emoji/unicode como ícone · fonte de sistema como voz display ·
acentuar uma palavra do título · ALL CAPS em label · `→` colado no texto de botão ·
ponto médio em meta (`A · B · C`) · `#0B0B0B`/`#111` no lugar de preto

Estéticas "cara de IA" (quando o brief deixa o eixo livre): creme `#F4F1EA` + serifa display +
terracota `#D97757` · quase-preto + um neon · broadsheet com fios capilares · kit SaaS-card ·
fade-and-slide-up em toda seção + hover em todo card

Fontes default de training data a evitar: Fraunces, Playfair Display, Cormorant, Lora,
Crimson, Newsreader, Syne, Space Grotesk, Space Mono, IBM Plex, Inter-as-display, DM Sans,
DM Serif, Outfit, Plus Jakarta Sans, Instrument Sans.

## Obrigatório
Contraste 4.5:1 (3:1 texto grande e não-texto) · foco de teclado visível · alvo de toque
44×44pt (web: 24×24px CSS) · body 16px · medida 65–75ch (nunca >80) · escala de espaço 4/8 ·
`100dvh` app shell / `100svh` hero · `env(safe-area-inset-*)` com `viewport-fit=cover` ·
`theme-color` por esquema de cor · estados hover/disabled/loading/error/empty · sombra com
offset **e** blur · mais espaço acima do título que abaixo · tematizar superfícies do browser
(seleção, caret, scrollbar, focus ring, underline-offset, `tabular-nums`) · **um** momento
de motion autoral, não um por seção · saída mais rápida que entrada · stagger 30–80ms

## Copy
Voz ativa, nome do usuário e não do sistema ("Salvar alterações", não "Enviar").
A ação mantém o nome no fluxo inteiro: botão "Publicar" → toast "Publicado".
Erro diz o que aconteceu e como corrigir, na voz da interface; não se desculpa, nunca é vago.
Tela vazia é convite para agir. Sentence case, sem enchimento.

## Cuidado técnico
Especificidade de CSS: seletor de tipo (`.section`) vs de elemento (`.cta`) se cancelam,
principalmente em `padding`/`margin` entre seções.

---

# Ambiente

- Node 24 / npm 11 · Python 3.13 (user scope) · git 2.56
- `skills/` = material de referência clonado (4 repos git aninhados). **Colocar no
  `.gitignore`** quando o projeto virar repositório.
- `.agents/skills/frontend-design` = instalada via `npx skills add`, com symlink p/ Claude Code
- **Pendente:** o engine binário do `impeccable` não foi baixado (precisa de OK do dono
  ou `npx impeccable install`). Sem ele, `critique`/`audit`/`detect`/`live` não rodam — as
  referências `.md` continuam valendo como doutrina aplicada manualmente.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
