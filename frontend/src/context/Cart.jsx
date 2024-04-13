import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cartGlobal, setCartGlobal] = useState({
    backendCart: [],
    frontendCart: [],
  });

  useEffect(() => {
    let storedData = localStorage.getItem("Globalcart");

    if (storedData) {
      let parsedData = JSON.parse(storedData);

      console.log(parsedData);

      setCartGlobal((prev) => {
        return {
          ...prev,frontendCart:parsedData.frontendCart,
            backendCart:parsedData.backendCart
        };
      });
    }
  }, []);

  return (
    <CartContext.Provider value={[cartGlobal, setCartGlobal]}>
      {children}
    </CartContext.Provider>
  );
};

const useCart = () => {
  return useContext(CartContext);
};

export { useCart, CartProvider };
