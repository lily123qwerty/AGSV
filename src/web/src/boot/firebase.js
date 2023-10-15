// https://github.com/steveclarke/quasar-firebase-example/

import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
// import 'firebase/firestore'; // eslint-disable-line

const firebaseConfig = {
  apiKey: 'AIzaSyBPZmWzY5be8-XUiZlJwcZLFXnJXYV0Mqo',
  authDomain: 'agsv-f154d.firebaseapp.com',
  projectId: 'agsv-f154d',
  storageBucket: 'agsv-f154d.appspot.com',
  messagingSenderId: '469144188212',
  appId: '1:469144188212:web:d3d6803554b3b326b1e161',
  measurementId: 'G-X91LWFRSXK',
};

export default ({ app, router, store }) => {
  // Initialize Firebase from settings
  initializeApp(firebaseConfig);

  const auth = getAuth();

  onAuthStateChanged(auth, (user) => {
    console.log('onAuthStateChanged : user is ', user);
    if (user) {
      // // Signed in. Let Vuex know.
      // store.commit('auth/SET_USER', user);
      // // The .catch ignore error if .replace is redirecting to dashboard and we
      // // are already at that route.
      // // https://github.com/vuejs/vue-router/issues/2881#issuecomment-520554378
      // router.replace({ name: 'dashboard' }).catch(() => {});
      // new Vue(app); /* eslint-disable-line no-new */
    } else {
      // // Signed out. Let Vuex know.
      // store.commit('auth/RESET_USER');
      // router.replace({ name: 'signIn' }).catch(() => {});
      // new Vue(app); /* eslint-disable-line no-new */
    }
  });

  router.beforeEach((to, from, next) => {
    // Check to see if the route has the meta field "authRequired" set to true
    const authRequired = to.matched.some((route) => route.meta.authRequired);

    if (authRequired && !auth.currentUser) {
      next({
        path: '/user/login',
      });
    } else {
      // Doesn't require authentication or has user. Just continue on.
      next();
    }
  });
};
