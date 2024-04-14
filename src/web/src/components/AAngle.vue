<template>
  <path v-if="color" :d="path" :fill="color" fill-opacity="0.7" />
  <path v-else :d="path" stroke="black" fill-opacity="0" />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import Angle from 'src/model/Angle';

const props = defineProps({
  angle: Angle,
  scale: Number,
});

const color = computed(() => {
  if (
    props.angle.style &&
    props.angle.style.visible &&
    props.angle.style.color != 'black' &&
    props.angle.style.color != 'rgb(0,0,0)'
  )
    return props.angle.style.color;
  else return false;
});

const path = computed(() => {
  const r1 = props.angle.sides1[0].radian(props.angle.vertex);
  const r2 = props.angle.sides2[0].radian(props.angle.vertex);
  const centerX = props.angle.vertex.x * props.scale;
  const centerY = props.angle.vertex.y * props.scale;
  const x1 = props.angle.style.size * Math.cos(r1) + centerX;
  const y1 = props.angle.style.size * Math.sin(r1) + centerY;
  const x2 = props.angle.style.size * Math.cos(r2) + centerX;
  const y2 = props.angle.style.size * Math.sin(r2) + centerY;

  let p;

  if (Math.abs(r1 - r2) > Math.PI) {
    if (r1 > r2) {
      p =
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
        y1;
    } else {
      p =
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
        y2;
    }
  } else {
    if (r1 < r2) {
      p =
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
        y1;
    } else {
      p =
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
        y2;
    }
  }

  if (color.value) {
    p += ' L ' + centerX + ' ' + centerY;
  }

  return p;
});

onMounted(() => {});
</script>

<style lang="scss"></style>
