<template>
  <svg
    viewBox="95 -70.35945694153696 360 225.35945694153696"
    width="300"
    height="200"
    xmlns="http://www.w3.org/2000/svg"
  >
    <polygon
      points="125,125 312.49999999999994,-40.35945694153696 425,124.99999999999999"
      fill="none"
      stroke="black"
      stroke-opacity="0.25"
    ></polygon>
    <circle v-if="method == 'ddd'" cx="125" cy="125" r="5" fill="red"></circle>
    <circle
      v-if="method == 'ddd'"
      cx="312.49999999999994"
      cy="-40.35945694153696"
      r="5"
      fill="red"
    ></circle>
    <circle
      v-if="method == 'ddd'"
      cx="425"
      cy="124.99999999999999"
      r="5"
      fill="red"
    ></circle>
    <polygon
      v-if="method == 'sss' || method == 'sas'"
      points="125,125 312.49999999999994,-40.35945694153696"
      fill="none"
      stroke-width="2"
      stroke="red"
    ></polygon>
    <polygon
      v-if="method == 'aas' || method == 'ass' || method == 'sss'"
      points="312.49999999999994,-40.35945694153696 425,124.99999999999999"
      fill="none"
      stroke-width="2"
      stroke="red"
    ></polygon>
    <polygon
      v-if="
        method == 'asa' || method == 'ass' || method == 'sas' || method == 'sss'
      "
      points="125,125 425,124.99999999999999"
      fill="none"
      stroke-width="2"
      stroke="red"
    ></polygon>
    <path
      d="M 155 124.99999999999999 A 30,30 0,0,0 147.5 105.15686516701555 L 125 125"
      stroke="darkgray"
      stroke-opacity="0"
      fill="red"
      :fill-opacity="
        method == 'aaa' ||
        method == 'aas' ||
        method == 'asa' ||
        method == 'ass' ||
        method == 'sas'
          ? 1
          : 0
      "
    ></path>
    <path
      d="M 289.99999999999994 -20.516322108552522 A 30,30 0,0,0 329.37499999999994 -15.555538400306425 L 312.49999999999994 -40.35945694153696"
      stroke="darkgray"
      stroke-opacity="0"
      fill="red"
      :fill-opacity="method == 'aaa' ? 1 : 0"
    ></path>
    <path
      d="M 408.125 100.19608145876946 A 30,30 0,0,0 395 124.99999999999999 L 425 124.99999999999999"
      stroke="darkgray"
      stroke-opacity="0"
      fill="red"
      :fill-opacity="
        method == 'aaa' || method == 'aas' || method == 'asa' ? 1 : 0
      "
    ></path>
    <text
      x="110.96878479959773"
      y="133.6602540378444"
      class="dot-label"
      transform="rotate(0,110.96878479959773,133.6602540378444)"
    >
      A
    </text>
    <text
      x="314.37499999999994"
      y="-55.306825200310726"
      class="dot-label"
      transform="rotate(0,314.37499999999994,-55.306825200310726)"
    >
      C
    </text>
    <text
      x="438.2582521472478"
      y="135.24695076595958"
      class="dot-label"
      transform="rotate(0,438.2582521472478,135.24695076595958)"
    >
      B
    </text>
    <text
      v-if="
        method == 'aaa' ||
        method == 'aas' ||
        method == 'asa' ||
        method == 'ass' ||
        method == 'sas'
      "
      x="171.77071733467426"
      y="107.32233047033627"
      class="angle-label"
      transform="rotate(0,171.77071733467426,107.32233047033627)"
    >
      a
    </text>
    <text
      v-if="method == 'aaa'"
      x="306.24999999999994"
      y="9.248380140924112"
      class="angle-label"
      transform="rotate(0,306.24999999999994,9.248380140924112)"
    >
      c
    </text>
    <text
      v-if="method == 'aaa' || method == 'aas' || method == 'asa'"
      x="380.80582617584076"
      y="101.61464133266287"
      class="angle-label"
      transform="rotate(0,380.80582617584076,101.61464133266287)"
    >
      b
    </text>
    <text
      v-if="method == 'sss' || method == 'sas'"
      x="212.13562172233853"
      y="34.82027152923152"
      class="line-label"
      transform="rotate(318.5903778907291,212.13562172233853,34.82027152923152)"
    >
      AC
    </text>
    <text
      v-if="
        method == 'asa' || method == 'ass' || method == 'sas' || method == 'sss'
      "
      x="275"
      y="115"
      class="line-label"
      transform="rotate(360,275,115)"
    >
      AB
    </text>
    <text
      v-if="method == 'aas' || method == 'ass' || method == 'sss'"
      x="377.01797284707686"
      y="36.69527152923151"
      class="line-label"
      transform="rotate(55.771133672187425,377.01797284707686,36.69527152923151)"
    >
      BC
    </text>
  </svg>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const props = defineProps({
  method: String,
});

onMounted(() => {});
</script>

<style lang="scss" scoped>
.dot-label {
  font: normal 16px sans-serif;
  opacity: 0.6;
}

.angle-label {
  font: bold 17px sans-serif;
}

.line-label {
  font: bold 17px sans-serif;
}
</style>
