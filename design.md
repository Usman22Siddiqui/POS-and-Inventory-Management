# Design.md — Teerop POS & Inventory System

## 0. Thesis

This is not a SaaS dashboard demo — it's the software running a real checkout
counter and a real back office. The design should feel like it was built by
someone who has actually stood at a register during a rush: fast, tactile,
unambiguous, calm under pressure. The "mossy hollow" palette pushes this away
from the sterile blue-and-white POS look you'd expect and toward something
warmer and more organic — like a neighborhood grocer's system, not a
enterprise fintech product. Lean into that. This is the one real aesthetic
risk this project takes: a POS system that feels grounded and human instead
of corporate and generic.

**Do not build:** a cream background with a terracotta accent, a near-black
screen with one neon accent, or a hairline-rule newspaper layout. None of
those fit a checkout counter, and all three are the current AI-design
defaults — avoid them on instinct alone here.

---

## 1. Color system — "Mossy Hollow"

Locked palette, from the supplied reference:

| Token | Hex | Role |
|---|---|---|
| `--moss-primary` | `#636B2F` | Primary actions, active nav state, Admin role accent |
| `--moss-sage` | `#BAC095` | Secondary surfaces, cards, hover states |
| `--moss-lime` | `#D4DE95` | Highlights, success states, "in stock" indicators, Cashier role accent |
| `--moss-deep` | `#3D4127` | Text on light surfaces, dark UI chrome, headers |

Extend (do not invent new hues — derive these from the four above):

| Token | Hex | Role |
|---|---|---|
| `--bg-canvas` | `#F7F8F1` | App background — a near-white warmed toward the palette, not pure white |
| `--bg-surface` | `#FFFFFF` | Card/panel surfaces sitting on canvas |
| `--text-primary` | `#3D4127` | Body text (reuse moss-deep, don't add a new near-black) |
| `--text-muted` | `#6B7058` | Secondary text, timestamps, helper copy |
| `--border-subtle` | `#E2E4D6` | Dividers, input borders |
| `--danger` | `#A6493B` | Insufficient stock, hazardous-item badge, destructive actions — a muted brick red that sits comfortably next to olive, never a bright alarm red |
| `--warning` | `#C99A3C` | Low-stock threshold, expiry-within-3-days flag — an ochre/amber, not yellow |

Role-color mapping (use consistently so users learn to recognize their space
by color, not just by label):
- **Admin** → moss-primary (`#636B2F`) as the dominant chrome color
- **Inventory Manager** → moss-sage (`#BAC095`) as the dominant chrome color
- **Cashier / POS** → moss-lime (`#D4DE95`) as the dominant accent — brightest
  space in the app, because it's the highest-tempo, highest-focus screen

Category badges (Fragile / Cold / Tech / Cleaning / General) get their own
small accent chips derived from the extended palette, not arbitrary new
colors — desaturate/lighten `--moss-*` tokens per category rather than
introducing blue/purple/etc.

---

## 2. Typography

- **Display face:** a grotesk with some warmth and a bit of quirk in the
  lowercase — something like *Fraunces* (for a serif display moment on
  Admin/Stats headers only) paired down to a **Space Grotesk** or **General
  Sans** for the working UI. Don't default to Inter for everything — it's the
  fastest way to make this look templated.
- **Body/UI face:** **General Sans** or **Public Sans** — humanist,
  legible at small sizes, holds up on a tablet-sized POS screen from arm's
  length.
- **Numeric/utility face:** a tabular-figure mono or semi-mono — **JetBrains
  Mono** or **IBM Plex Mono** — used ONLY for prices, SKUs, quantities, and
  totals on the POS screen and stats tables. This is the detail that makes
  it feel like real retail software: numbers that align in a column and
  don't jitter in width as they update.

Type scale should be generous on the POS screen specifically (cashiers read
it fast, often on a mounted tablet) — bump base size up ~15% versus the
Admin/Inventory dashboards.

---

## 3. Layout concepts

### Admin dashboard
```
[ moss-primary top bar: logo · role switcher · user menu ]
[ left rail: Users / Inventory / Reports / Settings ]
[ main: card grid — today's totals, low-stock count, active users —
  then a data table below for whatever section is selected ]
```
Dense, information-forward. This is the "back office" — precision over charm.

### Inventory Manager dashboard
```
[ moss-sage top bar ]
[ category tabs: Fragile | Cold | Tech | Cleaning | General | All ]
[ product grid — image-forward cards, not a plain table, so category
  badges and warning flags (fragile/hazardous/expiring) are visually
  scannable at a glance ]
[ floating low-stock rail, collapsible, always accessible ]
```

### Cashier / POS screen
```
[ moss-lime accent bar: cashier name, shift clock, low-key ]
[ LEFT (60%): scan input pinned at top, always focused, oversized;
  cart list below with line items, qty steppers, remove ]
[ RIGHT (40%): running subtotal / tax / total in mono numerals,
  large and unmissable; checkout button fixed at bottom, full-width,
  thumb-reachable on a tablet ]
```
This is the signature screen. It should feel closer to a physical register
than a web app — big touch targets, nothing more than one tap/scan away,
zero decorative chrome competing with the cart.

---

## 4. Signature element

**The scan-to-cart moment.** Every POS demo does a static list that updates.
Instead: when a SKU is scanned (Enter pressed), the new line item enters the
cart with a short, satisfying settle animation — not a bounce or a generic
fade, but a motion that reads like a physical item landing on a counter
(quick drop + soft settle, ~200ms, easing that overshoots slightly then
corrects). Pair it with the running total ticking up with the same
timing — the number and the item arrive together. This one interaction,
done well, is what will make the demo video memorable. Everything else
should be comparatively quiet so this doesn't get lost in noise.

---

## 5. Motion & animation strategy

Follow the brief's ask for a genuinely polished, animated feel — but apply
it with intent, not everywhere. Over-animating is itself a tell that a
design was AI-generated. Budget motion like this:

**Tier 1 — functional micro-interactions (always on, subtle, fast 150–250ms):**
- Scan-to-cart settle (the signature moment above)
- Button press states, input focus rings
- Stock quantity stepper increment/decrement
- Toast/notification slide-in for checkout success or errors

**Tier 2 — orchestrated moments (used sparingly, 1–3 places max):**
- App load / login → dashboard transition: a single cohesive sequence
  (nav bar settles in, then cards stagger in from below, ~400ms total) —
  not a generic fade-everything-in
- Checkout success: receipt "prints" onto screen with a paper-unroll
  motion, total amount emphasized last
- Low-stock alert appearing: a gentle pulse on the badge, not a shake or
  flash — this is a system that stays calm even when flagging a problem

**Tier 3 — ambient / decorative (use with real restraint):**
- A subtle organic texture or gradient-noise in the background of the
  login screen and empty states, referencing the "mossy hollow" — like
  dappled light through leaves — very low opacity, never distracting from
  data screens
- This is where the referenced Dribbble direction (dashboard.com Noira —
  fluid, organic gradient motion for an AI/productivity product) is a
  useful reference for *mood*, not for literal reuse — that shot uses
  abstract fluid 3D blobs on a dark background for a very different kind
  of product. Borrow the *quality bar and the sense of depth*, not the
  dark theme or the literal shapes — this app stays light, warm, and
  legible under fluorescent store lighting.

**Rule of thumb:** if you can't explain in one sentence what an animation
communicates (state change, feedback, orientation), cut it.

---

## 6. Generating 3D / illustrated assets with Gemini

For assets beyond CSS/SVG — hero illustrations, empty-state graphics, the
login-screen ambient scene, category icons with some dimensionality — use
Gemini's image generation to produce them, then bring them into the app as
static assets or lightly animated layers (do not attempt real-time 3D
rendering in the browser for a retail POS tablet; it's the wrong tool for
a checkout screen that needs to be fast and reliable, not a WebGL scene).

**Workflow:**
1. Generate reference stills with Gemini using prompts that explicitly
   lock in the palette and mood, e.g.:
   > "A soft, low-poly 3D illustration of a small grocery crate with produce,
   > rendered in warm olive-green and sage tones (#636B2F, #BAC095, #D4DE95,
   > #3D4127), matte clay material, soft studio lighting, no text, transparent
   > background, minimal and editorial — not glossy or corporate."
2. Generate 3–4 variations for: login/empty-state hero, a "no low-stock
   items" empty state, a checkout-success graphic, and category icon sets
   (fragile/cold/tech/cleaning/general) in the same rendering style so they
   read as one family.
3. Export as PNG with transparency (or SVG where Gemini's output allows
   clean vectorization) and drop into `/assets/illustrations/`.
4. Animate these in CSS/Framer Motion rather than re-rendering 3D live:
   subtle parallax on mouse move for the login hero, a gentle float/rotate
   loop (2–4° max, slow, 6s+ loop) for empty-state graphics. This gets you
   the "3D, animated" feel the brief wants without the performance and
   reliability risk of live 3D on a checkout counter.
5. Keep every generated asset inside the locked palette — reject any Gemini
   output that drifts toward generic purple/blue gradients; regenerate with
   the hex codes restated in the prompt if that happens.

Note in the Antigravity prompt log which assets were Gemini-generated versus
hand-built, since that's part of documenting your AI-agent workflow for
Deliverable #4.

---

## 7. Making it read as human-made, not AI-generated

Concrete checks, not vibes:
- **No default component library look.** If it looks like unstyled shadcn/
  Material/Bootstrap with a color swap, redo it. Every input, button, and
  card should carry the palette and type choices above, not framework
  defaults.
- **Copy is specific, not templated.** "Add to cart" not "Submit item."
  Error states say exactly what happened ("Only 3 units of Oat Milk left —
  reduce quantity to continue") not generic "An error occurred."
- **Asymmetry where it earns its place.** The POS cart panel is
  intentionally 60/40, not a perfectly centered 50/50 split — real checkout
  screens are lopsided toward the input because that's what gets used most.
- **One imperfection is fine.** A slightly irregular card corner radius
  system (6px small elements, 12px cards, 20px hero panels — not one
  radius token reused everywhere) reads as considered, not as an AI
  default of `rounded-xl` on everything.
- **Restraint is the tell of a human designer.** If in doubt, cut an
  animation or a gradient rather than add one — this is called out
  explicitly in section 5.

---

## 8. Handoff notes for Antigravity prompts

When you reach Phase 6 (React frontend) in the build guide, paste this
file's palette table, typography choices, and the Phase 6 layout concepts
directly into your prompt so the agent builds against real tokens instead
of inventing its own. Explicitly instruct it:

> "Use the exact hex values and component structure in design.md — do not
> substitute a default Tailwind color palette or a generic component
> library look. Implement the scan-to-cart settle animation described in
> section 4 using Framer Motion, timing ~200ms with slight overshoot."

Review every generated component against section 7's checklist before
accepting it.
