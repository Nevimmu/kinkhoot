<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { ProgressIndicator, ProgressRoot, type ProgressRootProps } from 'reka-ui'
import { cn } from '@/lib/utils'

const props = withDefaults(defineProps<ProgressRootProps & { class?: HTMLAttributes['class'], colorClass?: string }>(), {
  modelValue: 0,
})

const delegatedProps = reactiveOmit(props, 'class')
</script>

<template>
  <ProgressRoot
    data-slot="progress"
    v-bind="delegatedProps"
    :class="cn('relative h-2 w-full overflow-hidden rounded-full bg-secondary', props.class)"
  >
    <ProgressIndicator
      :class="cn('h-full w-full flex-1 transition-all', props.colorClass)"
      :style="`transform: translateX(-${100 - (props.modelValue ?? 0)}%);`"
    />
  </ProgressRoot>
</template>
