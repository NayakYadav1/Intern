class Cart {
    constructor() {
        this.items = [];
    }

    addProduct(product) {
        this.items.push(product);
    }

    getItems() {
        return this.items;
    }

    getTotalItems() {
        return this.items.length;
    }

    isInCart(productId) {
        return this.items.some(item => item.id === productId);
    }
}

module.exports = Cart;
