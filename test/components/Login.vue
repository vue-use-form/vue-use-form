<script lang="ts" setup>
import { useForm } from 'vue-use-form'

interface Inputs {
  username: string
  password: string
}

const { formState, register } = useForm<Inputs>()

const [usernameField] = register('username', {
  required: true,
  maxLength: 10,
})
</script>

<template>
  <input :value="formState">
  <input v-model="usernameField">
</template>
