import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../SLICES/AuthSlice"
import courseReducer from "../SLICES/CourseSlice"
import cartReducer  from '../SLICES/CartSlice'
import viewCourseReducer from "../SLICES/viewCourseSlice"
import certificateReducer from "../SLICES/certificate"

const rootReducer = combineReducers({
    auth: authReducer,
    course: courseReducer,
    cart: cartReducer,
    viewCourse: viewCourseReducer,
    certificate: certificateReducer
})

export default rootReducer