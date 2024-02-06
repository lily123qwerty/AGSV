<template>
  <q-list padding>
    <q-item-label header class="text-h6 text-primary"
      >Edit Angle: {{ angle.key }}</q-item-label
    >

    <q-item>
      <q-item-section>
        <q-input label="Vertex" :model-value="vertex" readonly />
      </q-item-section>
    </q-item>

    <q-item>
      <q-item-section>
        <q-input label="Sides" :model-value="sides" readonly />
      </q-item-section>
    </q-item>

    <!-- <q-item
      ><q-item-section
        ><q-item-label>Degrees: {{ degrees }}°</q-item-label>
      </q-item-section>
    </q-item> -->

    <q-item>
      <q-item-section
        ><q-item-label>{{ degrees }}°</q-item-label>
        <q-item-label caption>degrees</q-item-label>
      </q-item-section>
      <q-item-section avatar>
        <!-- <q-slider
          v-model="degrees"
          :min="1"
          :max="179"
          :label-value="degrees + '°'"
          label
          label-always
        /> -->
        <q-knob
          :min="0"
          :inner-min="1"
          :max="360"
          :inner-max="179"
          v-model="degrees"
          size="56px"
          :thickness="1"
          color="primary"
          track-color="grey-3"
          font-size="18px"
          >{{ degrees }}°
        </q-knob>
      </q-item-section>
    </q-item>

    <q-separator spaced color="white" />

    <q-item>
      <q-item-section>
        <q-item-label>Draw Angle</q-item-label>
        <q-item-label caption>Show angle symbol and degrees</q-item-label>
      </q-item-section>
      <q-item-section avatar>
        <q-toggle v-model="visible" left-label color="primary" />
      </q-item-section>
    </q-item>

    <q-item v-if="visible"
      ><q-item-section><q-item-label>Size</q-item-label> </q-item-section>
    </q-item>

    <q-item v-if="visible">
      <q-item-section>
        <q-slider
          v-model="size"
          :min="10"
          :max="30"
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
import Angle from 'src/model/Angle';
import { ref, computed } from 'vue';
import { degreesToRadians, radiansToDegrees } from 'src/model/helper';
import AColorPicker from 'src/components/AColorPicker.vue';
import stores from 'src/stores';

const props = defineProps({
  angle: Angle,
});

const angle = computed(() => props.angle);

const vertex = computed(
  () => angle.value.vertex.label || angle.value.vertex.key
);

const sides = computed(
  () =>
    '[' +
    angle.value.sides1.map((obj) => obj.label || obj.key).join(', ') +
    '], [' +
    angle.value.sides2.map((obj) => obj.label || obj.key).join(', ') +
    ']'
);

const degrees = computed({
  get: () => Math.round(radiansToDegrees(angle.value.radian) * 100) / 100,
  set: (val) => (angle.value.radian = degreesToRadians(Number(val))),
});

const visible = computed({
  get: () => angle.value.style.visible,
  set: (val) => (angle.value.style.visible = val),
});

const color = computed({
  get: () => angle.value.style.color,
  set: (val) => (angle.value.style.color = val),
});

const size = computed({
  get: () => angle.value.style.size,
  set: (val) => (angle.value.style.size = Number(val)),
});
</script>
