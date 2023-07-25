<template>
    <div class="graph">
        <svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
            <a-triangle
                v-for="t in triangles"
                :key="t.key"
                :triangle="t"
            ></a-triangle>
            <a-dot v-for="dot in dots" :key="dot.key" :dot="dot"></a-dot>
        </svg>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import Graph from 'src/model/Graph';
import ATriangle from './ATriangle.vue';
import ADot from './ADot.vue';

const props = defineProps({
    graph: Graph,
});

const triangles = computed(() =>
    Object.entries(props.graph.triangles).map(([key, obj]) => obj)
);

const dots = computed(() =>
    Object.entries(props.graph.dots)
        .map(([key, obj]) => obj)
        .filter((obj) => obj.style)
);

onMounted(() => {
    console.log(props.graph.toJSON());
});
</script>

<style lang="scss">
.graph {
    width: 300px;
    background-color: white;
    transform: scaleY(1);
}
</style>
