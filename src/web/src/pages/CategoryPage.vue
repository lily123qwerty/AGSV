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

      <q-separator />

      <q-card-actions class="row justify-between">
        <q-item class="q-px-sm q-py-none">
          <q-item-section avatar>
            <q-avatar>
              <img
                v-if="g.ownerPhoto"
                :src="g.ownerPhoto"
                style="object-fit: cover; width: 100%; height: 100%"
              />
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label>{{ g.ownerName }}</q-item-label>
            <q-item-label v-if="g.lastEdited" caption>{{
              moment(g.lastEdited).fromNow()
            }}</q-item-label>
          </q-item-section>
        </q-item>

        <div>
          <q-btn
            v-if="userStore.isAdmin && !g.highlighted"
            class="q-ml-sm"
            size="12px"
            flat
            color="primary"
            icon="mdi-thumb-up"
            @click="userStore.highlight(g, true)"
          />
          <q-btn
            v-if="userStore.isAdmin && g.highlighted"
            class="q-ml-sm"
            size="12px"
            round
            unelevated
            color="primary"
            icon="mdi-thumb-up"
            @click="userStore.highlight(g, false)"
          />
          <q-btn
            v-if="userStore.isAdmin && !g.published"
            class="q-ml-sm"
            size="12px"
            flat
            color="primary"
            icon="mdi-eye-off"
            @click="userStore.publish(g, true)"
          />
          <q-btn
            v-if="userStore.isAdmin && g.published"
            class="q-ml-sm"
            size="12px"
            round
            unelevated
            color="primary"
            icon="mdi-eye"
            @click="userStore.publish(g, false)"
          />
          <q-btn
            class="q-ml-sm"
            size="12px"
            flat
            color="primary"
            icon="mdi-arrow-right-bold"
            @click="clickView(g)"
          />
        </div>
      </q-card-actions>
    </q-card>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { useGraphStore } from 'stores/graph';
import { useUserStore } from '../stores/user';
import AGraph from 'components/AGraph.vue';
import { useRoute } from 'vue-router';
import moment from 'moment';
import History from 'src/model/History';
import { useRouter } from 'vue-router';

const emit = defineEmits(['setTitle']);

const route = useRoute();
const router = useRouter();

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

function clickView(graph) {
  graphStore.reset(graph);
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
