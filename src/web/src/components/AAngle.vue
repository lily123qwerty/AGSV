<template>
  <path :d="path" stroke="black" fill="black" fill-opacity="0" />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import Angle from 'src/model/Angle';

const props = defineProps({
  angle: Angle,
});

const path = computed(() => {
  const r1 = props.angle.sideAngle(0);
  const r2 = props.angle.sideAngle(1);
  let fr1;
  const x1 = props.angle.style.size * Math.cos(r1) + props.angle.vertex.x;
  const y1 = props.angle.style.size * Math.sin(r1) + props.angle.vertex.y;
  const x2 = props.angle.style.size * Math.cos(r2) + props.angle.vertex.x;
  const y2 = props.angle.style.size * Math.sin(r2) + props.angle.vertex.y;
  console.log(x1, y1, x2, y2);

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
    return (
      'M ' +
      x1 +
      ' ' +
      y1 +
      ' A ' +
      props.angle.style.size +
      ',' +
      props.angle.style.size +
      ' 0,0,1 ' +
      x2 +
      ' ' +
      y2
    );
  } else {
    return (
      'M ' +
      x2 +
      ' ' +
      y2 +
      ' A ' +
      props.angle.style.size +
      ',' +
      props.angle.style.size +
      ' 0,0,1 ' +
      x1 +
      ' ' +
      y1
    );
  }
});

onMounted(() => {});
</script>

<style lang="scss"></style>
