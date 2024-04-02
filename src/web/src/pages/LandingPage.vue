<template>
  <q-page>
    <div class="top-part">
      <div class="intro">
        <div class="intro-content">
          <h5>Welcome to Accurate Geometric Shape Visualizer!</h5>
          <p>
            Struggling with complex geometric problems? Having issues with
            drawing an accurate graph for geometric questions? AGSV is what you
            are looking for! Wether you are a student, teacher, or just someone
            who interested or struggling with geometry, we provide tools that
            allows you to visualise geometry shapes exactly with accurate
            details.
          </p>
          <q-btn
            color="primary"
            @click="router.push('/graph')"
            label="Get Started"
            size="20px"
          />
        </div>
      </div>
      <div class="example">
        <div
          class="example-container column justify-center items-center shadow-9"
          v-if="graph"
        >
          <a-graph :graph="graph" />
          <div class="example-question q-mt-lg">
            <span v-html="question"></span>
          </div>
        </div>
      </div>
    </div>
    <div class="catalog row justify-start items-center">
      <div class="q-mr-lg" v-if="userStore.user">
        <q-btn
          color="primary"
          icon="home"
          label="my graphs"
          rounded
          outline
          size="14px"
          @click="() => router.push('/home')"
        />
      </div>

      <div v-for="c in userStore.categories" :key="c.key" class="q-mr-lg">
        <q-btn
          color="primary"
          :icon="c.icon"
          :label="c.name"
          rounded
          outline
          @click="() => router.push('/category/' + c.key)"
          size="14px"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import Graph from '../model/Graph';
import { useGraphStore } from 'stores/graph';
import { useUserStore } from '../stores/user';
import AGraph from 'components/AGraph.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const userStore = useUserStore();
const graphStore = useGraphStore();

const graph = ref(null);
const question = computed(() => graph.value.question.replace('\n', '<p>'));

const graphsCache = {};

async function getGraph(id) {
  if (graphsCache[id]) {
    graph.value = graphsCache[id];
  } else {
    try {
      graph.value = await userStore.getGraphByID(id);
      graphsCache[id] = graph.value;
      // console.log(graph);
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
  bottom: 80px;
  width: 100%;
  // background-color: brown;
}
.catalog {
  // background-color: aqua;
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 80px;
  //display: flex;
  // justify-content: space-between;
  // align-items: center;
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
  text-align: left;
  padding-left: 30px;
  padding-right: 30px;

  h5 {
    font-family: Copperplate, Copperplate Gothic Light, fantasy;
    font-size: 36px;
    font-weight: 800;
  }

  p {
    font-family: Geneva, Tahoma, Verdana, sans-serif;
    text-align: justify;
    font-size: 18px;
    // font-weight: 300;
    margin-bottom: 30px;
  }
}
div.example {
  // background-color: blueviolet;
  position: relative;
  height: 100%;
  width: 50%;
  float: right;

  .example-container {
    position: absolute;
    left: 0px;
    top: 40px;
    right: 45px;
    bottom: 55px;
    // border: 1px solid black;
    box-shadow: black 0px 0px 0px 1px inset, rgb(255, 255, 255) 5px 5px 0px -1px,
      black 5px 5px, rgb(255, 255, 255) 10px 10px 0px -1px, black 10px 10px,
      rgb(255, 255, 255) 15px 15px 0px -1px, black 15px 15px;
    // display: flex;
    // justify-content: center;
    // align-items: center;
    // text-align: center;
  }

  div.example-question {
    font-family: $font-question;
    font-size: 17px;
    font-weight: 500;
    text-align: justify;
    // text-justify: inter-word;
    padding-left: 30px;
    padding-right: 30px;
  }
}
</style>
