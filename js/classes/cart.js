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
        console.log("Adding " + newItem.itemName + " to the cart.");

        newItem.quantity++;
        this.items.push(newItem);

        //Debugging
        // console.log("Current cart count: " + this.countItem(newItem));
        // console.log("Current item count: " + newItem.quantity);
    }

    removeItem(removeItem) {
        let itemFound = false;
        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].itemId === removeItem.itemId) {
                itemFound = true;
                this.items.splice(i, 1);
                break; //break once item found
            }
        }

        removeItem.quantity--;

        if (itemFound) {
            //Debugging
            console.log("Removing " + removeItem.itemName + " from the cart.");
            // console.log("Current cart count: " + this.countItem(removeItem));
            // console.log("Current item count: " + removeItem.quantity);
        } else {
            console.log("Tried to remove " + removeItem.itemName + ", but it was not found in the cart.");
        }
    }

    hasItem(searchItem) {
        let isFound = false;
        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].itemId === searchItem.itemId) {
                isFound = true;
            }
        }
        return isFound;
    }
    
    countItem(searchItem) {
        let count = 0;
        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].itemId === searchItem.itemId) {
                count++;
            }
        }
        return count;
    }

    clear() {
        console.log("CLearing cart.");
        this.items = new Array();
    }

    /* ---- Debug Functions ---- */
    logTotal() {
        let cartTotalCost = 0;
        console.log("The items in the cart are:");
        for (let i = 0; i < this.items.length; i++) {
            cartTotalCost += this.items[i].price;
            console.log(this.items[i].itemName + ",");
        }
        console.log("The total cost in the cart is $" + cartTotalCost);
    }
}
