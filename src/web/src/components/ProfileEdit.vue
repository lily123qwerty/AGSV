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
        <q-input
          v-model="user.displayName"
          label="Name"
          @update:model-value="onUpdateName"
        />
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
          @click="changePassword"
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
import { useQuasar } from 'quasar';
import { useUserStore } from '../stores/user';
import { useRouter } from 'vue-router';
import FirebaseUploader from './FirebaseUploader';

const router = useRouter();
const userStore = useUserStore();
const $q = useQuasar();

const props = defineProps({
  user: Object,
});

const user = computed(() => props.user);

let updateNameTask = false;
function onUpdateName(val) {
  if (updateNameTask) {
    clearTimeout(updateNameTask);
  }
  updateNameTask = setTimeout(async () => {
    updateNameTask = false;
    await userStore.updateUserName(val);
  }, 1000);
}

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

function changePassword() {
  $q.dialog({
    title: 'Change Password',
    message: 'please enter your new password:',
    prompt: {
      model: '',
      type: 'text', // optional
    },
    cancel: true,
    persistent: true,
  })
    .onOk((newPassword) => {
      try {
        userStore.updatePassword(newPassword);
      } catch (error) {
        console.log(error);
      }
    })
    .onCancel(() => {
      // console.log('>>>> Cancel')
    })
    .onDismiss(() => {
      // console.log('I am triggered on both OK and Cancel')
    });
}
</script>

<style lang="scss" scoped>
.cropper {
  height: 600px;
  width: 600px;
  background: #ddd;
}
</style>
