import { createRouter, createWebHistory, type NavigationGuardNext, type RouteLocationNormalized } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import HostView from '@/views/HostView.vue'
import PlayerView from '@/views/PlayerView.vue'
import { useGameStore } from '@/stores/game'
import { useNotificationStore } from '@/stores/notification'

const validateGameCode = async (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
	const gameStore = useGameStore()
	const notificationStore = useNotificationStore()
	const gameCode = to.params.gameCode as string

	if (!(await gameStore.checkGameCode(gameCode))) {
		notificationStore.setNotification("Invalid game code or game doesn't exist.")
		return next({ name: 'home' })
	}

	return next()
}

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			name: 'home',
			component: HomeView,
			meta: {
				title: 'Home',
			},
		},
		{
			path: '/host/:gameCode',
			name: 'host',
			component: HostView,
			meta: {
				title: 'Host',
			},
			beforeEnter: validateGameCode,
		},
		{
			path: '/player/:gameCode',
			name: 'player',
			component: PlayerView,
			meta: {
				title: 'Player',
			},
			beforeEnter: validateGameCode,
		},
	],
})

router.beforeEach((to, from) => {
	document.title = `${to.meta.title}`
})

export default router