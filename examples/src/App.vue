<script setup lang="ts">

import { useForm } from '../../packages/core/src/useForm'

interface Inputs {
  test: string
  username: number
  password: string
}

const {
  register,
  formState,
  useRegister,
  unregister,
  handleSubmit,
  createErrorHandler,
  createSubmitHandler,
} = useForm<Inputs>({
  mode: 'onSubmit',
  shouldFocusError: false,
  defaultValues: {
    username: 114514,
  },
})

const onSubmit = createSubmitHandler(async (data) => {
  await setTimeout(() => {
    console.log(data)
  }, 2000)
  console.log('timeouted')
})

const onError = createErrorHandler(async (data) => {
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve(1)
    }, 2000)
  })
})

const handleUnregister = () => {
  unregister('username')
}

async function api() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(1)
    }, 3000)
  })
}
</script>

<template>
  <p v-for="(item, name) in formState">
    {{ name }} : {{ item }}
  </p>
  <el-input
    :="register('test', {
      required: { value: true, message: '请输入密码' },
      validate: async (value) => {
        await api()
      }
    })"
  />

  <el-button type="primary" @click="handleSubmit(onSubmit, onError)()" v-text="'提交'" />
  <el-button @click="handleUnregister" v-text="'delete filed'" />
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
