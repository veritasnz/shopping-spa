/**
 * Author: Sean Verity
 */

let w = window;
import { settings } from '../index.js';

/* Item Class
----------------------------------------------- */
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

    /* ---- Set ---- */
    set quantity(num) {
        if(num > -1) {
            this._quantity = num;
        }
    }

    /* ---- Class Functions ---- */

}

/* Option Class
----------------------------------------------- */
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

/* Plan Class
----------------------------------------------- */
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

/* Build Item
----------------------------------------------- 
 * Creates the DOM element that represents the item that is to be added. 
 * Also adds event listeners to the item etc.
*/
export function buildItemElement(item) {
    /* ---- Build Element ---- */
    let itemElement = document.createElement('li');
    itemElement.setAttribute("itemid", item.itemId)
    if (item instanceof Plan) {
        itemElement.classList.add('plan-element');
    } else if (item instanceof Option) {
        itemElement.classList.add('option-element');
    }
    // <li class><h4>

    /* ---- Build Title ---- */
    let itemIdElement = document.createElement('h4');
    itemIdElement.innerText = item.itemId + ": " + item.itemName;
    itemElement.appendChild(itemIdElement);
    // <li class><h4>

    /* ---- Build Description ---- */
    let itemDescriptionElement = document.createElement('p');
    itemDescriptionElement.innerText = item.description;
    itemElement.appendChild(itemDescriptionElement);
    // <li class><h4><p>

    /* ---- Build Counter ---- */
    if (item instanceof Option) {
        //Container
        let itemCounterElement = document.createElement('div');
        itemCounterElement.classList.add("item-counter");

        //Total
        let itemCounterTotalElement = document.createElement('div');
        itemCounterTotalElement.classList.add("item-counter__total");
        itemCounterTotalElement.innerText = item.quantity; // initialized as 0
        //Add click

        //Add
        let itemCounterAddElement = document.createElement('div');
        itemCounterAddElement.classList.add("item-counter__add");
        itemCounterAddElement.addEventListener("click", function () {
            if(
                (item.quantityLimit > item.quantity) ||
                (item.quantityLimit === 0)
            ){
                addToCart(item);
                updateDOMCounter(item, itemCounterTotalElement);
            } else {
                console.log('Item has reached quantity limit. Aborting add');
            }
        });

        //Remove
        let itemCounterRemoveElement = document.createElement('div');
        itemCounterRemoveElement.classList.add("item-counter__remove");
        itemCounterRemoveElement.addEventListener("click", function () {
            removeFromCart(item);
            updateDOMCounter(item, itemCounterTotalElement);
        });

        itemCounterElement.appendChild(itemCounterRemoveElement);
        itemCounterElement.appendChild(itemCounterTotalElement);
        itemCounterElement.appendChild(itemCounterAddElement);
        itemElement.appendChild(itemCounterElement);
    } else if (item instanceof Plan) {
        itemElement.addEventListener("click", function () {
            updateCurrentPlan(item);
        });
    }

    // Build rest of element here

    return itemElement;
}

/* Add item to cart
-----------------------------------------------*/
function addToCart(item) {
    w.cart.addItem(item);
    ///*** Complete method
}

/* Remove item to cart
-----------------------------------------------*/
function removeFromCart(item) {
    w.cart.removeItem(item);
    //*** */ Complete method
}

/* Update the counter
-----------------------------------------------*/
function updateDOMCounter(item, element) {
    let removeElement = element.previousElementSibling;
    let addElement = element.nextElementSibling;

    element.innerText = item.quantity;

    // If item quantity is 0, deactivate minus and activate add
    // Else activate minus
    if(item.quantity <= 0) {
        removeElement.classList.remove(settings.jsActiveClassString); // remove active state from minus button
        addElement.classList.add(settings.jsActiveClassString); // add active state to add button
    } else {
        removeElement.classList.add(settings.jsActiveClassString); // remove active state from minus button
    }


    // *** IMPLEMENT the updating of neighbouring buttons (e.g. grey out if zero items etc)
}

/* Update Plan
----------------------------------------------- */
export function updateCurrentPlan(newPlan) {
    /* ---- Cart Ops ---- *
    * Loop through cart, remove current plan and replace with new
    */
    let cartPlanFound = false; // Used to find out if operation should be plan change or plan addition
    w.cart.items.forEach(function (item, i) {
        // If is Plan object and is currentPlan
        if (w.currentPlan.itemId == item.itemId) {
            w.cart.items[i] = newPlan;
            cartPlanFound = true;
        }
    });

    if (!cartPlanFound) {
        console.log("Nothing found in cart. Adding " + newPlan.itemName + " to cart now.");
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

/* Item Utility Classes
----------------------------------------------- */
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
