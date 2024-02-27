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
            />
          </div>
          <div class="col q-ma-sm">
            <q-select
              v-model="vals['dot2']"
              :options="options['dot2']"
              label="Dot 2"
            />
          </div>
          <div class="col q-ma-sm">
            <q-select
              v-model="vals['dot3']"
              :options="options['dot3']"
              label="Dot 3"
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

//TODO: read from graph
const allOptions = {
  allDots: ['', 'd001 - A', 'd002 - B', 'd003 - C'],
  allLines: ['', 'l004 - A', 'l005 - B', 'l006 - C'],
  allAngles: ['', 'a007 - A', 'a008 - B', 'a009 - C'],
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
  angle1: 60,
  angle2: 60,
  angle3: 60,
  side12: 100,
  side23: 100,
  side31: 100,
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

const angle1 = ref(60);
const angle2 = ref(60);
const side1 = ref(100);
const side2 = ref(100);
const side3 = ref(100);
const dot1 = ref();
const dot2 = ref();
const dot3 = ref();

// this is part of our example (so not required)
function onOKClick() {
  console.log(vals.value['dot1']);
  if (tab.value == '2Angle1Side') {
    let s1 = side1.value;
    let a1 = angle1.value;
    //TODO: check a1, make sure only a1 can input key
    if (isNaN(s1)) {
      s1 = store.graph.lines[s1];
    } else {
      s1 = parseFloat(s1);
    }

    if (isNaN(a1)) {
      a1 = store.graph.angles[a1];
    } else {
      a1 = parseFloat(a1);
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
      s1 = parseFloat(s1);
    }
    if (isNaN(s2)) {
      s2 = store.graph.lines[s2];
    } else {
      s2 = parseFloat(s2);
    }
    if (isNaN(a1)) {
      a1 = store.graph.angles[a1];
    } else {
      a1 = parseFloat(a1);
    }

    if (s1) {
      store.addTriangleByInnerAngle2Side(a1, s1, s2);
      store.historyPush();
    }
  } else if (tab.value == 'outerAngle2Side') {
    let s1 = side1.value;
    let s2 = side2.value;
    let a1 = angle1.value;
    //TODO: check a1, make sure only a1 can input key
    if (isNaN(s1)) {
      s1 = store.graph.lines[s1];
    } else {
      s1 = parseFloat(s1);
    }
    if (isNaN(s2)) {
      s2 = store.graph.lines[s2];
    } else {
      s2 = parseFloat(s2);
    }
    if (isNaN(a1)) {
      a1 = store.graph.angles[a1];
    } else {
      a1 = parseFloat(a1);
    }

    if (s1) {
      store.addTriangleByOuterAngle2Side(a1, s1, s2);
      store.historyPush();
    }
  } else if (tab.value == '3dots') {
    store.addTriangleBy3Dot(
      store.graph.dots[dot1.value],
      store.graph.dots[dot2.value],
      store.graph.dots[dot3.value]
    );
    store.historyPush();
  } else if (tab.value == '3sides') {
    let s1 = side1.value;
    if (isNaN(s1)) {
      s1 = store.graph.lines[s1];
    } else {
      s1 = parseFloat(s1);
    }
    store.addTriangleBy3Side(
      s1,
      parseFloat(side2.value),
      parseFloat(side3.value)
    );
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
  } else if (val < -180 || val > 180) {
    return 'invalid number';
  } else {
    return true;
  }
}

function checkDot(val) {
  if (isNaN(val)) {
    if (store.graph.dots[val]) {
      return true;
    } else {
      return 'invalid dot key';
    }
  } else {
    return 'please put in a dot key';
  }
}

const tab = ref('2Angle1Side');
const splitterModel = ref(20);
const direction = ref(1);
</script>
