import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  courseName: "",
  courseSectionData: [],
  courseEntireData: [],
  completedLectures: [],
  totalNoOfLectures: 0,
}

const viewCourseSlice = createSlice({
  name: "viewCourse",
  initialState,
  reducers: {
    setCourseName: (state, action) => {
      state.courseName = action.payload
    },
    setCourseSectionData: (state, action) => {
      state.courseSectionData = action.payload
    },
    setEntireCourseData: (state, action) => {
      state.courseEntireData = action.payload
    },
    setTotalNoOfLectures: (state, action) => {
      state.totalNoOfLectures = action.payload
    },
    setCompletedLectures: (state, action) => {
      state.completedLectures = action.payload
    },
    updateCompletedLectures: (state, action) => {
      state.completedLectures = [...state.completedLectures, action.payload]
    },
    resetViewCourse: (state) => {
      state.courseSectionData = []
      state.courseEntireData = []
      state.completedLectures = []
      state.courseName = ""
      state.totalNoOfLectures = 0
    },
  },
})

export const {
  setCourseName,
  setCourseSectionData,
  setEntireCourseData,
  setTotalNoOfLectures,
  setCompletedLectures,
  updateCompletedLectures,
  resetViewCourse
} = viewCourseSlice.actions

export default viewCourseSlice.reducer
