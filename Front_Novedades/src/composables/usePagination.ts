import { ref, computed } from 'vue'

/**
 * Composable para manejar paginación de forma reutilizable
 * 
 * @param fetchFn Función que obtiene datos para una página específica
 * @param defaultPerPage Cantidad de elementos por página (default: 5)
 * @returns Estado y funciones de paginación
 * 
 * @example
 * ```ts
 * const { page, items, loading, fetchPage } = usePagination(
 *   (p) => usuariosService.getUsuarios({ page: p }),
 *   10
 * )
 * 
 * onMounted(() => fetchPage())
 * ```
 */
export function usePagination<T>(
  fetchFn: (page: number) => Promise<{ data: T[]; total: number }>,
  defaultPerPage = 5,
) {
  const page = ref(1)
  const loading = ref(false)
  const items = ref<T[]>([])
  const total = ref(0)

  const perPage = defaultPerPage
  const totalPages = computed(() => Math.ceil(total.value / perPage))

  // Generar botones de paginación
  const pageButtons = computed(() => {
    const buttons: (number | string)[] = []
    const maxVisible = 5
    let start = Math.max(1, page.value - 2)
    const end = Math.min(totalPages.value, start + maxVisible - 1)

    // Ajustar inicio si estamos cerca del final
    start = Math.max(1, end - maxVisible + 1)

    if (start > 1) {
      buttons.push(1)
      if (start > 2) buttons.push('...')
    }

    for (let i = start; i <= end; i++) {
      buttons.push(i)
    }

    if (end < totalPages.value) {
      if (end < totalPages.value - 1) buttons.push('...')
      buttons.push(totalPages.value)
    }

    return buttons
  })

  /**
   * Obtiene datos de la página actual
   */
  async function fetchPage(pageNum?: number): Promise<void> {
    loading.value = true
    try {
      if (pageNum !== undefined) {
        page.value = pageNum
      }

      const result = await fetchFn(page.value)
      items.value = result.data
      total.value = result.total
    } finally {
      loading.value = false
    }
  }

  /**
   * Navega a una página específica
   */
  async function goToPage(pageNum: number): Promise<void> {
    if (pageNum >= 1 && pageNum <= totalPages.value) {
      await fetchPage(pageNum)
    }
  }

  /**
   * Navega a la página anterior
   */
  async function previousPage(): Promise<void> {
    if (page.value > 1) {
      await fetchPage(page.value - 1)
    }
  }

  /**
   * Navega a la página siguiente
   */
  async function nextPage(): Promise<void> {
    if (page.value < totalPages.value) {
      await fetchPage(page.value + 1)
    }
  }

  /**
   * Reinicia a la primera página
   */
  async function reset(): Promise<void> {
    page.value = 1
    await fetchPage()
  }

  return {
    page,
    items,
    loading,
    total,
    perPage,
    totalPages,
    pageButtons,
    fetchPage,
    goToPage,
    previousPage,
    nextPage,
    reset,
  }
}

export default usePagination
