/**
 * Author: Sean Verity
 */

let w = window;
/* ---- Class Import ---- */
import Cart from './classes/cart.js';
import {
    Item,
    Option,
    Plan,
    buildItemElement,
    updateCurrentPlan,
    findDOMItem,
    activateDOMItem,
    deactivateDOMItem,
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
export const settings = {
    "jsActiveClassString": "js-item-active", // String used to activate item - used by CSS
};

/* ====== Global ====== */
/* ---- Cart Init ---- *
* Create cart and cart element
*/

w.cart = new Cart();
w.currentPlan = new Plan();

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
            w.currentPlan = plan;
        }
    }

    // Initiate initial currentPlan
    updateCurrentPlan(w.currentPlan);


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
