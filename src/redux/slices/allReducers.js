import { combineReducers } from "@reduxjs/toolkit";
import hblSlice from "./hblSlice";

export const rootReducer = combineReducers({
	hbl: hblSlice
});
