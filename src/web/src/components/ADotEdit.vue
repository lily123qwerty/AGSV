<template>
    <q-toolbar class="bg-cyan text-white">
        <q-toolbar-title>Edit Dot: {{ dot.key }}</q-toolbar-title>
        <q-btn
            flat
            round
            dense
            icon="close"
            @click="emit('closeRightDrawer')"
        />
    </q-toolbar>

    <div class="q-pa-md q-gutter-sm">
        <div class="text-h6 text-cyan">Basic</div>
        <q-input v-model="x" label="X" />
        <q-input v-model="y" label="Y" />

        <div class="text-h6 text-cyan q-mt-lg">Style</div>
    </div>
</template>

<script setup>
import Dot from 'src/model/Dot';
import { onUpdated, ref, watch } from 'vue';

const emit = defineEmits(['closeRightDrawer']);

const props = defineProps({
    dot: Dot,
});

const x = ref(props.dot.x);

watch(x, () => {
    // eslint-disable-next-line vue/no-mutating-props
    props.dot.x = x.value;
});

const y = ref(props.dot.y);

watch(y, () => {
    // eslint-disable-next-line vue/no-mutating-props
    props.dot.y = y.value;
});

onUpdated(() => {
    x.value = props.dot.x;
    y.value = props.dot.y;
});
</script>
