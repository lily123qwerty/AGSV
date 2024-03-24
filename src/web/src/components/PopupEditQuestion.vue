<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <!--
        ...content
        ... use q-card-section for it?
      -->
      <q-card-section>
        <div class="text-h6">Edit Question</div>
      </q-card-section>

      <q-card-section>
        <q-input v-model="question" outlined autogrow autofocus
      /></q-card-section>

      <q-card-section>
        <div class="row justify-between items-center">
          <div class="col-7">
            <q-select
              outlined
              dense
              v-model="category"
              :options="categories"
              label="Category"
            />
          </div>

          <q-toggle v-model="published" label="Publish" left-label />
        </div>
      </q-card-section>

      <!-- buttons example -->
      <q-card-actions align="right" class="q-pr-md q-pb-md">
        <q-btn color="primary" label="Cancel" @click="onDialogCancel" />
        <q-btn color="primary" label="OK" @click="onOKClick" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useDialogPluginComponent } from 'quasar';
import { ref } from 'vue';
import { useUserStore } from '../stores/user';

const props = defineProps({
  question: String,
  category: String,
  published: Boolean,
});

const userStore = useUserStore();

const categories = userStore.categories.map((c) => ({
  value: c.key,
  label: c.name,
}));

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

const question = ref(props.question);

const category = ref(props.category);

const published = ref(props.published);

// this is part of our example (so not required)
function onOKClick() {
  onDialogOK({
    question: question.value,
    category: category.value.value,
    published: published.value,
  });
}
</script>
