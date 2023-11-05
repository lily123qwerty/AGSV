<template>
  <div class="q-pa-md row items-center justify-start q-gutter-md">
    <q-card v-for="g in userStore.graphs" :key="g.id" class="my-card">
      <q-card-section horizontal>
        <div class="graph-container col-7">
          <a-graph :graph="g" trumbnail />
        </div>

        <q-card-section>
          {{ lorem }}
        </q-card-section>
      </q-card-section>

      <q-separator />

      <q-card-actions>
        <q-btn flat color="primary" @click="clickEdit(g)"> Edit </q-btn>
        <q-btn
          flat
          color="primary"
          @click="
            confirmDelete = true;
            toDelete = g;
          "
        >
          Remove
        </q-btn>
      </q-card-actions>
    </q-card>

    <q-btn
      class="q-ml-xl"
      size="40px"
      round
      color="secondary"
      icon="add"
      @click="clickAdd"
    />
  </div>

  <q-dialog v-model="confirmDelete" persistent>
    <q-card>
      <q-card-section class="row items-center">
        <q-avatar icon="signal_wifi_off" color="primary" text-color="white" />
        <span class="q-ml-sm"
          >You are currently not connected to any network.</span
        >
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="primary" v-close-popup />
        <q-btn
          flat
          label="Delete"
          color="primary"
          v-close-popup
          @click="clickRemove(toDelete)"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref } from 'vue';
import Graph from '../model/Graph';
import { useGraphStore } from 'stores/graph';
import { useUserStore } from '../stores/user';
import AGraph from 'components/AGraph.vue';
import History from 'src/model/History';
import { useRouter } from 'vue-router';

const router = useRouter();

const userStore = useUserStore();
const graphStore = useGraphStore();

const confirmDelete = ref(false);
const toDelete = ref(null);

const array = ref([1, 2, 3, 4, 5]);
const lorem = ref(
  'Lorem ipsum dolor adn ullamco laboris nisi ut aliquip ex ea commodo consequat.'
);

function clickEdit(graph) {
  graphStore.graph = graph;
  graphStore.history = new History(graph);
  router.push('/');
}

async function clickRemove(graph) {
  try {
    await userStore.delete(graph);
    console.log('delete successful');
  } catch (e) {
    console.log(e);
  }
}

function clickAdd() {
  graphStore.graph = new Graph();
  graphStore.history = new History();
  router.push('/');
}
</script>

<style lang="scss" scoped>
.my-card {
  width: 100%;
  max-width: 350px;
}

.graph-container {
  width: 200px;
  height: 200px;
  overflow: hidden;
}

.add-btn {
  background-color: aquamarine;
  width: 200px;
  height: 200px;
}
</style>
