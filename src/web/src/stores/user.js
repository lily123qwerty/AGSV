import { defineStore } from 'pinia';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import Graph from 'src/model/Graph';
import { doc, setDoc } from 'firebase/firestore';
import { collection, addDoc } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import { query, where, getDocs } from 'firebase/firestore';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: false,
    graphs: [],
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
          callback();
        })
        .catch((error) => {
          // console.log(error);
          const errorCode = error.code;
          const errorMessage = error.message;

          callback(errorCode, errorMessage);
        });
    },

    login(email, password, callback) {
      const auth = getAuth();
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          callback();
        })
        .catch((error) => {
          console.log(error);
          const errorCode = error.code;
          const errorMessage = error.message;

          callback(errorCode, errorMessage);
        });
    },

    logout() {
      const auth = getAuth();
      signOut(auth);
    },

    async save(graph) {
      if (this.user == null) return;
      graph.uid = this.user.uid;

      const db = getFirestore();

      if (graph.id) {
        // update
        await setDoc(doc(db, 'graphs', graph.id), graph.toJSON());
      } else {
        // create
        const docRef = await addDoc(collection(db, 'graphs'), graph.toJSON());
        console.log('Document written with ID: ', docRef.id);
        graph.id = docRef.id;
      }
    },
    async getMyGraphs() {
      if (this.user == null) return;
      const db = getFirestore();

      const q = query(
        collection(db, 'graphs'),
        where('uid', '==', this.user.uid)
      );
      const qs = await getDocs(q);
      this.graphs = [];

      qs.forEach((doc) => {
        const graph = Graph.fromJSON(doc.data());
        graph.id = doc.id;
        this.graphs.push(graph);
      });

      console.log(this.graphs);
    },
  },
});
