<template>
  <path :d="path" stroke="black" :fill="color" fill-opacity="0.5" />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import Circle from 'src/model/Circle';
import { store } from 'quasar/wrappers';

const props = defineProps({
  circle: Circle,
  scale: Number,
});

const path = computed(() => {
  console.log(props);
  if (props.circle.semiCircle == true) {
    const x1 = props.circle.diameter.ends[0].x * props.scale;
    const y1 = props.circle.diameter.ends[0].y * props.scale;
    const x2 = props.circle.diameter.ends[1].x * props.scale;
    const y2 = props.circle.diameter.ends[1].y * props.scale;
    return (
      'M ' +
      x1 +
      ' ' +
      y1 +
      ' A ' +
      props.circle.radius.length * props.scale +
      ',' +
      props.circle.radius.length * props.scale +
      ' 0,0,1 ' +
      x2 +
      ' ' +
      y2 +
      'L' +
      x1 +
      ' ' +
      y1
    );
  } else {
    const x1 =
      props.circle.center.x * props.scale +
      props.circle.radius.length * props.scale;
    const y1 = props.circle.center.y * props.scale;
    const x2 =
      props.circle.center.x * props.scale -
      props.circle.radius.length * props.scale;
    const y2 = props.circle.center.y * props.scale;
    return (
      'M ' +
      x1 +
      ' ' +
      y1 +
      ' A ' +
      props.circle.radius.length * props.scale +
      ',' +
      props.circle.radius.length * props.scale +
      ' 0,0,0 ' +
      x2 +
      ' ' +
      y2 +
      ' A ' +
      props.circle.radius.length * props.scale +
      ',' +
      props.circle.radius.length * props.scale +
      ' 0,1,0 ' +
      x1 +
      ' ' +
      y1
    );
  }
});

const color = computed(() => {
  if (
    props.circle.style &&
    props.circle.style.visible &&
    props.circle.style.color != 'black' &&
    props.circle.style.color != 'rgb(0,0,0)'
  )
    return props.circle.style.color;
  else return false;
});

onMounted(() => {});
</script>

<style lang="scss"></style>
