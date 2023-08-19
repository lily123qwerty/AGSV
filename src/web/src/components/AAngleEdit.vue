<template>
  <q-toolbar class="bg-cyan text-white">
    <q-toolbar-title>Edit Angle: {{ angle.key }}</q-toolbar-title>
    <q-btn flat round dense icon="close" @click="emit('closeRightDrawer')" />
  </q-toolbar>

  <div class="q-pa-md q-gutter-sm">
    <div class="text-h6 text-cyan q-mt-lg">Basic</div>
    <p class="text-p q-mb-lg q-mt-lg">angle in degree: {{ AngleSize }}</p>
    <q-slider v-model="AngleSize" :min="1" :max="179" label label-always />
    <p class="text-p q-mb-lg q-mt-lg">
      dot: {{ angle.vertex.style.label || angle.vertex.key }}
    </p>
    <p class="text-p q-mb-lg q-mt-lg">
      sides: {{ angle.sides[0].style.label || angle.sides[0].key }},
      {{ angle.sides[1].style.label || angle.sides[1].key }}
    </p>

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

    <p class="text-p q-mb-lg q-mt-lg">size</p>

    <q-slider v-model="size" :min="10" :max="30" label label-always />
  </div>
</template>

<script setup>
import Angle from 'src/model/Angle';
import { ref, computed } from 'vue';
import { degreesToRadians, radiansToDegrees } from 'src/model/helper';

const emit = defineEmits(['closeRightDrawer']);

const props = defineProps({
  angle: Angle,
});

const angle = computed(() => props.angle);

const AngleSize = computed({
  get: () => radiansToDegrees(angle.value.radian),
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
