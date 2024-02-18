<template>
  <q-layout view="hHh lpR fFf">
    <q-header class="bg-primary text-white q-gutter-x-sm" height-hint="98">
      <q-toolbar>
        <!-- <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" /> -->

        <q-toolbar-title>
          &nbsp;
          <q-avatar square>
            <img src="agsv-icon.svg" />
          </q-avatar>
          AGSV
          <!-- new shape button group -->

          <q-btn-group outline rounded class="first-btns">
            <q-btn
              outline
              :size="btnSize"
              icon="mdi-triangle-outline"
              @click="popupAddTriangle"
            >
              <q-tooltip class="tooltip">Add a triangle</q-tooltip></q-btn
            >
            <q-btn outline :size="btnSize" icon="mdi-circle-outline"
              ><q-tooltip class="tooltip">Add a cycle</q-tooltip></q-btn
            >
            <q-btn outline :size="btnSize" icon="mdi-square-outline"
              ><q-tooltip class="tooltip">Add a parallelogram</q-tooltip></q-btn
            >
            <q-btn outline :size="btnSize" icon="svguse:myicons.svg#trapezium"
              ><q-tooltip class="tooltip">Add a trapezium</q-tooltip></q-btn
            >
            <q-btn
              outline
              :size="btnSize"
              icon="mdi-hexagon-outline"
              @click="store.graph.rotate(1)"
              ><q-tooltip class="tooltip"
                >Add a regular polygon</q-tooltip
              ></q-btn
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
              ><q-tooltip class="tooltip">Save and quit</q-tooltip></q-btn
            >
          </q-btn-group>

          <!-- <q-btn class="q-ml-sm" color="secondary" label="test" @click="test" />
          <q-btn class="q-ml-sm" square color="secondary" icon="home" />
          <q-btn class="q-ml-sm" square color="secondary" icon="save" /> -->

          <!-- pop ups for creating new shape -->
        </q-toolbar-title>
        <q-btn
          v-if="!userStore.user"
          outline
          style="color: white"
          label="Login"
          to="/user/login"
        />
        <q-btn
          v-if="userStore.user"
          outline
          style="color: white"
          label="Logout"
          @click="userStore.logout"
        />
        <q-btn
          v-if="rightDrawerOpen"
          dense
          flat
          round
          icon="close"
          @click="toggleRightDrawer"
        />
      </q-toolbar>

      <!-- <q-tabs align="left">
                <q-route-tab to="/page1" label="Page One" />
                <q-route-tab to="/page2" label="Page Two" />
                <q-route-tab to="/page3" label="Page Three" />
            </q-tabs> -->
    </q-header>

    <q-drawer v-model="leftDrawerOpen" side="left" bordered>
      <!-- drawer content -->
      <div class="q-pa-md q-gutter-sm">
        <a-tree-view @select-shape="onSelectShape" />
      </div>
    </q-drawer>

    <q-drawer v-model="rightDrawerOpen" side="right" bordered>
      <!-- drawer content -->
      <a-dot-edit v-if="selectedShapeClass == 'Dot'" :dot="selectedShape" />
      <a-line-edit
        v-if="selectedShapeClass == 'Line'"
        :line="selectedShape"
        @rotate-graph="onRotateGraph"
      />
      <a-angle-edit
        v-if="selectedShapeClass == 'Angle'"
        :angle="selectedShape"
      />
      <a-triangle-edit
        v-if="selectedShapeClass == 'Triangle'"
        :triangle="selectedShape"
      />
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue';
import { useGraphStore } from 'stores/graph';
import Graph from '../model/Graph';
import ATreeView from 'src/components/ATreeView.vue';
import { useQuasar } from 'quasar';
import PopupAddTriangle from 'src/components/PopupAddTriangle.vue';
import ADotEdit from 'src/components/ADotEdit.vue';
import ALineEdit from 'src/components/ALineEdit.vue';
import AAngleEdit from 'src/components/AAngleEdit.vue';
import ATriangleEdit from 'src/components/ATriangleEdit.vue';
import { useUserStore } from '../stores/user';
import { useRouter } from 'vue-router';

const router = useRouter();

const store = useGraphStore();
const userStore = useUserStore();

const btnSize = ref('13px');

const leftDrawerOpen = ref(true);
const rightDrawerOpen = ref(false);

const isSaving = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
function toggleRightDrawer() {
  rightDrawerOpen.value = !rightDrawerOpen.value;
}

function undo() {
  store.historyUndo();
  rightDrawerOpen.value = false;
}

function redo() {
  store.historyRedo();
  rightDrawerOpen.value = false;
}

async function save() {
  try {
    isSaving.value = true;
    await userStore.save(store.graph);
    isSaving.value = false;
    router.push('/home');
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

const selectedShape = ref(null);
const selectedShapeClass = ref(null);

function onSelectShape(obj) {
  selectedShape.value = obj;
  selectedShapeClass.value = obj.constructor.name;
  rightDrawerOpen.value = true;
}

function editQuestion() {
  $q.dialog({
    title: 'Question',
    message: 'Enter question:',
    prompt: {
      model: store.graph.question,
      type: 'text', // optional
      autogrow: true,
    },
    cancel: true,
    persistent: true,
  })
    .onOk((data) => {
      store.graph.question = data;
      // console.log('>>>> OK, received', data);
    })
    .onCancel(() => {
      // console.log('>>>> Cancel')
    })
    .onDismiss(() => {
      // console.log('I am triggered on both OK and Cancel')
    });
}

function onRotateGraph(r, c) {
  store.graph.rotate(r, c);
}
</script>

<style lang="scss">
.first-btns {
  margin-left: 180px;
}

.tooltip {
  font-size: 14px;
  background-color: $accent;
}

.q-knob--editable:focus:before {
  box-shadow: none !important;
}

body.body--dark .q-knob--editable:focus:before {
  box-shadow: $dark-shadow-2;
}
</style>
