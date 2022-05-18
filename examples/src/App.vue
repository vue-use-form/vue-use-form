<script setup lang="ts">
import { creatFormControl } from '../../packages/core/src/logic/creatFormControl'

interface Inputs {
  username: string
}

const { register } = creatFormControl<Inputs>({})

</script>

<template>
  <el-input v-form="register('username', {})" />
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
