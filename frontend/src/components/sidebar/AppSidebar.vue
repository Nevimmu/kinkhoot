<script setup lang="ts">
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarFooter,
	SidebarHeader,
	SidebarGroupLabel,
	SidebarGroupContent,
	SidebarMenu,
	SidebarMenuItem,
	SidebarMenuButton,
} from '@/components/ui/sidebar'
import { House, Info } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const link = {
	navMain: [
		{
			title: 'Main',
			items: [
				{ title: 'Home', icon: House, url: '/' },
				{ title: 'About', icon: Info, url: '/about' },
			],
		},
	],
}

function handleLogout() {
	authStore.logout()
	router.push('/auth')
}
</script>

<template>
	<Sidebar collapsible="icon">
		<SidebarHeader class="group-data-[collapsible=icon]:hidden">My app</SidebarHeader>
		<SidebarContent>
			<SidebarGroup v-for="item in link.navMain" :key="item.title">
				<SidebarGroupLabel>{{ item.title }}</SidebarGroupLabel>
				<SidebarGroupContent>
					<SidebarMenu>
						<SidebarMenuItem v-for="link in item.items" :key="link.title">
							<RouterLink :to="link.url" v-slot="{ isActive }">
								<SidebarMenuButton :is-active="isActive" class="cursor-pointer">
									<component :is="link.icon" v-if="link.icon"/>
									{{ link.title }}
								</SidebarMenuButton>
							</RouterLink>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarGroupContent>
			</SidebarGroup>
		</SidebarContent>
		<SidebarFooter class="group-data-[collapsible=icon]:hidden">
			<SidebarMenu>
				<SidebarMenuItem>
					<Button
						variant="ghost"
						@click="handleLogout"
						class="w-full text-red-400 hover:text-red-600"
						>Logout</Button
					>
				</SidebarMenuItem>
			</SidebarMenu>
		</SidebarFooter>
	</Sidebar>
</template>
