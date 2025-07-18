import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import HostView from '@/views/HostView.vue'
import PlayerView from '@/views/PlayerView.vue'

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
		},
		{
			path: '/player/:gameCode',
			name: 'player',
			component: PlayerView,
			meta: {
				title: 'Player',
			},
		},
	],
})

router.beforeEach((to, from) => {
	document.title = `${to.meta.title}`
})

export default router
