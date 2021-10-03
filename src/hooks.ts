import { useEffect } from "react";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

interface useDocumentClickProps {
  (fn: (event: any) => void): void;
}
export const useDocumentClick: useDocumentClickProps = (fn) => {
  useEffect(() => {
    function handleClick(event: Event) {
      fn(event);
    }

    // Bind the event listener
    document.addEventListener("mousedown", handleClick);

    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClick);
    };
  }, [fn]);
};
