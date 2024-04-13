<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin" style="width: 560px">
      <!--
        ...content
        ... use q-card-section for it?
      -->
      <q-card-section>
        <div class="row justify-between items-center">
          <div class="text-h6">Add Triangle</div>
          <q-select
            outlined
            dense
            v-model="method"
            :options="allMethod"
            emit-value
            map-options
            label="Method"
          />
        </div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <div class="row item-start">
          <div class="col q-gutter-sm">
            <q-select
              v-if="method == 'ddd'"
              v-model="vals['dot1']"
              :options="options['dot1']"
              emit-value
              map-options
              label="Dot A"
            />

            <q-select
              v-if="method == 'ddd'"
              v-model="vals['dot2']"
              :options="options['dot2']"
              emit-value
              map-options
              label="Dot B"
            />

            <q-select
              v-if="method == 'ddd'"
              v-model="vals['dot3']"
              :options="options['dot3']"
              emit-value
              map-options
              label="Dot C"
            />

            <q-select
              v-if="
                method == 'aaa' ||
                method == 'aas' ||
                method == 'asa' ||
                method == 'ass' ||
                method == 'sas'
              "
              v-model="vals['angle1']"
              :options="options['angle1']"
              emit-value
              map-options
              label="Angle a"
              use-input
              @input-value="(val) => inputFn(val, 'angle1')"
              @new-value="(val, done) => done(val)"
              @filter="
                (val, update) => filterFn(val, update, 'allAngles', 'angle1')
              "
              @blur="() => blurFn('angle1')"
            />

            <!-- <q-select
              v-if="
                method == 'aaa' ||
                method == 'aas' ||
                method == 'asa' ||
                method == 'sas'
              "
              v-model="vals['angle2']"
              :options="options['angle2']"
              emit-value
              map-options
              label="Angle b"
              use-input
              @input-value="(val) => inputFn(val, 'angle2')"
              @new-value="(val, done) => done(val)"
              @filter="
                (val, update) => filterFn(val, update, 'allAngles', 'angle2')
              "
              @blur="() => blurFn('angle2')"
            /> -->

            <q-input
              v-if="method == 'aaa' || method == 'aas' || method == 'asa'"
              v-model="vals['angle2']"
              label="Angle b"
            />

            <q-select
              v-if="method == 'aaa'"
              v-model="vals['angle3']"
              :options="options['angle3']"
              emit-value
              map-options
              label="Angle c"
              use-input
              @input-value="(val) => inputFn(val, 'angle3')"
              @new-value="(val, done) => done(val)"
              @filter="
                (val, update) => filterFn(val, update, 'allAngles', 'angle3')
              "
              @blur="() => blurFn('angle3')"
            />

            <q-select
              v-if="
                method == 'sss' ||
                method == 'asa' ||
                method == 'ass' ||
                method == 'sas'
              "
              v-model="vals['side12']"
              :options="options['side12']"
              emit-value
              map-options
              label="Side AB"
              use-input
              @input-value="(val) => inputFn(val, 'side12')"
              @new-value="(val, done) => done(val)"
              @filter="
                (val, update) => filterFn(val, update, 'allLines', 'side12')
              "
              @blur="() => blurFn('side12')"
            />

            <q-select
              v-if="method == 'sss' || method == 'aas' || method == 'ass'"
              v-model="vals['side23']"
              :options="options['side23']"
              emit-value
              map-options
              label="Side BC"
              use-input
              @input-value="(val) => inputFn(val, 'side23')"
              @new-value="(val, done) => done(val)"
              @filter="
                (val, update) => filterFn(val, update, 'allLines', 'side23')
              "
              @blur="() => blurFn('side23')"
            />

            <!-- <q-select
              v-if="method == 'sss' || method == 'sas'"
              v-model="vals['side31']"
              :options="options['side31']"
              emit-value
              map-options
              label="Side AC"
              use-input
              @input-value="(val) => inputFn(val, 'side31')"
              @new-value="(val, done) => done(val)"
              @filter="
                (val, update) => filterFn(val, update, 'allLines', 'side31')
              "
              @blur="() => blurFn('side31')"
            /> -->

            <q-input
              v-if="method == 'sss' || method == 'sas'"
              v-model="vals['side31']"
              label="Side AC"
            />
          </div>
          <div class="col col-7 q-ml-sm">
            <a-demo-triangle :method="method" />
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
import ADemoTriangle from './ADemoTriangle.vue';

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

const method = ref('asa');

const allMethod = [
  // {
  //   value: 'aaa',
  //   label: 'AAA Angle-Angle-Angle',
  // },
  {
    value: 'asa',
    label: 'ASA Angle-Side-Angle',
  },
  {
    value: 'sas',
    label: 'SAS Side-Angle-Side',
  },
  {
    value: 'ass',
    label: 'ASS Angle-Side-Side',
  },
  // {
  //   value: 'aas',
  //   label: 'AAS Angle-Angle-Side',
  // },
  {
    value: 'sss',
    label: 'SSS Side-Side-Side',
  },
  {
    value: 'ddd',
    label: 'DDD Dot-Dot-Dot',
  },
];

const allOptions = {
  allDots: Object.entries(store.graph.dots).map(([key, obj]) => ({
    value: key,
    label: key + (obj.label ? ': ' + obj.label : ''),
  })),
  allLines: Object.entries(store.graph.lines).map(([key, obj]) => ({
    value: key,
    label: key + (obj.label ? ': ' + obj.label : ''),
  })),
  allAngles: Object.entries(store.graph.angles).map(([key, obj]) => ({
    value: key,
    label: key + (obj.label ? ': ' + obj.label : ''),
  })),
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
  // console.log(optionKey, allOptions[optionKey]);
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
      (v) => v.label.toLowerCase().indexOf(needle) > -1
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

  let edited = false;

  if (method.value == 'asa') {
    if (angle1 && angle2 && side12) {
      if (isNaN(angle1)) {
        angle1 = store.graph.angles[angle1];
      } else {
        angle1 = parseFloat(angle1);
      }

      angle2 = parseFloat(angle2);

      if (isNaN(side12)) {
        side12 = store.graph.lines[side12];
      } else {
        side12 = parseFloat(side12);
      }

      store.addTriangleBy2Angle1Side(angle1, angle2, side12);
      edited = true;
    }
  } else if (method.value == 'sas') {
    if (angle1 && side12 && side31) {
      if (isNaN(angle1)) {
        angle1 = store.graph.angles[angle1];
      } else {
        angle1 = parseFloat(angle1);
      }

      if (isNaN(side12)) {
        side12 = store.graph.lines[side12];
      } else {
        side12 = parseFloat(side12);
      }

      side31 = parseFloat(side31);

      store.addTriangleByInnerAngle2Side(angle1, side12, side31);
      edited = true;
    }
  } else if (method.value == 'ass') {
    if (angle1 && side12 && side23) {
      if (isNaN(angle1)) {
        angle1 = store.graph.angles[angle1];
      } else {
        angle1 = parseFloat(angle1);
      }

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
      edited = true;
    }
  } else if (method.value == 'sss') {
    if (side31 && side12 && side23) {
      if (isNaN(side12)) {
        side12 = store.graph.lines[side12];
      } else {
        side12 = parseFloat(side12);
      }

      side23 = parseFloat(side23);
      side31 = parseFloat(side31);

      store.addTriangleBy3Side(side12, side23, side31);
      edited = true;
    }
  } else if (method.value == 'ddd') {
    if (dot1 && dot2 && dot3) {
      store.addTriangleBy3Dot(
        store.graph.dots[dot1],
        store.graph.dots[dot2],
        store.graph.dots[dot3]
      );
      edited = true;
    }
  }

  if (edited) {
    store.historyPush();
  }

  onDialogOK();
}
</script>
