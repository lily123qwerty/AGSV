<template>
  <q-item
    ><q-item-section><q-item-label>Color</q-item-label> </q-item-section>
    <q-item-section avatar>
      <div class="color-example" :style="color_style"></div> </q-item-section
  ></q-item>

  <q-item>
    <q-item-section>
      <q-color
        v-model="color"
        no-header
        no-footer
        default-view="palette"
        class="my-picker no-shadow"
      />
    </q-item-section>
  </q-item>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps(['modelValue']);
const emit = defineEmits(['update:modelValue']);

const color = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit('update:modelValue', value);
  },
});

const color_style = computed(() => 'background-color: ' + color.value + ';');
</script>

<style lang="scss">
.my-picker {
  width: 268px;
  height: 268px;
}

.color-example {
  width: 60px;
  height: 20px;
}
</style>
