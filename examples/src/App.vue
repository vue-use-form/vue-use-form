<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { useForm } from '../../packages/core/src/useForm'

interface Inputs {
  username: string
  password: string
}

const { register } = useForm<Inputs>()

const txt = ref('')
const radio = ref()
</script>

<template>
  <el-input
    :="register('username', {
    required: { value: true, message: '用户名不能为空' },
  })"
  />
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
