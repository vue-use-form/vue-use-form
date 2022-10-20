export const AppCode = `<script setup>
import {createErrorHandler, createSubmitHandler, useForm } from 'vue-use-form'

const { 
  register, 
  formState: { errors },
  isExistInErrors,
  handleSubmit,
} = useForm({
  mode: 'onChange'
})

const onSubmit = createSubmitHandler((data) => {
  alert('submit success')
})

const onError = createErrorHandler((errors) => {
  alert('submit failed')
} )
</script>
<template>
  {{ errors }}
  <form @submit.prevent="handleSubmit(onSubmit, onError)()">
    name: <input :="register('name', { required: true })"/>
    <button type="submit">submit</button>
  </form>
</template>
`
