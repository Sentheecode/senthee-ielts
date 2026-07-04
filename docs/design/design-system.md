# IELTS Learning UI System

## Reference surfaces

- Desktop: `ielts-dashboard-desktop.png` (1536×1024)
- Mobile: `ielts-dashboard-mobile.png` (853×1843, iPhone portrait proportions)

## Tokens

- Canvas: true cool white `#ffffff`; secondary surface `#f7f9fc`.
- Ink: navy `#071b49`; body `#26354f`; muted `#6f7b90`; divider `#dde3eb`.
- Contribution: `#e7edf1`, `#ccebd5`, `#8ed6a4`, `#3fbd70`, `#07853f`.
- Priority: coral `#ff665b`; use only for current priority and primary learning action.
- Radius: 8px controls, 12px panels. No pill decoration or glass effects.
- Shadow: none for layout panels; subtle `0 8px 24px rgb(7 27 73 / 8%)` only for dialogs.

## Typography

- Font stack: `Inter`, `PingFang SC`, `Microsoft YaHei`, system sans-serif.
- Page title: 34/44 desktop, 30/40 mobile, weight 750, ink navy.
- Section title: 20/28 desktop, 18/26 mobile, weight 700.
- Body: 15/24 desktop, 15/23 mobile. Utility labels: 13/20.
- Numerals use tabular figures. Controls always receive explicit font size and weight.

## Layout

- Desktop: 188px navigation rail; 16–24px gutters; main grid minmax(0, 1fr) + 340px right rail.
- Mobile: no side rail; 20px page gutter; bottom navigation above safe-area inset.
- Use open sections and single-level bordered panels. Do not nest decorative cards.
- Dashboard order: title → contribution → time budget → selected task → skills → daily diff/Agent note.

## Components

- Contribution grid: 7 rows on desktop, 4 compact rows on mobile; square cells with 3px radius and accessible detail labels.
- Time budget: four equal controls with selected navy outline; coral is reserved for the recommended/current control.
- Skill progress: icon, skill name, progress track, current/target numeric text.
- Daily diff: semantic rows showing completed work, correction and points; no fake online-time metric.
- Navigation icons: Lucide, 20px desktop / 22px mobile, 1.8px stroke; selected state uses navy.
- Buttons: 44px minimum touch height, navy primary or outline secondary, visible focus ring.

## Responsive behavior

- Contribution cells shrink rather than overflow. Mobile shows recent weeks and offers an accessible details list.
- Desktop right rail moves below the task on screens below 980px.
- Mobile navigation has four entries: 首页、练习、词库、Agent.
- Respect `env(safe-area-inset-top)` and `env(safe-area-inset-bottom)`.

## Motion and accessibility

- 140–180ms ease transitions for selection and panel reveal; disable under `prefers-reduced-motion`.
- Text contrast meets WCAG AA; status is never conveyed by color alone.
- Every heatmap cell, progress value, recording control and icon-only action has an accessible label.

