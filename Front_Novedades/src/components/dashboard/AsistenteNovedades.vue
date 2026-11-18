<script setup lang="ts">
import { nextTick, ref } from 'vue'
import { preguntasFrecuentes, responderConsulta } from '../../services/asistenteService'
import type { RespuestaAsistente } from '../../services/asistenteService'

interface Mensaje extends RespuestaAsistente {
  autor: 'asistente' | 'estudiante'
}

const abierto = ref(false)
const consultando = ref(false)
const mensaje = ref('')
const boton = ref<HTMLButtonElement | null>(null)
const panel = ref<HTMLElement | null>(null)
const registro = ref<HTMLElement | null>(null)
const mensajes = ref<Mensaje[]>([
  { autor: 'asistente', texto: '¡Hola! ¿En qué te puedo ayudar con tus solicitudes académicas?' },
])

async function abrir() {
  abierto.value = true
  await nextTick()
  panel.value?.focus()
  desplazarRegistro()
}

async function cerrar() {
  abierto.value = false
  await nextTick()
  boton.value?.focus()
}

function desplazarRegistro() {
  if (registro.value) registro.value.scrollTop = registro.value.scrollHeight
}

async function enviar(pregunta: string) {
  const texto = pregunta.trim()
  if (!texto || consultando.value) return

  mensaje.value = ''
  mensajes.value.push({ autor: 'estudiante', texto })
  consultando.value = true
  await nextTick()
  desplazarRegistro()

  const respuesta = await responderConsulta(texto)
  mensajes.value.push({ autor: 'asistente', ...respuesta })
  consultando.value = false
  await nextTick()
  desplazarRegistro()
}
</script>

<template>
  <Teleport to="body">
    <div class="asistente fixed z-[70]">
      <section
        v-if="abierto"
        id="asistente-novedades"
        ref="panel"
        tabindex="-1"
        aria-labelledby="asistente-titulo"
        class="panel flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
        @keydown.esc.stop="cerrar"
      >
        <header class="flex shrink-0 items-center justify-between gap-3 bg-[#163251] px-4 py-3 text-white sm:px-5">
          <div>
            <h2 id="asistente-titulo" class="text-base font-bold text-white!">Asistente de Novedades</h2>
            <p class="mt-0.5 text-xs text-[#c4d5e8]">Ayuda con tus trámites académicos</p>
          </div>
          <button type="button" aria-label="Cerrar asistente" class="grid size-11 shrink-0 place-items-center rounded-lg hover:bg-white/15" @click="cerrar">
            <span aria-hidden="true" class="text-2xl leading-none">×</span>
          </button>
        </header>

        <div ref="registro" role="log" aria-label="Conversación" class="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain bg-[#f5f7fb] p-4">
          <div
            v-for="(item, indice) in mensajes"
            :key="indice"
            class="burbuja w-fit max-w-[92%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed"
            :class="item.autor === 'estudiante' ? 'ml-auto rounded-br-sm bg-[#163251] text-white' : 'rounded-bl-sm border border-slate-200 bg-white text-slate-700'"
          >
            <span class="sr-only">{{ item.autor === 'estudiante' ? 'Tú: ' : 'Asistente: ' }}</span>
            <p>{{ item.texto }}</p>
            <RouterLink
              v-if="item.enlace"
              :to="item.enlace.destino"
              class="mt-1 inline-block font-semibold text-blue-600 underline underline-offset-2"
              @click="cerrar"
            >{{ item.enlace.texto }}</RouterLink>
          </div>
          <Cargando v-if="consultando" inline texto="Consultando…" />
        </div>

        <div class="flex shrink-0 gap-2 overflow-x-auto border-y border-slate-200 px-3 py-2" aria-label="Preguntas sugeridas">
          <button
            v-for="pregunta in preguntasFrecuentes"
            :key="pregunta"
            type="button"
            :disabled="consultando"
            class="shrink-0 rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-50 disabled:opacity-50"
            @click="enviar(pregunta)"
          >{{ pregunta }}</button>
        </div>

        <form class="flex shrink-0 gap-2 p-3" @submit.prevent="enviar(mensaje)">
          <label for="asistente-mensaje" class="sr-only">Tu mensaje</label>
          <input
            id="asistente-mensaje"
            v-model="mensaje"
            type="text"
            maxlength="400"
            autocomplete="off"
            placeholder="Escribe tu pregunta…"
            class="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
          />
          <button
            type="submit"
            :disabled="!mensaje.trim() || consultando"
            class="rounded-lg bg-blue-600 px-3.5 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >Enviar</button>
        </form>
      </section>

      <button
        v-else
        ref="boton"
        type="button"
        aria-label="Abrir asistente de novedades"
        class="flex items-center gap-2 rounded-full bg-[#163251] px-4 py-3 text-sm font-semibold text-white shadow-lg hover:bg-[#244971]"
        @click="abrir"
      >
        <span class="chat-icon" aria-hidden="true"></span>
        Asistente
      </button>
    </div>
  </Teleport>
</template>

<style scoped>
.asistente {
  right: max(1rem, env(safe-area-inset-right));
  bottom: max(1rem, env(safe-area-inset-bottom));
}

.panel {
  width: min(25rem, calc(100vw - 2rem));
  height: min(34rem, calc(100dvh - 2rem));
}

.burbuja {
  overflow-wrap: anywhere;
}

.chat-icon {
  position: relative;
  width: 1.15rem;
  height: .9rem;
  border: 1.5px solid currentColor;
  border-radius: .3rem;
}

.chat-icon::after {
  position: absolute;
  bottom: -.23rem;
  left: .12rem;
  width: .3rem;
  height: .3rem;
  border-left: 1.5px solid currentColor;
  transform: skewY(-35deg);
  content: '';
}
</style>
