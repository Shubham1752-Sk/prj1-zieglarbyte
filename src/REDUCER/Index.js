import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../SLICES/AuthSlice"
import courseReducer from "../SLICES/CourseSlice"

const rootReducer = combineReducers({
    auth: authReducer,
    course: courseReducer
})

export default rootReducer