<template>
  <q-page class="flex flex-center">
    <a-graph :graph="store.graph" />
  </q-page>
</template>

<script setup>
import { useGraphStore } from 'stores/graph';
import AGraph from 'components/AGraph.vue';
import Graph from 'src/model/Graph';
import Style from 'src/model/Style';
import { computed, watch } from 'vue';

const store = useGraphStore();

// console.log('graph page');
// const g = new Graph();
// let t = g.addTriangleBy2Angle1Side(40, 105, 100);
// g.addTriangleBy2Angle1Side(45, 45, t.edges[2], 1);
// t.vertices[0].style = new Style({ color: 'red' });
// console.log(g.toJSON());
</script>
