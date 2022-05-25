<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const currentRoute = ref(router.currentRoute.value.name)

watchEffect(() => {
  console.log(currentRoute)
})
</script>

<template>
  <div class="w-screen">
    <q-tabs
      v-model="currentRoute"
      dense
      class="text-grey"
      active-color="primary"
      indicator-color="primary"
      align="justify"
    >
      <q-tab name="element-plus" label="element-plus" @click="() => router.push('/element-plus')" />
      <q-tab name="class-validator" label="class-validator" @click="() => router.push('/class-validator')" />
    </q-tabs>

    <div class="flex justify-center mt-5">
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </div>
  </div>
</template>
