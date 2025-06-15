import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLayoutStore = defineStore('layout', () => {
  const title = ref('Título por defecto')

  function setTitle(newTitle) {
    title.value = newTitle
  }

  return { title, setTitle }
})
