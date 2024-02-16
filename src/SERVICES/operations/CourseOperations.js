import { apiConnector } from "../ApiConnector";
import { courseEndpoints } from "../apis";
import { enqueueSnackbar, closeSnackbar } from "notistack";

const {
    CREATE_COURSE_API,
    EDIT_COURSE_API,
    CREATE_SECTION_API,
    CREATE_SUBSECTION_API,
    UPDATE_SECTION_API,
    UPDATE_SUBSECTION_API,
    DELETE_SECTION_API,
    DELETE_SUBSECTION_API,
    DELETE_COURSE_API,
    GET_ALL_INSTRUCTOR_COURSES_API,
    COURSE_DETAILS_API,
    GET_FULL_COURSE_DETAILS_AUTHENTICATED,
    CREATE_RATING_API,
    LECTURE_COMPLETION_API
} = courseEndpoints

export const addCourseDetails = async (data, token) => {
    let result = null
    const snackId = enqueueSnackbar("Creating Course..",{persist:'true',variant:'info'})
    
    try {
      const response = await apiConnector("POST", CREATE_COURSE_API, data, {
        Authorization: `Bearer ${token}`,
      })
      console.log("CREATE COURSE API RESPONSE............", response)
      if (!response?.data?.success) {
        throw new Error("Could Not Add Course Details")
      }
      enqueueSnackbar("Course Details Added Successfully",{variant:'success'})
      result = response?.data?.data
    } catch (error) {
      console.log("CREATE COURSE API ERROR............", error)
      enqueueSnackbar(error.message,{ variant:"error" });
    }
    closeSnackbar(snackId)
    return result
  }

// edit the course details
export const editCourseDetails = async(data) =>{
  let result = null
  console.log('token is: ',data)
  const snackId = enqueueSnackbar("Loading...",{persist:'true',variant:'info'})
  try{
    const response = await apiConnector("POST",EDIT_COURSE_API,data);
    console.log("EDIT COURSE API RESPONSE............", response)
    if (!response?.data?.success) {
      throw new Error("Could Not Update Course Details")
    }
    enqueueSnackbar("Course Details Updated Successfully",{variant:'success'})
    result = response?.data?.data
  } catch (error) {
    console.log("EDIT COURSE API ERROR............", error)
    enqueueSnackbar(error.message,{variant:'error'})
  }
  closeSnackbar(snackId)
  return result
}

// create a section
export const createSection = async (data, token) => {
  let result = null
  const snackId = enqueueSnackbar("Loading...",{persist:'true',variant:'info'})
  try {
    const response = await apiConnector("POST", CREATE_SECTION_API, data, {
      Authorization: `Bearer ${token}`,
    })
    console.log("CREATE SECTION API RESPONSE............", response)
    if (!response?.data?.success) {
      throw new Error("Could Not Create Section")
    }
    enqueueSnackbar("Course Section Created",{variant:'success'})
    result = response?.data?.updatedCourse
  } catch (error) {
    console.log("CREATE SECTION API ERROR............", error)
    enqueueSnackbar(error.message,{variant:'error'})
  }
  closeSnackbar(snackId)
  return result
}

// create a subsection
export const createSubSection = async (data, token) => {
  let result = null
  const snackId = enqueueSnackbar("Loading...",{persist:'true',variant:'info'})
  try {
    const response = await apiConnector("POST", CREATE_SUBSECTION_API, data, {
      Authorization: `Bearer ${token}`,
    })
    console.log("CREATE SUB-SECTION API RESPONSE............", response)
    if (!response?.data?.success) {
      throw new Error("Could Not Add Lecture")
    }
    console.log("Lecture Added")
    result = response?.data?.data
    enqueueSnackbar('Lecture Added  Successfully!', { variant: 'success' });
  } catch (error) {
    console.log("CREATE SUB-SECTION API ERROR............", error)
    enqueueSnackbar(error.message,{variant:'error'})
  }
  closeSnackbar(snackId)
  return result
}

// update a section
export const updateSection = async (data, token) => {
  let result = null
  const snackId = enqueueSnackbar("Loading...",{persist:'true',variant:'info'})
  try {
    const response = await apiConnector("POST", UPDATE_SECTION_API, data, {
      Authorization: `Bearer ${token}`,
    })
    console.log("UPDATE SECTION API RESPONSE............", response)
    if (!response?.data?.success) {
      throw new Error("Could Not Update Section")
    }
    enqueueSnackbar("Course Section Updated",{variant:'success'})
    result = response?.data?.data
  } catch (error) {
    console.log("UPDATE SECTION API ERROR............", error)
    enqueueSnackbar(error.message,{variant:'error'})
  }
  closeSnackbar(snackId)
  return result
}

// update a subsection
export const updateSubSection = async (data, token) => {
  let result = null
  const snackId = enqueueSnackbar("Loading...",{persist:'true',variant:'info'})
  console.log(data)
  try {
    const response = await apiConnector("POST", UPDATE_SUBSECTION_API, data, {
      Authorization: `Bearer ${token}`,
    })
    console.log("UPDATE SUB-SECTION API RESPONSE............", response)
    if (!response?.data?.success) {
      throw new Error("Could Not Update Lecture")
    }
    enqueueSnackbar("Lecture Updated",{variant:'success'})
    result = response?.data?.data
  } catch (error) {
    console.log("UPDATE SUB-SECTION API ERROR............", error)
    enqueueSnackbar(error.message,{variant:'error'})
  }
  closeSnackbar(snackId)
  return result
}

// delete a section
export const deleteSection = async (data, token) => {
  let result = null
  const snackId = enqueueSnackbar("Loading...",{persist:'true',variant:'info'})
  try {
    const response = await apiConnector("POST", DELETE_SECTION_API, data, {
      Authorization: `Bearer ${token}`,
    })
    console.log("DELETE SECTION API RESPONSE............", response)
    if (!response?.data?.success) {
      throw new Error("Could Not Delete Section")
    }
    enqueueSnackbar("Course Section Deleted",{variant:'success'})
    result = response?.data?.data
  } catch (error) {
    console.log("DELETE SECTION API ERROR............", error)
    enqueueSnackbar(error.message,{variant:'error'})
  }
  closeSnackbar(snackId)
  return result
}
// delete a subsection
export const deleteSubSection = async (data, token) => {
  let result = null
  const snackId = enqueueSnackbar("Loading...",{persist:'true',variant:'info'})
  try {
    const response = await apiConnector("POST", DELETE_SUBSECTION_API, data, {
      Authorization: `Bearer ${token}`,
    })
    console.log("DELETE SUB-SECTION API RESPONSE............", response)
    if (!response?.data?.success) {
      throw new Error("Could Not Delete Lecture")
    }
    enqueueSnackbar("Lecture Deleted",{variant:'success'})
    result = response?.data?.data
  } catch (error) {
    console.log("DELETE SUB-SECTION API ERROR............", error)
    enqueueSnackbar(error.message,{variant:'error'})
  }
  closeSnackbar(snackId)
  return result
}

// delete a course
export const deleteCourse = async (data, token) => {
  const snackId = enqueueSnackbar("Loading...",{persist:'true',variant:'info'})
  try {
    const response = await apiConnector("DELETE", DELETE_COURSE_API, data, {
      Authorization: `Bearer ${token}`,
    })
    console.log("DELETE COURSE API RESPONSE............", response)
    if (!response?.data?.success) {
      throw new Error("Could Not Delete Course")
    }
    enqueueSnackbar("Course Deleted",{variant:'success'})
  } catch (error) {
    console.log("DELETE COURSE API ERROR............", error)
    enqueueSnackbar(error.message,{variant:'error'})
  }
  closeSnackbar(snackId)
}

export const fetchInstructorCourses = async (token) => {
  let result = []
  const snackId = enqueueSnackbar("Loading...",{persist:'true',variant:'info'})
  try {
    const response = await apiConnector(
      "GET",
      GET_ALL_INSTRUCTOR_COURSES_API,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    )
    console.log("INSTRUCTOR COURSES API RESPONSE............", response)
    if (!response?.data?.success) {
      throw new Error("Could Not Fetch Instructor Courses")
    }
    result = response?.data?.data
  } catch (error) {
    console.log("INSTRUCTOR COURSES API ERROR............", error)
    // toast.error(error.message)
  }
  closeSnackbar(snackId)
  return result
}

export const fetchCourseDetails = async (courseId) => {
  const snackId = enqueueSnackbar("Loading...",{persist:'true',variant:'info'})
  //   dispatch(setLoading(true));
  let result = null
  try {
    const response = await apiConnector("POST", COURSE_DETAILS_API, {
      courseId,
    })
    console.log("COURSE_DETAILS_API API RESPONSE............", response)

    if (!response.data.success) {
      throw new Error(response.data.message)
    }
    result = response.data
  } catch (error) {
    console.log("COURSE_DETAILS_API API ERROR............", error)
    result = error.response.data
    // toast.error(error.response.data.message);
  }
  closeSnackbar(snackId)
  //   dispatch(setLoading(false));
  return result
}

export const getFullDetailsOfCourse = async (courseId, token) => {
  const snackId = enqueueSnackbar("Loading...",{persist:'true',variant:'info'})
  //   dispatch(setLoading(true));
  let result = null
  try {
    const response = await apiConnector(
      "POST",
      GET_FULL_COURSE_DETAILS_AUTHENTICATED,
      {
        courseId,
      },
      {
        Authorization: `Bearer ${token}`,
      }
    )
    console.log("COURSE_FULL_DETAILS_API API RESPONSE............", response)

    if (!response.data.success) {
      throw new Error(response.data.message)
    }
    result = response?.data?.data
  } catch (error) {
    console.log("COURSE_FULL_DETAILS_API API ERROR............", error)
    result = error.response.data
    // toast.error(error.response.data.message);
  }
  closeSnackbar(snackId)
  //   dispatch(setLoading(false));
  return result
}

// mark a lecture as complete
export const markLectureAsComplete = async (data, token) => {
  let result = null
  console.log("mark complete data", data)
  const snackId = enqueueSnackbar("Loading...",{persist:'true',variant:'info'})
  try {
    const response = await apiConnector("POST", LECTURE_COMPLETION_API, data, {
      Authorization: `Bearer ${token}`,
    })
    console.log(
      "MARK_LECTURE_AS_COMPLETE_API API RESPONSE............",
      response
    )

    if (!response.data.message) {
      throw new Error(response.data.error)
    }
    // toast.success("Lecture Completed")
    result = true
  } catch (error) {
    console.log("MARK_LECTURE_AS_COMPLETE_API API ERROR............", error)
    // toast.error(error.message)
    result = false
  }
  closeSnackbar(snackId)
  return result
}

// create a rating for course
export const createRating = async (data, token) => {
  const snackId = enqueueSnackbar("Loading...",{persist:'true',variant:'info'})
  let success = false
  try {
    const response = await apiConnector("POST", CREATE_RATING_API, data, {
      Authorization: `Bearer ${token}`,
    })
    console.log("CREATE RATING API RESPONSE............", response)
    if (!response?.data?.success) {
      throw new Error("Could Not Create Rating")
    }
    // toast.success("Rating Created")
    success = true
  } catch (error) {
    success = false
    console.log("CREATE RATING API ERROR............", error)
    // toast.error(error.message)
  }
  closeSnackbar(snackId)
  return success
}