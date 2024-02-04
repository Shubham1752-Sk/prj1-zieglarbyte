import { authEndpoints } from "../apis"
import { apiConnector } from "../ApiConnector";
import { enqueueSnackbar, closeSnackbar } from "notistack";

const {
    SIGNUP_API
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
    
    let result = null
    let snackId = enqueueSnackbar("signing up",{variant:'info', persist:'true'})
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
            result = response?.data?.data
        } catch (error) {
            console.log('Error in Signup API ..... ', error)
            enqueueSnackbar(error.response.data.message, { variant: "error" });
        }
        finally{
            closeSnackbar(snackId)
        }

        return result
    }
  }

