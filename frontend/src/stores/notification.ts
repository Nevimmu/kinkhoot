import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useNotificationStore = defineStore('notification', () => {
	const message = ref<string | null>(null)

	const setNotification = (msg: string) => {
		message.value = msg
	}

	const clearNotification = () => {
		message.value = null
	}

	return {
		message,
		setNotification,
		clearNotification,
	}
})
