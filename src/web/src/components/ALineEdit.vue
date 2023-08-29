<template>
  <q-toolbar class="bg-cyan text-white">
    <q-toolbar-title>Edit Line: {{ line.key }}</q-toolbar-title>
    <q-btn flat round dense icon="close" @click="emit('closeRightDrawer')" />
  </q-toolbar>

  <div class="q-pa-md q-gutter-sm">
    <div class="text-h6 text-cyan q-mt-lg">Basic</div>
    <p class="text-p q-mb-lg q-mt-lg">Length: {{ length }}</p>
    <p class="text-p q-mb-lg q-mt-lg">
      ends: {{ line.ends[0].label || line.ends[0].key }},
      {{ line.ends[1].label || line.ends[1].key }}
    </p>

    <div class="text-h6 text-cyan q-mt-lg">Style</div>

    <q-toggle v-model="visible" color="secondary" label="visible" />
    <!-- choose to display label or length -->

    <q-input v-model="color" label="color">
      <template v-slot:append>
        <q-icon name="colorize" class="cursor-pointer">
          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
            <q-color v-model="color" />
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>

    <p class="text-p q-mb-lg q-mt-lg">size</p>
  </div>
</template>

<script setup>
import Line from 'src/model/Line';
import { ref, computed } from 'vue';
import { degreesToRadians, radiansToDegrees } from 'src/model/helper';

const emit = defineEmits(['closeRightDrawer']);

const props = defineProps({
  line: Line,
});

const line = computed(() => props.line);

const length = computed({
  get: () => line.value.length,
  set: (val) => (line.value.length = val),
});

const visible = computed({
  get: () => line.value.style.visible,
  set: (val) => (line.value.style.visible = val),
});

const color = computed({
  get: () => line.value.style.color,
  set: (val) => (line.value.style.color = val),
});
</script>
