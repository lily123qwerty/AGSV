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
            <img
              :src="userStore.user.photoURL || '/defaultAvatar.jpg'"
              style="object-fit: cover; width: 100%; height: 100%"
            />
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
          Created by Lily Qi with passion for math, please &nbsp;<a
            href="mailto:lily.luna.qi@icloud.com"
            >CONTACT ME</a
          >&nbsp; if you meet any problem.
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { ref, computed, watch, onErrorCaptured } from 'vue';
import { useUserStore } from '../stores/user';
import { useGraphStore } from 'stores/graph';
import { useRouter } from 'vue-router';
import EditingView from 'pages/EditingView.vue';
import { useQuasar, Notify } from 'quasar';

const props = defineProps({
  showLeftDrawer: Boolean,
  showRightDrawer: Boolean,
  titleText: String,
});

const $q = useQuasar();

const userStore = useUserStore();
const store = useGraphStore();

const leftDrawerOpen = computed(() => props.showLeftDrawer || false);
const rightDrawerOpen = ref(false);

const pageTitle = ref(false);
const title = computed(() => props.titleText || pageTitle.value || false);

const router = useRouter();
router.beforeEach((to, from, next) => {
  userStore.editingObject = false;
  // rightDrawerOpen.value = false;
  pageTitle.value = false;
  next();
});

function showProfile() {
  userStore.editingObject = userStore.user;
  rightDrawerOpen.value = true;
}

watch(
  computed(() => userStore.editingObject),
  (val) => {
    rightDrawerOpen.value = val != false;
  }
);

// onErrorCaptured((error) => {
//   console.log('onErrorCaptured:', error.message);
//   Notify.create({
//     message: error.message,
//     color: 'red',
//     icon: 'warning',
//     position: 'top',
//   });
//   return false;
// });

// userStore.$onAction(
//   ({
//     name, // name of the action
//     store, // store instance, same as `someStore`
//     args, // array of parameters passed to the action
//     after, // hook after the action returns or resolves
//     onError, // hook if the action throws or rejects
//   }) => {
//     // a shared variable for this specific action call
//     const startTime = Date.now();
//     // this will trigger before an action on `store` is executed
//     console.log(`Start "${name}" with params [${args.join(', ')}].`);

//     // this will trigger if the action succeeds and after it has fully run.
//     // it waits for any returned promised
//     after((result) => {
//       console.log(
//         `Finished "${name}" after ${
//           Date.now() - startTime
//         }ms.\nResult: ${result}.`
//       );
//     });

//     // this will trigger if the action throws or returns a promise that rejects
//     onError((error) => {
//       console.warn(
//         `Failed "${name}" after ${Date.now() - startTime}ms.\nError: ${error}.`
//       );
//     });
//   }
// );
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
