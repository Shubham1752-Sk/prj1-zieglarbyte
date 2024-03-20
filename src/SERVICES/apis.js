const BASE_URL = `${process.env.REACT_APP_BASE_URL}api/v1`

console.log(BASE_URL)
export const authEndpoints = {
    SIGNUP_API: BASE_URL+ '/signup',
    LOGIN_API: BASE_URL+ '/login'
}

export const userEndpoints = {
    GET_USER_DETAILS_API: BASE_URL + "/getuserdetails",
    GET_USER_ENROLLED_COURSES_API: BASE_URL + "/getEnrolledCourses",
    GET_INSTRUCTOR_DATA_API: BASE_URL + "/instructorDashboard",
    GENERATE_CERTIFICATE: BASE_URL + '/generatecertificate',
    GET_CERTIFICATE_DETAILS: BASE_URL + '/getcertificatedetails'
}

export const categoryEndpoints = {
    CREATE_CATEGORY: BASE_URL + '/createcategory',
    GET_COURSE_CATEGORIES_API: BASE_URL + '/showAllCategories',
    CATALOG_PAGE_DATA_API: BASE_URL + "/getCategoryPageDetails",
}

export const courseEndpoints = {
    CREATE_COURSE_API: BASE_URL + "/addcourse",
    EDIT_COURSE_API: BASE_URL + "/editcourse",
    CREATE_SECTION_API: BASE_URL + "/addSection",
    CREATE_SUBSECTION_API: BASE_URL + "/addsubsection",
    UPDATE_SECTION_API: BASE_URL + "/updatesection",
    UPDATE_SUBSECTION_API: BASE_URL + "/updatesubsection",
    DELETE_SECTION_API: BASE_URL + "/deletesection",
    DELETE_SUBSECTION_API: BASE_URL + "/deletesubsection",
    DELETE_COURSE_API: BASE_URL + "/deletecourse",
    GET_ALL_INSTRUCTOR_COURSES_API: BASE_URL + "/getInstructorCourses",
    GET_ALL_COURSES_API: BASE_URL + '/getallcourses',
    GET_ALL_COURSES_API_HOMEPAGE: BASE_URL + '/getallcourseshome',
    COURSE_DETAILS_API: BASE_URL + '/getCourseDetails',
    CREATE_RATING_API: BASE_URL + '/createRating',
    GET_FULL_COURSE_DETAILS_AUTHENTICATED: BASE_URL + "/getFullCourseDetails",
    LECTURE_COMPLETION_API: BASE_URL + "/updateCourseProgress",
}

export const settingsEndpoints = {
    UPDATE_DISPLAY_PICTURE_API: BASE_URL + "/updateDisplayPicture",
    UPDATE_PROFILE_API: BASE_URL + "/updateProfile",
    CHANGE_PASSWORD_API: BASE_URL + "/changepassword",
    DELETE_PROFILE_API: BASE_URL + "/deleteProfile",
  }