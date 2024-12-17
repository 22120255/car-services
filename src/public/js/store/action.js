import { store } from "./index.js";

const updateAmountCart = (amountCart) => {
    store.dispatch({
        type: "UPDATE_AMOUNT_CART",
        payload: amountCart
    })
};

export {
    updateAmountCart
}