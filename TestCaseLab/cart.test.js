// const Cart = require('./cart');

// describe('🛒 Cart System Test Suite', () => {

//     test('✅ Should initialize cart with 0 items', () => {
//         const cart = new Cart();
//         expect(cart.getTotalItems()).toBe(0);
//     });

//     test('✅ Should add one product to the cart', () => {
//         const cart = new Cart();
//         const product = { id: 1, name: 'Mouse', price: 25 };
//         cart.addProduct(product);

//         expect(cart.getItems()).toContainEqual(product);
//         expect(cart.getTotalItems()).toBe(1);
//     });

//     test('✅ Should confirm product is in the cart by ID', () => {
//         const cart = new Cart();
//         const product = { id: 2, name: 'Keyboard', price: 50 };
//         cart.addProduct(product);

//         expect(cart.isInCart(2)).toBe(true);
//     });

//     test('❌ Should return false for product not in the cart', () => {
//         const cart = new Cart();
//         const product = { id: 3, name: 'Monitor', price: 200 };

//         expect(cart.isInCart(3)).toBe(false); // realistic fail case
//     });

// });

const Cart = require('./cart');

describe('🛒 Cart System Test Suite', () => {

    test('✅ Should initialize cart with 0 items', () => {
        const cart = new Cart();
        expect(cart.getTotalItems()).toBe(0);
    });

    test('✅ Should add a product to the cart and confirm it exists', () => {
        const cart = new Cart();
        const product = { id: 1, name: 'Laptop', price: 1500 };
        cart.addProduct(product);

        expect(cart.getItems()).toContainEqual(product);
        expect(cart.getTotalItems()).toBe(1);
        expect(cart.isInCart(1)).toBe(true);
    });

    test('❌ Should fail if we expect a different product to exist in the cart', () => {
        const cart = new Cart();
        const addedProduct = { id: 2, name: 'Mouse', price: 20 };
        const notAddedProduct = { id: 3, name: 'Keyboard', price: 40 };

        cart.addProduct(addedProduct);

        // ❌ Expecting a product that was NOT added
        expect(cart.getItems()).toContainEqual(notAddedProduct); // ❌ Fail
    });

});
