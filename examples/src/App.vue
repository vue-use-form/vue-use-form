<script setup lang="ts">
import { isReactive, ref, watchEffect } from 'vue'
import { useForm } from '../../packages/core/src/useForm'

interface Inputs {
  username: string
  password: string
}

const { register, formState: { errors }, useFiled } = useForm<Inputs>()

const inputValidate = useFiled('username', {
  required: { value: true, message: '用户名不能为空' },
})

</script>

<template>
  {{ errors }}
  <el-input
    v-bind="inputValidate()"
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
