// src/contexts/ProductsContext.jsx
import React, { createContext, useState, useContext, useEffect } from "react";

// Create the context
const ProductsContext = createContext(undefined);

// Custom hook to use the products context
export const useProductsContext = () => {
  const context = useContext(ProductsContext);

  if (context === undefined) {
    throw new Error("useProductsContext must be used within a ProductsProvider");
  }

  return context;
};

// Provider component
export const ProductsProvider = ({ children }) => {
  // Products state
  const [allProducts, setAllProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(null);
  const [scrollPositions, setScrollPositions] = useState({});

  // Load saved state from localStorage on mount
  useEffect(() => {
    try {
      const savedProducts = localStorage.getItem('allProducts_products');
      const savedPage = localStorage.getItem('allProducts_currentPage');
      const savedTotalItems = localStorage.getItem('allProducts_totalItems');
      const savedScrollPositions = localStorage.getItem('allProducts_scrollPositions');

      if (savedProducts) {
        setAllProducts(JSON.parse(savedProducts));
      }

      if (savedPage) {
        setCurrentPage(parseInt(savedPage, 10));
      }

      if (savedTotalItems) {
        setTotalItems(parseInt(savedTotalItems, 10));
      }

      if (savedScrollPositions) {
        setScrollPositions(JSON.parse(savedScrollPositions));
      }
    } catch (error) {
      console.error("Error loading state from localStorage:", error);
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('allProducts_products', JSON.stringify(allProducts));
      localStorage.setItem('allProducts_currentPage', currentPage.toString());
      if (totalItems !== null) {
        localStorage.setItem('allProducts_totalItems', totalItems.toString());
      }
      localStorage.setItem('allProducts_scrollPositions', JSON.stringify(scrollPositions));
    } catch (error) {
      console.error("Error saving state to localStorage:", error);
    }
  }, [allProducts, currentPage, totalItems, scrollPositions]);

  // Save scroll position for a specific page/section
  const saveScrollPosition = (key, position) => {
    setScrollPositions(prev => ({
      ...prev,
      [key]: position
    }));
  };

  // Get scroll position for a specific page/section
  const getScrollPosition = (key) => {
    return scrollPositions[key] || 0;
  };

  // Clear all stored products
  const clearProductsState = () => {
    setAllProducts([]);
    setCurrentPage(1);
    setTotalItems(null);
    localStorage.removeItem('allProducts_products');
    localStorage.removeItem('allProducts_currentPage');
    localStorage.removeItem('allProducts_totalItems');
  };

  // Provide the context value
  const contextValue = {
    allProducts,
    setAllProducts,
    currentPage,
    setCurrentPage,
    totalItems,
    setTotalItems,
    saveScrollPosition,
    getScrollPosition,
    clearProductsState
  };

  return (
    <ProductsContext.Provider value={contextValue}>
      {children}
    </ProductsContext.Provider>
  );
};

export default ProductsContext;