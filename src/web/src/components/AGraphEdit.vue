<template>
  <q-list padding>
    <q-item-label header class="text-h6 text-primary">Edit Graph</q-item-label>

    <q-item>
      <q-item-section>
        <q-input v-model="question" label="Question" outlined autogrow />
      </q-item-section>
    </q-item>

    <q-item>
      <q-item-section>
        <q-select
          outlined
          dense
          v-model="category"
          :options="categories"
          emit-value
          map-options
          label="Category"
        />
      </q-item-section>
    </q-item>

    <q-item>
      <q-item-section>
        <q-btn
          v-if="userStore.isAdmin && !graph.published"
          outline
          color="primary"
          label="Publish"
          @click="userStore.publish(graph, true)"
        />
        <q-btn
          v-if="userStore.isAdmin && graph.published"
          unelevated
          color="primary"
          label="Unpublish"
          @click="userStore.publish(graph, false)"
        />
      </q-item-section>
    </q-item>

    <q-item>
      <q-item-section>
        <q-btn
          v-if="userStore.isAdmin && !graph.highlighted"
          outline
          color="primary"
          label="Highlight"
          @click="userStore.highlight(graph, true)"
        />
        <q-btn
          v-if="userStore.isAdmin && graph.highlighted"
          unelevated
          color="primary"
          label="Unhighlight"
          @click="userStore.highlight(graph, false)"
        />
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script setup>
import Graph from 'src/model/Graph';
import { ref, computed } from 'vue';
import { useUserStore } from '../stores/user';
import { useGraphStore } from 'stores/graph';

const store = useGraphStore();
const userStore = useUserStore();

const categories = userStore.categories.map((c) => ({
  value: c.key,
  label: c.name,
}));

const props = defineProps({
  graph: Graph,
});

const graph = computed(() => props.graph);

const question = computed({
  get: () => graph.value.question,
  set: (val) => {
    graph.value.question = val;
    store.metaEdited = true;
  },
});

const category = computed({
  get: () => graph.value.category,
  set: (val) => {
    graph.value.category = val;
    store.metaEdited = true;
  },
});
</script>
