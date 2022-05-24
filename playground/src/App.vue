<script lang="ts" setup>
import { ElMessage } from 'element-plus'
import { watchEffect } from 'vue'
import { useForm } from '../../packages/core/src'

interface Inputs {
  activeName: string
  date1: Date
  date2: Date
  region: string
  delivery: boolean
  type: string[]
  resource: string
  desc: string
}

const {
  register,
  handleSubmit,
  formState: { errors },
  createErrorHandler,
  createSubmitHandler,
  getValues,
} = useForm<Inputs>({
  mode: 'onChange',
})

const [activeNameField, activeNameRef] = register('activeName', {
  required: 'Active name is required!',
  maxLength: {
    value: 10,
    message: 'Active name must be less than 10 characters!',
  },
  minLength: {
    value: 3,
    message: 'Active name must be more than 3 characters!',
  },
})

const [regionField, regionRef] = register('region', {
  required: 'Region is required!',
})

const [date1Field, date1Ref] = register('date1', {
  required: 'Date1 is required!',
  valueAsDate: true,
})

const [date2Field, date2Ref] = register('date2', {
  required: 'Date2 is required!',
  valueAsDate: true,
  validate: (value: Date) => {
    const date1 = date1Field.value

    if (value < date1) {
      return 'Date2 must be greater than date1!'
    }
  },
})

const [deliveryField, deliveryRef] = register('delivery', {
  required: 'Delivery is required!',
  value: true,
})

const [typeField, typeRef] = register('type', {
  required: 'Type is required!',
  value: ['Promotion activities'],
})

const [resourceField, resourceRef] = register('resource', {
  required: 'Resource is required!',
  value: 'Sponsor',
})

const [descField, descRef] = register('desc', {
  required: 'Desc is required!',
  maxLength: {
    value: 100,
    message: 'Desc must be less than 100 characters!',
  },
})

const onSubmit = createSubmitHandler((data) => {
  ElMessage({
    type: 'success',
    message: 'Create activity successfully!',
  })
})
const onError = createErrorHandler((errors) => {
  ElMessage({
    type: 'error',
    message: 'Failed to create activity!',
  })
})
</script>

<template>
  <el-form label-width="120px">
    <el-form-item label="Activity name" :error="errors.activeName?.message">
      <el-input ref="activeNameRef" v-model="activeNameField" />
    </el-form-item>
    <el-form-item label="Activity zone" :error="errors.region?.message">
      <el-select
        ref="regionRef"
        v-model="regionField"
        placeholder="please select your zone"
      >
        <el-option label="Zone one" value="shanghai" />
        <el-option label="Zone two" value="beijing" />
      </el-select>
    </el-form-item>
    <el-form-item label="Activity time" :error="errors.date1?.message || errors.date2?.message">
      <el-col :span="11">
        <el-date-picker
          v-model="date1Field"
          type="date"
          placeholder="Pick a date"
          style="width: 100%"
        />
      </el-col>
      <el-col :span="2" class="text-center">
        <span class="text-gray-500">-</span>
      </el-col>
      <el-col :span="11">
        <el-date-picker
          v-model="date2Field"
          type="date"
          placeholder="Pick a date"
          style="width: 100%"
        />
      </el-col>
    </el-form-item>
    <el-form-item label="Instant delivery" :error="errors.delivery?.message">
      <el-switch v-model="deliveryField" />
    </el-form-item>
    <el-form-item label="Activity" prop="type" :error="errors.type?.message">
      <el-checkbox-group v-model="typeField">
        <el-checkbox label="Online activities" name="type" />
        <el-checkbox label="Promotion activities" name="type" />
        <el-checkbox label="Offline activities" name="type" />
        <el-checkbox label="Simple brand exposure" name="type" />
      </el-checkbox-group>
    </el-form-item>
    <el-form-item label="Resources" :error="errors.resource?.message">
      <el-radio-group v-model="resourceField">
        <el-radio label="Sponsor" />
        <el-radio label="Venue" />
      </el-radio-group>
    </el-form-item>
    <el-form-item label="Activity form" :error="errors.desc?.message">
      <el-input v-model="descField" type="textarea" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="handleSubmit(onSubmit, onError)()">
        Create
      </el-button>
      <el-button>Cancel</el-button>
    </el-form-item>
  </el-form>
</template>
