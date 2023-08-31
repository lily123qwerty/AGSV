<template>
  <q-list padding>
    <q-item-label header class="text-h6 text-primary"
      >Edit Dot: {{ desc || dot.key }}</q-item-label
    >

    <q-item>
      <q-item-section>
        <q-input v-model="label" label="Name" />
      </q-item-section>
    </q-item>

    <q-item>
      <q-item-section>
        <q-input v-model="x" label="X" type="number" />
      </q-item-section>
    </q-item>

    <q-item>
      <q-item-section>
        <q-input v-model="y" label="Y" type="number" />
      </q-item-section>
    </q-item>

    <q-separator spaced color="white" />

    <q-item>
      <q-item-section>
        <q-item-label>Draw Dot</q-item-label>
        <q-item-label caption>Draw a filled cycle</q-item-label>
      </q-item-section>
      <q-item-section avatar>
        <q-toggle v-model="visible" left-label color="primary" />
      </q-item-section>
    </q-item>

    <q-item v-if="visible"
      ><q-item-section><q-item-label>Radius</q-item-label> </q-item-section>
    </q-item>

    <q-item v-if="visible">
      <q-item-section>
        <q-slider
          v-model="size"
          :min="2"
          :max="6"
          label
          label-always
          markers
          marker-labels
        />
      </q-item-section>
    </q-item>

    <a-color-picker v-if="visible" v-model="color" />
  </q-list>
</template>

<script setup>
import Dot from 'src/model/Dot';
import { ref, computed } from 'vue';
import AColorPicker from 'src/components/AColorPicker.vue';

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

const desc = computed(() => dot.value.label);

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
  get: () => dot.value.label,
  set: (val) => (dot.value.label = val),
});
</script>
