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

  if (center) {
    center = store.graph.dots[center];
  }
  if (radius) {
    if (isNaN(radius)) {
      radius = store.graph.lines[radius];
    } else {
      radius = parseFloat(radius);
    }
  }
  if (diameter) {
    if (isNaN(diameter)) {
      diameter = store.graph.lines[diameter];
    } else {
      diameter = parseFloat(diameter);
    }
  }

  if (semiCircle) {
  } else {
    store.addCircle(center, radius, diameter);
  }

  store.historyPush();

  onDialogOK();
}
</script>
