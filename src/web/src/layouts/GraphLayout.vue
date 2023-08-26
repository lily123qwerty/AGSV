<template>
  <q-layout view="hHh lpR fFf">
    <q-header class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <!-- <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" /> -->

        <q-toolbar-title>
          <q-avatar square>
            <img src="agsv-icon.svg" />
          </q-avatar>
          AGSV
          <!-- new shape button group -->
          <q-btn-group class="q-ml-lg">
            <q-btn
              color="secondary"
              icon="mdi-triangle-outline"
              @click="popupAddTriangle"
            />
            <q-btn
              color="secondary"
              icon="mdi-circle-outline"
              @click="showAddCircle = true"
            />
            <q-btn
              color="secondary"
              icon="mdi-square-outline"
              @click="showAddParallelogram = true"
            />
            <q-btn
              color="secondary"
              icon="svguse:myicons.svg#trapezium"
              @click="showAddTrapezium = true"
            />
            <q-btn
              color="secondary"
              icon="mdi-hexagon-outline"
              @click="showAddPolygon = true"
            />
          </q-btn-group>

          <q-btn class="q-ml-sm" color="secondary" label="test" @click="test" />
          <q-btn class="q-ml-sm" square color="secondary" icon="home" />
          <q-btn class="q-ml-sm" square color="secondary" icon="save" />

          <!-- pop ups for creating new shape -->

          <q-dialog v-model="showAddCircle">
            <q-card style="width: 700px; max-width: 80vw">
              <q-card-section>
                <div class="text-h6">add circle</div>
              </q-card-section>

              <q-card-section class="q-pt-none">
                Click/Tap on the backdrop.
              </q-card-section>

              <q-card-actions align="right" class="bg-white text-teal">
                <q-btn flat label="OK" v-close-popup />
              </q-card-actions>
            </q-card>
          </q-dialog>

          <q-dialog v-model="showAddParallelogram">
            <q-card style="width: 700px; max-width: 80vw">
              <q-card-section>
                <div class="text-h6">add parallelogram</div>
              </q-card-section>

              <q-card-section class="q-pt-none">
                Click/Tap on the backdrop.
              </q-card-section>

              <q-card-actions align="right" class="bg-white text-teal">
                <q-btn flat label="OK" v-close-popup />
              </q-card-actions>
            </q-card>
          </q-dialog>

          <q-dialog v-model="showAddTrapezium">
            <q-card style="width: 700px; max-width: 80vw">
              <q-card-section>
                <div class="text-h6">add trapezium</div>
              </q-card-section>

              <q-card-section class="q-pt-none">
                Click/Tap on the backdrop.
              </q-card-section>

              <q-card-actions align="right" class="bg-white text-teal">
                <q-btn flat label="OK" v-close-popup />
              </q-card-actions>
            </q-card>
          </q-dialog>

          <q-dialog v-model="showAddPolygon">
            <q-card style="width: 700px; max-width: 80vw">
              <q-card-section>
                <div class="text-h6">add regular polygon</div>
              </q-card-section>

              <q-card-section class="q-pt-none">
                Click/Tap on the backdrop.
              </q-card-section>

              <q-card-actions align="right" class="bg-white text-teal">
                <q-btn flat label="OK" v-close-popup />
              </q-card-actions>
            </q-card>
          </q-dialog>
        </q-toolbar-title>

        <q-btn dense flat round icon="menu" @click="toggleRightDrawer" />
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
      <a-dot-edit
        v-if="selectedShapeClass == 'Dot'"
        :dot="selectedShape"
        @closeRightDrawer="toggleRightDrawer"
      />
      <a-line-edit v-if="selectedShapeClass == 'Line'" />
      <a-angle-edit
        v-if="selectedShapeClass == 'Angle'"
        :angle="selectedShape"
        @closeRightDrawer="toggleRightDrawer"
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

const store = useGraphStore();

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

//pop up control
const showAddTriangle = ref(false);
const showAddCircle = ref(false);
const showAddParallelogram = ref(false);
const showAddTrapezium = ref(false);
const showAddPolygon = ref(false);

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
