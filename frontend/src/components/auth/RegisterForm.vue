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
	z
		.object({
			email: z.string().email(),
			username: z.string().min(3),
			password: z.string().min(8),
			confirm: z.string().min(8),
		})
		.refine((data) => data.password === data.confirm, {
			message: "Password don't match",
			path: ['confirm'],
		}),
)

const { handleSubmit, isFieldDirty } = useForm({
	validationSchema: formSchema,
})

const onSubmit = handleSubmit(async (values) => {
	try {
		await authStore.register(values.email, values.password, values.username)
		router.push('/')
	} catch (error) {
		console.error(error)
	}
})
</script>

<template>
	<form @submit.prevent="onSubmit">
		<Card class="grid grid-cols-1 gap-2">
			<CardContent class="grid grid-cols-1 gap-2">
				<FormField v-slot="{ componentField }" name="email" :validate-on-blur="!isFieldDirty">
					<FormLabel>Email</FormLabel>
					<FormControl>
						<Input type="email" v-bind="componentField" />
						<ErrorMessage name="email" class="text-red-600" />
					</FormControl>
				</FormField>
				<FormField v-slot="{ componentField }" name="username" :validate-on-blur="!isFieldDirty">
					<FormLabel>Username</FormLabel>
					<FormControl>
						<Input type="text" v-bind="componentField" />
						<ErrorMessage name="username" class="text-red-600" />
					</FormControl>
				</FormField>
				<FormField v-slot="{ componentField }" name="password" :validate-on-blur="!isFieldDirty">
					<FormLabel>Password</FormLabel>
					<FormControl>
						<Input type="password" v-bind="componentField" />
						<ErrorMessage name="password" class="text-red-600" />
					</FormControl>
				</FormField>
				<FormField v-slot="{ componentField }" name="confirm" :validate-on-blur="!isFieldDirty">
					<FormLabel>Confirm password</FormLabel>
					<FormControl>
						<Input type="password" v-bind="componentField" />
						<ErrorMessage name="confirm" class="text-red-600" />
					</FormControl>
				</FormField>
			</CardContent>
			<CardFooter>
				<Button type="submit" class="cursor-pointer w-full">Register</Button>
			</CardFooter>
		</Card>
	</form>
</template>
