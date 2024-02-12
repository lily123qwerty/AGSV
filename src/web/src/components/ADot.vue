<template>
  <circle
    :cx="dot.x * scale"
    :cy="dot.y * scale"
    :r="dot.style.size"
    :fill="dot.style.color"
  />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import Dot from 'src/model/Dot';

const props = defineProps({
  dot: Dot,
  scale: Number,
});

onMounted(() => {});
</script>

<style lang="scss"></style>
