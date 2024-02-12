<template><polygon :points="points" :fill="fill" stroke="black" /></template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import Triangle from 'src/model/Triangle';
import { store } from 'quasar/wrappers';

const props = defineProps({
  triangle: Triangle,
  scale: Number,
});

const points = computed(() =>
  props.triangle.vertices
    .map((dot) => '' + dot.x * props.scale + ',' + dot.y * props.scale)
    .join(' ')
);

const fill = computed(() => {
  if (props.triangle.style.visible == true) {
    return props.triangle.style.color;
  } else {
    return 'none';
  }
});

onMounted(() => {});
</script>

<style lang="scss"></style>
