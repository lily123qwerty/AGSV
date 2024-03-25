<template>
  <q-layout view="hHh lpR fFf">
    <q-header class="bg-primary text-white q-gutter-x-sm" height-hint="98">
      <q-toolbar>
        <!-- <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" /> -->
        <router-link class="logo" to="/">
          <q-avatar square>
            <img src="/agsv-icon.svg" />
          </q-avatar>
          AGSV
        </router-link>

        <q-toolbar-title>
          <div class="title-text" v-if="title">{{ title }}</div>
          <router-view
            v-else
            name="title"
            @hide-right="rightDrawerOpen = false"
          />
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
        <q-btn
          v-if="rightDrawerOpen"
          dense
          flat
          round
          icon="close"
          @click="rightDrawerOpen = !rightDrawerOpen"
        />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" side="left" bordered>
      <router-view name="left" @show-right="rightDrawerOpen = true" />
    </q-drawer>

    <q-drawer v-model="rightDrawerOpen" side="right" bordered>
      <router-view name="right" />
    </q-drawer>

    <q-page-container>
      <router-view @set-title="(t) => (pageTitle = t)" />
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
import { ref, computed } from 'vue';
import { useUserStore } from '../stores/user';
import { useRouter } from 'vue-router';

const props = defineProps({
  showLeftDrawer: Boolean,
  showRightDrawer: Boolean,
  titleText: String,
});

const userStore = useUserStore();

const leftDrawerOpen = computed(() => props.showLeftDrawer || false);
const rightDrawerOpen = ref(false);

const pageTitle = ref(false);
const title = computed(() => props.titleText || pageTitle.value || false);

const router = useRouter();
router.beforeEach((to, from, next) => {
  rightDrawerOpen.value = false;
  pageTitle.value = false;
  next();
});
</script>

<style lang="scss" scoped>
.q-toolbar {
  padding-right: 20px;
  .logo {
    color: white;
    text-decoration: none;
    font-size: 20px;
    font-weight: 500;
  }
}

.title-text {
  text-align: center;
}
</style>
