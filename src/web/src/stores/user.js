import { defineStore } from 'pinia';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import Graph from 'src/model/Graph';
import Category from 'src/model/Category';
import {
  doc,
  setDoc,
  deleteDoc,
  collection,
  addDoc,
  getFirestore,
  query,
  where,
  getDoc,
  getDocs,
} from 'firebase/firestore';

export const useUserStore = defineStore('user', {
  state: () => {
    const categories = [];
    categories.push(new Category('cm', 'Competition Math'));
    categories.push(new Category('ib', 'IB'));
    categories.push(new Category('igcse', 'IGCSE'));

    return {
      user: false,
      graphs: [],
      categories,
      editingObject: false,
    };
  },

  getters: {
    // doubleCount(state) {
    //     return state.counter * 2;
    // },
  },

  actions: {
    getCategoryByKey(key) {
      return this.categories.filter((c) => c.key == key).shift();
    },

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

    async delete(graph) {
      console.log(this.user, graph.id, graph.uid);
      if (this.user == null || graph.id == null || graph.uid != this.user.uid)
        throw new Error('cannot delete');

      const db = getFirestore();

      await deleteDoc(doc(db, 'graphs', graph.id));

      this.graphs = this.graphs.filter((g) => g.id != graph.id);
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

    async getCategoryGraphs(key) {
      const db = getFirestore();

      const q = query(
        collection(db, 'graphs'),
        where('category', '==', key),
        where('published', '==', true)
      );
      const qs = await getDocs(q);
      const graphs = [];

      qs.forEach((doc) => {
        const graph = Graph.fromJSON(doc.data());
        graph.id = doc.id;
        graphs.push(graph);
      });

      console.log(graphs);
      return graphs;
    },

    async getGraphByID(id) {
      const db = getFirestore();
      const d = await getDoc(doc(db, 'graphs', id));
      const graph = Graph.fromJSON(d.data());

      return graph;
    },
  },
});
