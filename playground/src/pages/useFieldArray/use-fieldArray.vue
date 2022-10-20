<script lang="ts" setup>
import { useFieldArray, useForm } from 'vue-use-form'

interface Inputs {
  data: { firstName: string; lastName: string }[]
}

const { control, register, formState: { errors } } = useForm<Inputs>({
  mode: 'onChange',
})

const { fields, append, prepend, remove, swap, insert } = useFieldArray({
  control, // control props comes from useForm (optional: if you are using FormContext)
  name: 'data',
})
</script>
<template>
  <div>
    <div w-50vw>
      {{ fields }}
    </div>
    <q-form class="w-[50vw] mx-auto flex justify-center flex-col">
      <template v-for="field in fields" :key="field.index">
        {{ field }}
        <q-input
          :="register(`data.${field.index}.${field.name}`, {
            required: true
          })"
        />
      </template>
      <div grid gap2>
        <q-btn
          class="mt-5" label="appendFirst" color="primary" @click="() => {
            prepend({ firstName: '2',lastName: '2' })
          }"
        />
        <q-btn
          class="mt-5" label="remove" color="primary" @click="() => {
            remove(1)
          }"
        />
        <q-btn
          class="mt-5" label="swap" color="primary" @click="() => {
            swap(0, 1)
          }"
        />
        <q-btn
          class="mt-5" label="append" color="primary" @click="() => {
            append({ firstName: 'snowing' })
          }"
        />
        <q-btn
          class="mt-5" label="insert" color="primary" @click="() => {
            insert(1, { lastName: 'fox' })
          }"
        />
      </div>
    </q-form>
  </div>
</template>

<style lang="scss" scoped>

</style>
