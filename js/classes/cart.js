/**
 * Author: Sean Verity
 */
import settings from '../index.js'; // The settings object

export default class Cart {
    constructor() {
        this._items = new Array();
    }
    /* ---- Get ---- */
    get items() { return this._items; }

    /* ---- Class Functions ---- */
    getTotalPrice() {
    }

    addItem(newItem) {
        this.items.push(newItem);
    }

    removeItem() {
    }

    clear() {
    }

    /* ---- Debug Functions ---- */
    displayTotal() {

    }
}