<script lang="ts" setup>

import { computed, isReactive, ref, watch, watchEffect } from 'vue'
import { useFieldArray, useForm } from '../../../../packages/core/src'

interface Inputs {
  username: string
  password: string
  email: string
}

const { control, register, formState: { errors } } = useForm<Inputs>({
  mode: 'onChange',
})

const { fields, append, prepend, remove } = useFieldArray<Inputs>({
  control: control as any,
})

const fieldName = ref<keyof Inputs>('' as keyof Inputs)

function appendFirst() {
  append({
    username: {
      required: 'Username is required',
    },
    password: {
      required: 'Password is required',
      type: 'password',
    },
  })
}

function prependForm() {
  prepend({
    email: {
      required: 'Email is required',
      type: 'email',
    },
  })
}
</script>
<template>
  <q-form class="w-[50vw] mx-auto flex justify-center flex-col">
    {{ fields }}
    <q-input
      v-for="field in fields"
      :key="field.name"
      :="field"
      filled
      lazy-rules
      :type="field.type"
      :label="`Your ${field.name} *`"
    />
    <q-btn class="mt-5" label="appendFirst" color="primary" @click="appendFirst" />
    <q-btn class="mt-5" label="prepend" color="primary" @click="prependForm" />
    {{ errors }}
  </q-form>
</template>

<style lang="scss" scoped>

</style>
