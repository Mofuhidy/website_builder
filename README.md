# Mini Website Builder

Frontend technical assignment for Rekaz.

This project is a responsive Arabic RTL mini website builder built with Next.js. It focuses on a single-page editing flow with a section library, import/export, page-level settings, preview font controls, drag-and-drop reordering, and editable structured content.

## Assignment Objective

Build a mini website builder with:

- Section library click-to-add
- JSON import/export
- Editable sections
- Delete and reorder sections using drag and drop
- Responsive builder UI
- Good performance with unnecessary re-renders avoided where practical
- SSR-friendly Next.js architecture by pushing client components down the tree

## Features

- Arabic RTL builder interface
- Right rail tabs for pages, fonts, colors, custom CSS, and sections
- Single-page builder flow with page settings modal
- Empty-page state with page restore action
- Live preview with desktop, tablet, and mobile canvas widths
- Section selection, floating actions, duplicate, move, delete
- Drag-and-drop section reordering with `@dnd-kit`
- Structured section property editing driven by `CATEGORY_REGISTRY`
- Repeatable list editing for FAQs, testimonials, services, features, and gallery items
- Gallery section with image URL support and upload option
- Testimonials section with optional avatar images
- Services and features with per-item media configuration
- Theme color controls applied to the preview canvas
- Preview-only font family switching
- Custom CSS injection into the preview
- JSON import/export with overwrite confirmation modal
- Legacy JSON fallback support
- Undo/redo with snapshot history

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS v4
- Zustand
- `@dnd-kit` for sorting
- Framer Motion for panel and list transitions
- Base UI + local UI wrappers for controls
- Heroicons for icons
- Sonner for toasts

## Architecture Overview

The app is intentionally split into a thin app shell and a client-side builder surface:

- `app/page.tsx` renders the builder entry point
- `components/builder/*` contains the editing experience
- `components/sections/*` contains preview section renderers
- `store/builder-store.ts` holds the builder state and undo/redo history
- `lib/section-registry.ts` defines the editable section catalog and field metadata

The builder is client-driven because it requires drag-and-drop, live editing, temporary draft state, and local import/export interactions. The App Router layer stays small, while stateful logic lives lower in the tree.

## Folder Structure

```text
app/
  layout.tsx
  page.tsx
  globals.css

components/
  builder/
    BuilderShell.tsx
    TopToolbar.tsx
    RightRail.tsx
    InspectorPanel.tsx
    PreviewCanvas.tsx
    PropertiesForm.tsx
    PagesPanel.tsx
    PageSettingsModal.tsx
    FontsPanel.tsx
    ColorsPanel.tsx
    CssPanel.tsx
    ImportConfirmationModal.tsx
    SortableBlock.tsx
    FloatingSectionToolbar.tsx
  sections/
    SectionRenderer.tsx
    SectionMedia.tsx
    ...
  ui/
    local UI wrappers and controls

lib/
  section-registry.ts
  types.ts
  utils.ts
  cn.ts

store/
  builder-store.ts
```

## Zustand Store

`store/builder-store.ts` is the central state container for:

- section blocks
- selected and editing block ids
- active right-rail tab
- preview device mode
- theme colors
- custom CSS
- page settings
- page existence state
- selected preview font
- undo/redo history

The store uses `persist` so the current editing session survives refreshes in the browser.

## Undo/Redo

Undo and redo are implemented with custom snapshot stacks:

- `past` stores previous snapshots
- `future` stores redo snapshots
- each meaningful mutation pushes a snapshot before changing the current state

The snapshot currently includes:

- `blocks`
- `themeColors`
- `customCss`
- `pageSettings`
- `hasPage`
- `fontFamily`

This is intentionally simple and predictable. It is not patch-based or diff-based.

## Section Registry

`lib/section-registry.ts` is the source of truth for the builder catalog.

Each registry item defines:

- section id
- display name
- icon
- `defaultData`
- `editableFields`

The properties panel does not hardcode field UIs per section. Instead, it reads the registry metadata and renders scalar or list inputs dynamically.

## How to Add a New Section

1. Add a new `SectionType` entry in [section-registry.ts](/Users/mofuhidy/Sites/website_builder/lib/section-registry.ts).
2. Add a registry item with `defaultData` and `editableFields`.
3. Create a preview component under `components/sections/`.
4. Wire that component into [SectionRenderer.tsx](/Users/mofuhidy/Sites/website_builder/components/sections/SectionRenderer.tsx).
5. If the section needs repeatable content, define a `list` field with `listFields` and `defaultItem`.

## JSON Import/Export V1 Schema

Current exports use version 1:

```json
{
  "version": 1,
  "themeColors": {
    "accent": "#f05151",
    "background": "#ffffff",
    "foreground": "#111827",
    "muted": "#f9fafb"
  },
  "customCss": "",
  "pageSettings": {
    "title": "الرئيسية",
    "slug": "home",
    "seoDescription": "",
    "showHeader": true,
    "showFooter": true
  },
  "hasPage": true,
  "fontFamily": "system",
  "blocks": [
    {
      "id": "hero-123",
      "type": "hero",
      "data": {}
    }
  ]
}
```

Legacy array-only imports are still accepted and mapped to default global settings.

Import flow now includes an overwrite confirmation modal before applying parsed data.

Import normalization also:

- skips unsupported section types safely
- skips malformed block entries safely
- repairs duplicate block ids during import
- restores missing global settings from defaults
- sanitizes imported custom CSS before preview injection
- normalizes imported block data against registry defaults

## Page Settings Schema

```json
{
  "title": "الرئيسية",
  "slug": "home",
  "seoDescription": "",
  "showHeader": true,
  "showFooter": true
}
```

Notes:

- `title` is required
- `slug` is normalized to a lowercase URL-safe value
- `seoDescription` is capped at 160 characters
- `showHeader` and `showFooter` only affect preview visibility

## Font Settings Schema

```json
{
  "fontFamily": "system"
}
```

Allowed values:

- `system`
- `cairo`
- `tajawal`
- `almarai`

The selected font is applied to the preview canvas only, not the builder chrome.

## Styling and Theme Controls

The builder currently supports:

- accent color
- background color
- foreground color
- muted color
- custom CSS
- preview font family

Theme colors are injected as CSS variables on the preview canvas wrapper.

## Custom CSS Behavior and Tradeoffs

Custom CSS is injected into the preview surface using a `<style>` tag inside the canvas wrapper.

Benefits:

- very flexible
- immediate feedback
- easy to export and import

Tradeoffs:

- CSS is powerful and can affect layout in unexpected ways
- imported custom CSS is scoped to the preview wrapper as much as possible instead of the full builder UI
- `@import` rules are stripped and `</style>` breakouts are neutralized before injection
- this is acceptable for a frontend-only assignment
- if this builder were connected to a backend or shared between users, custom CSS would need much stricter safety and scoping rules

## Responsive Design Decisions

- The builder shell flips to a bottom-nav + stacked layout on smaller screens
- The preview canvas width changes independently from the browser viewport through device toggles
- Section previews are built to respond to the canvas size, not only the browser size
- Long text and repeatable cards were adjusted to wrap more defensively in narrower canvases

## Container Queries

Preview sections use Tailwind container-query patterns so they react to the preview frame width. This is important because the editor has its own outer layout, and the canvas width does not always match the browser width.

This keeps the preview behavior closer to what a real embedded page builder needs.

## SSR-Friendly Decisions

- The App Router layer remains small
- Interactive editing logic lives in client components inside `components/builder`
- Static structure and simple routing stay at the app layer
- Font switching is applied at the preview wrapper rather than through app-wide runtime toggles

This is not a server-heavy architecture, but the component boundary placement avoids pushing more of the app client-side than necessary.

## Performance Decisions

- Section ids are stable once created
- Preview rendering is split by block
- Several section components use `memo`
- Undo/redo snapshots stay simple instead of introducing complex diff logic
- The properties panel is metadata-driven, which avoids duplicated form code

This project aims for practical performance rather than aggressive micro-optimization.

## Accessibility Notes

- RTL layout is applied across the builder
- icon-only buttons use `aria-label`
- modals use `role="dialog"` and `aria-modal`
- Escape and overlay-click close dialogs
- labels are wired to inputs where reasonable
- buttons that do not submit forms explicitly use `type="button"`

## Testing Notes

There is currently no dedicated automated test suite in the repository.

Manual verification was used for:

- builder rendering
- section editing
- import/export flows
- page settings
- font switching
- drag-and-drop
- malformed import handling
- fallback behavior for missing global settings

Lightweight unit tests around the store and import normalization would still be the next sensible addition.

## Known Tradeoffs

- Images currently use plain `<img>` tags because the content is user-provided and dynamic
- Image uploads are stored as data URLs in local state and exported JSON, which is convenient but can increase file size
- Undo/redo is snapshot-based, not granular patch-based
- Custom CSS is intentionally powerful even after scoping and sanitization, so it should be treated carefully if a backend or multi-user sharing is introduced later
- The app remains single-page by design; multi-page editing is out of scope for this assignment
- Some media fields use simple text-driven icon names rather than a richer picker UI

## How to Run Locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

Other useful commands:

```bash
npm run lint
npm run build
npm run start
```

## Deployment

Deployment on Vercel.

- Production URL: [websitebuilder-pi.vercel.app](https://websitebuilder-pi.vercel.app)
