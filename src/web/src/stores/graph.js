import { defineStore } from 'pinia';
import Graph from 'src/model/Graph';
import Style from 'src/model/Style';
import History from 'src/model/History';

export const useGraphStore = defineStore('graph', {
  state: () => ({
    graph: new Graph(),
    history: new History(),
  }),

  getters: {
    // doubleCount(state) {
    //     return state.counter * 2;
    // },
  },

  actions: {
    test() {
      let t = this.graph.addTriangleBy2Angle1Side(40, 105, 100);
      this.graph.addTriangleBy2Angle1Side(45, 45, t.edges[2], 1);
      t.vertices[0].style = new Style({ color: 'red' });
      console.log(this.graph.toJSON());
    },

    historyPush() {
      this.history.push(this.graph);
    },

    historyUndo() {
      let g = this.history.moveBackward();
      if (g) {
        this.graph = g;
      }
    },

    historyRedo() {
      let g = this.history.moveForward();
      if (g) {
        this.graph = g;
      }
    },

    addTriangleBy2Angle1Side(angle1, angle2, side, direction) {
      return this.graph.addTriangleBy2Angle1Side(
        angle1,
        angle2,
        side,
        direction
      );
    },

    addTriangleByInnerAngle2Side(angle1, side1, side2, direction) {
      return this.graph.addTriangleByInnerAngle2Side(
        angle1,
        side1,
        side2,
        direction
      );
    },
    addTriangleByOuterAngle2Side(angle1, side1, side2, direction) {
      return this.graph.addTriangleByOuterAngle2Side(
        angle1,
        side1,
        side2,
        direction
      );
    },
    addTriangleBy3Dot(dot1, dot2, dot3) {
      return this.graph.addTriangleBy3Dot(
        dot1,
        dot2,
        dot3,
        null,
        null,
        null,
        null,
        null
      );
    },
  },
});
