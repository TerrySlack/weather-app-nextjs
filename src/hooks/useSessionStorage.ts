import { useCallback, useEffect } from "react";

export const useSessionStorage = <S, T>(setupKey: string, initialValue: T) => {
  // Get data from sessionStorage
  const get = useCallback((key: string): T | null => {
    if (typeof window === "undefined") return null; // Handle SSR gracefully
    const storedData = sessionStorage.getItem(key);
    return storedData ? (JSON.parse(storedData) as T) : null;
  }, []);

  // Set data into sessionStorage
  const set = (key: string, newValue: S) => {
    const existingData = get(key); // Get the current value from sessionStorage

    if (!existingData) {
      //create an entry is session storage
      sessionStorage.setItem(key, JSON.stringify(initialValue));
      return;
    }

    // Check if the existing data is an array
    if (Array.isArray(existingData)) {
      const updatedArray = [...existingData, newValue]; // Add new value to the array
      sessionStorage.setItem(key, JSON.stringify(updatedArray));
    } else if (existingData && typeof existingData === "object") {
      // If it's an object, add a new entry with a key (you can modify the key if needed)
      const updatedObject = { ...existingData, ...newValue };
      sessionStorage.setItem(key, JSON.stringify(updatedObject));
    } else {
      // For any other type (initial set)
      sessionStorage.setItem(key, JSON.stringify(newValue));
    }
  };

  useEffect(() => {
    const existingData = get(setupKey);
    if (existingData === null) {
      sessionStorage.setItem(setupKey, JSON.stringify(initialValue));
    }
  }, [setupKey, initialValue, get]);

  return { get, set };
};
