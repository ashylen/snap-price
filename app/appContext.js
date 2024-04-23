import { createContext, useState } from "react";

export const AppContext = createContext(null);

export const ContextProvider = (props) => {
  const [images, setImages] = useState([]);

  return (
    <AppContext.Provider value={{ images, setImages }}>
      {props.children}
    </AppContext.Provider>
  );
};
