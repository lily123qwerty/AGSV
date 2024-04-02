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
      <q-btn outline :size="btnSize" icon="edit" @click="editQuestion"
        ><q-tooltip class="tooltip">question</q-tooltip></q-btn
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
        v-if="userStore.user && !isSaving"
        outline
        :size="btnSize"
        icon="save"
        @click="save"
        ><q-tooltip class="tooltip">Save</q-tooltip></q-btn
      >
      <q-btn
        v-if="userStore.user && !isSaving"
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
import { useQuasar } from 'quasar';
import PopupAddTriangle from 'src/components/PopupAddTriangle.vue';
import PopupAddCircle from 'src/components/PopupAddCircle.vue';
import PopupEditQuestion from 'src/components/PopupEditQuestion.vue';
import { useUserStore } from '../stores/user';
import { useRouter } from 'vue-router';

const emit = defineEmits(['hideRight']);

const router = useRouter();

const store = useGraphStore();
const userStore = useUserStore();

const btnSize = ref('13px');

const isSaving = ref(false);

function undo() {
  store.historyUndo();
  emit('hideRight');
}

function redo() {
  store.historyRedo();
  emit('hideRight');
}

async function save() {
  try {
    isSaving.value = true;
    await userStore.save(store.graph);
    isSaving.value = false;
    // router.push('/home');
  } catch (e) {
    isSaving.value = false;
  }
}

//popups
const $q = useQuasar();
function popupAddTriangle() {
  $q.dialog({
    component: PopupAddTriangle,

    // props forwarded to your custom component
    componentProps: {},
  })
    .onOk(() => {
      console.log('OK');
    })
    .onCancel(() => {
      console.log('Cancel');
    })
    .onDismiss(() => {
      console.log('Called on OK or Cancel');
    });
}

// TODO: test circle
function popupAddCircle() {
  $q.dialog({
    component: PopupAddCircle,

    // props forwarded to your custom component
    componentProps: {},
  })
    .onOk(() => {
      console.log('OK');
    })
    .onCancel(() => {
      console.log('Cancel');
    })
    .onDismiss(() => {
      console.log('Called on OK or Cancel');
    });
}

function editQuestion() {
  $q.dialog({
    component: PopupEditQuestion,

    // props forwarded to your custom component
    componentProps: {
      question: store.graph.question,
      category: store.graph.category,
      published: store.graph.published,
    },
  })
    .onOk((data) => {
      console.log(data);
      store.graph.question = data.question;
      store.graph.category = data.category;
      store.graph.published = data.published;
      // console.log('>>>> OK, received', data);
    })
    .onCancel(() => {
      // console.log('>>>> Cancel')
    })
    .onDismiss(() => {
      // console.log('I am triggered on both OK and Cancel')
    });
}
</script>

<style lang="scss">
.tooltip {
  font-size: 14px;
  background-color: $secondary;
}
</style>
