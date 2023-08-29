<template>
  <text :x="x" :y="y" :fill="sty.color" :transform="transform">{{
    label
  }}</text>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import Style from 'src/model/Style';
import { radiansToDegrees } from 'src/model/helper';

const props = defineProps({
  label: String,
  sty: Style,
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
  font-size: 15px;
  font-weight: 500;
}
</style>
