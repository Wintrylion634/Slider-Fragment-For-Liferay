# Advanced Liferay Slider — Fragment

Carrossel avançado para **Liferay 7.4+** (testado em 7.4.3 GA132+). O usuário final **não precisa alterar código**: todo o comportamento, layout e estilo são controlados pelo painel **Configuration** do fragmento e pelos campos editáveis na página.

Sem bibliotecas externas (Swiper, jQuery, etc.).

---

## Sobre

Componente de slider/hero desenvolvido para portais corporativos e LXP, com foco em:

- **Customização no-code** — dezenas de opções no painel do Liferay
- **Variantes visuais** — Hero, Cards, Testimonials, Minimal, Split, Banner e Custom Slides
- **Conteúdo editável** — texto, imagens e links por slide
- **Analytics** — eventos opcionais no `window.dataLayer` (GTM / GA4)
- **Acessibilidade** — roles ARIA, teclado, pausa no hover
- **Performance** — modo configurável para reduzir efeitos pesados

---

## Estrutura do projeto

```
Slider-Fragment-For-Liferay/
├── index.html          → HTML + FreeMarker (cole em "HTML" no editor de fragmento)
├── index.css           → Estilos (cole em "CSS")
├── main.js             → Comportamento do carrossel (cole em "JavaScript")
├── configuration.json  → Painel Configuration (cole na aba Configuration)
└── README.md
```

---

## Requisitos

| Item | Detalhe |
|------|---------|
| Liferay | **7.4** (recomendado U44 / GA44+ para campos `length` no painel) |
| Permissões | Criar/editar fragmentos e publicar páginas |
| Imagens | JPG ou WebP, preferencialmente **≤ 300 KB**, proporção próxima de **1600×900** |
| Analytics (opcional) | `window.dataLayer` disponível na página (ex.: GTM) |

---

## Instalação no Liferay

1. Acesse **Site Menu → Design → Fragments** (ou Fragmentos, conforme idioma).
2. Crie um fragmento novo (tipo **Component**).
3. Cole o conteúdo de cada arquivo na aba correspondente:
   - **HTML** ← `index.html`
   - **CSS** ← `index.css`
   - **JavaScript** ← `main.js`
   - **Configuration** ← `configuration.json`
4. Salve e publique o fragmento.
5. Em uma página, arraste o fragmento para a área desejada.
6. Clique no fragmento → ícone de **configuração** (engrenagem) para abrir o painel **Configuration**.
7. No modo de edição da página, clique nos textos/imagens/links de cada slide para alterar o conteúdo.

> Se aparecer *"Please provide a valid configuration for the fragment"*, verifique se o JSON da Configuration está completo e sem vírgulas extras. Em versões antigas do 7.4, campos `length` podem não ser suportados — nesse caso, troque temporariamente para `"type": "text"` nos campos de medida.

---

## Variantes

| Variante | Uso recomendado |
|----------|-----------------|
| **Hero** | Banner principal da home, texto + CTAs sobre imagem |
| **Cards** | Conteúdo com painel semitransparente (estilo card) |
| **Split** | Layout dividido com painel lateral |
| **Testimonials** | Depoimentos / citações |
| **Minimal** | Poucos elementos visuais, foco na imagem |
| **Banner** | Faixa promocional mais compacta |
| **Custom Slides** | Layout livre por slide via **drop zone** (fragmentos/widgets dentro de cada slide) |

### Custom Slides — importante

- Cada slide tem sua **própria drop zone** independente.
- O Liferay **não replica** automaticamente o conteúdo do slide 1 nos demais.
- Use quando a equipe de design precisa montar slides muito diferentes entre si.
- Para conteúdo padronizado (título, descrição, botões), prefira **Hero**, **Cards** ou **Split**.

---

## Conteúdo editável por slide

Nas variantes estruturadas (todas exceto **Custom Slides**), cada slide usa IDs no formato `01-`, `02-`, etc.:

| Campo | ID editável (slide 1 = exemplo) |
|-------|----------------------------------|
| Imagem | `01-image` |
| Eyebrow(s) | `01-eyebrow`, `01-eyebrow-2` … (conforme **Eyebrow Count**) |
| Título | `01-title` |
| Descrição | `01-description` |
| Botão primário | `01-primary-link` |
| Botão secundário | `01-secondary-link` |

O número de slides visíveis é definido em **Configuration → Number of Slides** (1 a 8).

---

## Painel Configuration (resumo)

### Slider Options
- **Variant** — estilo do carrossel
- **Number of Slides** — quantidade de slides (1–8)
- **Theme** — `dark` ou `light`

### Container
- **Border Radius** — cantos arredondados do slider

### Content Layout
- Posição horizontal e vertical do conteúdo
- Alinhamento dos botões

### Content Visibility
- **Eyebrow Count** — 0 a 4 etiquetas acima do título
- Checkboxes para exibir/ocultar título, descrição e botões (sem apagar o conteúdo no editor)

### Eyebrow Style / Button Style
- Tipografia, padding, bordas e cores dos eyebrows e botões

### Cards and Split Panel
- Cores e bordas do painel (variantes **Cards** e **Split**)

### Navigation
- Setas, paginação (bar / dot / fraction), botão play/pause
- Posição vertical das setas (top / center / bottom)
- Tamanho e estilo dos controles

### Behavior
- **Autoplay**, delay em ms, pausa ao passar o mouse
- **Performance Mode** — `off` / `balanced` / `strict` (reduz animações e efeitos pesados)

### Image Guidance
- Mensagem opcional para orientar o editor sobre tamanho/formato de imagem
- Texto alternativo padrão das imagens

### Colors
- Cores do texto, botões, navegação e paginação
- Campos com **seletor de cor** (hex) ou **campo de texto** (valores avançados) — ver seção abaixo

### Analytics
- Ativar tracking no `dataLayer`
- Nome do evento e ID único do slider na página

---

## Cores: seletor vs. texto livre

Alguns campos usam **color picker** (cores sólidas em hex). Outros permanecem como **texto** porque o Liferay não oferece picker para:

| Campo | Tipo | Exemplo de valor |
|-------|------|------------------|
| Title Color, Primary Button Text, Navigation Color, etc. | Seletor | `#ffffff` |
| Description Color | Texto | `rgba(255,255,255,0.82)` |
| Content Background | Texto | `transparent` |
| Primary Button Background | Texto | `linear-gradient(135deg, #7c3aed, #06b6d4)` |
| Secondary Button Background | Texto | `rgba(255,255,255,0.08)` |
| Navigation Background | Texto | `rgba(255,255,255,0.12)` |
| Pagination Inactive Color | Texto | `rgba(255,255,255,0.32)` |
| Eyebrow Background | Texto | gradiente CSS |
| Panel Background (Cards/Split) | Texto | `rgba(15, 23, 42, 0.32)` |

Copie valores CSS válidos nos campos de texto. Para transparência sem `rgba`, use hex com alpha (ex.: `#ffffffd1`).

---

## Receitas prontas (presets)

Use como ponto de partida. Ajuste cores depois em **Colors**.

### 1. Hero institucional (home)

| Campo | Valor sugerido |
|-------|----------------|
| Variant | Hero |
| Number of Slides | 3–4 |
| Theme | Dark |
| Content Vertical Position | Bottom |
| Eyebrow Count | 1 |
| Pagination Style | Bar |
| Autoplay | On |
| Autoplay Delay | 5000 |
| Performance Mode | Off |

### 2. Banner de campanha

| Campo | Valor sugerido |
|-------|----------------|
| Variant | Banner |
| Number of Slides | 1–2 |
| Show Secondary Button | Off |
| Pagination Style | Dot ou Fraction |
| Autoplay | On |
| Performance Mode | Balanced |

### 3. Depoimentos

| Campo | Valor sugerido |
|-------|----------------|
| Variant | Testimonials |
| Theme | Light |
| Content Horizontal Position | Center |
| Show Arrows | On |
| Pagination Style | Dot |
| Autoplay | Off |

### 4. Cards / produtos

| Campo | Valor sugerido |
|-------|----------------|
| Variant | Cards |
| Cards and Split Panel | Ajustar fundo e borda do painel |
| Content Vertical Position | Bottom |
| Performance Mode | Balanced (se muitas imagens) |

### 5. Layout livre (marketing)

| Campo | Valor sugerido |
|-------|----------------|
| Variant | Custom Slides |
| Number of Slides | Conforme necessidade |
| Show Title / Description / Buttons | Off (conteúdo vem da drop zone) |
| Configure cada drop zone no editor de página |

---

## Analytics (dataLayer)

Com **Enable dataLayer Tracking** ativado, o fragmento envia eventos quando o usuário interage. Exemplo de payload:

```json
{
  "event": "advanced_slider_interaction",
  "sliderId": "advanced-liferay-slider",
  "action": "slide_view",
  "slideIndex": 1,
  "variant": "hero"
}
```

| action | Quando dispara |
|--------|----------------|
| `slide_view` | Troca de slide |
| `click_cta` | Clique em botão primário ou secundário |
| `nav_arrow` | Setas anterior/próximo |
| `nav_bullet` | Clique na paginação |
| `autoplay_toggle` | Play / pause |
| `nav_keyboard` | Setas do teclado |
| `swipe` | Gestos em mobile |

Configure **Tracking Event Name** e **Slider ID** se houver mais de um slider na mesma página.

---

## Performance e boas práticas

O fragmento já é leve em runtime (sem libs externas). O que mais impacta a experiência:

1. **Imagens** — comprima antes do upload; use WebP quando possível.
2. **Number of Slides** — use só a quantidade necessária (evite 8 slides com imagens enormes).
3. **Performance Mode** — use `balanced` ou `strict` em páginas com muitos fragmentos ou dispositivos mais lentos.
4. **Autoplay** — desligue em slides com muito texto para leitura acessível.
5. **Variant** — **Minimal** ou **Banner** costumam ser mais leves visualmente que **Hero** com muitos efeitos.

---

## Acessibilidade

- Navegação por **setas do teclado** (← →) quando o slider está em foco.
- Botão **play/pause** para controlar o autoplay.
- Autoplay pausa ao **passar o mouse** (se **Pause On Hover** estiver ativo).
- Slides inativos ficam com `aria-hidden="true"`.
- Defina **Default Image Alt Text** e textos alternativos nas imagens editáveis.

---

## Solução de problemas

| Problema | Possível causa | O que fazer |
|----------|----------------|-------------|
| Configuration inválida | JSON incorreto ou tipo não suportado | Validar `configuration.json`; em 7.4 antigo, trocar `length` por `text` |
| Paginação dessincronizada | — | Atualize para a versão mais recente do `main.js` |
| Cor não aplica | Valor inválido no campo texto | Use CSS válido (`#hex`, `rgba()`, `transparent`) |
| Gradiente no botão some | Campo trocado para color picker | Manter **Primary Button Background** como texto com `linear-gradient(...)` |
| Custom slide vazio | Drop zone sem conteúdo | Editar página e arrastar fragmentos para a zona de cada slide |
| Tracking não aparece | GTM/dataLayer ausente ou flag desligada | Ativar **Enable dataLayer Tracking** e inspecionar `window.dataLayer` no navegador |

---

## Para desenvolvedores (manutenção)

- Prefixo CSS: `lxp-` (BEM).
- Estilos dinâmicos via **CSS variables** no elemento raiz `.lxp-slider`.
- Estado do slide ativo: classe `is-active` em `.lxp-slide`.
- Modo edição: variável global `layoutMode === 'edit'` desativa autoplay no `main.js`.

Arquivos espelhados na raiz do repositório (`slider.html`, `slider.css`, etc.) devem ser mantidos iguais aos desta pasta ao publicar atualizações.

---

## Roadmap sugerido

- [ ] Screenshots/GIFs por variante na seção Preview
- [ ] Presets salvos como fragment composition (opcional)
- [ ] Suporte a `prefers-reduced-motion` no autoplay
- [ ] Documentação em vídeo para editores de conteúdo

---

## Licença e créditos

Desenvolvido originalmente em hackathon Liferay. Evoluções: variantes avançadas, analytics, drop zones e painel de configuração expandido.

Para dúvidas de uso, priorize este README e o painel **Configuration** — não é necessário editar HTML/CSS/JS no dia a dia.
