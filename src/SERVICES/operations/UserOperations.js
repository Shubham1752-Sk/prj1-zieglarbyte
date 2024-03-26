import { apiConnector } from "../ApiConnector"
import { setLoading, setUser } from "../../SLICES/AuthSlice"
import { logout } from "./AuthOperations"
import { userEndpoints } from "../apis"
import { enqueueSnackbar, closeSnackbar } from "notistack"
import { setData } from "../../SLICES/certificate"

const {
    GET_USER_DETAILS_API,
    GET_USER_ENROLLED_COURSES_API,
    GENERATE_CERTIFICATE,
    GET_CERTIFICATE_DETAILS
} = userEndpoints

export function getUserDetails(token, navigate) {
    return async (dispatch) => {
      const snackId = enqueueSnackbar("Loading...", {vairent: 'info'})
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
  
  export function generateCertificateData(name, courseName, token) {
    
    return async (dispatch)=>{
      let snackId = enqueueSnackbar("Processing your request....", {variant:'info'})
      try {
        
        const response = await apiConnector('POST',GENERATE_CERTIFICATE,{
          name,
          courseName
        },{
          Authorization: `Bearer ${token}`
        })
        if(!response.data.success){
          throw new Error(response.data.message)
        }
        console.log('hi!!')
        console.log('GENERATE CERTIFICATE RESPONSE..... ',response)
        dispatch(setData(response?.data?.certificateData))
        // result = response.data.certificateData
      } catch (error) {
        console.log("GENERATE_CERTIFICATE_DATA API ERROR............", error)
        enqueueSnackbar("Could Not Generate Data",{variant:'error'})
      }
      closeSnackbar(snackId)
    
    }
    
  }

  export async function getCertificateDetails(id){
    let result = null
    const snackId = enqueueSnackbar("Fetching Details",{variant:'info',persist:true})
    try {
      const response = await apiConnector('GET',`${GET_CERTIFICATE_DETAILS}/${id}`)

      if(!response.data.success){
        throw new Error(response.data.error)
      }
      console.log('GET CERTIFICATE DATA DETAILS.....', response)
      result = response?.data?.certificateData
    } catch (error) {
      console.log("GET_CERTIFICATE_DETAILS API ERROR............", error)
      enqueueSnackbar("Could Not Get Certificate Data",{variant:'error'}) 
      
    }
    closeSnackbar(snackId)
    return result
  }