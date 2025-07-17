<script setup lang="ts">
import { ref } from 'vue'
import { useGameStore } from '@/stores/game'
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
const disableJoin = ref(false)

const formSchema = toTypedSchema(
	z.object({
		pin: z.array(z.coerce.string()).length(6).refine(async (pin: string[]) => {
			const isValid = await gameStore.checkGameCode(pin.join(''))
			return isValid
		}),
		username: z.string(),
		url: z.string().url({message: 'Invalid URL'}).includes('https://bdsmtest.org/r/'),
	}),
)

const { handleSubmit, isFieldDirty, setFieldValue, meta } = useForm({
	validationSchema: formSchema,
})

const onSubmit = handleSubmit(async (values) => {
	disableJoin.value = true
	try {
		let code = values.pin.join('')
		await gameStore.joinGame(values.username, values.url, code)

		// TODO: save player data to local storage
		router.push(`/player/${code}`)
	} catch (error) {
		console.error(error)
	}
	disableJoin.value = false
})
</script>

<template>
	<form @submit="onSubmit" class="grid gap-2">
		<FormField v-slot="{ componentField }" name="username" :validate-on-blur="!isFieldDirty">
			<FormItem>
				<FormLabel>Username</FormLabel>
				<FormControl>
					<Input type="text" v-bind="componentField" />
					<ErrorMessage name="username" class="text-red-600" />
				</FormControl>
			</FormItem>
		</FormField>
		<FormField v-slot="{ componentField }" name="url" :validate-on-blur="!isFieldDirty">
			<FormItem>
				<FormLabel>BDSMtest url</FormLabel>
				<FormControl>
					<Input type="url" v-bind="componentField" />
					<ErrorMessage name="url" class="text-red-600" />
				</FormControl>
			</FormItem>
		</FormField>
		<FormField v-slot="{ componentField, value }" name="pin" :validate-on-blur="!isFieldDirty" -->
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
							<PinInputSlot v-for="(id, index) in 6" :key="id" :index="index" />
						</PinInputGroup>
					</PinInput>
					<ErrorMessage name="gameID" class="text-red-600" />
				</FormControl>
			</FormItem>
		</FormField>
		<Button class="w-full" :disabled="disableJoin || !meta.valid">
			<Loader2 v-if="disableJoin" class="mr-2 animate-spin"/>
			Join
		</Button>
	</form>
</template>
