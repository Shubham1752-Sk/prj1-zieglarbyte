import { apiConnector } from "../ApiConnector"
import { setLoading, setUser } from "../../SLICES/AuthSlice"
import { logout } from "./AuthOperations"
import { userEndpoints } from "../apis"
import { enqueueSnackbar, closeSnackbar } from "notistack"

const {
    GET_USER_DETAILS_API,
    GET_USER_ENROLLED_COURSES_API,
    GET_INSTRUCTOR_DATA_API
} = userEndpoints

export function getUserDetails(token, navigate) {
    return async (dispatch) => {
      const snackId = enqueueSnackbar("Loading...", {vairent: 'success'})
      dispatch(setLoading(true))
      try {
        const response = await apiConnector("GET", GET_USER_DETAILS_API , null, {
          Authorization: `Bearer ${token}`,
        })
        console.log("GET_USER_DETAILS API RESPONSE............", response)
  
        if (!response.data.success) {
          throw new Error(response.data.message)
        }
        const userImage = response.data.data.image
          ? response.data.data.image
          : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.data.firstName} ${response.data.data.lastName}`
        dispatch(setUser({ ...response.data.data, image: userImage }))
        dispatch(setLoading(false))
        closeSnackbar(snackId)
        navigate('/dashboard/my-profile')
      } catch (error) {
        dispatch(logout(navigate))
        console.log("GET_USER_DETAILS API ERROR............", error)
        enqueueSnackbar("Could Not Get User Details", {vairent:'error'})
      }
      finally{
        dispatch(setLoading(false))
        closeSnackbar(snackId)
      }

    }
  }

  export async function getUserEnrolledCourses(token) {
    let snackId = enqueueSnackbar("Loading...",{vairent:'info'})
    let result = []
    try {
      const response = await apiConnector(
        "GET",
        GET_USER_ENROLLED_COURSES_API,
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      )
      // console.log(
      //   "GET_USER_ENROLLED_COURSES_API API RESPONSE............",
      //   response
      // )
  
      if (!response.data.success) {
        throw new Error(response.data.message)
      }
      result = response.data.data
    } catch (error) {
      console.log("GET_USER_ENROLLED_COURSES_API API ERROR............", error)
      enqueueSnackbar("Could Not Get Enrolled Courses",{variant:'error'})
    }
    closeSnackbar(snackId)
    return result
  }
  
  export async function getInstructorData(token) {
    let snackId = enqueueSnackbar("Loading...",{vairent:'info'})
    let result = []
    try {
      const response = await apiConnector("GET", GET_INSTRUCTOR_DATA_API, null, {
        Authorization: `Bearer ${token}`,
      })
      console.log("GET_INSTRUCTOR_DATA_API API RESPONSE............", response)
      result = response?.data?.courses
    } catch (error) {
      console.log("GET_INSTRUCTOR_DATA_API API ERROR............", error)
      enqueueSnackbar("Could Not Get Instructor Data",{variant:'error'})
    }
    closeSnackbar(snackId)
    return result
  }
  