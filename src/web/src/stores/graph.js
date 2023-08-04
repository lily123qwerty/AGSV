import { defineStore } from 'pinia';
import Graph from 'src/model/Graph';
import Style from 'src/model/Style';

export const useGraphStore = defineStore('graph', {
    state: () => ({
        graph: new Graph(),
        viewBox: { x: 0, y: 0, width: 300, height: 300 },
    }),

    getters: {
        // doubleCount(state) {
        //     return state.counter * 2;
        // },
    },

    actions: {
        test() {
            console.log('store test');
            let t = this.graph.addTriangleBy2Angle1Side(40, 105, 100);
            this.graph.addTriangleBy2Angle1Side(45, 45, t.edges[2], 1);
            t.vertices[0].style = new Style({ color: 'red' });
            console.log(this.graph.toJSON());
        },
        setViewBox(x, y, width, height) {
            this.viewBox = { x, y, width, height };
        },
        addTriangleBy2Angle1Side(angle1, angle2, side, direction) {
            return this.graph.addTriangleBy2Angle1Side(
                angle1,
                angle2,
                side,
                direction
            );
        },
    },
});
