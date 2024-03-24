<template>
  <div class="q-pa-md row items-center justify-start q-gutter-md">
    <q-card v-for="g in graphs" :key="g.id" class="my-card">
      <q-card-section horizontal>
        <div class="graph-container col-7">
          <a-graph :graph="g" trumbnail />
        </div>

        <q-card-section>
          <div class="card-question">{{ g.question }}</div>
        </q-card-section>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import Graph from '../model/Graph';
import { useGraphStore } from 'stores/graph';
import { useUserStore } from '../stores/user';
import AGraph from 'components/AGraph.vue';
import History from 'src/model/History';
import { useRoute } from 'vue-router';

const route = useRoute();

const userStore = useUserStore();
const graphStore = useGraphStore();

const confirmDelete = ref(false);
const toDelete = ref(null);

const graphs = ref([]);

onMounted(async () => {
  try {
    console.log(route.params);
    graphs.value = await userStore.getCategoryGraphs(route.params.key);
  } catch (e) {
    console.log(e);
  }
});

watch(
  () => route.params.key,
  (newKey, oldKey) => {
    // react to route changes...
    console.log(newKey);
  }
);
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
  font-family: sans-serif;
  text-align: left;
  // text-justify: inter-word;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 8; /* number of lines to show */
  line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>
