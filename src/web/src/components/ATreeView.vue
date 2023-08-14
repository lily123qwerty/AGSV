<template>
  <q-tree
    :nodes="allShape"
    node-key="key"
    v-model:expanded="expanded"
    v-model:selected="selected"
    @update:selected="onTreeSelect"
  />
</template>

<script setup>
import { ref, computed } from 'vue';
import { useGraphStore } from 'stores/graph';
import Graph from 'src/model/Graph';

const emit = defineEmits(['selectShape']);

const store = useGraphStore();

const expanded = ref(['all Shapes']);

const selected = ref(null);

function onTreeSelect(key) {
  console.log(this);
  console.log(key);
}

function onSelect(node) {
  emit('selectShape', node.obj);
}

const allShape = computed(() => {
  let lineKey = Object.entries(store.graph.lines).map(([key, obj]) => ({
    label: key,
    key,
  }));
  let triangleKey = Object.entries(store.graph.triangles).map(([key, obj]) => ({
    label: key,
    icon: 'mdi-triangle-outline',
    key,
    children: [
      {
        label: 'vertices',
        key: 'vertices_' + key,
        icon: 'mdi-circle-medium',
        children: obj.vertices.map((obj) => ({
          label: obj.key,
          key: 'vertices_' + key + '_' + obj.key,
          icon: 'mdi-circle-medium',
          obj,
          selectable: true,
          handler: onSelect,
        })),
      },
      {
        label: 'sides',
        key: 'sides_' + key,
        icon: 'horizontal_rule',
        children: obj.edges.map((obj) => ({
          label: obj.key,
          key: 'sides_' + key + '_' + obj.key,
          icon: 'horizontal_rule',
          obj,
          selectable: true,
          handler: onSelect,
        })),
      },
      {
        label: 'angles',
        key: 'angles_' + key,
        icon: 'mdi-angle-acute',
        children: obj.angles.map((obj) => ({
          label: obj.key,
          key: 'angles_' + key + '_' + obj.key,
          icon: 'mdi-angle-acute',
          obj,
          selectable: true,
          handler: onSelect,
        })),
      },
    ],
  }));
  // let circleKey = Object.entries(store.graph.circles).map(([key, obj]) => ({
  //     label: key,
  // }));
  // let parallelogramKey = Object.entries(store.graph.parallelogram).map(
  //     ([key, obj]) => ({
  //         label: key,
  //     })
  // );
  // let trapeziumKey = Object.entries(store.graph.trapezium).map(
  //     ([key, obj]) => ({
  //         label: key,
  //     })
  // );

  // let polygonKey = Object.entries(store.graph.polygon).map(([key, obj]) => ({
  //     label: key,
  // }));

  return [
    {
      label: 'Triangle',
      key: 'Triangle',
      icon: 'mdi-triangle-outline',
      children: triangleKey,
    },
    {
      label: 'Circle',
      key: 'Circle',
      icon: 'mdi-circle-outline',
      //disabled: true,
      children: [],
    },
    {
      label: 'parallelogram',
      key: 'parallelogram',
      icon: 'mdi-square-outline',
      children: [],
    },
    {
      label: 'trapezium',
      key: 'trapezium',
      icon: 'svguse:myicons.svg#trapezium',
      children: [],
    },
    {
      label: 'regular polygon',
      key: 'regular polygon',
      icon: 'mdi-hexagon-outline',
      children: [],
    },
  ];
});
</script>
