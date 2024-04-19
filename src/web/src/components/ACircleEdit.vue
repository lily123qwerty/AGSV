<template>
  <q-list padding>
    <q-item-label header class="text-h6 text-primary"
      >Edit Circle: {{ desc || circle.key }}</q-item-label
    >

    <q-item>
      <q-item-section>
        <q-input label="Area" :model-value="area" readonly />
      </q-item-section>
    </q-item>

    <q-separator spaced color="white" />

    <q-item>
      <q-item-section>
        <q-item-label>Draw Circle</q-item-label>
        <q-item-label caption>Fill circle with color</q-item-label>
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

    <q-item class="q-mt-lg">
      <q-item-section>
        <q-btn outline color="warning" label="Delete" @click="onDelete" />
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script setup>
import Circle from 'src/model/Circle';
import { ref, computed } from 'vue';
import { useQuasar, Notify } from 'quasar';
import AColorPicker from 'src/components/AColorPicker.vue';
import { useUserStore } from '../stores/user';
import { useGraphStore } from '../stores/graph';

const $q = useQuasar();
const userStore = useUserStore();
const store = useGraphStore();

const props = defineProps({
  circle: Circle,
});

const circle = computed(() => props.circle);

const area = computed(() => props.circle.area);

const desc = computed(() => circle.value.label);

const visible = computed({
  get: () => circle.value.style.visible,
  set: (val) => (circle.value.style.visible = val),
});

const color = computed({
  get: () => circle.value.style.color,
  set: (val) => (circle.value.style.color = val),
});

const round = computed({
  get: () => circle.value.style.round,
  set: (val) => (circle.value.style.round = val),
});

function onDelete() {
  $q.dialog({
    title: 'Confirm',
    message: 'Are you sure to delete the circle?',
    ok: {
      label: 'delete',
    },
    cancel: true,
    persistent: false,
  }).onOk(() => {
    store.historyPush();
    store.graph.deleteCircle(circle.value);
    userStore.editingObject = false;
  });
}
</script>
