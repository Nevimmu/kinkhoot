import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export async function authGuard(
	to: RouteLocationNormalized,
	from: RouteLocationNormalized,
	next: NavigationGuardNext,
) {
	const authStore = useAuthStore()

	await authStore.init()

	if (to.meta.requiresAuth && !authStore.isAuthenticated) {
		next('/auth')
	} else if (to.meta.requiresGuest && authStore.isAuthenticated) {
		next('/')
	} else {
		next()
	}
}
