import React, { createContext, useContext, useReducer } from "react";

type CartItem = { productId: string; name: string; price: number; qty: number; image?: string };
type State = { items: CartItem[] };
type Action =
  | { type: "add"; item: CartItem }
  | { type: "remove"; productId: string }
  | { type: "update"; productId: string; qty: number }
  | { type: "clear" };

const initial: State = { items: [] };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "add": {
      const exists = state.items.find(i => i.productId === action.item.productId);
      if (exists) {
        return { items: state.items.map(i => i.productId === action.item.productId ? { ...i, qty: i.qty + action.item.qty } : i) };
      }
      return { items: [...state.items, action.item] };
    }
    case "remove":
      return { items: state.items.filter(i => i.productId !== action.productId) };
    case "update":
      return { items: state.items.map(i => i.productId === action.productId ? { ...i, qty: action.qty } : i) };
    case "clear":
      return { items: [] };
    default:
      return state;
  }
}

const CartContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
}>({ state: initial, dispatch: () => null });

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initial);
  return <CartContext.Provider value={{ state, dispatch }}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}
