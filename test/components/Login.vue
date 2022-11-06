<script lang="ts" setup>
import { useForm } from 'vue-use-form'

interface Inputs {
  username: string
  password: string
}

const { formState, register } = useForm<Inputs>()
</script>

<template>
  <input :value="formState">
  <input
    :="register('username', {
  required: true,
  maxLength: 10,
})"
  >
</template>
