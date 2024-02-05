import { combineReducers} from "@reduxjs/toolkit";
import authReducer from "../SLICES/AuthSlice"

const rootReducer = () =>{
    return combineReducers({
        auth: authReducer,
    })
}

export default rootReducer