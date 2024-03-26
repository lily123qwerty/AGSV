<template>
  <q-list padding>
    <q-item-label header class="text-h6 text-primary">My Profile</q-item-label>

    <q-item>
      <q-item-section>
        <q-input v-model="email" label="Email" />
      </q-item-section>
    </q-item>

    <q-item>
      <q-item-section>
        <q-input v-model="name" label="Name" />
      </q-item-section>
    </q-item>

    <q-item class="q-mt-lg">
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

const router = useRouter();
const userStore = useUserStore();

const props = defineProps({
  user: Object,
});

const user = computed(() => props.user);

const name = computed({
  get: () => user.value.displayName,
  set: (val) => {},
});

const email = computed({
  get: () => user.value.email,
  set: (val) => {},
});

function logout() {
  userStore.editingObject = false;
  userStore.logout();
  router.push('/');
}
</script>
