/**
 * Author: Sean Verity
 */
import * as app from '../index.js';

export default class Cart {
    constructor() {
        this._items = new Array();
        const cartTotalElement = document.body.querySelector(".cart-total");
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
    logTotal() {

    }
}