# AGENTS.md

## UI Component Extraction & Usage Rule

Whenever you create or modify UI elements in this codebase (e.g., typography, buttons, inputs, cards, badges, modals, layout containers), adhere strictly to the following:

### 1. Component Extraction
- Do NOT write inline, hardcoded UI primitives directly inside feature pages or complex views.
- If a UI pattern (e.g., Title, Paragraph, Button, Badge, Card, Modal, Input) exists or is needed, extract it into its own reusable component file under `src/components/ui/`.
- Ensure extracted components accept flexible Tailwind class extensions via `className` props (using `clsx` or `tailwind-merge` via the `cn()` helper from `@/lib/utils`).

### 2. System-Wide Reuse
- Before building a new visual element, check `src/components/ui/` first.
- If a matching UI component already exists, import and use it across all feature files rather than duplicating raw HTML tags or custom styles.
- If an existing UI component lacks a required variant or size, update the base UI component file to support the new variant instead of re-implementing it locally in a page file.

### 3. Consistency & Refactors
- When updating or refactoring existing pages, replace instances of raw HTML elements (`<h1>`, `<p>`, `<button>`, `<input>`) with the centralized `src/components/ui/` components.

### Existing Shared Components

| Component | File | Key Props |
|---|---|---|
| `Button` | `src/components/ui/Button.jsx` | `variant` (primary, secondary, ghost, accept, reject, indigo, indigo-outline, destructive), `className`, `as` |
| `IconButton` | `src/components/ui/IconButton.jsx` | `color` (slate, indigo, rose, rose-600), `className` |
| `Input` | `src/components/ui/Input.jsx` | `className`, `containerClassName`, `icon` |
| `Heading` | `src/components/ui/Heading.jsx` | `size` (xs, sm, md, lg), `className` |
| `Text` | `src/components/ui/Text.jsx` | `variant` (body, subtle, subtle-sm, muted, muted-sm), `className` |
| `Badge` | `src/components/ui/Badge.jsx` | `variant`, `className` |
| `Card` | `src/components/ui/Card.jsx` | `className` |
| `Divider` | `src/components/ui/Divider.jsx` | `className` |
| `Avatar` | `src/components/ui/Avatar.jsx` | `size`, `className` |
| `EmptyState` | `src/components/ui/EmptyState.jsx` | `icon`, `title`, `description`, `actionLabel`, `onAction` |
| `StatCard` | `src/components/ui/StatCard.jsx` | `label`, `value`, `delta`, `className` |
| `StatStrip` | `src/components/ui/StatStrip.jsx` | `stats`, `className` |
| `Table` (+ `Thead`, `Th`, `Tbody`, `Tr`, `Td`, `Tfoot`) | `src/components/ui/Table.jsx` | standard table props |
| `MobileSheet` | `src/components/ui/MobileSheet.jsx` | `isOpen`, `onClose`, `title`, `children` |
| `SidebarNavButton` | `src/components/ui/SidebarNavButton.jsx` | `active`, `onClick`, `icon`, `label` |

Import via barrel: `import { Button, Input, Heading } from '../ui'` (or `@/components/ui`).

### Exceptions (intentionally raw)
- Segmented controls / toggle groups (no shared component yet — consider extracting `SegmentedControl` if pattern repeats)
- Menu/dropdown items
- Checkbox inputs (no shared Checkbox component)
- Select elements (no shared Select component)
- Hidden file inputs
- Custom controls (e.g., checklist toggles)
