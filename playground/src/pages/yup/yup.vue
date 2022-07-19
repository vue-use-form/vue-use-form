<script lang="ts" setup>
import { useForm } from 'vue-use-form'
import * as yup from 'yup'
import { useYupResolver } from '../../../../packages/resolver-yup/src'

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

interface Inputs {
  email: string
}

const {
  register,
  formState: { errors },
} = useForm<Inputs>({
  resolver,
  mode: 'onChange',
})

const [emailField] = register('email')
</script>

<template>
  {{ errors }}
  <input v-model="emailField">
</template>

<style lang="scss" scoped>

</style>
