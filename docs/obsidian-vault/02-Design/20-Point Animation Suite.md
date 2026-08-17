# 🎨 20-Point 3D & UI Animation Suite

The Teerop POS user experience is built on hardware-accelerated **Framer Motion** and CSS3 3D transforms.

---

## 🌟 Master Animation Matrix

| # | Animation | Component / Location | Technical Mechanics |
|---|---|---|---|
| 1 | **3D Interactive Tilt** | Product Cards & Metric Tiles | Cursor position tracking using `useMotionValue` + spring physics mapping to `rotateX`/`rotateY`. |
| 2 | **Floating 3D** | Product Illustrations & POS Graphic | Multi-frequency CSS floating keyframes (`float-img-1`, `2`, `3`). |
| 3 | **Layered Parallax** | Product Cards | Multiple Z-index depths (`translateZ(20px)`, `translateZ(12px)`). |
| 4 | **Magnetic Spring Hover** | Primary Action Buttons | Dynamic cursor proximity pull (`MagneticButton.jsx`). |
| 5 | **Perspective Elevate** | Product Grid Items | Hover depth elevation using soft CSS drop shadows. |
| 6 | **Glass Reflection Sweep** | Product Images | Radial gradient light sheen following cursor movement. |
| 7 | **Atmospheric Depth Zoom** | Login Screen Backdrop | Continuous ambient slow zoom (`scale: [1.04, 1.07]`). |
| 8 | **Staggered Table Reveal** | Admin Dashboards & Stats | Rows enter sequentially with `staggerChildren: 0.05`. |
| 9 | **Staggered Card Grid** | Inventory Catalog | Product cards enter one-by-one with spring physics. |
| 10 | **Morphing Blobs** | Login Screen Background | Continuous organic `border-radius` transitions (`MorphingBlobs.jsx`). |
| 11 | **Ambient Gradient Motion** | Backdrop Glow | Radial gradients slowly shifting color tone and lighting. |
| 12 | **Thermal Paper Unroll** | Checkout Receipt Modal | Physical slip print animation (`scaleY: 0 -> 1`, `originY: top`). |
| 13 | **Count-Up Numbers** | KPI Analytics & Sales | Rolling number increments (`CountUpNumber.jsx`). |
| 14 | **Live Number Ticking** | POS Total / Subtotal | Digit pop transition on quantity change. |
| 15 | **Laser Scan Line** | Barcode Scanner Bar | Luminous laser scan line sweeps across during SKU search. |
| 16 | **Cart Settle Drop** | POS Cart Item Stream | 200ms spring drop with slight bounce on placement. |
| 17 | **Stock Alert Pulse** | Low-Stock & Hazard Badges | Pulsing amber glow (`.pulse-warning`) / red (`.pulse-danger`). |
| 18 | **Animated Checkmark Draw** | Receipt Modal | SVG stroke animates from 0% to 100% path length (`AnimatedCheckmark.jsx`). |
| 19 | **Page Route Transitions** | React Router Navigation | Smooth page fade and glide between tabs. |
| 20 | **Floating Glass Card** | Login Card | Centered frosted crystal glass card floats gently (`y: [-5, 5]`). |

---

**Related Notes:**
- [[00-Overview/00-Index|Master Navigation]]
- [[03-Implementation/Frontend Architecture|Frontend Architecture]]
- [[06-Diagrams/Sequence Diagrams|Sequence Diagrams]]
