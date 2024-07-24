// src/context/LoadingContext.js
import React, { createContext, useState, useContext } from 'react';

const LoadingContext = createContext();

export const useLoading = () => {
  return useContext(LoadingContext);
};

export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  const value = {
    loading,
    setLoading
  };

  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  );
};
