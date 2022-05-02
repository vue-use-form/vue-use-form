<script setup lang="ts">
import { useForm } from '../../packages/core/src/useForm'
import type { SubmitErrorHandler, SubmitHandler } from '../../packages/core/src/types/form'
const { register, formState: { errors }, useRegister, handleSubmit } = useForm({
  mode: 'onChange',
})

interface Inputs {
  username: string
}

const onSubmit: SubmitHandler<Inputs> = data => console.log(data)
const onError: SubmitErrorHandler<Inputs> = err => console.log(err)

function checkIsPositive(value: any) {
  console.log(value)
}
</script>

<template>

  <el-input
    v-bind="register('username', {
      required: { value: true, message: 'Username is required' },
      maxLength:{ value: 10, message: 'Username is too long' },
      minLength: { value: 3, message: 'Username is too short' },
      value: 'Jane'
    })"
  />

  <button type="submit" @click="handleSubmit(onSubmit, onErrors)()" v-text="'提交'" />
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
