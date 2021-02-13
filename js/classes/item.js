/**
 * Author: Sean Verity
 */

let w = window;
import { settings } from '../index.js';

/* Item Class
----------------------------------------------- */
export class Item {
    constructor(itemId, itemName, description, price, className) {
        this._itemId = itemId;
        this._itemName = itemName;
        this._description = description;
        this._price = price;
        this._className = className;

        this._quantity = 0; // Start quantity is always zero
    }

    /* ---- Get ---- */
    get itemId() { return this._itemId; }
    get itemName() { return this._itemName; }
    get description() { return this._description; }
    get price() { return this._price; }
    get className() { return this._className; }

    get quantity() { return this._quantity; }

    /* ---- Set ---- */
    set quantity(num) {
        if (num > -1) {
            this._quantity = num;
        }

        return this; // Returning for method chaining
    }

    /* ---- Class Functions ---- */

}

/* Option Class
----------------------------------------------- */
export class Option extends Item {
    constructor(itemId, itemName, description, price, className, /**/ hasCustomNotes, possiblePlans, quantityLimit) {
        super(itemId, itemName, description, price, className);

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
    constructor(itemId, itemName, description, price, className, /**/ baseItems) {
        super(itemId, itemName, description, price, className);

        this._baseItems = baseItems;
    }

    /* ---- Get ---- */
    get baseItems() { return this._baseItems; }

    /* ---- Class Functions ---- */
    /* ---- Debug Functions ---- */
}

/* Build Item Element
----------------------------------------------- 
 * Creates the DOM element that represents the item that is to be added. 
 * Also adds event listeners to the item etc.
*/
export function buildItemElement(currentItem) {
    /* ---- Create Parent ---- */
    let itemParentElement = document.createElement('li');
    itemParentElement.setAttribute("itemid", currentItem.itemId);
    itemParentElement.classList.add(currentItem.className);

    /* ---- Build Title ---- */
    let itemTitleElement = document.createElement('h4');
    itemTitleElement.innerText = currentItem.itemId + ": " + currentItem.itemName;
    itemParentElement.appendChild(itemTitleElement);

    /* ---- Build Description ---- */
    let itemDescriptionElement = document.createElement('p');
    itemDescriptionElement.innerText = currentItem.description;
    itemParentElement.appendChild(itemDescriptionElement);

    /* ---- Build Counter ---- */
    if (currentItem instanceof Option) { //*** REFACTOR 'instanceof' not needed if classes refactored
        itemParentElement.appendChild(buildCounterElement(currentItem));
    } else if (currentItem instanceof Plan) { //*** REFACTOR 'instanceof' not needed if classes refactored
        itemParentElement.addEventListener("click", function () {
            updateCurrentPlan(currentItem);
        });
    }

    // Build rest of element here

    return itemParentElement;
}

/* Build Counter Element
-----------------------------------------------*/
function buildCounterElement(item) {
        //Parent
        let counterElement = document.createElement('div');
        counterElement.classList.add("item-counter");

        //Total
        let itemCounterTotalElement = document.createElement('div');
        itemCounterTotalElement.classList.add("item-counter__total");
        itemCounterTotalElement.innerText = item.quantity; // initialized as 0
        //Add click

        //Add Button
        let itemCounterAddElement = document.createElement('div');
        itemCounterAddElement.classList.add("item-counter__add");
        itemCounterAddElement.classList.add(settings.jsActiveClassString); // Initialize as active
        itemCounterAddElement.addEventListener("click", function () {
            // Based on item quantityLimit, decide to add to cart
            if ((item.quantityLimit > item.quantity) || (item.quantityLimit === 0)) {
                addToCart(item);
                updateViewCounterTotal(item, itemCounterTotalElement);
            } else {
                console.log('Item has reached quantity limit. Aborting add');
            }
        });

        //Remove Button
        let itemCounterRemoveElement = document.createElement('div');
        itemCounterRemoveElement.classList.add("item-counter__remove");
        itemCounterRemoveElement.addEventListener("click", function () {
            removeFromCart(item);
            updateViewCounterTotal(item, itemCounterTotalElement);
        });

        // Append to parent
        counterElement.appendChild(itemCounterRemoveElement);
        counterElement.appendChild(itemCounterTotalElement);
        counterElement.appendChild(itemCounterAddElement);

        return counterElement;
}

/* Add item to cart
-----------------------------------------------*/
function addToCart(item) {
    w.cartData.addItem(item);
    ///*** Complete method - update price etc
}

/* Remove item to cart
-----------------------------------------------*/
function removeFromCart(item) {
    w.cartData.removeItem(item);
    //*** Complete method - update price etc
}

/* Update the counter
-----------------------------------------------*/
function updateViewCounterTotal(item, element) {
    let removeElement = element.previousElementSibling;
    let addElement = element.nextElementSibling;

    element.innerText = item.quantity;

    // If item quantity is 0, deactivate minus and activate add
    // Else activate minus
    if (item.quantity <= 0) {
        removeElement.classList.remove(settings.jsActiveClassString); // remove active state from minus button
        addElement.classList.add(settings.jsActiveClassString); // add active state to add button
    } else {
        removeElement.classList.add(settings.jsActiveClassString); // remove active state from minus button
    }
}

/* Update Plan
----------------------------------------------- */
export function updateCurrentPlan(newPlan) {
    /* ---- Cart Ops ---- */

    // Loop through cart items, swap current plan item with new plan item
    let cartPlanFound = false;
    w.cartData.items.forEach(function (item, i) {
        // If is Plan object and is currentPlan
        if (w.currentPlanData.itemId == item.itemId) {
            w.cartData.items[i] = newPlan;
            cartPlanFound = true;
        }
    });

    if (!cartPlanFound) {
        // If plan not found in cart, create
        console.log("Nothing found in cart. Adding " + newPlan.itemName + " to cart now.");
        w.cartData.addItem(newPlan);
    } else if (w.currentPlanData != newPlan) {
        console.log(w.currentPlanData.itemName + " plan found in cart. Replacing with " + newPlan.itemName + " now.");
    } else {
        console.log("This plan is already selected");
    }

    /* ---- DOM Ops ---- *
     * Find current plan in the DOM, deactivate.
     * Find new plan in DOM, activate
    */
    deactivateDOMItem(w.currentPlanData.itemId);
    activateDOMItem(newPlan.itemId);

    // Finally update the current plan
    w.currentPlanData = newPlan;
}

/* Item Utility Classes
----------------------------------------------- */
export function findDOMItem(itemId) {
    return document.body.querySelector('[itemid="' + itemId + '"]');
}

export function activateDOMItem(itemId) {
    let elementToActivate = findDOMItem(itemId);
    if (elementToActivate) {
        elementToActivate.classList.add(settings.jsActiveClassString);
    }
}

export function deactivateDOMItem(itemId) {
    let elementToDeactivate = findDOMItem(itemId);
    if (elementToDeactivate) {
        elementToDeactivate.classList.remove(settings.jsActiveClassString);
    }
}
