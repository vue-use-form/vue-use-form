<script setup lang="ts">
import { useForm } from '../../packages/core/src/index'

interface Inputs {
  username: string
}

const {
  formState,
  register,
  createSubmitHandler,
  createErrorHandler,
  handleSubmit,
} = useForm<Inputs>({
  mode: 'onSubmit',
})

const usernameField = register('username', {
  required: 'Username is required',
  validate: {
    isStartWithAt: async (val) => {
      const res = await new Promise((resolve) => {
        setTimeout(() => {
          resolve(val.startsWith('@') || 'Username should start with @')
        }, 1000)
      }) as boolean

      return res
    },
  },
})

const onSubmit = createSubmitHandler((data) => {
  console.log(data)
})

const onErrors = createErrorHandler((errors) => {
  console.log(errors)
})
</script>

<template>
  {{ formState }}
  <el-input v-model="usernameField" />
  <el-button type="primary" @click="handleSubmit(onSubmit, onErrors)()" v-text="'Submit'" />
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
