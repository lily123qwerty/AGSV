<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin" style="width: 560px">
      <!--
        ...content
        ... use q-card-section for it?
      -->
      <q-card-section>
        <div class="text-h6">Add Circle</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <div class="row item-start">
          <div class="col q-ma-sm">
            <q-select
              v-model="vals['center']"
              :options="options['center']"
              label="Center"
              use-input
              @input-value="(val) => inputFn(val, 'center')"
              @new-value="(val, done) => done(val)"
              @filter="
                (val, update) => filterFn(val, update, 'allDots', 'center')
              "
              @blur="() => blurFn('center')"
              :disable="
                vals.dot1 ||
                vals.dot2 ||
                vals.dot3 ||
                (vals.angle3 && (vals.angle1 || vals.angle2))
              "
            />
          </div>
          <div class="col q-ma-sm">
            <q-select
              v-model="vals['radius']"
              :options="options['radius']"
              label="radius"
              use-input
              @input-value="(val) => inputFn(val, 'radius')"
              @new-value="(val, done) => done(val)"
              @filter="
                (val, update) => filterFn(val, update, 'allLines', 'radius')
              "
              @blur="() => blurFn('radius')"
              :disable="vals.diameter"
            />
          </div>
          <div class="col q-ma-sm">
            <q-select
              v-model="vals['diamter']"
              :options="options['diameter']"
              label="diameter"
              use-input
              @input-value="(val) => inputFn(val, 'diameter')"
              @new-value="(val, done) => done(val)"
              @filter="
                (val, update) => filterFn(val, update, 'allLines', 'diameter')
              "
              @blur="() => blurFn('diameter')"
              :disable="vals.radius"
            />
          </div>
          <div class="col q-ma-sm">
            <q-toggle v-model="vals['semiCircle']" label="semi circle" />
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
};

const options = ref({
  center: allOptions['allDots'],
  radius: allOptions['allLines'],
  diameter: allOptions['allLines'],
});

const vals = ref({
  center: null,
  radius: null,
  diameter: null,
  semiCircle: false,
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
  let center = vals.value.center;
  let radius = vals.value.radius;
  let diameter = vals.value.diameter;
  let semiCircle = vals.value.semiCircle;

  if (!center) {
    center = { x: 50, y: 50 };
  } else {
    center = store.graph.dots[center];
  }

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
