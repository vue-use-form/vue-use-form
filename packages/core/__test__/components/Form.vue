<script>
import { useForm } from '../../src'

export default {
  data() {
    const { formState: { errors }, register } = useForm({
      defaultValues: {
        username: 'snowingfox',
      },
    })

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
