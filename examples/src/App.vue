<script setup lang="ts">
import { useForm } from '../../packages/core/src/useForm'

interface Inputs {
  username: string
  password: string
}

const {
  register,
  formState: { errors },
  useRegister,
  unregister,
  useArrayRegister,
  handleSubmit,
  createErrorHandler,
  createSubmitHandler,
} = useForm<Inputs>({
  mode: 'onChange',
  shouldFocusError: true,
})

const validate = useArrayRegister([
  { name: 'username', options: { required: 'user name cannot be empty!' } },
  { name: 'password', options: { required: 'password cannot be empty!' } },
])

unregister('username')

const onSubmit = createSubmitHandler((data) => {
  // eslint-disable-next-line no-console
  console.log(data)
})

const onError = createErrorHandler((errors) => {
  // eslint-disable-next-line no-console
  console.log(errors)
})

</script>

<template>
  {{ errors }}
  <el-input
    :="validate().username"
  />
  <el-input
    :="validate().password"
  />

  <button type="submit" @click="handleSubmit(onSubmit, onError)()" v-text="'提交'" />
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
