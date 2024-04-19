import { defineStore } from 'pinia';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  updatePassword,
  sendEmailVerification,
  sendPasswordResetEmail,
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
  orderBy,
  getDoc,
  getDocs,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { Notify } from 'quasar';

async function notifyError(asyncAction) {
  try {
    return await asyncAction();
  } catch (error) {
    console.log(error.message);
    Notify.create({
      message: error.message,
      color: 'red',
      icon: 'warning',
      position: 'top',
    });
    throw error;
  }
}

const PUBLIC_DOMAIN = 'https://agsv.fun';
// const PUBLIC_DOMAIN = 'http://localhost:9000'; //for Development

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
      if (
        state.user &&
        (state.user.uid == 'gpxFpKcDiuPlomj07BagzIlOTrI3' ||
          state.user.uid == '3jiuZmUmQgOVCOd2fF2NAhpDS2V2')
      )
        return true;
      return false;
    },
  },

  actions: {
    getCategoryByKey(key) {
      return this.categories.filter((c) => c.key == key).shift();
    },

    needUser() {
      if (this.user == null) throw new Error('You must login!');
      // throw new Error('You must login!');
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

    async register(displayName, email, password) {
      await notifyError(async () => {
        const auth = getAuth();
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        await updateProfile(userCredential.user, { displayName });

        const actionCodeSettings = {
          url: PUBLIC_DOMAIN,
          handleCodeInApp: false,
        };
        await sendEmailVerification(userCredential.user, actionCodeSettings);
      });
    },

    async sendEmailVerification() {
      await notifyError(async () => {
        this.needUser();
        const actionCodeSettings = {
          url: PUBLIC_DOMAIN,
          handleCodeInApp: false,
        };
        await sendEmailVerification(this.user, actionCodeSettings);
      });
    },

    async login(email, password) {
      await notifyError(async () => {
        const auth = getAuth();
        await signInWithEmailAndPassword(auth, email, password);
      });
    },

    logout() {
      const auth = getAuth();
      signOut(auth);
    },

    async updateUserName(displayName) {
      await notifyError(async () => {
        this.needUser();
        await updateProfile(this.user, { displayName });
      });
    },

    async updateUserPhoto(photoURL) {
      await notifyError(async () => {
        this.needUser();
        await updateProfile(this.user, { photoURL });
      });
    },

    // async updatePassword(newPassword) {
    //   await notifyError(async () => {
    //     this.needUser();
    //     await updatePassword(this.user, newPassword);
    //   });
    // },

    async resetPassword() {
      await notifyError(async () => {
        this.needUser();
        const actionCodeSettings = {
          url: PUBLIC_DOMAIN,
          handleCodeInApp: false,
        };
        const auth = getAuth();
        await sendPasswordResetEmail(auth, this.user.email, actionCodeSettings);
      });
    },

    async forgetPassword(email) {
      await notifyError(async () => {
        const actionCodeSettings = {
          url: PUBLIC_DOMAIN,
          handleCodeInApp: false,
        };
        const auth = getAuth();
        await sendPasswordResetEmail(auth, email, actionCodeSettings);
      });
    },

    /*
      Graph Actions
    */

    async save(graph) {
      await notifyError(async () => {
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
      });
    },

    async publish(graph, published) {
      await notifyError(async () => {
        this.needAdmin();
        await updateDoc(doc(getFirestore(), 'graphs', graph.id), { published });
        graph.published = published;
      });
    },

    async highlight(graph, highlighted) {
      await notifyError(async () => {
        this.needAdmin();
        await updateDoc(doc(getFirestore(), 'graphs', graph.id), {
          highlighted,
        });
        graph.highlighted = highlighted;
      });
    },

    async delete(graph) {
      await notifyError(async () => {
        this.needAdminOrOwner(graph);
        await deleteDoc(doc(getFirestore(), 'graphs', graph.id));
        this.graphs = this.graphs.filter((g) => g.id != graph.id);
      });
    },

    async getMyGraphs() {
      await notifyError(async () => {
        if (!this.user) return;
        const db = getFirestore();

        const q = query(
          collection(db, 'graphs'),
          where('uid', '==', this.user.uid)
        );
        // orderBy('lastEdited', 'desc')
        const qs = await getDocs(q);
        this.graphs = [];

        qs.forEach((doc) => {
          const graph = Graph.fromDoc(doc);
          this.graphs.push(graph);
        });
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
      return await notifyError(async () => {
        const db = getFirestore();

        const w = [where('category', '==', key)];
        if (!this.isAdmin) w.push(where('published', '==', true));
        // w.push(orderBy('lastEdited', 'desc'));

        const q = query(collection(db, 'graphs'), ...w);

        const qs = await getDocs(q);
        const graphs = [];

        qs.forEach((doc) => {
          const graph = Graph.fromDoc(doc);
          graphs.push(graph);
          if (this.user && this.user.uid == graph.uid)
            this.updateMyGraphs(graph);
          console.log(graph.toJSON());
        });

        return graphs;
      });
    },

    async getHighlightedGraphs() {
      return await notifyError(async () => {
        const db = getFirestore();

        const q = query(
          collection(db, 'graphs'),
          where('highlighted', '==', true)
        );

        const qs = await getDocs(q);
        const graphs = [];

        qs.forEach((doc) => {
          const graph = Graph.fromDoc(doc);
          graphs.push(graph);
          if (this.user && this.user.uid == graph.uid)
            this.updateMyGraphs(graph);
        });

        return graphs;
      });
    },

    async getGraphByID(id) {
      return await notifyError(async () => {
        const db = getFirestore();
        const d = await getDoc(doc(db, 'graphs', id));
        const graph = Graph.fromDoc(d);

        return graph;
      });
    },
  },
});
