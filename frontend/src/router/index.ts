import { createRouter, createWebHistory } from 'vue-router'
import { authGuard } from './authGuard'
import HomeView from '@/views/HomeView.vue'
import AboutView from '@/views/AboutView.vue'
import AuthView from '@/views/AuthView.vue'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			name: 'home',
			component: HomeView,
			meta: { 
				requiresAuth: true,
				title: 'Home'
			},
		},
		{
			path: '/auth',
			name: 'Auth',
			component: AuthView,
			meta: { 
				requiresGuest: true,
				title: 'Auth'
			},
		},
		{
			path: '/about',
			name: 'about',
			component: AboutView,
			meta: { 
				requiresAuth: true,
				title: 'About'
			},
		},
	],
})

router.beforeEach(authGuard)
router.beforeEach((to, from) => {
	document.title = `${to.meta.title}`
})

export default router
