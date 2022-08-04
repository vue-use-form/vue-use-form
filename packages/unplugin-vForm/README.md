# @vue-use-form/v-form

[![NPM version](https://img.shields.io/npm/v/@vue-use-form/v-form?color=a1b858&label=)](https://www.npmjs.com/package/@vue-use-form/v-form)

Directive for [vue-use-form](https://github.com/vue-use-form/vue-use-form)

## Install

```bash
npm i @vue-use-form/v-form -D
```

<details>
<summary>Vite</summary><br>

```ts
// vite.config.ts
import VForm from '@vue-use-form/v-form'

export default defineConfig({
  plugins: [
    VForm({ /* options */ }),
  ],
})
```


<br></details>

<details>
<summary>Rollup</summary><br>

```ts
// rollup.config.js
import VForm from '@vue-use-form/v-form'

export default {
  plugins: [
    VForm({}),
  ],
}
```

<br></details>


<details>
<summary>Webpack</summary><br>

```ts
// webpack.config.js
module.exports = {
  /* ... */
  plugins: [
    require('@vue-use-form/v-form/webpack')({ /* options */ })
  ]
}
```

<br></details>

<details>
<summary>Nuxt</summary><br>

```ts
// nuxt.config.js
export default {
  buildModules: [
    ['@vue-use-form/v-form/nuxt', { /* options */ }],
  ],
}
```

> This module works for both Nuxt 2 and [Nuxt Vite](https://github.com/nuxt/vite)

<br></details>

<details>
<summary>Vue CLI</summary><br>

```ts
// vue.config.js
module.exports = {
  configureWebpack: {
    plugins: [
      require('@vue-use-form/v-form/webpack')({ /* options */ }),
    ],
  },
}
```

<br></details>


## Usage

```vue
<script setup lang="ts">
import {useForm} from 'vue-use-form'

const {
  register,
  formState: {errors},
} = useForm<{
  email: string
  age: number
}>({
  mode: 'onChange',
})

</script>

<template>
  <input v-form="register('email', {
    required: true
  })">
  <input v-form="register('age', {
    required: true,
  })">
</template>
```

Will compiled to

```vue
<script setup lang="ts">
import {useForm} from 'vue-use-form'

const {
  register,
  formState: {errors},
} = useForm<{
  email: string
  age: number
}>({
  mode: 'onChange',
})

const [emailField, emailRef] = register('email', {
  required: true
})
const [ageField, ageRef] = register('age', {
  required: true,
})
</script>

<template>
  <input v-model="emailField" ref="emailRef">
  <input v-model="ageField" ref="ageRef">
</template>
```

> ⚠️ please make sure use `v-form` in static, it can't do dynamic analysis.

```vue
<template v-for="field in ['age', 'email']">
  <input v-form="register(field)" />  <!--⚠️⚠️⚠️ can't be analysed-->
</template>
```


```vue
<input v-form="register('email')" />
<input v-form="register('age')" /> <!--can be analysed-->
```



