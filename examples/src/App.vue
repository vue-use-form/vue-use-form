<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { useForm } from '../../packages/core/src/useForm'

interface Inputs {
  username: string
  password: string
}

const { register } = useForm<Inputs>()

const txt = ref('')

function test() {
  console.log('1')
}
</script>

<template>
  <el-input :="register('username', {})" />
  <input :="register('password', {})">
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
