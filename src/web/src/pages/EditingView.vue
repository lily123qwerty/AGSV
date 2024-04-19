<template>
  <div v-if="editingObject">
    <a-dot-edit v-if="editingObject instanceof Dot" :dot="editingObject" />
    <a-line-edit
      v-if="editingObject instanceof Line"
      :line="editingObject"
      @rotate-graph="onRotateGraph"
    />
    <a-angle-edit
      v-if="editingObject instanceof Angle"
      :angle="editingObject"
    />
    <a-triangle-edit
      v-if="editingObject instanceof Triangle"
      :triangle="editingObject"
    />
    <a-circle-edit
      v-if="editingObject instanceof Circle"
      :circle="editingObject"
    />
    <a-graph-edit
      v-if="editingObject instanceof Graph"
      :graph="editingObject"
    />
    <profile-edit
      v-if="editingObject == userStore.user"
      :user="editingObject"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useGraphStore } from 'stores/graph';
import Triangle from 'src/model/Triangle';
import Dot from 'src/model/Dot';
import Line from 'src/model/Line';
import Angle from 'src/model/Angle';
import Circle from 'src/model/Circle';
import ADotEdit from 'src/components/ADotEdit.vue';
import ALineEdit from 'src/components/ALineEdit.vue';
import AAngleEdit from 'src/components/AAngleEdit.vue';
import ATriangleEdit from 'src/components/ATriangleEdit.vue';
import ACircleEdit from 'src/components/ACircleEdit.vue';
import AGraphEdit from 'src/components/AGraphEdit.vue';
import ProfileEdit from 'src/components/ProfileEdit.vue';
import { useUserStore } from '../stores/user';
import Graph from 'src/model/Graph';

const store = useGraphStore();
const userStore = useUserStore();

const editingObject = computed(() => userStore.editingObject);
const editingObjectClass = computed(() =>
  userStore.editingObject ? userStore.editingObject.constructor.name : null
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
