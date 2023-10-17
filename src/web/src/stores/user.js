import { defineStore } from 'pinia';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: false,
  }),

  getters: {
    // doubleCount(state) {
    //     return state.counter * 2;
    // },
  },

  actions: {
    login(email, password) {},

    logout() {},

    register(name, email, password, callback) {
      const auth = getAuth();
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // console.log(userCredential);
          // Signed up
          this.user = userCredential.user;
          callback();
        })
        .catch((error) => {
          // console.log(error);
          const errorCode = error.code;
          const errorMessage = error.message;

          callback(errorCode, errorMessage);
        });
    },
  },
});
