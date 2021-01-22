/**
 * Author: Sean Verity
 */

let w = window;
import {settings} from '../index.js';


export class Item {
    constructor(itemId, itemName, description, price) {
        this._itemId = itemId;
        this._itemName = itemName;
        this._description = description;
        this._price = price;

        this._quantity = 0; // Start quantity is always zero
    }

    /* ---- Get ---- */
    get itemId() { return this._itemId; }
    get itemName() { return this._itemName; }
    get description() { return this._description; }
    get price() { return this._price; }

    get quantity() { return this._quantity; }

    /* ---- Class Functions ---- */

}

export class Option extends Item {
    constructor(itemId, itemName, description, price, /**/ hasCustomNotes, possiblePlans, quantityLimit) {
        super(itemId, itemName, description, price);

        this._hasCustomNotes = hasCustomNotes;
        this._possiblePlans = possiblePlans;
        this._quantityLimit = quantityLimit;

        this._customNotes = null;  // Until user enters data, this is undefined
    }

    /* ---- Get ---- */
    get hasCustomNotes() { return this._hasCustomNotes; }
    get possiblePlans() { return this._possiblePlans; }
    get quantityLimit() { return this._quantityLimit; }

    get customNotes() { return this._customNotes; }

    /* ---- Class Functions ---- */
    /* ---- Debug Functions ---- */
}

export class Plan extends Item {
    constructor(itemId, itemName, description, price, /**/ baseItems) {
        super(itemId, itemName, description, price);

        this._baseItems = baseItems;
    }

    /* ---- Get ---- */
    get baseItems() { return this._baseItems; }

    /* ---- Class Functions ---- */
    /* ---- Debug Functions ---- */
}

/* ---- Build Item Element ---- *
 * Creates the DOM element that represents the item that is to be added. 
 * Also adds event listeners to the item etc.
*/
export function buildItemElement(item) {

    // Build Element
    let itemElement = document.createElement('li');
    itemElement.setAttribute("itemid", item.itemId)
    if (item instanceof Plan) {
        itemElement.classList.add('plan-element');
    } else if (item instanceof Option) {
        itemElement.classList.add('option-element');
    }
    // <li class><h4>

    // Build Title
    let itemIdElement = document.createElement('h4');
    itemIdElement.innerText = item.itemId + ": " + item.itemName;
    itemElement.appendChild(itemIdElement);
    // <li class><h4>

    // Build Description
    let itemDescriptionElement = document.createElement('p');
    itemDescriptionElement.innerText = item.description;
    itemElement.appendChild(itemDescriptionElement);
    // <li class><h4><p>

    // Build rest of element here

    return itemElement;
}

export function findDOMItem(itemId) {
    return document.body.querySelector('[itemid="' + itemId + '"]');
}

export function activateDOMItem(itemId) {
    let elementToActivate = document.body.querySelector('[itemid="' + itemId + '"]');
    if (elementToActivate) {
        elementToActivate.classList.add(settings.jsActiveClassString);
    }
}

export function deactivateDOMItem(itemId) {
    let elementToDeactivate = document.body.querySelector('[itemid="' + itemId + '"]');
    if (elementToDeactivate) {
        elementToDeactivate.classList.remove(settings.jsActiveClassString);
    }
}

export function updateCurrentPlan(newPlan) {
    /* ---- Cart Ops ---- *
    * Loop through cart, remove current plan and replace with new
    */
    let cartPlanFound = false; // Used to find out if operation should be plan change or plan addition
    w.cart.items.forEach(function (item, i) {
        // If is Plan object and is currentPlan
        if ((item instanceof Plan) && (w.currentPlan.itemId == item.itemId)) {
            w.cart.items[i] = newPlan;
            cartPlanFound = true;
        }
    });

    if (!cartPlanFound) {
        console.log("Current plan not found in cart. Adding " + newPlan.itemName + " to cart now.");
        w.cart.addItem(newPlan);
    } else {
        console.log(w.currentPlan.itemName + " plan found in cart. Replacing with " + newPlan.itemName + " now.");
    }

    /* ---- DOM Ops ---- *
     * Find current plan in the DOM, deactivate.
     * Find new plan in DOM, activate
    */
    deactivateDOMItem(currentPlan.itemId);
    activateDOMItem(newPlan.itemId);

    // Finally update the current plan
    w.currentPlan = newPlan;
}
