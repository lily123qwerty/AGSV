<template>
  <div class="row justify-center">
    <q-btn-group outline rounded class="first-btns">
      <q-btn
        outline
        :size="btnSize"
        icon="mdi-triangle-outline"
        @click="popupAddTriangle"
      >
        <q-tooltip class="tooltip">Add a triangle</q-tooltip></q-btn
      >
      <q-btn
        outline
        :size="btnSize"
        icon="mdi-circle-outline"
        @click="popupAddCircle"
        ><q-tooltip class="tooltip">Add a cycle</q-tooltip></q-btn
      >
      <q-btn outline :size="btnSize" icon="mdi-square-outline" disabled
        ><q-tooltip class="tooltip">Add a parallelogram</q-tooltip></q-btn
      >
      <q-btn
        outline
        :size="btnSize"
        icon="svguse:myicons.svg#trapezium"
        disabled
        ><q-tooltip class="tooltip">Add a trapezium</q-tooltip></q-btn
      >
      <q-btn
        outline
        :size="btnSize"
        icon="mdi-hexagon-outline"
        @click="store.graph.rotate(1)"
        disabled
        ><q-tooltip class="tooltip">Add a regular polygon</q-tooltip></q-btn
      >
    </q-btn-group>

    <q-btn-group outline rounded class="q-ml-md">
      <q-btn outline :size="btnSize" icon="undo" @click="undo"
        ><q-tooltip class="tooltip">Undo</q-tooltip></q-btn
      >
      <q-btn outline :size="btnSize" icon="redo" @click="redo"
        ><q-tooltip class="tooltip">Redo</q-tooltip></q-btn
      >
      <q-btn
        v-if="userStore.user"
        outline
        :size="btnSize"
        :disabled="isSaving"
        icon="save"
        @click="save"
        ><q-tooltip class="tooltip">Save</q-tooltip></q-btn
      >
      <q-btn
        v-if="userStore.user"
        outline
        :size="btnSize"
        icon="home"
        @click="() => router.push('/home')"
        ><q-tooltip class="tooltip">Home</q-tooltip></q-btn
      >
    </q-btn-group>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useGraphStore } from 'stores/graph';
import { useQuasar, Notify } from 'quasar';
import PopupAddTriangle from 'src/components/PopupAddTriangle.vue';
import PopupAddCircle from 'src/components/PopupAddCircle.vue';
import { useUserStore } from '../stores/user';
import { useRouter, onBeforeRouteLeave } from 'vue-router';

const emit = defineEmits(['hideRight']);

const router = useRouter();
const $q = useQuasar();

const store = useGraphStore();
const userStore = useUserStore();

const btnSize = ref('13px');

const isSaving = ref(false);

onBeforeRouteLeave((to, from, next) => {
  if (store.hasHistory() || store.metaEdited) {
    $q.dialog({
      title: 'Confirm',
      message: 'You have modified the graph. Would you like to discard?',
      ok: {
        label: 'Discard',
      },
      cancel: true,
      persistent: true,
    })
      .onOk(() => {
        store.restoreHistory();
        next();
      })
      .onCancel(() => {});
  } else {
    next();
  }
});

function undo() {
  store.historyUndo();
  emit('hideRight');
}

function redo() {
  store.historyRedo();
  emit('hideRight');
}

async function _save() {
  try {
    isSaving.value = true;
    await userStore.save(store.graph);
    store.historyReset();
    store.metaEdited = false;
    isSaving.value = false;
    // router.push('/home');
    Notify.create({
      message: 'Graph saved.',
      color: 'positive',
      icon: 'check',
      position: 'top',
    });
  } catch (e) {
    isSaving.value = false;
    throw e;
  }
}

async function save() {
  if (
    store.graph.uid &&
    userStore.user &&
    store.graph.uid != userStore.user.uid
  ) {
    $q.dialog({
      title: 'Confirm',
      message: 'You are not owner of the graph. Would you like to make a copy?',
      cancel: true,
      persistent: true,
    }).onOk(() => {
      store.graph.id = null;
      store.graph.uid = null;
      store.graph.highlighted = false;
      store.graph.published = false;
      _save();
    });
  } else {
    _save();
  }
}

//popups
function popupAddTriangle() {
  $q.dialog({
    component: PopupAddTriangle,

    // props forwarded to your custom component
    componentProps: {},
  }).onOk(() => {});
}

// TODO: test circle
function popupAddCircle() {
  $q.dialog({
    component: PopupAddCircle,

    // props forwarded to your custom component
    componentProps: {},
  }).onOk(() => {});
}
</script>

<style lang="scss">
.tooltip {
  font-size: 14px;
  background-color: $secondary;
}
</style>
