'use client';

import React, { createContext, useContext, useReducer } from "react";

// =====================
// Types
// =====================
export type CartItem = {
  productId: string;
  name: string;
  price: number;
  qty: number;
  image?: string;
};

export type State = {
  items: CartItem[];
};

export type Action =
  | { type: "add"; item: CartItem }
  | { type: "remove"; productId: string }
  | { type: "update"; productId: string; qty: number }
  | { type: "clear" };

// =====================
// Context Definition
// =====================
interface CartContextValue {
  state: State;
  dispatch: React.Dispatch<Action>;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

const initialState: State = {
  items: [],
};

// =====================
// Reducer
// =====================
function cartReducer(state: State, action: Action): State {
  switch (action.type) {
    case "add": {
      const existingItem = state.items.find(
        (item) => item.productId === action.item.productId
      );

      if (existingItem) {
        return {
          items: state.items.map((item) =>
            item.productId === action.item.productId
              ? { ...item, qty: item.qty + action.item.qty }
              : item
          ),
        };
      }

      return {
        items: [...state.items, action.item],
      };
    }

    case "remove":
      return {
        items: state.items.filter(
          (item) => item.productId !== action.productId
        ),
      };

    case "update":
      return {
        items: state.items.map((item) =>
          item.productId === action.productId
            ? { ...item, qty: action.qty }
            : item
        ),
      };

    case "clear":
      return { items: [] };

    default:
      return state;
  }
}

// =====================
// Provider
// =====================
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
}

// =====================
// Hook
// =====================
export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
}
