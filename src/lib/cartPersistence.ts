// src/lib/cartPersistence.ts

import type { CartItem } from "@/redux/features/cart-slice";

const CART_STORAGE_KEY = "pilotwardrobe_cart";

// Type guard to validate CartItem
const isValidCartItem = (item: any): item is CartItem => {
  return (
    item &&
    typeof item.id === "number" &&
    typeof item.title === "string" &&
    typeof item.price === "number" &&
    typeof item.discountedPrice === "number" &&
    typeof item.quantity === "number" &&
    (!item.imgs || 
      (typeof item.imgs === "object" && 
       Array.isArray(item.imgs.thumbnails) && 
       Array.isArray(item.imgs.previews)))
  );
};

// Filter out invalid items
const filterValidCartItems = (items: any[]): CartItem[] => {
  return items.filter(isValidCartItem);
};

export const saveCart = (items: CartItem[]) => {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error("Failed to save cart to localStorage:", error);
    }
  }
};

export const loadCart = (): CartItem[] => {
  if (typeof window === "undefined") return [];
  
  try {
    const saved = localStorage.getItem(CART_STORAGE_KEY);
    if (!saved) return [];
    
    const parsed = JSON.parse(saved);
    
    // Ensure it's an array
    if (!Array.isArray(parsed)) {
      console.warn("Cart data is not an array, resetting...");
      clearCartStorage();
      return [];
    }
    
    // Filter out invalid items
    const validItems = filterValidCartItems(parsed);
    
    // If some items were invalid, log a warning
    if (validItems.length !== parsed.length) {
      console.warn(`Filtered out ${parsed.length - validItems.length} invalid cart items`);
      // Optional: Save the cleaned version back
      saveCart(validItems);
    }
    
    return validItems;
  } catch (error) {
    console.error("Failed to load cart from localStorage:", error);
    // Clear corrupted data
    clearCartStorage();
    return [];
  }
};

export const clearCartStorage = () => {
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch (error) {
      console.error("Failed to clear cart from localStorage:", error);
    }
  }
};

// Optional helper: Get cart count
export const getCartCount = (): number => {
  const items = loadCart();
  return items.reduce((total, item) => total + item.quantity, 0);
};

// Optional helper: Get cart total price
export const getCartTotal = (): number => {
  const items = loadCart();
  return items.reduce((total, item) => {
    const price = item.discountedPrice || item.price;
    return total + (price * item.quantity);
  }, 0);
};