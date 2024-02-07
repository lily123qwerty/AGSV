<template>
  <q-page class="flex flex-center">
    <a-graph :graph="store.graph" />
    <div id="question">
      {{ store.graph.question }}
    </div>
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

<style lang="scss">
#question {
  // background-color: aqua;
  position: absolute;
  margin-left: 100px;
  margin-right: 100px;
  bottom: 50px;
  // left: auto;
  // right: auto;
  // width: 700px;
  // text-align: center;
  font: bold 1.4em serif;
}
</style>
