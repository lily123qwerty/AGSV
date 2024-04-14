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

    <div class="q-pa-md q-gutter-sm text-left">
      <q-btn
        round
        unelevated
        color="primary"
        icon="mdi-flip-horizontal"
        @click="makeVertical"
      />
      <q-btn
        round
        unelevated
        color="primary"
        icon="mdi-flip-vertical"
        @click="makeHorizontal"
      />
    </div>

    <q-separator spaced color="white" />

    <q-item>
      <q-item-section>
        <q-item-label>Draw Line</q-item-label>
        <q-item-label caption>Show line with length</q-item-label>
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
import Line from 'src/model/Line';
import { ref, computed } from 'vue';
import AColorPicker from 'src/components/AColorPicker.vue';
import { degreesToRadians, radiansToDegrees } from 'src/model/helper';
import { matchedRouteKey } from 'vue-router';

const props = defineProps({
  line: Line,
});

const line = computed(() => props.line);

const emit = defineEmits(['rotateGraph']);

function makeVertical() {
  const r = Math.PI / 2 - props.line.radian(props.line.ends[0]);
  if (Math.abs(r) < 0.001) {
    emit('rotateGraph', Math.PI, props.line.ends[0]);
  } else {
    emit('rotateGraph', r, props.line.ends[0]);
  }
}

function makeHorizontal() {
  const r = Math.PI - props.line.radian(props.line.ends[0]);
  if (Math.abs(r) < 0.001) {
    emit('rotateGraph', Math.PI, props.line.ends[0]);
  } else {
    emit('rotateGraph', r, props.line.ends[0]);
  }
}

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
  set: (val) => {
    line.value.style.color = val;
    console.log(val);
  },
});

const round = computed({
  get: () => line.value.style.round,
  set: (val) => (line.value.style.round = val),
});
</script>
