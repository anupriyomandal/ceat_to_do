# Master Prompt: CEAT To-Do List Web Application

## 1. Project Overview

Build a **production-ready, full-featured To-Do List Web Application** branded for **CEAT**. The app should be modern, responsive, and visually consistent with the official CEAT Brand Color System defined in `BRAND_GUIDELINE.md`. It must work flawlessly on desktop, tablet, and mobile devices.

**Tech Stack (Recommended):**
- **Frontend:** React 18+ (Vite) or Next.js 14+
- **Styling:** Tailwind CSS v3+ or CSS Modules
- **State Management:** Zustand, Redux Toolkit, or React Context + useReducer
- **Storage:** localStorage (offline-first) with optional backend sync (e.g., Firebase, Supabase, or REST API)
- **Icons:** Lucide React or Heroicons
- **Fonts:** Inter, Roboto, or Open Sans (clean, professional sans-serif)

---

## 2. Brand Guidelines (Strict Compliance)

Adhere to the **CEAT Brand Color System**. All UI colors must be derived from the following tokens:

### Color Tokens
```json
{
  "primary": "#0055AA",
  "secondary": "#273C6F",
  "accent": "#F58220",
  "white": "#FFFFFF",
  "black": "#000000"
}
```

### Design Rules
- **Primary (60%):** Use `#0055AA` (CEAT Blue) for dominant surfaces, headers, primary buttons, active navigation, and brand-first elements.
- **Secondary (20-30%):** Use `#273C6F` (Dark Blue) for secondary headers, sidebars, footer, cards, and depth layers.
- **Accent (10%):** Use `#F58220` (CEAT Orange) **sparingly** for:
  - Primary Call-to-Action buttons (e.g., "Add Task", "Save")
  - Important alerts and badges
  - Hover states on critical actions
  - Progress indicators and highlights
- **Neutral (Base):** Use `#FFFFFF` (White) for backgrounds, card surfaces, and clean layouts.
- **Text (Base):** Use `#000000` (Black) for body text and high-contrast typography.

### Do's and Don'ts
- **DO:** Maintain high contrast (Blue/White, Black/White).
- **DO:** Keep layouts clean with ample white space.
- **DO:** Use Orange for attention and emphasis only.
- **DON'T:** Overuse Orange (reduces impact and looks unprofessional).
- **DON'T:** Introduce unofficial shades (no neon greens, purples, etc.).
- **DON'T:** Use low-contrast combinations (e.g., light gray on white, or orange text on white).

---

## 3. Core Features

### 3.1 Task Management
- **Create Task:** Add a new task with a title, description (optional), due date (optional), priority level (Low, Medium, High), and category/tag (optional).
- **Read Tasks:** Display tasks in a clear, scannable list or board view (Kanban-style columns: To Do, In Progress, Done).
- **Update Task:** Edit any field of an existing task inline or via a modal.
- **Delete Task:** Remove a task with a confirmation dialog to prevent accidental deletion.
- **Complete Task:** Toggle task completion status with a satisfying checkbox interaction.
- **Bulk Actions:** Select multiple tasks to mark complete, delete, or change category/priority in one go.

### 3.2 Task Organization
- **Categories / Tags:** Allow users to create custom categories (e.g., "Work", "Personal", "Urgent", "CEAT Projects"). Filter and group tasks by category.
- **Priorities:** Visual indicators for Low (Green/Dark Blue dot), Medium (Orange dot), High (Red/Orange dot) — ensure these align with brand colors where possible (e.g., use `#F58220` for High/Medium priority badges).
- **Due Dates:** Calendar date picker. Show overdue tasks with a distinct visual warning (e.g., Red text or Orange badge).
- **Sorting:** Sort by date created, due date, priority, or alphabetically.
- **Search:** Real-time search/filter by task title or description.

### 3.3 User Experience (UX)
- **Empty States:** Show friendly, on-brand illustrations/messages when no tasks exist (e.g., "All caught up! Time to plan your next CEAT milestone.").
- **Responsive Design:**
  - **Desktop:** Multi-column layout, sidebar navigation, drag-and-drop Kanban board.
  - **Tablet:** Collapsible sidebar, touch-friendly cards.
  - **Mobile:** Single-column stack, bottom navigation or hamburger menu, swipe gestures for quick actions (complete/delete).
- **Animations:** Smooth transitions for adding/removing tasks, modals, and page changes. Use subtle fade/slide effects (max 200-300ms).
- **Accessibility (a11y):**
  - WCAG 2.1 AA compliant contrast ratios.
  - Keyboard navigation support (Tab, Enter, Escape).
  - ARIA labels for screen readers.
  - Focus indicators visible on all interactive elements.

### 3.4 Data Persistence
- **Offline-First:** Save all data to `localStorage` by default so the app works without an internet connection.
- **Sync (Optional but recommended):** If a backend is implemented, sync `localStorage` with the cloud when online. Handle conflicts gracefully (last-write-wins or manual merge).
- **Export/Import:** Allow users to export their tasks as JSON/CSV and import them back.

---

## 4. Page / Component Structure

### 4.1 Layout
- **Header:** Fixed top bar. Contains CEAT logo (text or image), app title ("CEAT Task Manager"), global search bar, and user profile/settings icon.
- **Sidebar (Desktop):** Collapsible left sidebar. Contains navigation links (Dashboard, My Tasks, Calendar View, Categories, Settings), and a prominent "+ New Task" button styled in `#F58220`.
- **Main Content Area:** Adaptive width. Displays the current view (list, board, or calendar).
- **Footer:** Minimal, with CEAT branding, copyright, and links to privacy/terms if applicable.

### 4.2 Views
1. **Dashboard View:**
   - Summary cards at the top (Total Tasks, Completed Today, Overdue, High Priority) — use Primary/Secondary colors for cards, Accent for urgent numbers.
   - Recent tasks list below.
2. **List View:**
   - Traditional vertical list of tasks with columns for Title, Due Date, Priority, Category, Actions.
3. **Board View (Kanban):**
   - Three columns: "To Do", "In Progress", "Done".
   - Drag-and-drop tasks between columns.
   - Column headers in Secondary (`#273C6F`) or Primary (`#0055AA`) color.
4. **Calendar View (Optional but impressive):**
   - Monthly/Weekly calendar grid showing tasks on their due dates.
5. **Settings View:**
   - Toggle Dark Mode (if implemented — must remap brand colors to a dark palette: e.g., Primary `#0055AA` for headers, Secondary `#273C6F` for surfaces, White text on Dark Blue backgrounds).
   - Clear all data.
   - Export/Import data.

### 4.3 Reusable Components
- **Button:**
  - Primary: `bg-[#0055AA] text-white hover:bg-blue-800`
  - Accent/CTA: `bg-[#F58220] text-white hover:bg-orange-600`
  - Secondary: `bg-[#273C6F] text-white hover:bg-blue-900`
  - Ghost/Outline: `border border-[#0055AA] text-[#0055AA] hover:bg-blue-50`
- **Task Card:** White background, subtle shadow, rounded corners (`rounded-lg` or `rounded-xl`), left border color-coded by priority (use brand-compliant shades).
- **Modal:** Centered overlay for adding/editing tasks. Backdrop blur or semi-transparent black (`bg-black/50`).
- **Badge:** Small rounded pills for categories and priority. Use Accent (`#F58220`) sparingly for "High" or "Urgent" badges only.
- **Input / Textarea:** Clean, white background, subtle border (`border-gray-300`), focus ring in Primary (`#0055AA`).
- **Checkbox / Toggle:** Custom styled. Checked state should use Primary (`#0055AA`) or Accent (`#F58220`).

---

## 5. Technical Requirements

1. **Performance:**
   - First Contentful Paint (FCP) under 1.5s.
   - No layout shift on task list renders.
   - Virtualize long lists if tasks exceed 100 items.
2. **Code Quality:**
   - Component-based architecture.
   - Custom hooks for logic reuse (e.g., `useLocalStorage`, `useTaskFilter`).
   - TypeScript is strongly preferred for type safety.
3. **Security:**
   - Sanitize any user input before rendering (prevent XSS).
   - If using a backend, validate all API inputs and implement proper auth.
4. **Browser Support:**
   - Latest Chrome, Firefox, Safari, Edge.
   - Graceful degradation for older browsers (e.g., flexbox fallbacks).

---

## 6. Deliverables

1. Fully functional source code in a version-controlled repository (Git).
2. A `README.md` with:
   - Project description.
   - Setup and run instructions (`npm install`, `npm run dev`, `npm run build`).
   - Tech stack details.
   - Screenshots or a link to a live demo.
3. (Optional) A deployed live demo (e.g., Vercel, Netlify, GitHub Pages).

---

## 7. Tone and Voice

The app should feel **professional, efficient, and trustworthy** — mirroring the CEAT brand identity.
- Use clear, concise microcopy (e.g., "Task added", "Changes saved", "Are you sure you want to delete this task?").
- Avoid generic AI-speak. Keep it human and helpful.
- The overall aesthetic should be clean, corporate-modern, and confident.

---

## 8. Success Criteria

- [ ] All CRUD operations for tasks work smoothly.
- [ ] The UI strictly follows the CEAT 60-30-10 color rule.
- [ ] The app is fully responsive on mobile, tablet, and desktop.
- [ ] Data persists across browser refreshes (via `localStorage` or backend).
- [ ] No console errors or unhandled exceptions in the happy path.
- [ ] The final product looks polished, intentional, and ready for internal CEAT use.
