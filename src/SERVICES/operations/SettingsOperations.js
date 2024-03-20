import { setUser } from "../../SLICES/AuthSlice"
import { apiConnector } from "../ApiConnector"
import { settingsEndpoints } from "../apis"
import { logout } from "./AuthOperations"
import { enqueueSnackbar, closeSnackbar } from "notistack"

const {
  UPDATE_DISPLAY_PICTURE_API,
  UPDATE_PROFILE_API,
  CHANGE_PASSWORD_API,
  DELETE_PROFILE_API,
} = settingsEndpoints

export function updateDisplayPicture(token, formData) {
  return async (dispatch) => {
    const snackId = enqueueSnackbar("Loading...",{variant: 'info'})
    try {
      const response = await apiConnector(
        "PUT",
        UPDATE_DISPLAY_PICTURE_API,
        formData,
        {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        }
      )
      console.log(
        "UPDATE_DISPLAY_PICTURE_API API RESPONSE............",
        response
      )

      if (!response.data.success) {
        throw new Error(response.data.message)
      }
      enqueueSnackbar("Display Picture Updated Successfully",{ variant: 'info'})
      dispatch(setUser(response.data.data))
    } catch (error) {
      console.log("UPDATE_DISPLAY_PICTURE_API API ERROR............", error)
      enqueueSnackbar("Could Not Update Display Picture",{variant: 'error'})
    }
    closeSnackbar(snackId)
  }
}

export function updateProfile(token, formData) {
  return async (dispatch) => {
    const snackId = enqueueSnackbar("Loading...",{variant: 'info'})
    try {
      const response = await apiConnector("PUT", UPDATE_PROFILE_API, formData, {
        Authorization: `Bearer ${token}`,
      })
      console.log("UPDATE_PROFILE_API API RESPONSE............", response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }
      const userImage = response.data.updatedUserDetails.image
        ? response.data.updatedUserDetails.image
        : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.updatedUserDetails.firstName} ${response.data.updatedUserDetails.lastName}`
      dispatch(
        setUser({ ...response.data.updatedUserDetails, image: userImage })
      )
      enqueueSnackbar("Profile Updated Successfully",{ variant: 'info'})
    } catch (error) {
      console.log("UPDATE_PROFILE_API API ERROR............", error)
      enqueueSnackbar("Could Not Update Profile",{variant: 'error'})
    }
    closeSnackbar(snackId)
  }
}

export async function changePassword(token, formData) {
  const snackId = enqueueSnackbar("Loading...",{variant: 'info'})
  try {
    const response = await apiConnector("POST", CHANGE_PASSWORD_API, formData, {
      Authorization: `Bearer ${token}`,
    })
    console.log("CHANGE_PASSWORD_API API RESPONSE............", response)

    if (!response.data.success) {
      throw new Error(response.data.message)
    }
    enqueueSnackbar("Password Changed Successfully",{ variant: 'info'})
  } catch (error) {
    console.log("CHANGE_PASSWORD_API API ERROR............", error)
    enqueueSnackbar(error.response.data.message,{variant: 'error'})
  }
  closeSnackbar(snackId)
}

export function deleteProfile(token, navigate) {
  return async (dispatch) => {
    const snackId = enqueueSnackbar("Loading...",{variant: 'info'})
    try {
      const response = await apiConnector("DELETE", DELETE_PROFILE_API, null, {
        Authorization: `Bearer ${token}`,
      })
      console.log("DELETE_PROFILE_API API RESPONSE............", response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }
      enqueueSnackbar("Profile Deleted Successfully",{ variant: 'info'})
      dispatch(logout(navigate))
    } catch (error) {
      console.log("DELETE_PROFILE_API API ERROR............", error)
      enqueueSnackbar("Could Not Delete Profile",{variant: 'error'})
    }
    closeSnackbar(snackId)
  }
}
