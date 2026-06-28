# NexusFlow — Real-Time Automation Intelligence
## Worldwide RPA Monitor 2026 — Enterprise Control Terminal

**NexusFlow** is a High-Density Enterprise RPA Control Terminal designed for real-time telemetry monitoring of worldwide automation systems. Built for modern operations centers (NASA Mission Control meets Bloomberg Terminal aesthetic), it displays, filters, searches, and monitors thousands of concurrent live RPA robot events.

This application is built with React 18, Vite, Tailwind CSS, Framer Motion, and native Web APIs with zero external data grid or chart libraries, achieving locked 60 FPS rendering under a continuous 200ms real-time event firehose.

---

## 🚀 Key Features

1. **Custom Virtualized DOM Grid**: Implements a high-density viewport-recycled scroller using pure React and native DOM event streams. Displays 500+ live rows synchronously while maintaining exactly `Math.ceil(viewportHeight / rowHeight) + 10` row nodes.
2. **High-Density KPIs Dashboard**: Three pulsing cards tracking *Total Streamed Rows*, *Active Robots*, and *Global Cumulative Savings* featuring cubic ease-out tweening animations and custom SVG sparklines.
3. **Pipeline Buffer Control (Pause/Play)**: Pause the view grid to inspect data while the underlying `StateEngine` continues capturing the network firehose. Flush queued events dynamically upon resuming.
4. **Multi-Column Concurrent Sorter**: Durably sorts telemetry by shift-clicking multiple columns with priority indicators (①, ②, ③).
5. **Multi-Field Fuzzy Search**: Debounced search targeting project names, companies, partners, countries, and IDs out-of-order.
6. **Workspace Modules Persistence**: Operators can toggle modules (KPIs, Filters, Sidebar, Grid) with layout transitions. Workspace configuration survives hard browser refreshes via LocalStorage.
7. **Visual Alerts & Color-Coded Indicators**: Auto-expiring CSS flashes, status badges, and hover tooltips detailing node metrics.
8. **Live Hardware Telemetry**: Live FPS counter, memory footprint monitoring, and node statistics.

---

## 🛠️ Tech Stack & Architecture

- **Core**: React 18 (Vite)
- **Styling**: Tailwind CSS + Custom CSS Variables & Animations
- **Motion**: Framer Motion
- **Icons**: Lucide React
- **Typography**: Inter & JetBrains Mono (Google Fonts)

---

## ⚙️ Installation & Local Setup

### Prerequisites
Make sure you have Node.js (v18+) and npm installed.

### 1. Clone the repository:
```bash
git clone https://github.com/patidarkanak07/NexusFlow.git
cd NexusFlow
```

### 2. Install dependencies:
```bash
npm install
```

### 3. Start development server:
```bash
npm run dev
```

### 4. Build for production:
```bash
npm run build
```

---

## 🩺 Performance Profiling Details

- **Zero Memory Leaks**: Heap size capped at 10,000 entries; subscribers properly cleaned up.
- **GPU Composited Transitions**: CSS animations use layout-stable properties (`transform` and `opacity`) to bypass browser layout-thrashing cycles.
- **RAF-Gated State Engine**: Event streams throttle views to matching monitor refresh frequencies (60Hz max) via `requestAnimationFrame`.

---
*Created for the 2026 Enterprise Control Systems submission.*
