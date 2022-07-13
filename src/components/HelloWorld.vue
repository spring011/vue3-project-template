<script setup lang="ts">
import { ref } from 'vue';

defineProps<{ msg: string }>();

const count = ref(0);
</script>

<template>
  <h1>{{ count }}</h1>
</template>

<style lang="scss" scoped>
h1 {
  color: $color;
}
</style>
