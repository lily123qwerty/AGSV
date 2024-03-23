<template>
  <div class="landing-page">
    <div class="top-part">
      <div class="intro">
        <div class="intro-content">
          <h5>Welcome to Accurate Geometric Shape Visualizer!</h5>
          <p>
            Struggling with complex geometric problems? Having issues with
            drawing an accurate graph for geometric questions? AGSV is what you
            are looking for! Wether you are a student, teacher, or just someone
            who interested or struggling with geometry, we provide tools that
            allows you to create and explore 2D geometric shapes.
          </p>
          <q-btn
            color="primary"
            @click="router.push('/graph')"
            label="Get Started"
          />
        </div>
      </div>
      <div class="example">
        <div v-if="graph">
          <a-graph :graph="graph" />
          <div class="example-question">{{ graph.question }}</div>
        </div>
      </div>
    </div>
    <div class="catalog vertical-middle">
      <q-btn color="primary" label="Get Started" />
      <q-btn color="primary" label="Get Started" />
      <q-btn color="primary" label="Get Started" />
      <q-btn color="primary" label="Get Started" />
      <q-btn color="primary" label="Get Started" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Graph from '../model/Graph';
import { useGraphStore } from 'stores/graph';
import { useUserStore } from '../stores/user';
import AGraph from 'components/AGraph.vue';
import History from 'src/model/History';
import { useRouter } from 'vue-router';

const router = useRouter();

const userStore = useUserStore();
const graphStore = useGraphStore();

const graph = ref(null);
const graphsCache = {};

async function getGraph(id) {
  if (graphsCache[id]) {
    graph.value = graphsCache[id];
  } else {
    try {
      graph.value = await userStore.getGraphByID(id);
      graphsCache[id] = graph.value;
      console.log(graph);
    } catch (e) {
      console.log(e);
    }
  }
}

onMounted(async () => {
  const graphIDs = [
    '8HhEIAuSZXzyDWNcAS0b',
    'PUW5rZhWOjeZ6PghUh2I',
    'XCctBJbFJagzwVfSPSRt',
    'XH5XpcdNLye72SL4Njq3',
  ];

  let index = 0;
  getGraph(graphIDs[index]);

  setInterval(() => {
    index = ++index % graphIDs.length;
    getGraph(graphIDs[index]);
  }, 5000);
});
</script>
<style lang="scss" scoped>
.top-part {
  position: absolute;
  top: 0;
  bottom: 60px;
  width: 100%;
  // background-color: brown;
}
.landing-page {
  position: absolute;
  top: 50px;
  bottom: 51px;
  right: 0;
  left: 0;
}
.catalog {
  // background-color: aqua;
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 30px;
  padding-right: 30px;
}
div.intro {
  position: relative;
  // background-color: aquamarine;
  text-align: center;
  height: 100%;
  width: 50%;
  float: left;
  display: flex;
  justify-content: center;
  align-items: center;
}
div.intro-content {
  text-align: justify;
  padding-left: 30px;
  padding-right: 30px;
}
div.example {
  // background-color: blueviolet;
  position: relative;
  text-align: center;
  height: 100%;
  width: 50%;
  float: right;
  display: flex;
  justify-content: center;
  align-items: center;
}
div.example-question {
  font-size: 14px;
  font-family: sans-serif;
  text-align: left;
  // text-justify: inter-word;
  padding-left: 30px;
  padding-right: 30px;
}
</style>
