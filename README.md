# CEAT Task Manager

A production-ready, full-featured To-Do List Web Application branded for **CEAT**. Built with React 18, TypeScript, Vite, Tailwind CSS, and Zustand.

## Features

- **Task Management:** Create, read, update, and delete tasks with title, description, due date, priority, category, and status.
- **Multiple Views:**
  - **Dashboard:** Overview with summary statistics and recent tasks.
  - **List View:** Sortable, filterable task list with bulk actions (select all, mark complete, delete).
  - **Board View:** Kanban-style board (To Do, In Progress, Done) with drag-and-drop.
  - **Settings:** Manage categories, export/import data, and clear all data.
- **Filtering & Search:** Real-time search, filter by priority and category, sort by date, priority, or title.
- **Responsive Design:** Fully responsive layout with sidebar navigation for desktop and a bottom navigation bar for mobile.
- **Offline-First:** All data is persisted to `localStorage` automatically.
- **CEAT Brand Compliance:** Strict adherence to the CEAT Brand Color System (Primary Blue `#0055AA`, Secondary Dark Blue `#273C6F`, Accent Orange `#F58220`).

## Tech Stack

- **Frontend:** React 18 + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS v3
- **State Management:** Zustand (with `persist` middleware for localStorage)
- **Icons:** Lucide React
- **Font:** Inter
- **Date Utilities:** date-fns

## Getting Started

### Prerequisites

- Node.js 18+ (with npm)

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build for Production

```bash
npm run build
```

The production build will be output to the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── main.tsx              # Application entry point
├── App.tsx               # Root layout (Header, Sidebar, Main, Footer)
├── index.css             # Tailwind directives + custom styles
├── types/
│   └── index.ts          # TypeScript types (Task, Category, etc.)
├── store/
│   └── taskStore.ts      # Zustand store with CRUD + persistence
├── components/
│   ├── ui/               # Reusable UI components (Button, Badge, Modal, Input, etc.)
│   ├── layout/           # Header, Sidebar, Footer, MobileNav
│   ├── TaskCard.tsx      # Individual task card
│   ├── TaskList.tsx      # List view with bulk actions
│   ├── TaskForm.tsx      # Create / edit task modal
│   ├── KanbanBoard.tsx   # Kanban board container
│   ├── KanbanColumn.tsx  # Kanban column with drop support
│   ├── DashboardStats.tsx# Summary statistic cards
│   ├── FilterBar.tsx     # Filter and sort controls
│   ├── CategoryManager.tsx
│   ├── SettingsPanel.tsx
│   └── ConfirmDialog.tsx
└── views/
    ├── DashboardView.tsx
    ├── ListView.tsx
    ├── BoardView.tsx
    └── SettingsView.tsx
```

## Brand Colors

| Role      | Color       | HEX      |
|-----------|-------------|----------|
| Primary   | CEAT Blue   | #0055AA  |
| Secondary | Dark Blue   | #273C6F  |
| Accent    | CEAT Orange | #F58220  |
| Neutral   | White       | #FFFFFF  |
| Text      | Black       | #000000  |

## Data Persistence

All tasks and categories are automatically saved to the browser's `localStorage` under the key `ceat-task-store`. You can export your data as a JSON file from the **Settings** page and import it later.

## License

Internal tool for CEAT.
