<script setup lang="ts">
import { useForm } from '../../packages/core/src/useForm'
const { register, formState: { errors }, useRegister, handleSubmit } = useForm({
  mode: 'onChange',
})

const onSubmit = (data: any) => console.log(data)
const onErrors = (err: any) => console.log(err)
</script>

<template>
  {{ errors }}

  <el-input
    v-bind="register('username', {
      required: { value: true, message: 'Username is required' },
    })"
  />
  <el-input
    v-bind="register('password', {
      required: { value: true, message: 'Password is required' },
      maxLength: { value: 10, message: 'Password is too long' },
    })"
  />
  <el-input
    v-bind="register('email', {
      required: { value: true, message: 'Email is required' },
      minLength: { value: 5, message: 'Email is too short' },
    })"
  />
  <el-input
    v-bind="register('startTime', {
      required: { value: true, message: 'Start time is required' },
      min: { value: new Date('2022'), message: 'Start time is too early' },
    })"
  />
  <input
    v-bind="register('endTime', {
      required: { value: true, message: 'End time is required' },
      max: { value: new Date('2023'), message: 'End time is too late' },
    })"
    style="width: 100vw"
  >
  <input
    v-bind="register('phone', {
      required: { value: true, message: 'Phone is required' },
      pattern: { value: /^1[3456789]\d{9}$/, message: 'Phone number is invalid' },
    })"
  >

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
