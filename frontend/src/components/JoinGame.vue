<script setup lang="ts">
import { ref } from 'vue'
import { useGameStore } from '@/stores/game'
import { usePlayerStore } from '@/stores/player'
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PinInput, PinInputGroup, PinInputSlot } from '@/components/ui/pin-input'
import { ErrorMessage, useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { Loader2 } from 'lucide-vue-next'

const router = useRouter()
const gameStore = useGameStore()
const playerStore = usePlayerStore()
const disableJoin = ref(false)

const formSchema = toTypedSchema(
	z.object({
		pin: z.array(z.coerce.string()).length(6, 'Pin must be 6 characters'),
		username: z.string().min(2, 'Username must be at least 2 characters'),
		url: z
			.string()
			.url({ message: 'Invalid URL' })
			.includes('https://bdsmtest.org/r/', { message: 'URL must be from bdsmtest.org' }),
	}),
)

const { handleSubmit, setFieldValue, meta, setFieldError } = useForm({
	validationSchema: formSchema,
})

const onSubmit = handleSubmit(async (values) => {
	disableJoin.value = true
	try {
		const code = values.pin.join('').toUpperCase()
		const isPinValid = await gameStore.checkGameCode(code)
		if (!isPinValid) {
			setFieldError('pin', 'Game not found or has already started.')
			return
		}

		const isNameValid = await playerStore.checkPlayerName(values.username, code)
		if (isNameValid) {
			setFieldError('username', 'Name is already chosen')
			return
		}

		await playerStore.joinGame(values.username, values.url, code)

		router.push(`/player/${code}`)
	} catch (error) {
		console.error(error)
	} finally {
		disableJoin.value = false
	}
})
</script>

<template>
	<form @submit="onSubmit" class="grid gap-2">
		<FormField v-slot="{ componentField }" name="username">
			<FormItem>
				<FormLabel>Username</FormLabel>
				<FormControl>
					<Input type="text" v-bind="componentField" />
					<ErrorMessage name="username" class="text-red-600" />
				</FormControl>
			</FormItem>
		</FormField>
		<FormField v-slot="{ componentField }" name="url">
			<FormItem>
				<FormLabel>BDSMtest url</FormLabel>
				<FormControl>
					<Input type="url" v-bind="componentField" />
					<ErrorMessage name="url" class="text-red-600" />
				</FormControl>
			</FormItem>
		</FormField>
		<FormField v-slot="{ componentField, value }" name="pin">
			<FormItem>
				<FormLabel>Game ID</FormLabel>
				<FormControl>
					<PinInput
						id="pin-input"
						otp
						:model-value="value"
						:name="componentField.name"
						placeholder="○"
						@update:model-value="
							(arrStr) => {
								setFieldValue('pin', arrStr)
							}
						"
					>
						<PinInputGroup>
							<PinInputSlot v-for="(id, index) in 6" :key="id" :index="index" class="uppercase" />
						</PinInputGroup>
					</PinInput>
					<ErrorMessage name="pin" class="text-red-600" />
				</FormControl>
			</FormItem>
		</FormField>
		<Button class="w-full" :disabled="disableJoin || !meta.valid">
			<Loader2 v-if="disableJoin" class="mr-2 animate-spin" />
			<span v-if="!disableJoin">Join</span>
		</Button>
	</form>
</template>
