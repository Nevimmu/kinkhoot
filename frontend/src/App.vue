<script setup lang="ts">
import { RouterView } from 'vue-router'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import AppSidebar from '@/components/sidebar/AppSidebar.vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
</script>

<template>
	<SidebarProvider>
		<AppSidebar v-if="authStore.isAuthenticated" />
		<SidebarInset>
			<RouterView />
		</SidebarInset>
	</SidebarProvider>
</template>

<style scoped></style>
