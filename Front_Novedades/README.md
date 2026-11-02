# Vue 3 + TypeScript + Vite

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about the recommended Project Setup and IDE Support in the [Vue Docs TypeScript Guide](https://vuejs.org/guide/typescript/overview.html#project-setup).


---

## 4. Estructura de carpetas

Esta es la estructura profesional y escalable para el proyecto:
```
academiaflow/
├── public/
│   └── favicon.ico
│
├── src/
│   ├── assets/                  # Imágenes, fuentes, íconos estáticos
│   │   └── logo.svg
│   │
│   ├── components/              # Componentes reutilizables
│   │   ├── ui/                  # Genéricos: Button, Input, Modal, Badge...
│   │   │   ├── BaseButton.vue
│   │   │   ├── BaseInput.vue
│   │   │   └── AlertMessage.vue
│   │   │
│   │   ├── auth/                # Específicos del flujo de autenticación
│   │   │   ├── LoginForm.vue
│   │   │   └── ChangePasswordForm.vue
│   │   │
│   │   ├── dashboard/           # Específicos del panel principal
│   │   │   ├── DashboardSidebar.vue
│   │   │   ├── AccionesRapidas.vue
│   │   │   └── SolicitudesTable.vue
│   │   │
│   │   └── layout/              # Layouts que envuelven páginas
│   │       └── AuthLayout.vue
│   │
│   ├── pages/                   # Una página por ruta — orquestan componentes
│   │   ├── LoginPage.vue
│   │   ├── ChangePasswordPage.vue
│   │   └── DashboardPage.vue
│   │
│   ├── router/                  # Configuración de rutas y guards
│   │   └── index.ts
│   │
│   ├── services/                # Llamadas a la API — una responsabilidad cada uno
│   │   ├── authService.ts
│   │   └── solicitudesService.ts
│   │
│   ├── store/                   # Estado global con Pinia
│   │   └── authStore.ts
│   │
│   ├── types/                   # Interfaces y tipos TypeScript
│   │   └── index.ts
│   │
│   ├── utils/                   # Funciones puras reutilizables
│   │   ├── httpClient.ts        # Wrapper de fetch con token automático
│   │   └── validators.ts        # Validaciones de formulario
│   │
│   ├── App.vue                  # Entrada: solo <RouterView />
│   ├── main.ts                  # Bootstrap: registra plugins
│   └── style.css                # @import "tailwindcss"
│
├── .env                         # Variables de entorno (no subir a git)
├── .env.example                 # Plantilla del .env (sí subir a git)
├── .gitignore
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 5. Reglas de arquitectura

Estas son las reglas que hacen que el proyecto escale bien:

**`components/ui/`** — Solo componentes 100% genéricos. No deben saber nada del negocio. Un `BaseButton` no sabe que existe "AcademiaFlow".

**`components/[dominio]/`** — Componentes que sí conocen el negocio pero no hacen llamadas a la API directamente. Reciben datos por props y emiten eventos.

**`pages/`** — Son las únicas que orquestan todo: llaman al store, pasan props a los componentes y manejan la navegación. Una página = una ruta.

**`services/`** — Solo hablan con la API. No tocan el DOM, no usan el router, no modifican el store. Devuelven datos o lanzan errores.

**`store/`** — Une los servicios con el estado global. Las páginas llaman al store, el store llama al servicio.

**`utils/`** — Funciones puras sin efectos secundarios. Fáciles de testear.

El flujo de datos siempre va en una sola dirección:
```
Page → Store → Service → API
             ↓
         State update
             ↓
         Component re-render