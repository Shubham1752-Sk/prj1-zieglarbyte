import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./REDUCER";

const store = configureStore({
    reducer: rootReducer
})

export default store