<template><polygon :points="points" fill="none" stroke="black" /></template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import Triangle from 'src/model/Triangle';

const props = defineProps({
    triangle: Triangle,
});

const points = computed(() =>
    props.triangle.vertices.map((dot) => '' + dot.x + ',' + dot.y).join(' ')
);

onMounted(() => {});
</script>

<style lang="scss"></style>
