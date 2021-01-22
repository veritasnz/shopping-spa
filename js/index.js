/**
 * Author: Sean Verity
 */

/* ---- Class Import ---- */
import Cart from './classes/cart.js';
import {
    Item,
    Option,
    Plan,
    buildItemElement,
    findDOMItem,
    activateDOMItem,
    deactivateDOMItem
} from './classes/item.js';

/* ====== WP Queries ====== *
 * Relevant WP Queries go here.
 * In the meantime processed with local JSON
*/

fetch("./js/data.json")
    .then(response => {
        return response.json();
    })
    .then(function (data) {
        appInit(data);
    });

/* ====== Settings ====== */
let settings = {
    "jsActiveClassString": "js-item-active", // String used to activate item - used by CSS
};
export default settings;

/* ====== Global ====== */
/* ---- Cart Init ---- *
* Create cart and cart element
*/
const cartTotalElement = document.body.querySelector(".cart-total");
let cart = new Cart();
let currentPlan = new Plan();

function appInit(jsonData) {
    /* ---- Plans Init ---- *
     * Create plans from JSON data
     * Initiates cart, plans and options in the DOM
     * Sets plan with itemId=1 (standard plan) to be the currently selected plan
    */
    // Create plan-container
    const planContainerElement = document.body.querySelector(".plan-container");

    // Create plan items, add items to container
    for (const currentObject of jsonData.plans) {
        //Create current plan instance
        let plan = new Plan(
            currentObject.itemId,
            currentObject.itemName,
            currentObject.description,
            currentObject.price,
            currentObject.baseItems
        );

        //Create element for planlist
        let element = buildItemElement(plan);

        //Add current plan to planlist
        planContainerElement.appendChild(element);

        //Initally set #1 "Corporate Site" as currentPlan
        if (currentObject.itemId == 1) {
            currentPlan = plan;
        }
    }

    updateCurrentPlan(currentPlan);

    /* ---- Options Inits ---- *
     * Create options from JSON data
    */
    let optionContainerElement = document.body.querySelector(".option-container");
    for (const currentObject of jsonData.options) {
        let option = new Option(
            currentObject.itemId,
            currentObject.itemName,
            currentObject.description,
            currentObject.price,
            currentObject.hasCustomNotes,
            currentObject.possiblePlans,
            currentObject.quantityLimit
        );

        if (option.possiblePlans.includes(currentPlan.itemId)) {
            optionContainerElement.appendChild(buildItemElement(option));
        }
    }
}

function updateCurrentPlan(newPlan) {
    /* ---- Cart Ops ---- *
    * Loop through cart, remove current plan and replace with new
    */
    let cartPlanFound = false; // Used to find out if operation should be plan change or plan addition
    cart.items.forEach(function (item, i) {
        // If is Plan object and is currentPlan
        if ((item instanceof Plan) && (currentPlan.itemId == item.itemId)) {
            cart.items[i] = newPlan;
            cartPlanFound = true;
        }
    });

    if (!cartPlanFound) {
        console.log("Plan not found in cart. Adding " + newPlan.itemName + " to cart now.");
        cart.addItem(newPlan);
    }

    /* ---- DOM Ops ---- *
     * Find current plan in the DOM, deactivate.
     * Find new plan in DOM, activate
    */
    deactivateDOMItem(currentPlan.itemId);
    activateDOMItem(newPlan.itemId);

    // Finally update the current plan
    currentPlan = newPlan;
}
