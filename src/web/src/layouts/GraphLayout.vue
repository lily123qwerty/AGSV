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
              @click="test"
              ><q-tooltip class="tooltip"
                >Add a regular polygon</q-tooltip
              ></q-btn
            >
          </q-btn-group>

          <q-btn-group outline rounded class="q-ml-md">
            <q-btn outline :size="btnSize" icon="undo"
              ><q-tooltip class="tooltip">Undo</q-tooltip></q-btn
            >
            <q-btn outline :size="btnSize" icon="redo"
              ><q-tooltip class="tooltip">Redo</q-tooltip></q-btn
            >
            <q-btn outline :size="btnSize" icon="save"
              ><q-tooltip class="tooltip">Save and quit</q-tooltip></q-btn
            >
          </q-btn-group>

          <!-- <q-btn class="q-ml-sm" color="secondary" label="test" @click="test" />
          <q-btn class="q-ml-sm" square color="secondary" icon="home" />
          <q-btn class="q-ml-sm" square color="secondary" icon="save" /> -->

          <!-- pop ups for creating new shape -->
        </q-toolbar-title>

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
      <a-line-edit v-if="selectedShapeClass == 'Line'" :line="selectedShape" />
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

const store = useGraphStore();

const btnSize = ref('13px');

const leftDrawerOpen = ref(true);
const rightDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
function toggleRightDrawer() {
  rightDrawerOpen.value = !rightDrawerOpen.value;
}
function test() {
  store.test();
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
</script>

<style lang="scss">
.first-btns {
  margin-left: 180px;
}

.tooltip {
  font-size: 14px;
  background-color: $accent;
}
</style>
