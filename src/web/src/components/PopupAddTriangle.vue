<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <!--
        ...content
        ... use q-card-section for it?
      -->
      <q-card-section>
        <div class="text-h6">add triangle</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <div class="q-pa-md">
          <q-card>
            <q-tabs
              v-model="tab"
              dense
              class="text-grey"
              active-color="primary"
              indicator-color="primary"
              align="justify"
              narrow-indicator
            >
              <q-tab name="2Angle1Side" label="2 angle 1 side" />
              <q-tab name="innerAngle2Side" label="inner angle 2 side" />
              <q-tab name="movies" label="Movies" />
            </q-tabs>

            <q-separator />

            <q-tab-panels
              v-model="tab"
              animated
              transition-prev="jump-up"
              transition-next="jump-up"
            >
              <q-tab-panel name="2Angle1Side">
                <div class="q-gutter-md" style="max-width: 300px">
                  <q-input
                    v-model="angle1"
                    label="angle 1"
                    :rules="[checkAngle]"
                  />
                  <q-input
                    v-model="angle2"
                    label="angle 2"
                    :rules="[
                      (val) =>
                        (val > 0 && val < 180) ||
                        'angle must between 0 and 180 degree',
                    ]"
                  />
                  <q-input
                    v-model="side1"
                    label="side 1"
                    :rules="[checkSide]"
                  />
                </div>
              </q-tab-panel>

              <q-tab-panel name="innerAngle2Side">
                <div class="q-gutter-md" style="max-width: 300px">
                  <q-input
                    v-model="angle1"
                    label="angle 1"
                    :rules="[checkAngle]"
                  />
                  <q-input
                    v-model="side1"
                    label="side 1"
                    :rules="[checkSide]"
                  />
                  <q-input
                    v-model="side2"
                    label="side 2"
                    :rules="[checkSide]"
                  />
                </div>
              </q-tab-panel>
              <!-- <q-tab-panel name="alarms">
                                <div class="text-h6">Alarms</div>
                                Lorem ipsum dolor sit amet consectetur
                                adipisicing elit.
                            </q-tab-panel>

                            <q-tab-panel name="movies">
                                <div class="text-h6">Movies</div>
                                Lorem ipsum dolor sit amet consectetur
                                adipisicing elit.
                            </q-tab-panel> -->
            </q-tab-panels>
          </q-card>
        </div>
      </q-card-section>

      <!-- buttons example -->
      <q-card-actions align="right">
        <q-btn color="primary" label="Cancel" @click="onDialogCancel" />
        <q-btn color="primary" label="OK" @click="onOKClick" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useDialogPluginComponent } from 'quasar';
import { ref } from 'vue';
import { useGraphStore } from 'stores/graph';

const store = useGraphStore();

const props = defineProps({
  // ...your custom props
});

defineEmits([
  // REQUIRED; need to specify some events that your
  // component will emit through useDialogPluginComponent()
  ...useDialogPluginComponent.emits,
]);

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent();
// dialogRef      - Vue ref to be applied to QDialog
// onDialogHide   - Function to be used as handler for @hide on QDialog
// onDialogOK     - Function to call to settle dialog with "ok" outcome
//                    example: onDialogOK() - no payload
//                    example: onDialogOK({ /*...*/ }) - with payload
// onDialogCancel - Function to call to settle dialog with "cancel" outcome

// this is part of our example (so not required)
function onOKClick() {
  if (tab.value == '2Angle1Side') {
    let s1 = side1.value;
    let a1 = angle1.value;
    //TODO: check a1, make sure only a1 can input key
    if (isNaN(s1)) {
      s1 = store.graph.lines[s1];
    } else {
      s1 = parseInt(s1);
    }

    if (isNaN(a1)) {
      a1 = store.graph.angles[a1];
    } else {
      a1 = parseInt(a1);
    }
    if (s1) {
      store.addTriangleBy2Angle1Side(a1, angle2.value, s1);
      store.historyPush();
      // let c = store.graph.center;
      // store.graph.translate(
      //     store.viewBox.width / 2 - c.x,
      //     store.viewBox.height / 2 - c.y
      // );
    }
  } else if (tab.value == 'innerAngle2Side') {
    let s1 = side1.value;
    let s2 = side2.value;
    let a1 = angle1.value;
    //TODO: check a1, make sure only a1 can input key
    if (isNaN(s1)) {
      s1 = store.graph.lines[s1];
    } else {
      s1 = parseInt(s1);
    }
    if (isNaN(s2)) {
      s2 = store.graph.lines[s2];
    } else {
      s2 = parseInt(s2);
    }
    if (isNaN(a1)) {
      a1 = store.graph.angles[a1];
    } else {
      a1 = parseInt(a1);
    }

    if (s1) {
      store.addTriangleByInnerAngle2Side(a1, s1, s2);
      store.historyPush();
    }
  }

  onDialogOK();
}

function checkSide(val) {
  if (isNaN(val)) {
    if (store.graph.lines[val]) {
      return true;
    } else {
      return 'invalid line key';
    }
  } else if (val <= 0) {
    return 'invalid number';
  } else {
    return true;
  }
}

function checkAngle(val) {
  if (isNaN(val)) {
    if (store.graph.angles[val]) {
      return true;
    } else {
      return 'invalid line key';
    }
  } else if (val < 0 || val > 180) {
    return 'invalid number';
  } else {
    return true;
  }
}

const tab = ref('2Angle1Side');
const splitterModel = ref(20);
const direction = ref(1);
const angle1 = ref(60);
const angle2 = ref(60);
const side1 = ref(100);
const side2 = ref(100);
</script>
