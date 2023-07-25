export default class Style {
    constructor({ visible, size, color, label }) {
        this._visible = visible !== undefined ? visible : true;
        this._size = size !== undefined ? size : 5;
        this._color = color !== undefined ? color : 'black';
        this._label = label !== undefined ? label : '';
    }

    get visible() {
        return this._visible;
    }

    set visible(val) {
        this._visible = val;
    }

    get size() {
        return this._size;
    }

    set size(val) {
        this._size = val;
    }

    get color() {
        return this._color;
    }

    set color(val) {
        this._color = val;
    }

    get label() {
        return this._label;
    }

    set label(val) {
        this._label = val;
    }

    toJSON() {
        return {
            visible: this.visible,
            size: this.size,
            color: this.color,
            label: this.label,
        };
    }

    static fromJSON(json) {
        let obj = new Style();
        obj.visible = json.visible;
        obj.size = json.size;
        obj.color = json.color;
        obj.label = json.label;
        return obj;
    }
}
