// src/redux/hooks.ts
import { useSelector, TypedUseSelectorHook } from "react-redux";
import type { RootState } from "@/redux/store"; // adjust path if needed

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;