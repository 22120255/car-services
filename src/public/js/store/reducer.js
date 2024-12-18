// import { createStore } from "https://cdn.skypack.dev/redux";

const init = {
    amountCart: 0
};

function createStore(reducer) {
    let state = reducer(undefined, {});

    let subscribers = [];

    return {
        getState() {
            return state;
        },
        dispatch(action) {
            state = reducer(state, action);

            subscribers.forEach((subscriber) => subscriber());
        },
        subscribe(subscriber) {
            subscribers.push(subscriber);
        },
    };
}

function reducer(state = init, action) {
    switch (action.type) {
        case "UPDATE_AMOUNT_CART":
            return {
                ...state,
                amountCart: action.payload
            };
        default:
            return state;
    }
}
const store = createStore(reducer);

const renderCart = () => {
    const amountCart = store.getState().amountCart;
    if (amountCart === 0) {
        $('#btn-cart .btn-cart__badge').addClass("d-none");
        return;
    };
    $('#btn-cart .btn-cart__badge').removeClass("d-none").text(amountCart > 99 ? '99+' : amountCart);
};
store.subscribe(renderCart);

export {
    store
}