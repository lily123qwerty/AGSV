<template>
    <q-tree :nodes="allShape" node-key="label" v-model:expanded="expanded" />
</template>

<script setup>
import { ref, computed } from 'vue';
import { useGraphStore } from 'stores/graph';
import Graph from 'src/model/Graph';

const emit = defineEmits(['selectShape']);

const store = useGraphStore();

const expanded = ref(['all Shapes']);

function onSelect(target) {
    emit('selectShape', target.obj);
}

const allShape = computed(() => {
    let lineKey = Object.entries(store.graph.lines).map(([key, obj]) => ({
        label: key,
    }));
    let triangleKey = Object.entries(store.graph.triangles).map(
        ([key, obj]) => ({
            label: key,
            children: [
                {
                    label: 'vertices',
                    children: obj.vertices.map((obj) => ({
                        label: obj.key,
                        obj,
                        selectable: true,
                        handler: onSelect,
                    })),
                },
                {
                    label: 'sides',
                    children: obj.edges.map((obj) => ({
                        label: obj.key,
                        obj,
                        selectable: true,
                        handler: onSelect,
                    })),
                },
                {
                    label: 'angles',
                    children: obj.angles.map((obj) => ({
                        label: obj.key,
                        obj,
                        selectable: true,
                        handler: onSelect,
                    })),
                },
            ],
        })
    );
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
            label: 'line',
            icon: 'photo',
            children: lineKey,
        },
        {
            label: 'Triangle',
            icon: 'mdi-triangle-outline',
            children: triangleKey,
        },
        {
            label: 'Circle',
            icon: 'room_service',
            //disabled: true,
            children: [],
        },
        {
            label: 'parallelogram',
            icon: 'photo',
            children: [],
        },
        {
            label: 'trapezium',
            icon: 'photo',
            children: [],
        },
        {
            label: 'regular polygon',
            icon: 'photo',
            children: [],
        },
    ];
});
</script>
