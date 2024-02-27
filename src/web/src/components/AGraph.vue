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
      :width="width"
      :height="height"
      xmlns="http://www.w3.org/2000/svg"
    >
      <a-triangle
        v-for="t in triangles"
        :key="t.key"
        :triangle="t"
        :scale="scale"
      ></a-triangle>

      <a-dot
        v-for="dot in dots"
        :key="dot.key"
        :dot="dot"
        :scale="scale"
      ></a-dot>

      <a-angle
        v-for="angle in angles"
        :key="angle.key"
        :angle="angle"
        :scale="scale"
      ></a-angle>

      <a-text
        v-for="l in labels"
        :key="l.key"
        :label="l.label"
        :cls="l.cls"
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
  trumbnail: Boolean,
});

const scale = computed(() => {
  const size = props.trumbnail ? 200 : 300;
  const b = props.graph.bounds;

  return Math.min(size / (b.bottom - b.top), size / (b.right - b.left));
});

const bounds = computed(() => {
  const b = props.graph.bounds;
  const s = scale.value;
  const margin = 30;

  b.top = b.top == Number.MAX_VALUE ? 0 : b.top * s - margin;
  b.left = b.left == Number.MAX_VALUE ? 0 : b.left * s - margin;
  b.bottom = b.bottom == Number.MIN_VALUE ? 0 : b.bottom * s + margin;
  b.right = b.right == Number.MIN_VALUE ? 0 : b.right * s + margin;

  return b;
});

const width = computed(() => {
  if (props.trumbnail) {
    return '200px';
  }
  return bounds.value.right - bounds.value.left;
});

const height = computed(() => {
  if (props.trumbnail) {
    return '200px';
  }
  return bounds.value.bottom - bounds.value.top;
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

      x = -x * margin + dot.x * scale.value;
      y = -y * margin + dot.y * scale.value;

      l.push({ key: dot.key, x, y, cls: 'dot-label', label: dot.label, r: 0 });
    });

  //angle label
  angles.value.forEach((angle) => {
    let label =
      Math.round(radiansToDegrees(angle.radian) * 10 ** angle.style.round) /
        10 ** angle.style.round +
      '°';
    const r1 = angle.sides1[0].radian(angle.vertex);
    const r2 = angle.sides2[0].radian(angle.vertex);
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

    const x =
      angle.vertex.x * scale.value +
      Math.cos(labelAngle) * (angle.style.size + 20);
    const y =
      angle.vertex.y * scale.value +
      Math.sin(labelAngle) * (angle.style.size + 20);
    l.push({ key: angle.key, x, y, cls: 'angle-label', label, r: 0 });
  });

  //line label
  Object.entries(props.graph.lines)
    .map(([key, obj]) => obj)
    .filter((obj) => obj.style.visible)
    .forEach((line) => {
      let x = (line.ends[1].x + line.ends[0].x) / 2;
      let y = (line.ends[1].y + line.ends[0].y) / 2;
      let r = line.radian(line.ends[0]);
      if (line.radian(line.ends[1]) < r) {
        r = line.radian(line.ends[1]);
      }
      if (r > Math.PI / 2 && r < (3 * Math.PI) / 2) {
        r = r + Math.PI;
      }
      let margin = 10;

      x = x * scale.value + margin * Math.cos(r - Math.PI / 2);
      y = y * scale.value + margin * Math.sin(r - Math.PI / 2);

      let lineLabel =
        Math.round(line.length * 10 ** line.style.round) /
        10 ** line.style.round;
      l.push({
        key: line.key,
        x,
        y,
        cls: 'line-label',
        label: lineLabel.toString(),
        r: r,
      });
    });

  // triangle area label
  Object.entries(props.graph.triangles)
    .map(([key, obj]) => obj)
    .filter((obj) => obj.style.visible)
    .forEach((triangle) => {
      let x =
        ((triangle.vertices[0].x +
          triangle.vertices[1].x +
          triangle.vertices[2].x) /
          3) *
        scale.value;
      let y =
        ((triangle.vertices[0].y +
          triangle.vertices[1].y +
          triangle.vertices[2].y) /
          3) *
        scale.value;

      let area =
        Math.round(triangle.area * 10 ** triangle.style.round) /
        10 ** triangle.style.round;

      l.push({
        key: triangle.key,
        x,
        y,
        cls: 'triangle-label',
        label: area.toString(),
        r: 0,
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
