<template>
  <q-list padding>
    <q-item-label header class="text-h6 text-primary"
      >Edit Line: {{ line.key }}</q-item-label
    >

    <q-item>
      <q-item-section>
        <q-input label="Length" v-model="length" />
      </q-item-section>
    </q-item>

    <q-item>
      <q-item-section>
        <q-input label="Ends" :model-value="ends" readonly />
      </q-item-section>
    </q-item>

    <q-separator spaced color="white" />

    <q-item>
      <q-item-section>
        <q-item-label>Draw Label</q-item-label>
        <q-item-label caption>Show length of line</q-item-label>
      </q-item-section>
      <q-item-section avatar>
        <q-toggle v-model="visible" left-label color="primary" />
      </q-item-section>
    </q-item>

    <a-color-picker v-if="visible" v-model="color" />
  </q-list>
</template>

<script setup>
import Line from 'src/model/Line';
import { ref, computed } from 'vue';
import AColorPicker from 'src/components/AColorPicker.vue';
import { degreesToRadians, radiansToDegrees } from 'src/model/helper';

const props = defineProps({
  line: Line,
});

const line = computed(() => props.line);

const length = computed({
  get: () => line.value.length,
  set: (val) => {
    //TODO: change ends position
  },
});

const ends = computed(
  () =>
    (line.value.ends[0].label || line.value.ends[0].key) +
    ', ' +
    (line.value.ends[1].label || line.value.ends[1].key)
);

const visible = computed({
  get: () => line.value.style.visible,
  set: (val) => (line.value.style.visible = val),
});

const color = computed({
  get: () => line.value.style.color,
  set: (val) => (line.value.style.color = val),
});
</script>
