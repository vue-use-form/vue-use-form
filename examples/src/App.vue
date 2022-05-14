<script setup lang="ts">
import { onMounted, reactive, ref, watchEffect } from 'vue'
import { useForm } from '../../packages/core/src'
import type { FieldElement } from '../../packages/core/src/types/filed'

interface Inputs {
  username: string
  password: string
}

const {
  formState,
  createSubmitHandler,
  createErrorHandler,
  handleSubmit,
  register,
  reset,
  getValues,
  useField,
} = useForm<Inputs>({
  mode: 'onChange',
})

const passwordRef = ref<FieldElement>({} as any)
const password = useField('password', {
  ref: passwordRef,
  required: true,
})

const onSubmit = createSubmitHandler((data) => {
  console.log(data)
})

const onError = createErrorHandler((error) => {
  console.log(error)
})

function handleCancel() {
  reset('all', {
    keepDirty: true,
  })
}

</script>

<template>
  <div>
    <ul>
      <li v-for="(val, key) in formState">
        {{ key }}:{{ val }}
      </li>
    </ul>
  </div>
  <el-form label-width="120px">
    <el-input
      :="register('username', {
      required: 'Username is required',
    })"
    />
    <el-input ref="passwordRef" v-model="password" />
    <el-button type="primary" @click="handleSubmit(onSubmit, onError)()">
      Create
    </el-button>
    <el-button @click="handleCancel">
      Cancel
    </el-button>
  </el-form>
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
