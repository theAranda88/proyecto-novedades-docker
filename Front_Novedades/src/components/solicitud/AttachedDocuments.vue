<template>
  <section class="bg-white border border-slate-200 rounded-xl p-6">
    <div class="flex items-center gap-2 mb-4">
      <div class="bg-slate-100 p-2 rounded-md flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
        </svg>
      </div>
      <div>
        <h2 class="text-sm font-bold text-slate-700">Documentos Adjuntos</h2>
        <p class="text-xs text-slate-400">Suba los soportes que validen su justificación (ej. certificados laborales, médicos, o cruce de horarios).</p>
      </div>
    </div>

    <!-- Zona drag & drop -->
    <div class="border-t border-slate-100 pt-4">
      <div
        class="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center cursor-pointer
               hover:border-blue-300 hover:bg-blue-50 transition-all"
        @click="triggerFileInput"
        @dragover.prevent
        @drop.prevent="handleDrop"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-slate-300 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
        </svg>
        <p class="text-sm font-medium text-slate-500">Haga clic o arrastre archivos aquí</p>
        <p class="text-xs text-slate-400 mt-1">PDF, JPG o PNG (Máx. 5MB por archivo)</p>
        <input ref="fileInputRef" type="file" class="hidden" multiple accept=".pdf,.jpg,.png" @change="handleFileChange"/>
      </div>
    </div>

    <!-- Lista de archivos -->
    <ul v-if="archivos.length" class="mt-3 space-y-2">
      <li
        v-for="(archivo, i) in archivos"
        :key="i"
        class="flex items-center justify-between px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg"
      >
        <div class="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-blue-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"/>
          </svg>
          <div>
            <p class="text-xs font-medium text-slate-700">{{ archivo.name }}</p>
            <p class="text-[10px] text-slate-400">{{ (archivo.size / 1024 / 1024).toFixed(1) }} MB</p>
          </div>
        </div>
        <button class="text-xs text-red-500 hover:text-red-700 font-medium transition-colors" @click="eliminarArchivo(i)">
          Eliminar
        </button>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{ modelValue: File[] }>()
const emit = defineEmits<{ (e: 'update:modelValue', value: File[]): void }>()

const fileInputRef = ref<HTMLInputElement | null>(null)
const archivos = ref<File[]>(props.modelValue)

// Sincronizar cambios del padre
watch(() => props.modelValue, (newVal) => {
  archivos.value = newVal
})

// Emitir cambios al padre
watch(archivos, (newVal) => {
  emit('update:modelValue', newVal)
}, { deep: true })

function triggerFileInput() {
  fileInputRef.value?.click()
}

function handleFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  if (input.files) agregarArchivos(Array.from(input.files))
}

function handleDrop(e: DragEvent) {
  if (e.dataTransfer?.files) agregarArchivos(Array.from(e.dataTransfer.files))
}

function agregarArchivos(nuevos: File[]) {
  const validos = nuevos.filter(f =>
    f.size <= 5 * 1024 * 1024 && !archivos.value.find(a => a.name === f.name)
  )
  archivos.value.push(...validos)
}

function eliminarArchivo(index: number) {
  archivos.value.splice(index, 1)
}
</script>