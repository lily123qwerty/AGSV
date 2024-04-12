<template>
  <q-page>
    <div class="q-pa-md row items-center justify-start q-gutter-md">
      <q-btn
        color="primary"
        outline
        icon="add"
        label="New Graph"
        @click="clickAdd"
      />
    </div>

    <div class="q-pa-md row items-center justify-start q-gutter-md">
      <q-card v-for="g in userStore.graphs" :key="g.id" class="my-card">
        <q-card-section horizontal>
          <div class="graph-container col-7">
            <a-graph :graph="g" trumbnail />
          </div>

          <q-card-section>
            <div class="card-question">{{ g.question }}</div>
          </q-card-section>
        </q-card-section>

        <q-separator />

        <q-card-actions class="row justify-around">
          <q-btn flat color="primary" @click="clickEdit(g)"> Edit </q-btn>
          <q-btn flat color="primary" @click="clickRemove(g)"> Remove </q-btn>
        </q-card-actions>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue';
import Graph from '../model/Graph';
import { useGraphStore } from 'stores/graph';
import { useUserStore } from '../stores/user';
import AGraph from 'components/AGraph.vue';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';

const emit = defineEmits(['setTitle']);

const router = useRouter();
const $q = useQuasar();

const userStore = useUserStore();
const graphStore = useGraphStore();

function clickEdit(graph) {
  graphStore.reset(graph);
  router.push('/graph');
}

function clickRemove(graph) {
  $q.dialog({
    title: 'Confirm',
    message: 'Are you going to remove the graph?',
    ok: {
      label: 'Remove',
    },
    cancel: true,
    persistent: false,
  })
    .onOk(() => {
      userStore.delete(graph);
    })
    .onCancel(() => {});
}

function clickAdd() {
  graphStore.reset(new Graph());
  router.push('/graph');
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

.card-question {
  font-size: 14px;
  font-family: $font-question;
  font-weight: 500;
  text-align: left;
  // text-justify: inter-word;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 8; /* number of lines to show */
  line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>
