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
            {{ graph.question }}
          </div>
        </div>
      </div>
    </div>
    <div class="catalog row justify-start items-center">
      <div class="q-mr-lg">
        <q-btn
          v-if="userStore.user"
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
          icon="mail"
          :label="c.name"
          rounded
          outline
          @click="() => router.push('/category/' + c.key)"
          size="14px"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Graph from '../model/Graph';
import { useGraphStore } from 'stores/graph';
import { useUserStore } from '../stores/user';
import AGraph from 'components/AGraph.vue';
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
    font-size: 30px;
    font-family: sans-serif;
  }

  p {
    text-align: justify;
    font-size: 16px;
    font-family: sans-serif;
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
    left: 40px;
    top: 40px;
    right: 55px;
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
    font-size: 17px;
    font-family: sans-serif;
    text-align: justify;
    // text-justify: inter-word;
    padding-left: 30px;
    padding-right: 30px;
  }
}
</style>
