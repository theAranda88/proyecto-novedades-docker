import { createRouter, createWebHashHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";

// Extender interfaz RouteMeta para incluir requiredRole
declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
    requiresGuest?: boolean
    requiredRole?: 'Administrador' | 'Secretaria' | 'Estudiante'
  }
}

const routes: RouteRecordRaw[] = [
    { path: '/', redirect: '/login' },
    
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // RUTAS PÚBLICAS / AUTENTICACIÓN
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    {
        path: '/login',
        name: 'Login',
        component: () => import('../pages/LoginPage.vue'),
        meta: { requiresGuest: true }
    },
    {
        path: '/cambiar-contrasena',
        name: 'ChangePassword',
        component: () => import('../pages/ChangePasswordPage.vue'),
        meta: { requiresAuth: true }
    },

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // RUTAS ESTUDIANTE (requieren rol Estudiante)
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: () => import('../pages/DashboardPage.vue'),
        meta: { requiresAuth: true, requiredRole: 'Estudiante' }
    },
    {
        path: '/dashboard/solicitud',
        name: 'NuevaSolicitud',
        component: () => import('../pages/NuevasolicitudPage.vue'),
        meta: { requiresAuth: true, requiredRole: 'Estudiante' }
    },
    // Alias: ruta alternativa para nuevas solicitudes (nuevo diseño)
    {
        path: '/nueva-solicitud',
        name: 'NewApplication',
        component: () => import('../pages/NewApplicationPage.vue'),
        meta: { requiresAuth: true, requiredRole: 'Estudiante' }
    },
    {
        path: '/dashboard/historial',
        name: 'MiHistorial',
        component: () => import('../pages/MiHistorialPage.vue'),
        meta: { requiresAuth: true, requiredRole: 'Estudiante' }
    },
    // Alias: ruta alternativa para historial (nuevo diseño)
    {
        path: '/historial',
        name: 'History',
        component: () => import('../pages/History.vue'),
        meta: { requiresAuth: true, requiredRole: 'Estudiante' }
    },
    {
        path: '/perfil',
        name: 'Perfil',
        component: () => import('../pages/PerfilPage.vue'),
        meta: { requiresAuth: true, requiredRole: 'Estudiante' }
    },

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // RUTAS SECRETARIA (requieren rol Secretaria)
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    { 
      path: '/secretaria',
      name: 'SecretariaDashboard',
      redirect: { name: 'SecretariaSolicitudes' },
      meta: { requiresAuth: true, requiredRole: 'Secretaria' }
    },
    { 
      path: '/secretaria/solicitudes',
      name: 'SecretariaSolicitudes',
      component: () => import('../pages/SecretariaDashboardPage.vue'),
      meta: { requiresAuth: true, requiredRole: 'Secretaria' }
    },
    { 
      path: '/secretaria/solicitudes/:id',
      name: 'SecretariaDetalle',
      component: () => import('../pages/AdminDetalleSolicitud.vue'),
      meta: { requiresAuth: true, requiredRole: 'Secretaria' }
    },
    { 
      path: '/secretaria/config',
      name: 'SecretariaConfig',
      component: () => import('../pages/SecretariaDashboardPage.vue'),
      meta: { requiresAuth: true, requiredRole: 'Secretaria' }
    },

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // RUTAS ADMINISTRADOR (requieren rol Administrador)
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    { 
      path: '/admin/dashboard',
      name: 'AdminDashboard',
      component: () => import('../pages/AdminDashboardPage.vue'),
      meta: { requiresAuth: true, requiredRole: 'Administrador' }
    },
    { 
      path: '/admin/usuarios',
      name: 'AdminUsuarios',
      component: () => import('../pages/AdminUsuarios.vue'),
      meta: { requiresAuth: true, requiredRole: 'Administrador' }
    },
    { 
      path: '/admin/auditoria',
      name: 'AdminAuditoria',
      component: () => import('../pages/AdminDetalleSolicitud.vue'),
      meta: { requiresAuth: true, requiredRole: 'Administrador' }
    },

    // Fallback - Cualquier ruta desconocida
    { path: '/:pathMatch(.*)*', redirect: '/login' },
]

export const router = createRouter({ history: createWebHashHistory(), routes })

router.beforeEach((to) => {
  const isAuthenticated = !!localStorage.getItem('auth_token')
  const studentData = localStorage.getItem('auth_student')
  const student = studentData ? JSON.parse(studentData) : null
  const userRole = student?.rol
  const rawFirstLogin = localStorage.getItem('primer_login')
  const mustChange = rawFirstLogin === 'true' || rawFirstLogin === '"true"'

  // 🔴 Si no está autenticado y requiere auth → /login
  if (to.meta.requiresAuth && !isAuthenticated) {
    console.warn('❌ Acceso denegado: No autenticado')
    return { name: 'Login' }
  }

  // 🔴 Si está autenticado pero debe cambiar contraseña (excepto en ChangePassword) → /cambiar-contrasena
  if (isAuthenticated && mustChange && to.name !== 'ChangePassword') {
    console.warn('⚠️ Redirigiendo a cambiar contraseña')
    return { name: 'ChangePassword' }
  }

  // 🔴 Si está autenticado y es guest (login) → redirigir según rol
  if (to.meta.requiresGuest && isAuthenticated) {
    console.log('🔀 Redireccionando desde login según rol:', userRole)
    if (userRole === 'Administrador') return { name: 'AdminUsuarios' }
    if (userRole === 'Secretaria') return { name: 'SecretariaDashboard' }
    return { name: 'Dashboard' }
  }

  // 🔴 Si requiere rol específico y no lo tiene → redirigir a dashboard del rol
  if (to.meta.requiresAuth && to.meta.requiredRole && userRole !== to.meta.requiredRole) {
    console.warn(`❌ Acceso denegado: Rol requerido '${to.meta.requiredRole}', pero tienes '${userRole}'`)
    
    // Redirigir según el rol que sí tiene
    if (userRole === 'Administrador') return { name: 'AdminUsuarios' }
    if (userRole === 'Secretaria') return { name: 'SecretariaDashboard' }
    return { name: 'Dashboard' }
  }

  // 🟢 Permitir acceso
  return true
})

export default router
