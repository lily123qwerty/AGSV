<template>
  <q-toolbar class="bg-cyan text-white">
    <q-toolbar-title>Edit Dot: {{ dot.key }}</q-toolbar-title>
    <q-btn flat round dense icon="close" @click="emit('closeRightDrawer')" />
  </q-toolbar>

  <div class="q-pa-md q-gutter-sm">
    <div class="text-h6 text-cyan">Basic</div>
    <q-input v-model="x" label="x" />
    <q-input v-model="y" label="y" />

    <div class="text-h6 text-cyan q-mt-lg">Style</div>

    <q-toggle v-model="visible" color="secondary" label="visible" />

    <q-input v-model="color" label="color">
      <template v-slot:append>
        <q-icon name="colorize" class="cursor-pointer">
          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
            <q-color v-model="color" />
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>

    <q-input v-model="label" label="label" />

    <p class="text-p q-mb-lg q-mt-lg">size</p>

    <q-slider v-model="size" :min="1" :max="10" label label-always />
  </div>
</template>

<script setup>
import Dot from 'src/model/Dot';
import { ref, computed } from 'vue';

const emit = defineEmits(['closeRightDrawer']);

const props = defineProps({
  dot: Dot,
});

const dot = computed(() => props.dot);
const x = computed({
  get: () => dot.value.x,
  set: (val) => (dot.value.x = Number(val)),
});

const y = computed({
  get: () => dot.value.y,
  set: (val) => (dot.value.y = Number(val)),
});

const visible = computed({
  get: () => dot.value.style.visible,
  set: (val) => (dot.value.style.visible = val),
});

const color = computed({
  get: () => dot.value.style.color,
  set: (val) => (dot.value.style.color = val),
});

const size = computed({
  get: () => dot.value.style.size,
  set: (val) => (dot.value.style.size = Number(val)),
});

const label = computed({
  get: () => dot.value.style.label,
  set: (val) => (dot.value.style.label = val),
});
</script>
