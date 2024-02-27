<template>
  <q-list padding>
    <q-item-label header class="text-h6 text-primary"
      >Edit Triangle: {{ desc || triangle.key }}</q-item-label
    >

    <q-item>
      <q-item-section>
        <q-input label="Area" :model-value="area" readonly />
      </q-item-section>
    </q-item>

    <q-separator spaced color="white" />

    <q-item>
      <q-item-section>
        <q-item-label>Draw Triangle</q-item-label>
        <q-item-label caption>Fill triangle with color</q-item-label>
      </q-item-section>
      <q-item-section avatar>
        <q-toggle v-model="visible" left-label color="primary" />
      </q-item-section>
    </q-item>

    <q-item v-if="visible"
      ><q-item-section><q-item-label>Round</q-item-label> </q-item-section>
    </q-item>

    <q-item v-if="visible">
      <q-item-section>
        <q-slider
          v-model="round"
          :min="0"
          :max="5"
          label
          label-always
          markers
        />
      </q-item-section>
    </q-item>

    <a-color-picker v-if="visible" v-model="color" />
  </q-list>
</template>

<script setup>
import Triangle from 'src/model/Triangle';
import { ref, computed } from 'vue';
import AColorPicker from 'src/components/AColorPicker.vue';

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

const round = computed({
  get: () => triangle.value.style.round,
  set: (val) => (triangle.value.style.round = val),
});
</script>
