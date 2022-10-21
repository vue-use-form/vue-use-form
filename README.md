 <h1 align="center">
  vue-use-form
</h1>
<p align="center">
Inspired by <a href="https://react-hook-form.com/">react-hook-form</a>, if you love react-hook-form usage, come on and try it!
</p>
<p align="center">
  <a href="https://vue-use-form.netlify.app/">📝Document</a>
  |
  <a href="https://vue-use-form-play.netlify.app/">
  🤽‍♀️Playground
  </a>
</p>

## Install

```bash
npm i vue-use-form
```

## 🚀Features
- 🦾 Type Strong: Written in TypeScript
- 🏆 No Component: No need to import any components to use, you can use it in all UI framework
- 😍 Easy to use: Just 2 main hooks: useForm, useFieldArray



## Quick Start
```html
<script setup lang="ts">
import { useForm } from 'vue-use-form'

interface Inputs {
  username: string
}

const { regsiter } = useForm<Inputs>()
</script>

<template>
  <input
    :="register('username', {
      required: 'username field cannot be empty!'
    })"
  >
</template>
```


## use with schema
- [@vue-use-form/class-validator](https://github.com/vue-use-form/vue-use-form/tree/master/packages/resolver-class-validator)
- [@vue-use-form/yup](https://github.com/vue-use-form/vue-use-form/tree/master/packages/resolver-yup)

