<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import {
	Card,
	CardContent,
	CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
	FormControl,
	FormField,
	FormLabel,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { ErrorMessage, useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'

const authStore = useAuthStore()
const router = useRouter()

const formSchema = toTypedSchema(
	z.object({
		email: z.string().email(),
		password: z.string(),
	}),
)

const { handleSubmit, isFieldDirty } = useForm({
	validationSchema: formSchema,
})

const onSubmit = handleSubmit(async (values) => {
	try {
		await authStore.login(values.email, values.password)
		router.push('/')
	} catch (error) {
		console.error(error)
	}
})
</script>

<template>
	<form @submit="onSubmit">
		<Card class="grid grid-cols-1 gap-2">
			<CardContent class="grid grid-cols-1 gap-2">
				<FormField v-slot="{ componentField }" name="email" :validate-on-blur="!isFieldDirty">
					<FormLabel>Email</FormLabel>
					<FormControl>
						<Input type="email" v-bind="componentField" />
						<ErrorMessage name="email" class="text-red-600" />
					</FormControl>
				</FormField>
				<FormField v-slot="{ componentField }" name="password" :validate-on-blur="!isFieldDirty">
					<FormLabel>Password</FormLabel>
					<FormControl>
						<Input type="password" v-bind="componentField" />
						<ErrorMessage name="password" class="text-red-600" />
					</FormControl>
				</FormField>
			</CardContent>
			<CardFooter>
				<p v-if="authStore.error" class="text-red-600 font-bold">Couldn't login</p>
				<Button type="submit" class="cursor-pointer w-full">Login</Button>
			</CardFooter>
		</Card>
	</form>
</template>
