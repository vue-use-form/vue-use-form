<script lang="ts" setup>
import { useValidator } from './use-validator'

const {
  register,
  handleSubmit,
  errors,
  onError,
  onSubmit,
  isExistInErrors,
  onLogin,
  formValidation,
} = useValidator()

const [usernameField] = register('username')
const [passwordField] = register('password')
const [emailField] = register('email')

</script>

<template>
  {{ errors }}
  <div class="w-[400px]">
    <q-form
      class="q-gutter-md"
      @submit.prevent="handleSubmit(onLogin, onError)()"
    >
      <q-input
        v-model="usernameField"
        filled
        label="Your name *"
        hint="Name and surname"
        lazy-rules
        :error="isExistInErrors('username')"
        :error-message="errors.username?.message"
      />

      <q-input
        v-model="passwordField"
        filled
        lazy-rules
        type="password"
        label="Your password *"
        :error="isExistInErrors('password')"
        :error-message="errors.password?.message"
      />

      <q-input
        v-model="emailField"
        filled
        type="email"
        label="Your email *"
        lazy-rules
        :error="isExistInErrors('email')"
        :error-message="errors.email?.message"
      />

      <div class="w-full flex justify-center">
        <q-btn label="Submit" type="submit" color="primary" />
      </div>
    </q-form>
  </div>
</template>

<style lang="scss" scoped>

</style>
