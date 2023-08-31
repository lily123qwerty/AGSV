<template>
  <text :x="x" :y="y" :class="cls" :transform="transform">{{ label }}</text>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import Style from 'src/model/Style';
import { radiansToDegrees } from 'src/model/helper';

const props = defineProps({
  label: String,
  cls: String,
  x: Number,
  y: Number,
  r: Number,
});

const transform = computed(() => {
  let dr = radiansToDegrees(props.r);
  return 'rotate(' + dr + ',' + props.x + ',' + props.y + ')';
});

onMounted(() => {});
</script>

<style lang="scss">
svg text {
  text-anchor: middle;
  dominant-baseline: middle;
}

.dot-label {
  font: bold 18px sans-serif;
}

.angle-label {
  font: normal 17px sans-serif;
}

.line-label {
  font: italic 14px sans-serif;
}
</style>
