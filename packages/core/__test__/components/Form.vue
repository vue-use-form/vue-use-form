<script>
import { useForm } from '../../src/useForm'

export default {
  data() {
    const { formState: { errors }, register } = useForm()

    return {
      register,
      errors,
    }
  },
}
</script>

<template>
  <input
    v-bind="register('username', {
      required: true,
      maxLength: 10,
      minLength: 3,
    })"
  >
</template>
