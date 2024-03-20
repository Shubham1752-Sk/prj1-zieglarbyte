import { createSlice } from "@reduxjs/toolkit";

const initialState ={
    id: "",
    name: "",
    courseName: "",
    dateOfCompletion: "",
}

const certificateSlice = createSlice({
    name: 'certificate',
    initialState: initialState,
    reducers: {
        setData: (state, action) =>{
            // console.log("In the setData function")
            // console.log(action.payload._id)
            state.id=action.payload._id;
            state.courseName=action.payload.courseName;
            state.name=action.payload.name;
            state.dateOfCompletion=action.payload.dateOfCompletion;
        }
    }
});

export const {
    setData 
} = certificateSlice.actions

export default certificateSlice.reducer;