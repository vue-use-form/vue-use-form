<script lang="ts" setup>

import { computed, isReactive, watch, watchEffect } from 'vue'
import { useFieldArray, useForm } from '../../../../packages/core/src'

interface Inputs {
  username: string
}

const { control, register, formState } = useForm<Inputs>()

const { fields, registeredFields, append, prepend, remove } = useFieldArray<Inputs>({
  control: control as any,
})

const fieldsMap = computed(() => {
  return fields.map(field => register(field.name))
})

const addField = () => {
  append({
    username: {
      required: 'Username is required',
    },
  })
}
</script>
<template>
  <q-form class="w-[50vw] mx-auto flex justify-center flex-col">
    {{ registeredFields }} {{ fields }}
    <q-btn class="mt-5" label="addField" color="primary" @click="addField" />
  </q-form>
</template>

<style lang="scss" scoped>

</style>
