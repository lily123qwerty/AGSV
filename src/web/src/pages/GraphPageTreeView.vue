<template>
  <div class="q-pa-md q-gutter-sm">
    <a-tree-view @select-shape="onSelectShape" />
  </div>
</template>

<script setup>
import ATreeView from 'src/components/ATreeView.vue';
import { useUserStore } from '../stores/user';

const userStore = useUserStore();

function onSelectShape(obj) {
  userStore.editingObject = obj;
}
</script>

<style lang="scss"></style>
