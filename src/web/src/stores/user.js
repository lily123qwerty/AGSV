import { defineStore } from 'pinia';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  updatePassword,
  reauthenticateWithCredential,
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
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';

export const useUserStore = defineStore('user', {
  state: () => {
    const categories = [];
    categories.push(new Category('cm', 'Competition Math', 'mdi-rocket'));
    categories.push(new Category('ib', 'IB', 'mdi-library'));
    categories.push(new Category('igcse', 'IGCSE', 'mdi-library'));

    return {
      user: false,
      graphs: [],
      categories,
      editingObject: false,
    };
  },

  getters: {
    isAdmin(state) {
      return true;
    },
  },

  actions: {
    getCategoryByKey(key) {
      return this.categories.filter((c) => c.key == key).shift();
    },

    needUser() {
      if (this.user == null) throw new Error('You must login!');
    },

    needAdmin() {
      this.needUser();
      if (!this.isAdmin) throw new Error('This action needs admin!');
    },

    needOwner(graph) {
      this.needUser();
      if (graph.uid && graph.uid != this.user.uid)
        throw new Error('You must be owner of the graph!');
    },

    needAdminOrOwner(graph) {
      this.needUser();
      if (!this.isAdmin && graph.uid && graph.uid != this.user.uid)
        throw new Error('You must be admin or owner of the graph!');
    },

    /*
      User Actions
    */

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

    async updateUserName(displayName) {
      this.needUser();
      await updateProfile(this.user, { displayName });
    },

    async updateUserPhoto(photoURL) {
      this.needUser();
      await updateProfile(this.user, { photoURL });
    },

    async updatePassword(newPassword) {
      this.needUser();
      await updatePassword(this.user, newPassword);
    },

    /*
      Graph Actions
    */

    async save(graph) {
      this.needOwner(graph);

      if (!graph.uid) graph.uid = this.user.uid;

      if (graph.uid == this.user.uid) {
        graph.ownerEmail = this.user.email;
        graph.ownerPhoto = this.user.photoURL;
        graph.ownerName = this.user.displayName;
      }

      graph.lastEdited = serverTimestamp();

      const db = getFirestore();

      if (graph.id) {
        // update
        await setDoc(doc(db, 'graphs', graph.id), graph.toJSON());
      } else {
        // create
        const docRef = await addDoc(collection(db, 'graphs'), graph.toJSON());
        // console.log('Document written with ID: ', docRef.id);
        graph.id = docRef.id;
        this.graphs.push(graph);
      }
    },

    async publish(graph, published) {
      this.needAdmin();
      await updateDoc(doc(getFirestore(), 'graphs', graph.id), { published });
      graph.published = published;
    },

    async highlight(graph, highlighted) {
      this.needAdmin();
      await updateDoc(doc(getFirestore(), 'graphs', graph.id), { highlighted });
      graph.highlighted = highlighted;
    },

    async delete(graph) {
      this.needAdminOrOwner(graph);
      await deleteDoc(doc(getFirestore(), 'graphs', graph.id));
      this.graphs = this.graphs.filter((g) => g.id != graph.id);
    },

    async getMyGraphs() {
      if (!this.user) return;
      const db = getFirestore();

      const q = query(
        collection(db, 'graphs'),
        where('uid', '==', this.user.uid)
      );
      const qs = await getDocs(q);
      this.graphs = [];

      qs.forEach((doc) => {
        const graph = Graph.fromDoc(doc);
        this.graphs.push(graph);
      });
    },

    updateMyGraphs(graph) {
      if (!this.user || !graph.uid || this.user.uid != graph.uid || !graph.id)
        return;

      for (let i in this.graphs) {
        if (this.graphs[i].id == graph.id) {
          this.graphs[i] = graph;
          return;
        }
      }

      this.graphs.push(graph);
    },

    async getCategoryGraphs(key) {
      const db = getFirestore();

      let q = query(collection(db, 'graphs'), where('category', '==', key));
      //   where('published', '==', true)
      // );
      const qs = await getDocs(q);
      const graphs = [];

      qs.forEach((doc) => {
        const graph = Graph.fromDoc(doc);
        graphs.push(graph);
        if (this.user && this.user.uid == graph.uid) this.updateMyGraphs(graph);
        console.log(graph.toJSON());
      });

      return graphs;
    },

    async getGraphByID(id) {
      const db = getFirestore();
      const d = await getDoc(doc(db, 'graphs', id));
      const graph = Graph.fromDoc(d);

      return graph;
    },
  },
});
