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
        :label="l.label"
        :sty="l.sty"
        :x="l.x"
        :y="l.y"
        :r="l.r"
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
  // dot label
  Object.entries(props.graph.dots)
    .map(([key, obj]) => obj)
    .filter((obj) => obj.label)
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

      l.push({ key: dot.key, x, y, sty: dot.style, label: dot.label, r: 0 });
    });

  //angle label
  angles.value.forEach((angle) => {
    let label = Math.round(radiansToDegrees(angle.radian)) + '°';
    const r1 = angle.sides[0].radian(angle.vertex);
    const r2 = angle.sides[1].radian(angle.vertex);
    const r = angle.radian / 2;
    let labelAngle;

    // find which line to start:
    if (Math.abs(r1 - r2) > Math.PI) {
      if (r1 > r2) {
        labelAngle = r1 + r;
      } else {
        labelAngle = r2 + r;
      }
    } else {
      if (r1 < r2) {
        labelAngle = r1 + r;
      } else {
        labelAngle = r2 + r;
      }
    }

    const x = angle.vertex.x + Math.cos(labelAngle) * (angle.style.size + 20);
    const y = angle.vertex.y + Math.sin(labelAngle) * (angle.style.size + 20);
    l.push({ key: angle.key, x, y, sty: angle.style, label, r: 0 });
  });

  //line label
  Object.entries(props.graph.lines)
    .map(([key, obj]) => obj)
    .filter((obj) => obj.style.visible)
    .forEach((line) => {
      let x = (line.ends[1].x + line.ends[0].x) / 2;
      let y = (line.ends[1].y + line.ends[0].y) / 2;
      let r = line.radian(line.ends[0]);
      let margin = 10;

      if (r > Math.PI) {
        r = r - Math.PI;
      }

      x = x + margin * Math.cos(r - Math.PI / 2);
      y = y + margin * Math.sin(r - Math.PI / 2);

      let lineLabel = Math.round(line.length * 10) / 10;
      l.push({
        key: line.key,
        x,
        y,
        sty: line.style,
        label: lineLabel.toString(),
        r: r,
      });
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
