// https://github.com/steveclarke/quasar-firebase-example/

import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useUserStore } from '../stores/user';

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

const userStore = useUserStore();

export default ({ app, router, store }) => {
  // Initialize Firebase from settings
  initializeApp(firebaseConfig);

  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    console.log('onAuthStateChanged : user is ', user);
    userStore.user = user;

    if (user) {
      userStore.getMyGraphs();
    } else {
      userStore.graphs = [];
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
