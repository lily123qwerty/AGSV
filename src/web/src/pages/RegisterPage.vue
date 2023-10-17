<!-- src/pages/RegisterPage.vue -->

<template>
  <!-- Template by Joabson Arley
   https://github.com/Joabsonlg/quasar-template -->

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
              Enter your details to get started!
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
                    Registration Form
                  </div>
                </div>
              </div>

              <q-form ref="form" class="q-gutter-md" @submit="submit">
                <q-input
                  v-model="name"
                  label="Name"
                  name="Name"
                  :readonly="waiting"
                  lazy-rules
                  :rules="[
                    (val) =>
                      (val && val.length >= 3) ||
                      'Please use minimum 3 characters',
                  ]"
                />
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

                      if (emailHasError && emailErrorMessage) {
                        return emailErrorMessage;
                      }
                    },
                  ]"
                />
                <q-input
                  v-model="password"
                  label="Password"
                  name="password"
                  type="password"
                  :readonly="waiting"
                  lazy-rules
                  :rules="[
                    (val) =>
                      (val && val.length >= 6) ||
                      'Please use minimum 6 characters',
                  ]"
                />

                <div>
                  <q-btn
                    class="full-width fredoka"
                    color="primary"
                    label="Register"
                    rounded
                    type="submit"
                    :loading="waiting"
                  >
                  </q-btn>

                  <div class="q-mt-lg">
                    <div class="q-mt-sm">
                      Already have an account?
                      <router-link
                        v-if="!waiting"
                        class="text-primary"
                        to="/user/login"
                        >Login</router-link
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
import { validateEmail } from '../model/helper';
import { useUserStore } from 'stores/user';

const store = useUserStore();

const name = ref(null);
const email = ref(null);
const password = ref(null);
const waiting = ref(false);

const form = ref(null);

const emailInput = ref(null);
const emailHasError = ref(false);
const emailErrorMessage = ref('');

const submit = async () => {
  if (form.value.validate()) {
    waiting.value = true;
    store.register(
      name.value,
      email.value,
      password.value,
      (errorCode, errorMessage) => {
        waiting.value = false;
        // console.log(errorCode);
        if (errorCode == 'auth/email-already-in-use') {
          emailHasError.value = true;
          emailErrorMessage.value = 'Email already in use';

          emailInput.value.validate();
          emailInput.value.focus();

          emailHasError.value = false;
          emailErrorMessage.value = '';
        }
      }
    );
  }
};
</script>
