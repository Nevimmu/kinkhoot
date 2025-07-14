import { ref } from 'vue'
import { defineStore } from 'pinia'
import PocketBase from 'pocketbase'

interface User {
	id: string
	email: string
	username?: string
}

export const useAuthStore = defineStore('auth', () => {
	const pb = new PocketBase()
	const user = ref<User | null>(null)
	const isAuthenticated = ref(false)
	const loading = ref(false)
	const error = ref<string | null>(null)

	async function init() {
		loading.value = true
		pb.autoCancellation(false)
		try {
			pb.authStore.clear()
			pb.authStore.loadFromCookie(document.cookie)

			if (pb.authStore.isValid) {
				await refreshUser()
			}
		} catch (err) {
			logout()
		} finally {
			loading.value = false
			pb.autoCancellation(true)
		}
	}

	async function login(email: string, password: string) {
		loading.value = true
		error.value = null

		try {
			const authData = await pb.collection('users').authWithPassword(email, password)
			user.value = authData.record as unknown as User
			isAuthenticated.value = true

			document.cookie = pb.authStore.exportToCookie({ httpOnly: false })
			// localStorage.setItem('token', pb.authStore.token)
		} catch (err) {
			error.value = (err as Error).message
			throw err
		} finally {
			loading.value = false
		}
	}
	// Register new user
	async function register(email: string, password: string, name?: string) {
		loading.value = true
		error.value = null

		try {
			const data = {
				email,
				password,
				passwordConfirm: password,
				name,
			}

			await pb.collection('users').create(data)
			await login(email, password)
		} catch (err) {
			error.value = (err as Error).message
			throw err
		} finally {
			loading.value = false
		}
	}

	// Logout
	function logout() {
		pb.authStore.clear()
		user.value = null
		isAuthenticated.value = false
		document.cookie = pb.authStore.exportToCookie({ httpOnly: false })
	}

	// Refresh user data
	async function refreshUser() {
		try {
			if (pb.authStore.record) {
				const record = await pb.collection('users').getOne(pb.authStore.record.id)
				user.value = record as unknown as User
				isAuthenticated.value = true
			}
		} catch (err) {
			logout()
		}
	}

	return {
		pb,
		user,
		isAuthenticated,
		loading,
		error,
		init,
		login,
		register,
		logout,
		refreshUser,
	}
})
