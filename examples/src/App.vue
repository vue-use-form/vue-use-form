<script setup lang="ts">
import { onMounted, reactive, ref, watchEffect } from 'vue'
import { useForm } from '../../packages/core/src'

interface Inputs {
  name: string
  region: string
  date1: Date
}

const {
  formState: { errors, fields },
  createSubmitHandler,
  createErrorHandler,
  handleSubmit,
  register,
  getValues,
} = useForm<Inputs>({
  mode: 'onChange',
})

const pickerRef = ref()

const rootRef = ref()

watchEffect(() => {
  console.log(fields)
})

const onSubmit = createSubmitHandler((data) => {
  console.log(data)
})

const onError = createErrorHandler((error) => {
  console.log(error)
})

</script>

<template>
  <el-form label-width="120px">
    <el-form-item
      :="register('date1', {
            required: 'Please select end time',
            valueAsDate: true,
            validate: (value) => value === 1
          })"
    >
      <el-time-picker
        ref="rootRef"
        v-model="fields.date1.inputValue"
        placeholder="Pick a time"
        style="width: 100%"
      />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="handleSubmit(onSubmit, onError)()">
        Create
      </el-button>
      <el-button>Cancel</el-button>
    </el-form-item>
  </el-form>
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
