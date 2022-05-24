<script setup lang="ts">
import { computed, watch, watchEffect } from 'vue'
import { useForm } from '../../packages/core/src/index'

interface Inputs {
  username: string
  password: string
  showEmail: boolean
  email: string
}

const {
  formState,
  register,
  createSubmitHandler,
  createErrorHandler,
  reset,
  handleSubmit,
} = useForm<Inputs>({
  mode: 'onSubmit',
  shouldFocusError: true,
})

const [usernameField, elRef] = register('username', {
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

const [showEmailField, showEmailRef] = register('showEmail', {
  required: 'Please check the checkbox',
})

const [emailField, emailRef] = register('email', {
  required: 'Email is required',
})

const onSubmit = createSubmitHandler((data) => {
  console.log(data)
})

const onErrors = createErrorHandler((errors) => {
  console.log(errors)
})

function resetField() {
  reset({
    username: '114514',
  }, {
    keepIsSubmitted: false,
    keepSubmitCount: false,
    keepErrors: false,
    keepDirty: true,
  })
}

</script>

<template>
  <pre>
    <code>
      {{ formState }}
    </code>
    {{ emailField }}
  </pre>

  <el-switch ref="showEmailRef" v-model="showEmailField" />
  <el-input ref="elRef" v-model="usernameField" />
  <template v-if="showEmailField">
    <el-input ref="emailRef" v-model="emailField" />
  </template>
  <el-button type="primary" @click="handleSubmit(onSubmit, onErrors)()" v-text="'Submit'" />
  <el-button type="primary" @click="resetField" v-text="'resetField'" />
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
