<template>
  <text :x="x" :y="y" :fill="sty.color">{{ sty.label }}</text>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import Style from 'src/model/Style';

const props = defineProps({
  sty: Style,
  x: Number,
  y: Number,
});

onMounted(() => {});
</script>

<style lang="scss">
svg text {
  text-anchor: middle;
  dominant-baseline: middle;
  font-size: 15px;
  font-weight: 500;
}
</style>
