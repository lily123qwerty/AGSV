<template>
  <div class="graph">
    <svg
      :viewBox="
        bounds.left +
        ' ' +
        bounds.top +
        ' ' +
        (bounds.right - bounds.left) +
        ' ' +
        (bounds.bottom - bounds.top)
      "
      :width="bounds.right - bounds.left"
      :height="bounds.bottom - bounds.top"
      xmlns="http://www.w3.org/2000/svg"
    >
      <a-triangle
        v-for="t in triangles"
        :key="t.key"
        :triangle="t"
      ></a-triangle>
      <a-dot v-for="dot in dots" :key="dot.key" :dot="dot"></a-dot>
      <a-angle
        v-for="angle in angles"
        :key="angle.key"
        :angle="angle"
      ></a-angle>
      <a-text
        v-for="l in labels"
        :key="l.key"
        :sty="l.sty"
        :x="l.x"
        :y="l.y"
      ></a-text>
    </svg>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import Graph from 'src/model/Graph';
import ATriangle from './ATriangle.vue';
import ADot from './ADot.vue';
import AText from './AText.vue';
import AAngle from './AAngle.vue';
import { radiansToDegrees } from 'src/model/helper';

const props = defineProps({
  graph: Graph,
});

const bounds = computed(() => {
  const b = props.graph.bounds;
  const margin = 30;

  b.top = b.top == Number.MAX_VALUE ? 0 : b.top - margin;
  b.left = b.left == Number.MAX_VALUE ? 0 : b.left - margin;
  b.bottom = b.bottom == Number.MIN_VALUE ? 0 : b.bottom + margin;
  b.right = b.right == Number.MIN_VALUE ? 0 : b.right + margin;

  return b;
});

const triangles = computed(() =>
  Object.entries(props.graph.triangles).map(([key, obj]) => obj)
);

const dots = computed(() =>
  Object.entries(props.graph.dots)
    .map(([key, obj]) => obj)
    .filter((obj) => obj.style && obj.style.visible)
);

const angles = computed(() =>
  Object.entries(props.graph.angles)
    .map(([key, obj]) => obj)
    .filter((obj) => obj.style && obj.style.visible)
);

const labels = computed(() => {
  let l = [];
  Object.entries(props.graph.dots)
    .map(([key, obj]) => obj)
    .filter((obj) => obj.style && obj.style.label)
    .forEach((dot) => {
      let x = 0,
        y = 0,
        margin = 15;
      // get line

      Object.entries(props.graph.lines)
        .map(([key, line]) => line)
        .forEach((line) => {
          let dx = 0,
            dy = 0;
          if (line.ends[0] == dot) {
            dx = line.ends[1].x - dot.x;
            dy = line.ends[1].y - dot.y;
            dx = dx / line.length;
            dy = dy / line.length;
          } else if (line.ends[1] == dot) {
            dx = line.ends[0].x - dot.x;
            dy = line.ends[0].y - dot.y;
            dx = dx / line.length;
            dy = dy / line.length;
          }

          x = x + dx;
          y = y + dy;
        });

      // get unit vector
      x = x / Math.sqrt(x * x + y * y);
      y = y / Math.sqrt(x * x + y * y);

      x = -x * margin + dot.x;
      y = -y * margin + dot.y;

      l.push({ key: dot.key, x, y, sty: dot.style });
    });

  angles.value.forEach((angle) => {
    angle.style.label = Math.round(radiansToDegrees(angle.radian)) + '°';
    const r1 = angle.sides[0].radian(angle.vertex);
    const r2 = angle.sides[1].radian(angle.vertex);
    const r = angle.radian / 2;
    let labelAngle;
    let fr1;

    // find which line to start:
    if ((r1 >= 0 && r2 >= 0) || (r1 <= 0 && r2 <= 0)) {
      if (r1 > r2) {
        fr1 = false;
      } else {
        fr1 = true;
      }
    } else {
      if (Math.abs(r1) + Math.abs(r2) > Math.PI) {
        if (r1 > 0) {
          fr1 = true;
        } else {
          fr1 = false;
        }
      } else {
        if (r1 > 0) {
          fr1 = false;
        } else {
          fr1 = true;
        }
      }
    }
    if (fr1) {
      labelAngle = r1 + r;
    } else {
      labelAngle = r2 + r;
    }

    const x = angle.vertex.x + Math.cos(labelAngle) * (angle.style.size + 20);
    const y = angle.vertex.y + Math.sin(labelAngle) * (angle.style.size + 20);
    l.push({ key: angle.key, x, y, sty: angle.style });
  });
  return l;
});

onMounted(() => {
  console.log(props.graph.toJSON());
});
</script>

<style lang="scss">
.graph {
  // width: 100%;
  // background-color: rgb(233, 235, 237);
  transform: scaleY(1);
}
</style>
