import { useRef, useCallback } from "react";

export const useHighlightOnFocus = () => {
  //Create a ref for an input of type Text
  const ref = useRef<HTMLInputElement>(null);
  return {
    ref,
    onFocus: useCallback(() => {
      if (ref.current) {
        ref.current.select(); //Select any text inside the text box
      }
    }, []),
  };
};
