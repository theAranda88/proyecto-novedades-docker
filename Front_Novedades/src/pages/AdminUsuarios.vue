<template>
  <AdminLayout>

    <!-- ── Header ── -->
    <div class="banda-institucional mb-6 flex flex-wrap items-end justify-between gap-4 rounded-2xl px-5 py-7 sm:px-8">
      <div>
        <h1 class="font-brand text-2xl text-white! sm:text-3xl">Cuentas de secretaría</h1>
        <p class="mt-2 text-sm text-blue-100">Crea cuentas de secretaría y gestiona su acceso al portal.</p>
      </div>
      <div class="flex items-center gap-3">
        <button
          @click="abrirModal()"
          class="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--color-orange)] hover:bg-[#f6be86] text-[#172f48] text-sm font-bold shadow-md shadow-orange-200 transition-all hover:-translate-y-px active:translate-y-0"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
            stroke-linecap="round" stroke-linejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <line x1="19" y1="8" x2="19" y2="14"/>
            <line x1="22" y1="11" x2="16" y2="11"/>
          </svg>
          Nueva cuenta
        </button>
      </div>
    </div>

    <section v-if="clavePendiente" aria-labelledby="entrega-credencial" class="mb-6 rounded-xl border border-[#e8c89f] bg-[#fff5e5] p-4">
      <h2 id="entrega-credencial" class="font-bold">Entrega de contraseña temporal</h2>
      <p class="mt-1 text-sm text-slate-700">{{ clavePendiente.mensaje }}</p>
      <details class="mt-3 text-sm">
        <summary class="w-fit cursor-pointer font-semibold text-blue-700">Mostrar contraseña temporal</summary>
        <code class="mt-2 inline-block select-all break-all rounded-md bg-white px-3 py-2">{{ clavePendiente.clave }}</code>
      </details>
      <button type="button" class="mt-3 text-sm font-semibold text-blue-700 underline" @click="clavePendiente = null">Cerrar y ocultar contraseña</button>
    </section>

    <!-- ── Stats ── -->
    <div class="mb-6 grid gap-3 sm:grid-cols-2">
      <div class="bg-white border border-slate-200 rounded-2xl px-8 py-6 shadow-sm flex items-center justify-between">
        <div>
          <p class="text-[12.5px] font-semibold text-slate-500 mb-2">Secretarias Registradas</p>
          <Cargando v-if="loadingStats" inline texto="Cargando…" />
          <p v-else class="text-[36px] font-bold text-slate-900 tracking-tight leading-none mb-1.5">
            {{ stats?.secretarias?.toLocaleString('es-CO') ?? '0' }}
          </p>
          <p class="text-[12px] text-slate-400">
            Total de cuentas de secretaría en el sistema
          </p>
        </div>
        <div class="w-11 h-11 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
            stroke-linecap="round" stroke-linejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
        </div>
      </div>

      <div class="bg-white border border-slate-200 rounded-2xl px-8 py-6 shadow-sm flex items-center justify-between">
        <div>
          <p class="text-[12.5px] font-semibold text-slate-500 mb-2">Rol Gestionado</p>
          <Cargando v-if="loadingStats" inline texto="Cargando…" />
          <p v-else class="text-[30px] font-bold text-slate-900 tracking-tight leading-none mb-1.5">Secretaria</p>
          <p class="text-[12px] text-slate-400">
            Único rol habilitado para este módulo
          </p>
        </div>
        <div class="w-11 h-11 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
            stroke-linecap="round" stroke-linejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <polyline points="16 11 18 13 22 9"/>
          </svg>
        </div>
      </div>
    </div>

    <!-- ── Tabla de usuarios ── -->
    <div class="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

      <!-- Tabla -->
      <div class="overflow-x-auto">
      <table class="w-full min-w-[36rem]">
        <thead>
          <tr class="border-b border-slate-100">
            <th class="text-left px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">Usuario</th>
            <th class="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 w-[120px]">Rol</th>
            <th class="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 w-[110px]">Estado</th>
            <th class="text-right px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 w-[110px]">Acciones</th>
          </tr>
        </thead>

        <tbody>
          <!-- Skeleton -->
          <tr v-if="loadingTabla"><td colspan="4"><Cargando texto="Cargando cuentas de secretaría…" /></td></tr>
          <tr v-else-if="!usuarios.length"><td colspan="4" class="p-6 text-center text-sm text-slate-600">No hay cuentas para mostrar.</td></tr>

          <!-- Datos -->
          <template v-else>
            <tr
              v-for="u in usuarios"
              :key="u.id"
              class="border-b border-slate-50 hover:bg-slate-50/60 transition-colors group"
            >
              <!-- Usuario -->
              <td class="px-6 py-3.5">
                <div class="flex items-center gap-3">
                  <div class="relative shrink-0">
                    <div class="w-9 h-9 rounded-full bg-gradient-to-br from-slate-300 to-slate-400 flex items-center justify-center text-white text-xs font-bold overflow-hidden">
                      <img v-if="u.avatarUrl" :src="u.avatarUrl" class="w-full h-full object-cover" alt="" />
                      <span v-else>{{ (u.nombre_completo || u.nombre || '?').charAt(0) }}</span>
                    </div>
                    <!-- Dot de estado -->
                    <span
                      :class="[
                        'absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white',
                        u.estado === 'Activo' ? 'bg-green-500' : u.estado === 'Inactivo' ? 'bg-amber-400' : 'bg-red-500'
                      ]"
                    />
                  </div>
                  <div>
                    <p class="text-[13px] font-semibold text-slate-800 leading-tight">{{ u.nombre_completo || u.nombre }}</p>
                    <p class="text-[11.5px] text-slate-400">{{ u.email || u.email_institucional }}</p>
                  </div>
                </div>
              </td>

              <!-- Rol chip -->
              <td class="px-4 py-3.5">
                <span :class="['inline-block px-2.5 py-1 rounded-full text-[11.5px] font-semibold', rolChip(u.rol)]">
                  {{ u.rol }}
                </span>
              </td>

              <!-- Estado -->
              <td class="px-4 py-3.5">
                <div class="flex items-center gap-1.5">
                  <span
                    v-if="u.estado === 'Inactivo'"
                    class="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0"
                  />
                  <span :class="['text-[13px] font-medium', estadoColor(u.estado)]">
                    {{ u.estado }}
                  </span>
                </div>
              </td>

              <td class="px-6 py-3.5">
                <div class="flex items-center justify-end gap-0.5">
                  <button
                    type="button"
                    title="Editar usuario"
                    aria-label="Editar usuario"
                    class="flex size-8 shrink-0 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-blue-50 hover:text-blue-600"
                    @click="abrirModal(u)"
                  >
                    <svg aria-hidden="true" class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                  </button>
                  <button
                    type="button"
                    :title="u.estado === 'Activo' ? 'Desactivar usuario' : 'Activar usuario'"
                    :aria-label="u.estado === 'Activo' ? 'Desactivar usuario' : 'Activar usuario'"
                    class="flex size-8 shrink-0 items-center justify-center rounded-lg text-slate-500 transition-colors"
                    :class="u.estado === 'Activo' ? 'hover:bg-amber-50 hover:text-amber-700' : 'hover:bg-green-50 hover:text-green-700'"
                    @click="abrirConfirmacion(u, u.estado === 'Activo' ? 'desactivar' : 'activar')"
                  >
                    <svg aria-hidden="true" class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <template v-if="u.estado === 'Activo'">
                        <path d="M12 2v10M6.4 6.4a8 8 0 1 0 11.2 0"/>
                      </template>
                      <template v-else>
                        <circle cx="12" cy="12" r="9"/>
                        <path d="m8.5 12 2.5 2.5 4.5-5"/>
                      </template>
                    </svg>
                  </button>
                  <button
                    type="button"
                    title="Eliminar usuario"
                    aria-label="Eliminar usuario"
                    class="flex size-8 shrink-0 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-red-50 hover:text-red-500"
                    @click="abrirConfirmacion(u, 'eliminar')"
                  >
                    <svg aria-hidden="true" class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                      <path d="M10 11v6M14 11v6"/>
                      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
      </div>

      <!-- Footer tabla -->
      <div class="flex flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
        <p class="text-[12.5px] text-slate-400">
          Mostrando <span class="font-semibold text-slate-600">{{ rangoLabel }}</span> de
          <span class="font-semibold text-slate-600">{{ total.toLocaleString('es-CO') }}</span> usuarios
        </p>

        <div class="flex items-center gap-1">
          <button
            @click="page--"
            :disabled="page === 1"
            class="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[12.5px] font-medium text-slate-500 border border-slate-200 disabled:opacity-40 hover:bg-slate-50 transition-all"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
            Anterior
          </button>

          <template v-for="p in pageButtons" :key="p">
            <span v-if="p === '...'" class="px-1.5 text-slate-400 text-sm select-none">...</span>
            <button
              v-else
              @click="page = Number(p)"
              :class="[
                'w-8 h-8 rounded-lg text-[13px] font-semibold transition-all',
                page === Number(p)
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-200'
                  : 'text-slate-500 hover:bg-slate-100'
              ]"
            >{{ p }}</button>
          </template>

          <button
            @click="page++"
            :disabled="page === totalPages"
            class="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[12.5px] font-medium text-slate-500 border border-slate-200 disabled:opacity-40 hover:bg-slate-50 transition-all"
          >
            Siguiente
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
      </div>
    </div>

    <!-- ══════════════════════════════════════════════════ -->
    <!-- Modal: Crear / Editar usuario                      -->
    <!-- ══════════════════════════════════════════════════ -->
    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-all duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="modalAbierto"
        class="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6"
        @click.self="cerrarModal"
      >
        <Transition
          enter-active-class="transition-all duration-200 ease-out"
          enter-from-class="opacity-0 -translate-x-4"
          enter-to-class="opacity-100 translate-x-0"
        >
          <div
            v-if="modalAbierto"
            class="bg-white rounded-2xl shadow-2xl w-full max-w-[360px] overflow-hidden"
          >
            <!-- Modal header -->
            <div class="flex items-start justify-between px-6 pt-6 pb-4">
              <div>
                <h3 class="text-[16px] font-bold text-slate-800">
                  {{ usuarioEditando ? 'Editar Usuario' : 'Crear Nueva cuenta' }}
                </h3>
                <p class="text-[12.5px] text-slate-400 mt-1 leading-relaxed">
                  {{ usuarioEditando ? 'Modifica los datos del integrante.' : 'Completa los datos para registrar una nueva secretaria en la plataforma Novedades Autonoma.' }}
                </p>
              </div>
              <button @click="cerrarModal" class="text-slate-400 hover:text-slate-600 transition-colors mt-0.5">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
                  stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            <!-- Modal body -->
            <div class="px-6 pb-6 space-y-4">

              <!-- Campos del formulario en layout label-input -->
              <div class="space-y-3.5">
                <div class="flex items-start gap-3">
                  <span class="text-[12.5px] font-medium text-slate-500 w-[72px] text-right pt-2.5 shrink-0">Nombre</span>
                  <div class="flex-1">
                    <BaseInput v-model="form.nombre" placeholder="Ej: Juan Pérez" :error-message="errForm.nombre" />
                  </div>
                </div>

                <div class="flex items-start gap-3">
                  <span class="text-[12.5px] font-medium text-slate-500 w-[72px] text-right pt-2.5 shrink-0">Correo</span>
                  <div class="flex-1">
                    <BaseInput v-model="form.email" type="email" placeholder="usuario@u.edu.co" :error-message="errForm.email" />
                  </div>
                </div>

                <div class="flex items-start gap-3">
                  <span class="text-[12.5px] font-medium text-slate-500 w-[72px] text-right pt-2.5 shrink-0">Rol</span>
                  <div class="flex-1">
                    <div
                      class="w-full px-3 py-2.5 rounded-lg border border-slate-300 bg-slate-50 text-sm text-slate-700"
                    >
                      Secretaria
                    </div>
                    <p v-if="errForm.rol" class="text-[11px] text-red-500 mt-1">{{ errForm.rol }}</p>
                  </div>
                </div>

                <div class="flex items-start gap-3">
                  <span class="text-[12.5px] font-medium text-slate-500 w-[72px] text-right pt-2.5 shrink-0">ID Institucional</span>
                  <div class="flex-1">
                    <BaseInput v-model="form.idInstitucional" placeholder="Código numérico" :error-message="errForm.idInstitucional" />
                  </div>
                </div>
              </div>

              <p v-if="!usuarioEditando" class="rounded-lg bg-blue-50 p-3 text-xs leading-relaxed text-blue-700">
                La cuenta se crea con una contraseña temporal. Se solicitará el envío a la dirección de correo registrada.
              </p>

              <!-- Botones -->
              <div class="flex items-center gap-2.5 pt-2">
                <button
                  :disabled="guardando"
                  @click="cerrarModal"
                  class="flex-1 py-2.5 rounded-xl border border-slate-200 text-[13px] font-semibold text-slate-600 hover:bg-slate-50 transition-all"
                >
                  Cancelar
                </button>
                <button
                  :aria-busy="guardando"
                  @click="guardarUsuario"
                  :disabled="guardando"
                  class="flex-1 py-2.5 rounded-xl bg-[var(--color-orange)] hover:bg-[#f6be86] disabled:opacity-60 text-[#172f48] text-[13px] font-bold transition-all flex items-center justify-center gap-2"
                >
                  <Cargando v-if="guardando" decorativo />
                  {{ guardando ? 'Guardando...' : 'Guardar Usuario' }}
                </button>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>

    <dialog
      ref="dialogoAccion"
      class="m-auto w-[min(28rem,calc(100%-2rem))] rounded-2xl border border-slate-200 bg-white p-0 shadow-xl backdrop:bg-slate-950/40"
      aria-labelledby="confirmar-accion-titulo"
      aria-describedby="confirmar-accion-detalle"
      @cancel.prevent="cerrarConfirmacion"
    >
      <div v-if="confirmacion" class="space-y-4 p-5 sm:p-6">
        <h2 id="confirmar-accion-titulo" class="text-lg font-bold">{{ acciones[confirmacion.tipo].titulo }}</h2>
        <div id="confirmar-accion-detalle" class="space-y-2 text-sm leading-relaxed text-slate-700">
          <p class="break-words font-semibold">{{ confirmacion.usuario.nombre_completo || confirmacion.usuario.nombre }}</p>
          <p>{{ acciones[confirmacion.tipo].descripcion }}</p>
        </div>
        <p v-if="errorAccion" role="alert" class="text-sm text-red-700">{{ errorAccion }}</p>
        <div class="flex flex-wrap justify-end gap-2">
          <button type="button" autofocus :disabled="procesandoAccion" class="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold disabled:opacity-50" @click="cerrarConfirmacion">
            Cancelar
          </button>
          <button
            type="button"
            :disabled="procesandoAccion"
            :aria-busy="procesandoAccion"
            class="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
            :class="confirmacion.tipo === 'eliminar' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'"
            @click="confirmarAccion"
          >
            <Cargando v-if="procesandoAccion" decorativo />
            {{ acciones[confirmacion.tipo].titulo }}
          </button>
        </div>
      </div>
    </dialog>

    <!-- Toast -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="toast"
        :class="[
          'fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2.5 px-5 py-3 rounded-2xl shadow-xl text-sm font-semibold text-white z-[60]',
          toast.tipo === 'exito' ? 'bg-green-600' : 'bg-red-600'
        ]"
      >
        <svg v-if="toast.tipo === 'exito'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
        {{ toast.mensaje }}
      </div>
    </Transition>

  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, reactive, nextTick } from 'vue'
import usuariosService from '../services/usuariosService'
import type { UsuarioAdmin, UsuariosStats, RolUsuario, EstadoUsuario } from '../types'
import AdminLayout from '../components/layout/AdminLayout.vue'
import BaseInput from '../components/ui/BaseInput.vue'

// ─── Constantes ──────────────────────────────────────────────────────────────
const PER_PAGE = 5

// ─── Estado ──────────────────────────────────────────────────────────────────
const stats          = ref<UsuariosStats | null>(null)
const usuarios       = ref<UsuarioAdmin[]>([])
const total          = ref(0)
const page           = ref(1)
const loadingStats   = ref(false)
const loadingTabla   = ref(false)

// ─── Modal ───────────────────────────────────────────────────────────────────
const modalAbierto    = ref(false)
const usuarioEditando = ref<UsuarioAdmin | null>(null)
const guardando       = ref(false)
const acciones = {
  activar: {
    titulo: 'Activar cuenta',
    descripcion: 'La persona podrá iniciar sesión nuevamente.',
    aplicar: usuariosService.reactivarUsuario,
    exito: 'Cuenta activada.',
  },
  desactivar: {
    titulo: 'Desactivar cuenta',
    descripcion: 'Se bloqueará el acceso hasta que actives la cuenta de nuevo.',
    aplicar: usuariosService.desactivarUsuario,
    exito: 'Cuenta desactivada.',
  },
  eliminar: {
    titulo: 'Eliminar cuenta',
    descripcion: 'La cuenta desaparecerá del directorio y perderá el acceso. La acción quedará registrada en auditoría.',
    aplicar: usuariosService.eliminarUsuario,
    exito: 'Cuenta eliminada del directorio.',
  },
} as const

const dialogoAccion = ref<HTMLDialogElement | null>(null)
const confirmacion = ref<{ usuario: UsuarioAdmin; tipo: keyof typeof acciones } | null>(null)
const procesandoAccion = ref(false)
const errorAccion = ref('')

const form = reactive({
  nombre:          '',
  email:           '',
  rol:             '' as RolUsuario | '',
  idInstitucional: '',
})

const errForm = reactive({
  nombre: '', email: '', rol: '', idInstitucional: '',
})

// ─── Toast ───────────────────────────────────────────────────────────────────
const clavePendiente = ref<{ clave: string; mensaje: string } | null>(null)
const toast = ref<{ tipo: 'exito' | 'error'; mensaje: string } | null>(null)

// ─── Carga inicial ────────────────────────────────────────────────────────────
onMounted(async () => {
  loadingStats.value = true
  loadingTabla.value = true
  try {
    const [statsData, tablaData] = await Promise.all([
      usuariosService.obtenerEstadisticas().catch(() => null),
      usuariosService.getUsuarios({ pagina: 1, limite: PER_PAGE, rol: 'Secretaria' })
    ])
    const totalSecretarias = tablaData?.total ?? 0
    stats.value = {
      total_usuarios: statsData?.total_usuarios ?? totalSecretarias,
      activos: statsData?.activos ?? 0,
      inactivos: statsData?.inactivos ?? 0,
      estudiantes: statsData?.estudiantes ?? 0,
      secretarias: statsData?.secretarias ?? totalSecretarias,
      administradores: statsData?.administradores ?? 0,
    }
    usuarios.value    = tablaData?.usuarios || []
    total.value       = totalSecretarias
  } catch { /* silencio */ } finally {
    loadingStats.value = false
    loadingTabla.value = false
  }
})

watch(page, fetchTabla)

async function fetchTabla() {
  loadingTabla.value = true
  try {
    const res = await usuariosService.getUsuarios({
      pagina: page.value,
      limite: PER_PAGE,
      rol: 'Secretaria',
    })
    usuarios.value = res.usuarios
    total.value    = res.total
  } catch { } finally {
    loadingTabla.value = false
  }
}

// ─── Modal ───────────────────────────────────────────────────────────────────
function abrirModal(usuario?: UsuarioAdmin) {
  usuarioEditando.value = usuario ?? null
  if (usuario) {
    form.nombre = usuario.nombre_completo || usuario.nombre || ''
    form.email  = usuario.email_institucional || usuario.email || ''
    form.rol    = usuario.rol
    form.idInstitucional = usuario.codigo_estudiantil || usuario.idInstitucional || ''
  } else {
    form.nombre = ''; form.email = ''; form.rol = 'Secretaria'
    form.idInstitucional = ''
  }
  Object.assign(errForm, { nombre: '', email: '', rol: '', idInstitucional: '' })
  modalAbierto.value = true
}

function cerrarModal() { modalAbierto.value = false }

function validarForm(): boolean {
  Object.assign(errForm, { nombre: '', email: '', rol: '', idInstitucional: '' })
  let ok = true
  if (!form.nombre.trim())          { errForm.nombre = 'El nombre es requerido.'; ok = false }
  if (!form.email.trim())           { errForm.email  = 'El correo es requerido.'; ok = false }
  if (form.rol !== 'Secretaria')    { errForm.rol    = 'El rol permitido es Secretaria.'; ok = false }
  if (!form.idInstitucional.trim()) { errForm.idInstitucional = 'El ID es requerido.'; ok = false }
  return ok
}

async function guardarUsuario() {
  if (guardando.value || !validarForm()) return
  guardando.value = true
  try {
    if (usuarioEditando.value) {
      await usuariosService.actualizar(Number(usuarioEditando.value.id), {
        nombre_completo: form.nombre,
        email_institucional: form.email,
      })
      const idx = usuarios.value.findIndex(u => u.id === usuarioEditando.value!.id)
      if (idx !== -1) {
        const existente = usuarios.value[idx]
        if (existente) {
          usuarios.value[idx] = {
            ...existente,
            nombre: form.nombre,
            nombre_completo: form.nombre,
            email: form.email,
            email_institucional: form.email,
            rol: 'Secretaria',
            codigo_estudiantil: form.idInstitucional,
            idInstitucional: form.idInstitucional,
          }
        }
      }
      mostrarToast('Usuario actualizado correctamente.', 'exito')
    } else {
      const resultadoCreacion = await usuariosService.crearUsuario({
        nombre_completo: form.nombre,
        email_institucional: form.email,
        rol: 'Secretaria',
        codigo_estudiantil: form.idInstitucional,  // Backend requiere codigo_estudiantil
      })
      if (resultadoCreacion?.usuario) {
        usuarios.value.unshift(resultadoCreacion.usuario)
        clavePendiente.value = null
        if (resultadoCreacion.correo_acceso === 'aceptado') {
          mostrarToast('Cuenta creada. El proveedor aceptó el correo con los datos de acceso.', 'exito')
        } else if (resultadoCreacion.contrasena_temporal) {
          clavePendiente.value = {
            clave: resultadoCreacion.contrasena_temporal,
            mensaje: resultadoCreacion.correo_acceso === 'no_configurado'
              ? 'El envío institucional aún no está configurado. Entrega la clave por un canal privado.'
              : 'El envío no se pudo confirmar. Coordina la entrega de la clave por un canal privado.',
          }
          mostrarToast('Cuenta creada. Revisa la sección de entrega de contraseña.', 'exito')
        } else {
          mostrarToast('Cuenta creada correctamente.', 'exito')
        }
      }
    }
    cerrarModal()
  } catch (err: unknown) {
    const error = err as { message?: string; statusCode?: number }
    const message = error?.message ?? 'Error al guardar.'

    if (error?.statusCode === 409 || /email/i.test(message)) {
      errForm.email = message
    }

    if (error?.statusCode === 403) {
      errForm.rol = message
    }

    mostrarToast(message, 'error')
  } finally {
    guardando.value = false
  }
}

async function abrirConfirmacion(usuario: UsuarioAdmin, tipo: keyof typeof acciones) {
  confirmacion.value = { usuario, tipo }
  errorAccion.value = ''
  await nextTick()
  dialogoAccion.value?.showModal()
}

function cerrarConfirmacion() {
  if (procesandoAccion.value) return
  dialogoAccion.value?.close()
  confirmacion.value = null
}

async function confirmarAccion() {
  if (!confirmacion.value || procesandoAccion.value) return
  const { usuario, tipo } = confirmacion.value
  const accion = acciones[tipo]
  procesandoAccion.value = true
  errorAccion.value = ''
  try {
    await accion.aplicar(Number(usuario.id))
    if (tipo === 'eliminar') {
      usuarios.value = usuarios.value.filter(item => item.id !== usuario.id)
      total.value = Math.max(0, total.value - 1)
      if (stats.value) stats.value.secretarias = total.value
      if (page.value > totalPages.value) page.value = totalPages.value
      else await fetchTabla()
    } else {
      const fila = usuarios.value.find(item => item.id === usuario.id)
      if (fila) fila.estado = tipo === 'activar' ? 'Activo' : 'Inactivo'
    }
    mostrarToast(accion.exito, 'exito')
  } catch (err: unknown) {
    errorAccion.value = (err as { message?: string })?.message ?? 'No se pudo actualizar la cuenta.'
    return
  } finally {
    procesandoAccion.value = false
  }
  cerrarConfirmacion()
}

function mostrarToast(mensaje: string, tipo: 'exito' | 'error') {
  toast.value = { mensaje, tipo }
  setTimeout(() => { toast.value = null }, 3500)
}

// ─── Computed ────────────────────────────────────────────────────────────────
const totalPages = computed(() => Math.max(1, Math.ceil(total.value / PER_PAGE)))

const rangoLabel = computed(() => {
  if (!total.value) return '0'
  const from = (page.value - 1) * PER_PAGE + 1
  const to   = Math.min(page.value * PER_PAGE, total.value)
  return `${from} - ${to}`
})

const pageButtons = computed(() => {
  const t = totalPages.value
  if (t <= 7) return Array.from({ length: t }, (_, i) => i + 1)
  const c = page.value
  if (c <= 3) return [1, 2, 3, '...', t]
  if (c >= t - 2) return [1, '...', t - 2, t - 1, t]
  return [1, '...', c - 1, c, c + 1, '...', t]
})

// ─── Helpers ─────────────────────────────────────────────────────────────────
function rolChip(rol: RolUsuario): string {
  const map: Record<RolUsuario, string> = {
    'Estudiante':    'bg-blue-50 text-blue-600',
    'Secretaria':    'bg-purple-50 text-purple-600',
    'Docente':       'bg-amber-50 text-amber-600',
    'Administrador': 'bg-slate-100 text-slate-600',
  }
  return map[rol] ?? 'bg-slate-100 text-slate-500'
}

function estadoColor(estado: EstadoUsuario): string {
  const map: Record<EstadoUsuario, string> = {
    'Activo':   'text-slate-700',
    'Inactivo': 'text-slate-400',
    'Suspension': 'text-red-600',
  }
  return map[estado] ?? 'text-slate-500'
}
</script>
