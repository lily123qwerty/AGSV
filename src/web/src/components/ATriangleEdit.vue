<template>
  <q-toolbar class="bg-cyan text-white">
    <q-toolbar-title>Edit Triangle: {{ desc || triangle.key }}</q-toolbar-title>
    <q-btn flat round dense icon="close" @click="emit('closeRightDrawer')" />
  </q-toolbar>

  <div class="q-pa-md q-gutter-sm">
    <div class="text-h6 text-cyan">Basic</div>
    <p class="text-p q-mb-lg q-mt-lg">area: {{ area }}</p>

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
  </div>
</template>

<script setup>
import Triangle from 'src/model/Triangle';
import { ref, computed } from 'vue';

const emit = defineEmits(['closeRightDrawer']);

const props = defineProps({
  triangle: Triangle,
});

const triangle = computed(() => props.triangle);

const area = computed(() => props.triangle.area);

const desc = computed(() => triangle.value.label);

const visible = computed({
  get: () => triangle.value.style.visible,
  set: (val) => (triangle.value.style.visible = val),
});

const color = computed({
  get: () => triangle.value.style.color,
  set: (val) => (triangle.value.style.color = val),
});
</script>
