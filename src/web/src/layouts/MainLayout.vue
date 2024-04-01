<template>
  <q-layout view="hHh lpR fFf">
    <q-header class="bg-primary text-white q-gutter-x-sm" height-hint="98">
      <q-toolbar>
        <!-- <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" /> -->
        <router-link class="logo" to="/">
          <q-avatar square size="md">
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
          flat
          style="color: white"
          label="Login"
          to="/user/login"
        />
        <q-btn v-if="userStore.user" dense flat round @click="showProfile">
          <q-avatar size="32px">
            <img :src="userStore.user.photoURL || '/defaultAvatar.jpg'" />
          </q-avatar>
        </q-btn>
        <q-btn
          v-if="rightDrawerOpen"
          class="q-ml-sm"
          dense
          flat
          round
          icon="close"
          @click="userStore.editingObject = false"
        />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" side="left" bordered>
      <router-view name="left" />
    </q-drawer>

    <q-drawer v-model="rightDrawerOpen" side="right" bordered>
      <editing-view />
    </q-drawer>

    <q-page-container>
      <router-view @set-title="(t) => (pageTitle = t)" />
    </q-page-container>

    <q-footer bordered height-hint="30" class="bg-grey-2 text-grey-7">
      <q-toolbar>
        <q-toolbar-title class="row justify-center footer-text">
          Created by Lily Qi with passion for math, &nbsp;<a
            href="mailto:lily.luna.qi@icloud.com"
            >CONTACT ME</a
          >&nbsp; if you feel the same.
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useUserStore } from '../stores/user';
import { useRouter } from 'vue-router';
import EditingView from 'pages/EditingView.vue';

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

function showProfile() {
  userStore.editingObject = userStore.user;
  console.log(userStore.user.constructor.name);
  rightDrawerOpen.value = true;
}

watch(
  computed(() => userStore.editingObject),
  (val) => {
    rightDrawerOpen.value = val != false;
  }
);
</script>

<style lang="scss" scoped>
.q-toolbar {
  padding-right: 20px;
  .logo {
    color: white;
    text-decoration: none;
    font-size: 22px;
    font-weight: 500;
    font-family: Copperplate, Copperplate Gothic Light, fantasy;
    // font-family: Tahoma, Verdana, Segoe, sans-serif;
  }
}

.title-text {
  text-align: center;
}

.footer-text {
  font-size: 15px;
  a {
    color: $grey-8;
  }
}
</style>
