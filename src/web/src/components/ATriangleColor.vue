<template>
  <polygon
    v-if="color"
    :points="points"
    :fill="color"
    fill-opacity="0.5"
    stroke-opacity="0"
  />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import Triangle from 'src/model/Triangle';

const props = defineProps({
  triangle: Triangle,
  scale: Number,
});

const points = computed(() =>
  props.triangle.vertices
    .map((dot) => '' + dot.x * props.scale + ',' + dot.y * props.scale)
    .join(' ')
);

const color = computed(() => {
  if (
    props.triangle.style &&
    props.triangle.style.visible &&
    props.triangle.style.color != 'black' &&
    props.triangle.style.color != 'rgb(0,0,0)'
  )
    return props.triangle.style.color;
  else return false;
});

onMounted(() => {});
</script>

<style lang="scss"></style>
