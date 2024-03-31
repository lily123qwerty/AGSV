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
import { ref, onMounted, watch, computed } from 'vue';
import { useGraphStore } from 'stores/graph';
import { useUserStore } from '../stores/user';
import AGraph from 'components/AGraph.vue';
import { useRoute } from 'vue-router';

const emit = defineEmits(['setTitle']);

const route = useRoute();

const userStore = useUserStore();
const graphStore = useGraphStore();

const graphs = ref([]);

const category = computed(() => userStore.getCategoryByKey(route.params.key));

onMounted(async () => {
  emit('setTitle', category.value.name);

  try {
    graphs.value = await userStore.getCategoryGraphs(category.value.key);
  } catch (e) {
    console.log(e);
  }
});
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

.card-question {
  font-size: 14px;
  font-family: $font-question;
  text-align: left;
  // text-justify: inter-word;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 8; /* number of lines to show */
  line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>
