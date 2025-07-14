<script setup lang="ts">
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import LoginForm from '@/components/auth/LoginForm.vue'
import RegisterForm from '@/components/auth/RegisterForm.vue'
</script>

<template>
	<div class="flex flex-col h-screen w-full items-center justify-center">
		<Tabs default-value="login">
			<TabsList class="grid w-full grid-cols-2 *:hover:cursor-pointer">
				<TabsTrigger value="login"> Login </TabsTrigger>
				<TabsTrigger value="register"> Register </TabsTrigger>
			</TabsList>
			<TabsContent value="login">
				<LoginForm />
			</TabsContent>
			<TabsContent value="register">
				<RegisterForm />
			</TabsContent>
		</Tabs>
	</div>
</template>
