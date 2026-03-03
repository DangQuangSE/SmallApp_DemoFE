// Cart service - NOTE: No cart endpoint exists in the new BE API.
// Cart functionality should be handled client-side (localStorage) or removed.
// Keeping a minimal stub for compilation compatibility.

export interface CartItem {
  listingId: number;
  title: string;
  price: number;
  imageUrl: string;
}

export interface Cart {
  items: CartItem[];
  totalAmount: number;
}

// Client-side cart using localStorage
export const cartService = {
  getCart: (): Cart => {
    const cartStr = localStorage.getItem("cart");
    try {
      return cartStr ? JSON.parse(cartStr) : { items: [], totalAmount: 0 };
    } catch {
      return { items: [], totalAmount: 0 };
    }
  },

  addToCart: (item: CartItem): Cart => {
    const cart = cartService.getCart();
    const existing = cart.items.find((i) => i.listingId === item.listingId);
    if (!existing) {
      cart.items.push(item);
      cart.totalAmount += item.price;
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    return cart;
  },

  removeFromCart: (listingId: number): Cart => {
    const cart = cartService.getCart();
    const item = cart.items.find((i) => i.listingId === listingId);
    if (item) {
      cart.items = cart.items.filter((i) => i.listingId !== listingId);
      cart.totalAmount -= item.price;
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    return cart;
  },

  clearCart: (): void => {
    localStorage.removeItem("cart");
  },
};
