<template>
  <q-layout view="hHh lpR fFf">
    <q-header class="bg-primary text-white q-gutter-x-sm" height-hint="98">
      <q-toolbar>
        <!-- <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" /> -->

        <q-toolbar-title>
          &nbsp;
          <router-link to="/" style="color: white; text-decoration: none">
            <q-avatar square>
              <img src="/agsv-icon.svg" />
            </q-avatar>
            AGSV
          </router-link>
        </q-toolbar-title>
        <q-btn
          v-if="!userStore.user"
          outline
          style="color: white"
          label="Login"
          to="/user/login"
        />
        <q-btn
          v-if="userStore.user"
          outline
          style="color: white"
          label="Logout"
          @click="userStore.logout"
        />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue';
import { useGraphStore } from 'stores/graph';
import Graph from '../model/Graph';
import { useUserStore } from '../stores/user';

const store = useGraphStore();
const userStore = useUserStore();
</script>

<style lang="scss">
.first-btns {
  margin-left: 180px;
}

.tooltip {
  font-size: 14px;
  background-color: $accent;
}

.q-knob--editable:focus:before {
  box-shadow: none !important;
}

body.body--dark .q-knob--editable:focus:before {
  box-shadow: $dark-shadow-2;
}
</style>
