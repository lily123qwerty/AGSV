<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin" style="width: 560px">
      <!--
        ...content
        ... use q-card-section for it?
      -->
      <q-card-section>
        <div class="text-h6">Add Triangle</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <div class="row item-start">
          <div class="col q-ma-sm">
            <q-select
              v-model="vals['dot1']"
              :options="options['dot1']"
              label="Dot 1"
              :disable="
                vals.angle1 ||
                vals.angle2 ||
                vals.angle3 ||
                vals.side12 ||
                vals.side23 ||
                vals.side31
              "
            />
          </div>
          <div class="col q-ma-sm">
            <q-select
              v-model="vals['dot2']"
              :options="options['dot2']"
              label="Dot 2"
              :disable="
                vals.angle1 ||
                vals.angle2 ||
                vals.angle3 ||
                vals.side12 ||
                vals.side23 ||
                vals.side31
              "
            />
          </div>
          <div class="col q-ma-sm">
            <q-select
              v-model="vals['dot3']"
              :options="options['dot3']"
              label="Dot 3"
              :disable="
                vals.angle1 ||
                vals.angle2 ||
                vals.angle3 ||
                vals.side12 ||
                vals.side23 ||
                vals.side31
              "
            />
          </div>
        </div>
        <div class="row items-start">
          <div class="col q-ma-sm">
            <q-select
              v-model="vals['side12']"
              :options="options['side12']"
              label="Side 1-2"
              use-input
              @input-value="(val) => inputFn(val, 'side12')"
              @new-value="(val, done) => done(val)"
              @filter="
                (val, update) => filterFn(val, update, 'allLines', 'side12')
              "
              @blur="() => blurFn('side12')"
              :disable="
                vals.dot1 ||
                vals.dot2 ||
                vals.dot3 ||
                (angle3 && (angle1 || angle2))
              "
            />
          </div>
          <div class="col q-ma-sm">
            <q-select
              v-model="vals['side23']"
              :options="options['side23']"
              label="Side 2-3"
              use-input
              @input-value="(val) => inputFn(val, 'side23')"
              @new-value="(val, done) => done(val)"
              @filter="
                (val, update) => filterFn(val, update, 'allLines', 'side23')
              "
              @blur="() => blurFn('side23')"
              :disable="
                vals.dot1 ||
                vals.dot2 ||
                vals.dot3 ||
                (angle1 && (angle2 || angle3))
              "
            />
          </div>
          <div class="col q-ma-sm">
            <q-select
              v-model="vals['side31']"
              :options="options['side31']"
              label="Side 3-1"
              use-input
              @input-value="(val) => inputFn(val, 'side31')"
              @new-value="(val, done) => done(val)"
              @filter="
                (val, update) => filterFn(val, update, 'allLines', 'side31')
              "
              @blur="() => blurFn('side31')"
              :disable="
                vals.dot1 ||
                vals.dot2 ||
                vals.dot3 ||
                (angle2 && (angle1 || angle3))
              "
            />
          </div>
        </div>
        <div class="row items-start">
          <div class="col q-ma-sm">
            <q-select
              v-model="vals['angle1']"
              :options="options['angle1']"
              label="Angle 1"
              use-input
              @input-value="(val) => inputFn(val, 'angle1')"
              @new-value="(val, done) => done(val)"
              @filter="
                (val, update) => filterFn(val, update, 'allAngles', 'angle1')
              "
              @blur="() => blurFn('angle1')"
              :disable="
                vals.dot1 ||
                vals.dot2 ||
                vals.dot3 ||
                (side23 && (angle2 || angle3))
              "
            />
          </div>
          <div class="col q-ma-sm">
            <q-select
              v-model="vals['angle2']"
              :options="options['angle2']"
              label="Angle 2"
              use-input
              @input-value="(val) => inputFn(val, 'angle2')"
              @new-value="(val, done) => done(val)"
              @filter="
                (val, update) => filterFn(val, update, 'allAngles', 'angle2')
              "
              @blur="() => blurFn('angle2')"
              :disable="
                vals.dot1 ||
                vals.dot2 ||
                vals.dot3 ||
                (side31 && (angle1 || angle3))
              "
            />
          </div>
          <div class="col q-ma-sm">
            <q-select
              v-model="vals['angle3']"
              :options="options['angle3']"
              label="Angle 3"
              use-input
              @input-value="(val) => inputFn(val, 'angle3')"
              @new-value="(val, done) => done(val)"
              @filter="
                (val, update) => filterFn(val, update, 'allAngles', 'angle3')
              "
              @blur="() => blurFn('angle3')"
              :disable="
                vals.dot1 ||
                vals.dot2 ||
                vals.dot3 ||
                (side12 && (angle1 || angle2))
              "
            />
          </div>
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
import { isInDestructureAssignment } from 'vue/compiler-sfc';

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

const allOptions = {
  allDots: Object.entries(store.graph.dots).map(([key, obj]) => key),
  allLines: Object.entries(store.graph.lines).map(([key, obj]) => key),
  allAngles: Object.entries(store.graph.angles).map(([key, obj]) => key),
};

const options = ref({
  dot1: allOptions['allDots'],
  dot2: allOptions['allDots'],
  dot3: allOptions['allDots'],
  side12: allOptions['allLines'],
  side23: allOptions['allLines'],
  side31: allOptions['allLines'],
  angle1: allOptions['allAngles'],
  angle2: allOptions['allAngles'],
  angle3: allOptions['allAngles'],
});

const vals = ref({
  dot1: null,
  dot2: null,
  dot3: null,
  angle1: null,
  angle2: null,
  angle3: null,
  side12: null,
  side23: null,
  side31: null,
});

const inputVals = ref({});

function inputFn(val, key) {
  inputVals.value[key] = val;
}

function filterFn(val, update, optionKey, key) {
  if (val === '') {
    update(() => {
      options.value[key] = allOptions[optionKey];

      // here you have access to "ref" which
      // is the Vue reference of the QSelect
    });
    return;
  }

  update(() => {
    const needle = val.toLowerCase();
    options.value[key] = allOptions[optionKey].filter(
      (v) => v.toLowerCase().indexOf(needle) > -1
    );
  });
}

function blurFn(key) {
  if (inputVals.value[key]) {
    vals.value[key] = inputVals.value[key];
  }
}

/*-- Following code needs modifying --*/

// this is part of our example (so not required)
function onOKClick() {
  let angle1 = vals.value.angle1;
  let angle2 = vals.value.angle2;
  let angle3 = vals.value.angle3;
  let side12 = vals.value.side12;
  let side23 = vals.value.side23;
  let side31 = vals.value.side31;
  let dot1 = vals.value.dot1;
  let dot2 = vals.value.dot2;
  let dot3 = vals.value.dot3;

  // 3dots
  if (dot1 && dot2 && dot3) {
    store.addTriangleBy3Dot(
      store.graph.dots[dot1],
      store.graph.dots[dot2],
      store.graph.dots[dot3]
    );
  }

  // 3sides
  if (side12 && side23 && side31) {
    if (isNaN(side12)) {
      store.addTriangleBy3Side(
        store.graph.lines[side12],
        parseFloat(side23),
        parseFloat(side31)
      );
    } else if (isNaN(side23)) {
      store.addTriangleBy3Side(
        store.graph.lines[side23],
        parseFloat(side31),
        parseFloat(side12)
      );
    } else if (isNaN(side31)) {
      store.addTriangleBy3Side(
        store.graph.lines[side31],
        parseFloat(side12),
        parseFloat(side23)
      );
    } else {
      store.addTriangleBy3Side(
        parseFloat(side12),
        parseFloat(side23),
        parseFloat(side31)
      );
    }
  }

  if (angle1) {
    if (isNaN(angle1)) {
      angle1 = store.graph.angles[angle1];
    } else {
      angle1 = parseFloat(angle1);
    }

    // 2angle 1 side
    if (angle2 && side12) {
      if (isNaN(side12)) {
        side12 = store.graph.lines[side12];
      } else {
        side12 = parseFloat(side12);
      }
      if (side12) {
        store.addTriangleBy2Angle1Side(angle1, angle2, side12);
      }
    }
    if (angle3 && side31) {
      if (isNaN(side31)) {
        side31 = store.graph.lines[side31];
      } else {
        side31 = parseFloat(side31);
      }
      if (side31) {
        store.addTriangleBy2Angle1Side(angle3, angle1, side31);
      }
    }

    // inner angle 2 side
    if (side12 && side31) {
      if (isNaN(side12)) {
        side12 = store.graph.lines[side12];
        store.addTriangleByInnerAngle2Side(angle1, side12, parseFloat(side31));
      } else if (isNaN(side31)) {
        side31 = store.graph.lines[side31];
        store.addTriangleByInnerAngle2Side(angle1, side23, parseFloat(side31));
      } else {
        side12 = parseFloat(side12);
        side31 = parseFloat(side31);
        store.addTriangleByInnerAngle2Side(angle1, side12, side31);
      }
    }

    // outer angle 2 side
    if (side12 && side23) {
      if (isNaN(side12)) {
        side12 = store.graph.lines[side12];
      } else {
        side12 = parseFloat(side12);
      }
      if (isNaN(side23)) {
        side23 = store.graph.lines[side23];
      } else {
        side23 = parseFloat(side23);
      }
      store.addTriangleByOuterAngle2Side(angle1, side12, side23);
    }
  }

  if (angle2) {
    if (isNaN(angle2)) {
      angle2 = store.graph.angles[angle2];
    } else {
      angle2 = parseFloat(angle2);
    }
    // 2angle 1 side
    if (angle3 && side23) {
      if (isNaN(side23)) {
        side23 = store.graph.lines[side23];
      } else {
        side23 = parseFloat(side23);
      }
      if (side23) {
        store.addTriangleBy2Angle1Side(angle2, angle3, side23);
      }
    }
    if (angle1 && side12) {
      if (isNaN(side12)) {
        side12 = store.graph.lines[side12];
      } else {
        side12 = parseFloat(side12);
      }
      if (side12) {
        store.addTriangleBy2Angle1Side(angle1, angle2, side12);
      }
    }

    // inner angle 2 side
    if (side12 && side23) {
      if (isNaN(side12)) {
        side12 = store.graph.lines[side12];
        store.addTriangleByInnerAngle2Side(angle2, side12, parseFloat(side23));
      } else if (isNaN(side23)) {
        side23 = store.graph.lines[side23];
        store.addTriangleByInnerAngle2Side(angle2, side23, parseFloat(side12));
      } else {
        side12 = parseFloat(side12);
        side23 = parseFloat(side23);
        store.addTriangleByInnerAngle2Side(angle2, side12, side23);
      }
    }

    // outer angle 2 side
    if (side23 && side31) {
      if (isNaN(side23)) {
        side23 = store.graph.lines[side23];
      } else {
        side23 = parseFloat(side23);
      }
      if (isNaN(side31)) {
        side31 = store.graph.lines[side31];
      } else {
        side31 = parseFloat(side31);
      }
      store.addTriangleByOuterAngle2Side(angle2, side23, side31);
    }
  }

  if (angle3) {
    if (isNaN(angle3)) {
      angle3 = store.graph.angles[angle3];
    } else {
      angle3 = parseFloat(angle3);
    }
    // 2angle 1 side
    if (angle1 && side31) {
      if (isNaN(side31)) {
        side31 = store.graph.lines[side31];
      } else {
        side31 = parseFloat(side31);
      }
      if (side31) {
        store.addTriangleBy2Angle1Side(angle3, angle1, side31);
      }
    }
    if (angle2 && side31) {
      if (isNaN(side31)) {
        side31 = store.graph.lines[side31];
      } else {
        side31 = parseFloat(side31);
      }
      if (side31) {
        store.addTriangleBy2Angle1Side(angle3, angle1, side31);
      }
    }

    // inner angle 2 side
    if (side23 && side31) {
      if (isNaN(side23)) {
        side23 = store.graph.lines[side23];
        store.addTriangleByInnerAngle2Side(angle3, side23, parseFloat(side31));
      } else if (isNaN(side31)) {
        side31 = store.graph.lines[side31];
        store.addTriangleByInnerAngle2Side(angle3, side31, parseFloat(side23));
      } else {
        side23 = parseFloat(side23);
        side31 = parseFloat(side31);
        store.addTriangleByInnerAngle2Side(angle3, side23, side31);
      }
    }

    // outer angle 2 side
    if (side31 && side12) {
      if (isNaN(side31)) {
        side31 = store.graph.lines[side31];
      } else {
        side31 = parseFloat(side31);
      }
      if (isNaN(side12)) {
        side12 = store.graph.lines[side12];
      } else {
        side12 = parseFloat(side12);
      }
      store.addTriangleByOuterAngle2Side(angle3, side31, side12);
    }
  }
  store.historyPush();

  onDialogOK();
}
</script>
