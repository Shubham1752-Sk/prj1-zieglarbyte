import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./REDUCER/index";

const store = configureStore({
    reducer: rootReducer
})

export default store