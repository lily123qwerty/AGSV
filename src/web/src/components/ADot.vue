<template>
    <circle
        :cx="dot.x"
        :cy="dot.y"
        :r="dot.style.size"
        :fill="dot.style.color"
    />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import Dot from 'src/model/Dot';

const props = defineProps({
    dot: Dot,
});

onMounted(() => {});
</script>

<style lang="scss"></style>
