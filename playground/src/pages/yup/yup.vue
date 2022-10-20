<script lang="ts" setup>
import { useForm } from 'vue-use-form'
import * as yup from 'yup'
import { useYupResolver } from '@vue-use-form/yup'

const schema = yup.object().shape({
  name: yup.string().required(),
  age: yup.number().required().positive().integer(),
  email: yup.string().email(),
  website: yup.string().url(),
  createdOn: yup.date().default(() => {
    return new Date()
  }),
})

const resolver = useYupResolver(schema)

const {
  register,
  formState: { errors },
} = useForm<{
  email: string
  age: number
}>({
  resolver,
  mode: 'onChange',
})

</script>

<template>
  <input :="register('email')">
</template>
