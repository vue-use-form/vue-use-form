<script lang="ts" setup>
import { useValidator } from './use-validator'

const {
  register,
  handleSubmit,
  errors,
  onError,
  onSubmit,
  isExistInErrors,
} = useValidator()
</script>

<template>
  <div class="w-[400px]">
    <q-form
      class="q-gutter-md"
      @submit.prevent="handleSubmit(onSubmit, onError)()"
    >
      <q-input
        :="register('username')"
        filled
        label="Your name *"
        hint="Name and surname"
        lazy-rules
        :error="isExistInErrors('username')"
        :error-message="errors.username?.message"
      />

      <q-input
        :="register('password', {
          validate: (value: string) => {
            return value.startsWith('@') || 'Password must start with @'
          },
        })"
        filled
        lazy-rules
        type="password"
        label="Your password *"
        :error="isExistInErrors('password')"
        :error-message="errors.password?.message"
      />

      <q-input
        :="register('email')"
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
