<template>
  <q-layout view="hHh lpR fFf">
    <q-header class="bg-primary text-white q-gutter-x-sm" height-hint="98">
      <q-toolbar>
        <q-toolbar-title>
          &nbsp;
          <q-avatar square>
            <img src="agsv-icon.svg" />
          </q-avatar>
          AGSV
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

    <q-footer bordered class="bg-grey-8 text-white">
      <q-toolbar>
        <q-toolbar-title>
          <div>create by Lily</div>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
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
