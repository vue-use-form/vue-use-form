<script lang="ts" setup>
import { useForm } from '../../../packages/core/src/index'
import { classValidatorResolver } from '../../../packages/class-validator-resolver/src/resolver'
import { LoginForm } from './class-validator'

const resolver = classValidatorResolver(LoginForm)

const { register, formState: { errors } } = useForm<LoginForm>({
  resolver,
  mode: 'onChange',
})

const [userField] = register('name')
</script>

<template>
  {{ errors }}
  <el-input v-model="userField" />
</template>

<style lang="scss" scoped>

</style>
