<script setup lang="ts">
import { computed, nextTick, onMounted, watch, watchEffect } from 'vue'
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
  setError,
  clearErrors,
  setValue,
  setFocus,
  getValues,
  triggerValidate,
  getFieldState,
  unregister,
} = useForm<Inputs>({
  mode: 'onChange',
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

function addError() {
  setError('username', { type: 'validate', message: 'Username is required' })
}

function clearFieldError() {
  clearErrors()
}

// setFocus
onMounted(() => {
  setFocus('username')
})

function handleFocus() {
  setFocus('username')
}

function handleGetValues() {
  console.log(getValues('username'))
}

function handleTrigger() {
  triggerValidate('username')
}

function handleGetFieldState() {
  console.log(getFieldState('username'))
}

function handleUnregister() {
  unregister('username')
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
  <el-button type="primary" @click="addError" v-text="'setError'" />
  <el-button type="primary" @click="clearFieldError" v-text="'clearError'" />
  <el-button type="primary" @click="handleFocus" v-text="'setFocus'" />
  <el-button type="primary" @click="handleGetValues" v-text="'getValues'" />
  <el-button type="primary" @click="handleTrigger" v-text="'trigger'" />
  <el-button type="primary" @click="handleGetFieldState" v-text="'getFieldState'" />
  <el-button type="primary" @click="handleUnregister" v-text="'unRegister'" />
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
