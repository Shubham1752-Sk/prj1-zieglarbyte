const BASE_URL = `${process.env.REACT_APP_BASE_URL}api/v1`

export const authEndpoints = {
    SIGNUP_API: BASE_URL+ '/signup',
    LOGIN_API: BASE_URL+ '/login'
}

export const userEndpoints = {
    GET_USER_DETAILS_API: BASE_URL + "/getuserdetails",
    GET_USER_ENROLLED_COURSES_API: BASE_URL + "/getEnrolledCourses",
    GET_INSTRUCTOR_DATA_API: BASE_URL + "/instructorDashboard",
}