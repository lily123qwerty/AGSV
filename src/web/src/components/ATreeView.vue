<template>
  <q-tree
    ref="tree"
    :nodes="allShape"
    node-key="key"
    v-model:selected="selected"
    selected-color="primary"
  />
</template>

<script setup>
import { ref, computed } from 'vue';
import { useGraphStore } from 'stores/graph';
import Graph from 'src/model/Graph';

const emit = defineEmits(['selectShape']);

const store = useGraphStore();

const tree = ref(null);
const selected = ref(null);

function onSelectTree(node) {
  selected.value = null;
  tree.value.setExpanded(node.key, !tree.value.isExpanded(node.key));
}

function onSelectShape(node) {
  selected.value = node.key;
  emit('selectShape', node.obj);
}

const allShape = computed(() => {
  // let lineKey = Object.entries(store.graph.lines).map(([key, obj]) => ({
  //   label: key,
  //   key
  // }));
  let triangles = Object.entries(store.graph.triangles).map(([key, obj]) => ({
    label: key + (obj.label ? ': ' + obj.label : ''),
    icon: 'mdi-triangle-outline',
    key,
    obj,
    handler: (node) => (onSelectTree(node), onSelectShape(node)),
    children: [
      ...obj.vertices.map((obj) => ({
        label: obj.key + (obj.label ? ': ' + obj.label : ''),
        key: 'vertices_' + key + '_' + obj.key,
        icon: 'mdi-circle-medium',
        obj,
        handler: onSelectShape,
      })),
      ...obj.edges.map((obj) => ({
        label: obj.key + (obj.label ? ': ' + obj.label : ''),
        key: 'sides_' + key + '_' + obj.key,
        icon: 'horizontal_rule',
        obj,
        handler: onSelectShape,
      })),
      ...obj.angles.map((obj) => ({
        label: obj.key + (obj.label ? ': ' + obj.label : ''),
        key: 'angles_' + key + '_' + obj.key,
        icon: 'mdi-angle-acute',
        obj,
        handler: onSelectShape,
      })),
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
      handler: onSelectTree,
      children: triangles,
    },
    {
      label: 'Circle',
      key: 'Circle',
      icon: 'mdi-circle-outline',
      //disabled: true,
      children: [],
    },
    // {
    //   label: 'parallelogram',
    //   key: 'parallelogram',
    //   icon: 'mdi-square-outline',
    //   children: [],
    // },
    // {
    //   label: 'trapezium',
    //   key: 'trapezium',
    //   icon: 'svguse:myicons.svg#trapezium',
    //   children: [],
    // },
    // {
    //   label: 'regular polygon',
    //   key: 'regular polygon',
    //   icon: 'mdi-hexagon-outline',
    //   children: [],
    // },
  ];
});
</script>
