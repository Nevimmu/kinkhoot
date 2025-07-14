import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSidebarStore = defineStore('sidebar', () => {
	const isOpen = ref(false)

	function toggle() {
		isOpen.value = !isOpen.value
	}

	function close() {
		if (isOpen.value == true) {
			isOpen.value = false
		}
	}

	return { isOpen, toggle, close }
})
