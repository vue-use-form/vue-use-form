<script setup lang="ts">
import { ref } from 'vue'
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
  shouldFocusError: false,
})

unregister('username')

const onSubmit = createSubmitHandler((data) => {
  console.log(data)
})

const onError = createErrorHandler((errors) => {
  console.log(errors)
})

function renderTime() {
  console.log(1)
}
</script>

<template>
  <input
    :="register('username', {
      required: true,
    })"
  >
  <el-input
    :="register('password', {
      required: { value: true,message: '请输入密码' },
      pattern: { value:/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/, message:'密码格式错误' },
      validate:{
        isStartWithAt: (value) => value.startsWith('@'),
        isEndWithDollar: (value) => value.endsWith('$'),
      }
    })"
  >
    <button type="submit" @click="handleSubmit(onSubmit, onError)()" v-text="'提交'" />
  </el-input>
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
