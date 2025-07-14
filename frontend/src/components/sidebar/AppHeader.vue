<script setup lang="ts">
import Separator from '@/components/ui/separator/Separator.vue'
import { SidebarTrigger } from '@/components/ui/sidebar'

defineProps({
	title: {
		type: String,
		required: true,
	},
})
</script>

<template>
	<header class="flex h-8 shrink-0 items-center gap-2">
		<SidebarTrigger />
		<Separator orientation="vertical" class="mr-2" />
		<p>{{ title }}</p>
	</header>
</template>
