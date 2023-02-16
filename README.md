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
Try it on [playground](https://vue-use-form-play.netlify.app/#eNpVUcFugzAM/RUvl7ZSgTui1XaZtHOvuaTUtJnAZImphBD/PoeUrssp8Xt+79mZlO1c7znrjMu/Q0+qVJMmAP0AglYlLJVYuw+YDQGzpvddBLS6MbtQFsUrkrnWjDkht7YZc+PcP1RstIqCs6ZZ7dWHc7ngYlyF2lvHEJAHB62h60GrmOCoKaWBCUTmU1Rghsb3HWxepTeahEmMvjE1whe5gUNKLxRPpsMSAntLV/GO5LqnEFUjxePVBundL6+od2LD0jEBet/7APM+IjdDlxZPw7mzLIUZDmuoKjketztNVZGmkezyYOxkKYzygoea6P4JSxiAKnrCe1iUc+fxjsSyglfD7U7E40Lih1Q2+qU7QCnUdYbtZh14s1+/Lx6PP4P1eCnhSYDGYnuB2hD1DGcEicrjm+wytczil+6r63lg7gl4dCiWKe4zE8CjkLhFIi9gVcQB5VoVz32o+RclxNrU)
```html
<script setup lang="ts">
import { useForm } from 'vue-use-form'

interface Inputs {
  username: string
}

const { 
  register, 
  formState: { errors },
  handleSubmit,
} = useForm<Inputs>()
</script>

<template>
  errors: {{ errors }}
  <form @submit.prevent="handleSubmit()()">
    <input
      :="register('username', {
        required: 'username field cannot be empty!'
      })"
    >
    <button type="submit">
      submit
    </button>
  </form>
</template>
```


## use with schema
- [@vue-use-form/class-validator](https://github.com/vue-use-form/vue-use-form/tree/main/packages/resolver-class-validator)
- [@vue-use-form/yup](https://github.com/vue-use-form/vue-use-form/tree/main/packages/resolver-yup)

