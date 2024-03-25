<template>
  <div>
    <a-dot-edit v-if="selectedShapeClass == 'Dot'" :dot="selectedShape" />
    <a-line-edit
      v-if="selectedShapeClass == 'Line'"
      :line="selectedShape"
      @rotate-graph="onRotateGraph"
    />
    <a-angle-edit v-if="selectedShapeClass == 'Angle'" :angle="selectedShape" />
    <a-triangle-edit
      v-if="selectedShapeClass == 'Triangle'"
      :triangle="selectedShape"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useGraphStore } from 'stores/graph';
import ADotEdit from 'src/components/ADotEdit.vue';
import ALineEdit from 'src/components/ALineEdit.vue';
import AAngleEdit from 'src/components/AAngleEdit.vue';
import ATriangleEdit from 'src/components/ATriangleEdit.vue';
import { useUserStore } from '../stores/user';

const store = useGraphStore();
const userStore = useUserStore();

const selectedShape = computed(() => userStore.selectedShape);
const selectedShapeClass = computed(() =>
  userStore.selectedShape ? userStore.selectedShape.constructor.name : null
);

function onRotateGraph(r, c) {
  store.graph.rotate(r, c);
}
</script>

<style lang="scss" scoped>
// .q-knob--editable:focus:before {
//   box-shadow: none !important;
// }

// body.body--dark .q-knob--editable:focus:before {
//   box-shadow: $dark-shadow-2;
// }
</style>
