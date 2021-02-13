/**
 * Author: Sean Verity
 * This app is almost entirely clientside, with the exception being the initial fetching of JSON
 * This shopping cart is built on the principle that the DOM mirrors the data, and that all
 * changes to data will also be reflected in the DOM (view).
 * Thus all functions to data (the State) must have a DOM counterpart.
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
* Create cart data and cart view
*/

w.cartData = new Cart();
w.currentPlanData = new Plan();

function appInit(jsonData) {
    /* ---- Plans Init ---- */
    // Find container element in view
    const planContainerElement = document.body.querySelector(".plan-container");

    // Create plan items in data, add items to container in view
    for (const currentObject of jsonData.plans) {
        //Create object for plans data
        let plan = new Plan(
            currentObject.itemId,
            currentObject.itemName,
            currentObject.description,
            currentObject.price,
            currentObject.baseItems
        );

        //Create element for plans view
        let element = buildItemElement(plan);

        //Add element to view
        planContainerElement.appendChild(element);

        //Initally set #1 "Corporate Site" as currentPlan
        if (currentObject.itemId == 1) {
            w.currentPlanData = plan;
        }
    }

    // Initiate initial currentPlan
    updateCurrentPlan(w.currentPlanData);


    /* ---- Options Inits ---- *
     * Create options data from JSON
     * Adds to view
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

        if (option.possiblePlans.includes(w.currentPlanData.itemId)) {
            optionContainerElement.appendChild(buildItemElement(option));
        }
    }
}
