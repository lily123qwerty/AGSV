import { defineStore } from 'pinia';
import Graph from 'src/model/Graph';
import Style from 'src/model/Style';
import History from 'src/model/History';

export const useGraphStore = defineStore('graph', {
  state: () => ({
    graph: new Graph(),
    history: new History(),
    metaEdited: false,
  }),

  getters: {
    // doubleCount(state) {
    //     return state.counter * 2;
    // },
  },

  actions: {
    reset(graph) {
      this.graph = graph;
      this.history = new History(graph);
      this.metaEdited = false;
    },

    historyPush() {
      this.history.push(this.graph);
    },

    historyUndo() {
      this.history.moveBackward(this.graph);
    },

    historyRedo() {
      this.history.moveForward(this.graph);
    },

    hasHistory() {
      return this.history && this.history.hasHistory;
    },

    restoreHistory() {
      this.history.restore(this.graph);
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
    addTriangleBy3Side(side1, side2, side3) {
      return this.graph.addTriangleBy3Side(side1, side2, side3);
    },
    addCircle(center, radius, semiCircle, diameter) {
      return this.graph.addCircle(center, radius, semiCircle, diameter);
    },
  },
});
