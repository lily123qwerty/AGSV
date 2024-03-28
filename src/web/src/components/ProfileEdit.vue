<template>
  <q-list padding>
    <q-item-label header class="text-h6 text-primary">My Profile</q-item-label>

    <q-item class="q-mb-sm">
      <q-item-section class="row justify-center items-center">
        <q-avatar size="150px">
          <img :src="user.photoURL || '/defaultAvatar.jpg'" />
        </q-avatar>
      </q-item-section>
    </q-item>

    <q-item>
      <q-item-section>
        <q-input disable v-model="user.email" label="Email" />
      </q-item-section>
    </q-item>

    <q-item>
      <q-item-section>
        <q-input v-model="name" label="Name" />
      </q-item-section>
    </q-item>

    <q-item class="q-mt-lg">
      <q-item-section>
        <firebase-uploader
          ref="uploader"
          flat
          bordered
          square
          style="width: 100%"
          label="Upload your photo"
          accept=".jpg, image/*"
          @uploaded="onUploaded"
        />
      </q-item-section>
    </q-item>

    <q-item>
      <q-item-section>
        <q-btn
          outline
          color="primary"
          label="Change Password"
          @click="logout"
        />
      </q-item-section>
    </q-item>

    <q-item>
      <q-item-section>
        <q-btn outline color="primary" label="Logout" @click="logout" />
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useUserStore } from '../stores/user';
import { useRouter } from 'vue-router';
import FirebaseUploader from './FirebaseUploader';

const router = useRouter();
const userStore = useUserStore();

const props = defineProps({
  user: Object,
});

const user = computed(() => props.user);

let _name = user.value.displayName;
let updateNameTask = false;
const name = computed({
  get: () => _name,
  set: (val) => {
    _name = val;
    if (updateNameTask) {
      clearTimeout(updateNameTask);
    }
    updateNameTask = setTimeout(async () => {
      updateNameTask = false;
      await userStore.updateUserName(_name);
      user.value.displayName = _name;
    }, 1000);
  },
});

function logout() {
  userStore.editingObject = false;
  userStore.logout();
  router.push('/');
}

const uploader = ref(null);

function onUploaded(info) {
  user.value.photoURL = info[info.length - 1].uploadUrl;
  userStore.updateUserPhoto(user.value.photoURL);
  uploader.value.reset();
}
</script>

<style lang="scss" scoped>
.cropper {
  height: 600px;
  width: 600px;
  background: #ddd;
}
</style>
