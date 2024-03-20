import { authEndpoints } from "../apis"
import { apiConnector } from "../ApiConnector";
import { enqueueSnackbar, closeSnackbar } from "notistack";
import { setToken, setUser, setLoading } from "../../SLICES/AuthSlice"

const {
  SIGNUP_API,
  LOGIN_API
} = authEndpoints

export function signup({
  accountType,
  firstName,
  lastName,
  email,
  password,
  confirmPassword,
  contactNumber,

}) {
  return async (dispatch) => {
    dispatch(setLoading(true))
    let snackId = enqueueSnackbar("Signing Up...", { variant: 'info', persist: 'true' })
    try {
      const response = await apiConnector("POST", SIGNUP_API, {
        accountType,
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        contactNumber,
      })

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      enqueueSnackbar("Signup Successfull!!", { variant: "success" })

    } catch (error) {
      console.log('Error in Signup API ..... ', error)
      enqueueSnackbar(error.response.data.message, { variant: "error" });
    }
    finally {
      closeSnackbar(snackId)
      dispatch(setLoading(false))
    }
  }
}

export function login(email, password, navigate) {
  return async (dispatch) => {
    const snackId = enqueueSnackbar("Loging In...",{variant:'info',persist: true});
    dispatch(setLoading(true))
    try {
      const response = await apiConnector("POST", LOGIN_API, {
        email,
        password,
      })

      console.log("LOGIN API RESPONSE............", response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }

      enqueueSnackbar("Login Successful",{variant:'success'})
      const userImage = response.data?.user?.image
        ? response.data.user.image
        : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.user.firstName} ${response.data.user.lastName}`
      dispatch(setUser({ ...response.data.user, image: userImage }))
      localStorage.setItem("token", JSON.stringify(response.data.token))
      dispatch(setToken(response.data.token))
      navigate("/dashboard/my-profile")
    } catch (error) {
      console.log("LOGIN API ERROR............", error)
      enqueueSnackbar("Login Failed",{variant:'error'})
    }
    dispatch(setLoading(false))
    closeSnackbar(snackId)
  }
}

export function logout(navigate) {
  return async (dispatch) => {
    dispatch(setToken(null))
    dispatch(setUser(null))
    localStorage.setItem("token", null)
    localStorage.setItem("token", null)
    enqueueSnackbar("Logged out !!", { variant: 'success' })
    navigate("/")
  }
}