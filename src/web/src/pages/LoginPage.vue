<!-- src/pages/LoginPage.vue -->

<template>
  <!-- Design template by Joabson Arley
   https://github.com/Joabsonlg/quasar-template-->

  <q-card class="q-ma-xl">
    <div class="row">
      <div class="col-0 col-sm-5 bg-primary rounded-left-borders xs-hide">
        <div
          class="row full-width q-px-xl q-pb-xl full-height flex flex-center"
        >
          <div class="">
            <div
              class="text-h4 text-uppercase text-white fredoka"
              style="min-width: 220px"
            >
              Welcome!
            </div>
            <div class="text-white q-my-sm text-subtitle1">
              Please sign in to your account to get started!
            </div>
          </div>
        </div>
      </div>

      <div class="col-12 col-sm-7">
        <div class="row q-ml-sm q-mt-sm sm-and-up-hide">
          <div class="col-12 fredoka text-subtitle1">
            <router-link
              class="text-primary"
              style="text-decoration: none"
              to="/"
            >
              AGSV
            </router-link>
          </div>
        </div>
        <div class="row q-pa-sm-sm q-pa-md">
          <div class="col-12">
            <q-card-section>
              <div class="q-mb-xl">
                <div class="flex justify-center">
                  <div
                    class="text-h4 text-uppercase q-my-none text-weight-bold text-primary fredoka"
                  >
                    Login
                  </div>
                </div>
              </div>

              <q-form ref="form" class="q-gutter-md" @submit="submit">
                <q-input
                  ref="emailInput"
                  v-model="email"
                  label="Email"
                  name="Email"
                  :readonly="waiting"
                  lazy-rules
                  :rules="[
                    (val) => {
                      if (!validateEmail(val))
                        return 'Please use valid email address';

                      return emailError;
                    },
                  ]"
                />

                <q-input
                  ref="passwordInput"
                  v-model="password"
                  label="Password"
                  name="password"
                  type="password"
                  :readonly="waiting"
                  lazy-rules
                  :rules="[
                    (val) => {
                      if (!val || val.length < 6)
                        return 'Please use minimum 6 characters';

                      return passwordError;
                    },
                  ]"
                />

                <div>
                  <q-btn
                    class="full-width fredoka"
                    color="primary"
                    label="Login"
                    rounded
                    type="submit"
                    :loading="waiting"
                  ></q-btn>

                  <q-btn
                    class="full-width fredoka q-mt-sm"
                    color="primary"
                    label="Forget Password"
                    rounded
                    flat
                    @click="onForgetPassword"
                  ></q-btn>

                  <div class="q-mt-lg">
                    <div class="q-mt-sm">
                      Don't have an account yet?
                      <router-link
                        v-if="!waiting"
                        class="text-primary"
                        to="/user/register"
                        >Register</router-link
                      >
                    </div>
                  </div>
                </div>
              </q-form>
            </q-card-section>
          </div>
        </div>
      </div>
    </div>
  </q-card>
</template>

<script setup>
import { ref } from 'vue';
import { useQuasar, Notify } from 'quasar';
import { validateEmail } from '../model/helper';
import { useUserStore } from 'stores/user';
import { useRouter } from 'vue-router';

const $q = useQuasar();

const router = useRouter();

const store = useUserStore();

const email = ref(null);
const password = ref(null);
const waiting = ref(false);

const form = ref(null);

const emailInput = ref(null);
const emailError = ref(null);
const passwordInput = ref(null);
const passwordError = ref(null);

const submit = async () => {
  if (form.value.validate()) {
    waiting.value = true;
    try {
      await store.login(email.value, password.value);
      waiting.value = false;
      router.push('/home');
    } catch (error) {
      if (error.code == 'auth/invalid-login-credentials') {
        emailError.value = 'Email may be wrong';
        passwordError.value = 'Password may be wrong';

        emailInput.value.validate();
        passwordInput.value.validate();

        emailInput.value.focus();

        emailError.value = null;
        passwordError.value = null;
      }
      waiting.value = false;
    }
  }
};

function onForgetPassword() {
  $q.dialog({
    title: 'Forget Password',
    message: 'Please enter your email. We will send you a password reset link.',
    prompt: {
      model: email.value,
      type: 'text', // optional
    },
    cancel: true,
    persistent: false,
  }).onOk(async (data) => {
    await store.forgetPassword(data);
    Notify.create({
      message: 'Please check your email to find the password reset link.',
      color: 'positive',
      icon: 'check',
      position: 'top',
    });
  });
}
</script>
