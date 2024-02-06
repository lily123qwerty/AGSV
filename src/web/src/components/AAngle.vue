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
  const r1 = props.angle.sides1[0].radian(props.angle.vertex);
  const r2 = props.angle.sides2[0].radian(props.angle.vertex);
  const x1 = props.angle.style.size * Math.cos(r1) + props.angle.vertex.x;
  const y1 = props.angle.style.size * Math.sin(r1) + props.angle.vertex.y;
  const x2 = props.angle.style.size * Math.cos(r2) + props.angle.vertex.x;
  const y2 = props.angle.style.size * Math.sin(r2) + props.angle.vertex.y;

  if (Math.abs(r1 - r2) > Math.PI) {
    if (r1 > r2) {
      return (
        'M ' +
        x2 +
        ' ' +
        y2 +
        ' A ' +
        props.angle.style.size +
        ',' +
        props.angle.style.size +
        ' 0,0,0 ' +
        x1 +
        ' ' +
        y1
      );
    } else {
      return (
        'M ' +
        x1 +
        ' ' +
        y1 +
        ' A ' +
        props.angle.style.size +
        ',' +
        props.angle.style.size +
        ' 0,0,0 ' +
        x2 +
        ' ' +
        y2
      );
    }
  } else {
    if (r1 < r2) {
      return (
        'M ' +
        x2 +
        ' ' +
        y2 +
        ' A ' +
        props.angle.style.size +
        ',' +
        props.angle.style.size +
        ' 0,0,0 ' +
        x1 +
        ' ' +
        y1
      );
    } else {
      return (
        'M ' +
        x1 +
        ' ' +
        y1 +
        ' A ' +
        props.angle.style.size +
        ',' +
        props.angle.style.size +
        ' 0,0,0 ' +
        x2 +
        ' ' +
        y2
      );
    }
  }
});

onMounted(() => {});
</script>

<style lang="scss"></style>
